import sys
import Quartz
import json

def gen_ids_from_info(windows):
    for win_dict in windows:
        num = win_dict.get('kCGWindowNumber', '')
        owner = win_dict.get('kCGWindowOwnerName', '')
        name = win_dict.get('kCGWindowName', '')
        pid = win_dict.get('kCGWindowOwnerPID', '')

        yield num, owner, name, pid

def run(cont):
    windows = Quartz.CGWindowListCopyWindowInfo(
        Quartz.kCGWindowListOptionOnScreenOnly,
        Quartz.kCGNullWindowID
    )

    winList = list(gen_ids_from_info(windows))
    print >> sys.stderr, json.dumps(winList)

    if cont:
        sys.stdin.readline()
        run(True)

c = len(sys.argv) > 1
run(c)
