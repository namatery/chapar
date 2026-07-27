<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import Dashboard from './dashboard/Dashboard.vue'
import TrackerView from './tracker/TrackerView.vue'
</script>

<template>
  <TabsRoot default-value="tracker" class="mx-auto block w-full max-w-3xl">
    <header class="mb-5 flex items-end justify-between gap-4 px-1">
      <div>
        <div class="eyebrow"><span class="status-dot status-dot--live" /> CHAPAR</div>
        <p class="mt-1 text-xs text-slate-500">Personal operations log</p>
      </div>

      <TabsList class="tab-list" aria-label="Application view">
        <TabsTrigger class="tab-trigger" value="tracker">Tracker</TabsTrigger>
        <TabsTrigger class="tab-trigger" value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
    </header>

    <TabsContent value="tracker" class="focus:outline-none">
      <TrackerView />
    </TabsContent>
    <TabsContent value="dashboard" class="focus:outline-none">
      <Dashboard />
    </TabsContent>
  </TabsRoot>
</template>
