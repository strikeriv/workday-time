import { Page } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

export async function getElementsBySelector(
  page: Page,
  selector: string,
  properties: (keyof HTMLElement)[] = [],
  attributes: string[] = []
): Promise<Array<Record<string, any>>> {
  await page.waitForSelector(selector, {
    hidden: false,
    timeout: 5000
  })

  return page.$$eval(
    selector,
    (els, properties, attributes) =>
      els.map((el) => {
        const element: Record<string, any> = {}
        properties.forEach((prop) => {
          element[prop] = el[prop]
        })
        attributes.forEach((attr) => {
          element[attr] = el.getAttribute(attr)
        })
        return element
      }),
    properties,
    attributes
  )
}
