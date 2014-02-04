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
	
	inputFileNames = GetLinesFromFile (filesFilePath);
	if len (inputFileNames) == 0:
		PrintError ('Invalid file list.');
		return

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
	
	documentation = jsmdoc.Documentation ()
	for moduleName in moduleNames:
		documentation.AddModule (moduleName, filesByModule[moduleName])
	documentation.WriteJSON (resultFilePath)
	
	return
	
Main (sys.argv)
