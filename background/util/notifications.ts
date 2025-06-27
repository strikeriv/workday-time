import { NotificationAlarm } from "~lib/constants"
import {
  clearNotificationData,
  getNotificationData,
  isWithinNotificationRange,
  NotificationRangeIds,
  setNotificationData
} from "~lib/data/notifications"

export async function sendNotification(
  notification: chrome.notifications.NotificationOptions<true>,
  notificationId: NotificationRangeIds,
  dismissable: boolean
) {
  const isNotification = await getNotificationData(NotificationAlarm)
  console.log(isNotification, "isNotification")
  if (isNotification) {
    // a notification is already sent to the user and hasn't been interacted with
    // determine whether we re-send a notification
    const { timestamp, dismissable } = isNotification
    if (dismissable) {
      // grab the range associated with the notification
      if (isWithinNotificationRange(notificationId, Date.now() - timestamp)) {
        return
      }

      // otherwise, we send a new notification
      await clearNotificationData(NotificationAlarm)
    }
  }

  // if no notification is sent, or the notification is dismissable and
  // the time has passed, we send a new notification

  console.log("Sending notification:", notification)
  chrome.notifications.clear(NotificationAlarm)
  chrome.notifications.create(NotificationAlarm, notification)

  await setNotificationData(NotificationAlarm, {
    notificationId,
    timestamp: Date.now(),
    dismissable
  })
}
