<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useToast } from '../../composables/useToast'
import { useTrackerStore } from '../../stores/tracker'
import { formatDuration } from '../../utils/time'
import CaptureBar from './CaptureBar.vue'
import ComboBar from './ComboBar.vue'
import ComboLog from './ComboLog.vue'
import EventLog from './EventLog.vue'
import FloatingWidget from './FloatingWidget.vue'
import TaskList from './TaskList.vue'

const store = useTrackerStore()
const { showToast } = useToast()

function pause() {
  if (!store.activeId && !store.combo) return
  const wasCombo = Boolean(store.combo)
  store.pause()
  showToast(wasCombo ? 'Combo split and saved' : 'Timer paused', wasCombo ? 'combo' : 'neutral')
}
</script>

<template>
  <main class="space-y-4">
    <div class="sticky-capture">
      <CaptureBar />
    </div>

    <ComboBar />

    <section v-if="!store.combo" class="status-bar" :class="store.activeTask ? 'status-bar--live' : ''">
      <div class="flex min-w-0 items-center gap-3">
        <span class="status-dot shrink-0" :class="store.activeTask ? 'status-dot--live status-dot--pulse' : 'status-dot--idle'" />
        <div class="min-w-0">
          <div class="eyebrow" :class="store.activeTask ? 'text-live' : ''">
            {{ store.activeTask ? 'ON AIR' : 'SYSTEM IDLE' }}
          </div>
          <p class="mt-1 truncate text-sm text-slate-300">
            {{ store.activeTask?.name ?? 'Start a task to begin tracking' }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="store.activeTask" class="timer text-live">
          {{ formatDuration(store.activeElapsed) }}
        </span>
        <TooltipRoot>
          <TooltipTrigger as-child>
            <button class="button button--ghost" type="button" :disabled="!store.activeTask" @click="pause">
              <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14m8-14v14" /></svg>
              Pause
            </button>
          </TooltipTrigger>
          <TooltipPortal><TooltipContent class="tooltip">Bank elapsed time and pause</TooltipContent></TooltipPortal>
        </TooltipRoot>
        <FloatingWidget />
      </div>
    </section>

    <TaskList />
    <ComboLog />
    <EventLog />
  </main>
</template>
