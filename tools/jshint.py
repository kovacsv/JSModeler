import os
import sys
import re
import inspect

sourcesFolderName = '../src'

def PrintInfo (message):
	print ('Info: ' + message)

def PrintError (error):
	print ('Error: ' + error)

def JSHintFolder (folderPath):
	result = os.system ('jshint ' + folderPath)
	if result != 0:
		return False
	return True
	
def Main ():
	currentPath = os.path.dirname (os.path.abspath (inspect.getsourcefile (Main)))
	os.chdir (currentPath)

	sourcesPath = os.path.abspath (sourcesFolderName)
	
	PrintInfo ('JSHint folder <' + sourcesPath + '>.');
	succeeded = JSHintFolder (sourcesPath)
	if not succeeded:
		PrintError ('Found JSHint errors.');
		return

	return
		
Main ()
