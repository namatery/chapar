<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useTrackerStore } from '../../stores/tracker'
import { gridColor, tickColor } from './chartSetup'

const store = useTrackerStore()
const data = computed<ChartData<'bar'>>(() => ({
  labels: store.blockersPerWeek.map((item) => item.label),
  datasets: [{
    label: 'Blockers',
    data: store.blockersPerWeek.map((item) => item.count),
    backgroundColor: '#ff5f7e',
    borderRadius: 5,
    barThickness: 14,
  }],
}))
const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: tickColor, maxRotation: 0, autoSkip: true } },
    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor, precision: 0 } },
  },
}
</script>

<template><div class="chart-frame h-60"><Bar :data="data" :options="options" /></div></template>
