export interface Storage {
  preferences: Preferences
  lastUpdated: number
  clockedInTime: number
  timeWorked: TimeWorked
  status: Status
}
export interface Preferences {
  hoursToWork: number
  autoModeEnabled: boolean
  k401DeductionEnabled: boolean
  k401Percentage: number
}

export enum Status {
  ClockedIn = "ClockedIn",
  ClockedOut = "ClockedOut",
  Unknown = "Unknown"
}

export interface TimeWorked {
  hours: number
  minutes: number
}

export interface ClockedInDuration {
  clockedInHours: number
  clockedInMinutes: number
  clockedInSeconds: number
}

export interface TotalTimeDuration {
  timeWorkedHours: number
  timeWorkedMinutes: number
  timeWorkedSeconds: number
}
