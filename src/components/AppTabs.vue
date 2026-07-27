<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectViewport,
  TabsContent,
  TabsRoot,
} from 'reka-ui'
import { computed, ref } from 'vue'
import chaparIcon from '../../icon.png'
import Dashboard from './dashboard/Dashboard.vue'
import EventLog from './tracker/EventLog.vue'
import TrackerView from './tracker/TrackerView.vue'
import { useI18n } from '../composables/useI18n'
import { useTheme } from '../composables/useTheme'

const { direction, t, toggleLocale } = useI18n()
const { theme, toggleTheme } = useTheme()
type AppView = 'tracker' | 'events' | 'dashboard'
const activeView = ref<AppView>('tracker')
const activeViewLabel = computed(() => {
  if (activeView.value === 'events') return t('tabs.events')
  if (activeView.value === 'dashboard') return t('tabs.dashboard')
  return t('tabs.tracker')
})
</script>

<template>
  <TabsRoot v-model="activeView" class="mx-auto block w-full max-w-3xl" :dir="direction">
    <header class="app-header mb-3 px-1">
      <div>
        <div class="eyebrow brand-name">
          <span class="brand-mark" aria-hidden="true"><img :src="chaparIcon" alt="" /></span>
          {{ t('app.name') }}
        </div>
      </div>

      <div class="header-actions">
        <SelectRoot v-model="activeView" :dir="direction">
          <SelectTrigger class="view-select-trigger" :aria-label="t('app.view')">
            <svg class="view-select-trigger__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM9 5v14" /></svg>
            <span class="min-w-0 flex-1 truncate text-start">{{ activeViewLabel }}</span>
            <svg class="view-select-trigger__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5" /></svg>
          </SelectTrigger>
          <SelectPortal>
            <SelectContent class="view-select-content" position="popper" :side-offset="6" align="end">
              <SelectViewport class="view-select-viewport">
                <SelectItem class="view-select-item" value="tracker">
                  <SelectItemText>{{ t('tabs.tracker') }}</SelectItemText>
                  <SelectItemIndicator class="view-select-indicator">✓</SelectItemIndicator>
                </SelectItem>
                <SelectItem class="view-select-item" value="events">
                  <SelectItemText>{{ t('tabs.events') }}</SelectItemText>
                  <SelectItemIndicator class="view-select-indicator">✓</SelectItemIndicator>
                </SelectItem>
                <SelectItem class="view-select-item" value="dashboard">
                  <SelectItemText>{{ t('tabs.dashboard') }}</SelectItemText>
                  <SelectItemIndicator class="view-select-indicator">✓</SelectItemIndicator>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>

        <DropdownMenuRoot :dir="direction">
          <DropdownMenuTrigger as-child>
            <button class="settings-trigger" type="button" :aria-label="t('settings.open')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.5 1a8 8 0 0 0-2-1.2L14 3h-4l-.4 2.6a8 8 0 0 0-2 1.2l-2.5-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.5-1a8 8 0 0 0 2 1.2L10 21h4l.4-2.6a8 8 0 0 0 2-1.2l2.5 1 2-3.4-2-1.6A7 7 0 0 0 19 12Z" /></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent class="settings-menu" :side-offset="8" align="end" :dir="direction">
              <DropdownMenuLabel class="settings-menu__label">{{ t('settings.title') }}</DropdownMenuLabel>
              <DropdownMenuSeparator class="menu-separator" />
              <DropdownMenuItem class="settings-menu__item" @select="toggleLocale">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h10M9 3v2c0 4-2 7-5 9m3-5c1 2 3 4 6 5m2-5h2l3 10m-4-3h5" /></svg>
                <span class="flex-1">{{ t('settings.language') }}</span>
                <span class="settings-menu__value">{{ t('language.button') }}</span>
              </DropdownMenuItem>
              <DropdownMenuItem class="settings-menu__item" @select="toggleTheme">
                <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /></svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /></svg>
                <span class="flex-1">{{ t('settings.appearance') }}</span>
                <span class="settings-menu__value">{{ t(theme === 'dark' ? 'theme.light' : 'theme.dark') }}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
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
