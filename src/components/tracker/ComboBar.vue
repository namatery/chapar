<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { useTrackerStore } from '../../stores/tracker'
import { formatDuration } from '../../utils/time'

const store = useTrackerStore()
const { showToast } = useToast()

function stop() {
  store.stopCombo()
  showToast('Combo split and saved', 'combo')
}
</script>

<template>
  <div v-if="store.combo" class="combo-bar">
    <div class="flex min-w-0 items-center gap-3">
      <span class="combo-orbit"><span /></span>
      <div class="min-w-0">
        <div class="eyebrow text-combo">COMBO LIVE</div>
        <p class="mt-1 truncate text-sm text-slate-200">
          {{ store.comboTasks.map((task) => task.name).join(' + ') }}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="timer text-combo">{{ formatDuration(store.comboElapsed) }}</span>
      <button class="button button--combo" type="button" @click="stop">Split & stop</button>
    </div>
  </div>
</template>
