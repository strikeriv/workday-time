import { registerAlarmListener } from "./listener/alarm"
import { registerNotificationListener } from "./listener/notification"
import { registerWebRequestListener } from "./listener/web-request"
import { navigateToPage, ValidPages } from "./util/navigation"
import { openWorkdayHomePage } from "./util/page"
import { parsePageForClocked } from "./util/parsing/clocked"
import { parsePayPageForData } from "./util/parsing/pay"
import { parsePageForTime } from "./util/parsing/time"
import { closeTab } from "./util/tabs"

async function syncDataFromWorkday(): Promise<void> {
  const { tab, page } = await openWorkdayHomePage()

  // head to the page page and grab pay data
  const wasPayNavigationSuccessful = await navigateToPage(
    page,
    ValidPages.WorkdayPay
  )
  if (!wasPayNavigationSuccessful) {
    console.error("Failed to navigate to the Workday pay page.")
    return await closeTab(tab)
  }

  console.log("Navigated to Workday pay page successfully.")
  const didParsePay = await parsePayPageForData(page)
  if (!didParsePay) {
    console.error("Failed to parse the Workday pay page.")
    // return await closeTab(tab)
  }

  console.log("Parsed pay page successfully.")
  const wasTimeavigationSuccessful = await navigateToPage(
    page,
    ValidPages.WorkdayTime
  )
  if (!wasTimeavigationSuccessful) {
    console.error("Failed to navigate to the Workday time page.")
    return await closeTab(tab)
  }

  console.log("Navigated to Workday Time page successfully.")
  const didParseTime = await parsePageForTime(page)
  if (!didParseTime) {
    console.error("Failed to parse the Workday time page.")
    // return await closeTab(tab)
  }

  console.log("Parsed time page successfully.")
  return await closeTab(tab)
}

async function changeClockedStatus(
  isCheckingOut: boolean,
  manual: boolean
): Promise<void> {
  const { tab, page } = await openWorkdayHomePage()

  // if manual, already on the time page
  // no need to navigate
  if (!manual) {
    const didNavigate = await navigateToPage(page, ValidPages.WorkdayTime)
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

  return await closeTab(tab)
}

registerNotificationListener()
registerWebRequestListener()
registerAlarmListener()

export { changeClockedStatus, syncDataFromWorkday }
