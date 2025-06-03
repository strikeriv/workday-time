import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import type { BrowserState } from "~background/interfaces/interfaces"

import { wait } from "."
import { parsePage } from "./time"

async function navigateToWorkdayTimePage(
  currentTab: chrome.tabs.Tab,
  currentPage: Page
): Promise<BrowserState> {
  // wait for and click "View All Apps"
  await currentPage.waitForSelector("[data-automation-id=pex-view-all-apps]", {
    timeout: 5000
  })
  await currentPage.locator("[data-automation-id=pex-view-all-apps]").click()
  await wait(500)
  await findAndClickOnTimeButtom(currentPage)

  return {
    currentTab,
    currentPage
  }
}

async function findAndClickOnTimeButtom(currentPage: Page): Promise<void> {
  const sidebarItems = await currentPage.$$("[data-automation-id=subMenuItem]")
  if (!sidebarItems) return
  const result = await currentPage.evaluate(
    (...elements) => elements.map((element) => element.textContent),
    ...sidebarItems
  )
  const buttonIndex = result.findIndex((item) => item === "Time")
  if (buttonIndex !== -1) {
    await sidebarItems[buttonIndex].click()

    await wait(1000)
    await parsePage(currentPage)
  }
}

export { findAndClickOnTimeButtom, navigateToWorkdayTimePage }
