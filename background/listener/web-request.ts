import { updateValuesOnClockedStatusChange } from "~lib/data/alarm"

export function registerWebRequestListener() {
  console.log("Registering web request listener.")
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (
        details.method === "POST" &&
        details.url.includes("flowController.htmld")
      ) {
        // A clocked event Toggle depending on the chrome storage
        console.log("Clocked status change detected.")

        // should be on the time page after clocking in/out
        updateValuesOnClockedStatusChange().then(() => {
          console.log("fnished!")
        })
      }
    },
    { urls: ["https://wd501.myworkday.com/jbhunt/*"] },
    ["requestBody", "extraHeaders"]
  )
}
