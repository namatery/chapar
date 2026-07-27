# Chapar Agent Guide

## Project overview

Chapar is a local-first personal task and time tracker. It is intentionally optimized for fast capture and keyboard-driven switching during a busy workday. It has no backend, authentication, accounts, or multi-user behavior. All user data is stored in the browser.

Keep changes within the existing product direction unless the user explicitly expands the scope.

## Technology

- Vue 3 using `<script setup lang="ts">`
- Vite
- Tailwind CSS v4
- Pinia setup stores
- VueUse composables
- Reka UI headless primitives
- Chart.js through `vue-chartjs`
- `date-fns` for date formatting and bucketing
- Vitest with Happy DOM

Do not introduce a backend or a styled component framework. Prefer the existing dependencies and patterns before adding packages.

## Code discovery

This repository is indexed by codebase-memory-mcp. When its graph tools are available, use them before filesystem search:

1. `search_graph` to find functions, interfaces, and modules.
2. `trace_path` to inspect callers and callees.
3. `get_code_snippet` to read a specific graph symbol.
4. `query_graph` for complex relationships.
5. `get_architecture` for a high-level overview.

Use text search for literal UI copy, configuration, Markdown, CSS, and cases the graph does not cover. Refresh the graph after material architectural changes.

## Important files

- `src/stores/tracker.ts`: all persisted state, timer transitions, combo allocation, and reusable dashboard aggregations.
- `src/types/tracker.ts`: persisted and view-model types.
- `src/utils/time.ts`: duration calculations, formatting, and identifiers.
- `src/components/tracker/`: capture, tasks, combos, blockers, and floating controls.
- `src/components/dashboard/`: charts and activity heatmap.
- `src/components/AppTabs.vue`: top-level Tracker/Dashboard tabs.
- `src/style.css`: the complete control-room visual system.
- `src/stores/tracker.spec.ts`: timer and persistence invariant tests.

## State invariants

Treat these as non-negotiable:

- An individual task timer and a combo session must never run simultaneously.
- Bank the active task before switching, pausing, starting a combo, or deleting that active task.
- Stop and split a running combo before starting an individual task.
- `Task.totalSeconds` contains completed/banked time only. Live display totals are computed without mutating persisted totals every second.
- The one-second VueUse timer updates transient `now`; do not write to `localStorage` every tick.
- Completed `WorkSession` records drive daily dashboard history. Editing an old combo split must not move or change the total time recorded for that day.
- Combo allocations use integer seconds and must always sum exactly to the original combo duration.
- In a combo edit, the final task is the computed remainder. Update affected task totals by allocation delta rather than recomputing all historical totals.
- Preserve event task names and combo task names as snapshots. Historical entries must remain understandable after a task is deleted.
- Keep `recentIds` unique, most-recent first, and limited to six valid task IDs.
- Normalize persisted state on load so stale task IDs cannot produce simultaneous or invalid running state.

When changing any timer transition, add or update a store test before changing presentation components.

## Keyboard contract

The capture shortcuts are deliberately minimal:

- `/` focuses the capture input when the user is not already typing.
- `Enter` creates a task and immediately starts it.
- `Shift+Enter` records an event or blocker.
- `Tab` switches between the two most recently active tasks when focus is outside a form field.
- `1`, `2`, and `3` switch to the corresponding MRU task.

Do not restore `N` as a focus shortcut or a leading `!` as blocker syntax unless explicitly requested. Global shortcuts must ignore editable elements and standard modifier combinations.

## UI conventions

- Preserve the dark, single-column, mobile-first control-room aesthetic.
- Use the existing semantic accents consistently: green for live tracking, rose for blockers, and violet for combos.
- Timers must use tabular monospace numerals.
- Routine actions stay inline and non-blocking. Task deletion uses the existing Reka UI dialog.
- Use Reka UI for tabs, dialogs, and tooltips instead of hand-rolled accessibility primitives.
- Prefer VueUse for storage, intervals, keyboard handling, and toggles.
- Keep aggregation logic in `useTrackerStore`; chart components should only translate store getters into presentation data.
- Use `date-fns` for all date grouping and formatting.
- Feature-detect Document Picture-in-Picture and preserve the graceful unsupported-browser toast.
- Keep TypeScript strict and do not introduce `any`.

## Development workflow

Install and run:

```sh
npm install
npm run dev
```

Before handing off a change, run:

```sh
npm run typecheck
npm test
npm run build
git diff --check
```

For visual changes, also inspect the narrow mobile layout. Add focused store tests for timer, combo, deletion, persistence, and date-aggregation changes. Do not use `npm audit fix --force` or make breaking dependency upgrades without explicit approval.

## Scope boundaries

Do not add accounts, remote synchronization, calendar scheduling, Pomodoro behavior, or automatic daily resets unless requested. Preserve the single-user, one-browser, near-zero-friction experience.
