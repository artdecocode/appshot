const path = require('path')
const appshotPath = path.join(__dirname, '../bin/run2.js')
const spawn = require('child_process').spawn
const Writable = require('stream').Writable

function getDataFromSet(set) {
    const arr = Array.from(set)
    return arr.join('').trim()
}
function addToSet(set, data) {
    return set.add(data)
}
// writable is a context here set set as context here
// addToSetAsString.bind(set)
function addToSetAsString(set, data) {
    return addToSet(set, String(data))
}
function createWritableForSet(set) {
    const addData = addToSetAsString.bind(null, set)
    return createWritable(addData)
}
function createWritable(fn) {
    const ws = new Writable()
    ws._write = (chunk, enc, next) => { 
        if (typeof fn === 'function') fn.call(null, chunk)
        next(null)
    }
    return ws
}

// better child_process.exec for nodejs!
function executeCommandAsPromise(command, args, options) {
    return new Promise((resolve, reject) => {
        try {
            const stdoutData = new Set()
            const stderrData = new Set()
            const writeStdout = createWritableForSet(stdoutData)
            const writeStderr = createWritableForSet(stderrData)
            
            const proc = spawn(command, args, options)
            proc.on('error', reject)
            proc.on('exit', (code) => {
                return resolve({ stdout: getDataFromSet(stdoutData), stderr: getDataFromSet(stderrData), code })
            })
            proc.stdout.pipe(writeStdout)
            proc.stderr.pipe(writeStderr)
            proc.stdout.pipe(process.stdout)
            proc.stderr.pipe(process.stderr)
        } catch (err) {
            return reject(err)
        }
    })
}

function spawnAppshot(appshotPath, args) {
    const _args = Array.isArray(args) ? args : []
    return executeCommandAsPromise(appshotPath, args, {})
}
let appshotProcess
module.exports = {
    _before: {
        spawn_appshot: () => 
            spawnAppshot(appshotPath, [])
                .then((res) => {
                    console.error(res.stderr)
                    //appshotProcess
                }),
        somethingElse: () => Promise.resolve(),
    },
    main: {
        
    },
    after: {
    },
}
