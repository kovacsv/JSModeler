import os
import sys
import re

rootFolderDir = '..'
projectFolderDir = 'projects'
projectFileName = 'jsmodeler_npp'
sourceFolderName = 'src'

def PrintInfo (message):
	print ('Info: ' + message)

def PrintError (error):
	print ('Error: ' + error)

def GetHTMLFiles (folderPath):
	htmlFiles = []
	if (not os.path.exists (folderPath)):
		return htmlFiles

	for root, dirs, files in os.walk (folderPath):
		for file in files:
			filePath = os.path.join (root, file)
			fileName, fileExtension = os.path.splitext (filePath)
			if fileExtension == '.html':
				htmlFiles.append (filePath)

	return htmlFiles	

def WriteLineToFile (file, line, tabs):
	for i in range (0, tabs):
		file.write ('\t')
	file.write (line + '\n')

def WriteFolderStructure (file, folderPath, tabs):
	folderName = os.path.split (folderPath)[1]
	WriteLineToFile (file, '<Folder name="' + folderName + '">', tabs)
	for entry in os.listdir (folderPath):
		entryPath = os.path.join (folderPath, entry)
		if os.path.isfile (entryPath):
			WriteLineToFile (file, '<File name="' + entryPath +'" />', tabs + 1)
		else:
			WriteFolderStructure (file, entryPath, tabs + 1)
	WriteLineToFile (file, '</Folder>', tabs)

def WriteProjectFile (projectFilePath):
	file = open (projectFilePath, 'w')
	WriteLineToFile (file, '<NotepadPlus>', 0)
	WriteLineToFile (file, '<Project name="JSModeler">', 1)
	
	srcFolderPath = os.path.join (rootFolderDir, sourceFolderName)
	WriteFolderStructure (file, srcFolderPath, 2)
	
	WriteLineToFile (file, '</Project>', 1)
	WriteLineToFile (file, '</NotepadPlus>', 0)
	file.close ()
	
def Main ():
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	projectFolderPath = os.path.join (rootFolderDir, projectFolderDir)
	if not os.path.exists (projectFolderPath):
		os.mkdir (projectFolderPath)
	
	projectFilePath = os.path.join (projectFolderPath, projectFileName)
	PrintInfo ('Write project file to <' + os.path.abspath (projectFilePath) + '>.')
	WriteProjectFile (projectFilePath)
	
	return
	
Main ()
