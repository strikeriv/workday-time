import { changeClockedStatus } from "~background"
import { Status } from "~interfaces/interfaces"
import { StorageKeys } from "~lib/constants"

const enum EventIds {
  ClockOut = 979,
  ClockIn = 976
}

export function registerWebRequestListener() {
  console.log("Registering web request listener...")
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
          console.warn("No eventId found in request body.")
          return
        }

        if (eventId === EventIds.ClockOut.toString()) {
          console.log("Clock out event detected.")
          changeClockedStatus(true).then(() => {
            console.log("insane if this works first try")
          })
        } else if (eventId === EventIds.ClockIn.toString()) {
          console.log("Clock in event detected.")
          // Handle clock in logic here
        } else {
          console.warn("Unknown eventId:", eventId)
        }
      }
    },
    { urls: ["https://wd501.myworkday.com/jbhunt/*"] },
    ["requestBody"]
  )
}

function updateStorageOnClockOut() {
  chrome.storage.local.set({
    [StorageKeys.ClockedTime]: null,
    [StorageKeys.Status]: Status.ClockedOut
  })
  console.log("Clocked out and storage updated.")
}
