import spawn from 'spawncommand'
import { Transform } from 'stream'
import { resolve, parse } from 'path'
import { tmpdir } from 'os'
import { debuglog } from 'util'

const LOG = debuglog('appshot')

/**
 * This transform stream will take a screenshot of a read window id and push a decoded PNG image.
 */
export default class CaptureStream extends Transform {
  constructor({ cursor, noShadow, file = 'appshot.gif' }) {
    super({
      objectMode: true,
    })
    this.cursor = cursor
    this.noShadow = noShadow
    this.filetype = 'gif'
    this.i = 0

    const { name } = parse(file)
    this.name = name
  }
  /**
   * @param {number} winid
   * @param {*} encoding
   * @param {*} next
   */
  async _transform(winid, encoding, next) {
    const d = new Date()
    LOG('<CAPTURE transform at %s:%s.%s>', d.getMinutes(), d.getSeconds(), d.getMilliseconds())

    try {
      const path = await capture({
        winid,
        filetype: this.filetype,
        cursor: this.cursor,
        noShadow: this.noShadow,
        getFilename: () => {
          return `${this.name}-${this.i}`
        },
      })
      this.push(path)
      this.i++
      next()
    } catch (err) {
      next(err)
    }
  }
}

const randomFilename = () => {
  const rnd = Math.ceil(Math.random() * 100000)
  return `appshot-${rnd}`
}

function getTempFile(getFilename = randomFilename) {
  const filename = getFilename()
  const tempFile = resolve(tmpdir(), filename)
  return tempFile
}

/**
 * Create a screenshot into a temp directory.
 */
const capture = async ({
  winid, cursor, noShadow, filetype = 'png', getFilename,
}) => {
  const p = getTempFile(getFilename)
  const path = `${p}.${filetype}`

  const allArgs = [
    ...(cursor ? ['-C'] : []),
    ...(noShadow ? ['-o'] : []),
    `-t${filetype}`,
    `-l${winid}`,
    path,
  ]
  LOG('%s %s', 'screencapture', allArgs.join(' '))
  const { promise } = spawn('screencapture', allArgs)
  const { stderr } = await promise
  if (stderr) throw new Error(stderr)
  return path
}
