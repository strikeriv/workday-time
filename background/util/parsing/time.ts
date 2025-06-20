import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { Status, StorageKeys } from "~lib/constants"

export async function parsePageForTime(page: Page): Promise<boolean> {
  try {
    console.log("Reading total week time...")

    const readWeekTimeSuccessfully = await readWeekTime(page)
    if (!readWeekTimeSuccessfully) {
      console.error("Failed to read total week time.")
      return false
    }

    console.log("Read total week time successfully.")
    console.log("Reading clocked in time...")

    const readClockTimeSuccessfully = await readClockTime(page)
    if (!readClockTimeSuccessfully) {
      console.error("Failed to read clocked in time.")
      return false
    }

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
      `Parsed time: ${hours} hours, ${minutes} minutes, ${seconds} seconds. Saving into storage...`
    )

    await chrome.storage.local.set({
      [StorageKeys.TimeWorked]: {
        hours,
        minutes,
        seconds
      }
    })

    console.log("Time worked saved successfully.")
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

    console.log(
      `Parsed clocked time: ${clockedDate.toLocaleTimeString()}. Saving into storage...`
    )

    await chrome.storage.local.set({
      [StorageKeys.ClockedTime]: clockedDate.getTime()
    })

    console.log("Clocked time saved successfully.")

    // need to evaluate the status based on the clocked time
    evaluateStatus(rawClockTimeString.input.includes("In"))

    return true
  } catch {
    return false
  }
}

async function evaluateStatus(isClockedIn: boolean): Promise<boolean> {
  try {
    const status = isClockedIn ? Status.ClockedIn : Status.ClockedOut

    console.log(`Evaluated clocked status: ${status}. Saving into storage...`)
    await chrome.storage.local.set({
      [StorageKeys.Status]: isClockedIn ? Status.ClockedIn : Status.ClockedOut
    })

    console.log("Status saved successfully.")
    return true
  } catch {
    return false
  }
}
