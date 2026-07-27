import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import type { Locale } from '../../composables/useI18n'
import type { Theme } from '../../composables/useTheme'

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

export function chartColors(theme: Theme) {
  return theme === 'light'
    ? { blocker: '#cf3655', grid: 'rgba(15, 23, 42, 0.08)', live: '#07885f', muted: '#475569', tick: '#64748b' }
    : { blocker: '#ff5f7e', grid: 'rgba(148, 163, 184, 0.08)', live: '#35e6a4', muted: '#94a3b8', tick: '#64748b' }
}

export function chartFontFamily(locale: Locale): string {
  return locale === 'fa'
    ? 'Vazirmatn, Tahoma, sans-serif'
    : 'Inter, ui-sans-serif, system-ui, sans-serif'
}
