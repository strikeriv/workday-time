import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

export interface BrowserState {
  currentTab: chrome.tabs.Tab
  currentPage: Page
}

export interface Message {
  message: string
  status: Status
}

export enum Status {
  Success = "success",
  Error = "error"
}
