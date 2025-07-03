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
    time: 15,
    dismissable: true
  }, // 15 minutes left
  {
    id: NotificationRangeIds.Minute5Warning,
    time: 5,
    dismissable: true
  }, // 5 minutes left
  {
    id: NotificationRangeIds.Minute1Warning,
    time: 1,
    dismissable: true
  }, // 1 minute left
  {
    id: NotificationRangeIds.OverTimeWarning,
    time: 0,
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

export function findNotificationIdByDuration(
  durationLeft: number
): NotificationRangeIds | undefined {
  console.log(durationLeft, "duration left")
  const dismissableRange = MinuteNotificationRanges.find(
    (range) => range.dismissable && durationLeft === range.time
  )
  if (dismissableRange) return dismissableRange.id

  const overtimeRange = MinuteNotificationRanges.find(
    (range) => !range.dismissable && durationLeft < range.time
  )
  console.log(overtimeRange, "overtime range")
  if (overtimeRange) {
    if (Math.abs(durationLeft) < 30) return overtimeRange.id
  }

  return undefined
}
