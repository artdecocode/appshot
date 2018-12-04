/* eslint-disable quote-props */
import argufy from 'argufy'

const config = {
  'list': { short: 'l', boolean: true },
  'title': { short: 't', command: true },
  'app': 'a',
  'delay': { short: 'y', number: true },
  'file': 'f',
  'noEmpty': { short: 'e', boolean: true },
  'dir': 'D',
  'wait': { short: 'w', number: true },
  'resize': { short: 'z', number: true },
  'colors': 'c',
  'max': { short: 'm', number: true },
  'gifsicle': { short: 'g', boolean: true },
  'chopTop': { short: 'T', number: true },
  'help': { short: 'h', boolean: true },
}

const args = argufy(config)

/** @type {string} Should the program just list results instead of taking a recording. */
export const _list = args['list']
/** @type {string} Window title to filter by. */
export const _title = args['title']
/** @type {string} App name to filter by. */
export const _app = args['app']
/** @type {number} Delay between each frame. Default `1000`. */
export const _delay = args['delay'] || 1000
/** @type {string} Filename with which to save. Can be an absolute path. */
export const _file = args['file']
/** @type {boolean} Don't print windows with empty titles. */
export const _noEmpty = args['noEmpty']
/** @type {string} Directory in which to save. Default is current working directory. */
export const _dir = args['dir']
/** @type {number} How many seconds to wait before starting the recording. Default `2s`. */
export const _wait = args['wait'] || 2
/** @type {number} Resize to this maximum width. */
export const _resize = args['resize']
/** @type {number} Adjust to this number of colors. */
export const _colors = args['colors']
/** @type {number} Maximum number of frames to capture. */
export const _max = args['max']
/** @type {boolean} Whether to save unoptimised. */
export const _gifsicle = args['gifsicle']
/** @type {number} How many pixels to trim off top */
export const _chopTop = args['chopTop']
/** @type {number} Display the help message. */
export const _help = args['help']