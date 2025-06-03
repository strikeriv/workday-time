import type { PlasmoMessaging } from "@plasmohq/messaging"

import { clockOut } from "~background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // run the code to grab time here
  console.log("Clocking out...")

  await clockOut()

  res.send({ message: "Clocked out.", status: "GOOD" })
}

export default handler
