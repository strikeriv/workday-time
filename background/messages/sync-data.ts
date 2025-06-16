import type { PlasmoMessaging } from "@plasmohq/messaging"

import { grabTimeFromWorkday } from "~background"
import { MessageStatus, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Started syncing data with Workday...")
  await grabTimeFromWorkday()

  res.send({
    message: "Successfully synced time.",
    status: MessageStatus.Success
  } as Message)
}

export default handler
