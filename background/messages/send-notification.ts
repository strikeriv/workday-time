import type { PlasmoMessaging } from "@plasmohq/messaging"

import {
  MessageStatus,
  type MessageResponse
} from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler<
  chrome.notifications.NotificationOptions<true>,
  MessageResponse
> = async (req, res) => {
  console.log("Sending a notification...")

  //await sendNotification(req.body)

  res.send({
    message: "Notification sent.",
    status: MessageStatus.Success
  })
}

export default handler
