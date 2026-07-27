<script setup lang="ts">
import { format } from 'date-fns'
import { useToast } from '../../composables/useToast'
import { useTrackerStore } from '../../stores/tracker'
import { formatDuration, minutesInputValue } from '../../utils/time'

const store = useTrackerStore()
const { showToast } = useToast()

function taskExists(taskId: string): boolean {
  return store.tasks.some((task) => task.id === taskId)
}

function updateSplit(entryId: string, taskId: string, event: Event) {
  const input = event.currentTarget as HTMLInputElement
  const minutes = Number(input.value)
  if (!Number.isFinite(minutes)) return
  if (store.editComboSplit(entryId, taskId, minutes * 60)) {
    showToast('Combo split updated', 'combo')
  }
}
</script>

<template>
  <section v-if="store.comboLog.length" class="panel overflow-hidden">
    <div class="section-header">
      <div>
        <div class="eyebrow text-combo">COMBO SESSIONS</div>
        <p class="mt-1 text-xs text-slate-500">Edit minutes; the final row balances automatically.</p>
      </div>
    </div>

    <div class="divide-y divide-white/5">
      <details v-for="entry in store.comboLog" :key="entry.id" class="combo-entry">
        <summary>
          <span class="min-w-0 flex-1 truncate text-sm text-slate-300">
            {{ entry.taskIds.map((taskId) => entry.names[taskId]).join(' + ') }}
          </span>
          <span class="font-mono text-xs text-slate-500">{{ format(new Date(entry.createdAt), 'MMM d · HH:mm') }}</span>
          <span class="timer text-combo">{{ formatDuration(entry.totalSeconds) }}</span>
          <span class="summary-caret">⌄</span>
        </summary>
        <div class="combo-splits">
          <div v-for="(taskId, index) in entry.taskIds" :key="taskId" class="split-row">
            <div class="min-w-0">
              <p class="truncate text-sm text-slate-300">{{ entry.names[taskId] }}</p>
              <p v-if="!taskExists(taskId)" class="mt-0.5 text-[11px] text-slate-600">(deleted task)</p>
            </div>
            <label class="minute-field">
              <input
                type="number"
                min="0"
                step="0.01"
                :value="minutesInputValue(entry.splitSeconds[taskId] ?? 0)"
                :readonly="index === entry.taskIds.length - 1"
                :disabled="!taskExists(taskId)"
                :aria-label="`Minutes allocated to ${entry.names[taskId]}`"
                @input="updateSplit(entry.id, taskId, $event)"
              />
              <span>min</span>
            </label>
          </div>
        </div>
      </details>
    </div>
  </section>
</template>
