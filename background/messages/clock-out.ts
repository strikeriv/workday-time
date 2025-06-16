import type { PlasmoMessaging } from "@plasmohq/messaging"

import { changeClockedStatus } from "~background"
import { MessageStatus, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Clocking out...")

  await changeClockedStatus(true, false)

  res.send({
    message: "Clocked out.",
    status: MessageStatus.Success
  } as Message)
}

export default handler
