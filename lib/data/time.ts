import { intervalToDuration, type Duration } from "date-fns"

import { type Storage } from "~interfaces/interfaces"
import { Status } from "~lib/constants"

const weeklyCapMilliseconds = 40 * 3600000 // 40 hours in milliseconds
const dailyCapMilliseconds = 11 * 3600000 // 11 hours in milliseconds (7am to 6pm)

/**
 * Calculates the clock out time based on the user's preferences and current time worked.
 * Factors in  daily and weekly caps to ensure the user does not exceed their working hours.
 *
 * @param storage
 * @returns {number}
 */
export function calculateClockOutTime(storage: Storage): number {
  const { lastClockedTime, timeWorkedThisWeek, timeWorkedToday, preferences } =
    storage
  const { hoursToWork } = preferences

  if (
    lastClockedTime === null ||
    timeWorkedThisWeek === null ||
    preferences === null ||
    hoursToWork === null
  )
    return

  // set up everything we need to calculate the time to work today
  const timeWorkedTodayDate = calculateDayTimeWorked(
    lastClockedTime,
    timeWorkedToday
  )
  const totalTimeWorkedWeek = calculateTotalTimeWorked(
    lastClockedTime,
    timeWorkedThisWeek,
    storage.status === Status.ClockedIn
  )

  const startOfDayDate = new Date(
    new Date().getTime() - durationToMilliseconds(timeWorkedTodayDate)
  )

  let setTimeToWorkTodayDate = new Date(
    startOfDayDate.getTime() + hoursToWork * 3600000
  )

  // check to see if the time worked today exceeds the daily cap
  const dailyCap = startOfDayDate.getTime() + dailyCapMilliseconds
  if (durationToMilliseconds(timeWorkedTodayDate) >= dailyCapMilliseconds) {
    setTimeToWorkTodayDate = new Date(dailyCap)
  }

  // check to ssee if the time worked this week exceeds the weekly cap
  console.log(totalTimeWorkedWeek, weeklyCapMilliseconds)
  if (durationToMilliseconds(totalTimeWorkedWeek) >= weeklyCapMilliseconds) {
    // calculate how much longer they have
    const overByAmount = Math.abs(
      weeklyCapMilliseconds - durationToMilliseconds(totalTimeWorkedWeek)
    )

    // cap the time to work today to the remaining amount
    setTimeToWorkTodayDate = new Date(new Date().getTime() - overByAmount)
  }

  return setTimeToWorkTodayDate.getTime()
}

/**
 * Calculates the current time worked since the users last clocked time.
 *
 * @param lastClockedTime - The time when the user last had a clocked event.
 * @returns {Duration} The duration of time worked since clocking in.
 */
export function calculateCurrentTimeWorked(lastClockedTime: number): Duration {
  return intervalToDuration({
    start: new Date(lastClockedTime),
    end: new Date()
  })
}

/**
  * Calculates the total time worked for the current day.

  * @param lastClockedTime - The time when the user last had a clocked event.
  * @param timeWorkedToday - The duration of time worked today.
  * @returns {Duration} The total duration of time worked today.
*/
export function calculateDayTimeWorked(
  lastClockedTime: number,
  timeWorkedToday: Duration
): Duration {
  return millisecondsToDuration(
    durationToMilliseconds(calculateCurrentTimeWorked(lastClockedTime)) +
      durationToMilliseconds(timeWorkedToday)
  )
}

/**
  * Calculates the total time worked for the week.

  * @param lastClockedInTime - The time when the user last had a clocked event.
  * @param timeWorkedThisWeek - The total time worked this week.
  * @param isClockedIn - Whether the user is currently clocked in.
  * @returns {Duration} The total duration of time worked today.
*/
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

/**
 * Formats a duration into a redable string format.
 *
 * @param duration - The duration to format.
 * @returns {string}
 */
export function customFormatDuration(duration: Duration): string {
  // convert days to hours, minutes, and seconds
  const totalHours =
    (duration.days ? duration.days * 24 : 0) + (duration.hours ?? 0)
  const minutes = duration.minutes ?? 0
  const seconds = duration.seconds ?? 0

  return `${totalHours} hours, ${minutes} minutes, ~${seconds} seconds`
}

/**
 * Converts a Duration object to milliseconds.
 *
 * @param duration - The duration to convert.
 * @returns {number} The total duration in milliseconds.
 */
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

/**
 * Converts milliseconds to a Duration object.
 *
 * @param milliseconds - The number of milliseconds to convert.
 * @returns {Duration} The duration represented by the milliseconds.
 */
export function millisecondsToDuration(milliseconds: number): Duration {
  return intervalToDuration({
    start: 0,
    end: milliseconds
  })
}
