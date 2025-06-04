import { Status, type Storage } from "~interfaces/interfaces"
import { StorageKeys } from "~lib/constants"

export async function getStorage(): Promise<Storage> {
  let storage: Storage = (await chrome.storage.local.get([
    StorageKeys.ClockedTime,
    StorageKeys.TimeWorked,
    StorageKeys.Preferences,
    StorageKeys.LastUpdated,
    StorageKeys.Status
  ])) as Storage

  // check to see if values exist, if not, set them to default values
  if (!storage[StorageKeys.ClockedTime] || !storage[StorageKeys.TimeWorked]) {
    storage = {
      [StorageKeys.Preferences]: {
        hoursToWork: 8,
        autoModeEnabled: false,
        k401DeductionEnabled: false,
        k401Percentage: 6
      },
      [StorageKeys.LastUpdated]: Date.now(),
      [StorageKeys.ClockedTime]: null,
      [StorageKeys.TimeWorked]: null,
      [StorageKeys.Status]: Status.Unknown
    }

    await chrome.storage.local.set(storage)
  }

  return storage
}
