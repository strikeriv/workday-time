import { AutoModeKey } from "~lib/constants"

export async function evaluateAlarmStatus(autoModeEnabled: boolean) {
  const existingAlarm = await chrome.alarms.get(AutoModeKey)
  if (autoModeEnabled) {
    if (existingAlarm) return

    console.log("Auto mode enabled. Creating alarm.")
    await chrome.alarms.create(AutoModeKey, {
      periodInMinutes: 0.5, // every 30 seconds
      when: 1000
    })
  } else {
    console.log("Auto mode disabled. Clearing alarm.")
    await chrome.alarms.clear(AutoModeKey)
  }
}
