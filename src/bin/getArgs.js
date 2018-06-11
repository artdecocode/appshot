import argufy from 'argufy'

export default () => {
  const {
    list,
    title,
    app,
    delay,
    file,
    noEmpty,
    dir,
    wait,
    resize,
    colors,
  } = argufy({
    list: { short: 'l', boolean: true },
    title: { short: 't', command: true },
    app: 'a',
    delay: { short: 'y', number: true },
    file: 'f',
    noEmpty: { short: 'e', boolean: true },
    dir: 'D',
    wait: { short: 'w', number: true },
    resize: 'z',
    colors: 'c',
  }, process.argv)
  return {
    /** @type {string} Should the program just list results instead of taking a recording. */
    list,
    /** @type {string} Window title to filter by. */
    title,
    /** @type {string} App name to filter by. */
    app,
    /** @type {number} Delay between each frame. */
    delay,
    /** @type {string} Filename with which to save. Can be an absolute path. */
    file,
    /** @type {boolean} Don't print windows with empty titles. */
    noEmpty,
    /** @type {string} Directory in which to save. Default is current working directory. */
    dir,
    /** @type {number} How many seconds to wait before starting the recording. */
    wait,
    /** @type {number} Resize to this maximum width. */
    resize,
    /** @type {number} Adjust to this number of colors. */
    colors,
  }
}

// export default ()
// const find = (argv, long, short, bool) => {
//   const sre = new RegExp(`-${short}`)
//   const lre = new RegExp(`--${long}`)
//   const found = argv.find(a => (sre.test(a) || lre.test(a)))
//   if (!found) return
//   if (bool) return true
//   const i = argv.indexOf(found)
//   const ia = i + 1
//   const value = argv[ia]
//   return value
// }

// export default ([ ,, ...argv ]) => {
//   /** @type {string} */
//   const [first] = argv
//   const simpleTitle = first && first.startsWith('-') ? undefined : first
//   const list = find(argv, 'list', 'l', true)

//   const app = find(argv, 'app', 'a')
//   const title = find(argv, 'title', 't')
//   const delay = find(argv, 'delay', 'y')
//   const file = find(argv, 'file', 'f')
//   const wait = find(argv, 'wait', 'w')
//   const noEmpty = find(argv, 'no-empty', 'e')
//   const resize = find(argv, 'resize', 'z')
//   const colors = find(argv, 'colors', 'c')
//   const dir = find(argv, 'dir', 'D')

//   return
// }
