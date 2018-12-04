import { makeTestSuite } from 'zoroaster'
import { BIN } from '../context'

export default makeTestSuite('test/result/index.md', {
  fork: BIN,
  assertResults({ stdout }) {
    console.log(stdout )
  },
})