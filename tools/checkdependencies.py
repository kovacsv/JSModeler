import os
import sys
import re

filesFileName = 'files.txt'

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

def CheckUsedSymbols (inputFileName, definedSymbols):
	inputFilePath = os.path.abspath (inputFileName)
	file = open (inputFilePath, 'rb')
	content = file.read ()
	file.close ()
	
	jsmSymbolRegExp = 'JSM\.[a-zA-Z0-9\.]*'
	
	result = True
	currentlyDefinedSymbols = []
	defineStrings = re.findall ('(' + jsmSymbolRegExp + ')\s*=\s*function\s*\(', content)
	for defineString in defineStrings:
		if not 'prototype' in defineString:
			currentlyDefinedSymbols.append (defineString)
	
	defineStrings = re.findall ('(' + jsmSymbolRegExp + ')\s*=\s*' + jsmSymbolRegExp, content)
	for defineString in defineStrings:
		currentlyDefinedSymbols.append (defineString)

	for currentlyDefinedSymbol in currentlyDefinedSymbols:
		if currentlyDefinedSymbol in definedSymbols:
			PrintError ('Multiple defined symbol "' + currentlyDefinedSymbol + '" in file "' + inputFileName + '".')
			result = False
		else:
			definedSymbols.append (currentlyDefinedSymbol)
	
	useStrings = re.findall ('(' + jsmSymbolRegExp + ')\s*\(', content)
	for useString in useStrings:
		if not useString in definedSymbols:
			PrintError ('Invalid dependency "' + useString + '" in file "' + inputFileName + '".')
			result = False
	return result
	
def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	filesFilePath = os.path.abspath (filesFileName)
	PrintInfo ('Collect files to merge from <' + filesFilePath + '>.')
	inputFileNames = GetLinesFromFile (filesFileName);
	if len (inputFileNames) == 0:
		PrintError ('Invalid file list.');
		return 1

	PrintInfo ('Check dependencies.')
	definedSymbols = []
	result = True
	for inputFileName in inputFileNames:
		if not CheckUsedSymbols (inputFileName, definedSymbols):
			result = False
	
	if not result:
		PrintError ('Invalid dependencies found.')
		return 1

	return 0
	
sys.exit (Main (sys.argv))
