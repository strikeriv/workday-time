export enum StorageKeys {
  LastUpdated = "lastUpdated",
  ClockedInTime = "clockedInTime",
  TimeWorked = "timeWorked",
  Status = "status"
}

export enum DeductionPercentages {
  SocialSecurity = 0.062, // 6.2%
  Medicare = 0.0145, // 1.45%
  FederalWitholding = 0.06, // 6%
  StateTax = 0.023 // 2.3%
}
