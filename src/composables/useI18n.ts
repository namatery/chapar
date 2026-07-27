import { useLocalStorage } from '@vueuse/core'
import { computed, watchEffect } from 'vue'

export type Locale = 'en' | 'fa'

const STORAGE_KEY = 'chapar:locale'

const en = {
  'meta.title': 'Chapar — task & time tracker',
  'app.name': 'CHAPAR',
  'app.view': 'Application view',
  'language.switchTo': 'Switch to Persian',
  'language.button': 'فارسی',
  'settings.open': 'Open settings',
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'tabs.tracker': 'Tracker',
  'tabs.events': 'Events',
  'tabs.dashboard': 'Dashboard',
  'capture.placeholder': 'What are you working on?',
  'capture.aria': 'Create a task or log a blocker',
  'capture.blocker': 'BLOCKER ↵',
  'capture.task': 'TASK ↵',
  'capture.shortcut': '<kbd>/</kbd> to focus · <kbd>Enter</kbd> starts a task · <kbd>Shift</kbd> + <kbd>Enter</kbd> logs an event',
  'status.onAir': 'ON AIR',
  'status.idle': 'SYSTEM IDLE',
  'status.startPrompt': 'Start a task to begin tracking',
  'actions.pause': 'Pause',
  'actions.pauseHint': 'Bank elapsed time and pause',
  'actions.float': 'Float',
  'tasks.heading': 'TASK QUEUE',
  'tasks.records': '{count} active records',
  'tasks.cancel': 'Cancel',
  'tasks.selecting': 'Selecting',
  'tasks.combine': 'Combine',
  'tasks.combineHint': 'Track two or more tasks together',
  'tasks.created': 'CREATED {date}',
  'tasks.switchHint': 'Press {number} to switch',
  'tasks.empty': 'No tasks yet. Type above and press Enter.',
  'tasks.selected': '{count} selected · minimum 2',
  'tasks.startCombo': 'Start combo',
  'delete.aria': 'Delete {name}',
  'delete.eyebrow': 'DESTRUCTIVE ACTION',
  'delete.title': 'Delete “{name}”?',
  'delete.description': 'The task and its total disappear. Historical combo and blocker snapshots stay intact.',
  'delete.cancel': 'Cancel',
  'delete.confirm': 'Delete task',
  'combo.live': 'COMBO LIVE',
  'combo.stop': 'Split & stop',
  'combo.sessions': 'COMBO SESSIONS',
  'combo.editHint': 'Edit minutes; the final row balances automatically.',
  'combo.deletedTask': '(deleted task)',
  'combo.minutesAria': 'Minutes allocated to {name}',
  'combo.minutesShort': 'min',
  'events.heading': 'EVENTS & BLOCKERS',
  'events.subtitle': 'Operational friction, captured in the moment.',
  'events.untagged': 'untagged',
  'events.deleteAria': 'Delete blocker',
  'events.empty': 'No events or blockers logged yet.',
  'events.emptyHint': 'Use <kbd>Shift</kbd> + <kbd>Enter</kbd> in Tracker to add one.',
  'dashboard.timePerTask': 'TIME PER TASK',
  'dashboard.whereHoursWent': 'Where the hours went',
  'dashboard.lifetimeHint': 'Lifetime totals, including the session currently running.',
  'dashboard.last14Days': 'LAST 14 DAYS',
  'dashboard.dailyTime': 'Daily operating time',
  'dashboard.blockersPerWeek': 'BLOCKERS PER ISO WEEK',
  'dashboard.frictionTrend': 'Friction trend',
  'dashboard.activitySignal': 'ACTIVITY SIGNAL',
  'dashboard.twelveWeekPulse': 'Twelve-week pulse',
  'dashboard.intensityHint': 'Intensity reflects tracked hours per day.',
  'dashboard.hours': 'Hours',
  'dashboard.blockers': 'Blockers',
  'dashboard.emptyTaskTime': 'Tracked task time will appear here.',
  'dashboard.heatmapAria': 'Daily tracked-time heatmap',
  'dashboard.less': 'Less',
  'dashboard.more': 'More',
  'pip.idle': 'CHAPAR · IDLE',
  'pip.empty': 'Create a task in the main window first.',
  'pip.title': 'Chapar controls',
  'toast.blockerLogged': 'Logged as blocker',
  'toast.taskStarted': 'Task started',
  'toast.taskSwitched': 'Switched task',
  'toast.comboStarted': 'Combo started',
  'toast.taskDeleted': 'Task deleted',
  'toast.comboSaved': 'Combo split and saved',
  'toast.timerPaused': 'Timer paused',
  'toast.comboUpdated': 'Combo split updated',
  'toast.blockerRemoved': 'Blocker removed',
  'toast.floatUnsupported': 'Floating window is not supported here',
  'toast.floatOpened': 'Floating controls opened',
  'toast.floatFailed': 'Could not open floating controls',
} as const

type MessageKey = keyof typeof en

const fa: Record<MessageKey, string> = {
  'meta.title': 'چاپار — مدیریت کار و زمان',
  'app.name': 'چاپار',
  'app.view': 'نمای برنامه',
  'language.switchTo': 'تغییر زبان به انگلیسی',
  'language.button': 'English',
  'settings.open': 'باز کردن تنظیمات',
  'settings.title': 'تنظیمات',
  'settings.language': 'زبان',
  'tabs.tracker': 'پیگیری',
  'tabs.events': 'رویدادها',
  'tabs.dashboard': 'داشبورد',
  'capture.placeholder': 'مشغول چه کاری هستید؟',
  'capture.aria': 'ساخت کار یا ثبت مانع',
  'capture.blocker': 'مانع ↵',
  'capture.task': 'کار ↵',
  'capture.shortcut': '<kbd>/</kbd> برای ورود · <kbd>Enter</kbd> برای شروع کار · <kbd>Shift</kbd> + <kbd>Enter</kbd> برای ثبت رویداد',
  'status.onAir': 'در حال اجرا',
  'status.idle': 'سامانه آماده است',
  'status.startPrompt': 'برای شروع زمان‌گیری یک کار را آغاز کنید',
  'actions.pause': 'توقف',
  'actions.pauseHint': 'ثبت زمان سپری‌شده و توقف',
  'actions.float': 'پنجره شناور',
  'tasks.heading': 'فهرست کارها',
  'tasks.records': '{count} کار فعال',
  'tasks.cancel': 'لغو',
  'tasks.selecting': 'در حال انتخاب',
  'tasks.combine': 'ترکیب',
  'tasks.combineHint': 'پیگیری هم‌زمان دو یا چند کار',
  'tasks.created': 'ساخته‌شده در {date}',
  'tasks.switchHint': 'برای رفتن به این کار، {number} را بزنید',
  'tasks.empty': 'هنوز کاری ندارید. بالا بنویسید و Enter را بزنید.',
  'tasks.selected': '{count} انتخاب‌شده · حداقل ۲ مورد',
  'tasks.startCombo': 'شروع ترکیبی',
  'delete.aria': 'حذف {name}',
  'delete.eyebrow': 'عملیات برگشت‌ناپذیر',
  'delete.title': '«{name}» حذف شود؟',
  'delete.description': 'این کار و زمان کل آن حذف می‌شود. سابقهٔ کارهای ترکیبی و موانع دست‌نخورده می‌ماند.',
  'delete.cancel': 'لغو',
  'delete.confirm': 'حذف کار',
  'combo.live': 'ترکیب در حال اجرا',
  'combo.stop': 'تقسیم و توقف',
  'combo.sessions': 'جلسه‌های ترکیبی',
  'combo.editHint': 'دقیقه‌ها را ویرایش کنید؛ ردیف آخر خودکار تراز می‌شود.',
  'combo.deletedTask': '(کار حذف‌شده)',
  'combo.minutesAria': 'دقیقهٔ اختصاص‌یافته به {name}',
  'combo.minutesShort': 'دقیقه',
  'events.heading': 'رویدادها و موانع',
  'events.subtitle': 'اصطکاک‌های کاری، همان لحظه که رخ می‌دهند.',
  'events.untagged': 'بدون برچسب',
  'events.deleteAria': 'حذف مانع',
  'events.empty': 'هنوز رویداد یا مانعی ثبت نشده است.',
  'events.emptyHint': 'در بخش پیگیری، <kbd>Shift</kbd> + <kbd>Enter</kbd> را بزنید.',
  'dashboard.timePerTask': 'زمان هر کار',
  'dashboard.whereHoursWent': 'زمانتان کجا صرف شده است',
  'dashboard.lifetimeHint': 'مجموع کل، با احتساب جلسه‌ای که اکنون در حال اجراست.',
  'dashboard.last14Days': '۱۴ روز گذشته',
  'dashboard.dailyTime': 'زمان فعالیت روزانه',
  'dashboard.blockersPerWeek': 'موانع در هر هفته',
  'dashboard.frictionTrend': 'روند موانع',
  'dashboard.activitySignal': 'نمای فعالیت',
  'dashboard.twelveWeekPulse': 'نبض دوازده‌هفته‌ای',
  'dashboard.intensityHint': 'شدت رنگ، ساعت‌های ثبت‌شده در هر روز را نشان می‌دهد.',
  'dashboard.hours': 'ساعت',
  'dashboard.blockers': 'موانع',
  'dashboard.emptyTaskTime': 'زمان کارهای پیگیری‌شده اینجا نمایش داده می‌شود.',
  'dashboard.heatmapAria': 'نمودار روزانهٔ زمان پیگیری‌شده',
  'dashboard.less': 'کمتر',
  'dashboard.more': 'بیشتر',
  'pip.idle': 'چاپار · آماده',
  'pip.empty': 'ابتدا در پنجرهٔ اصلی یک کار بسازید.',
  'pip.title': 'کنترل‌های چاپار',
  'toast.blockerLogged': 'به‌عنوان مانع ثبت شد',
  'toast.taskStarted': 'کار آغاز شد',
  'toast.taskSwitched': 'کار تغییر کرد',
  'toast.comboStarted': 'کار ترکیبی آغاز شد',
  'toast.taskDeleted': 'کار حذف شد',
  'toast.comboSaved': 'زمان ترکیبی تقسیم و ذخیره شد',
  'toast.timerPaused': 'زمان‌گیری متوقف شد',
  'toast.comboUpdated': 'تقسیم زمان ترکیبی به‌روز شد',
  'toast.blockerRemoved': 'مانع حذف شد',
  'toast.floatUnsupported': 'پنجرهٔ شناور در این مرورگر پشتیبانی نمی‌شود',
  'toast.floatOpened': 'کنترل‌های شناور باز شد',
  'toast.floatFailed': 'باز کردن کنترل‌های شناور ممکن نشد',
}

const messages: Record<Locale, Record<MessageKey, string>> = { en, fa }
const locale = useLocalStorage<Locale>(STORAGE_KEY, 'en')

function t(key: MessageKey, params: Record<string, string | number> = {}): string {
  const template = messages[locale.value][key]
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`))
}

function formatDate(date: Date | number, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', options).format(date)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

export function useI18n() {
  const direction = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr')

  function toggleLocale() {
    locale.value = locale.value === 'en' ? 'fa' : 'en'
  }

  return { direction, formatDate, formatNumber, locale, t, toggleLocale }
}

export function syncDocumentLocale() {
  watchEffect(() => {
    document.documentElement.lang = locale.value
    document.documentElement.dir = locale.value === 'fa' ? 'rtl' : 'ltr'
    document.title = t('meta.title')
  })
}
