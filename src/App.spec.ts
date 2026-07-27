import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.vue'
import { useI18n } from './composables/useI18n'

describe('App direction', () => {
  beforeEach(() => {
    useI18n().locale.value = 'en'
  })

  it('applies RTL directly to the application shell in Persian', async () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: {
          TooltipProvider: { template: '<div><slot /></div>' },
        },
      },
    })

    useI18n().locale.value = 'fa'
    await nextTick()

    expect(wrapper.get('.app-shell').attributes('dir')).toBe('rtl')
    expect(document.documentElement.dir).toBe('rtl')
    wrapper.unmount()
  })
})
