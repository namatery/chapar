<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useTrackerStore } from '../../stores/tracker'
import { useI18n } from '../../composables/useI18n'
import { useTheme } from '../../composables/useTheme'
import { chartColors, chartFontFamily } from './chartSetup'

const store = useTrackerStore()
const { locale, t } = useI18n()
const { theme } = useTheme()
const data = computed<ChartData<'bar'>>(() => ({
  labels: store.timePerTask.map((item) => item.label),
  datasets: [{
    label: t('dashboard.hours'),
    data: store.timePerTask.map((item) => Number((item.seconds / 3600).toFixed(2))),
    backgroundColor: chartColors(theme.value).live,
    borderRadius: 5,
    barThickness: 14,
  }],
}))
const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, grid: { color: chartColors(theme.value).grid }, ticks: { color: chartColors(theme.value).tick, font: { family: chartFontFamily(locale.value) } } },
    y: { grid: { display: false }, ticks: { color: chartColors(theme.value).muted, font: { family: chartFontFamily(locale.value) } } },
  },
}))
</script>

<template>
  <div class="chart-frame" :style="{ height: `${Math.max(190, store.timePerTask.length * 38)}px` }">
    <Bar v-if="store.timePerTask.length" :data="data" :options="options" />
    <div v-else class="chart-empty">{{ t('dashboard.emptyTaskTime') }}</div>
  </div>
</template>
