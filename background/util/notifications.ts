import { NotificationAlarm } from "~lib/constants"
import {
  clearNotificationData,
  getNotificationData,
  NotificationRangeIds,
  setNotificationData
} from "~lib/data/notifications"

export async function sendNotification(
  notification: chrome.notifications.NotificationOptions<true>,
  notificationId: NotificationRangeIds,
  dismissable: boolean
) {
  const isNotification = await getNotificationData(NotificationAlarm)
  if (isNotification) {
    // a notification is already sent to the user and hasn't been interacted with
    // determine whether we re-send a notification
    const { timestamp, dismissable } = isNotification
    if (dismissable) {
      // we need to prevent sending a new notification
      // if the notification is dismissable and the time has not passed
      // we check if the notification is within the range of the last notification
      const durationBetweenNotifications = Math.round(
        (Date.now() - timestamp) / 1000
      ) // in seconds

      if (
        durationBetweenNotifications >= 15 &&
        durationBetweenNotifications <= 45
      ) {
        // a notification was sent roughly 30 seconds ago
        // we don't send a new notification
        return
      }

      // otherwise, we send a new notification
      await clearNotificationData(NotificationAlarm)
    }
  }

  // if no notification is sent, or the notification is dismissable and
  // the time has passed, we send a new notification

  chrome.notifications.clear(NotificationAlarm)
  chrome.notifications.create(NotificationAlarm, notification)

  await setNotificationData(NotificationAlarm, {
    notificationId,
    timestamp: Date.now(),
    dismissable
  })
}
