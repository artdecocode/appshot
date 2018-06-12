## [2.1.1](https://github.com/artdecocode/appshot/compare/v2.1.0...v2.1.1) (2018-06-12)

- [package] change maintainers field.

## [2.1.0](https://github.com/artdecocode/appshot/compare/v2.0.0...v2.1.0) (2018-06-11)

- [feature] save with `imagemagic`, specify max number of frames with `-m`
- [dep] use `argufy`

## [2.0.0](https://github.com/artdecocode/appshot/compare/v1.1.0...v2.0.0) (2018-05-31)

- [feature] record gifs
- [ecma] rewrite in babel, add build
- [interface] change CLI to record automatically and list in explicit list mode
- [code] easier argument parsing

## [1.1.0](https://github.com/artdecocode/appshot/compare/v1.0.1...v1.1.0) (2017-02-01)

- run in node 4
- quiet option to avoid printing in capture mode
- update readme to have title `appshot`
- add _CHANGELOG_ file
- columns have constant width

## [1.0.1](https://github.com/artdecocode/appshot/compare/v1.0.0...v1.0.1) (2017-02-01)

- [update](https://github.com/artdecocode/appshot/commit/d7937e9fc49780b3f574dd82cf492776d209c87e)
readme with s3 images, and scale doc screenshots

## [1.0.0](https://github.com/artdecocode/appshot/tree/v1.0.0) (2017-02-01)

- cli: list (present data as table) and capture (take screenshots). Options:
`--no-shadow`, `--screenshots-dir Directory`, `--format jpg`, `--focus`,
`--log-stdout Directory`, `--log-stderr Directory`, `--live`
- test: 1 zoroaster test which spawns `./run2.js` in bin and shows current windows
as a child process, which would throw an error if bin exited with status not 0.
- npm package: appshot
