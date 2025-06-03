import type { PlasmoCSConfig } from "plasmo"
import puppeteer from "puppeteer-core"

export const config: PlasmoCSConfig = {
  matches: ["https://wd501.myworkday.com/jbhunt/*"], // can't use variables here
  all_frames: true
}

// chrome.declarativeWebRequest.onCompleted.addListener(onWebRequestCompleted, {
//   urls: [config.matches[0]]
// })

function onWebRequestCompleted(details) {
  console.log(details)
}

//console.log(puppeteer.)
// const $ = cheerio.load(document.textContent)

// var category = $("span")
//   .filter(function () {
//     return $(this).text().trim() === "Category:"
//   })
//   .next()
//   .text()
