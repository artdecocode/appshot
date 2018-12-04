import { ok } from 'zoroaster'
import { fork } from 'spawncommand'
import { resolve } from 'path'
import Context from '../context'
import { debuglog } from 'util'

const LOG = debuglog('appshot-test')

const path = process.env.ALAMODE_ENV == 'test-build' ?
  resolve(__dirname, '../../build/bin') :
  resolve(__dirname, '../../src/bin')

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'executes binary'({ TEMP }) {
    const { stderr, stdout, stdin, promise } = fork(path, [
      '-D', TEMP,
    ], {
      stdio: 'pipe',
      execArgv: [
        // '--inspect-brk=9229'
      ],
    })
    // stdout.pipe(process.stdout)
    // stderr.pipe(process.stderr)

    let buffer = new Buffer('')
    const p = new Promise((r, j) => {
      stdout.on('data', (data) => {
        LOG(' > ', `${data}`)
        buffer = Buffer.concat([buffer, data])
        const d = `${buffer}`
        const re = /gif name/.test(d)
        if (re) {
          // return
          r()
        } else {
          j(d)
        }
      })
    })
    await p
    stdin.write('\n')

    const { stdout: o, stderr: e, code } = await promise
    ok(/gif name: \[appshot.gif\] ...2\s+...1\s+Starting recording \(ctrl-c to stop\)/.test(o))
  },
}

// export default T
//     // stderr.pipe(process.stderr)
//     // stdout.pipe(process.stdout)
//     let buffer = new Buffer('')
//     await new Promise((r, j) => {
//       stdout.on('data', (data) => {
//         buffer = Buffer.concat([buffer, data])
//         const d = `${buffer}`
//         LOG(' > ', d)
//         const re = /gif name/.test(d)
//         if (re) {
//           // return
//           r()
//         } else {
//           j(d)
//         }
//       })
//     })
//     const p = new Promise((r, j) => {
//       stdout.on('data', (data) => {
//         LOG(' > ', `${data}`)
//         buffer = Buffer.concat([buffer, data])
//         const d = `${buffer}`
//         const re = /gif name/.test(d)
//         if (re) {
//           // return
//           r()
//         } else {
//           j(d)
//         }
//       })
//     })
//     stdin

//     const { stdout: o, stderr: e } = await promise
//     console.log(o)
//     console.log(e)
//   },
// }

export default T
