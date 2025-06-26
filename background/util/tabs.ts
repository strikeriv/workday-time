import { wait } from "./misc"

export async function openNewTab(
  url: string,
  timeout: number = 1000
): Promise<chrome.tabs.Tab> {
  console.log(`Opening new tab with URL: ${url}`)
  const tab = await chrome.tabs.create({ url: url })
  await wait(timeout)

  console.log(`Opened tab with ID: ${tab.id} and URL: ${tab.url}`)
  return tab
}

export async function closeTab(tab: chrome.tabs.Tab): Promise<void> {
  console.log("Closing tab...")
  try {
    await chrome.tabs.remove(tab.id)

    console.log(`Closed tab with ID: ${tab.id}.`)
  } catch {
    console.log("Failed to close tab.")
  }
}
