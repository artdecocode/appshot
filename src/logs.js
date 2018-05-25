import fs from 'fs'
import { resolve } from 'path'

const LOGFILE = resolve('stdout.log')
const LOGFILE2 = resolve('stderr.log')

const rotateLogFile = async (logFile) => {
  await new Promise((r, j) => {
    // rotate(logFile, { compress: false }, (err) => {
    //   if (err) return j(err)
    //   return r(logFile)
    // })
  }
  )
}

// make sure that the log flag is either string or null
const getLogFile = (logFlag, defaultValue) => {
  if (typeof defaultValue !== 'string') {
    throw new Error('Please specify default value as string')
  }
  switch (typeof logFlag) {
  case 'undefined':
    return null
  case 'boolean':
    if (logFlag) {
      return defaultValue
    } else {
      throw new Error('Unexpected false value for a log flag')
    }
  case 'string':
    return logFlag
  }
}

// return either an array of write streams or undefined
export const getLogWriteStreams = async (logfile, logfile2) => {
  const logFile = getLogFile(logfile, LOGFILE)
  const logFile2 = getLogFile(logfile2, LOGFILE2)

  const p = [logFile, logFile2].map(async (file) => {
    if (file) {
      await rotateLogFile(file)
      return fs.createWriteStream(file)
    }
  })
  await Promise.all(p)
}
