const cp = require('child_process')
const path = require('path')

const exe = path.join(__dirname, '../bin', 'run2.js')

const TestSuite = {
    'should execute binary': () => {
        return new Promise((resolve, reject) => {
            cp.exec(exe, {}, (error, stdout, stderr) => {
                if (error) return reject(error)
                console.error(stdout)
                console.error(stderr)
                return resolve({ stdout, stderr })
            })
        })
    },
}

module.exports = TestSuite
