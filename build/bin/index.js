#!/usr/bin/env node
"use strict";

var _getArgs = _interopRequireDefault(require("./getArgs"));

var _Capture = _interopRequireDefault(require("./Capture"));

var _List = _interopRequireDefault(require("./List"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  list,
  app,
  title,
  file,
  delay = 1000,
  wait = 2,
  noEmpty,
  resize,
  colors,
  dir,
  gifsicle,
  max
} = (0, _getArgs.default)(process.argv);

(async () => {
  if (list) {
    await (0, _List.default)({
      app,
      title,
      delay,
      noEmpty
    });
  } else {
    await (0, _Capture.default)({
      wait,
      file,
      app,
      title,
      delay,
      resize,
      colors,
      dir,
      gifsicle,
      max
    });
  }
})(); // function focus(app) {
//   console.error('focusing on the app %s', app)
//   const activePath = path.join(__dirname, '../etc/active.py')
//   return new Promise((resolve, reject) => {
//     const active = cp.spawn(activePath, [
//       '--app',
//       app,
//     ], {})
//     active.on('exit', (code) => {
//       if (code !== 0) {
//         return reject(new Error(code))
//       }
//       return resolve()
//     })
//   })
// }
//# sourceMappingURL=index.js.map