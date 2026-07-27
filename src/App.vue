<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'
import AppTabs from './components/AppTabs.vue'
import ToastViewport from './components/ToastViewport.vue'
</script>

<template>
  <TooltipProvider :delay-duration="350">
    <div class="app-shell">
      <AppTabs />
    </div>
    <ToastViewport />
  </TooltipProvider>
</template>
