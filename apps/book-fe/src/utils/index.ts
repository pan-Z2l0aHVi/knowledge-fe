import dayjs from 'dayjs'

const { t } = await import('i18next')

export const format_time = (timing: number | string): string => {
  const date = dayjs(timing)
  if (!date.isValid()) {
    return String(timing)
  }
  const now = dayjs()
  const formatter = 'HH:mm'

  const minutes_ago = now.diff(date, 'minute')
  if (minutes_ago < 1) {
    return `${t('time.just')}`
  }
  if (minutes_ago < 60) {
    return `${t('time.minutes_ago', { count: minutes_ago })}`
  }
  const hours_ago = now.diff(date, 'hour')
  if (hours_ago < 6) {
    return `${t('time.hours_ago', { count: hours_ago })}`
  }
  if (date.isSame(now, 'day')) {
    return `${t('time.today')} ${date.format(formatter)}`
  }
  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `${t('time.yesterday')} ${date.format(formatter)}`
  }
  if (date.isSame(now.subtract(2, 'day'), 'day')) {
    return `${t('time.before_yesterday')} ${date.format(formatter)}`
  }
  if (date.isSame(now, 'year')) {
    return date.format(`${t('time.month_date')} ${formatter}`)
  }
  return date.format(`${t('time.year_date')} ${formatter}`)
}

export function format_file_size(size: number) {
  if (size > 1024 * 1024) {
    return `${parse_file_size_mb(size).toFixed(1)} MB`
  }
  return `${parse_file_size_kb(size).toFixed(1)} KB`
}

export function parse_file_size_kb(size: number) {
  const fileSizeInBytes = size
  return fileSizeInBytes / 1024
}

export function parse_file_size_mb(size: number) {
  const fileSizeInKB = parse_file_size_kb(size)
  return fileSizeInKB / 1024
}

export async function initHlsLangs() {
  const { loadLanguages } = await import('@youknown/react-rte/src/utils/load-langs')
  await loadLanguages()
}
