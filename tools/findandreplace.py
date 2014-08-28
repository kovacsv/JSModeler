import os
import sys
import re

rootFolderDir = '..'

def GetLinesFromFile (fileName):
	lines = []
	if (not os.path.exists (fileName)):
		return lines
	
	inputFile = open (fileName, 'r')
	for line in inputFile:
		lines.append (line.rstrip ('\r\n'))
	inputFile.close ()

	return lines

def GetFiles (folderPath):
	result = []
	if (not os.path.exists (folderPath)):
		return result

	for root, dirs, files in os.walk (folderPath):
		for file in files:
			filePath = os.path.join (root, file)
			fileName, fileExtension = os.path.splitext (filePath)
			if fileExtension == '.html' or fileExtension == '.js':
				result.append (filePath)

	return result	

def ReplaceInFile (filePath):
	file = open (filePath, 'rb')
	content = file.read ()
	file.close ()
	results = re.findall ('new JSM.Material \(([a-zA-Z0-9\.]*), ([a-zA-Z0-9\.]*), ([a-zA-Z0-9\.]*)\)', content)
	for result in results:
		print result
		content = content.replace (
			'new JSM.Material (' + result[0] + ', ' + result[1] + ', ' + result[2] + ')',
			'new JSM.Material ({ambient : ' + result[0] + ', diffuse : ' + result[1] + ', specular : ' + result[2] + '})')
	file = open (filePath, 'wb')
	file.write (content)
	file.close ()
	
def Main ():
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	rootFolderDirPath = os.path.abspath (rootFolderDir)
	files = GetFiles (rootFolderDirPath)

	for fileName in files:
		ReplaceInFile (fileName)
	return 0
	
sys.exit (Main ())
