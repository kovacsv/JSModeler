import os
import sys
import re

header = '/* JSModeler [mainVersion].[subVersion].[buildNum] - http://www.github.com/kovacsv/JSModeler */ ';
versionFileName = '../src/core/jsm.js'
buildNumFileName = 'buildnum.txt'
filesFileName = 'files.txt'

tempFileName = 'temp.js'
externsFileName = 'externs.js'
resultFileName = '../build/jsmodeler.js'

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
	
def GetBuildNum ():
	buildNum = 0
	if os.path.exists (buildNumFileName):
		file = open (buildNumFileName, 'rb')
		buildNum = int (file.read ())
		file.close ()
	return buildNum
	
def IncreaseBuildNum ():
	buildNum = GetBuildNum ()
	file = open (buildNumFileName, 'wb')
	file.write (str (buildNum + 1))
	file.close ()
	return buildNum + 1
	
def GetHeader (version, header):
	buildNum = GetBuildNum ()
	currentHeader = header
	currentHeader = currentHeader.replace ('[mainVersion]', version[0])
	currentHeader = currentHeader.replace ('[subVersion]', version[1])
	currentHeader = currentHeader.replace ('[buildNum]', str (buildNum + 1))
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
	
def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	noThree = False
	if (len (argv) == 2):
		if argv[1] == 'nothree':
			noThree = True
	
	versionsPath = os.path.abspath (versionFileName)
	filesFilePath = os.path.abspath (filesFileName)
	tempFilePath = os.path.abspath (tempFileName)
	externsFilePath = os.path.abspath (externsFileName)
	resultFilePath = os.path.abspath (resultFileName)
	
	PrintInfo ('Get version from file <' + versionsPath + '>.')
	version = GetVersion (versionsPath);
	if version == [0, 0]:
		PrintError ('Invalid version.');
		return 1

	PrintInfo ('Collect files to merge from <' + filesFilePath + '>.')
	inputFileNames = GetLinesFromFile (filesFilePath);
	if len (inputFileNames) == 0:
		PrintError ('Invalid file list.');
		return 1

	PrintInfo ('Merge files to <' + tempFilePath + '>.')
	if noThree:
		originalFileNames = inputFileNames
		inputFileNames = []
		for fileName in originalFileNames:
			if fileName.find ('src/three') == -1:
				inputFileNames.append (fileName)
	succeeded = MergeFiles (inputFileNames, tempFilePath)
	if not succeeded:
		PrintError ('Not existing file in file list.');
		return 1

	PrintInfo ('Compile merged file to <' + resultFilePath + '>.')
	succeeded = CompileFile (tempFilePath, externsFilePath, resultFilePath)
	if not succeeded:
		PrintError ('Compilation failed.');
		DeleteFile (resultFilePath)
		DeleteFile (tempFilePath)
		return 1
	
	PrintInfo ('Write header to compiled file <' + resultFilePath + '>.')
	currentHeader = GetHeader (version, header)
	if len (currentHeader) == 0:
		PrintError ('Invalid header.');
		DeleteFile (resultFileName)
		DeleteFile (tempFilePath)
		return 1
	
	succeeded = WriteHeader (resultFileName, currentHeader)
	if not succeeded:
		PrintError ('Write header failed.');
		DeleteFile (resultFilePath)
		DeleteFile (tempFilePath)
		return 1
	
	PrintInfo ('Delete merged file <' + tempFilePath + '>.')
	succeeded = DeleteFile (tempFilePath)
	if not succeeded:
		PrintError ('Delete failed.');
		DeleteFile (resultFilePath)
		DeleteFile (tempFilePath)
		return 1
	
	IncreaseBuildNum ()
	return 0
	
sys.exit (Main (sys.argv))
