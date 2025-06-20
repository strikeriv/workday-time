import type { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

function getTitleOfPage(page: Page): Promise<string> {
  return page.evaluate(() => document.title)
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export { getTitleOfPage, wait }
