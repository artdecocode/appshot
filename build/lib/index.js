"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFile = exports.WinIdStream = void 0;

var _stream = require("stream");

var _reloquent = require("reloquent");

var _util = require("util");

const LOG = (0, _util.debuglog)('appshot');
/**
 * Transform a list of ids into a single window id.
 */

class WinIdStream extends _stream.Transform {
  constructor() {
    super({
      objectMode: true,
      highWaterMark: 0
    });
  }

  _transform(data, enc, next) {
    if (data.length > 1) {
      const msg = 'More than one window is found, please update the filter with -a and -t options';
      const windows = data.map(([, a, t]) => {
        const s = `  ${a} :: ${t}`;
        return s;
      }).join('\n');
      const err = new Error(`${msg}\n${windows}`);
      next(err);
    } else if (!data.length) {
      const msg = 'No windows are found';
      const err = new Error(msg);
      next(err);
    } else {
      const [[win]] = data;
      this.push(win);
      next();
    }
  }

}

exports.WinIdStream = WinIdStream;

const getFile = async ({
  app,
  title
}) => {
  const file = await (0, _reloquent.askQuestions)({
    file: {
      text: 'gif name',

      async getDefault() {
        const parts = ['appshot'];
        if (app) parts.push(`-${app}`);
        if (title) parts.push(`-${title}`);
        return `${parts.join('')}.gif`;
      }

    }
  }, null, 'file');
  return file;
};

exports.getFile = getFile;
//# sourceMappingURL=index.js.map