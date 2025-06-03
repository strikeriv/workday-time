import type { PlasmoMessaging } from "@plasmohq/messaging"

import { grabTimeFromWorkday } from "~background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // run the code to grab time here
  console.log("Grabbing time...")

  await grabTimeFromWorkday()

  res.send({ message: "Successfully scraped time.", status: "GOOD" })
}

export default handler
