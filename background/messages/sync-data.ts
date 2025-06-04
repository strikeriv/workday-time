import type { PlasmoMessaging } from "@plasmohq/messaging"

import { grabTimeFromWorkday } from "~background"
import { Status, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Started syncing data with Workday...")
  await grabTimeFromWorkday()

  res.send({
    message: "Successfully synced time.",
    status: Status.Success
  } as Message)
}

export default handler
