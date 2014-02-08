import os
import sys

from jsmdoc import jsmdoc

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

def Main (argv):
	if len (argv) != 3:
		print 'usage: generatedoc <filesFileName> <resultFileName>'
		return
	
	filesFilePath = os.path.abspath (argv[1])
	resultFilePath = os.path.abspath (argv[2])
	
	PrintInfo ('Create documentation from files <' + filesFilePath + '>.')
	inputFileNames = GetLinesFromFile (filesFilePath);
	if len (inputFileNames) == 0:
		PrintError ('Invalid file list.');
		return 1

	moduleNames = []
	filesByModule = {}
	for fileName in inputFileNames:
		absPath = os.path.abspath (fileName)
		moduleName = os.path.split (absPath)[0]
		moduleName = os.path.split (moduleName)[1]
		if not moduleName in moduleNames:
			moduleNames.append (moduleName)
		if not moduleName in filesByModule.keys ():
			filesByModule[moduleName] = []
		filesByModule[moduleName].append (absPath)
	
	try:
		documentation = jsmdoc.Documentation ()
		for moduleName in moduleNames:
			newModuleName = moduleName.title ()
			documentation.AddModule (newModuleName, filesByModule[moduleName])
		documentation.WriteJSON (resultFilePath)
	except:
		PrintError ('Could not create documentation.');
		return 1
	
	return 0
	
sys.exit (Main (sys.argv))
