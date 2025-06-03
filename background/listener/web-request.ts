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

        if (!eventId) {
          console.warn("No eventId found in request body.")
          return
        }

        if (eventId === EventIds.ClockOut.toString()) {
          console.log("Clock out event detected.")
          updateStorageOnClockOut()
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
    [StorageKeys.ClockedInTime]: null,
    [StorageKeys.Status]: Status.ClockedOut
  })
  console.log("Clocked out and storage updated.")
}
