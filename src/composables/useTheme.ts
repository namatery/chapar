import { useLocalStorage } from '@vueuse/core'
import { watchEffect } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'chapar:theme'
const THEME_COLORS: Record<Theme, string> = {
  dark: '#070b12',
  light: '#f3f6fa',
}

const theme = useLocalStorage<Theme>(STORAGE_KEY, 'dark')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}

export function syncDocumentTheme() {
  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value
    document.documentElement.style.colorScheme = theme.value
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme.value])
  })
}
