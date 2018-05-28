import { Transform } from 'stream'
import pump from 'pump'
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
  pump(
    ls,
    new Transform({
      transform(buffer, encoding, next) {
        this.push(buffer)
        if (!live) {
          ls.destroy()
        } else {
          next()
        }
      },
      objectMode: true,
    }),
    new TableStream(),
    process.stdout,
  )
}
