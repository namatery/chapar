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
            props: ['dir'],
            template: '<div class="tabs-root" :dir="dir"><slot /></div>',
          },
        },
      },
    })

    useI18n().locale.value = 'fa'
    await nextTick()

    expect(wrapper.get('.tabs-root').attributes('dir')).toBe('rtl')
    expect(wrapper.get('.brand-mark img').attributes('src')).toContain('icon.png')
    wrapper.unmount()
  })
})
