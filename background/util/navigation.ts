import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { wait } from "./misc"
import { WORKDAY_URL } from "./page"

export enum ValidPages {
  WorkdayHome = "Home - Workday",
  WorkdayTime = "Time - Workday",
  WorkdayPay = "Overview - Workday"
}

export async function navigateToPage(
  currentPage: Page,
  page: ValidPages
): Promise<boolean> {
  try {
    console.log(`Navigating to ${page}...`)
    if (page === ValidPages.WorkdayHome) {
      return await routeToWorkdayHomePage(currentPage)
    }

    // for all other pages, we make sure we are on the workday page
    // we can navigate to any page from any page with the menu
    // so we just need to make sure we are on the workday page
    if (!currentPage.url().includes(WORKDAY_URL.split("/jbhunt")[0])) {
      await navigateToPage(currentPage, ValidPages.WorkdayHome)
    }

    if (page === ValidPages.WorkdayPay) {
      return await navigateToWorkdayPayPage(currentPage)
    } else if (page === ValidPages.WorkdayTime) {
      return await navigateToWorkdayTimePage(currentPage)
    }

    // unknown poage
    console.error(`Invalid page: ${page}`)
    return false
  } catch (error) {
    console.error(`Error navigating to ${page}:`, error)
    return false
  }
}

async function routeToWorkdayHomePage(currentPage: Page): Promise<boolean> {
  // just change url to home
  try {
    await currentPage.goto(WORKDAY_URL, {
      waitUntil: "networkidle2",
      timeout: 10000
    })
    console.log("Navigated to Workday home page successfully.")
    return true
  } catch (error) {
    console.error("Failed to navigate to Workday home page:", error)
    return false
  }
}

async function navigateToWorkdayPayPage(currentPage: Page): Promise<boolean> {
  console.log("Navigating to Workday pay page...")
  try {
    await openWorkdayMenu(currentPage)
    await findAndClickOnMenuButton(currentPage, "Benefits and Pay")

    await currentPage.waitForNavigation({
      waitUntil: "networkidle0",
      timeout: 10000
    })

    await wait(1500) // wait for the page to load (this page is wonky)

    return true
  } catch {
    return false
  }
}

async function navigateToWorkdayTimePage(currentPage: Page): Promise<boolean> {
  // wait for and click "View All Apps"
  try {
    await openWorkdayMenu(currentPage)
    await findAndClickOnMenuButton(currentPage, "Time")

    await currentPage.waitForNavigation({
      waitUntil: "networkidle2",
      timeout: 10000
    })

    return true
  } catch {
    return false
  }
}

async function openWorkdayMenu(currentPage: Page): Promise<boolean> {
  console.log("Opening Workday menu...")
  try {
    const subMenuSelector = "[data-automation-id=globalNavButton]"

    await currentPage.locator(subMenuSelector).click()
    console.log("Opened Workday menu successfully.")

    return true
  } catch {
    console.error("Failed to open Workday menu.")
    return false
  }
}

async function findAndClickOnMenuButton(
  currentPage: Page,
  buttonText: string
): Promise<void> {
  const subMenuSelector = "[data-automation-id=subMenuItem]"

  await currentPage.waitForSelector(subMenuSelector, {
    timeout: 5000
  })

  await wait(500) // the panel is sliding

  const allLocators = await currentPage.$$(subMenuSelector)
  for (const locator of allLocators) {
    const text = await currentPage.evaluate((el) => el.textContent, locator)
    if (text && text.trim().toLowerCase() === buttonText.toLowerCase()) {
      await locator.click()
      console.log(`Clicked on ${buttonText} button successfully.`)
      break
    }
  }
}
