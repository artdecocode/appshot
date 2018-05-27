/* eslint-disable no-console */
import { createWriteStream } from 'fs'
import { askQuestions } from 'reloquent'
import { Transform } from 'stream'
import { WinIdStream } from '../lib'
import ListStream from '../lib/ListStream'
import CaptureStream from '../lib/CaptureStream'
import GIFEncoder from 'gif-stream/encoder'
import { debuglog } from 'util'

const LOG = debuglog('appshot')
const DEBUG = /appshot/.test(process.env.NODE_DEBUG)

const logError = (err) => {
  const { stack, message } = err
  if (DEBUG) {
    LOG(stack)
  } else {
    console.log(message)
  }
}

const getOutputStream = (path) => {
  const os = createWriteStream(path)
  os
    .on('error', () => {
      LOG('ENCODE STREAM ERROR')
    })
    .on('close', () => {
      LOG('%s CLOSE', path)
    })
  return os
}

export default async function Capture({
  wait,
  file,
  app,
  title,
  delay,
  // transparent = false,
}) {
  let w = wait
  let f = file
  if (!file) {
    f = await askQuestions({
      file: {
        text: 'gif name',
        async getDefault() {
          const parts = ['appshot']
          if (app) parts.push(`-${app}`)
          if (title) parts.push(`-${title}`)
          return `${parts.join('')}.gif`
        },
      },
    }, null, 'file')
  }
  while (w > 0) {
    await new Promise((r) => {
      console.log('...%s', w)
      setTimeout(r, 1000)
      w--
    })
  }

  process.on('SIGINT', async () => {
    if (typeof stop == 'function') {
      DEBUG ? LOG('\nSIGING\n') : console.log('\nStopping recording')
      await stop()
    }
  })
  console.log('Starting recording')
  const ls = new ListStream({ app, title, delay })

  let encodeStream
  let outputStream
  let i = 1

  let stop = null

  const T = new Transform({
    transform(buffer, enc, next) {
      DEBUG ? LOG('Added frame %s', buffer) : console.log(buffer)
      next()
    },
  })

  let stopped = false

  ls
    .pipe(new WinIdStream)
    .pipe(new CaptureStream({
      noShadow: true,
      file: f,
    }))
    .pipe(new Transform({
      transform(frame, enc, next) {
        if (stopped) return
        const { width, height, pixels } = frame
        if (!encodeStream) {
          LOG('Creating encode stream')
          encodeStream = new GIFEncoder(width, height, {
            repeatCount: Infinity,
          })
          outputStream = getOutputStream(f)
          encodeStream.pipe(outputStream)

          encodeStream.on('error', (err) => {
            next(err)
          })
          encodeStream.on('end frame', () => {
            this.push(`${i}`)
            i++
            next()
            // if (i == 2) {
            //   stop()
            // } else {
            //   next()
            // }
          })
        }

        stop = async () => {
          await new Promise((r) => {
            outputStream.on('close', () => {
              this.push(null)
              stopped = true
              r()
            })
            encodeStream.end()
          })
        }

        frame.delay = delay
        encodeStream.addFrame(frame)

        encodeStream.write(pixels)
      },
      objectMode: true,
    }))
    .on('end', () => {
      console.log('saved %s', f)
    })
    .on('error', (err) => {
      logError(err)
      ls.destroy(err)
    })
    .pipe(T)
}
