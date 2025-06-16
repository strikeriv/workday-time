import type { Status } from "~lib/constants"

export interface Storage {
  lastUpdated: number // used to determine if the data is stale
  preferences: Preferences // setting preferences
  clockedTime: number // when the user clocked in, in milliseconds
  timeWorked: TimeWorked // total time worked, in hours and minutes
  status: Status // current status of the user, whether they are clocked in or out
}

export interface Preferences {
  hoursToWork: number
  autoModeEnabled: boolean
  k401DeductionEnabled: boolean
  k401Percentage: number
}

export interface TimeWorked {
  hours: number
  minutes: number
  seconds: number
}

export interface ClockedDuration {
  clockedHours: number
  clockedMinutes: number
  clockedSeconds: number
}

export interface TotalTimeDuration {
  timeWorkedHours: number
  timeWorkedMinutes: number
  timeWorkedSeconds: number
}
