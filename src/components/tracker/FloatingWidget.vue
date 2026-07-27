<script setup lang="ts">
import { watchEffect } from 'vue'
import { useToast } from '../../composables/useToast'
import { useTrackerStore } from '../../stores/tracker'
import { formatDuration } from '../../utils/time'

const store = useTrackerStore()
const { showToast } = useToast()
let floatingWindow: Window | null = null
let stopRendering: (() => void) | null = null

function createButton(label: string, className: string, action: () => void): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = className
  button.textContent = label
  button.addEventListener('click', action)
  return button
}

function renderWidget() {
  if (!floatingWindow || floatingWindow.closed) return
  const doc = floatingWindow.document
  const root = doc.createElement('main')
  root.className = 'pip-widget'

  const header = doc.createElement('div')
  header.className = 'pip-header'
  const label = doc.createElement('div')
  label.className = 'eyebrow'
  label.textContent = store.combo ? 'COMBO LIVE' : store.activeTask ? 'ON AIR' : 'CHAPAR · IDLE'
  const timer = doc.createElement('div')
  timer.className = `timer ${store.combo ? 'text-combo' : store.activeTask ? 'text-live' : ''}`
  timer.textContent = formatDuration(store.combo ? store.comboElapsed : store.activeElapsed)
  header.append(label, timer)
  root.append(header)

  const list = doc.createElement('div')
  list.className = 'pip-list'
  const recentTasks = store.recentIds
    .map((taskId) => store.tasks.find((task) => task.id === taskId))
    .filter((task) => task !== undefined)
    .slice(0, 4)

  for (const task of recentTasks) {
    const button = createButton('', 'pip-task', () => store.switchTask(task.id))
    if (store.activeId === task.id) button.classList.add('pip-task--active')
    const name = doc.createElement('span')
    name.textContent = task.name
    const duration = doc.createElement('span')
    duration.className = 'timer'
    duration.textContent = formatDuration(store.displaySecondsByTask[task.id] ?? 0)
    button.append(name, duration)
    list.append(button)
  }
  if (!recentTasks.length) {
    const empty = doc.createElement('p')
    empty.className = 'pip-empty'
    empty.textContent = 'Create a task in the main window first.'
    list.append(empty)
  }
  root.append(list)
  root.append(createButton('Pause', 'button button--ghost pip-pause', () => store.pause()))
  doc.body.replaceChildren(root)
}

async function openWidget() {
  if (!window.documentPictureInPicture) {
    showToast('Floating window is not supported here', 'neutral')
    return
  }
  if (floatingWindow && !floatingWindow.closed) {
    floatingWindow.focus()
    return
  }

  try {
    floatingWindow = await window.documentPictureInPicture.requestWindow({ width: 340, height: 430 })
    for (const node of document.querySelectorAll('style, link[rel="stylesheet"]')) {
      floatingWindow.document.head.append(node.cloneNode(true))
    }
    floatingWindow.document.documentElement.className = document.documentElement.className
    floatingWindow.document.title = 'Chapar controls'
    stopRendering = watchEffect(renderWidget)
    floatingWindow.addEventListener('pagehide', () => {
      stopRendering?.()
      stopRendering = null
      floatingWindow = null
    }, { once: true })
    showToast('Floating controls opened', 'live')
  } catch {
    showToast('Could not open floating controls', 'neutral')
  }
}
</script>

<template>
  <button class="button button--ghost" type="button" @click="openWidget">
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5m0-5-7 7M5 8v11h11v-5" /></svg>
    Float
  </button>
</template>
