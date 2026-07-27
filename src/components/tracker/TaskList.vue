<script setup lang="ts">
import { onKeyStroke, useToggle } from '@vueuse/core'
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { ref } from 'vue'
import { useToast } from '../../composables/useToast'
import { useI18n } from '../../composables/useI18n'
import { useTrackerStore } from '../../stores/tracker'
import { isTypingTarget } from '../../utils/dom'
import { formatDuration } from '../../utils/time'
import TaskDeleteDialog from './TaskDeleteDialog.vue'

const store = useTrackerStore()
const { showToast } = useToast()
const { formatDate, formatNumber, t } = useI18n()
const [selectMode, toggleSelectMode] = useToggle(false)
const selectedIds = ref<string[]>([])

function handleTask(taskId: string) {
  if (selectMode.value) {
    selectedIds.value = selectedIds.value.includes(taskId)
      ? selectedIds.value.filter((selectedId) => selectedId !== taskId)
      : [...selectedIds.value, taskId]
    return
  }
  store.switchTask(taskId)
  showToast(t('toast.taskSwitched'), 'live')
}

function startCombo() {
  if (!store.startCombo(selectedIds.value)) return
  selectedIds.value = []
  toggleSelectMode(false)
  showToast(t('toast.comboStarted'), 'combo')
}

function cancelCombine() {
  selectedIds.value = []
  toggleSelectMode(false)
}

function deleteTask(taskId: string) {
  store.deleteTask(taskId)
  selectedIds.value = selectedIds.value.filter((id) => id !== taskId)
  showToast(t('toast.taskDeleted'), 'neutral')
}

onKeyStroke(['Tab', '1', '2', '3'], (event) => {
  if (
    isTypingTarget(event.target) ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    selectMode.value
  ) return

  if (event.key === 'Tab') {
    event.preventDefault()
    store.pingPong()
    return
  }

  event.preventDefault()
  store.switchToRecent(Number(event.key) - 1)
})
</script>

<template>
  <section class="panel overflow-hidden">
    <div class="section-header">
      <div>
        <div class="eyebrow">{{ t('tasks.heading') }}</div>
        <p class="mt-1 text-xs text-slate-500">{{ t('tasks.records', { count: formatNumber(store.tasks.length) }) }}</p>
      </div>
      <div class="flex gap-2">
        <button v-if="selectMode" class="button button--ghost" type="button" @click="cancelCombine">
          {{ t('tasks.cancel') }}
        </button>
        <TooltipRoot>
          <TooltipTrigger as-child>
            <button
              class="button"
              :class="selectMode ? 'button--combo' : 'button--ghost'"
              type="button"
              @click="toggleSelectMode()"
            >
              {{ selectMode ? t('tasks.selecting') : t('tasks.combine') }}
            </button>
          </TooltipTrigger>
          <TooltipPortal><TooltipContent class="tooltip">{{ t('tasks.combineHint') }}</TooltipContent></TooltipPortal>
        </TooltipRoot>
      </div>
    </div>

    <div v-if="store.tasks.length" class="divide-y divide-white/5">
      <div
        v-for="task in store.tasks"
        :key="task.id"
        class="task-row"
        :class="{
          'task-row--active': store.activeId === task.id,
          'task-row--selected': selectedIds.includes(task.id),
        }"
      >
        <button class="task-main" type="button" @click="handleTask(task.id)">
          <span v-if="selectMode" class="checkbox" :class="{ 'checkbox--checked': selectedIds.includes(task.id) }">
            <svg v-if="selectedIds.includes(task.id)" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>
          </span>
          <span v-else class="live-slot">
            <span v-if="store.activeId === task.id" class="status-dot status-dot--live status-dot--pulse" />
          </span>
          <span class="min-w-0 flex-1 text-start">
            <span class="block truncate text-sm font-medium text-slate-200" dir="auto">{{ task.name }}</span>
            <span class="mt-1 block font-mono text-[11px] tracking-wide text-slate-600">
              {{ t('tasks.created', { date: formatDate(task.createdAt, { year: 'numeric', month: 'numeric', day: 'numeric' }) }) }}
            </span>
          </span>
          <TooltipRoot v-if="store.recentIds.indexOf(task.id) < 3">
            <TooltipTrigger as-child>
              <span class="shortcut-badge">{{ store.recentIds.indexOf(task.id) + 1 }}</span>
            </TooltipTrigger>
            <TooltipPortal><TooltipContent class="tooltip">{{ t('tasks.switchHint', { number: formatNumber(store.recentIds.indexOf(task.id) + 1) }) }}</TooltipContent></TooltipPortal>
          </TooltipRoot>
          <span class="timer" :class="store.activeId === task.id ? 'text-live' : 'text-slate-300'">
            {{ formatDuration(store.displaySecondsByTask[task.id] ?? 0) }}
          </span>
        </button>
        <TaskDeleteDialog :task-name="task.name" @confirm="deleteTask(task.id)" />
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state__mark">+</div>
      <p>{{ t('tasks.empty') }}</p>
    </div>

    <div v-if="selectMode" class="combine-footer">
      <span class="text-xs text-slate-400">{{ t('tasks.selected', { count: formatNumber(selectedIds.length) }) }}</span>
      <button
        class="button button--combo"
        type="button"
        :disabled="selectedIds.length < 2"
        @click="startCombo"
      >
        {{ t('tasks.startCombo') }}
      </button>
    </div>
  </section>
</template>
