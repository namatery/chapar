<script setup lang="ts">
import ActivityHeatmap from './ActivityHeatmap.vue'
import BlockersPerWeekChart from './BlockersPerWeekChart.vue'
import TimePerDayChart from './TimePerDayChart.vue'
import TimePerTaskChart from './TimePerTaskChart.vue'
</script>

<template>
  <main class="space-y-4">
    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-live">TIME PER TASK</div>
      <h2 class="mt-2 text-lg font-semibold text-white">Where the hours went</h2>
      <p class="mt-1 text-xs text-slate-500">Lifetime totals, including the session currently running.</p>
      <div class="mt-5"><TimePerTaskChart /></div>
    </section>

    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-live">LAST 14 DAYS</div>
      <h2 class="mt-2 text-lg font-semibold text-white">Daily operating time</h2>
      <div class="mt-5"><TimePerDayChart /></div>
    </section>

    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-blocker">BLOCKERS PER ISO WEEK</div>
      <h2 class="mt-2 text-lg font-semibold text-white">Friction trend</h2>
      <div class="mt-5"><BlockersPerWeekChart /></div>
    </section>

    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-combo">ACTIVITY SIGNAL</div>
      <h2 class="mt-2 text-lg font-semibold text-white">Twelve-week pulse</h2>
      <p class="mt-1 text-xs text-slate-500">Intensity reflects tracked hours per day.</p>
      <div class="mt-6"><ActivityHeatmap /></div>
    </section>
  </main>
</template>
