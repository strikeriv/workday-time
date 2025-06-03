import type {
  ClockedInDuration,
  TimeWorked,
  TotalTimeDuration
} from "~interfaces/interfaces"

export function calculateCurrentClockedInTime(
  clockedInTime: number
): ClockedInDuration {
  const currentTime = new Date()
  const timeDifference = currentTime.getTime() - clockedInTime
  const hoursWorked = Math.floor(timeDifference / (1000 * 60 * 60))
  const minutesWorked = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  )
  const secondsWorked = Math.floor((timeDifference % (1000 * 60)) / 1000)
  return {
    clockedInHours: hoursWorked,
    clockedInMinutes: minutesWorked,
    clockedInSeconds: secondsWorked
  }
}

export function calculateTotalTimeWorked(
  clockedInTime: number,
  existingTime: TimeWorked,
  isClockedIn: boolean
): TotalTimeDuration {
  let timeWorkedHours = existingTime.hours
  let timeWorkedMinutes = existingTime.minutes
  let timeWorkedSeconds = 0

  if (isClockedIn) {
    const { clockedInHours, clockedInMinutes, clockedInSeconds } =
      calculateCurrentClockedInTime(clockedInTime)

    timeWorkedHours = existingTime.hours + clockedInHours
    timeWorkedMinutes = existingTime.minutes + clockedInMinutes
    timeWorkedSeconds = clockedInSeconds
  }

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
