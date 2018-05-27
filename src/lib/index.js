import { Transform } from 'stream'

/**
 * Transform a list of ids into a single window id.
 */
export class WinIdStream extends Transform {
  constructor() {
    super({
      objectMode: true,
    })
  }
  _transform(data, enc, next) {
    if (data.length > 1) {
      console.log('More than one window is found, please update the filter with -a and -t options')
      data.forEach(([, a, t]) => {
        console.log('  %s :: %s', a, t)
      })
    } else if (!data.length) {
      console.log('No windows are found')
    } else {
      const [[win]] = data
      this.push(win)
    }
    next()
  }
}
