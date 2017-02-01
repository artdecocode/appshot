## [1.1.0](https://github.com/Sobesednik/appshot/compare/v1.0.1...v1.1.0) (2017-02-01)

- quiet option to avoid printing in capture mode
- update readme to have title `appshot`
- add _CHANGELOG_ file
- columns have constant width

## [1.0.1](https://github.com/Sobesednik/appshot/compare/v1.0.0...v1.0.1) (2017-02-01)

- [update](https://github.com/Sobesednik/appshot/commit/d7937e9fc49780b3f574dd82cf492776d209c87e)
readme with s3 images, and scale doc screenshots

## [1.0.0](https://github.com/Sobesednik/appshot/tree/v1.0.0) (2017-02-01)

- cli: list (present data as table) and capture (take screenshots). Options:
`--no-shadow`, `--screenshots-dir Directory`, `--format jpg`, `--focus`,
`--log-stdout Directory`, `--log-stderr Directory`, `--live`
- test: 1 zoroaster test which spawns `./run2.js` in bin and shows current windows
as a child process, which would throw an error if bin exited with status not 0.
- npm package: appshot

