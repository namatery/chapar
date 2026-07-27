import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { useI18n } from '../composables/useI18n'
import AppTabs from './AppTabs.vue'

describe('AppTabs direction', () => {
  beforeEach(() => {
    useI18n().locale.value = 'en'
  })

  it('passes RTL to the Reka tabs root in Persian', async () => {
    const wrapper = shallowMount(AppTabs, {
      global: {
        stubs: {
          TabsRoot: {
            props: ['dir', 'modelValue'],
            template: '<div class="tabs-root" :dir="dir"><slot /></div>',
          },
          DropdownMenuRoot: {
            props: ['dir'],
            template: '<div class="settings-root" :dir="dir"><slot /></div>',
          },
          DropdownMenuTrigger: { template: '<div><slot /></div>' },
          SelectRoot: { template: '<div><slot /></div>' },
          SelectTrigger: { template: '<div><slot /></div>' },
        },
      },
    })

    useI18n().locale.value = 'fa'
    await nextTick()

    expect(wrapper.get('.tabs-root').attributes('dir')).toBe('rtl')
    expect(wrapper.get('.settings-root').attributes('dir')).toBe('rtl')
    expect(wrapper.get('.brand-mark img').attributes('src')).toContain('icon.png')
    expect(wrapper.get('.settings-trigger').attributes('aria-label')).toBe('باز کردن تنظیمات')
    expect(wrapper.get('.view-select-trigger').attributes('aria-label')).toBe('نمای برنامه')
    expect(wrapper.get('.view-select-trigger').text()).toContain('پیگیری')
    const viewTrigger = wrapper.get('.view-select-trigger').element
    const settingsTrigger = wrapper.get('.settings-trigger').element
    expect(viewTrigger.compareDocumentPosition(settingsTrigger) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    wrapper.unmount()
  })
})
