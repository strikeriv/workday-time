export const NotificationAlarm = "notification-alarm"
export const NotificationStorageKey = "notifications"

export enum StorageKeys {
  LastUpdated = "lastUpdated",
  LastClockedTime = "lastClockedTime",
  TimeWorkedToday = "timeWorkedToday",
  TimeWorkedThisWeek = "timeWorkedThisWeek",
  HourlyRate = "hourlyRate",
  Preferences = "preferences",
  Status = "status"
}

export enum Status {
  ClockedIn = "ClockedIn",
  ClockedOut = "ClockedOut",
  Desynced = "Desynced"
}

export enum DeductionPercentages {
  SocialSecurity = 0.062, // 6.2%
  Medicare = 0.0145, // 1.45%
  FederalWitholding = 0.06, // 6%
  StateTax = 0.023 // 2.3%
}
