import { NotificationAlarm, Status, StorageKeys } from "~lib/constants"

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

export async function updateStorageOnClockedStatusChange(): Promise<void> {
  const { lastClockedTime, timeWorkedToday, timeWorkedThisWeek, status } =
    await getStorage()

  // update the values in storage when they clock in or out
  if (status === Status.Desynced) {
    console.warn("Status is desynced. Ignoring clock in/out request.")
    return
  }

  const isClockingIn = status !== Status.ClockedIn
  if (isClockingIn) {
    console.log("Clocking in...")
  } else {
    console.log("Clocking out...")
  }

  // we need to handle multiple clock out / clock in per day
  // increment the time worked daily when clocking in
  // and increment the total time worked when clocking out
  console.log(isClockingIn, "hmmmm")
  if (isClockingIn) {
    // we are clocking in
    console.log(
      {
        [StorageKeys.LastClockedTime]: new Date().getTime(),
        [StorageKeys.TimeWorkedToday]: calculateDayTimeWorked(
          lastClockedTime,
          timeWorkedToday
        ),
        [StorageKeys.TimeWorkedThisWeek]: calculateTotalTimeWorked(
          lastClockedTime,
          timeWorkedThisWeek,
          isClockingIn
        ),
        [StorageKeys.Status]: Status.ClockedIn
      },
      "somethin else"
    )

    await updateStorage({
      [StorageKeys.LastClockedTime]: new Date().getTime(),
      // [StorageKeys.TimeWorkedToday]: calculateDayTimeWorked(
      //   lastClockedTime,
      //   timeWorkedToday
      // ),
      // [StorageKeys.TimeWorkedThisWeek]: calculateTotalTimeWorked(
      //   lastClockedTime,
      //   timeWorkedThisWeek,
      //   isClockingIn
      // ),
      [StorageKeys.Status]: Status.ClockedOut
    })
  } else {
    // we are clocking out

    // set time worked daily to the current time worked
    // plus the time currently worked today
    await updateStorage({
      [StorageKeys.LastClockedTime]: new Date().getTime(),
      [StorageKeys.TimeWorkedToday]: calculateDayTimeWorked(
        lastClockedTime,
        timeWorkedToday
      ),
      [StorageKeys.Status]: Status.ClockedIn
    })
  }
}
