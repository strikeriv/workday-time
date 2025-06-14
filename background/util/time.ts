import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { Status } from "~interfaces/interfaces"
import { StorageKeys } from "~lib/constants"

async function parsePageForTime(page: Page): Promise<boolean> {
  try {
    console.log("Reading total week time...")
    const readWeekTimeSuccessfully = await readWeekTime(page)
    if (!readWeekTimeSuccessfully) {
      console.error("Failed to read total week time.")
      return
    }

    console.log("Read total week time successfully.")
    console.log("Reading clocked in time...")

    const readClockTimeSuccessfully = await readClockTime(page)
    if (!readClockTimeSuccessfully) {
      console.error("Failed to read clocked in time.")
      return
    }

    console.log("Read clocked in time successfully.")

    await chrome.storage.local.set({
      [StorageKeys.LastUpdated]: new Date().getTime()
    })
    console.log("hmm")

    return true
  } catch {
    return false
  }
}

async function readWeekTime(page: Page): Promise<boolean> {
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
    const thisWeekTime = matchedValues?.[0]?.split(/(?=\.)/) || []

    const rawMinutes = parseFloat(thisWeekTime[1])

    const hours = parseInt(thisWeekTime[0])
    const minutes = Math.floor(rawMinutes * 60)
    const seconds = Math.round((rawMinutes * 60 - minutes) * 60)

    await chrome.storage.local.set({
      [StorageKeys.TimeWorked]: {
        hours,
        minutes,
        seconds
      }
    })

    return true
  } catch {
    return false
  }
}

async function readClockTime(page: Page): Promise<boolean> {
  try {
    const promptButtons = await page.$$("[data-automation-id=promptOption]")
    if (!promptButtons) return
    const promptButtonTexts = await page.evaluate(
      (...elements) => elements.map((element) => element.textContent),
      ...promptButtons
    )

    const clockTimeString = /\d:\d{2} (P|AM)/gm.exec(
      promptButtonTexts.join("|")
    )
    console.log(clockTimeString, "clockTimeString")
    if (!clockTimeString?.[0]) return

    const splitTime = clockTimeString[0].split(" ").map((val) => val.trim())
    const duration = splitTime[0].split(":")
    const period = splitTime[1]
    const day = period === "AM" ? 0 : 12

    console.log(splitTime, duration, period, day, "hmm")

    const clockedInDate = new Date()
    clockedInDate.setHours(parseInt(duration[0]) + day)
    clockedInDate.setMinutes(parseInt(duration[1]))
    clockedInDate.setMilliseconds(0)
    clockedInDate.setSeconds(0)

    evaluateStatus(clockTimeString.input.includes("In"))

    console.log(clockedInDate, "clockedInDate")

    await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: clockedInDate.getTime()
    })

    return true
  } catch {
    return false
  }
}

async function evaluateStatus(isClockedIn: boolean): Promise<boolean> {
  try {
    await chrome.storage.local.set({
      [StorageKeys.Status]: isClockedIn ? Status.ClockedIn : Status.ClockedOut
    })

    return true
  } catch {
    return false
  }
}

export { parsePageForTime, readClockTime, readWeekTime }
