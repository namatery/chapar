<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useToast } from '../../composables/useToast'
import { useI18n } from '../../composables/useI18n'
import { useTrackerStore } from '../../stores/tracker'
import { formatDuration } from '../../utils/time'
import CaptureBar from './CaptureBar.vue'
import ComboBar from './ComboBar.vue'
import ComboLog from './ComboLog.vue'
import FloatingWidget from './FloatingWidget.vue'
import TaskList from './TaskList.vue'

const store = useTrackerStore()
const { showToast } = useToast()
const { t } = useI18n()

function pause() {
  if (!store.activeId && !store.combo) return
  const wasCombo = Boolean(store.combo)
  store.pause()
  showToast(wasCombo ? t('toast.comboSaved') : t('toast.timerPaused'), wasCombo ? 'combo' : 'neutral')
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
            {{ store.activeTask ? t('status.onAir') : t('status.idle') }}
          </div>
          <p class="mt-1 truncate text-sm text-slate-300">
            <span dir="auto">{{ store.activeTask?.name ?? t('status.startPrompt') }}</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="store.activeTask" class="timer text-live">
          {{ formatDuration(store.activeElapsed) }}
        </span>
        <TooltipRoot>
          <TooltipTrigger as-child>
            <button class="button button--ghost button--icon" type="button" :aria-label="t('actions.pause')" :disabled="!store.activeTask" @click="pause">
              <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14m8-14v14" /></svg>
            </button>
          </TooltipTrigger>
          <TooltipPortal><TooltipContent class="tooltip">{{ t('actions.pauseHint') }}</TooltipContent></TooltipPortal>
        </TooltipRoot>
        <FloatingWidget />
      </div>
    </section>

    <TaskList />
    <ComboLog />
  </main>
</template>
