<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { format } from 'date-fns'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { useTrackerStore } from '../../stores/tracker'
import { useI18n } from '../../composables/useI18n'
import { useTheme } from '../../composables/useTheme'
import { chartColors, chartFontFamily } from './chartSetup'

const store = useTrackerStore()
const { locale, t } = useI18n()
const { theme } = useTheme()
const data = computed<ChartData<'line'>>(() => {
  const blockersByDay = new Map(store.timePerDay.map((item) => [item.date, 0]))
  for (const event of store.events) {
    const date = format(new Date(event.timestamp), 'yyyy-MM-dd')
    if (blockersByDay.has(date)) {
      blockersByDay.set(date, (blockersByDay.get(date) ?? 0) + 1)
    }
  }

  return {
    labels: store.timePerDay.map((item) => item.label),
    datasets: [
      {
        label: t('dashboard.hours'),
        data: store.timePerDay.map((item) => Number((item.seconds / 3600).toFixed(2))),
        borderColor: chartColors(theme.value).live,
        backgroundColor: theme.value === 'light' ? 'rgba(7, 136, 95, 0.12)' : 'rgba(53, 230, 164, 0.12)',
        pointBackgroundColor: chartColors(theme.value).live,
        pointRadius: 2,
        tension: 0.32,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: t('dashboard.blockers'),
        data: store.timePerDay.map((item) => blockersByDay.get(item.date) ?? 0),
        borderColor: chartColors(theme.value).blocker,
        backgroundColor: chartColors(theme.value).blocker,
        pointBackgroundColor: chartColors(theme.value).blocker,
        pointRadius: 3,
        tension: 0.32,
        fill: false,
        yAxisID: 'yBlockers',
      },
    ],
  }
})
const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: chartColors(theme.value).tick,
        font: { family: chartFontFamily(locale.value) },
        usePointStyle: true,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: chartColors(theme.value).tick, maxRotation: 0, autoSkip: true, font: { family: chartFontFamily(locale.value) } } },
    y: { beginAtZero: true, grid: { color: chartColors(theme.value).grid }, ticks: { color: chartColors(theme.value).tick, font: { family: chartFontFamily(locale.value) } } },
    yBlockers: {
      beginAtZero: true,
      position: 'right',
      grid: { drawOnChartArea: false },
      ticks: { color: chartColors(theme.value).blocker, precision: 0, font: { family: chartFontFamily(locale.value) } },
    },
  },
}))
</script>

<template><div class="chart-frame h-60"><Line :data="data" :options="options" /></div></template>
