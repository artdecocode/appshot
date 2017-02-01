const path = require('path')
const cp = require('child_process')
const uuid = require('uuid')
const assert = require('assert')
const debug = require('debug')('main')

const Writable = require('stream').Writable
const pyPath = path.join(__dirname, '..', 'etc', 'run.py')

function createWritable(data) {
    const writable = new Writable()
    writable._write = (chunk, encoding, callback) => {
        data.push(String(chunk))
        callback(null)
    }
    return writable
}

function spawnPython(resolve, reject, logStreams) {
    assert(Array.isArray(logStreams), 'Log streams should be an array')

    const python = cp.spawn('python', [pyPath])
    const data = []
    const errData = []

    if (Array.isArray(logStreams)) {
        debug(logStreams.map(ws =>
            ((typeof ws === 'object' && 'path' in ws) ? ws.path : ws)
        ))
        if (logStreams.length && logStreams[0] instanceof Writable) python.stdout.pipe(logStreams[0])
        if (logStreams.length > 1 && logStreams[2] instanceof Writable)python.stderr.pipe(logStreams[1])
    }

    const stdoutDrain = createWritable(data)
    const stderrDrain = createWritable(errData)

    python.stdout
        .pipe(stdoutDrain)

    python.stderr
        .pipe(stderrDrain)

    python.on('exit', (code) => {
        if (code !== 0) {
            return reject(getPythonExitError(errData, code))
        }
        return resolve(data.join().trim())
    })
}

function getPythonExitError(errData, code) {
    const title = `Process exited with code ${code}`
    const message = errData.join().trim()
    const error = new Error()
    error.title = title
    error.message = message
    return error
}

function getWindowsWithPython(logStreams) {
    return new Promise((resolve, reject) =>
        spawnPython(resolve, reject, logStreams)
    )
        .then(JSON.parse)
}

function screencapture(windowId, dir, format, index, cursor, noShadow) {
    assert(windowId)
    assert(dir)
    const extension = typeof format === 'string' ? format : 'png'
    const allowedFormats = ['jpg', 'png']
    try {
        assert(allowedFormats.indexOf(extension) !== -1)
    } catch (err) {
        const error = new Error()
        error.message = `Format ${format} not allowed. Allowed formats are: ${
            allowedFormats.join(', ')
        }`
        return Promise.reject(error)
    }

    const filename = path.join(dir, (index ? String(index) : uuid.v4()))
    const fullFilename = `${filename}.${extension}`
    debug(fullFilename)

    const customArgs = []
    if (format) {
        customArgs.push('-t')
        customArgs.push(extension)
    }
    if (cursor) {
        customArgs.push('-C')
    }
    if (noShadow) {
        console.error('no shadow!')
        customArgs.push('-o')
    }
    const args = [`-l${windowId}`, fullFilename]
    const allArgs = [].concat(customArgs, args)
    debug(allArgs)

    return new Promise((resolve, reject) => {
        // add code here to run exec
        const screencapture = cp.spawn('screencapture', allArgs)
        const data = []
        screencapture.stdout.on('data', (chunk) => {
            data.push(String(chunk))
        })
        screencapture.stdout.pipe(process.stdout)
        screencapture.stderr.pipe(process.stderr)
        screencapture.on('exit', () => resolve(fullFilename))
    })
}

// data from python script comes in a form of JSON array, like
// add example here
function parseArray(arr) {
    return {
        winid: arr[0],
        app: arr[1],
        title: arr[2],
        pid: arr[3],
    }
}


function getWindows(app, title, logStreams) {
    return getWindowsWithPython(logStreams)
        .then(windows => windows.map(parseArray))
        .then(windowsAsObjects => windowsAsObjects
            .filter((win) => {
                if (typeof app !== 'string') return true
                return win.app.toLowerCase().indexOf(app.toLowerCase()) !== -1
            })
            .filter((win) => {
                if (typeof title !== 'string') return true
                return win.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
            })
        )
}


function main(dir, winName, title, format) {
    assert(dir)
    const screenshots = []
    return getWindows(winName, title)
        .then((res) => {
            assert(res.length, 'No windows found')
            debug('Found windows:', res)
            return Promise.all(res.map(win =>
                screencapture(win.winid, dir, format)
            ))
        })
}

module.exports = main

// run2 interface
main.getWindows = (app, title, logStreams) => getWindows(app, title, logStreams)
main.screenshotById = (winId, dir, index, cursor, format, noShadow) => screencapture(winId, dir, format, index, cursor, noShadow)





