#!/usr/bin/python

import os
import sys

print sys.argv[1]

print >> sys.stderr, windows

os.system('''/usr/bin/osascript -e 'tell app "Finder" to set frontmost of process "''' + sys.argv[1] +  '''" to true' ''')

