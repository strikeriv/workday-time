import { NotificationAlarm, Status, StorageKeys } from "~lib/constants"

import { getStorage } from "./storage"
import { calculateCurrentClockedInTime, calculateTotalTimeWorked } from "./time"

export async function evaluateAlarmStatus(autoModeEnabled: boolean) {
  const existingAlarm = await chrome.alarms.get(NotificationAlarm)
  if (autoModeEnabled) {
    if (existingAlarm) return

    console.log("Notifications enabled. Creating alarm.")
    await chrome.alarms.create(NotificationAlarm, {
      periodInMinutes: 0.5 // every 30 seconds
    })
  } else {
    console.log("Notifications disabled. Clearing alarm.")
    await chrome.alarms.clear(NotificationAlarm)
  }
}

export async function updateValuesOnClockedStatusChange(): Promise<void> {
  const { clockedTime, timeWorked, status } = await getStorage()

  // update the values in storage when they clock in or out
  if (status === Status.Desynced) {
    console.warn("Status is desynced. Ignoring clock in/out request.")
    return
  }

  const isClockingIn = status === Status.ClockedIn
  if (isClockingIn) {
    console.log("Clocking in...")
  } else {
    console.log("Clocking out...")
  }

  const currentClockedInTime = calculateCurrentClockedInTime(clockedTime)
  const totalTimeWorked = calculateTotalTimeWorked(
    clockedTime,
    timeWorked,
    isClockingIn
  )

  if (isClockingIn) {
    // clocking out
    totalTimeWorked.timeWorkedHours += currentClockedInTime.clockedHours
    totalTimeWorked.timeWorkedHours += currentClockedInTime.clockedMinutes
    totalTimeWorked.timeWorkedHours += currentClockedInTime.clockedSeconds

    return await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: undefined, // not clocked in
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
