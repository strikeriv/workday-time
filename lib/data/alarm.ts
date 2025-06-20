import type { TimeWorked } from "~interfaces/interfaces"
import { NotificationAlarm, Status, StorageKeys } from "~lib/constants"

import { getStorage } from "./storage"
import { calculateTotalTimeWorked } from "./time"

interface AlarmOptions {
  shouldRecreateAlarm?: boolean
  delayInMinutes?: number
}

export async function evaluateAlarmStatus(
  notificationsEnabled: boolean,
  options?: AlarmOptions
): Promise<void> {
  const existingAlarm = await chrome.alarms.get(NotificationAlarm)
  const shouldRecreateAlarm = options?.shouldRecreateAlarm ?? false
  if (notificationsEnabled) {
    if (existingAlarm && shouldRecreateAlarm) return

    if (shouldRecreateAlarm) {
      console.log("Hours changed. Resetting alarm.")
    } else {
      console.log("Notifications enabled. Creating alarm.")
    }

    // we want the delay to happen to that the alarm is triggered exactly when the user clocks in
    // calcualte how many ms needed
    const delayInMinutes = options?.delayInMinutes ?? null // default to 30 seconds
    await chrome.alarms.create(NotificationAlarm, {
      periodInMinutes: 0.5, // every 30 seconds
      delayInMinutes
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

  if (isClockingIn) {
    const totalTimeWorked = calculateTotalTimeWorked(
      clockedTime,
      timeWorked,
      isClockingIn
    )
    const { timeWorkedHours, timeWorkedMinutes, timeWorkedSeconds } =
      totalTimeWorked

    return await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: new Date().getTime(),
      [StorageKeys.TimeWorked]: {
        hours: timeWorkedHours,
        minutes: timeWorkedMinutes,
        seconds: timeWorkedSeconds
      } as TimeWorked,
      [StorageKeys.Status]: Status.ClockedOut
    })
  } else {
    return await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: new Date().getTime(),
      [StorageKeys.Status]: Status.ClockedIn
    })
  }
}
