import os
import sys
import shutil
from jsmbuild import jsmbuild

def Main ():
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	builder = jsmbuild.JSMBuilder ()
	builder.Init (currentPath)
	
	coverageTempFolder = 'coverage_temp'
	if os.path.exists (coverageTempFolder):
		shutil.rmtree (coverageTempFolder)
		
	testsFolderPath = os.path.join ('..', 'test', 'unittest')
	shutil.copytree (testsFolderPath, coverageTempFolder)

	mainTestFile = 'jsmodeler_coverage.js'
	shutil.copy (mainTestFile, os.path.join (coverageTempFolder, mainTestFile))
	
	mergedFileName = 'jsmodeler_node.js';
	mergedFilePath = os.path.join (coverageTempFolder, mergedFileName);
	builder.MergeFilesForTest (mergedFilePath)

	testsFolder = os.path.join (coverageTempFolder, 'tests')
	for fileName in os.listdir (testsFolder):
		fullPath = os.path.join (testsFolder, fileName)
		jsmbuild.WriteHeaderToFile (fullPath, 'var JSM = require (\'../' + mergedFileName + '\');\n')	
	
	os.chdir (coverageTempFolder)
	os.system ('istanbul cover ' + mainTestFile)
	
	os.chdir (currentPath)
	shutil.move (os.path.join (coverageTempFolder, 'coverage'), currentPath)
	shutil.rmtree (coverageTempFolder)
	
	return 0
	
sys.exit (Main ())
