import os
import sys

currentPath = os.path.dirname (os.path.abspath (__file__))
os.chdir (currentPath)

projectName = 'JSModeler'

def Main ():
	return os.system (os.path.join ('documentation', 'generatejson.py') + ' ' + projectName + ' files.txt' + ' ' + os.path.join ('..', 'documentation', 'jsmdoc', 'include', 'jsmdoc.json'))
	
sys.exit (Main ())
