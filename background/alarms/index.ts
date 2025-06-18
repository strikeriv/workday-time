import { sendNotification } from "~background/messages/show-notification"
import { NotificationAlarm, Status } from "~lib/constants"
import { getStorage } from "~lib/data/storage"

function registerAlarmListener() {
  console.log("Alarm listener registered.")
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log(await chrome.alarms.getAll())
    console.log("Alarm triggered:", alarm.name)
    if (alarm.name === NotificationAlarm) {
      // notifications are enabled; check clocked status
      const storage = await getStorage()
      if (storage.status !== Status.ClockedIn) return

      const { clockedTime, preferences } = storage
      const { hoursToWork } = preferences

      // calculate the duration from clockedTime to now
      const now = new Date().getTime()

      const clockedDuration = now - clockedTime
      const clockedDurationInHours = clockedDuration / (1000 * 60 * 60) - 1 / 60 // subtract 1 minute for the alarm delay

      console.log(
        clockedDuration,
        clockedDurationInHours,
        hoursToWork,
        clockedDurationInHours >= hoursToWork
      )
      if (clockedDurationInHours >= hoursToWork) {
        //sendNotification()
      }
    }
  })
}

export { registerAlarmListener }
