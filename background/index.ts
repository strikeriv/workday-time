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

async function changeClockedStatus(isCheckingOut: boolean): Promise<void> {
  const browserState = await openWorkdayTab(homeWorkdayURL)
  const { currentTab: tab, currentPage: page } = browserState

  const didNavigate = await evaluatePageNavigation(browserState)

  if (!didNavigate) {
    console.error("Failed to navigate to the Workday time page.")
    return await closeTab(tab)
  }

  await parsePageForClocked(page, isCheckingOut)
}

async function closeTab(tab: chrome.tabs.Tab): Promise<void> {
  console.log("Closing tab...")
  await chrome.tabs.remove(tab.id)
  console.log("Closed tab.")
}

registerWebRequestListener()

export { changeClockedStatus, grabTimeFromWorkday }
