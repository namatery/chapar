import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTrackerStore } from './tracker'

describe('useTrackerStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-27T08:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('banks elapsed seconds and ping-pongs between the last two active tasks', () => {
    const store = useTrackerStore()
    const start = Date.now()
    const first = store.createTask('Write proposal', start)
    const second = store.createTask('Review code', start + 6_500)

    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    expect(store.tasks[0]?.totalSeconds).toBe(6)
    expect(store.recentIds).toEqual([second?.id, first?.id])

    store.pingPong(start + 9_500)

    expect(store.activeId).toBe(first?.id)
    expect(store.tasks[1]?.totalSeconds).toBe(3)
    expect(store.recentIds).toEqual([first?.id, second?.id])
  })

  it('splits combo time exactly and applies edit deltas to the remainder task', () => {
    const store = useTrackerStore()
    const start = Date.now()
    const first = store.createTask('Design', start)
    const second = store.createTask('Research', start)
    store.pause(start)

    expect(store.startCombo([first!.id, second!.id], start + 1_000)).toBe(true)
    const entry = store.stopCombo(start + 6_000)

    expect(entry?.totalSeconds).toBe(5)
    expect(entry?.splitSeconds).toEqual({ [first!.id]: 3, [second!.id]: 2 })
    expect(store.tasks.map((task) => task.totalSeconds)).toEqual([3, 2])

    expect(store.editComboSplit(entry!.id, first!.id, 1)).toBe(true)
    expect(entry?.splitSeconds).toEqual({ [first!.id]: 1, [second!.id]: 4 })
    expect(store.tasks.map((task) => task.totalSeconds)).toEqual([1, 4])
  })

  it('keeps combo snapshots and daily history after a task is deleted', () => {
    const store = useTrackerStore()
    const start = Date.now()
    const first = store.createTask('Build UI', start)
    const second = store.createTask('Test UI', start)
    store.pause(start)
    store.startCombo([first!.id, second!.id], start)
    store.stopCombo(start + 120_000)
    store.deleteTask(first!.id, start + 120_000)

    expect(store.comboLog[0]?.names[first!.id]).toBe('Build UI')
    expect(store.timePerDay.at(-1)?.seconds).toBe(120)
    expect(store.tasks.map((task) => task.name)).toEqual(['Test UI'])
  })

  it('tags blockers with an active task or running combo snapshot', () => {
    const store = useTrackerStore()
    const start = Date.now()
    const first = store.createTask('API', start)
    const second = store.createTask('Frontend', start)

    const singleEvent = store.addEvent('waiting on review', start)
    expect(singleEvent?.taskName).toBe('Frontend')
    expect(singleEvent?.text).toBe('waiting on review')

    store.startCombo([first!.id, second!.id], start)
    const comboEvent = store.addEvent('Pairing session', start)
    expect(comboEvent?.taskName).toBe('API + Frontend')
  })
})
