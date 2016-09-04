import os
import sys
import re
from jsmbuild import jsmbuild

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

def GetFilesByExtension (folderPath, extension):
	htmlFiles = []
	if (not os.path.exists (folderPath)):
		return htmlFiles

	for root, dirs, files in os.walk (folderPath):
		for file in files:
			filePath = os.path.join (root, file)
			fileName, fileExtension = os.path.splitext (filePath)
			if fileExtension == extension:
				htmlFiles.append (filePath)

	return htmlFiles	

def ReplaceStringPart (fromIndex, toIndex, originalString, newString):
	preFix = originalString[:fromIndex]
	postFix = originalString[toIndex:]
	result = preFix + newString + postFix
	return result
	
def ReplaceIncludesInFile (htmlFileName, inputFileNames, includesStart, includesEnd, includesPrefix, includesPostfix):
	htmlFile = open (htmlFileName, 'r')
	htmlContent = htmlFile.read ()
	htmlFile.close ()
	
	startPos = htmlContent.find (includesStart)
	endPos = htmlContent.find (includesEnd)

	if startPos == -1 or endPos == -1 or startPos >= endPos:
		return
	
	lineEnd = '\n'
	includesString = lineEnd
	for inputFileName in inputFileNames:
		absPath = os.path.abspath (inputFileName)
		dirName = os.path.dirname (htmlFileName)
		relPath = os.path.relpath (absPath, dirName)
		includesString += includesPrefix + relPath.replace ('\\', '/') + includesPostfix + lineEnd
	
	resultString = ReplaceStringPart (startPos + len (includesStart), endPos, htmlContent, includesString)
	result = open (htmlFileName, 'w')
	result.write (resultString)
	result.close ()
	
def Main ():
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	filesJsonPath = 'files.json'
	jsonFileNames = jsmbuild.LoadJsonFile (filesJsonPath)
	fileNames = []
	for fileName in jsonFileNames['coreFileList']:
		fileNames.append (fileName)
	for fileName in jsonFileNames['svgToModelExtensionFileList']:
		fileNames.append (fileName)
	for fileName in jsonFileNames['geojsonToModelExtensionFileList']:
		fileNames.append (fileName)
	for fileName in jsonFileNames['threeExtensionFileList']:
		fileNames.append (fileName)
	
	rootFolderDirPath = os.path.abspath ('..')
	PrintInfo ('Collect HTML files from <' + rootFolderDirPath + '>.')

	htmlFiles = GetFilesByExtension (rootFolderDirPath, '.html')
	PrintInfo ('Replace includes in html files in <' + rootFolderDirPath + '>.')
	for htmlFilePath in htmlFiles:
		ReplaceIncludesInFile (
			htmlFilePath,
			fileNames,
			'<!-- JSModeler includes start -->',
			'<!-- JSModeler includes end -->',
			'\t<script type="text/javascript" src="',
			'"></script>'
		)

	jsFiles = GetFilesByExtension (rootFolderDirPath, '.js')
	PrintInfo ('Replace includes in js files in <' + rootFolderDirPath + '>.')
	for jsFilePath in jsFiles:
		ReplaceIncludesInFile (
			jsFilePath,
			fileNames,
			'// JSModeler includes start',
			'// JSModeler includes end',
			'unitTest.AddSourceFile (\'',
			'\');'
		)
	return 0
	
sys.exit (Main ())
