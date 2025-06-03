import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { getTitleOfPage, wait } from "~background/util"
import { StorageKeys } from "~lib/constants"

import type { BrowserState } from "./interfaces/interfaces"
import { registerWebRequestListener } from "./listener/web-request"
import {
  attachToTab,
  gotoURL,
  grabCurrentTab,
  openNewPageTab
} from "./util/pages"
import { navigateToWorkdayTimePage } from "./util/routing"
import { parsePage } from "./util/time"

const homeWorkdayURL = "https://wd501.myworkday.com/jbhunt/d/home.htmld"

const browserState: BrowserState = {
  currentTab: null as chrome.tabs.Tab,
  currentPage: null as Page
}

async function grabTimeFromWorkday(): Promise<void> {
  console.log("Started time data from Workday. Clearing previous data...")

  // clear previous data ( except preferences )
  await chrome.storage.local.remove([
    StorageKeys.ClockedInTime,
    StorageKeys.TimeWorked,
    StorageKeys.LastUpdated,
    StorageKeys.Status
  ])

  try {
    // grab & attach to current page
    browserState.currentTab = await grabCurrentTab()

    if (!browserState.currentTab) {
      console.error("No active tab was found.")
      return
    }

    try {
      browserState.currentPage = await attachToTab(browserState.currentTab)
    } catch (error) {
      if (error.message.includes("chrome://")) {
        console.log("Can't attach to a page, opening new tab...")
        const newTab = await openNewPageTab(homeWorkdayURL, 2000)
        const newPage = await attachToTab(newTab)
        browserState.currentTab = newTab
        browserState.currentPage = newPage
      } else {
        console.error("Error attaching to current tab:", error)
        return
      }
    }

    const currentPage = browserState.currentPage
    const pageTitle = await getTitleOfPage(currentPage)
    if (pageTitle.includes("Time - Workday")) {
      await parsePage(currentPage)
    } else {
      if (!browserState.currentTab.title?.includes("Home - Workday")) {
        browserState.currentTab = await gotoURL(
          browserState.currentTab,
          homeWorkdayURL,
          2000
        )
      }

      const newState = await navigateToWorkdayTimePage(
        browserState.currentTab,
        currentPage
      )

      browserState.currentTab = newState.currentTab
      browserState.currentPage = newState.currentPage
    }

    await closeTab()

    console.log("Grabbed time data successfully.")
  } catch (error) {
    console.error("Error while grabbing the time:", error)
  }
}

async function clockOut(): Promise<void> {
  try {
    // grab & attach to current page
    browserState.currentTab = await grabCurrentTab()

    if (!browserState.currentTab) {
      console.error("No active tab was found.")
      return
    }

    try {
      browserState.currentPage = await attachToTab(browserState.currentTab)
    } catch (error) {
      if (error.message.includes("chrome://")) {
        console.log("Can't attach to a page, opening new tab...")
        const newTab = await openNewPageTab(homeWorkdayURL, 2000)
        const newPage = await attachToTab(newTab)
        browserState.currentTab = newTab
        browserState.currentPage = newPage
      } else {
        console.error("Error attaching to current tab:", error)
        return
      }
    }

    const currentPage = browserState.currentPage
    const pageTitle = await getTitleOfPage(currentPage)
    if (pageTitle.includes("Time - Workday")) {
      await parsePage(currentPage)
    } else {
      if (!browserState.currentTab.title?.includes("Home - Workday")) {
        browserState.currentTab = await gotoURL(
          browserState.currentTab,
          homeWorkdayURL,
          2000
        )
      }

      const pexItems = await currentPage.$$(
        "[data-automation-id=pex-card-task-link]"
      )
      if (!pexItems) return
      const result = await currentPage.evaluate(
        (...elements) => elements.map((element) => element.textContent),
        ...pexItems
      )
      const buttonIndex = result.findIndex((item) => item === "Check Out")
      await pexItems[buttonIndex].click()

      await wait(1500)

      const commandButtons = await currentPage.$$(
        "[data-automation-id=wd-CommandButton]"
      )
      if (!commandButtons) return
      await wait(1500)
      const commandButtonsResult = await currentPage.evaluate(
        (...elements) => elements.map((element) => element.textContent),
        ...commandButtons
      )
      console.log("Command buttons:", commandButtonsResult)
      const commandButtonIndex = result.findIndex((item) => item === "OK")
      console.log(commandButtonIndex)
      if (commandButtonIndex !== -1) {
        //await commandButtons[buttonIndex].click()
      }
    }

    //await closeTab()

    console.log("Grabbed time data successfully. Closing tab...")
  } catch (error) {
    console.error("Error while grabbing the time:", error)
  }
}

async function closeTab(): Promise<void> {
  console.log("Closing tab...")
  const currentTab = browserState.currentTab

  await chrome.tabs.remove(currentTab.id)

  browserState.currentPage = null
  browserState.currentTab = null
}

registerWebRequestListener()

export { grabTimeFromWorkday, clockOut }
