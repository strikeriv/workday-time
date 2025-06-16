import { Status } from "~interfaces/interfaces"
import { AutoModeKey, StorageKeys } from "~lib/constants"

import { getStorage } from "./storage"
import { calculateCurrentClockedInTime, calculateTotalTimeWorked } from "./time"

export async function evaluateAlarmStatus(autoModeEnabled: boolean) {
  const existingAlarm = await chrome.alarms.get(AutoModeKey)
  if (autoModeEnabled) {
    if (existingAlarm) return

    console.log("Auto mode enabled. Creating alarm.")
    await chrome.alarms.create(AutoModeKey, {
      periodInMinutes: 0.5, // every 30 seconds
      when: 1000
    })
  } else {
    console.log("Auto mode disabled. Clearing alarm.")
    await chrome.alarms.clear(AutoModeKey)
  }
}

export async function updateValuesOnClockedStatusChange(
  isClockingIn: boolean
): Promise<void> {
  const { clockedTime, timeWorked, status } = await getStorage()

  // update the values in storage when they clock in or out
  const currentClockedInTime = calculateCurrentClockedInTime(clockedTime)
  const totalTimeWorked = calculateTotalTimeWorked(
    clockedTime,
    timeWorked,
    isClockingIn
  )

  if (!isClockingIn) {
    // clocking out
    totalTimeWorked.timeWorkedHours += currentClockedInTime.clockedHours
    totalTimeWorked.timeWorkedHours += currentClockedInTime.clockedMinutes
    totalTimeWorked.timeWorkedHours += currentClockedInTime.clockedSeconds

    return await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: null, // not clocked in
      [StorageKeys.TimeWorked]: totalTimeWorked,
      [StorageKeys.Status]: Status.ClockedOut
    })
  } else {
    // clocking in
    return await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: new Date().getTime(), // not clocked in
      [StorageKeys.Status]: Status.ClockedIn
    })
  }
}
