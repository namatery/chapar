<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toast } = useToast()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="toast"
      :key="toast.id"
      class="toast-message"
      :class="`toast-message--${toast.tone}`"
      role="status"
      aria-live="polite"
    >
      <span class="status-dot" :class="`status-dot--${toast.tone}`" />
      {{ toast.text }}
    </div>
  </Transition>
</template>
