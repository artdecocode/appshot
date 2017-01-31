const api = require('../src/api')

const url = 'http://localhost:9876'
const bucket = 'test-bucket'

const API_Test_Suite = {
    should_open_browser_and_take_screenshot: () => {
        const screenshot = api.openBrowserAndTakeScreenshotOfUrl(url)
        return screenshot
    },
    should_upload_screenshot_to_s3: () => {
        return api.openBrowserAndTakeScreenshotOfUrl(url)
            .then(api.uploadToS3.bind(null, bucket))
    },
}

module.exports = API_Test_Suite
