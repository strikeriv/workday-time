import type { PlasmoMessaging } from "@plasmohq/messaging"

import { syncDataFromWorkday } from "~background"
import { MessageStatus, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Started syncing data with Workday...")
  await syncDataFromWorkday()

  res.send({
    message: "Successfully synced data.",
    status: MessageStatus.Success
  } as Message)
}

export default handler
