
import { Transform } from 'stream'
import ListStream from '../lib/ListStream'
import TableStream from '../lib/table'

/**
 * @typedef {Object} ListConfig
 * @property {string} [app] An app name
 * @property {string} [title] A window title
 * @property {boolean} [noEmpty=true] Skip empty window titles
 * @property {boolean} [live=false] Continue retrieving the list
 * @property {number} [delay=1000] How often in ms to capture windows in live mode. Default 1000ms.
 */

/**
 * @param {ListConfig} config
 */
export default async function List(config = {}) {
  const {
    app, title, noEmpty, delay, live,
  } = config
  const ls = new ListStream({ app, title, live, noEmpty, delay })
  const ts = new TableStream()

  const checkLast = new Transform({
    transform(buffer, encoding, next) {
      this.push(buffer)
      if (!live) {
        ls.destroy()
      }
      next()
    },
    objectMode: true,
  })

  ls
    .pipe(checkLast)
    .pipe(ts)
    .pipe(process.stdout)
}


// /**
//  * Get the stream which will print data as a table.
//  * @param {ListConfig} config
//  */
// export default async function list(config) {
//   const ls = makeListStream(config)
//   const ts = new TableStream()
//   const s = ls
//     .pipe(ts)

//   return s
// }
