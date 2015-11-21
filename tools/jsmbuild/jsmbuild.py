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

class JSMBuilder:
	def __init__ (self):
		self.rootPath = None
		self.files = None
		self.errors = None

	def Init (self, rootPath):
		os.chdir (rootPath)
		self.rootPath = rootPath
		filesJsonPath = os.path.join (self.rootPath, 'files.json')
		self.files = LoadJsonFile (filesJsonPath)
		self.errors = []
		return True

	def GetErrors (self):
		return self.errors
	
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
		definedSymbols = []
		success = True
		for inputFileName in self.files['coreFileList']:
			if not CheckUsedSymbols (inputFileName, definedSymbols, self.errors):
				success = False
		return success
	
	def RunUnitTests (self):
		unitTestPath = os.path.join (self.rootPath, '..', 'test', 'unittest', 'jsmodelertest.js')
		result = os.system ('sutest ' + unitTestPath + ' -silent')
		if result != 0:
			self.errors.append ('Unit tests failed.')
			return False
		return True
	
	def JSHintCheck (self):
		configFilePath = os.path.join (self.rootPath, 'jshintconfig.json')
		sourcesFolderName = os.path.join (self.rootPath, '..', 'src')
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
			
		version = GetVersion (self.files['coreFileList'][0])
		if version == None:
			self.errors.append ('Invalid version.')
			return False
			
		inputFileNames = self.files['coreFileList']
		mergedFilePath = os.path.join (self.rootPath, 'jsmodeler.merged.js')
		externsFilePath = os.path.join (self.rootPath, 'jsmodeler.externs.js')
		resultFilePath = os.path.join (self.rootPath, '..', 'build', 'jsmodeler.js')
		if not MergeAndCompileFiles (inputFileNames, mergedFilePath, externsFilePath, resultFilePath, version, self.errors):
			return False
			
		inputFileNames = self.files['threeExtensionFileList']
		mergedFilePath = os.path.join (self.rootPath, 'jsmodeler.viewer.merged.js')
		externsFilePath = os.path.join (self.rootPath, 'jsmodeler.viewer.externs.js')
		resultFilePath = os.path.join (self.rootPath, '..', 'build', 'jsmodeler.viewer.js')
		if not MergeAndCompileFiles (inputFileNames, mergedFilePath, externsFilePath, resultFilePath, version, self.errors):
			return False

		return True

	def Document (self):
		projectName = 'JSModeler'
		resultFilePath = os.path.join (self.rootPath, '..', 'documentation', 'jsmdoc', 'include', 'jsmdoc.json')
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
