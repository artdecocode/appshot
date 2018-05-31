"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _windowInfo = _interopRequireDefault(require("window-info"));

var _stream = require("stream");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('appshot');

class ListStream extends _stream.Transform {
  constructor({
    app,
    title,
    noEmpty,
    delay
  }) {
    super({
      objectMode: true
    });
    this.app = app;
    this.title = title;
    this.are = app && new RegExp(app, 'i');
    this.tre = title && new RegExp(title, 'i');
    this.noEmpty = noEmpty;
    this.wi = new _windowInfo.default({
      delay
    });
    this.wi.pipe(this);
  }

  _destroy(err) {
    this.wi.destroy(err);
  }

  _transform(data, encoding, next) {
    next();
    const date = new Date();
    LOG('<LIST at %s:%s.%s>', date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    const d = data.filter(([, a]) => {
      if (!this.app) return true;
      return this.are.test(a);
    }).filter(([,, t]) => {
      if (!t && this.noEmpty) return false;
      if (!this.title) return true;
      return this.tre.test(t);
    });
    this.push(d);
  }

}

exports.default = ListStream;
//# sourceMappingURL=ListStream.js.map