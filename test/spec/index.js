import spawn from 'spawncommand'
import { resolve } from 'path'

const exe = resolve(__dirname, '../../bin/index.js')

const T = {
  async 'executes binary'() {
    const { stderr, stdout, promise } = spawn(exe)
    stderr.pipe(process.stderr)
    stdout.pipe(process.stdout)
    await promise
  },
}

export default T
