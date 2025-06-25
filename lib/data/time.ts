import { intervalToDuration, type Duration } from "date-fns"

export function calculateCurrentTimeWorked(clockedTime: number): Duration {
  return intervalToDuration({
    start: new Date(clockedTime),
    end: new Date()
  })
}

export function calculateDayTimeWorked(
  clockedTime: number,
  timeWorkedDaily
): Duration {
  return millisecondsToDuration(
    durationToMilliseconds(calculateCurrentTimeWorked(clockedTime)) +
      durationToMilliseconds(timeWorkedDaily)
  )
}

export function calculateTotalTimeWorked(
  lastClockedInTime: number,
  timeWorkedThisWeek: Duration,
  isClockedIn: boolean
): Duration {
  let { hours, minutes, seconds } = timeWorkedThisWeek

  if (isClockedIn) {
    const {
      hours: currentHours,
      minutes: currentMinutes,
      seconds: currentSeconds
    } = calculateCurrentTimeWorked(lastClockedInTime)

    hours += currentHours ?? 0
    minutes += currentMinutes ?? 0
    seconds += currentSeconds ?? 0
  }

  // convert duration to ms, then back to duration to normalize
  return millisecondsToDuration(
    durationToMilliseconds({
      hours,
      minutes,
      seconds
    })
  )
}

export function customFormatDuration(duration: Duration): string {
  // convert days to hours, minutes, and seconds
  const totalHours = (duration.days ?? 0) * 24 + (duration.hours ?? 0)
  const minutes = duration.minutes ?? 0
  const seconds = duration.seconds ?? 0

  return `${totalHours} hours, ${minutes} minutes, ~${seconds} seconds`
}

export function durationToMilliseconds(duration: Duration): number {
  // should only have hours, minutes, and seconds, but we handle other stuff just in case
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
