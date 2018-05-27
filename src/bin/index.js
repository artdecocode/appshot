// #!/usr/bin/env node
import getArgs from './getArgs'
import Capture from './Capture'
import List from './List'

const {
  live,
  capture,
  app,
  title,
  file,
  delay = 1000,
  wait = 2,
  noEmpty,
} = getArgs(process.argv)

;(async () => {
  if (capture) {
    await Capture({
      wait,
      file,
      app,
      title,
      delay,
    })
  } else {
    await List({
      app,
      title,
      delay,
      noEmpty,
      live,
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
