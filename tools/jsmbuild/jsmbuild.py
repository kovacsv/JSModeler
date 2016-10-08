import os
import re
import json
from jsmdoc import jsmdoc

def GetFileContent (fileName):
	file = open (fileName, 'r')
	content = file.read ()
	file.close ()
	return content

def WriteContentToFile (fileName, content):
	file = open (fileName, 'w')
	file.write (content)
	file.close ()

def WriteHeaderToFile (fileName, header):
	content = GetFileContent (fileName)
	WriteContentToFile (fileName, header + content)
	
def WriteFooterToFile (fileName, footer):
	content = GetFileContent (fileName)
	WriteContentToFile (fileName, content + footer)

def MergeFiles (inputFileNames, outputFileName):
	for fileName in inputFileNames:
		if not os.path.exists (fileName):
			return False
	outputFile = open (outputFileName, 'w')
	for fileName in inputFileNames:
		outputFile.write (GetFileContent (fileName))
		outputFile.write ('\n')
	outputFile.close ()
	return True	

def DeleteFile (fileName):
	if os.path.exists (fileName):
		os.remove (fileName)

def LoadJsonFile (filePath):
	jsonFile = open (filePath)
	jsonContent = json.load (jsonFile)
	jsonFile.close ()
	return jsonContent
		
def CompileFile (inputFileName, externFileName, outputFileName):
	result = os.system ('java -jar compiler/compiler.jar --language_in=ECMASCRIPT5_STRICT --warning_level=VERBOSE --jscomp_off=globalThis --jscomp_off=checkTypes --externs ' + externFileName + ' --js ' + inputFileName + ' --js_output_file ' + outputFileName)
	if result != 0:
		return False
	return True

class WorkingDirGuard:
	def __init__ (self, newWorkingDir):
		self.oldWorkingDir = os.getcwd ()
		os.chdir (newWorkingDir)
	
	def __del__ (self):
		os.chdir (self.oldWorkingDir)
	
class JSMBuilder:
	def __init__ (self):
		self.rootPath = None
		self.files = None
		self.errors = None

	def Init (self, rootPath):
		wd = WorkingDirGuard (rootPath)
		self.rootPath = rootPath
		filesJsonPath = 'files.json'
		self.files = LoadJsonFile (filesJsonPath)
		self.errors = []
		return True

	def CheckDependencies (self):
		def CheckUsedSymbols (inputFileName, definedSymbols, errors):
			fileContent = GetFileContent (inputFileName)
			jsmSymbolRegExp = 'JSM\.[a-zA-Z0-9\.]*'
			
			currentlyDefinedSymbols = []
			defineStrings = re.findall ('(' + jsmSymbolRegExp + ')\s*=\s*function\s*\(', fileContent)
			for defineString in defineStrings:
				if not 'prototype' in defineString:
					currentlyDefinedSymbols.append (defineString)
			defineStrings = re.findall ('(' + jsmSymbolRegExp + ')\s*=\s*' + jsmSymbolRegExp, fileContent)
			for defineString in defineStrings:
				currentlyDefinedSymbols.append (defineString)
		
			everySymbolValid = True
			for currentlyDefinedSymbol in currentlyDefinedSymbols:
				if currentlyDefinedSymbol in definedSymbols:
					errors.append ('Multiple defined symbol "' + currentlyDefinedSymbol + '" in file "' + inputFileName + '".')
					everySymbolValid = False
				else:
					definedSymbols.append (currentlyDefinedSymbol)
			useStrings = re.findall ('(' + jsmSymbolRegExp + ')\s*\(', fileContent)
			for useString in useStrings:
				if not useString in definedSymbols:
					errors.append ('Invalid dependency "' + useString + '" in file "' + inputFileName + '".')
					everySymbolValid = False
			return everySymbolValid	
		wd = WorkingDirGuard (self.rootPath)
		definedSymbols = []
		success = True
		for inputFileName in self.files['coreFileList']:
			if not CheckUsedSymbols (inputFileName, definedSymbols, self.errors):
				success = False
		return success
	
	def RunUnitTests (self):
		wd = WorkingDirGuard (self.rootPath)
		unitTestPath = os.path.join ('..', 'test', 'unittest', 'jsmodelertest.js')
		result = os.system ('sutest ' + unitTestPath + ' -silent')
		if result != 0:
			self.errors.append ('Unit tests failed.')
			return False
		return True
	
	def JSHintCheck (self):
		wd = WorkingDirGuard (self.rootPath)
		configFilePath = 'jshintconfig.json'
		sourcesFolderName = os.path.join ('..', 'src')
		result = os.system ('jshint --config ' + configFilePath + ' ' + sourcesFolderName)
		if result != 0:
			self.errors.append ('Found JSHint errors.')
			return False
		return True
	
	def Build (self):
		def GetVersion (versionFileName):
			if not os.path.exists (versionFileName):
				return None
			content = GetFileContent (versionFileName)
			match = re.search (r'this.mainVersion.*?=.*?(?P<mainVersion>\d+)', content)
			if not match:
				return None
			mainVersion = match.group ('mainVersion')
			match = re.search (r'this.subVersion.*?=.*?(?P<subVersion>\d+)', content)
			if not match:
				return None
			subVersion = match.group ('subVersion')
			return [mainVersion, subVersion]

		def WriteVersionHeader (fileName, version):
			header = '/* JSModeler [mainVersion].[subVersion] - http://www.github.com/kovacsv/JSModeler */ '
			header = header.replace ('[mainVersion]', version[0])
			header = header.replace ('[subVersion]', version[1])
			WriteHeaderToFile (fileName, header)

		def MergeAndCompileFiles (inputFileNames, mergedFilePath, externsFilePath, resultFilePath, version, errors):
			if not MergeFiles (inputFileNames, mergedFilePath):
				errors.append ('Failed to merge files to ' + mergedFilePath)
				return False
			if not CompileFile (mergedFilePath, externsFilePath, resultFilePath):
				errors.append ('Failed to compile file to ' + resultFilePath)
				DeleteFile (mergedFilePath)
				return False
			DeleteFile (mergedFilePath)
			WriteVersionHeader (resultFilePath, version)
			return True
		
		def BuildFileList (inputFileNames, resultFileName, version, errors):
			mergedFilePath = resultFileName + '.merged.js'
			externsFilePath = resultFileName + '.externs.js'
			resultFilePath = os.path.join ('..', 'build', resultFileName + '.js')
			if not MergeAndCompileFiles (inputFileNames, mergedFilePath, externsFilePath, resultFilePath, version, errors):
				return False
			return True			
		
		wd = WorkingDirGuard (self.rootPath)
		version = GetVersion (self.files['coreFileList'][0])
		if version == None:
			self.errors.append ('Invalid version.')
			return False
		
		if not BuildFileList (self.files['coreFileList'], 'jsmodeler', version, self.errors):
			return False
			
		if not BuildFileList (self.files['svgToModelExtensionFileList'], 'jsmodeler.ext.svgtomodel', version, self.errors):
			return False

		if not BuildFileList (self.files['textGeneratorExtensionFileList'], 'jsmodeler.ext.textgenerator', version, self.errors):
			return False

		if not BuildFileList (self.files['geojsonToModelExtensionFileList'], 'jsmodeler.ext.geojsontomodel', version, self.errors):
			return False

		if not BuildFileList (self.files['threeExtensionFileList'], 'jsmodeler.ext.three', version, self.errors):
			return False

		return True

	def Document (self):
		wd = WorkingDirGuard (self.rootPath)
		projectName = 'JSModeler'
		resultFilePath = os.path.join ('..', 'documentation', 'jsmdoc', 'include', 'jsmdoc.json')
		moduleNames = []
		filesByModule = {}
		for fileName in self.files['coreFileList']:
			absPath = os.path.abspath (fileName)
			moduleName = os.path.split (absPath)[0]
			moduleName = os.path.split (moduleName)[1]
			if not moduleName in moduleNames:
				moduleNames.append (moduleName)
			if not moduleName in filesByModule.keys ():
				filesByModule[moduleName] = []
			filesByModule[moduleName].append (absPath)
		documentation = jsmdoc.Documentation (projectName)
		for moduleName in moduleNames:
			newModuleName = moduleName.title ()
			documentation.AddModule (newModuleName, filesByModule[moduleName])
		documentation.WriteJSON (resultFilePath)
		return True

	def MergeFilesForTest (self, mergedFilePath):
		wd = WorkingDirGuard (self.rootPath)
		if not MergeFiles (self.files['coreFileList'], mergedFilePath):
			return False	
		WriteFooterToFile (mergedFilePath, '\nmodule.exports = JSM;\n')
		return True
		
	def GetErrors (self):
		return self.errors
