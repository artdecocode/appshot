# appshot

[![npm version](https://badge.fury.io/js/appshot.svg)](https://badge.fury.io/js/appshot)
[![Build Status](https://travis-ci.org/artdecocode/appshot.svg?branch=master)](https://travis-ci.org/artdecocode/appshot)

```
npm i -g appshot
```

A CLI tool to record gifs of apps on MacOS.

![appshot gif][appshot-appshot.gif]

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [ImageMagic convert](#imagemagic-convert)
- [CLI](#cli)
  * [`--list`, `-l`](#--list--l)
  * [`--app`, `-a`](#--app--a)
  * [`--title`, `-t`](#--title--t)
  * [`--wait`, `-w`](#--wait--w)
  * [`--file`, `-f`](#--file--f)
  * [`--delay`, `-d`](#--delay--d)
  * [`--resize`, `-z`](#--resize--z)
  * [`--colors`, `-c`](#--colors--c)
  * [`--dir`, `-D`](#--dir--d)
  * [`--gifsicle`, `-g`](#--gifsicle--g)
  * [`--max`, `-m`](#--max--m)

## ImageMagic convert

The `convert` utility from ImageMagic library should be installed to allow saving optimised gifs.

```sh
brew install imagemagic
```

Otherwise, unoptimised records can be taken with `-g` flag.

## CLI

After installing globally, the program can be run. Pass a part of the window title to start recording.

```
appshot part_of_window_title
```

```
appshot README.md
```

If more that one window is found, the recording won't start.

### `--list`, `-l`

Only list the open windows without capturing a gif.

```sh
appshot -l
```

```
┌────────┬──────────────────┬────────────────────────────────────────┬────────┐
│ winid  │ app              │ title                                  │ pid    │
│ 108    │ Creative Cloud   │ Item-0                                 │ 993    │
│ 101    │ Tunnelblick      │ Item-0                                 │ 1036   │
│ 84     │ Avira            │ Item-0                                 │ 997    │
│ 81     │ PostgresMenuHel… │ Item-0                                 │ 1018   │
│ 17     │ Little Snitch A… │ Item-0                                 │ 344    │
│ 29     │ SystemUIServer   │ AppleBluetoothExtra                    │ 417    │
│ 33     │ SystemUIServer   │ AirPortExtra                           │ 417    │
│ 37     │ SystemUIServer   │ AppleTextInputExtra                    │ 417    │
│ 41     │ SystemUIServer   │ AppleClockExtra                        │ 417    │
│ 45     │ SystemUIServer   │ AppleUser                              │ 417    │
│ 50     │ Spotlight        │ Item-0                                 │ 419    │
│ 27     │ SystemUIServer   │ Siri                                   │ 417    │
│ 25     │ SystemUIServer   │ NotificationCenter                     │ 417    │
│ 3      │ Window Server    │ Menubar                                │ 206    │
│ 66     │ Visual Studio C… │ README.md — appshot                    │ 410    │
│ 68     │ Google Chrome    │ Child Process | Node.js v10.2.1 Docum… │ 414    │
│ 59     │ iTerm2           │ 1. bash                                │ 415    │
│ 4      │ Window Server    │ Backstop Menubar                       │ 206    │
│ 60     │ Finder           │                                        │ 418    │
│ 54     │ Dock             │ Desktop Picture - Sierra 2.jpg         │ 416    │
│ 2      │ Window Server    │ Desktop                                │ 206    │
└────────┴──────────────────┴────────────────────────────────────────┴────────┘
```

### `--app`, `-a`

Filter by the name of the application.

### `--title`, `-t`

Filter by the title of the window. Same as passing the title as the first argument.

### `--wait`, `-w`

Delay in seconds before the recording starts.

### `--file`, `-f`

Path to the file. If none specified, a prompt will be displayed.

### `--delay`, `-d`

How often to take screenshots. Defaults to 1 second.

### `--resize`, `-z`

Resize to this width, keeping height proportionate.

### `--colors`, `-c`

How many colors to use in the output gif.

### `--dir`, `-D`

Directory in which to save the gif.

### `--gifsicle`, `-g`

Save in unoptimised gif format. This can be used when `imagemagic` is not installed, however not recommended as the image size is not optimal.

### `--max`, `-m`

Capture this number of frames at max and stop recording.

---

Copyright 2018 [Art Deco Code][1]

[1]: https://artdeco.bz
[2]: https://stackoverflow.com/questions/6160727/how-to-obtain-info-of-the-program-from-the-window-list-with-cgwindowlistcopywind
