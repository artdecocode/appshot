# appshot

[![npm version](https://badge.fury.io/js/appshot.svg)](https://npmjs.org/package/appshot)
[![Build Status](https://travis-ci.org/artdecocode/appshot.svg?branch=master)](https://travis-ci.org/artdecocode/appshot)

```
yarn add global appshot

# or
npm i -g appshot
```

A CLI tool to record GIFs of apps on MacOS.

|   How the recording looks:<br>![appshot recording][doc/appshot.gif]    |
| ---------------------------------------------------------------------- |
| The result of the recording:<br>![appshot output][doc/appshot-res.gif] |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [ImageMagic convert](#imagemagic-convert)
- [CLI](#cli)
  * [List Windows: `--list`, `-l`](#list-windows---list--l)
    * [<code>apphost -l</code>](#apphost--l)
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
  * [`--chopTop`, `-T`: Chop Top](#--choptop--t-chop-top)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## ImageMagic convert

The `convert` utility from ImageMagic library should be installed to allow saving optimized GIFs.

```sh
brew install imagemagic
```

Otherwise, un-optimized records can be taken with `-g` flag.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>



## CLI

After installing globally, the program can be run from the command line. The app name and the window title should be passed with the `-a` and `-t` arguments to start the recording of the required window.

```
appshot -a Application -t part_of_window_title
```

Otherwise, just part of the window title can be passed as the command when only one window with such title exists.

```
appshot README.md
```

If more that one window is found, the recording won't start.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="15"></a></p>

### List Windows: `--list`, `-l`

Only list the open windows without capturing a gif. Display the window's ID, App, title and PID.

```sh
appshot -l
```
```
┌────────┬──────────────────┬────────────────────────────────────────┬────────┐
│ winid  │ app              │ title                                  │ pid    │
│ 84     │ Flux             │ Item-0                                 │ 912    │
│ 61     │ SystemUIServer   │ AppleClockExtra                        │ 346    │
│ 49     │ SystemUIServer   │ AirPortExtra                           │ 346    │
│ 92     │ Tunnelblick      │ Item-0                                 │ 1058   │
│ 157    │ AAM Updates Not… │ Item-0                                 │ 2771   │
│ 86     │ Evernote Helper  │ Item-0                                 │ 911    │
│ 35     │ SystemUIServer   │ AppleTimeMachineExtra                  │ 346    │
│ 39     │ SystemUIServer   │ AppleBluetoothExtra                    │ 346    │
│ 43     │ SystemUIServer   │ AppleVolumeExtra                       │ 346    │
│ 57     │ SystemUIServer   │ BatteryExtra                           │ 346    │
│ 53     │ SystemUIServer   │ AppleTextInputExtra                    │ 346    │
│ 65     │ SystemUIServer   │ AppleUser                              │ 346    │
│ 30     │ Spotlight        │ Item-0                                 │ 371    │
│ 21     │ SystemUIServer   │ NotificationCenter                     │ 346    │
│ 3      │ Window Server    │ Menubar                                │ 209    │
│ 151    │ Code             │ index.md — appshot                     │ 333    │
│ 350    │ Finder           │ doc                                    │ 347    │
│ 272    │ Terminal         │ doc — -bash — 131×21                   │ 339    │
│ 99     │ Google Chrome    │                                        │ 337    │
│ 98     │ Google Chrome    │ gifsicle delete last frame - Google S… │ 337    │
│ 76     │ Sketch           │ Welcome to Sketch                      │ 340    │
│ 4      │ Window Server    │ Backstop Menubar                       │ 209    │
│ 33     │ Finder           │                                        │ 347    │
│ 14     │ Dock             │ Desktop Picture - DefaultDesktop.heic  │ 345    │
│ 2      │ Window Server    │ Desktop                                │ 209    │
└────────┴──────────────────┴────────────────────────────────────────┴────────┘
```

<details>
  <summary>Click to View: <a name="apphost--l"><code>apphost -l</code></a></summary>
  <table>
  <tr><td>
    <img alt="Alt: Displaying the list information once." src="doc/list2.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="15"></a></p>

### `--app`, `-a`

Filter by the name of the application.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true" width="15"></a></p>

### `--title`, `-t`

Filter by the title of the window. Same as passing the title as the first argument.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true" width="15"></a></p>

### `--wait`, `-w`

Delay in seconds before the recording starts.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/7.svg?sanitize=true" width="15"></a></p>

### `--file`, `-f`

Path to the file. If none specified, a prompt will be displayed.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/8.svg?sanitize=true" width="15"></a></p>

### `--delay`, `-d`

How often to take screenshots. Defaults to 1 second.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/9.svg?sanitize=true" width="15"></a></p>

### `--resize`, `-z`

Resize to this width, keeping height proportionate.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/10.svg?sanitize=true" width="15"></a></p>

### `--colors`, `-c`

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/11.svg?sanitize=true" width="15"></a></p>

How many colors to use in the output gif.

### `--dir`, `-D`

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/12.svg?sanitize=true" width="15"></a></p>

Directory in which to save the gif.

### `--gifsicle`, `-g`

Save in un-optimized gif format. This can be used when `imagemagic` is not installed, however not recommended as the image size is not optimal.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/13.svg?sanitize=true" width="15"></a></p>

### `--max`, `-m`

Capture this number of frames at maximum and stop recording.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/14.svg?sanitize=true" width="15"></a></p>

### `--chopTop`, `-T`: Chop Top

How many pixels to take off top of each image. Pass `23` value (on non-retina displays) to remove the window headers, which can change title or status and lead to de-optimisation.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/15.svg?sanitize=true"></a></p>


## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>