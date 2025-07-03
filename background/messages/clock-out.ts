import type { PlasmoMessaging } from "@plasmohq/messaging"

import { changeClockedStatus } from "~background"
import {
  MessageStatus,
  type MessageResponse
} from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler<any, MessageResponse> = async (
  req,
  res
) => {
  console.log("Clocking out...")
  await changeClockedStatus(true, false)
  console.log("Clocked out.")

  res.send({
    message: "Clocked out.",
    status: MessageStatus.Success
  })
}

export default handler
