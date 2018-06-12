import spawn from 'spawncommand'
import { debuglog } from 'util'
const LOG = debuglog('appshot')

const getChopTop = (chopTop = 0) => {
  if (chopTop) {
    return ['-gravity', 'North', '-chop', `x${chopTop}`]
  }
  return []
}

export default async ({
  resize, file, files, delay, chopTop,
}) => {
  const args = getConvertArgs({
    resize,
    delay,
  })
  const cp = getChopTop(chopTop)
  const allArgs = [...cp, ...files, ...args, file]
  LOG('%s %s', 'convert', allArgs.join(' '))
  const { stderr, promise } = spawn('convert', allArgs)
  stderr.on('data', (data) => {
    LOG(`${data}`)
  })
  await promise
  return file
}

const getConvertArgs = ({
  resize,
  colors,
  optimize = 'OptimizeFrame',
  delay,
  chopTop,
  // disposal,
} = {}) => {
  const args = []
  if (resize) args.push('-resize', resize)
  if (colors) args.push('-colors', colors)
  if (optimize) args.push('-layers', optimize)
  if (delay) args.push('-delay', delay / 10)
  return args
}
