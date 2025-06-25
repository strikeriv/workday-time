import { sendClockOutNotification } from "~background/util/notifications"
import { NotificationAlarm, Status } from "~lib/constants"
import { getStorage } from "~lib/data/storage"
import { calculateCurrentTimeWorked } from "~lib/data/time"

const MinuteNotifications = [15, 5, 1] // minutes at which to notify

function registerAlarmListener() {
  console.log("Alarm listener registered.")
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === NotificationAlarm) {
      // notifications are enabled; check clocked status
      const storage = await getStorage()
      if (storage.status !== Status.ClockedIn) return

      const { lastClockedTime, preferences } = storage
      const { hoursToWork } = preferences

      const currentTimeWorked = calculateCurrentTimeWorked(lastClockedTime)

      const timeToWorkInMinutes = Math.floor(hoursToWork * 60)
      const currentTimeWorkedInMinutes =
        currentTimeWorked.hours * 60 + currentTimeWorked.minutes

      const durationLeft = timeToWorkInMinutes - currentTimeWorkedInMinutes
      const isOverTime = durationLeft < 0

      if (MinuteNotifications.includes(durationLeft) || isOverTime) {
        sendClockOutNotification(durationLeft, isOverTime)
      }
    }
  })
}

export { registerAlarmListener }
