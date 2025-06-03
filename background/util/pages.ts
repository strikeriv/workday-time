import {
  connect,
  ExtensionTransport,
  Page
} from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { wait } from "~background/util"

async function openNewPageTab(
  url: string,
  timeout: number = 1000
): Promise<chrome.tabs.Tab> {
  const tab = await chrome.tabs.create({ url: url })
  await wait(timeout)

  return tab
}

async function grabCurrentTab(): Promise<chrome.tabs.Tab> {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true })

  return tab[0]
}

async function attachToTab(tab: chrome.tabs.Tab): Promise<Page> {
  const browser = await connect({
    transport: await ExtensionTransport.connectTab(tab.id)
  })
  const [page] = await browser.pages()
  return page
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

export { grabCurrentTab, attachToTab, openNewPageTab, gotoURL }
