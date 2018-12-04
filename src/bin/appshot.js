#!/usr/bin/env node
import { _list, _app, _title, _file, _delay, _wait, _noEmpty, _resize,
  _colors, _dir, _gifsicle, _max, _chopTop, _help,
} from './get-args'
import Capture from './Capture'
import List from './List'
import usage from './commands/usage'

(async () => {
  if (_help) return usage()

  if (_list) {
    return await List({
      app: _app,
      title: _title,
      delay: _delay,
      noEmpty: _noEmpty,
    })
  }
  await Capture({
    wait: _wait,
    file: _file,
    app: _app,
    title: _title,
    delay: _delay,
    resize: _resize,
    colors: _colors,
    dir: _dir,
    gifsicle: _gifsicle,
    max: _max,
    chopTop: _chopTop,
  })
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
