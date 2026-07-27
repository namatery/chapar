<script setup lang="ts">
import { onKeyStroke, useMagicKeys } from '@vueuse/core'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useToast } from '../../composables/useToast'
import { useTrackerStore } from '../../stores/tracker'
import { isTypingTarget } from '../../utils/dom'

const store = useTrackerStore()
const { showToast } = useToast()
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
      showToast('Logged as blocker', 'blocker')
    }
  } else if (store.createTask(text.value)) {
    text.value = ''
    showToast('Task started', 'live')
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
      autocomplete="off"
      spellcheck="true"
      placeholder="What are you working on?"
      aria-label="Create a task or log a blocker"
      @keydown.enter.prevent="submit"
    />
    <div class="mode-pill" :class="isBlockerMode ? 'mode-pill--blocker' : 'mode-pill--task'">
      {{ isBlockerMode ? 'BLOCKER ↵' : 'TASK ↵' }}
    </div>
  </div>
  <p class="mt-2 px-1 text-[11px] text-slate-600">
    <kbd>/</kbd> to focus · <kbd>Enter</kbd> starts a task · <kbd>Shift</kbd> + <kbd>Enter</kbd> logs an event
  </p>
</template>
