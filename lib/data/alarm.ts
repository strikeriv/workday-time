import { type Storage } from "~interfaces/interfaces"
import { NotificationAlarm, Status, StorageKeys } from "~lib/constants"

import { clearNotificationData } from "./notifications"
import { getStorage, updateStorage } from "./storage"
import { calculateDayTimeWorked, calculateTotalTimeWorked } from "./time"

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
    if (existingAlarm) {
      if (!shouldRecreateAlarm) return
    }

    if (shouldRecreateAlarm) {
      console.log("Hours changed. Resetting alarm.")
    } else {
      console.log("Notifications enabled. Creating alarm.")
    }

    // we want the delay to happen to that the alarm is triggered exactly when the user clocks in
    // calcualte how many ms needed
    await chrome.alarms.create(NotificationAlarm, {
      periodInMinutes: 0.5, // every 30 seconds
      when: 0 // this means the alarm will trigger immediately
    })
  } else {
    console.log("Notifications disabled. Clearing alarm.")
    await clearNotificationData(NotificationAlarm)
    await chrome.alarms.clear(NotificationAlarm)
  }
}

export async function onClockedStatusChange(): Promise<void> {
  const { lastClockedTime, timeWorkedToday, timeWorkedThisWeek, status } =
    await getStorage()

  // update the values in storage when they clock in or out
  if (status === Status.Desynced) {
    console.warn("Status is desynced. Ignoring clock in/out request.")
    return
  }

  const isCheckingOut = status === Status.ClockedIn
  if (isCheckingOut) {
    console.log("Clocking out...")
  } else {
    console.log("Clocking in...")
  }

  const storagePayload = {
    [StorageKeys.LastClockedTime]: new Date().getTime(),
    [StorageKeys.LastUpdated]: new Date().getTime(),
    [StorageKeys.Status]: isCheckingOut ? Status.ClockedOut : Status.ClockedIn
  } as Partial<Storage>

  if (isCheckingOut) {
    // update time worked today and this week
    storagePayload[StorageKeys.TimeWorkedToday] = calculateDayTimeWorked(
      lastClockedTime,
      timeWorkedToday
    )
    storagePayload[StorageKeys.TimeWorkedThisWeek] = calculateTotalTimeWorked(
      lastClockedTime,
      timeWorkedThisWeek,
      true // we are clocking out
    )
  }

  // update values after clocking in or out
  await updateStorage(storagePayload)
}
