<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { useTrackerStore } from '../../stores/tracker'
import { gridColor, tickColor } from './chartSetup'

const store = useTrackerStore()
const data = computed<ChartData<'line'>>(() => ({
  labels: store.timePerDay.map((item) => item.label),
  datasets: [{
    label: 'Hours',
    data: store.timePerDay.map((item) => Number((item.seconds / 3600).toFixed(2))),
    borderColor: '#35e6a4',
    backgroundColor: 'rgba(53, 230, 164, 0.12)',
    pointBackgroundColor: '#35e6a4',
    pointRadius: 2,
    tension: 0.32,
    fill: true,
  }],
}))
const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: tickColor, maxRotation: 0, autoSkip: true } },
    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor } },
  },
}
</script>

<template><div class="chart-frame h-60"><Line :data="data" :options="options" /></div></template>
