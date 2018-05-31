"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _gifsicle = _interopRequireDefault(require("gifsicle"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('appshot');

var _default = async ({
  resize,
  file,
  files,
  delay,
  colors = 256
}) => {
  const args = getGifsicleArgs({
    resize,
    colors,
    delay,
    optimize: 3,
    disposal: 'background'
  });
  const allArgs = [...args, ...files, '-o', file];
  LOG('%s %s', 'gifsicle', allArgs.join(' '));
  const {
    stderr,
    promise
  } = (0, _spawncommand.default)(_gifsicle.default, allArgs);
  stderr.on('data', data => {
    LOG(`${data}`);
  });
  await promise;
};

exports.default = _default;

const getGifsicleArgs = ({
  resize,
  colors,
  optimize,
  delay,
  disposal
} = {}) => {
  const args = ['--no-extensions'];
  if (resize) args.push('--resize', `${resize}x_`);
  if (colors) args.push('--colors', colors);
  if (optimize) args.push(`--optimize=${optimize}`);
  if (delay) args.push('--delay', delay / 10);
  if (disposal) args.push('--disposal', disposal);
  return args;
};
//# sourceMappingURL=gifsicle.js.map