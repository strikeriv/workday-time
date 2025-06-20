import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { StorageKeys } from "~lib/constants"

export async function parsePayPageForData(page: Page): Promise<boolean> {
  try {
    console.log("Parsing pay page for data...")

    const readHourlyPaySuccessfully = await readHourlyPay(page)
    if (!readHourlyPaySuccessfully) {
      console.error("Failed to read hourly pay.")
      return false
    }

    return true
  } catch (error) {
    console.error("Error parsing pay page:", error)
    return false
  }
}

async function readHourlyPay(page: Page): Promise<boolean> {
  try {
    const payElement = await page.$$(
      "[data-automation-id=cardFrameworkListCardItemValue]"
    )
    if (!payElement) return false

    const payTexts = await page.$$eval(
      "[data-automation-id=cardFrameworkListCardItemValue]",
      (elements) => elements.map((el) => el.textContent)
    )
    const rawHourlyPayText = payTexts.find((text) =>
      text?.toLowerCase().includes("hourly")
    )

    console.log(`Hourly pay text found: ${rawHourlyPayText}.`)
    const parsedHourlyPay = /\d{1,2}.\d{2}/gm.exec(rawHourlyPayText || "")[0]
    console.log(`Parsed hourly pay: ${parsedHourlyPay}. Saving into storage...`)

    await chrome.storage.local.set({
      [StorageKeys.HourlyRate]: parseFloat(parsedHourlyPay)
    })

    console.log("Hourly pay saved successfully.")
    return true
  } catch (error) {
    console.error("Error reading hourly pay:", error)
    return false
  }
}
