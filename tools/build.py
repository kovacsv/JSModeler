import os
import sys
import re

header = '/* JSModeler [mainVersion].[subVersion] - http://www.github.com/kovacsv/JSModeler */ ';
versionFileName = '../src/core/jsm.js'
filesFileName = 'files.txt'

externsFileName = 'jsmodeler.externs.js'
externsViewerFileName = 'jsmodeler.viewer.externs.js'
mergedFileName = 'jsmodeler_merged.js'
mergedViewerFileName = 'jsmodeler.viewer_merged.js'
resultFileName = '../build/jsmodeler.js'
resultViewerFileName = '../build/jsmodeler.viewer.js'

def PrintInfo (message):
	print ('Info: ' + message)

def PrintError (error):
	print ('Error: ' + error)

def GetLinesFromFile (fileName):
	lines = []
	if (not os.path.exists (fileName)):
		return lines
	
	inputFile = open (fileName, 'r')
	for line in inputFile:
		lines.append (line.rstrip ('\r\n'))
	inputFile.close ()

	return lines
	
def MergeFiles (inputFileNames, outputFileName):
	for fileName in inputFileNames:
		if (not os.path.exists (fileName)):
			return False
		
	outputFile = open (outputFileName, 'w')
	for fileName in inputFileNames:
		inputFile = open (fileName, 'r')
		for line in inputFile:
			outputFile.write (line)
		outputFile.write ('\n')
		inputFile.close ()

	outputFile.close ()
	return True

def CompileFile (inputFileName, externFileName, outputFileName):
	result = os.system ('java -jar compiler/compiler.jar --language_in=ECMASCRIPT5_STRICT --warning_level=VERBOSE --jscomp_off=globalThis --jscomp_off=checkTypes --externs ' + externFileName + ' --js ' + inputFileName + ' --js_output_file ' + outputFileName)
	if result != 0:
		return False
	return True

def GetVersion (versionFileName):
	version = [0, 0]
	if (not os.path.exists (versionFileName)):
		return version

	inputFile = open (versionFileName, 'r')
	content = inputFile.read ()
	inputFile.close ()
	
	match = re.search (r'this.mainVersion.*?=.*?(?P<mainVersion>\d+)', content)
	if not match:
		return version
	mainVersion = match.group ('mainVersion')

	match = re.search (r'this.subVersion.*?=.*?(?P<subVersion>\d+)', content)
	if not match:
		return version
	subVersion = match.group ('subVersion')
	
	version[0] = mainVersion
	version[1] = subVersion
	return version
	
def GetHeader (version, header):
	currentHeader = header
	currentHeader = currentHeader.replace ('[mainVersion]', version[0])
	currentHeader = currentHeader.replace ('[subVersion]', version[1])
	return currentHeader
	
def WriteHeader (fileName, header):
	if (not os.path.exists (fileName)):
		return False

	inputFile = open (fileName, 'r')
	content = inputFile.read ()
	inputFile.close ()

	outputFile = open (fileName, 'w')
	outputFile.write (header)
	outputFile.write (content)
	outputFile.close ()
	
	return True
	
def DeleteFile (fileName):
	if (not os.path.exists (fileName)):
		return False

	os.remove (fileName)
	return True

def Build (inputFileNames, mergedFilePath, resultFilePath, externsFilePath, keepMergedFile):
	versionsPath = os.path.abspath (versionFileName)
	version = GetVersion (versionsPath);
	if version == [0, 0]:
		PrintError ('Invalid version.');
		return 1

	succeeded = MergeFiles (inputFileNames, mergedFilePath)
	if not succeeded:
		PrintError ('Not existing file in file list.');
		return 1

	succeeded = CompileFile (mergedFilePath, externsFilePath, resultFilePath)
	if not succeeded:
		PrintError ('Compilation failed.');
		DeleteFile (resultFilePath)
		DeleteFile (mergedFilePath)
		return 1
	
	currentHeader = GetHeader (version, header)
	if len (currentHeader) == 0:
		PrintError ('Invalid header.');
		DeleteFile (resultFilePath)
		DeleteFile (mergedFilePath)
		return 1
	
	succeeded = WriteHeader (resultFilePath, currentHeader)
	if not succeeded:
		PrintError ('Write header failed.');
		DeleteFile (resultFilePath)
		DeleteFile (mergedFilePath)
		return 1
	
	if not keepMergedFile:
		succeeded = DeleteFile (mergedFilePath)
		if not succeeded:
			PrintError ('Delete failed.');
			DeleteFile (resultFilePath)
			DeleteFile (mergedFilePath)
			return 1
	
	return 0
			
def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	keepMergedFiles = False
	for i in range (1, len (argv)):
		if argv[i] == 'keepMergedFiles':
			keepMergedFiles = True

	filesFilePath = os.path.abspath (filesFileName)
	PrintInfo ('Collect files to merge from <' + filesFilePath + '>.')
	inputFileNames = GetLinesFromFile (filesFilePath);
	if len (inputFileNames) == 0:
		PrintError ('Invalid file list.');
		return 1

	coreFiles = []
	viewerFiles = []
	for fileName in inputFileNames:
		if '../src/three' in fileName:
			viewerFiles.append (fileName)
		else:
			coreFiles.append (fileName)

	mergedFilePath = os.path.abspath (mergedFileName)
	resultFilePath = os.path.abspath (resultFileName)
	externsFilePath = os.path.abspath (externsFileName)
	PrintInfo ('Compile files to <' + resultFilePath + '>.')
	if Build (coreFiles, mergedFilePath, resultFilePath, externsFilePath, keepMergedFiles) != 0:
		return 1
	
	mergedFilePath = os.path.abspath (mergedViewerFileName)
	resultFilePath = os.path.abspath (resultViewerFileName)
	externsFilePath = os.path.abspath (externsViewerFileName)
	PrintInfo ('Compile files to <' + resultFilePath + '>.')
	if Build (viewerFiles, mergedFilePath, resultFilePath, externsFilePath, keepMergedFiles) != 0:
		return 1
		
	return 0
	
sys.exit (Main (sys.argv))
