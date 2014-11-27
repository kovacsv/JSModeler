import os
import sys
import re

currentPath = os.path.dirname (os.path.abspath (__file__))
os.chdir (currentPath)

def PrintInfo (message):
	print ('Info: ' + message)

def PrintError (error):
	print ('Error: ' + error)

def RunUnitTest (unitTestPath):
	result = os.system ('node ' + unitTestPath + ' -silent')
	if result != 0:
		return False
	return True
	
def Main ():
	unitTestPath = os.path.abspath ('../test/unittest/jsmodelertest.js')
	
	PrintInfo ('Run unit tests <' + unitTestPath + '>.')
	succeeded = RunUnitTest (unitTestPath)
	if not succeeded:
		PrintError ('Unit tests failed.');
		return 1

	return 0
		
sys.exit (Main ())
