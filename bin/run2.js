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

const main = require('../src/main')
const lib = require('../src/lib')
const assert = require('assert')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const screenshotsDir = argv.screenshotsDir || 'screenshots'
const sessionId = argv.live ? uuid.v4() : '.'
const dir = path.join(process.cwd(), screenshotsDir, sessionId)

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

// don't need logStreams yet
function screenshotWindow(winId, dir, live, i) {
    console.error('screenshot window winid %s live %s %i', winId, live, i)
    const index = (live) ? i || 1 : null
    return main.screenshotById(winId, dir, index, argv.cursor) // make cursor part of aruments
        .then((res) => {
            if (live) {
                console.error(res)
                return screenshotWindow(winId, dir, live, index + 1)
            }
            return res
        })
}

// get window id first, and run screenshotWindow recursively after that
// todo: get window id every time
function getWindow(app, title, filterTitle, live, i, logStreams) {
    console.error('get window app %s title %s filterTable %s live %s', app, title, filterTitle, live)
    const index = (live) ? i || 1 : null

    let cachedWinId

    return main.getWindows(app, title, logStreams)
        .then(res => {
            if (filterTitle) {
                return res.filter(filterEmptyTitle)
            }
            return res
        })
        .then(res => {
            assert(Array.isArray(res))
            assert(res.length)
            return res
        })
        .then(res => res[0])
        .then(res => {
            assert(res.winid, 'Window must have a winid')
            cachedWinId = res.winid
            return cachedWinId
        })
        .then(res => screenshotWindow(res, dir, live))
}

function getList(app, title, filterTitle, live, i, logStreams) {
    console.error('get list app %s title %s filterTable %s live %s', app, title, filterTitle, live)
    const index = (live) ? i || 1 : null

    return main.getWindows(app, title, logStreams)
        .then(res => {
            if (filterTitle) {
                return res.filter(filterEmptyTitle)
            }
            return res
        })
        .then((res) => {
            if (live) {
                console.error(res)
            }
            return live ? getList(app, title, filterTitle, live, index + 1, logStreams) : res
        })
}

// process.on('unhandledRejection', console.error)

const fn = argv.capture ? getWindow : getList
const exec = fn.bind(null, argv.app, argv.title, !argv.all, argv.live, null)

const logStreams = lib.getLogWriteStreams(argv.logStdout, argv.logStderr)
logStreams
    .then((logStreams) => exec(logStreams))
    .then((res) => {
        if (!argv.live) {
            console.error(res)
        }
        return res
    })
    .catch(error => console.error(error))
