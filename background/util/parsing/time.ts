import { Duration } from "date-fns"
import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { Status, StorageKeys } from "~lib/constants"

interface PageData extends ClockedData {
  lastUpdated: number
  timeWorkedThisWeek: Duration
}

interface ClockedData {
  status: Status
  lastClockedTime: number
}

export async function parsePageForTime(page: Page): Promise<PageData> {
  try {
    console.log("Reading total week time...")

    const timeWorkedThisWeek = await readWeekTime(page)
    if (!timeWorkedThisWeek) {
      console.error("Failed to read the time worked this time.")
      return
    }

    console.log("Read total week time successfully.")
    console.log("Reading clocked in time...")

    const clockedData = await readClockTime(page)
    if (!clockedData) {
      console.error("Failed to read clocked data.")
      return
    }

    return {
      lastUpdated: new Date().getTime(),
      timeWorkedThisWeek,
      ...clockedData
    }
  } catch {
    return
  }
}

async function readWeekTime(page: Page): Promise<Duration> {
  try {
    const timePageButtons = await page.$$(
      "[data-automation-id=dropDownCommandButton]"
    )
    if (!timePageButtons) return
    const timePageButtonsText = await page.evaluate(
      (...elements) => elements.map((element) => element.textContent),
      ...timePageButtons
    )

    const matchedValues = /\d+(\.\d+)?/gm.exec(timePageButtonsText.join("|"))
    const rawThisWeekTime = matchedValues?.[0]
    const thisWeekTime = rawThisWeekTime?.split(/(?=\.)/) || []

    console.log(`This week time found: ${rawThisWeekTime} hours.`)
    let hours = parseInt(thisWeekTime[0])
    const rawMinutes = parseFloat(thisWeekTime[1] ?? "0")

    let minutes = Math.floor(rawMinutes * 60)
    let seconds = Math.round((rawMinutes * 60 - minutes) * 60)

    // normaize seconds and minutes
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60)
      seconds = seconds % 60
    }

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60)
      minutes = minutes % 60
    }

    console.log(
      `Parsed time for the week: ${hours} hours, ${minutes} minutes, ${seconds} seconds.`
    )

    return {
      hours,
      minutes,
      seconds
    } as Duration
  } catch {
    return
  }
}

async function readClockTime(page: Page): Promise<ClockedData> {
  try {
    const promptButtons = await page.$$("[data-automation-id=promptOption]")
    if (!promptButtons) return
    const promptButtonTexts = await page.evaluate(
      (...elements) => elements.map((element) => element.textContent),
      ...promptButtons
    )

    const rawClockTimeString = /\d{1,2}:\d{2} (P|AM)/gm.exec(
      promptButtonTexts.join("|")
    )
    const clockTimeString = rawClockTimeString?.[0]?.trim()
    if (!clockTimeString) return

    console.log(`Clocked time found: ${clockTimeString}.`)
    const splitTime = clockTimeString.split(" ").map((val) => val.trim())
    const duration = splitTime[0].split(":")
    const period = splitTime[1]
    const day = period === "AM" ? 0 : 12

    const clockedDate = new Date()
    clockedDate.setHours(parseInt(duration[0]) + day)
    clockedDate.setMinutes(parseInt(duration[1]))

    console.log(`Parsed clocked time: ${clockedDate.toLocaleTimeString()}.`)

    return {
      status: rawClockTimeString.input.includes("In")
        ? Status.ClockedIn
        : Status.ClockedOut,
      lastClockedTime: clockedDate.getTime()
    }
  } catch {
    return
  }
}
