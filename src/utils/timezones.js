import { formatInTimeZone } from 'date-fns-tz'

export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (GMT+0:00)' },

  { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (GMT-10:00)' },
  { value: 'America/Anchorage', label: 'America/Anchorage (GMT-9:00)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (GMT-8:00) - PST' },
  { value: 'America/Denver', label: 'America/Denver (GMT-7:00) - MST' },
  { value: 'America/Chicago', label: 'America/Chicago (GMT-6:00) - CST' },
  { value: 'America/New_York', label: 'America/New_York (GMT-5:00) - EST' },
  { value: 'America/Halifax', label: 'America/Halifax (GMT-4:00)' },
  { value: 'America/St_Johns', label: 'America/St_Johns (GMT-3:30)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (GMT-3:00)' },
  { value: 'Atlantic/Cape_Verde', label: 'Atlantic/Cape_Verde (GMT-1:00)' },

  { value: 'Europe/London', label: 'Europe/London (GMT+0:00) - GMT' },
  { value: 'Europe/Paris', label: 'Europe/Paris (GMT+1:00) - CET' },
  { value: 'Europe/Athens', label: 'Europe/Athens (GMT+2:00)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (GMT+3:00)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT+4:00)' },
  { value: 'Asia/Karachi', label: 'Asia/Karachi (GMT+5:00)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT+5:30)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6:00)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (GMT+7:00)' },

  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (GMT+8:00) - CST 中国' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (GMT+8:00) - HKT 香港' },
  { value: 'Asia/Taipei', label: 'Asia/Taipei (GMT+8:00) - 台北' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8:00) - 新加坡' },

  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9:00) - JST 日本' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (GMT+9:00) - KST 韩国' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (GMT+10:00) - AEST' },
  { value: 'Australia/Melbourne', label: 'Australia/Melbourne (GMT+10:00)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (GMT+12:00) - NZST' },
]

export function getTimezoneOffset(timezone) {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    })

    const parts = formatter.formatToParts(now)
    const offsetPart = parts.find(part => part.type === 'timeZoneName')

    if (offsetPart) {
      return offsetPart.value
    }

    const formatted = formatInTimeZone(now, timezone, 'XXX')
    return `GMT${formatted}`
  } catch (error) {
    return ''
  }
}

export function getTimezoneLabel(timezone) {
  const offset = getTimezoneOffset(timezone)
  return `${timezone} (${offset})`
}

export function getAllTimezones() {
  return COMMON_TIMEZONES
}

export function groupTimezonesByRegion() {
  return {
    'Americas': COMMON_TIMEZONES.filter(tz =>
      tz.value.startsWith('America/') || tz.value.startsWith('Pacific/Honolulu')
    ),
    'Europe & Africa': COMMON_TIMEZONES.filter(tz =>
      tz.value.startsWith('Europe/') || tz.value.startsWith('Atlantic/')
    ),
    'Asia': COMMON_TIMEZONES.filter(tz =>
      tz.value.startsWith('Asia/')
    ),
    'Pacific': COMMON_TIMEZONES.filter(tz =>
      tz.value.startsWith('Australia/') || tz.value.startsWith('Pacific/') && !tz.value.includes('Honolulu')
    ),
    'UTC': COMMON_TIMEZONES.filter(tz => tz.value === 'UTC')
  }
}
