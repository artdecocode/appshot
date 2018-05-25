// const getValue = (arg) => {
//   const [, value] = arg.split('=')
//   return value
// }

export default ([ ,, ...argv ]) => {
  const capture = argv.some(a => ['-c', '--capture'].includes(a))
  const live = argv.find(a => ['-l', '--live'].includes(a))
  let app
  const appFound = argv.find(a => (/-a/.test(a) || /--app/.test(a)))
  if (appFound) {
    const i = argv.indexOf(appFound)
    const ia = i + 1
    const value = argv[ia]
    app = value
  }

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
    screenshotDir: undefined,
  }
}
