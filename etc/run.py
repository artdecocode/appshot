import sys
import Quartz
import json

windows = Quartz.CGWindowListCopyWindowInfo(
    Quartz.kCGWindowListOptionOnScreenOnly,
    Quartz.kCGNullWindowID
)

def gen_ids_from_info(windows):
     for win_dict in windows:
         owner = win_dict.get('kCGWindowOwnerName', '')
         name = win_dict.get('kCGWindowName', '')
         num = win_dict.get('kCGWindowNumber', '')
         pid = win_dict.get('kCGWindowOwnerPID', '')

         yield num, owner, name, pid

print >> sys.stderr, windows

winList = list(gen_ids_from_info(windows))
print json.dumps(winList)
