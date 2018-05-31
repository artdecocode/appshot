"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogWriteStreams = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOGFILE = (0, _path.resolve)('stdout.log');
const LOGFILE2 = (0, _path.resolve)('stderr.log');

const rotateLogFile = async logFile => {
  await new Promise((r, j) => {// rotate(logFile, { compress: false }, (err) => {
    //   if (err) return j(err)
    //   return r(logFile)
    // })
  });
}; // make sure that the log flag is either string or null


const getLogFile = (logFlag, defaultValue) => {
  if (typeof defaultValue !== 'string') {
    throw new Error('Please specify default value as string');
  }

  switch (typeof logFlag) {
    case 'undefined':
      return null;

    case 'boolean':
      if (logFlag) {
        return defaultValue;
      } else {
        throw new Error('Unexpected false value for a log flag');
      }

    case 'string':
      return logFlag;
  }
}; // return either an array of write streams or undefined


const getLogWriteStreams = async (logfile, logfile2) => {
  const logFile = getLogFile(logfile, LOGFILE);
  const logFile2 = getLogFile(logfile2, LOGFILE2);
  const p = [logFile, logFile2].map(async file => {
    if (file) {
      await rotateLogFile(file);
      return _fs.default.createWriteStream(file);
    }
  });
  await Promise.all(p);
};

exports.getLogWriteStreams = getLogWriteStreams;
//# sourceMappingURL=logs.js.map