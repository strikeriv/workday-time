import { NotificationStorageKey } from "~lib/constants"

export enum NotificationRangeIds {
  Minute15Warning = "minute-15-warning",
  Minute5Warning = "minute-5-warning",
  Minute1Warning = "minute-1-warning",
  OverTimeWarning = "over-time-warning"
}

const MinuteNotificationRanges = [
  {
    id: NotificationRangeIds.Minute15Warning,
    start: 5,
    end: 15,
    dismissable: true
  }, // 5 to 15 minutes left
  {
    id: NotificationRangeIds.Minute5Warning,
    start: 1,
    end: 5,
    dismissable: true
  }, // 1 to 5 minutes left
  {
    id: NotificationRangeIds.Minute1Warning,
    start: 0,
    end: 1,
    dismissable: true
  }, // 0 to 1 minute left
  {
    id: NotificationRangeIds.OverTimeWarning,
    start: -60,
    end: 0,
    dismissable: false
  } // past clock out time
]

export interface NotificationData {
  notificationId: NotificationRangeIds
  timestamp: number
  dismissable: boolean
}

export async function setNotificationData(id: string, data: NotificationData) {
  const storageData =
    (await chrome.storage.local.get(NotificationStorageKey))[
      NotificationStorageKey
    ] ?? {}
  storageData[id] = data
  await chrome.storage.local.set({ [NotificationStorageKey]: data })
}

export async function getNotificationData(
  id: string
): Promise<NotificationData | undefined> {
  const data =
    (await chrome.storage.local.get(NotificationStorageKey))[
      NotificationStorageKey
    ] ?? {}
  return data
}

export async function clearNotificationData(id: string) {
  const data =
    (await chrome.storage.local.get(NotificationStorageKey))[
      NotificationStorageKey
    ] ?? {}
  delete data[id]
  await chrome.storage.local.set({ [NotificationStorageKey]: data })
}

export function getNotificationRange(id: NotificationRangeIds) {
  return MinuteNotificationRanges.find((range) => range.id === id)
}

export function isWithinNotificationRange(
  notificationId: NotificationRangeIds,
  durationLeft: number
): boolean {
  const range = getNotificationRange(notificationId)
  if (!range) return false
  return durationLeft >= range.start && durationLeft <= range.end
}

export function findNotificationIdByDuration(
  durationLeft: number
): NotificationRangeIds | undefined {
  return MinuteNotificationRanges.find(
    (range) => durationLeft >= range.start && durationLeft <= range.end
  )?.id
}
