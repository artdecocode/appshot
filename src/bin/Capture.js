/* eslint-disable no-console */
import { lstatSync } from 'fs'
import { Transform } from 'stream'
import { debuglog } from 'util'
import { erase } from 'wrote'
import pump from 'pump'
import { WinIdStream, getFile } from '../lib'
import gifsicle from '../lib/gifsicle'
import ListStream from '../lib/ListStream'
import CaptureStream from '../lib/CaptureStream'

const LOG = debuglog('appshot')
const DEBUG = /appshot/.test(process.env.NODE_DEBUG)

const timeout = async (w) => {
  while (w > 0) {
    await new Promise((r) => {
      console.log('...%s', w)
      setTimeout(r, 1000)
      w--
    })
  }
}

export default async function Capture({
  wait,
  file: _file,
  app,
  title,
  delay,
  resize,
  colors,
}) {
  let file = _file
  if (!file) {
    file = await getFile({ app, title })
  }

  await timeout(wait)

  process.on('SIGINT', async () => {
    DEBUG ? LOG('\nSIGING\n') : console.log('\nStopping recording')
  })

  console.log('Starting recording (ctrl-c to stop)')
  const files = []

  pump(
    new ListStream({ app, title, delay }),
    new WinIdStream,
    new CaptureStream({
      file,
      noShadow: true,
    }),
    new Transform({
      transform(path, enc, next) {
        files.push(`${path}`)
        console.log(files.length)
        next()
      },
    }),
    async (error) => {
      if (error) {
        DEBUG ? LOG(error.stack) : console.log(error.message)
      }
      LOG('END')
      if (!files.length) return

      await gifsicle({ resize, file, files, delay, colors })
      const info = lstatSync(file)
      ; (DEBUG ? LOG : console.log)('saved %s (%s bytes)', file, info.size)
      await Promise.all(files.map(async path => {
        try {
          await erase({ path })
          LOG('erased %s', path)
        } catch (err) {
          LOG(err)
        }
      }))
    }
  )
}
