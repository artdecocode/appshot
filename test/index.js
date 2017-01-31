const cp = require('child_process')
const path = require('path')

const exe = path.join(__dirname, 'bin', 'appshot Chrome google.com')

const TestSuite = {
    'should execute binary': () => {
        return new Promise((resolve, reject) => {
            cp.exec(exe, {}, (error, stdout, stderr) => {
                if (error) return reject(error)
                console.log(stdout, stderr) // add verbosity level in zoroaster
                return { stdout, stderr }
            })
        })
    },
}

module.exports = TestSuite
