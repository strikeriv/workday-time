import { format, type Duration } from "date-fns"
import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { millisecondsToDuration } from "~lib/data/time"

import { getElementsBySelector } from "../util"

export interface ParsedTimeEntries {
  timeWorkedToday: Duration
  timeWorkedThisWeek: Duration
}

interface CalendarCell {
  period: string
  text: number
}

export async function parsePageForTimeEntries(
  page: Page
): Promise<ParsedTimeEntries> {
  try {
    console.log("Reading time entries...")

    const foundCells = await grabCalendarCells(page)
    if (!foundCells) {
      console.error("Failed to read calendar cells.")
      return
    }

    const parsedCells = await parseCalendarCells(foundCells)
    if (
      parsedCells.timeWorkedThisWeek === null ||
      parsedCells.timeWorkedToday === null
    ) {
      console.error("Failed to parse calendar cells.")
      return
    }

    console.log("Parsed time entries: ", parsedCells)
    return parsedCells
  } catch {
    return
  }
}
async function grabCalendarCells(page: Page): Promise<CalendarCell[]> {
  const property = "textContent"
  const attribute = "data-automation-startdate"

  return (
    await getElementsBySelector(
      page,
      "[data-automation-id=calendarevent]",
      [property],
      [attribute]
    )
  )
    .map((el) => ({
      period: parseCalendarCellPeriod(el[attribute]),
      text: parseCalendarCellText(el[property])
    }))
    .filter((text) => text.text && text.period)
}

async function parseCalendarCells(
  cells: CalendarCell[]
): Promise<ParsedTimeEntries> {
  // organize by period
  const calendarEventsPerPeriod: Map<string, number[]> = new Map()

  cells.forEach((cell) => {
    const { period, text } = cell

    if (calendarEventsPerPeriod.has(period)) {
      calendarEventsPerPeriod.get(period)?.push(text)
    } else {
      calendarEventsPerPeriod.set(period, [text])
    }
  })

  // summate the periods to get time worked for the week
  const timeWorkedThisWeek = millisecondsToDuration(
    cells.map((cell) => cell.text).reduce((acc, curr) => acc + curr, 0) *
      3600000
  ) // convert to duration

  // grab the periods for today (can be multiple or none)
  const timeWorkedToday = millisecondsToDuration(
    calendarEventsPerPeriod
      .get(format(new Date(), "M-d"))
      ?.reduce((acc, curr) => acc + curr, 0) * 3600000
  ) // convert to duration

  return {
    timeWorkedThisWeek,
    timeWorkedToday
  }
}

function parseCalendarCellPeriod(text: string): string {
  return text.split("-").slice(0, 2).join("-")
}

function parseCalendarCellText(text: string): number {
  const match = /\d+(\.\d+)? Hours/gm.exec(text)
  return match ? parseFloat(match[0].split(" ")[0]) : null
}
