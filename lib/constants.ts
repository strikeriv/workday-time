export enum StorageKeys {
  Preferences = "preferences",
  LastUpdated = "lastUpdated",
  ClockedTime = "clockedTime",
  TimeWorked = "timeWorked",
  Status = "status"
}

export const enum EventIds {
  ClockOut = "979",
  ClockIn = "976"
}

export enum DeductionPercentages {
  SocialSecurity = 0.062, // 6.2%
  Medicare = 0.0145, // 1.45%
  FederalWitholding = 0.06, // 6%
  StateTax = 0.023 // 2.3%
}
