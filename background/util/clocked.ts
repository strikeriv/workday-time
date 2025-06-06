import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

async function parsePageForClocked(
  page: Page,
  isCheckingOut: boolean,
  manual: boolean
): Promise<boolean> {
  if (!manual) {
    const isGoodClockClick = await findAndClickClockButton(page, isCheckingOut)
    if (!isGoodClockClick) {
      console.error("Failed to click Check in / out button.")
      return false
    }

    // wait for check in / out page to load
    await page.waitForNetworkIdle({
      timeout: 10000
    })

    const isGoodOkClick = await findAndClickOkButton(page)
    if (!isGoodOkClick) {
      console.error("Failed to click OK button.")
      return false
    }
  }

  const isGoodDoneClick = await findAndClickDoneButton(page, manual)
  if (!isGoodDoneClick) {
    console.error("Failed to click Done button.")
    return false
  }

  return true
}

async function findAndClickClockButton(
  page: Page,
  isCheckingOut: boolean
): Promise<boolean> {
  try {
    const labelSelector = "[data-automation-id=label]"
    await page.waitForSelector(labelSelector, {
      timeout: 5000
    })

    const allLocators = await page.$$(labelSelector)
    const buttonText = isCheckingOut ? "Check Out" : "Check In"
    for (const locator of allLocators) {
      const text = await page.evaluate((el) => el.textContent, locator)
      if (text && text.trim().toLowerCase() === buttonText.toLowerCase()) {
        await locator.click()
        console.log(`Clicked on ${buttonText} button successfully.`)
        return true
      }
    }

    return false // no button found
  } catch {
    return false
  }
}

async function findAndClickOkButton(page: Page): Promise<boolean> {
  try {
    const commandButtonSelector = "[data-automation-id=wd-CommandButton]"
    await page.waitForSelector(commandButtonSelector, {
      timeout: 5000
    })

    const allLocators = await page.$$(commandButtonSelector)
    for (const locator of allLocators) {
      const text = await page.evaluate((el) => el.textContent, locator)
      console.log(text, "text")
      if (text && text.trim().toLowerCase() === "ok") {
        await locator.click()
        console.log(`Clicked on ok button successfully.`)
        return true
      }
    }

    return false // no button found
  } catch {
    return false
  }
}

async function findAndClickDoneButton(
  page: Page,
  manual: boolean
): Promise<boolean> {
  // with manual, it's possible the user has already clicked the button
  // still, we want to check if the button is there and click it

  try {
    const doneButtonSelector =
      "[data-automation-id=wd-CommandButton_uic_doneButton]"
    await page.waitForSelector(doneButtonSelector, {
      timeout: 5000
    })

    const allLocators = await page.$$(doneButtonSelector)
    for (const locator of allLocators) {
      const text = await page.evaluate((el) => el.textContent, locator)
      console.log(text, "text")
      if (text && text.trim().toLowerCase() === "done") {
        await locator.click()
        console.log(`Clicked on done button successfully.`)
        return true
      }
    }

    return false // no button found
  } catch {
    if (manual) {
      return false
    }

    return false
  }
}

export { parsePageForClocked }
