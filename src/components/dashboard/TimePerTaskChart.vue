<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useTrackerStore } from '../../stores/tracker'
import { gridColor, tickColor } from './chartSetup'

const store = useTrackerStore()
const data = computed<ChartData<'bar'>>(() => ({
  labels: store.timePerTask.map((item) => item.label),
  datasets: [{
    label: 'Hours',
    data: store.timePerTask.map((item) => Number((item.seconds / 3600).toFixed(2))),
    backgroundColor: '#35e6a4',
    borderRadius: 5,
    barThickness: 14,
  }],
}))
const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor } },
    y: { grid: { display: false }, ticks: { color: '#94a3b8' } },
  },
}
</script>

<template>
  <div class="chart-frame" :style="{ height: `${Math.max(190, store.timePerTask.length * 38)}px` }">
    <Bar v-if="store.timePerTask.length" :data="data" :options="options" />
    <div v-else class="chart-empty">Tracked task time will appear here.</div>
  </div>
</template>
