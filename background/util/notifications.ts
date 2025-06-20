import { NotificationAlarm } from "~lib/constants"

export function sendClockOutNotification(
  timeTillClockOut: number,
  isOverTime: boolean
) {
  console.log("Sending clock out notification...")
  chrome.notifications.clear(NotificationAlarm)
  chrome.notifications.create(NotificationAlarm, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("assets/icon-192x192.png"),
    title: "Time to Clock Out!",
    message: isOverTime
      ? "You are over your set time.\nYou need to clock out!"
      : `You're ${timeTillClockOut} minute away from your time limit for today.`,
    requireInteraction: true,
    buttons: [{ title: "Clock out" }, { title: "Snooze for 5 minutes" }],
    priority: 2
  })
}
