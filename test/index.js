import { exec } from 'child_process'
import { join } from 'path'

const exe = path.join(__dirname, '../bin', 'run2.js')

const T = {
  async 'executes binary'() {
    const { stdout: o, stderr: e } = await new Promise((r, j) => {
      exec(exe, {}, (error, stdout, stderr) => {
        if (error) return j(error)
        console.error(stdout)
        console.error(stderr)
        return r({ stdout, stderr })
      })
    })
    equal(o)
    equal(e)
  },
}

export default T
