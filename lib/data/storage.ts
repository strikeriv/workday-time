import { type Storage, type TimeWorked } from "~interfaces/interfaces"
import { Status, StorageKeys } from "~lib/constants"

export async function getStorage(): Promise<Storage> {
  const keys = Object.values(StorageKeys) as StorageKeys[]
  let storage: Storage = (await chrome.storage.local.get(keys)) as Storage

  // check to see if values exist, if not, set them to default values
  if (!storage || !doStorageKeysExist(storage)) {
    storage = {
      [StorageKeys.Preferences]: {
        hoursToWork: 8,
        notificationsEnabled: false,
        k401DeductionEnabled: false,
        k401Percentage: 6
      },
      [StorageKeys.LastUpdated]: Date.now(),
      [StorageKeys.ClockedTime]: null,
      [StorageKeys.TimeWorked]: {
        hours: 0,
        minutes: 0,
        seconds: 0
      } as TimeWorked,
      [StorageKeys.Status]: Status.Desynced
    }

    await chrome.storage.local.set(storage)
  }

  return storage
}

export function doStorageKeysExist(storage: Storage): boolean {
  return Object.values(StorageKeys).every((key) => key in storage)
}
