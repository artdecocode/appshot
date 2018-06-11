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

var _convert = _interopRequireDefault(require("../lib/convert"));

var _ListStream = _interopRequireDefault(require("../lib/ListStream"));

var _CaptureStream = _interopRequireDefault(require("../lib/CaptureStream"));

var _path = require("path");

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
  colors = 256,
  dir = '',
  gifsicle,
  max
}) {
  let file = _file;

  if (!file) {
    file = await (0, _lib.getFile)({
      app,
      title
    });
  }

  file = (0, _path.resolve)(dir, file);
  await timeout(wait);
  process.on('SIGINT', async () => {
    DEBUG ? LOG('\nSIGING\n') : console.log('\nStopping recording');
  });
  console.log('Starting recording (ctrl-c to stop)');
  const files = [];
  const ls = new _ListStream.default({
    app,
    title,
    delay
  });
  const wis = new _lib.WinIdStream();
  const cs = new _CaptureStream.default({
    file,
    noShadow: true,
    filetype: gifsicle ? 'gif' : 'png'
  });
  const ts = new _stream.Transform({
    async transform(path, enc, next) {
      const p = `${path}`;
      files.push(p);
      console.log(files.length);

      if (max && files.length >= max) {
        ls.destroy();
      }

      next();
    }

  });
  (0, _pump.default)(ls, wis, cs, ts, async error => {
    if (error) {
      DEBUG ? LOG(error.stack) : console.log(error.message);
    }

    LOG('END');
    if (!files.length) return;
    let size;

    if (gifsicle) {
      await (0, _gifsicle.default)({
        resize,
        file,
        files,
        delay,
        colors
      });
      size = getSize(file);
    } else {
      // image magic
      await (0, _convert.default)({
        resize,
        file,
        files
      });
      getSize(file);
      await (0, _gifsicle.default)({
        file,
        files: [file],
        delay
      });
      size = getSize(file);
    }

    console.log('saved %s (%s bytes)', file, size);
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

const getSize = file => {
  try {
    const info = (0, _fs.lstatSync)(file);
    LOG('%s: %s bytes', file, info.size);
    return info.size; // ; (DEBUG ? LOG : console.log)('saved %s (%s bytes)', file, info.size)
  } catch (err) {// LOG(err.message)
  }
};
//# sourceMappingURL=Capture.js.map