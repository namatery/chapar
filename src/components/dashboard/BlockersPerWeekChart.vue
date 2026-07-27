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
  labels: store.blockersPerWeek.map((item) => item.label),
  datasets: [{
    label: t('dashboard.blockers'),
    data: store.blockersPerWeek.map((item) => item.count),
    backgroundColor: chartColors(theme.value).blocker,
    borderRadius: 5,
    barThickness: 14,
  }],
}))
const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: chartColors(theme.value).tick, maxRotation: 0, autoSkip: true, font: { family: chartFontFamily(locale.value) } } },
    y: { beginAtZero: true, grid: { color: chartColors(theme.value).grid }, ticks: { color: chartColors(theme.value).tick, precision: 0, font: { family: chartFontFamily(locale.value) } } },
  },
}))
</script>

<template><div class="chart-frame h-60"><Bar :data="data" :options="options" /></div></template>
