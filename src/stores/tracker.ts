import { useIntervalFn, useLocalStorage } from '@vueuse/core'
import {
  eachDayOfInterval,
  format,
  startOfDay,
  startOfISOWeek,
  subDays,
  subWeeks,
} from 'date-fns'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  AppState,
  ComboLogEntry,
  CountDatum,
  DateDatum,
  EventMonth,
  Task,
  TimeDatum,
} from '../types/tracker'
import { useI18n } from '../composables/useI18n'
import { elapsedSeconds, id } from '../utils/time'

const STORAGE_KEY = 'chapar:tracker:v1'
const MAX_RECENT = 6

function defaultState(): AppState {
  return {
    version: 1,
    tasks: [],
    activeId: null,
    activeStartTs: null,
    recentIds: [],
    previousActiveId: null,
    events: [],
    combo: null,
    comboLog: [],
    workSessions: [],
  }
}

function normalizeState(value: AppState): AppState {
  const defaults = defaultState()
  const tasks = Array.isArray(value?.tasks) ? value.tasks : []
  const taskIds = new Set(tasks.map((task) => task.id))
  const activeId = value?.activeId && taskIds.has(value.activeId) ? value.activeId : null
  const comboIds = Array.isArray(value?.combo?.taskIds)
    ? value.combo.taskIds.filter((taskId) => taskIds.has(taskId))
    : []

  return {
    ...defaults,
    ...value,
    version: 1,
    tasks,
    activeId: comboIds.length >= 2 ? null : activeId,
    activeStartTs: comboIds.length >= 2 || !activeId ? null : value.activeStartTs,
    recentIds: Array.isArray(value?.recentIds)
      ? [...new Set(value.recentIds)].filter((taskId) => taskIds.has(taskId)).slice(0, MAX_RECENT)
      : [],
    previousActiveId:
      value?.previousActiveId && taskIds.has(value.previousActiveId)
        ? value.previousActiveId
        : null,
    events: Array.isArray(value?.events) ? value.events : [],
    combo: comboIds.length >= 2 && value.combo ? { ...value.combo, taskIds: comboIds } : null,
    comboLog: Array.isArray(value?.comboLog) ? value.comboLog : [],
    workSessions: Array.isArray(value?.workSessions) ? value.workSessions : [],
  }
}

function evenSplit(totalSeconds: number, taskIds: string[]): Record<string, number> {
  const result: Record<string, number> = {}
  const base = Math.floor(totalSeconds / taskIds.length)
  let remainder = totalSeconds % taskIds.length

  for (const taskId of taskIds) {
    result[taskId] = base + (remainder > 0 ? 1 : 0)
    remainder -= remainder > 0 ? 1 : 0
  }

  return result
}

export const useTrackerStore = defineStore('tracker', () => {
  const { formatDate } = useI18n()
  const persisted = useLocalStorage<AppState>(STORAGE_KEY, defaultState(), {
    mergeDefaults: true,
  })
  persisted.value = normalizeState(persisted.value)

  const now = ref(Date.now())
  useIntervalFn(() => {
    now.value = Date.now()
  }, 1000)

  const tasks = computed(() => persisted.value.tasks)
  const events = computed(() => persisted.value.events)
  const combo = computed(() => persisted.value.combo)
  const comboLog = computed(() =>
    [...persisted.value.comboLog].sort((a, b) => b.createdAt - a.createdAt),
  )
  const recentIds = computed(() => persisted.value.recentIds)
  const activeId = computed(() => persisted.value.activeId)
  const activeTask = computed(
    () => tasks.value.find((task) => task.id === persisted.value.activeId) ?? null,
  )
  const activeElapsed = computed(() =>
    persisted.value.activeId
      ? elapsedSeconds(persisted.value.activeStartTs, now.value)
      : 0,
  )
  const comboElapsed = computed(() =>
    persisted.value.combo ? elapsedSeconds(persisted.value.combo.startTs, now.value) : 0,
  )
  const comboTasks = computed(() =>
    persisted.value.combo
      ? persisted.value.combo.taskIds
          .map((taskId) => tasks.value.find((task) => task.id === taskId))
          .filter((task): task is Task => Boolean(task))
      : [],
  )

  const displaySecondsByTask = computed<Record<string, number>>(() => {
    const totals = Object.fromEntries(tasks.value.map((task) => [task.id, task.totalSeconds]))
    if (persisted.value.activeId) {
      totals[persisted.value.activeId] =
        (totals[persisted.value.activeId] ?? 0) + activeElapsed.value
    }
    if (persisted.value.combo) {
      const liveSplit = evenSplit(comboElapsed.value, persisted.value.combo.taskIds)
      for (const [taskId, seconds] of Object.entries(liveSplit)) {
        totals[taskId] = (totals[taskId] ?? 0) + seconds
      }
    }
    return totals
  })

  const timePerTask = computed<TimeDatum[]>(() =>
    tasks.value
      .map((task) => ({
        id: task.id,
        label: task.name,
        seconds: displaySecondsByTask.value[task.id] ?? 0,
      }))
      .filter((datum) => datum.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds),
  )

  function buildDailySeries(dayCount: number): DateDatum[] {
    const end = startOfDay(new Date(now.value))
    const start = subDays(end, dayCount - 1)
    const totals = new Map(
      eachDayOfInterval({ start, end }).map((date) => [format(date, 'yyyy-MM-dd'), 0]),
    )

    for (const session of persisted.value.workSessions) {
      const key = format(new Date(session.endTs), 'yyyy-MM-dd')
      if (totals.has(key)) totals.set(key, (totals.get(key) ?? 0) + session.totalSeconds)
    }

    const todayKey = format(end, 'yyyy-MM-dd')
    totals.set(
      todayKey,
      (totals.get(todayKey) ?? 0) + activeElapsed.value + comboElapsed.value,
    )

    return [...totals].map(([date, seconds]) => ({
      date,
      label: formatDate(new Date(`${date}T12:00:00`), { month: 'short', day: 'numeric' }),
      seconds,
    }))
  }

  const timePerDay = computed(() => buildDailySeries(14))
  const activityDays = computed(() => buildDailySeries(364))

  const blockersPerWeek = computed<CountDatum[]>(() => {
    const currentWeek = startOfISOWeek(new Date(now.value))
    const weeks = Array.from({ length: 12 }, (_, index) =>
      subWeeks(currentWeek, 11 - index),
    )
    const counts = new Map(weeks.map((date) => [format(date, 'yyyy-MM-dd'), 0]))

    for (const event of events.value) {
      const key = format(startOfISOWeek(new Date(event.timestamp)), 'yyyy-MM-dd')
      if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
    }

    return [...counts].map(([date, count]) => ({
      date,
      label: formatDate(new Date(`${date}T12:00:00`), { month: 'short', day: 'numeric' }),
      count,
    }))
  })

  const eventsByMonth = computed<EventMonth[]>(() => {
    const groups = new Map<string, EventMonth>()
    const sortedEvents = [...events.value].sort((a, b) => b.timestamp - a.timestamp)
    for (const event of sortedEvents) {
      const date = new Date(event.timestamp)
      const key = format(date, 'yyyy-MM')
      const group = groups.get(key) ?? {
        key,
        label: formatDate(date, { month: 'long', year: 'numeric' }),
        events: [],
      }
      group.events.push(event)
      groups.set(key, group)
    }
    return [...groups.values()]
  })

  function touchRecent(taskId: string) {
    persisted.value.recentIds = [
      taskId,
      ...persisted.value.recentIds.filter((recentId) => recentId !== taskId),
    ].slice(0, MAX_RECENT)
  }

  function bankActive(at = Date.now()) {
    const taskId = persisted.value.activeId
    const startTs = persisted.value.activeStartTs
    if (!taskId || startTs === null) {
      persisted.value.activeId = null
      persisted.value.activeStartTs = null
      return 0
    }

    const seconds = elapsedSeconds(startTs, at)
    const task = persisted.value.tasks.find((candidate) => candidate.id === taskId)
    if (task && seconds > 0) {
      task.totalSeconds += seconds
      persisted.value.workSessions.push({
        id: id('session'),
        kind: 'single',
        taskIds: [taskId],
        startTs,
        endTs: at,
        totalSeconds: seconds,
      })
    }

    persisted.value.activeId = null
    persisted.value.activeStartTs = null
    return seconds
  }

  function stopCombo(at = Date.now()): ComboLogEntry | null {
    const running = persisted.value.combo
    if (!running) return null

    const totalSeconds = elapsedSeconds(running.startTs, at)
    const taskIds = [...running.taskIds]
    const names = Object.fromEntries(
      taskIds.map((taskId) => [
        taskId,
        persisted.value.tasks.find((task) => task.id === taskId)?.name ?? 'Deleted task',
      ]),
    )
    const splitSeconds = evenSplit(totalSeconds, taskIds)
    persisted.value.combo = null

    if (totalSeconds <= 0) return null

    for (const task of persisted.value.tasks) {
      task.totalSeconds += splitSeconds[task.id] ?? 0
    }

    const entry: ComboLogEntry = {
      id: id('combo'),
      taskIds,
      names,
      totalSeconds,
      splitSeconds,
      createdAt: at,
    }
    persisted.value.comboLog.push(entry)
    persisted.value.workSessions.push({
      id: id('session'),
      kind: 'combo',
      taskIds,
      startTs: running.startTs,
      endTs: at,
      totalSeconds,
    })
    return entry
  }

  function switchTask(taskId: string, at = Date.now()) {
    if (!persisted.value.tasks.some((task) => task.id === taskId)) return
    if (persisted.value.activeId === taskId && !persisted.value.combo) return

    const outgoingId = persisted.value.activeId
    if (persisted.value.combo) stopCombo(at)
    if (outgoingId) {
      bankActive(at)
      if (outgoingId !== taskId) persisted.value.previousActiveId = outgoingId
    } else {
      const lastDifferent = persisted.value.recentIds.find((recentId) => recentId !== taskId)
      if (lastDifferent) persisted.value.previousActiveId = lastDifferent
    }

    persisted.value.activeId = taskId
    persisted.value.activeStartTs = at
    touchRecent(taskId)
  }

  function createTask(name: string, at = Date.now()): Task | null {
    const trimmedName = name.trim()
    if (!trimmedName) return null
    const task: Task = {
      id: id('task'),
      name: trimmedName,
      totalSeconds: 0,
      createdAt: at,
    }
    persisted.value.tasks.push(task)
    switchTask(task.id, at)
    return task
  }

  function pause(at = Date.now()) {
    if (persisted.value.combo) return stopCombo(at)
    bankActive(at)
    return null
  }

  function pingPong(at = Date.now()) {
    const target = persisted.value.previousActiveId
    if (persisted.value.activeId && target && target !== persisted.value.activeId) {
      switchTask(target, at)
    }
  }

  function switchToRecent(index: number, at = Date.now()) {
    const taskId = persisted.value.recentIds[index]
    if (taskId) switchTask(taskId, at)
  }

  function addEvent(text: string, at = Date.now()) {
    const trimmedText = text.trim()
    if (!trimmedText) return null
    const comboName = comboTasks.value.map((task) => task.name).join(' + ')
    const event = {
      id: id('event'),
      text: trimmedText,
      timestamp: at,
      taskName: activeTask.value?.name ?? (comboName || null),
    }
    persisted.value.events.push(event)
    return event
  }

  function deleteEvent(eventId: string) {
    persisted.value.events = persisted.value.events.filter((event) => event.id !== eventId)
  }

  function startCombo(taskIds: string[], at = Date.now()): boolean {
    const validIds = [...new Set(taskIds)].filter((taskId) =>
      persisted.value.tasks.some((task) => task.id === taskId),
    )
    if (validIds.length < 2) return false

    if (persisted.value.combo) stopCombo(at)
    if (persisted.value.activeId) bankActive(at)
    persisted.value.combo = { taskIds: validIds, startTs: at }
    for (const taskId of [...validIds].reverse()) touchRecent(taskId)
    return true
  }

  function editComboSplit(entryId: string, taskId: string, requestedSeconds: number) {
    const entry = persisted.value.comboLog.find((candidate) => candidate.id === entryId)
    const task = persisted.value.tasks.find((candidate) => candidate.id === taskId)
    if (!entry || !task || entry.taskIds.length < 2) return false

    const remainderId = entry.taskIds.at(-1)
    if (!remainderId || taskId === remainderId) return false

    const fixedSeconds = entry.taskIds
      .filter((candidateId) => candidateId !== taskId && candidateId !== remainderId)
      .reduce((sum, candidateId) => sum + (entry.splitSeconds[candidateId] ?? 0), 0)
    const availableSeconds = Math.max(0, entry.totalSeconds - fixedSeconds)
    const nextSeconds = Math.min(
      availableSeconds,
      Math.max(0, Math.round(requestedSeconds)),
    )
    const nextRemainder = availableSeconds - nextSeconds
    const oldSeconds = entry.splitSeconds[taskId] ?? 0
    const oldRemainder = entry.splitSeconds[remainderId] ?? 0

    entry.splitSeconds[taskId] = nextSeconds
    entry.splitSeconds[remainderId] = nextRemainder
    task.totalSeconds = Math.max(0, task.totalSeconds + nextSeconds - oldSeconds)
    const remainderTask = persisted.value.tasks.find((candidate) => candidate.id === remainderId)
    if (remainderTask) {
      remainderTask.totalSeconds = Math.max(
        0,
        remainderTask.totalSeconds + nextRemainder - oldRemainder,
      )
    }
    return true
  }

  function deleteTask(taskId: string, at = Date.now()) {
    if (persisted.value.combo?.taskIds.includes(taskId)) stopCombo(at)
    if (persisted.value.activeId === taskId) bankActive(at)
    persisted.value.tasks = persisted.value.tasks.filter((task) => task.id !== taskId)
    persisted.value.recentIds = persisted.value.recentIds.filter(
      (recentId) => recentId !== taskId,
    )
    if (persisted.value.previousActiveId === taskId) persisted.value.previousActiveId = null
  }

  return {
    now,
    tasks,
    events,
    combo,
    comboLog,
    recentIds,
    activeId,
    activeTask,
    activeElapsed,
    comboElapsed,
    comboTasks,
    displaySecondsByTask,
    timePerTask,
    timePerDay,
    blockersPerWeek,
    activityDays,
    eventsByMonth,
    createTask,
    switchTask,
    pause,
    pingPong,
    switchToRecent,
    addEvent,
    deleteEvent,
    startCombo,
    stopCombo,
    editComboSplit,
    deleteTask,
  }
})
