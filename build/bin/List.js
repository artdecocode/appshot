"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = List;

var _stream = require("stream");

var _pump = _interopRequireDefault(require("pump"));

var _ListStream = _interopRequireDefault(require("../lib/ListStream"));

var _table = _interopRequireDefault(require("../lib/table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} ListConfig
 * @property {string} [app] An app name
 * @property {string} [title] A window title
 * @property {boolean} [noEmpty=true] Skip empty window titles
 * @property {boolean} [live=false] Continue retrieving the list
 * @property {number} [delay=1000] How often in ms to capture windows in live mode. Default 1000ms.
 */

/**
 * @param {ListConfig} config
 */
async function List(config = {}) {
  const {
    app,
    title,
    noEmpty,
    delay,
    live
  } = config;
  const ls = new _ListStream.default({
    app,
    title,
    live,
    noEmpty,
    delay
  });
  (0, _pump.default)(ls, new _stream.Transform({
    transform(buffer, encoding, next) {
      this.push(buffer);

      if (!live) {
        ls.destroy();
      } else {
        next();
      }
    },

    objectMode: true
  }), new _table.default(), process.stdout);
}
//# sourceMappingURL=List.js.map