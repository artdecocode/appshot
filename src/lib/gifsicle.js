import spawn from 'spawncommand'
import gifsicleBin from 'gifsicle'
import { debuglog } from 'util'

const LOG = debuglog('appshot')

export default async ({
  resize, file, files, delay, colors,
}) => {
  const args = getGifsicleArgs({
    resize,
    colors,
    delay,
    optimize: 2,
    // disposal: 'background',
  })
  const allArgs = [...args, ...files, '-o', file]
  LOG('%s %s', 'gifsicle', allArgs.join(' '))
  const { stderr, promise } = spawn(gifsicleBin, allArgs)
  stderr.on('data', (data) => {
    LOG(`${data}`)
  })
  await promise
}

const getGifsicleArgs = ({
  resize,
  colors,
  optimize,
  delay,
  disposal,
} = {}) => {
  const args = ['--no-extensions']
  if (resize) args.push('--resize', `${resize}x_`)
  if (colors) args.push('--colors', colors)
  if (optimize) args.push(`--optimize=${optimize}`)
  if (delay) args.push('--delay', delay / 10)
  if (disposal) args.push('--disposal', disposal)
  return args
}
