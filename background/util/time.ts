import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { Status, StorageKeys } from "~lib/constants"

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

    const clockTimeString = /\d{1,2}:\d{2} (P|AM)/gm.exec(
      promptButtonTexts.join("|")
    )
    if (!clockTimeString?.[0]) return

    const splitTime = clockTimeString[0].split(" ").map((val) => val.trim())
    const duration = splitTime[0].split(":")
    const period = splitTime[1]
    const day = period === "AM" ? 0 : 12

    const clockedInDate = new Date()
    clockedInDate.setHours(parseInt(duration[0]) + day)
    clockedInDate.setMinutes(parseInt(duration[1]))

    evaluateStatus(clockTimeString.input.includes("In"))

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
    console.log(
      "Evaluating clocked status...",
      isClockedIn ? Status.ClockedIn : Status.ClockedOut
    )
    await chrome.storage.local.set({
      [StorageKeys.Status]: isClockedIn ? Status.ClockedIn : Status.ClockedOut
    })

    console.log("saved successfully")

    return true
  } catch {
    return false
  }
}

export { parsePageForTime, readClockTime, readWeekTime }
