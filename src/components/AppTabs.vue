<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import chaparIcon from '../../icon.png'
import Dashboard from './dashboard/Dashboard.vue'
import EventLog from './tracker/EventLog.vue'
import TrackerView from './tracker/TrackerView.vue'
import { useI18n } from '../composables/useI18n'

const { direction, t, toggleLocale } = useI18n()
</script>

<template>
  <TabsRoot default-value="tracker" class="mx-auto block w-full max-w-3xl" :dir="direction">
    <header class="app-header mb-5 px-1">
      <div>
        <div class="eyebrow brand-name">
          <span class="brand-mark" aria-hidden="true"><img :src="chaparIcon" alt="" /></span>
          {{ t('app.name') }}
        </div>
      </div>

      <div class="header-actions">
        <button class="language-switch" type="button" :aria-label="t('language.switchTo')" @click="toggleLocale">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h10M9 3v2c0 4-2 7-5 9m3-5c1 2 3 4 6 5m2-5h2l3 10m-4-3h5" /></svg>
          {{ t('language.button') }}
        </button>
        <TabsList class="tab-list" :aria-label="t('app.view')">
          <TabsTrigger class="tab-trigger" value="tracker">{{ t('tabs.tracker') }}</TabsTrigger>
          <TabsTrigger class="tab-trigger" value="events">{{ t('tabs.events') }}</TabsTrigger>
          <TabsTrigger class="tab-trigger" value="dashboard">{{ t('tabs.dashboard') }}</TabsTrigger>
        </TabsList>
      </div>
    </header>

    <TabsContent value="tracker" class="focus:outline-none">
      <TrackerView />
    </TabsContent>
    <TabsContent value="events" class="focus:outline-none">
      <EventLog />
    </TabsContent>
    <TabsContent value="dashboard" class="focus:outline-none">
      <Dashboard />
    </TabsContent>
  </TabsRoot>
</template>
