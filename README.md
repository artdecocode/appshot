# Appshot: take screenshots from command line!

[![npm version](https://badge.fury.io/js/appshot.svg)](https://badge.fury.io/js/appshot)
[![Build Status](https://travis-ci.org/artdecocode/appshot.svg?branch=master)](https://travis-ci.org/artdecocode/appshot)

A library and a cli tool to list and capture screenshots of application windows on MacOS.

```
npm i -g appshot
```

## CLI

After installing globally, the program can be run. There are two modes documented below.

### List (default): list all windows

List all windows via Quartz (through a python script, no bindings).

```sh
appshot
```

#### filters: which rows to list

|      flag     | meaning |    default |
|---------------|---------|--------------|
| `--app`, `-a` | Filter results by application name. | - |
| `--title`, `-t` | Filter results by window title. | - |
| `--no-empty-title` | Skip windows with no titles | `false` |

```sh
appshot -a Code -t appshot
```

| winid |       app       |              title             |  pid  |
|-------|-----------------|--------------------------------|-------|
| 4345  | SystemUIServer  | AppleBluetoothExtra            | 64784 |
| 4349  | SystemUIServer  | AirPortExtra                   | 64784 |
| 4365  | SystemUIServer  | DisplaysExtra                  | 64784 |
| 4353  | SystemUIServer  | AppleTextInputExtra            | 64784 |
| 4357  | SystemUIServer  | AppleClockExtra                | 64784 |
| 4361  | SystemUIServer  | AppleUser                      | 64784 |
| 4343  | SystemUIServer  | Siri                           | 64784 |
| 4341  | SystemUIServer  | NotificationCenter             | 64784 |
| 3218  | Alarm Clock     | Item-0                         | 45378 |
| 54    | Spotlight       | Item-0                         | 464   |
| 64    | Flux            | Item-0                         | 526   |
| 3     | Window Server   | Menubar                        | 158   |
| 4328  | Dock            | Dock                           | 64621 |
| 4231  | iTerm2          | 1. bash                        | 57916 |
| 4281  | Code - Insiders | README.md - appshot            | 63561 |
| 297   | iTunes          | iTunes                         | 1137  |
| 4     | Window Server   | Backstop Menubar               | 158   |
| 4375  | Finder          |                                | 64841 |
| 2     | Window Server   | Desktop                        | 158   |

### Capture: `--capture`, `-c` -- take a screenshot of an application

Search for a single window using the same filters as for the list, but save a screenshot if a single result was found.

```sh
appshot --app iTunes --capture
```

```
┌───────┬────────┬────────┬──────┐
│ winid │ app    │ title  │ pid  │
│ 297   │ iTunes │ iTunes │ 1137 │
└───────┴────────┴────────┴──────┘
/Users/adc/appshot/screenshots/3e484e04-dd1c-4ad1-8f3c-e97457ed1124.png
```

#### `--screenshot-dir`, `-sd`

Where to save screenshots instead of the `screenshot` folder in the current working directory.

```sh
appshot -a iTunes -c -d=~/screenshot
```

```
┌───────┬────────┬────────┬──────┐
│ winid │ app    │ title  │ pid  │
│ 297   │ iTunes │ iTunes │ 1137 │
└───────┴────────┴────────┴──────┘
/Users/adc/screenshot/3e484e04-dd1c-4ad1-8f3c-e97457ed1124.png
```

#### `--focus`

Bring the window to the foreground using a snippet:

```applescript
tell app "Finder"  to set frontmost of process processName to true
```

```sh
appshot --app iTunes --capture --focus
```

```
┌───────┬────────┬────────┬──────┐
│ winid │ app    │ title  │ pid  │
│ 297   │ iTunes │ iTunes │ 1137 │
└───────┴────────┴────────┴──────┘
/Users/adc/screenshots/3e484e04-dd1c-4ad1-8f3c-e97457ed1124.png
```

<!-- After getting information about windows via the same process as `list` mode, spawn `screencapture`, passing the id of the first found window. Windows do not have to be in foreground, and can appear dimmed. To solve this, add `--focus` flag to additionally run `./etc/active.py` which will use _applescript_: . -->


The table with found windows will be printed as well, unless you
set the `--quiet` flag.

### Continuous

```bash
Offices-iMac:appshot zavr$ appshot --app Chrome --live
```

Appshot will execute functions in a loop, until `ctrl-c` is pressed.

```
┌────────┬──────────────────┬─────────────────────────────────────────┬────────┐
│ winid  │ app              │ title                                   │ pid    │
│ 4387   │ Google Chrome    │ artdecocode/appshot: A Node.js program… │ 65250  │
└────────┴──────────────────┴─────────────────────────────────────────┴────────┘
┌────────┬──────────────────┬────────────────────────────────────────┬────────┐
│ winid  │ app              │ title                                  │ pid    │
│ 4387   │ Google Chrome    │ Hello world from zoroaster!            │ 65250  │
└────────┴──────────────────┴────────────────────────────────────────┴────────┘
┌────────┬──────────────────┬────────────────────────────────────────┬────────┐
│ winid  │ app              │ title                                  │ pid    │
│ 4387   │ Google Chrome    │ New Tab                                │ 65250  │
└────────┴──────────────────┴────────────────────────────────────────┴────────┘
```

In capture mode, appshot will create a session directory insie of screenshots
the directory and save all files in there.

```bash
Offices-iMac:appshot zavr$ appshot --app Chrome --capture --live --quiet
```

```
/Users/zavr/Work/appshot/screenshots/35e2c9b0-d1e9-4c85-ac34-f44917edd020/1.png
/Users/zavr/Work/appshot/screenshots/35e2c9b0-d1e9-4c85-ac34-f44917edd020/2.png
/Users/zavr/Work/appshot/screenshots/35e2c9b0-d1e9-4c85-ac34-f44917edd020/3.png
```

## Commands

- `appshot` list all windows
- `apphost --app App` filter by app
- `apphost --no-empty-title` filter out windows with empty title
- `apphost --title Title` filter by title

- `apphost --capture` save screenshot in `./screenshots` (will try to make if not found)

### Capture options

- `--no-shadow` disable shadow
- `--quiet` only print output location, without information about windows
- `--screenshots-dir Directory` where to save screenshots. _default_ = ./screenshots
- `--format jpg` png or jpeg. _default_ png
- `--focus` bring window to focus (with apple script)
- `--live` in capture: screate a session folder, find out winid and keep taking screenshot;
           in list: execute python script to get window information (see `etc/run.py`).

### Global options

- `--log-stdout Directory` save Python stdout logs to this directory
- `--log-stderr Directory` save Python stderr logs to this directory

## Screenshots

![appshot command](https://sobesednik.co/appshot/appshot.png)

![appshot --app App command](https://sobesednik.co/appshot/app.png)

![appshot --no-empty-title command](https://sobesednik.co/appshot/no-empty-title.png)

![appshot --app App --title Title command](https://sobesednik.co/appshot/list-app-title.png)

![appshot --capture command](https://sobesednik.co/appshot/capture.png)

### Example

```bash
appshot \
  --app Chrome \
  --title zoroaster \
  --capture \
  --no-shadow \
  --screenshots-dir ~/appshots \
  --format jpg \
  --focus \
  --log-stdout ~/appshot-logs/stdout.log \
  --log-stderr ~/appshot-logs/stderr.log
```

![captured browser window with zoroaster website](https://sobesednik.co/appshot/capture.jpg)

## Explanation

Data comes encoded as JSON string from `etc/run.py`, which uses Quartz to get information about windows.

```
[[64, "Flux", "Item-0", 526], [26, "SystemUIServer", "AppleBluetoothExtra", 394], [30, "SystemUIServer", "AirPortExtra", 394], [46, "SystemUIServer", "DisplaysExtra", 394], [34, "SystemUIServer", "AppleTextInputExtra", 394], [38, "SystemUIServer", "AppleClockExtra", 394], [42, "SystemUIServer", "AppleUser", 394], [54, "Spotlight", "Item-0", 464], [24, "SystemUIServer", "Siri", 394], [22, "SystemUIServer", "NotificationCenter", 394], [3, "Window Server", "Menubar", 158], [20,
"Dock", "Dock", 391], [314, "iTerm2", "1. bash", 1219], [2437, "Google Chrome", "", 372], [2438, "Google Chrome", "Logfile by z-vr \u00b7 Pull Request #1 \u00b7 Sobesednik/browsershot", 372], [297, "iTunes", "iTunes", 1137], [2778, "Finder", "logs", 395], [2510, "Finder", "58dc0ebb-12d3-42d0-8f68-73ebe6821f44", 395], [1554, "Activity Monitor", "Activity Monitor (All Processes)", 25318], [1263, "App Store", "App Store", 19532], [4, "Window Server", "Backstop Menubar", 158], [21,
"Finder", "", 395], [18, "Dock", "Desktop Picture - IMG_2586.JPG", 391], [2, "Window Server", "Desktop", 158]]
```

JSON-encoded array with records like `[winid, app, title, pid]` is printed to `stdout` by Python and deserialised by Node. Once window id is found, we call `screecapture -l<winid>` to take a screenshot of an app.

## TODO:

 - add support for export of all fields from python, and provide interface between python script and node
 - add cli help
 - use more `screencapture` options, such as formats other than `jpg` and `png`, `-P`,  `-T`, `-c`

## Readings

[stackoverflow - WindowInfo list of keys][2]

---

Copyright 2018 [Art Deco Code][1]

[1]: https://artdeco.bz
[2]: https://stackoverflow.com/questions/6160727/how-to-obtain-info-of-the-program-from-the-window-list-with-cgwindowlistcopywind
