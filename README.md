# Appshot: take screenshots from command line!

[![npm version](https://badge.fury.io/js/appshot.svg)](https://badge.fury.io/js/appshot)
[![Build Status](https://travis-ci.org/Sobesednik/appshot.svg?branch=master)](https://travis-ci.org/Sobesednik/appshot)

A tool to list & capture application windows on MacOS.

```
npm i -g appshot
```

```bash
Offices-iMac:~ zavr$ appshot
```

```
┌───────┬─────────────────┬────────────────────────────────┬───────┐
│ winid │ app             │ title                          │ pid   │
│ 4345  │ SystemUIServer  │ AppleBluetoothExtra            │ 64784 │
│ 4349  │ SystemUIServer  │ AirPortExtra                   │ 64784 │
│ 4365  │ SystemUIServer  │ DisplaysExtra                  │ 64784 │
│ 4353  │ SystemUIServer  │ AppleTextInputExtra            │ 64784 │
│ 4357  │ SystemUIServer  │ AppleClockExtra                │ 64784 │
│ 4361  │ SystemUIServer  │ AppleUser                      │ 64784 │
│ 4343  │ SystemUIServer  │ Siri                           │ 64784 │
│ 4341  │ SystemUIServer  │ NotificationCenter             │ 64784 │
│ 3218  │ Alarm Clock     │ Item-0                         │ 45378 │
│ 54    │ Spotlight       │ Item-0                         │ 464   │
│ 64    │ Flux            │ Item-0                         │ 526   │
│ 3     │ Window Server   │ Menubar                        │ 158   │
│ 4328  │ Dock            │ Dock                           │ 64621 │
│ 4231  │ iTerm2          │ 1. bash                        │ 57916 │
│ 4281  │ Code - Insiders │ README.md - appshot            │ 63561 │
│ 297   │ iTunes          │ iTunes                         │ 1137  │
│ 4     │ Window Server   │ Backstop Menubar               │ 158   │
│ 4375  │ Finder          │                                │ 64841 │
│ 4326  │ Dock            │ Desktop Picture - IMG_2586.JPG │ 64621 │
│ 2     │ Window Server   │ Desktop                        │ 158   │
└───────┴─────────────────┴────────────────────────────────┴───────┘
```

There are two modes: `list` and `capture`, with `list` mode activated by
default.

## Commands

- `appshot` list all windows
- `apphost --app App` filter by app
- `apphost --no-empty-title` filter out windows with empty title
- `apphost --title Title` filter by title
- `apphost --capture` save screenshot in `./screenshots` (will try to make if not found)

### capture options

- `--no-shadow` disable shadow
- `--screenshots-dir Directory` where to save screenshots. _default_ = ./screenshots
- `--format jpg` png or jpeg. _default_ png
- `--focus` bring window to focus (with apple script)
- `--live` in capture: screate a session folder, find out winid and keep taking screenshot;
           in list: execute python script to get window information (see `etc/run.py`).

### global options

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
appshot --app Chrome \
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

## Explaination

Data comes encoded as JSON string from `etc/run.py`, which uses Quartz to
get information about windows.

```
[[64, "Flux", "Item-0", 526], [26, "SystemUIServer", "AppleBluetoothExtra", 394], [30, "SystemUIServer", "AirPortExtra", 394], [46, "SystemUIServer", "DisplaysExtra", 394], [34, "SystemUIServer", "AppleTextInputExtra", 394], [38, "SystemUIServer", "AppleClockExtra", 394], [42, "SystemUIServer", "AppleUser", 394], [54, "Spotlight", "Item-0", 464], [24, "SystemUIServer", "Siri", 394], [22, "SystemUIServer", "NotificationCenter", 394], [3, "Window Server", "Menubar", 158], [20,
"Dock", "Dock", 391], [314, "iTerm2", "1. bash", 1219], [2437, "Google Chrome", "", 372], [2438, "Google Chrome", "Logfile by z-vr \u00b7 Pull Request #1 \u00b7 Sobesednik/browsershot", 372], [297, "iTunes", "iTunes", 1137], [2778, "Finder", "logs", 395], [2510, "Finder", "58dc0ebb-12d3-42d0-8f68-73ebe6821f44", 395], [1554, "Activity Monitor", "Activity Monitor (All Processes)", 25318], [1263, "App Store", "App Store", 19532], [4, "Window Server", "Backstop Menubar", 158], [21,
"Finder", "", 395], [18, "Dock", "Desktop Picture - IMG_2586.JPG", 391], [2, "Window Server", "Desktop", 158]]
```

JSON-encoded array with records like `[winid, app, title, pid]` is printed to `stdout` by Python
and deserialised by Node. Once window id is found, we can call `screecapture -l<winid>` to take
a screenshot of an app.

# TODO:

 - add support for export of all fields from python, and provide interface between python script and nod
