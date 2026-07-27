<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useI18n } from '../../composables/useI18n'

defineProps<{ taskName: string }>()
const emit = defineEmits<{ confirm: [] }>()
const { direction, t } = useI18n()
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <button class="icon-button danger-hover" type="button" :aria-label="t('delete.aria', { name: taskName })" @click.stop>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" /></svg>
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content" :dir="direction" @click.stop>
        <DialogTitle class="text-lg font-semibold text-white">{{ t('delete.title', { name: taskName }) }}</DialogTitle>
        <DialogDescription class="mt-2 text-sm leading-6 text-slate-400">
          {{ t('delete.description') }}
        </DialogDescription>
        <div class="mt-6 flex justify-end gap-3">
          <DialogClose class="button button--ghost">{{ t('delete.cancel') }}</DialogClose>
          <DialogClose class="button button--danger" @click="emit('confirm')">{{ t('delete.confirm') }}</DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
