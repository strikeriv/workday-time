import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { Status } from "~lib/constants"

import { getElementsBySelector } from "../util"

export interface ParsedCurrentTime {
  status: Status // current status of the user, whether they are clocked in or out
  lastClockedTime: number // last time the user clocked in or out, in milliseconds
}

export async function parsePageForCurrentTime(
  page: Page
): Promise<ParsedCurrentTime> {
  console.log("Parsing current time...")

  const clockedText = await getElementsBySelector(
    page,
    "[data-automation-id=promptOption]",
    ["textContent"]
  )
  if (!clockedText || clockedText.length == 0) return null

  const { textContent } = clockedText[0]
  const status = textContent.includes("Checked In")
    ? Status.ClockedIn
    : Status.ClockedOut
  const lastClockedTimeString = parseClockedDate(textContent)

  const data = {
    status,
    lastClockedTime: lastClockedTimeString.getTime()
  } as ParsedCurrentTime

  console.log("Parsed current time data:", data)
  return data
}

function parseClockedDate(text: string): Date {
  // parse the date from the text
  const timeString = /\d:\d{2} [AP]M/gm.exec(text)?.[0]
  if (!timeString) {
    console.error("Failed to parse clocked time from text:", text)
    return null
  }

  const splitTime = timeString.split(" ")
  const [hours, minutes] = splitTime[0].split(":").map(Number)
  const period = splitTime[1] === "AM" ? 0 : 12

  const date = new Date()
  date.setHours(hours + period, minutes, 0, 0)

  return date
}
