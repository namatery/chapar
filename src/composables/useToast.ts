import { readonly, ref } from 'vue'

export type ToastTone = 'live' | 'blocker' | 'combo' | 'neutral'

export interface ToastMessage {
  id: number
  text: string
  tone: ToastTone
}

const current = ref<ToastMessage | null>(null)
let nextId = 0
let timer: ReturnType<typeof setTimeout> | undefined

export function useToast() {
  function showToast(text: string, tone: ToastTone = 'neutral') {
    nextId += 1
    current.value = { id: nextId, text, tone }
    clearTimeout(timer)
    timer = setTimeout(() => {
      current.value = null
    }, 2200)
  }

  return { toast: readonly(current), showToast }
}
