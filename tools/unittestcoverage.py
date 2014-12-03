import os
import sys
import shutil
import re

def AddContentToFile (filePath, newContent, toEnd):
	file = open (filePath, 'rb')
	content = file.read ()
	file.close ()
	if toEnd:
		content = content + newContent
	else:
		content = newContent + content;
	file = open (filePath, 'wb')
	file.write (content)
	file.close ()

def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	coverageTempFolder = 'coverage_temp'
	if os.path.exists (coverageTempFolder):
		shutil.rmtree (coverageTempFolder)

	coverageResultFolder = 'coverage_result'
	if os.path.exists (coverageResultFolder):
		shutil.rmtree (coverageResultFolder)
    
	unitTestFolder = os.path.join ('..', 'test', 'unittest')
	shutil.copytree (unitTestFolder, coverageTempFolder)
	
	mergedFileName = 'jsmodeler_merged.js'
	resultBuildPath = os.path.join (coverageTempFolder, mergedFileName)
	os.system ('build.py keepMergedFile')
	shutil.move (mergedFileName, resultBuildPath)
	
	AddContentToFile (resultBuildPath, 'module.exports = JSM;', True)
	
	testsFolder = os.path.join (coverageTempFolder, 'tests')
	for fileName in os.listdir (testsFolder):
		fullPath = os.path.join (testsFolder, fileName)
		AddContentToFile (fullPath, 'var JSM = require (\'../' + mergedFileName + '\');', False)
	
	mainTestFile = 'jsmodelertest.js'
	os.chdir (coverageTempFolder)
	os.system ('istanbul cover ' + mainTestFile)
	os.chdir (currentPath)
	
	shutil.move (os.path.join (coverageTempFolder, 'coverage'), coverageResultFolder)
	shutil.rmtree (coverageTempFolder)
	return 0
	
sys.exit (Main (sys.argv))
