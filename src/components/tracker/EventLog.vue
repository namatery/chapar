<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { useI18n } from '../../composables/useI18n'
import { useTrackerStore } from '../../stores/tracker'

const store = useTrackerStore()
const { showToast } = useToast()
const { formatDate, t } = useI18n()

function remove(eventId: string) {
  store.deleteEvent(eventId)
  showToast(t('toast.blockerRemoved'), 'neutral')
}
</script>

<template>
  <section class="panel overflow-hidden">
    <div class="section-header">
      <div>
        <div class="eyebrow text-blocker">{{ t('events.heading') }}</div>
        <p class="mt-1 text-xs text-slate-500">{{ t('events.subtitle') }}</p>
      </div>
    </div>

    <template v-if="store.eventsByMonth.length">
      <div v-for="month in store.eventsByMonth" :key="month.key" class="event-month">
        <div class="month-label">{{ month.label }}</div>
        <div class="divide-y divide-white/5">
          <article v-for="event in month.events" :key="event.id" class="event-row">
            <span class="status-dot status-dot--blocker mt-1.5 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm leading-6 text-slate-300" dir="auto">{{ event.text }}</p>
              <p class="mt-1 text-[11px] text-slate-600">
                {{ formatDate(event.timestamp, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                <template v-if="event.taskName"> · <span class="text-slate-500" dir="auto">{{ event.taskName }}</span></template>
                <template v-else> · {{ t('events.untagged') }}</template>
              </p>
            </div>
            <button class="icon-button danger-hover" type="button" :aria-label="t('events.deleteAria')" @click="remove(event.id)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" /></svg>
            </button>
          </article>
        </div>
      </div>
    </template>
    <div v-else class="empty-state">
      <div class="empty-state__mark text-blocker">!</div>
      <p>{{ t('events.empty') }}</p>
      <p class="text-[11px] text-slate-600" v-html="t('events.emptyHint')" />
    </div>
  </section>
</template>
