// import { resolve } from 'path'
// import { ensurePath } from 'wrote'

// const TEMP_PATH = resolve(__dirname, '../temp')

// /**
//  * A context for recording of gifs.
//  */
// export default class Context {
//   /**
//    * Return path to the temp directory, making sure it exists (test/temp)
//    */
//   async getTemp() {
//     await ensurePath(resolve(TEMP_PATH, 'test.ensure'))
//     return TEMP_PATH
//   }
// }

import TempContext from 'temp-context'

export default class Context extends TempContext {
  async _destroy() {
    await this.write('test.txt', 'test-data')
    // don't destroy the directory
  }
}

export const BIN = process.env['ALAMODE_ENV'] ? 'build/bin/appshot.js' : 'src/bin'