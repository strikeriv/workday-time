import { changeClockedStatus } from "~background"
import { EventIds } from "~lib/constants"
import { updateValuesOnClockedStatusChange } from "~lib/data/alarm"

export function registerWebRequestListener() {
  console.log("Registering web request listener.")
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      console.log(details, "details for request")
      // TODO: find a better way to handle this
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
          const isCheckingIn = eventId === EventIds.ClockIn.toString()
          console.log(
            isCheckingIn
              ? "Clock in event detected."
              : "Clock out event detected."
          )

          // should be on the time page after clocking in/out
          updateValuesOnClockedStatusChange(isCheckingIn).then(() => {
            console.log("fnished!")
          })
        } else {
          console.warn("Unknown eventId:", eventId)
        }
      }
    },
    { urls: ["https://wd501.myworkday.com/jbhunt/*"] },
    ["requestBody", "extraHeaders"]
  )
}
