<script setup lang="ts">
import ActivityHeatmap from './ActivityHeatmap.vue'
import BlockersPerWeekChart from './BlockersPerWeekChart.vue'
import TimePerDayChart from './TimePerDayChart.vue'
import TimePerTaskChart from './TimePerTaskChart.vue'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <main class="space-y-4">
    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-live">{{ t('dashboard.timePerTask') }}</div>
      <h2 class="mt-2 text-lg font-semibold text-white">{{ t('dashboard.whereHoursWent') }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ t('dashboard.lifetimeHint') }}</p>
      <div class="mt-5"><TimePerTaskChart /></div>
    </section>

    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-live">{{ t('dashboard.last14Days') }}</div>
      <h2 class="mt-2 text-lg font-semibold text-white">{{ t('dashboard.dailyTime') }}</h2>
      <div class="mt-5"><TimePerDayChart /></div>
    </section>

    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-blocker">{{ t('dashboard.blockersPerWeek') }}</div>
      <h2 class="mt-2 text-lg font-semibold text-white">{{ t('dashboard.frictionTrend') }}</h2>
      <div class="mt-5"><BlockersPerWeekChart /></div>
    </section>

    <section class="panel p-5 sm:p-6">
      <div class="eyebrow text-combo">{{ t('dashboard.activitySignal') }}</div>
      <h2 class="mt-2 text-lg font-semibold text-white">{{ t('dashboard.twelveWeekPulse') }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ t('dashboard.intensityHint') }}</p>
      <div class="mt-6"><ActivityHeatmap /></div>
    </section>
  </main>
</template>
