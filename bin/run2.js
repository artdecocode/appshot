#!/usr/bin/env node

var argv = require('yargs')
    .count('verbose')
    .alias('v', 'verbose')
    .argv

VERBOSE_LEVEL = argv.verbose

function WARN()  { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments) }
function INFO()  { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments) }
function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments) }

// WARN("Showing only important stuff");
// INFO("Showing semi-important stuff too");
// DEBUG("Extra chatty mode");
const lib = require('../src/lib')
const main = require('../src/main')

const Table = require('cli-table')
const assert = require('assert')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const cp = require('child_process')

const screenshotsDir = argv.screenshotsDir || path.join(process.cwd(), 'screenshots')
const sessionId = argv.live ? uuid.v4() : '.'
const dir = path.join(screenshotsDir, sessionId)

// console.log(argv)

try {
    fs.mkdirSync(dir)
} catch (err) {
    if (/EEXIST: file already exists/.test(err.message)) {
        DEBUG('Directory already exists')
    } else {
        console.error(err)
        process.exit(1)
    }
}

function filterEmptyTitle(obj) {
    if (obj.title === '') return false
    return true
}

// [ { winid: 2438,
//     app: 'Google Chrome',
//     title: 'Logfile by z-vr · Pull Request #1 · Sobesednik/browsershot',
//     pid: 372 } ]

// class Window {

// }

function focus(app) {
    console.error('focusing on the app %s', app)
    const activePath = path.join(__dirname, '../etc/active.py')
    return new Promise((resolve, reject) => {
        const active = cp.spawn(activePath, [
            '--app',
            app
        ], {})
        active.on('exit', (code) => {
            if (code !== 0) {
                return reject(new Error(code))
            }
            return resolve()
        })
    })
}

// don't need logStreams yet
function screenshotWindow(win, dir, live, i) {
    if (!argv.quiet) {
        printList([win])
    }
    const index = (live) ? i || 1 : null
    const initPromise = (argv.focus ? focus(win.app) : Promise.resolve())
    return initPromise
        .then(() =>
            main.screenshotById(win.winid, dir, index, argv.cursor, argv.format,
                (argv.shadow !== undefined ? !argv.shadow : NO_SHADOW )) // make cursor part of aruments
                .then((res) => {
                    console.error(res) // location of the saved file
                    return live ? screenshotWindow(win, dir, live, index + 1) : res
                })
        )

}

function printList(res) {
    if (Array.isArray(res)) {
        const tableString = getResString(res)
        console.error(tableString)
    }
    return res
}

// get window id first, and run screenshotWindow recursively after that
// todo: get window id every time
function getWindow(app, title, filterTitle, live, i, logStreams) {
    // console.error('get window app %s title %s filterTable %s live %s', app, title, filterTitle, live)
    const index = (live) ? i || 1 : null

    return main.getWindows(app, title, logStreams)
        .then(res => {
            if (filterTitle) {
                return res.filter(filterEmptyTitle)
            }
            return res
        })
        .then(res => (res.length > 1 ? printList(res) : res)) // it will be printed later by screenshotWindow
        .then(res => {
            assert(Array.isArray(res))
            assert(res.length, 'At least one window must be found')
            assert(res[0].winid, 'Window must have a winid')
            return res[0]
        })
        .then(window => screenshotWindow(window, dir, live, null))
}

function getList(app, title, filterTitle, live, i, logStreams) {
    // console.error('get list app %s title %s filterTable %s live %s', app, title, filterTitle, live)
    const index = (live) ? i || 1 : null

    return main.getWindows(app, title, logStreams)
        .then(res => {
            if (filterTitle) {
                return res.filter(filterEmptyTitle)
            }
            return res
        })
        .then(printList)
        .then((res) =>
            (live ? getList(app, title, filterTitle, live, index + 1, logStreams) : res)
        )
}
function getResString(values) {
    const keys = ['winid', 'app', 'title', 'pid']
    const table = new Table({
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        colWidths: [ 8, 18, 40, 8 ],
        head: keys,
    })
    const arrayForTable = values.map(row =>
        keys.map((key) => row[key])
    )
    // console.error(arrayForTable)
    // const values = Object.keys(res).map(key => res[key])

    arrayForTable.forEach(row => table.push(row))
    return table.toString()
}


// process.on('unhandledRejection', console.error)

const HIDE_EMPTY_TITLE = false
const NO_SHADOW = false

const fn = argv.capture ? getWindow : getList
const exec = fn.bind(null, argv.app, argv.title,
    (argv.emptyTitle !== undefined ? !argv.emptyTitle : HIDE_EMPTY_TITLE ), argv.live, null)

const logStreams = lib.getLogWriteStreams(argv.logStdout, argv.logStderr)
logStreams
    .then((logStreams) => exec(logStreams))
    .then((res) => {
        // if (!argv.live) {
        //     console.error(res)
        // }
        return res
    })
    .catch(error => console.error(error))
