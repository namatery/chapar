export function elapsedSeconds(startTs: number | null, endTs: number): number {
  if (startTs === null) return 0
  return Math.max(0, Math.floor((endTs - startTs) / 1000))
}

export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatMinutes(totalSeconds: number): string {
  const minutes = totalSeconds / 60
  return minutes < 10 ? `${minutes.toFixed(1)}m` : `${Math.round(minutes)}m`
}

export function minutesInputValue(totalSeconds: number): string {
  return (totalSeconds / 60).toFixed(2).replace(/\.00$/, '')
}

export function id(prefix: string): string {
  const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${value}`
}
