import Table from 'cli-table'
import { getWindows, livePython } from '../src'
import { Writable } from 'stream'

function filterEmptyTitle({ title }) {
  return !!title
}


/**
 * @typedef {Object} ListConfig
 * @property {string} app An app name
 * @property {string} title A window title
 * @property {boolean} [noEmpty=true] Skip empty window titles
 * @property {boolean} [live=false] Continue retrieving the list
 */

/**
 * Get the List
 * @param {ListConfig} config
 */
export default async function list(config) {
  const {
    app,
    title,
    noEmpty = true,
    live = false,
    i = 1,
    logStreams = [],
  } = config

  if (!live) return
  console.log('live')
  const stream = livePython()
  stream.pipe(new Writable({
    write(data, encoding, next) {
      const t = getResString2(data)
      console.log(t)
      next()
    },
    objectMode: true,
  }))

  // console.error('get list app %s title %s filterTable %s live %s', app, title, filterTitle, live)
  // const res = await getWindows(app, title, logStreams)
  // const r = noEmpty ? res.filter(filterEmptyTitle) : res
  // printList(r)
  // if (live) {
  //   const newList = await list({ app, title, noEmpty, live, i: i + 1, logStreams })
  //   return newList
  // }
  // return res
}

function printList(res) {
  if (Array.isArray(res)) {
    const tableString = getResString(res)
    console.error(tableString)
  }
  return res
}

function getResString2(values) {
  const head = ['winid', 'app', 'title', 'pid']
  const table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    colWidths: [ 8, 18, 40, 8 ],
    head,
  })

  values.forEach(v => table.push(v))
  return table.toString()
}


function getResString(values) {
  const keys = ['winid', 'app', 'title', 'pid']
  const table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    colWidths: [ 8, 18, 40, 8 ],
    head: keys,
  })

  const arrayForTable = values.map(row =>
    keys.map((key) => row[key])
  )
  arrayForTable.forEach(row => table.push(row))
  return table.toString()
}
