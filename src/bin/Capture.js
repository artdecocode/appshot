/* eslint-disable no-console */
import { lstatSync } from 'fs'
import { Transform } from 'stream'
import { debuglog } from 'util'
import { erase } from 'wrote'
import pump from 'pump'
import { WinIdStream, getFile } from '../lib'
import gif from '../lib/gifsicle'
import convert from '../lib/convert'
import ListStream from '../lib/ListStream'
import CaptureStream from '../lib/CaptureStream'
import { resolve } from 'path'

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

// const end = async (s) => {
//   await new Promise((r) => {
//     s.end(r)
//   })
// }
export default async function Capture({
  wait,
  file: _file,
  app,
  title,
  delay,
  resize,
  colors = 256,
  dir = '',
  gifsicle,
  max,
}) {
  let file = _file
  if (!file) {
    file = await getFile({ app, title })
  }
  file = resolve(dir, file)

  await timeout(wait)

  process.on('SIGINT', async () => {
    DEBUG ? LOG('\nSIGING\n') : console.log('\nStopping recording')
  })

  console.log('Starting recording (ctrl-c to stop)')
  const files = []

  const ls = new ListStream({ app, title, delay })
  const wis = new WinIdStream
  const cs = new CaptureStream({
    file,
    noShadow: true,
    filetype: gifsicle ? 'gif' : 'png',
  })
  const ts = new Transform({
    async transform(path, enc, next) {
      // const _cs = cs
      // const _ls = ls
      // const _wis = wis
      const p = `${path}`
      files.push(p)
      console.log(files.length)
      if (max && files.length >= max) {
        ls.destroy(new Error('error'))
      } else {
        next()
      }
    },
  })

  pump(
    ls,
    wis,
    cs,
    ts,
    async (error) => {
      if (error) {
        DEBUG ? LOG(error.stack) : console.log(error.message)
      }
      LOG('END')
      if (!files.length) return

      let size
      if (gifsicle) {
        await gif({ resize, file, files, delay, colors })
        size = getSize(file)
      } else {
        // image magic
        await convert({ resize, file, files })
        getSize(file)
        await gif({ file, files: [file], delay, colors })
        size = getSize(file)
      }
      console.log('saved %s (%s bytes)', file, size)
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

const getSize = (file) => {
  try {
    const info = lstatSync(file)
    LOG('%s: %s', file, info.size)
    return info.size
    // ; (DEBUG ? LOG : console.log)('saved %s (%s bytes)', file, info.size)
  } catch (err) {
    // LOG(err.message)
  }
}
