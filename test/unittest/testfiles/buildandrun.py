import os
import sys

sourceFileName = 'binarywriter.cpp'
binaryFileName = 'binarywriter.exe'
	
def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)
	
	print '--- build ---'
	buildResult = os.system ('g++ -Wall ' + sourceFileName + ' -o ' + binaryFileName)
	
	if buildResult == 0:
		print '--- run ---'
		os.system (binaryFileName)
	
	if os.path.exists (binaryFileName):
		os.remove (binaryFileName)
		
	return 0
	
sys.exit (Main (sys.argv))
