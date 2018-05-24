const fs = require('fs')
const rotate = require('log-rotate')
const path = require('path')

function rotateLogFile(logFile) {
  return new Promise(
    (resolve, reject) => {
      rotate(logFile, { compress: false }, (err) => {
        if (err) return reject(err)
        return resolve(logFile)
      })
    }
  )
}

const LOGFILE = path.join(__dirname, '../logs', 'python-stdout.log')
const LOGFILE2 = path.join(__dirname, '../logs', 'python-stderr.log')

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
const getLogWriteStreams = (logfile, logfile2) => {
  const logFile = getLogFile(logfile, LOGFILE)
  const logFile2 = getLogFile(logfile2, LOGFILE2)

  return Promise.all([
    ( logFile ? rotateLogFile(logFile) : Promise.resolve() ),
    ( logFile2 ? rotateLogFile(logFile2) : Promise.resolve() ),
  ])
    .then(logFiles =>
      logFiles.map(logfile => {
        if (logfile) {
          return fs.createWriteStream(logfile)
        }
      })
    )
}

module.exports = {
  getLogWriteStreams,
}
