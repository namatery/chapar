# Chapar

A fast, local-first task and time tracker for one person and one browser. Chapar supports live task timers, blocker notes, concurrent combo sessions with editable splits, and an activity dashboard. Data stays in `localStorage`; there is no backend or account.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run typecheck
npm test
npm run build
```

## Shortcuts

- `/` focuses the capture bar.
- `Enter` creates and starts a task.
- `Shift+Enter` logs an event or blocker.
- `Tab` switches between the last two active tasks.
- `1`, `2`, or `3` switches to the corresponding recent task.

The optional floating controls use the Document Picture-in-Picture API and are currently available in supporting Chromium browsers.
