#!/usr/bin/python

import os
import sys
import argparse
parser = argparse.ArgumentParser(description='Activate process with Finder.')
parser.add_argument("--app", help='App to bring in front', required=True)

args = parser.parse_args()
app = vars(args)['app']

print >> sys.stderr, 'Activating ' + app
os.system('''/usr/bin/osascript -e 'tell app "Finder" to set frontmost of process "''' + app +  '''" to true' ''')

