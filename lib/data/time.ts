import { intervalToDuration, type Duration } from "date-fns"

import { type Storage } from "~interfaces/interfaces"

const cap = 40 * 3600000 // 40 hours in milliseconds

export function calculateClockOutTime(storage: Storage): number {
  const { lastClockedTime, timeWorkedThisWeek, preferences } = storage
  const { hoursToWork } = preferences

  if (
    lastClockedTime === null ||
    timeWorkedThisWeek === null ||
    preferences === null ||
    hoursToWork === null
  )
    return

  let timeToWork =
    durationToMilliseconds(timeWorkedThisWeek) + hoursToWork * 3600000
  if (timeToWork > cap) {
    timeToWork = cap
  }

  const totalTimeWorked = calculateTotalTimeWorked(
    lastClockedTime,
    timeWorkedThisWeek,
    true // isClockedIn
  )

  return (
    new Date().getTime() + timeToWork - durationToMilliseconds(totalTimeWorked)
  )
}

export function calculateCurrentTimeWorked(clockedTime: number): Duration {
  return intervalToDuration({
    start: new Date(clockedTime),
    end: new Date()
  })
}

export function calculateDayTimeWorked(
  clockedTime: number,
  timeWorkedToday: Duration
): Duration {
  return millisecondsToDuration(
    durationToMilliseconds(calculateCurrentTimeWorked(clockedTime)) +
      durationToMilliseconds(timeWorkedToday)
  )
}

export function calculateTotalTimeWorked(
  lastClockedInTime: number,
  timeWorkedThisWeek: Duration,
  isClockedIn: boolean
): Duration {
  let { days = 0, hours = 0, minutes = 0, seconds = 0 } = timeWorkedThisWeek

  if (isClockedIn) {
    const {
      hours: currentHours = 0,
      minutes: currentMinutes = 0,
      seconds: currentSeconds = 0
    } = calculateCurrentTimeWorked(lastClockedInTime)

    hours += currentHours
    minutes += currentMinutes
    seconds += currentSeconds
  }

  // convert duration to ms, then back to duration to normalize
  return millisecondsToDuration(
    durationToMilliseconds({
      days,
      hours,
      minutes,
      seconds
    })
  )
}

export function customFormatDuration(duration: Duration): string {
  // convert days to hours, minutes, and seconds
  const totalHours =
    (duration.days ? duration.days * 24 : 0) + (duration.hours ?? 0)
  const minutes = duration.minutes ?? 0
  const seconds = duration.seconds ?? 0

  return `${totalHours} hours, ${minutes} minutes, ~${seconds} seconds`
}

export function durationToMilliseconds(duration: Duration): number {
  return (
    (duration.years ?? 0) * 365 * 24 * 60 * 60 * 1000 +
    (duration.months ?? 0) * 30 * 24 * 60 * 60 * 1000 +
    (duration.days ?? 0) * 24 * 60 * 60 * 1000 +
    (duration.hours ?? 0) * 60 * 60 * 1000 +
    (duration.minutes ?? 0) * 60 * 1000 +
    (duration.seconds ?? 0) * 1000
  )
}

export function millisecondsToDuration(milliseconds: number): Duration {
  return intervalToDuration({
    start: 0,
    end: milliseconds
  })
}
