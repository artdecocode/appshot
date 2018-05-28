import WindowInfo from 'window-info'
import { Transform } from 'stream'
import { debuglog } from 'util'

const LOG = debuglog('appshot')

export default class ListStream extends Transform {
  constructor({ app, title, noEmpty, delay }) {
    super({
      objectMode: true,
    })
    this.app = app
    this.title = title
    this.are = app && new RegExp(app, 'i')
    this.tre = title && new RegExp(title, 'i')
    this.noEmpty = noEmpty

    this.wi = new WindowInfo({
      delay,
    })
    this.wi.pipe(this)
  }
  _destroy(err) {
    this.wi.destroy(err)
  }
  _transform(data, encoding, next) {
    next()
    const date = new Date()
    LOG('<LIST at %s:%s.%s>', date.getMinutes(), date.getSeconds(), date.getMilliseconds())
    const d = data
      .filter(([,a]) => {
        if (!this.app) return true
        return this.are.test(a)
      })
      .filter(([,,t]) => {
        if (!t && this.noEmpty) return false
        if (!this.title) return true
        return this.tre.test(t)
      })
    this.push(d)
  }
}
