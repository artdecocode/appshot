import spawn from 'spawncommand'
import { Transform } from 'stream'
import { erase } from 'wrote'
import GIFDecoder from 'gif-stream/decoder'
import { createReadStream } from 'fs'
import neuquant from 'neuquant'
import concat from 'concat-frames'

import { resolve, basename, parse } from 'path'
import { tmpdir } from 'os'

// import PNG from 'png-js'
import { debuglog } from 'util'
const LOG = debuglog('appshot')

/**
 * This transform stream will take a screenshot of a read window id and push a decoded PNG image.
 */
export default class CaptureStream extends Transform {
  constructor({ cursor, noShadow, file = 'appshot.gif' }) {
    super({
      objectMode: true,
      highWaterMark: 1,
    })
    this.cursor = cursor
    this.noShadow = noShadow
    this.dimensions = null
    this.filetype = 'gif'
    this.i = 0

    const { name } = parse(file)
    this.name = name
  }
  _read(size) {
    // console.log('capture _read request')
    super._read(size)
  }
  /**
   *
   * @param {number} winid
   * @param {*} encoding
   * @param {*} next
   */
  async _transform(winid, encoding, next) {
    LOG('<CAPTURE TRANSFORM>')
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
      LOG('  captured')

      await new Promise((r, j) => {
        const rs = createReadStream(path)
        rs
          .pipe(new GIFDecoder)
          .pipe(new neuquant.Stream)
          .pipe(concat(async (frames) => {
            const [frame] = frames
            LOG('  pushing %sx%s', frame.width, frame.height)
            this.push(frame)
            await erase({ path })
            LOG('  erased temp file')
            this.i++
            r()
          }))
          .on('error', (err) => {
            j(err)
          })

        rs
          .on('error', (err) => {
            j(err)
          })
      })
      LOG('</ CAPTURE TRANSFORM>')
      next()
    } catch (err) {
      LOG('  %s', err.message)
      LOG('</ CAPTURE TRANSFORM>')
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

