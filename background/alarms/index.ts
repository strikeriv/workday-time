import { changeClockedStatus } from "~background"
import { Status } from "~lib/constants"
import { getStorage } from "~lib/data/storage"

function registerAlarmListener() {
  console.log("Alarm listener registered.")
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "autoModeCheck") {
      // auto mode is enabled; check clocked status
      const storage = await getStorage()
      if (storage.status !== Status.ClockedIn) return

      const { clockedTime, preferences } = storage
      const { hoursToWork } = preferences

      // calculate the duration from clockedTime to now
      const now = new Date().getTime()

      const clockedDuration = now - clockedTime
      const clockedDurationInHours = clockedDuration / (1000 * 60 * 60) - 30000 // subtract 30 minutes for buffer

      if (clockedDurationInHours >= hoursToWork) {
        console.log("Clocked duration exceeded hours to work; clocking out.")
        await changeClockedStatus(true, false) // not manual

        // TODO: Update this once values are updated after clocking out
        chrome.alarms.clear("autoModeCheck") // clear the alarm
      }
    }
  })
}

export { registerAlarmListener }
