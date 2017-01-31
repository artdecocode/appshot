const path = require('path')
const cp = require('child_process')
const uuid = require('uuid')
const assert = require('assert')
const debug = require('debug')('main')
const fs = require('fs')
const Writable = require('stream').Writable;
const rotate = require('log-rotate');
const pyPath = path.join(__dirname, 'etc', 'run.py');

function rotateLogFile(logFile) {
    return new Promise(
        (resolve, reject) => {
            rotate(logFile, { compress: false }, (err) => {
                if (err) return reject(err)
                return resolve(logFile)
            })
        }
    )
}

const logfile = path.join(__dirname, '../logs', `stdout.log`)
const logfile2 = path.join(__dirname, '../logs', `stderr.log`)

const getLogWriteStreams = () => {
    return Promise.all([
        rotateLogFile(logfile),
        rotateLogFile(logfile2),
    ])
        .then(logFiles => 
            logFiles.map(logfile => 
                fs.createWriteStream(logfile)
            ))
}

function spawnPython(resolve, reject, logStreams) {
    assert(Array.isArray(logStreams) && logStreams.length === 2)
    const python = cp.spawn('python', [pyPath])
    const data = []
    
    python.stdout.pipe(logStreams[0])
    python.stderr.pipe(logStreams[1])
    
    const writable = new Writable()
    writable._write = (chunk, encoding, callback) => {
        debug('>>> ========')
        debug(String(chunk).trim())
        debug('pushing chunk >>>')
        data.push(String(chunk).trim())
        callback(null)
    }

    python.stdout
        .pipe(writable)
    
    python.on('exit', (code) => {
        if (code !== 0) return reject(new Error(`Process exited with code ${code}`))
        return resolve(data.join())
    })
}

function getWindowsWithPython() {
    return getLogWriteStreams()
        .then(logStreams => 
            new Promise((resolve, reject) => 
                spawnPython(resolve, reject, logStreams)
            ))
        .then(JSON.parse)
        .catch((err) => { 
            console.error(err);
            throw err;
        })
}

function screencapture(windowId, dir, format, index, cursor) {
    assert(windowId)
    assert(dir)
    const extension = typeof format === 'string' ? format : 'png'
    const allowedFormats = ['jpg', 'png']
    assert(allowedFormats.indexOf(extension) !== -1, 'Format not allowed.')
    
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
    const args = [`-l${windowId}`, fullFilename]
    const allArgs = [].concat(customArgs, args)
    debug(allArgs)
    
    return new Promise((resolve, reject) => {
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


function getWindows(app, title) {
    return getWindowsWithPython()
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

main.getWindows = (app, title) => getWindows(app, title)
main.screenshotById = (winId, dir, index, cursor, format) => screencapture(winId, dir, format, index, cursor)





