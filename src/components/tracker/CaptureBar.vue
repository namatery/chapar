<script setup lang="ts">
import { onKeyStroke, useMagicKeys } from '@vueuse/core'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useToast } from '../../composables/useToast'
import { useI18n } from '../../composables/useI18n'
import { useTrackerStore } from '../../stores/tracker'
import { isTypingTarget } from '../../utils/dom'

const store = useTrackerStore()
const { showToast } = useToast()
const { direction, t } = useI18n()
const captureInput = ref<HTMLInputElement | null>(null)
const text = ref('')
const { shift } = useMagicKeys()
const isBlockerMode = computed(() => shift.value)

function focusCapture() {
  nextTick(() => captureInput.value?.focus())
}

function submit(event: KeyboardEvent) {
  const blocker = event.shiftKey
  if (blocker) {
    if (store.addEvent(text.value)) {
      text.value = ''
      showToast(t('toast.blockerLogged'), 'blocker')
    }
  } else if (store.createTask(text.value)) {
    text.value = ''
    showToast(t('toast.taskStarted'), 'live')
  }
}

onKeyStroke('/', (event) => {
  if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return
  event.preventDefault()
  focusCapture()
})

onMounted(focusCapture)

defineExpose({ focusCapture })
</script>

<template>
  <div class="capture-wrap">
    <div class="capture-prompt" :class="isBlockerMode ? 'text-blocker' : 'text-live'">›</div>
    <input
      ref="captureInput"
      v-model="text"
      class="capture-input"
      :dir="text ? 'auto' : direction"
      autocomplete="off"
      spellcheck="true"
      :placeholder="t('capture.placeholder')"
      :aria-label="t('capture.aria')"
      @keydown.enter.prevent="submit"
    />
    <div class="mode-pill" :class="isBlockerMode ? 'mode-pill--blocker' : 'mode-pill--task'">
      {{ isBlockerMode ? t('capture.blocker') : t('capture.task') }}
    </div>
  </div>
  <p class="mt-2 px-1 text-[11px] text-slate-600" v-html="t('capture.shortcut')" />
</template>
