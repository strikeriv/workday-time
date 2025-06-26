import type { PlasmoMessaging } from "@plasmohq/messaging"

import { syncDataFromWorkday } from "~background"
import {
  MessageStatus,
  type MessageResponse
} from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler<any, MessageResponse> = async (
  req,
  res
) => {
  console.log("Started syncing data with Workday...")
  await syncDataFromWorkday()

  res.send({
    message: "Successfully synced data.",
    status: MessageStatus.Success
  })
}

export default handler
