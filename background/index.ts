import { registerAlarmListener } from "./alarms"
import { registerWebRequestListener } from "./listener/web-request"
import { parsePageForClocked } from "./util/clocked"
import { openWorkdayTab } from "./util/pages"
import { evaluatePageNavigation } from "./util/routing"
import { parsePageForTime } from "./util/time"

const homeWorkdayURL = "https://wd501.myworkday.com/jbhunt/d/home.htmld"

async function grabTimeFromWorkday(): Promise<void> {
  const browserState = await openWorkdayTab(homeWorkdayURL)
  const { currentTab: tab, currentPage: page } = browserState

  const didNavigate = await evaluatePageNavigation(browserState)
  if (!didNavigate) {
    console.error("Failed to navigate to the Workday time page.")
    return await closeTab(tab)
  }

  // will be on the time page now
  const didParse = await parsePageForTime(page)
  if (!didParse) {
    console.error("Failed to parse the time page.")
  }

  await closeTab(tab)
}

async function changeClockedStatus(
  isCheckingOut: boolean,
  manual: boolean
): Promise<void> {
  const browserState = await openWorkdayTab(homeWorkdayURL)
  const { currentTab: tab, currentPage: page } = browserState

  // if manual, already on the time page
  // no need to navigate
  if (!manual) {
    const didNavigate = await evaluatePageNavigation(browserState)
    if (!didNavigate) {
      console.error("Failed to navigate to the Workday time page.")
      return await closeTab(tab)
    }
  }

  const didChangeStatus = await parsePageForClocked(page, isCheckingOut, manual)
  if (!didChangeStatus) {
    console.error(
      `Failed to ${
        isCheckingOut ? "clock out" : "clock in"
      } on the Workday time page.`
    )
    return await closeTab(tab)
  }

  // const didParse = await parsePageForTime(page)
  // if (!didParse) {
  //   console.error("Failed to parse the time page.")
  // }

  // // never close the tab. listener will handle it
}

async function closeTab(tab: chrome.tabs.Tab): Promise<void> {
  console.log("Closing tab...")
  try {
    await chrome.tabs.remove(tab.id)
  } catch {
    console.log("Failed to close tab.")
  }
}

registerWebRequestListener()
registerAlarmListener()

export { changeClockedStatus, grabTimeFromWorkday }
