<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'
import AppTabs from './components/AppTabs.vue'
import ToastViewport from './components/ToastViewport.vue'
import { syncDocumentLocale, useI18n } from './composables/useI18n'
import { syncDocumentTheme } from './composables/useTheme'

syncDocumentLocale()
syncDocumentTheme()
const { direction } = useI18n()
</script>

<template>
  <TooltipProvider :delay-duration="350">
    <div class="app-shell" :dir="direction">
      <AppTabs />
    </div>
    <ToastViewport />
  </TooltipProvider>
</template>
