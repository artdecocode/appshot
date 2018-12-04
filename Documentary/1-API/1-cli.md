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

%~ width="15"%