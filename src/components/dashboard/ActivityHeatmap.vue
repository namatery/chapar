<script setup lang="ts">
import { computed } from 'vue'
import { useTrackerStore } from '../../stores/tracker'
import { useI18n } from '../../composables/useI18n'
import { formatDuration } from '../../utils/time'

const store = useTrackerStore()
const { t } = useI18n()
const maxSeconds = computed(() => Math.max(1, ...store.activityDays.map((day) => day.seconds)))

function intensity(seconds: number): number {
  if (seconds <= 0) return 0
  return Math.max(1, Math.min(4, Math.ceil((seconds / maxSeconds.value) * 4)))
}
</script>

<template>
  <div class="overflow-x-auto pb-2">
    <div class="heatmap-grid" :aria-label="t('dashboard.heatmapAria')">
      <div
        v-for="day in store.activityDays"
        :key="day.date"
        class="heatmap-cell"
        :class="`heatmap-cell--${intensity(day.seconds)}`"
        :title="`${day.label}: ${formatDuration(day.seconds)}`"
      />
    </div>
    <div class="mt-3 flex items-center justify-end gap-1 text-[10px] text-slate-600">
      {{ t('dashboard.less') }}
      <span v-for="level in 5" :key="level" class="heatmap-key" :class="`heatmap-cell--${level - 1}`" />
      {{ t('dashboard.more') }}
    </div>
  </div>
</template>
