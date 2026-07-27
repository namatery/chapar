import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { syncDocumentLocale, useI18n } from './useI18n'

describe('useI18n', () => {
  beforeEach(() => {
    localStorage.clear()
    useI18n().locale.value = 'en'
  })

  it('keeps English as the default and interpolates values', () => {
    const { direction, t } = useI18n()

    expect(direction.value).toBe('ltr')
    expect(t('tasks.records', { count: 3 })).toBe('3 active records')
  })

  it('switches to fluent Persian and persists the selection', async () => {
    const { direction, locale, t, toggleLocale } = useI18n()

    toggleLocale()
    await nextTick()

    expect(locale.value).toBe('fa')
    expect(direction.value).toBe('rtl')
    expect(t('app.name')).toBe('چاپار')
    expect(t('tabs.dashboard')).toBe('داشبورد')
    expect(localStorage.getItem('chapar:locale')).toBe('fa')
  })

  it('synchronizes the document language, direction, and title', async () => {
    const { locale } = useI18n()
    syncDocumentLocale()

    locale.value = 'fa'
    await nextTick()

    expect(document.documentElement.lang).toBe('fa')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.title).toBe('چاپار — مدیریت کار و زمان')
  })
})
