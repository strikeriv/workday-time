import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { StorageKeys } from "~constants"
import { Status } from "~interfaces/interfaces"

import { getTitleOfPage } from "."

async function parsePage(currentPage: Page): Promise<void> {
  const pageTitle = await getTitleOfPage(currentPage)
  if (pageTitle.includes("Time - Workday")) {
    console.log("Reading total week time...")
    await readWeekTime(currentPage)
    console.log("Found total week time successfully.")
    console.log("Reading clocked in time...")
    await readClockTime(currentPage)
    console.log("Found clocked in time successfully.")
    await chrome.storage.local.set({
      [StorageKeys.LastUpdated]: new Date().getTime()
    })
  } else {
    console.warn("Not on the Time page, cannot read time data.")
  }
}

async function readWeekTime(currentPage: Page): Promise<void> {
  const timePageButtons = await currentPage.$$(
    "[data-automation-id=dropDownCommandButton]"
  )
  if (!timePageButtons) return
  const timePageButtonsText = await currentPage.evaluate(
    (...elements) => elements.map((element) => element.textContent),
    ...timePageButtons
  )
  console.log(timePageButtonsText)
  const matchedValues = /\d+(\.\d+)?/gm.exec(timePageButtonsText.join("|"))
  const thisWeekTime = matchedValues?.[0]?.split(".") || []
  console.log("This week time:", thisWeekTime)
  chrome.storage.local.set({
    [StorageKeys.TimeWorked]: {
      hours: parseInt(thisWeekTime[0] || "0"),
      minutes: Math.round(parseInt(thisWeekTime[1] || "0") * 0.6)
    }
  })
}

async function readClockTime(currentPage: Page): Promise<void> {
  const promptButtons = await currentPage.$$(
    "[data-automation-id=promptOption]"
  )
  if (!promptButtons) return
  const promptButtonTexts = await currentPage.evaluate(
    (...elements) => elements.map((element) => element.textContent),
    ...promptButtons
  )
  const clockTimeString = /\d:\d{2} (P|AM)/gm.exec(promptButtonTexts.join("|"))
  if (!clockTimeString?.[0]) return
  const splitTime = clockTimeString[0].split(" ").map((val) => val.trim())
  const duration = splitTime[0].split(":")
  const period = splitTime[1]
  const day = period === "AM" ? 1 : 2

  const clockedInDate = new Date()
  clockedInDate.setHours(parseInt(duration[0]) * day)
  clockedInDate.setMinutes(parseInt(duration[1]))
  clockedInDate.setMilliseconds(0)
  clockedInDate.setSeconds(0)

  evaluateStatus(clockTimeString.includes("In"))

  chrome.storage.local.set({
    [StorageKeys.ClockedInTime]: clockedInDate.getTime()
  })
}

async function evaluateStatus(isClockedIn: boolean): Promise<void> {
  chrome.storage.local.set({
    [StorageKeys.Status]: isClockedIn ? Status.ClockedIn : Status.ClockedOut
  })
}

export { parsePage, readClockTime, readWeekTime }
