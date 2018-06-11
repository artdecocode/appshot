import argufy from 'argufy'

export default () => {
  const config = {
    list: { short: 'l', boolean: true },
    title: { short: 't', command: true },
    app: 'a',
    delay: { short: 'y', number: true },
    file: 'f',
    noEmpty: { short: 'e', boolean: true },
    dir: 'D',
    wait: { short: 'w', number: true },
    resize: { short: 'z', number: true },
    colors: 'c',
    max: { short: 'm', number: true },
    gifsicle: { short: 'g', boolean: true },
  }
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
    max,
    gifsicle,
  } = argufy(config, process.argv)
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
    /** @type {number} Maximum number of frames to capture. */
    max,
    /** @type {boolean} Whether to save unoptimised. */
    gifsicle,
  }
}
