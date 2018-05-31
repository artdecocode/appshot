"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Capture;

var _fs = require("fs");

var _stream = require("stream");

var _util = require("util");

var _wrote = require("wrote");

var _pump = _interopRequireDefault(require("pump"));

var _lib = require("../lib");

var _gifsicle = _interopRequireDefault(require("../lib/gifsicle"));

var _ListStream = _interopRequireDefault(require("../lib/ListStream"));

var _CaptureStream = _interopRequireDefault(require("../lib/CaptureStream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
const LOG = (0, _util.debuglog)('appshot');
const DEBUG = /appshot/.test(process.env.NODE_DEBUG);

const timeout = async w => {
  while (w > 0) {
    await new Promise(r => {
      console.log('...%s', w);
      setTimeout(r, 1000);
      w--;
    });
  }
};

async function Capture({
  wait,
  file: _file,
  app,
  title,
  delay,
  resize,
  colors
}) {
  let file = _file;

  if (!file) {
    file = await (0, _lib.getFile)({
      app,
      title
    });
  }

  await timeout(wait);
  process.on('SIGINT', async () => {
    DEBUG ? LOG('\nSIGING\n') : console.log('\nStopping recording');
  });
  console.log('Starting recording (ctrl-c to stop)');
  const files = [];
  (0, _pump.default)(new _ListStream.default({
    app,
    title,
    delay
  }), new _lib.WinIdStream(), new _CaptureStream.default({
    file,
    noShadow: true
  }), new _stream.Transform({
    transform(path, enc, next) {
      files.push(`${path}`);
      console.log(files.length);
      next();
    }

  }), async error => {
    if (error) {
      DEBUG ? LOG(error.stack) : console.log(error.message);
    }

    LOG('END');
    if (!files.length) return;
    await (0, _gifsicle.default)({
      resize,
      file,
      files,
      delay,
      colors
    });
    const info = (0, _fs.lstatSync)(file);
    (DEBUG ? LOG : console.log)('saved %s (%s bytes)', file, info.size);
    await Promise.all(files.map(async path => {
      try {
        await (0, _wrote.erase)({
          path
        });
        LOG('erased %s', path);
      } catch (err) {
        LOG(err);
      }
    }));
  });
}
//# sourceMappingURL=Capture.js.map