import type { Duration } from "date-fns"

import type { Status } from "~lib/constants"

export interface Storage {
  lastUpdated: number // last time the storage was updated, in milliseconds
  lastClockedTime: number // last time the user clocked in or out, in milliseconds
  timeWorkedToday: Duration // total time worked today, in hours and minutes
  timeWorkedThisWeek: Duration // total time worked, in hours and minutes
  hourlyRate: number // user's hourly rate, in dollars
  preferences: Preferences // preferences
  status: Status // current status of the user, whether they are clocked in or out
}

export interface Preferences {
  hoursToWork: number
  notificationsEnabled: boolean
  k401DeductionEnabled: boolean
  k401Percentage: number
}
