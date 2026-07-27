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

defineProps<{ taskName: string }>()
const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <button class="icon-button danger-hover" type="button" :aria-label="`Delete ${taskName}`" @click.stop>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" /></svg>
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content" @click.stop>
        <div class="eyebrow text-rose-400">DESTRUCTIVE ACTION</div>
        <DialogTitle class="mt-3 text-lg font-semibold text-white">Delete “{{ taskName }}”?</DialogTitle>
        <DialogDescription class="mt-2 text-sm leading-6 text-slate-400">
          The task and its total disappear. Historical combo and blocker snapshots stay intact.
        </DialogDescription>
        <div class="mt-6 flex justify-end gap-3">
          <DialogClose class="button button--ghost">Cancel</DialogClose>
          <DialogClose class="button button--danger" @click="emit('confirm')">Delete task</DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
