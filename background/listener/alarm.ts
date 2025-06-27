import { sendNotification } from "~background/util/notifications"
import { NotificationAlarm } from "~lib/constants"
import {
  findNotificationIdByDuration,
  getNotificationRange
} from "~lib/data/notifications"
import { getStorage } from "~lib/data/storage"
import { calculateClockOutTime, millisecondsToDuration } from "~lib/data/time"

const BaseNotificationOptions: chrome.notifications.NotificationOptions<true> =
  {
    type: "basic",
    iconUrl: chrome.runtime.getURL("assets/icon-192x192.png"),
    requireInteraction: true,
    buttons: [{ title: "Clock out" }],
    priority: 2,
    title: "",
    message: ""
  }

export function registerAlarmListener() {
  console.log("Alarm listener registered.")
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log("Alarm triggered:", alarm.name)
    if (alarm.name === NotificationAlarm) return await handleNotificationAlarm()
  })
}

async function handleNotificationAlarm(): Promise<void> {
  // notifications are enabled; check clocked status
  const storage = await getStorage()
  const clockOutTime = calculateClockOutTime(storage)

  const {
    hours = 0,
    minutes = 0,
    seconds = 0
  } = millisecondsToDuration(clockOutTime - Date.now())
  // if (hours > 0) return

  // check if the minutes are a time that we should notify at
  const durationLeft = Math.round(minutes + (seconds ? seconds / 60 : 0))
  console.log(durationLeft, "durationLeft")
  const isOverTime = durationLeft < 0

  const notificationRangeId = findNotificationIdByDuration(durationLeft)
  console.log(notificationRangeId, "notificationRangeId")
  if (!notificationRangeId) return // no notification range found for the duration left

  const { id: notificationId, dismissable } =
    getNotificationRange(notificationRangeId)

  // we don't handle notification logic here, send it over
  await sendNotification(
    {
      ...BaseNotificationOptions,
      title: "Clock out reminder",
      message: isOverTime
        ? buildOverTimeNotificationMessage()
        : buildWarningNotificationMessage(durationLeft),
      buttons: [
        ...BaseNotificationOptions.buttons,
        buildNotificationButtons(isOverTime)
      ]
    },
    notificationId,
    dismissable
  )
}

function buildWarningNotificationMessage(durationLeft: number): string {
  if (durationLeft <= 1) {
    return "You're 1 minute away from your time limit for today."
  }

  return `You're ${Math.round(durationLeft)} minutes away from your time limit for today.`
}

function buildOverTimeNotificationMessage(): string {
  return "You're over your time limit for today. Please clock out."
}

function buildNotificationButtons(
  isOverTime: boolean
): chrome.notifications.ButtonOptions {
  return {
    title: isOverTime ? "Snooze" : "Dismiss"
  }
}
