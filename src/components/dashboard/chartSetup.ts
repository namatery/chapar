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

export const gridColor = 'rgba(148, 163, 184, 0.08)'
export const tickColor = '#64748b'
export function chartFontFamily(locale: Locale): string {
  return locale === 'fa'
    ? 'Vazirmatn, Tahoma, sans-serif'
    : 'Inter, ui-sans-serif, system-ui, sans-serif'
}
