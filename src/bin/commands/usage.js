import usually from 'usually'

export default function Usage() {
  const s = usually({
    usage: {
      '-h': 'print help',
      '-l': 'Run in the list mode',
      '-T, -chopTop': 'Chop this number of pixels from the top.',
      '-t, -title': 'The title of the window to look for.',
      '-a, -app': 'The app name to look for.',
      '-m, -max': 'The maximum number of frames to capture.',
      '-y, delay': 'The number of milliseconds between shots',

    },
    description: 'Looks for windows using Python\'s Quarts module and screenshots them into temporary directory. Then makes a gif and using imagemagic and gifsicle optimizes it, and saves under the  specified filename. If no filename is specified, one is suggested.',
    example: 'appshot -a Terminal -T 23',
  })
  console.log(s)
}