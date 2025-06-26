import { changeClockedStatus } from "~background"
import { NotificationAlarm } from "~lib/constants"
import { getNotificationData } from "~lib/data/notifications"

export function registerNotificationListener(): void {
  console.log("Notification listener registered.")
  chrome.notifications.onButtonClicked.addListener(
    async (notificationId, buttonIndex) => {
      //console.log("Notification button clicked:", notificationId, buttonIndex)
      if (notificationId !== NotificationAlarm) return
      if (buttonIndex === 1) return onAlternateButtonClick(notificationId)

      return onPrimaryButtonClick(notificationId)
    }
  )
}

async function onAlternateButtonClick(notificationId: string): Promise<void> {
  // determine whether we snooze or dismiss till next alarm cycle
  const notificationData = await getNotificationData(NotificationAlarm)
  if (!notificationData) {
    console.log("No notification data found, skipping alternate action.")
    return
  }

  const { dismissable } = notificationData
  //console.log(notificationData, "here")

  // set timeout for next snoozable notification for 5 minutes
  if (!dismissable) {
    console.log("Snoozing notification for 5 minutes...")
    chrome.alarms.create(NotificationAlarm, {
      periodInMinutes: 0.5, // every 30 seconds
      delayInMinutes: 5
    })
  } else {
    console.log("Dismissing notification till the next.")
  }
}

async function onPrimaryButtonClick(notificationId: string): Promise<void> {
  console.log("Clocking out from notification...")
  //await changeClockedStatus(true, false) // clock the user out
  console.log("Clocked out.")
}
