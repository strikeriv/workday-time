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
  existingTime: TimeWorked
): TotalTimeDuration {
  const { clockedInHours, clockedInMinutes, clockedInSeconds } =
    calculateCurrentClockedInTime(clockedInTime)

  let timeWorkedHours = existingTime.hours + clockedInHours
  let timeWorkedMinutes = existingTime.minutes + clockedInMinutes

  if (timeWorkedMinutes >= 60) {
    timeWorkedHours += Math.floor(timeWorkedMinutes / 60)
    timeWorkedMinutes = timeWorkedMinutes % 60
  }

  return {
    timeWorkedHours,
    timeWorkedMinutes,
    timeWorkedSeconds: clockedInSeconds
  }
}
