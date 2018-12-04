import { fork } from 'child_process'

const { stdout, stderr } = fork('src/bin', ['-l'], {
  stdio: 'pipe',
})

stdout.pipe(process.stdout)
stderr.pipe(process.stderr)