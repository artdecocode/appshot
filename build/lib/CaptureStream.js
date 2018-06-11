"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _stream = require("stream");

var _path = require("path");

var _os = require("os");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('appshot');
/**
 * This transform stream will take a screenshot of a read window id and push a decoded PNG image.
 */

class CaptureStream extends _stream.Transform {
  constructor({
    cursor,
    noShadow,
    file = 'appshot.gif',
    filetype = 'gif'
  }) {
    super({
      objectMode: true
    });
    this.cursor = cursor;
    this.noShadow = noShadow;
    this.filetype = filetype;
    this.i = 0;
    const {
      name
    } = (0, _path.parse)(file);
    this.name = name;
  }
  /**
   * @param {number} winid
   * @param {*} encoding
   * @param {*} next
   */


  async _transform(winid, encoding, next) {
    const d = new Date();
    LOG('<CAPTURE transform at %s:%s.%s>', d.getMinutes(), d.getSeconds(), d.getMilliseconds());

    try {
      const path = await capture({
        winid,
        filetype: this.filetype,
        cursor: this.cursor,
        noShadow: this.noShadow,
        getFilename: () => {
          return `${this.name}-${this.i}`;
        }
      });
      this.push(path);
      this.i++;
      next();
    } catch (err) {
      next(err);
    }
  }

}

exports.default = CaptureStream;

const randomFilename = () => {
  const rnd = Math.ceil(Math.random() * 100000);
  return `appshot-${rnd}`;
};

function getTempFile(getFilename = randomFilename) {
  const filename = getFilename();
  const tempFile = (0, _path.resolve)((0, _os.tmpdir)(), filename);
  return tempFile;
}
/**
 * Create a screenshot into a temp directory.
 */


const capture = async ({
  winid,
  cursor,
  noShadow,
  filetype = 'png',
  getFilename
}) => {
  const p = getTempFile(getFilename);
  const path = `${p}.${filetype}`;
  const allArgs = [...(cursor ? ['-C'] : []), ...(noShadow ? ['-o'] : []), `-t${filetype}`, `-l${winid}`, path];
  LOG('%s %s', 'screencapture', allArgs.join(' '));
  const {
    promise
  } = (0, _spawncommand.default)('screencapture', allArgs);
  const {
    stderr
  } = await promise;
  if (stderr) throw new Error(stderr);
  return path;
};
//# sourceMappingURL=CaptureStream.js.map