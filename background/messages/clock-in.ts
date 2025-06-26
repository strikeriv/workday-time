import type { PlasmoMessaging } from "@plasmohq/messaging"

import { changeClockedStatus } from "~background"
import {
  MessageStatus,
  type MessageResponse
} from "~background/interfaces/interfaces"

export type ResponeBody = {
  message: string
  status: MessageStatus
}

const handler: PlasmoMessaging.MessageHandler<any, MessageResponse> = async (
  req,
  res
) => {
  console.log("Clocking in...")
  await changeClockedStatus(false, false)

  res.send({ message: "Clocked in.", status: MessageStatus.Success })
}

export default handler
