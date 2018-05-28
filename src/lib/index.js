import { Transform } from 'stream'
import { askQuestions } from 'reloquent'
import { debuglog } from 'util'

const LOG = debuglog('appshot')

/**
 * Transform a list of ids into a single window id.
 */
export class WinIdStream extends Transform {
  constructor() {
    super({
      objectMode: true,
      highWaterMark: 0,
    })
  }
  _transform(data, enc, next) {
    if (data.length > 1) {
      const msg = 'More than one window is found, please update the filter with -a and -t options'
      const windows = data.map(([, a, t]) => {
        const s = `  ${a} :: ${t}`
        return s
      }).join('\n')
      const err = new Error(`${msg}\n${windows}`)
      next(err)
    } else if (!data.length) {
      const msg = 'No windows are found'
      const err = new Error(msg)
      next(err)
    } else {
      const [[win]] = data
      this.push(win)
      next()
    }
  }
}

export const getFile = async ({ app, title }) => {
  const file = await askQuestions({
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
  return file
}
