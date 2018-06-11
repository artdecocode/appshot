"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('appshot');

var _default = async ({
  resize,
  file,
  files,
  delay
}) => {
  const args = getConvertArgs({
    resize,
    delay
  });
  const allArgs = [...files, ...args, file];
  LOG('%s %s', 'convert', allArgs.join(' '));
  const {
    stderr,
    promise
  } = (0, _spawncommand.default)('convert', allArgs);
  stderr.on('data', data => {
    LOG(`${data}`);
  });
  await promise;
  return file;
};

exports.default = _default;

const getConvertArgs = ({
  resize,
  colors,
  optimize = 'OptimizeFrame',
  delay // disposal,

} = {}) => {
  const args = [];
  if (resize) args.push('-resize', resize);
  if (colors) args.push('-colors', colors);
  if (optimize) args.push('-layers', optimize);
  if (delay) args.push('-delay', delay / 10);
  return args;
};
//# sourceMappingURL=convert.js.map