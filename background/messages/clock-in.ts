import type { PlasmoMessaging } from "@plasmohq/messaging"

import { changeClockedStatus } from "~background"
import { MessageStatus, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Clocking in...")

  await changeClockedStatus(false, false)

  res.send({ message: "Clocked in.", status: MessageStatus.Success } as Message)
}

export default handler
