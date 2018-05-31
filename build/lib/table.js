"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTable = getTable;
exports.default = void 0;

var _cliTable = _interopRequireDefault(require("cli-table"));

var _stream = require("stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TableStream extends _stream.Transform {
  constructor() {
    super({
      objectMode: true
    });
    this.head = ['winid', 'app', 'title', 'pid'];
  }

  _transform(data, encoding, next) {
    const s = getTable(data, this.head);
    this.push(`${s}\n`);
    next();
  }

}

exports.default = TableStream;

function getTable(values, head) {
  const table = new _cliTable.default({
    head,
    chars: {
      mid: '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': ''
    },
    colWidths: [8, 18, 40, 8]
  });
  table.push(...values);
  return table.toString();
}
//# sourceMappingURL=table.js.map