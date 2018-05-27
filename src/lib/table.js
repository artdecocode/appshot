import Table from 'cli-table'
import { Transform } from 'stream'

export default class TableStream extends Transform {
  constructor() {
    super({ objectMode: true })
    this.head = ['winid', 'app', 'title', 'pid']
  }
  _transform(data, encoding, next) {
    const s = getTable(data, this.head)
    this.push(`${s}\n`)
    next()
  }
}

export function getTable(values, head) {
  const table = new Table({
    head,
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    colWidths: [ 8, 18, 40, 8 ],
  })

  table.push(...values)
  return table.toString()
}
