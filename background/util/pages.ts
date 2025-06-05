import {
  connect,
  ExtensionTransport,
  Page
} from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import type { BrowserState } from "~background/interfaces/interfaces"
import { wait } from "~background/util"

async function openWorkdayTab(homeWorkdayURL: string): Promise<BrowserState> {
  console.log("Finding or opening Workday tab...")
  const browserState: BrowserState = {
    currentTab: null,
    currentPage: null
  }

  // only open a new tab if there is no existing Workday tab
  let workdayTab = await grabTabByTitle(["Home - Workday", "Time - Workday"])
  if (!workdayTab) {
    workdayTab = await openNewPageTab(homeWorkdayURL, 2500)
  }

  console.log("Workday tab found or created. Attaching debugger...")
  const workdayPage = await attachToTab(workdayTab)
  console.log("Attached debugger to Workday tab successfully.")

  browserState.currentTab = workdayTab
  browserState.currentPage = workdayPage

  return browserState
}

async function openNewPageTab(
  url: string,
  timeout: number = 1000
): Promise<chrome.tabs.Tab> {
  const tab = await chrome.tabs.create({ url: url })
  await wait(timeout)

  return tab
}

async function grabTabByTitle(
  titles: string[]
): Promise<chrome.tabs.Tab | null> {
  const tabs = await chrome.tabs.query({})
  return (
    tabs.find((tab) => titles.some((title) => tab.title?.includes(title))) ??
    null
  )
}

async function grabCurrentTab(): Promise<chrome.tabs.Tab> {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true })

  return tab[0]
}

async function attachToTab(
  tab: chrome.tabs.Tab,
  tries?: number
): Promise<Page> {
  try {
    const browser = await connect({
      transport: await ExtensionTransport.connectTab(tab.id)
    })
    const [page] = await browser.pages()
    return page
  } catch (error) {
    try {
      // check if error is "debugger not already attached"
      if (error instanceof Error && error.message.includes("debugger")) {
        try {
          console.log(
            "A debugger is already attached. Detaching and retrying..."
          )
          await detachDebugger(tab.id)
          console.log("Debugger detached successfully. Retrying attachment...")
          return await attachToTab(tab, (tries || 0) + 1)
        } catch (detachError) {
          console.error("Failed to detach debugger:", detachError)
          throw detachError
        }
      }
    } catch (detachError) {
      console.error("Failed to detach debugger:", detachError)
    }
  }
}

function detachDebugger(tabId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.debugger.detach({ tabId }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve()
      }
    })
  })
}

async function gotoURL(
  tab: chrome.tabs.Tab,
  url: string,
  timeout?: number
): Promise<chrome.tabs.Tab> {
  await chrome.tabs.update(tab.id, { url })

  if (timeout) {
    await wait(timeout)
  }

  return tab
}

export { openWorkdayTab, grabCurrentTab, attachToTab, openNewPageTab, gotoURL }
