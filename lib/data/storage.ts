import { isSameDay, isSameWeek, type Duration } from "date-fns"

import { type Storage } from "~interfaces/interfaces"
import { NotificationAlarm, Status, StorageKeys } from "~lib/constants"

import { clearNotificationData } from "./notifications"

export async function getStorage(): Promise<Storage> {
  const keys = Object.values(StorageKeys) as StorageKeys[]
  let storage: Storage = (await chrome.storage.local.get(keys)) as Storage

  // check to see if values exist, if not, set them to default values
  if (!storage || !doStorageKeysExist(storage)) {
    storage = await createBaseStorage()
  }

  if (storage.debug === undefined || storage.debug !== true) {
    updateLogging(false)
  } else {
    updateLogging(true)
  }

  // validate data & update as necessary
  if (storage.lastClockedTime) {
    const lastClockedTimeData = new Date(storage.lastClockedTime)
    if (!isSameWeek(lastClockedTimeData, new Date())) {
      console.log("New Week, updating storage.")
      storage = await updateTimeOnNewWeek(storage)
    }

    if (!isSameDay(lastClockedTimeData, new Date())) {
      console.log("New Day, updating storage.")
      storage = await updateTimeOnNewDay(storage)
    }
  }

  return storage
}

export async function updateStorage(
  updates: Partial<Storage>
): Promise<Storage> {
  await chrome.storage.local.set(updates)

  return await getStorage()
}

export function doStorageKeysExist(storage: Storage): boolean {
  return Object.values(StorageKeys).every((key) => {
    if (key === StorageKeys.Debug) {
      // debug key is optional
      return true
    }

    return key in storage
  })
}

async function createBaseStorage(): Promise<Storage> {
  const storage: Storage = {
    [StorageKeys.LastUpdated]: Date.now(),
    [StorageKeys.LastClockedTime]: null,
    [StorageKeys.TimeWorkedToday]: {} as Duration,
    [StorageKeys.TimeWorkedThisWeek]: {} as Duration,
    [StorageKeys.HourlyRate]: null,
    [StorageKeys.Preferences]: {
      hoursToWork: 8,
      notificationsEnabled: false,
      k401DeductionEnabled: false,
      k401Percentage: 6
    },
    [StorageKeys.Status]: Status.Desynced
  }

  await chrome.storage.local.set(storage)
  return storage
}

async function updateTimeOnNewWeek(storage: Storage): Promise<Storage> {
  // reset time worked for the week
  storage.timeWorkedThisWeek = {} as Duration
  storage.timeWorkedToday = {} as Duration

  // update last updated time
  storage.lastUpdated = Date.now()

  await chrome.storage.local.set(storage)
  return storage
}

async function updateTimeOnNewDay(storage: Storage): Promise<Storage> {
  // reset time worked for the day
  storage.timeWorkedToday = {} as Duration

  // update last updated time
  storage.lastUpdated = Date.now()

  if (storage.status === Status.ClockedIn) {
    // if the user is clocked in, they're simply not
    // set status to desynced
    storage.status = Status.Desynced
  }

  await chrome.storage.local.set(storage)
  await clearNotificationData(NotificationAlarm)

  console.log(storage, "storage after clearing notification data")
  return storage
}

function updateLogging(isDebugEnabled: boolean): void {
  console.log("Debug mode is", isDebugEnabled ? "enabled." : "disabled.")
  if (!isDebugEnabled) {
    console.log = () => {}
  }
}
