import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

import { getElementsBySelector } from "./util"

export async function parsePayPageForData(page: Page): Promise<number> {
  try {
    console.log("Parsing pay page for data...")

    const hourlyPay = await readHourlyPay(page)
    if (!hourlyPay) {
      console.error("Failed to read hourly pay.")
      return
    }

    return hourlyPay
  } catch (error) {
    console.error("Error parsing pay page:", error)
    return
  }
}

async function readHourlyPay(page: Page): Promise<number> {
  try {
    const cardTexts = await getElementsBySelector(
      page,
      "[data-automation-id=cardFrameworkTruncatedText]",
      ["textContent"]
    )
    if (!cardTexts) {
      console.error("Failed to find card text elements.")
      return
    }

    const payText = cardTexts.find((text) =>
      text?.textContent?.toLowerCase().includes("usd hourly")
    ).textContent

    console.log(`Hourly pay text found: ${payText}.`)
    const parsedHourlyPay = /\d{1,2}.\d{2}/gm.exec(payText ?? "")[0]
    console.log(`Parsed hourly pay: ${parsedHourlyPay}.`)

    return parseInt(parsedHourlyPay)
  } catch (error) {
    console.error("Error reading hourly pay:", error)
    return
  }
}
