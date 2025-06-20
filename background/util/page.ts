import type { BrowserState } from "~background/interfaces/interfaces"

import { attachDebuggerToTab } from "./debugger"
import { openNewTab } from "./tabs"

export const WORKDAY_URL = "https://wd501.myworkday.com/jbhunt/d/home.htmld"

export async function openWorkdayHomePage(): Promise<BrowserState> {
  const tab = await openNewTab(WORKDAY_URL, 2500)
  const page = await attachDebuggerToTab(tab)

  console.log("Opened Workday home page successfully.")
  return {
    tab,
    page
  }
}
