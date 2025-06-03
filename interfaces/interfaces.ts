export interface Storage {
  lastUpdated: number
  clockedInTime: number
  timeWorked: TimeWorked
  status: Status
}

export enum Status {
  ClockedIn = "ClockedIn",
  ClockedOut = "ClockedOut"
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
