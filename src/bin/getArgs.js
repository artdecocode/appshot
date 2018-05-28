const find = (argv, long, short, bool) => {
  const sre = new RegExp(`-${short}`)
  const lre = new RegExp(`--${long}`)
  const found = argv.find(a => (sre.test(a) || lre.test(a)))
  if (!found) return
  if (bool) return true
  const i = argv.indexOf(found)
  const ia = i + 1
  const value = argv[ia]
  return value
}

export default ([ ,, ...argv ]) => {
  /** @type {string} */
  const [first] = argv
  const simpleTitle = first.startsWith('-') ? undefined : first
  const capture = find(argv, 'capture', 'c', true)
  const live = find(argv, 'live', 'l', true)

  const app = find(argv, 'app', 'a')
  const title = find(argv, 'title', 't')
  const delay = find(argv, 'delay', 'y')
  const file = find(argv, 'file', 'f')
  const wait = find(argv, 'wait', 'w')
  const noEmpty = find(argv, 'no-empty', 'e')
  const resize = find(argv, 'resize', 'z')

  return {
    /**
     * Should the program take a screenshot.
     */
    capture,
    live,
    /**
     * App name to filter by.
     */
    app,
    /**
     * Window title to filter by.
     */
    title: title || simpleTitle,
    delay,
    file,
    noEmpty,
    wait: wait ? parseInt(wait) : wait,
    screenshotDir: undefined,
    resize,
  }
}
