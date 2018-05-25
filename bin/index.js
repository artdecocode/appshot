

// const lib = require('../src/lib')#!/usr/bin/env babel-node
import { screencapture } from '../src'
const assert = require('assert')
const uuid = require('uuid')
const { resolve } = require('path')
const fs = require('fs')
const cp = require('child_process')
import getArgs from './getArgs'
import list from './list'

const {
  // screenshotDir = 'screenshot',
  live,
  // capture,
  app,
  title,
} = getArgs(process.argv)

// const sessionId = live ? uuid.v4() : '.'
// const dir = resolve(screenshotDir, sessionId)

/**
 * find and list the windows
 */
;(async () => {
  await list({
    app,
    title,
    live,
  })
})()

// ;(async () => {
//   if (!capture) return
// })

// console.log(dir)

// process.exit()

// try {
//   fs.mkdirSync(dir)
// } catch (err) {
//   console.error(err)
//   process.exit(1)
// }


// // [ { winid: 2438,
// //     app: 'Google Chrome',
// //     title: 'Logfile by z-vr · Pull Request #1 · Sobesednik/browsershot',
// //     pid: 372 } ]

// // class Window {

// // }

// function focus(app) {
//   console.error('focusing on the app %s', app)
//   const activePath = path.join(__dirname, '../etc/active.py')
//   return new Promise((resolve, reject) => {
//     const active = cp.spawn(activePath, [
//       '--app',
//       app,
//     ], {})
//     active.on('exit', (code) => {
//       if (code !== 0) {
//         return reject(new Error(code))
//       }
//       return resolve()
//     })
//   })
// }

// // don't need logStreams yet
// function screenshotWindow(win, dir, live, i) {
//   if (!argv.quiet) {
//     printList([win])
//   }
//   const index = (live) ? i || 1 : null
//   const initPromise = (argv.focus ? focus(win.app) : Promise.resolve())
//   return initPromise
//     .then(() =>
//     screencapture(win.winid, dir, index, argv.cursor, argv.format,
//         (argv.shadow !== undefined ? !argv.shadow : NO_SHADOW )) // make cursor part of aruments
//         .then((res) => {
//           console.error(res) // location of the saved file
//           return live ? screenshotWindow(win, dir, live, index + 1) : res
//         })
//     )
// }



// // get window id first, and run screenshotWindow recursively after that
// // todo: get window id every time
// function getWindow(app, title, filterTitle, live, i, logStreams) {
//   // console.error('get window app %s title %s filterTable %s live %s', app, title, filterTitle, live)
//   const index = (live) ? i || 1 : null

//   return main.getWindows(app, title, logStreams)
//     .then(res => {
//       if (filterTitle) {
//         return res.filter(filterEmptyTitle)
//       }
//       return res
//     })
//     .then(res => (res.length > 1 ? printList(res) : res)) // it will be printed later by screenshotWindow
//     .then(res => {
//       assert(Array.isArray(res))
//       assert(res.length, 'At least one window must be found')
//       assert(res[0].winid, 'Window must have a winid')
//       return res[0]
//     })
//     .then(window => screenshotWindow(window, dir, live, null))
// }



// process.on('unhandledRejection', console.error)

// const HIDE_EMPTY_TITLE = false
// const NO_SHADOW = false

// const fn = argv.capture ? getWindow : getList
// const exec = fn.bind(null, argv.app, argv.title,
//   (argv.emptyTitle !== undefined ? !argv.emptyTitle : HIDE_EMPTY_TITLE ), argv.live, null)

// const logStreams = lib.getLogWriteStreams(argv.logStdout, argv.logStderr)
// logStreams
//   .then((logStreams) => exec(logStreams))
//   .then((res) => {
//     // if (!argv.live) {
//     //     console.error(res)
//     // }
//     return res
//   })
//   .catch(error => console.error(error))
