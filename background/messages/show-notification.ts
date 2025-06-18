import type { PlasmoMessaging } from "@plasmohq/messaging"

import { changeClockedStatus } from "~background"
import { MessageStatus, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Sending notification to clock out")

  chrome.notifications.create("clock-out-notification", {
    type: "basic",
    iconUrl: chrome.runtime.getURL("assets/icon-192x192.png"),
    title: "Time to Clock Out!",
    message: "You're 1 minute away from your time limit for today.",
    requireInteraction: true,
    buttons: [{ title: "Clock out" }, { title: "Dismiss" }],
    priority: 2
  })

  chrome.notifications.onButtonClicked.addListener(
    async (notificationId, buttonIndex) => {
      if (notificationId !== "clock-out-notification") return
      if (buttonIndex !== 0) return

      // button can only come from clock out notification
      console.log("Clocking out from notification...")
      await changeClockedStatus(true, false) // clock the user out
      console.log("Clocked out.")
    }
  )

  res.send({
    message: "Successfully sent notification.",
    status: MessageStatus.Success
  } as Message)
}

export default handler
