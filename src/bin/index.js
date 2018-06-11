#!/usr/bin/env node
import getArgs from './getArgs'
import Capture from './Capture'
import List from './List'

const {
  list,
  app,
  title,
  file,
  delay = 1000,
  wait = 2,
  noEmpty,
  resize,
  colors,
  dir,
  gifsicle,
  max,
} = getArgs(process.argv)

;(async () => {
  if (list) {
    await List({
      app,
      title,
      delay,
      noEmpty,
    })
  } else {
    await Capture({
      wait,
      file,
      app,
      title,
      delay,
      resize,
      colors,
      dir,
      gifsicle,
      max,
    })
  }
})()

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
