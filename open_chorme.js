const webdriver = require('selenium-webdriver')
const Builder = webdriver.Builder
const cp = require('child_process')
const path = require('path')
const main = require('./main')

const driver = new Builder()
    .forBrowser('chrome')
    .build()
//python3 ./screencapture.py Safari -t 'kokoti'
const pyPath = path.join(__dirname, 'pyscreencapture/screencapture.py')
//'python', ['./screencapture.py Chrome "kokoti"']

function getActiveCommand(app) {
    return `osascript -e 'tell application "${app}" to activate'` 
}
function active(app) {
    return new Promise((resolve, reject) => {
        cp.exec(getActiveCommand(app), (err, stdout, stderr) => {
            if (err) return reject(err)
            return resolve()
        })
    })
}
const argv = process.argv
console.log(argv)
function takeScreenshot(app, title) {
    return new Promise((resolve, reject) => {
        const python = cp.spawn('python3', [pyPath, app, '-t', title])
        // console.log(python)
        python.stdout.pipe(process.stdout)
        python.stderr.pipe(process.stderr)
        python.on('exit', resolve)
    })
}

(async () => {
    await driver.get('https://kokoti.co.uk')
    await active('Chrome')
 //   await driver.executeScript('alert("focus")')
 //   await driver.switchTo().alert().accept()
  //  const body = await driver.findElement({ tagName: 'body'})
  //  await body.click()
    await new Promise(resolve => setTimeout(resolve, 100))
    const dir = path.join(__dirname, 'screenshots')
    const res = await main(dir, 'Chrome', 'kokoti')
    console.log(res)
    await driver.quit()
})()

process.on('unhandledRejection', console.error)
