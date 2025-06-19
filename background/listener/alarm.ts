import { time } from "console"

import { sendClockOutNotification } from "~background/messages/show-notification"
import { NotificationAlarm, Status } from "~lib/constants"
import { getStorage } from "~lib/data/storage"
import { calculateCurrentClockedInTime } from "~lib/data/time"

const MinuteNotifications = [15, 5, 1] // minutes at which to notify

function registerAlarmListener() {
  console.log("Alarm listener registered.")
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === NotificationAlarm) {
      // notifications are enabled; check clocked status
      const storage = await getStorage()
      if (storage.status !== Status.ClockedIn) return

      const { clockedTime, preferences } = storage
      const { hoursToWork } = preferences

      const currentTimeWorked = calculateCurrentClockedInTime(clockedTime)

      const timeToWorkInMinutes = Math.floor(hoursToWork * 60)
      const currentTimeWorkedInMinutes =
        currentTimeWorked.clockedHours * 60 + currentTimeWorked.clockedMinutes

      const durationLeft = timeToWorkInMinutes - currentTimeWorkedInMinutes
      const isOverTime = durationLeft < 0

      if (MinuteNotifications.includes(durationLeft) || isOverTime) {
        sendClockOutNotification(durationLeft, isOverTime)
      }
    }
  })
}

export { registerAlarmListener }
