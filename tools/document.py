import os
import sys

currentPath = os.path.dirname (os.path.abspath (__file__))
os.chdir (currentPath)

def Main ():
	return os.system (os.path.join ('documentation', 'generatejson.py') + ' files.txt' + ' ' + os.path.join ('..', 'documentation', 'jsmdoc', 'jsmdoc.json'))
	
sys.exit (Main ())
