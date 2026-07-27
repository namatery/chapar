export interface Task {
  id: string
  name: string
  totalSeconds: number
  createdAt: number
}

export interface EventLog {
  id: string
  text: string
  timestamp: number
  taskName: string | null
}

export interface ComboSession {
  taskIds: string[]
  startTs: number
}

export interface ComboLogEntry {
  id: string
  taskIds: string[]
  names: Record<string, string>
  totalSeconds: number
  splitSeconds: Record<string, number>
  createdAt: number
}

export interface WorkSession {
  id: string
  kind: 'single' | 'combo'
  taskIds: string[]
  startTs: number
  endTs: number
  totalSeconds: number
}

export interface AppState {
  version: 1
  tasks: Task[]
  activeId: string | null
  activeStartTs: number | null
  recentIds: string[]
  previousActiveId: string | null
  events: EventLog[]
  combo: ComboSession | null
  comboLog: ComboLogEntry[]
  workSessions: WorkSession[]
}

export interface TimeDatum {
  id: string
  label: string
  seconds: number
}

export interface DateDatum {
  date: string
  label: string
  seconds: number
}

export interface CountDatum {
  date: string
  label: string
  count: number
}

export interface EventMonth {
  key: string
  label: string
  events: EventLog[]
}
