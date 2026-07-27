<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useToast } from '../../composables/useToast'
import { useI18n } from '../../composables/useI18n'
import { useTrackerStore } from '../../stores/tracker'
import { formatDuration } from '../../utils/time'

const store = useTrackerStore()
const { showToast } = useToast()
const { t } = useI18n()

function stop() {
  store.stopCombo()
  showToast(t('toast.comboSaved'), 'combo')
}
</script>

<template>
  <div v-if="store.combo" class="combo-bar">
    <div class="flex min-w-0 items-center gap-3">
      <span class="combo-orbit"><span /></span>
      <div class="min-w-0">
        <div class="eyebrow text-combo">{{ t('combo.live') }}</div>
        <p class="mt-1 truncate text-sm text-slate-200" dir="auto">
          {{ store.comboTasks.map((task) => task.name).join(' + ') }}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="timer text-combo">{{ formatDuration(store.comboElapsed) }}</span>
      <TooltipRoot>
        <TooltipTrigger as-child>
          <button class="button button--combo button--icon" type="button" :aria-label="t('combo.stop')" @click="stop">
            <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7z" /></svg>
          </button>
        </TooltipTrigger>
        <TooltipPortal><TooltipContent class="tooltip">{{ t('combo.stop') }}</TooltipContent></TooltipPortal>
      </TooltipRoot>
    </div>
  </div>
</template>
