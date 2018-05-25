import { Builder } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import spawn from 'spawncommand'
import main from './src/main'

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options()
    .addArguments('disable-infobars'))
  .build()

// kCGWindowIsOnscreen
// kCGWindowLayer
// kCGWindowMemoryUsage
// kCGWindowName
// kCGWindowNumber
// kCGWindowOwnerName
// kCGWindowOwnerPID
// kCGWindowSharingState
// kCGWindowStoreType
async function active(app) {
  await spawn('osascript', [
    '-e',
    `tell application "${app}" to activate`,
  ])
}

(async () => {
  try {
    await driver.get('https://artdeco.bz/appshot')
    await active('Chrome')
    // await driver.executeScript('alert("focus")')
    // await driver.switchTo().alert().accept()
    // const body = await driver.findElement({ tagName: 'body'})
    // await body.click()
    await new Promise(r => setTimeout(r, 100))
    await main('screenshots', 'Chrome', 'Art Deco')
  } catch ({ stack, message }) {
    if (/appshot/.test(process.env.NODE_DEBUG)) {
      console.log(stack)
    } else {
      console.log(message)
    }
  }
  await driver.quit()
})()
