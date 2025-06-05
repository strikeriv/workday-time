import type { PlasmoMessaging } from "@plasmohq/messaging"

import { changeClockedStatus } from "~background"
import { Status, type Message } from "~background/interfaces/interfaces"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // run the code to grab time here
  console.log("Clocking out...")

  await changeClockedStatus(true, false)

  res.send({ message: "Clocked out.", status: Status.Success } as Message)
}

export default handler
