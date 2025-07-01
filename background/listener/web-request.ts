import { updateStorageOnClockedStatusChange } from "~lib/data/alarm"

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

        if (!eventId) {
          return
        }

        // TODO: Evaluate this and see if we can do something better
        // A clocked event Toggle depending on the chrome storage
        console.log("Clocked status change detected.")

        updateStorageOnClockedStatusChange()
      }
    },
    { urls: ["https://wd501.myworkday.com/jbhunt/*"] },
    []
  )
}
