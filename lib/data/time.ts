import type {
  ClockedDuration,
  TimeWorked,
  TotalTimeDuration
} from "~interfaces/interfaces"

export function calculateCurrentClockedInTime(
  clockedTime: number
): ClockedDuration {
  const currentTime = new Date()
  const timeDifference = currentTime.getTime() - clockedTime
  const hoursWorked = Math.floor(timeDifference / (1000 * 60 * 60))
  const minutesWorked = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  )
  const secondsWorked = Math.floor((timeDifference % (1000 * 60)) / 1000)
  return {
    clockedHours: hoursWorked,
    clockedMinutes: minutesWorked,
    clockedSeconds: secondsWorked
  }
}

export function calculateTotalTimeWorked(
  clockedInTime: number,
  existingTime: TimeWorked,
  isClockedIn: boolean
): TotalTimeDuration {
  let timeWorkedHours = existingTime.hours
  let timeWorkedMinutes = existingTime.minutes
  let timeWorkedSeconds = existingTime.seconds

  if (isClockedIn) {
    const { clockedHours, clockedMinutes, clockedSeconds } =
      calculateCurrentClockedInTime(clockedInTime)

    timeWorkedHours += clockedHours
    timeWorkedMinutes += clockedMinutes
    timeWorkedSeconds += clockedSeconds
  }

  // normalize seconds
  if (timeWorkedSeconds >= 60) {
    timeWorkedMinutes += Math.floor(timeWorkedSeconds / 60)
    timeWorkedSeconds = timeWorkedSeconds % 60
  }

  // normalize minutes
  if (timeWorkedMinutes >= 60) {
    timeWorkedHours += Math.floor(timeWorkedMinutes / 60)
    timeWorkedMinutes = timeWorkedMinutes % 60
  }

  return {
    timeWorkedHours,
    timeWorkedMinutes,
    timeWorkedSeconds
  }
}
