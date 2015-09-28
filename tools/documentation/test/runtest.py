import os
import sys
import filecmp
import shutil

currentPath = os.path.dirname (os.path.abspath (__file__))
os.chdir (currentPath)

def Main (argv):
	resultFolder = 'result'
	if not os.path.exists (resultFolder):
		os.mkdir (resultFolder)
	
	referenceFilePath = os.path.join ('reference', 'testdocumentation.json')	
	resultFilePath = os.path.join ('result', 'testdocumentation.json')
	os.system ('python ' + os.path.join ('..', 'generatejson.py') + ' TestProject testfiles.txt' + ' ' + resultFilePath)
	
	equal = filecmp.cmp (referenceFilePath, resultFilePath)	
	if equal:
		print 'Succeeded.'
		shutil.rmtree (resultFolder)
	else:
		print 'Failed.'
		
	return
	
Main (sys.argv)
