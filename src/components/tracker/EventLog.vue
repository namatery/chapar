<script setup lang="ts">
import { format } from 'date-fns'
import { useToast } from '../../composables/useToast'
import { useTrackerStore } from '../../stores/tracker'

const store = useTrackerStore()
const { showToast } = useToast()

function remove(eventId: string) {
  store.deleteEvent(eventId)
  showToast('Blocker removed', 'neutral')
}
</script>

<template>
  <section class="panel overflow-hidden">
    <div class="section-header">
      <div>
        <div class="eyebrow text-blocker">EVENTS & BLOCKERS</div>
        <p class="mt-1 text-xs text-slate-500">Operational friction, captured in the moment.</p>
      </div>
    </div>

    <template v-if="store.eventsByMonth.length">
      <div v-for="month in store.eventsByMonth" :key="month.key" class="event-month">
        <div class="month-label">{{ month.label }}</div>
        <div class="divide-y divide-white/5">
          <article v-for="event in month.events" :key="event.id" class="event-row">
            <span class="status-dot status-dot--blocker mt-1.5 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm leading-6 text-slate-300">{{ event.text }}</p>
              <p class="mt-1 text-[11px] text-slate-600">
                {{ format(new Date(event.timestamp), 'MMM d · HH:mm') }}
                <template v-if="event.taskName"> · <span class="text-slate-500">{{ event.taskName }}</span></template>
                <template v-else> · untagged</template>
              </p>
            </div>
            <button class="icon-button danger-hover" type="button" aria-label="Delete blocker" @click="remove(event.id)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" /></svg>
            </button>
          </article>
        </div>
      </div>
    </template>
    <div v-else class="empty-state">
      <div class="empty-state__mark text-blocker">!</div>
      <p>No events or blockers logged yet.</p>
      <p class="text-[11px] text-slate-600">Use <kbd>Shift</kbd> + <kbd>Enter</kbd> in Tracker to add one.</p>
    </div>
  </section>
</template>
