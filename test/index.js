const cp = require('child_process')
const path = require('path')

const exe = path.join(__dirname, '../bin', 'run2.js --app Chrome --title Google')

const TestSuite = {
    'should execute binary': () => {
        return new Promise((resolve, reject) => {
            cp.exec(exe, {}, (error, stdout, stderr) => {
                if (error) return reject(error)
                return resolve({ stdout, stderr })
            })
        })
    },
}

module.exports = TestSuite
