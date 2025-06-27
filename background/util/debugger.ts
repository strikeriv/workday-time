import {
  connect,
  ExtensionTransport,
  Page
} from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"

export async function attachDebuggerToTab(
  tab: chrome.tabs.Tab,
  tries?: number
): Promise<Page> {
  try {
    console.log(`Attaching debugger to tab with ID: ${tab.id}.`)
    if (tries && tries > 3) {
      throw new Error("Maximum retry attempts reached.")
    }

    const browser = await connect({
      transport: await ExtensionTransport.connectTab(tab.id),
      defaultViewport: null
    })
    const [page] = await browser.pages()

    console.log(`Debugger attached to tab with ID: ${tab.id}.`)
    return page
  } catch (error) {
    try {
      // check if error is "debugger not already attached"
      if (error instanceof Error && error.message.includes("debugger")) {
        try {
          console.log(
            "A debugger is already attached. Detaching and retrying..."
          )
          await detachDebuggerFromTab(tab.id)
          console.log("Debugger detached successfully. Retrying attachment...")
          return await attachDebuggerToTab(tab, (tries || 0) + 1)
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

function detachDebuggerFromTab(tabId: number): Promise<void> {
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
