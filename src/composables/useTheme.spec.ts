import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { syncDocumentTheme, useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    useTheme().theme.value = 'dark'
  })

  it('toggles and applies the persisted theme to the document', async () => {
    document.head.innerHTML = '<meta name="theme-color" content="#070b12">'
    syncDocumentTheme()

    useTheme().toggleTheme()
    await nextTick()

    expect(useTheme().theme.value).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#f3f6fa')
    expect(localStorage.getItem('chapar:theme')).toContain('light')
  })
})
