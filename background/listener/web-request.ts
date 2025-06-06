import { changeClockedStatus } from "~background"
import { EventIds } from "~lib/constants"

export function registerWebRequestListener() {
  console.log("Registering web request listener.")
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (
        details.method === "POST" &&
        details.url.includes("flowController.htmld")
      ) {
        const formData = details.requestBody?.formData
        const eventId = formData?._eventId_submit?.[0]

        console.log(formData, "form data for request")
        console.log(details, "url details for request")
        if (!eventId) {
          return
        }

        if (
          eventId === EventIds.ClockOut.toString() ||
          eventId === EventIds.ClockIn.toString()
        ) {
          const isCheckingOut = eventId === EventIds.ClockOut.toString()
          console.log(
            isCheckingOut
              ? "Clock out event detected."
              : "Clock in event detected."
          )

          // should be on the time page after clocking in/out
          console.log("before changing status in listener")
          changeClockedStatus(isCheckingOut, true).then(() => {
            console.log("done changing clocked status in listener")
          })
        } else {
          console.warn("Unknown eventId:", eventId)
        }
      }
    },
    { urls: ["https://wd501.myworkday.com/jbhunt/*"] },
    ["requestBody"]
  )
}
