import { onClockedStatusChange } from "~lib/data/alarm"
import { updateStorage } from "~lib/data/storage"

import { registerAlarmListener } from "./listener/alarm"
import { registerNotificationListener } from "./listener/notification"
import { navigateToPage, ValidPages } from "./util/navigation"
import { openWorkdayHomePage } from "./util/page"
import { parsePageForClocked } from "./util/parsing/clocked"
import { parsePayPageForData } from "./util/parsing/pay"
import { parsePageForCurrentTime } from "./util/parsing/time/current"
import { parsePageForTimeEntries } from "./util/parsing/time/entries"
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
  const parsedPay = await parsePayPageForData(page)
  if (!parsedPay) {
    console.error("Failed to parse the Workday pay page.")
    return await closeTab(tab)
  }

  console.log("Parsed pay page successfully.")
  const wasTimeNavigationSuccessful = await navigateToPage(
    page,
    ValidPages.WorkdayTime
  )
  if (!wasTimeNavigationSuccessful) {
    console.error("Failed to navigate to the Workday time page.")
    return await closeTab(tab)
  }

  console.log("Navigated to Workday Time page successfully.")
  const parsedCurrentTime = await parsePageForCurrentTime(page)
  if (!parsedCurrentTime) {
    console.error("Failed to parse current time.")
    return await closeTab(tab)
  }

  const wasTimeEntriesNavigationSuccessful = await navigateToPage(
    page,
    ValidPages.WorkdayTimeEntries
  )
  if (!wasTimeEntriesNavigationSuccessful) {
    console.error("Failed to navigate to the Workday time entries page.")
    return await closeTab(tab)
  }

  const parsedTimeEntries = await parsePageForTimeEntries(page)
  if (!parsedTimeEntries) {
    console.error("Failed to parse time entries.")
    return await closeTab(tab)
  }

  console.log("Saving parsed data to storage...")
  await updateStorage({
    hourlyRate: parsedPay,
    ...parsedCurrentTime,
    ...parsedTimeEntries
  })

  console.log("Synced and saved parsed data successfully.")
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

  // update storage values to reflect the clocked status change
  // only fires when successful
  onClockedStatusChange()

  return await closeTab(tab)
}

registerNotificationListener()
registerAlarmListener()

export { changeClockedStatus, syncDataFromWorkday }
