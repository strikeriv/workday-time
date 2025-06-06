import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import type { BrowserState } from "~background/interfaces/interfaces"

import { wait } from "."

async function evaluatePageNavigation(
  browserState: BrowserState
): Promise<boolean> {
  const { currentTab, currentPage } = browserState

  if (!currentTab || !currentPage) {
    console.error("Something went wrong, no current tab or page found.")
    return false
  }

  // check if the current page is already the time page
  const currentTitle = await currentPage.title()
  if (
    currentTitle.includes("Time - Workday") ||
    currentTitle.includes("Check")
  ) {
    console.log("Already on the Workday time page, no need to navigate.")
    return true
  }

  // page will be on the workday home page
  const status = await navigateToWorkdayTimePage(currentPage)

  return status
}

async function navigateToWorkdayTimePage(currentPage: Page): Promise<boolean> {
  // wait for and click "View All Apps"
  try {
    const viewAllAppsSelector = "[data-automation-id=pex-view-all-apps]"

    await currentPage.waitForSelector(viewAllAppsSelector, {
      timeout: 5000
    })
    await currentPage.locator(viewAllAppsSelector).click()

    await findAndClickOnTimeButtom(currentPage)

    await currentPage.waitForNavigation({
      waitUntil: "networkidle0",
      timeout: 10000
    })

    return true
  } catch {
    return false
  }
}

async function findAndClickOnTimeButtom(currentPage: Page): Promise<void> {
  const subMenuSelector = "[data-automation-id=subMenuItem]"

  await currentPage.waitForSelector(subMenuSelector, {
    timeout: 5000
  })

  await wait(500) // the panel is sliding

  const allLocators = await currentPage.$$(subMenuSelector)
  for (const locator of allLocators) {
    const text = await currentPage.evaluate((el) => el.textContent, locator)
    if (text && text.trim().toLowerCase() === "time") {
      await locator.click()
      console.log("Clicked on Time button successfully.")
      break
    }
  }
}

export {
  evaluatePageNavigation,
  findAndClickOnTimeButtom,
  navigateToWorkdayTimePage
}
