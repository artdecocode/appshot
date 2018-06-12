"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('appshot');

const getChopTop = (chopTop = 0) => {
  if (chopTop) {
    return ['-gravity', 'North', '-chop', `x${chopTop}`];
  }

  return [];
};

var _default = async ({
  resize,
  file,
  files,
  delay,
  chopTop
}) => {
  const args = getConvertArgs({
    resize,
    delay
  });
  const cp = getChopTop(chopTop);
  const allArgs = [...cp, ...files, ...args, file];
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
  delay,
  chopTop // disposal,

} = {}) => {
  const args = [];
  if (resize) args.push('-resize', resize);
  if (colors) args.push('-colors', colors);
  if (optimize) args.push('-layers', optimize);
  if (delay) args.push('-delay', delay / 10);
  return args;
};
//# sourceMappingURL=convert.js.map