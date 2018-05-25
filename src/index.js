import spawn from 'spawncommand'
import { resolve } from 'path'
import { v4 } from 'uuid'
import assert from 'assert'
import { debuglog } from 'util'
import { Writable, Transform } from 'stream'
import { spawn as Spawn } from 'child_process'

const debug = debuglog('appshot')

const PY = resolve(__dirname, '../etc/run.py')

export function livePython({
  debounce = 1000,
} = {}) {
  const p = Spawn('python', [PY, 1])
  let buffer = new Buffer('')
  const t = new Transform({
    transform(chunk, encoding, next) {
      buffer = Buffer.concat([buffer, chunk])
      let s
      try {
        s = JSON.parse(buffer)
      } catch (err) {
        next()
        return
      }
      buffer = new Buffer('')
      this.push(s)
      setTimeout(() => {
        p.stdin.write('\n')
      }, debounce)
      next()
    },
    objectMode: true,
  })
  const dt = new Transform({
    transform(data, enc, next) {
      debuglog('received and parsed data from python')
      this.push(data)
      next()
    },
    objectMode: true,
  })
  const s = p.stderr
    .pipe(t)
    .pipe(dt)

  return s
}

async function spawnPython([o, e] = []) {
  const { promise, stdout, stderr } = spawn('python', [PY])

  if (o instanceof Writable) {
    stdout.pipe(o)
  }
  if (e instanceof Writable) {
    stderr.pipe(e)
  }

  const { stdout: so, stderr: se, code } = await promise
  if (code > 0) {
    const er = getPythonExitError(se, code)
    throw er
  }
  return so
}

function getPythonExitError(message, code) {
  const title = `Process exited with code ${code}`
  const error = new Error(message)
  error.title = title
  return error
}

async function getWindowsWithPython(logStreams) {
  const json = await spawnPython(logStreams)
  const res = JSON.parse(json)
  return res
}

async function screencapture(windowId, dir, format = 'png', index = v4(), cursor, noShadow) {
  assert(windowId)
  assert(dir)
  const allowedFormats = ['jpg', 'png', 'pdf', 'tiff']
  if (allowedFormats.indexOf(format) < 0) {
    const message = `Format ${format} not allowed. Allowed formats are: ${
      allowedFormats.join(', ')
    }`
    const error = new Error(message)
    throw error
  }

  const filename = `${index}.${format}`
  const path = resolve(dir, filename)
  debug(path)

  const customArgs = []
  if (format) {
    customArgs.push('-t')
    customArgs.push(format)
  }
  if (cursor) {
    customArgs.push('-C')
  }
  if (noShadow) {
    customArgs.push('-o')
  }
  const allArgs = [...customArgs, `-l${windowId}`, path]
  debug(allArgs)

  const { stdout, stderr, promise } = spawn('screencapture', allArgs)
  stdout.pipe(process.stdout)
  stderr.pipe(process.stderr)
  await promise
  return path
}

// data from python script comes in a form of JSON array
function parseArray([winid, app, title, pid] = []) {
  return {
    winid,
    app,
    title,
    pid,
  }
}

export const getWindows = async (app, title, logStreams) => {
  const windows = await getWindowsWithPython(logStreams)
  const w = windows
    .map(parseArray)
    .filter(win => {
      if (!app) return true
      return win.app.toLowerCase().indexOf(app.toLowerCase()) >= 0
    })
    .filter((win) => {
      if (!title) return true
      return win.title.toLowerCase().indexOf(title.toLowerCase()) >= 0
    })
  return w
}

export default async function main(dir, winName, title, format) {
  assert(dir)
  const res = await getWindows(winName, title)
  assert(res.length, 'No windows found')
  debug('Found windows:', res)
  const p = res.map(async ({ winid }) => {
    const r = await screencapture(winid, dir, format)
    return r
  })
  const r = await Promise.all(p)
  return r
}
