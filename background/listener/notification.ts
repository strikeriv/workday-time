import { changeClockedStatus } from "~background"
import { NotificationAlarm } from "~lib/constants"

export function registerNotificationListener(): void {
  console.log("Notification listener registered.")
  chrome.notifications.onButtonClicked.addListener(
    async (notificationId, buttonIndex) => {
      if (notificationId !== NotificationAlarm) return
      if (buttonIndex === 1) return onSnoozeNotification()

      // button is clocking out
      console.log("Clocking out from notification...")
      await changeClockedStatus(true, false) // clock the user out
      console.log("Clocked out.")
    }
  )
}

function onSnoozeNotification(): void {
  console.log("Snoozing clock out notification for 5 minutes...")
  chrome.notifications.clear(NotificationAlarm)
  chrome.alarms.create(NotificationAlarm, {
    periodInMinutes: 0.5, // every 30 seconds
    delayInMinutes: 5
  })
}
