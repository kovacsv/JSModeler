import os
import sys
import re

keywords = [
	'Function:',
	'Class:',
	'Description:',
	'Parameters:',
	'Returns:',
	'Example:'
]

classFunctionSeparator = '.'

functionKeyword = keywords[0]
classKeyword = keywords[1]
descriptionKeyword = keywords[2]
parametersKeyword = keywords[3]
returnsKeyword = keywords[4]
exampleKeyword = keywords[5]

class SourceFileParser:
	def __init__ (self, fileName):
		self.fileName = fileName
	
	def Parse (self):
		file = open (self.fileName, 'r')
		content = file.read ()
		file.close ()
		
		regexp = re.compile ('/\*\*(.*?)\*/', re.DOTALL)
		docStrings = regexp.findall (content)
		return self.ParseDocStrings (docStrings)
	
	def ParseDocStrings (self, docStrings):
		docParts = []
		for docString in docStrings:
			docPart = self.ParseDocString (docString)
			current = {}
			if functionKeyword in docPart.keys ():
				current['partType'] = functionKeyword
			elif classKeyword in docPart.keys ():
				current['partType'] = classKeyword
			current['partContent'] = docPart
			docParts.append (current)
		return docParts

	def ParseDocString (self, docString):
		def ProcessParameterLine (keyword, line, lines, index, sections):
			sectionContent = []
			index = index + 1
			while index < len (lines):
				sectionLine = lines[index].strip ()
				if self.GetKeyword (sectionLine) != None:
					index = index - 1
					break
				
				bracketCount = sectionLine.count ('{') + sectionLine.count ('}')
				if bracketCount == 2:
					firstBracket = sectionLine.find ('{')
					secondBracket = sectionLine.find ('}')
					if firstBracket != -1 and secondBracket != -1:
						parameters = []
						if firstBracket == 0:
							parameters = [
								sectionLine[firstBracket + 1 : secondBracket].strip (),
								sectionLine[secondBracket + 1 :].strip (),
							]
						else:
							parameters = [
								sectionLine[: firstBracket - 1].strip (),
								sectionLine[firstBracket + 1 : secondBracket].strip (),
								sectionLine[secondBracket + 1 :].strip (),
							]
						sectionContent.append (parameters)
				index = index + 1
			sections[keyword] = sectionContent
			return index
	
		def ProcessExampleLine (keyword, line, lines, index, sections):
			endOfLine = '\\n'
			sectionContent = ''
			index = index + 1
			while index < len (lines):
				sectionLine = lines[index].replace ('\t', '\\t')
				if self.GetKeyword (sectionLine) != None:
					index = index - 1
					break
				
				sectionContent += sectionLine + endOfLine
				index = index + 1
			sectionContent = sectionContent.strip (endOfLine)
			sections[keyword] = sectionContent
			return index

		def ProcessNormalLine (keyword, line, lines, index, sections):
			sectionContent = line[len (keyword) :].strip () + ' '
			index = index + 1
			while index < len (lines):
				sectionLine = lines[index].strip ()
				if self.GetKeyword (sectionLine) != None:
					index = index - 1
					break
				
				sectionContent += sectionLine + ' '
				index = index + 1
			sectionContent = sectionContent.strip ()
			sections[keyword] = sectionContent
			return index

		originalLines = docString.split ('\n')
		lines = []
		for line in originalLines:
			line = line.strip ()
			if len (line) == 0:
				continue
			if line[0] == '*':
				line = line [1 :]
			if line[0] == '\t':
				line = line [1 :]
			lines.append (line)
		
		sections = {}
		i = 0
		while i < len (lines):
			line = lines[i].strip ()
			keyword = self.GetKeyword (line)
			if keyword != None:
				if keyword == parametersKeyword or keyword == returnsKeyword:
					i = ProcessParameterLine (keyword, line, lines, i, sections)
				elif keyword == exampleKeyword:
					i = ProcessExampleLine (keyword, line, lines, i, sections)
				else:
					i = ProcessNormalLine (keyword, line, lines, i, sections)
			i = i + 1
		return sections
		
	def GetKeyword (self, line):
		for keyword in keywords:
			if line.startswith (keyword):
				return keyword
		return None

class JSONFile:
	def __init__ (self, fileName):
		self.file = None
		self.fileName = fileName
	
	def Open (self):
		self.file = open (self.fileName, 'w')
	
	def Close (self):
		self.file.close ()
		
	def Write (self, tabs, text, comma):
		for i in range (0, tabs):
			self.file.write ('\t')
		content = text
		if comma:
			content += ','
		content += '\n'
		self.file.write (content)

class Parameter:
	def __init__ (self, name, type, description):
		self.name = name
		self.type = type
		self.description = description

	def WriteJSON (self, tabs, file, comma):
		content = '["' + self.name + '", "' + self.type + '", "' + self.description + '"]'
		if comma:
			content += ','
		file.Write (tabs, content, False)

class Return:
	def __init__ (self, type, description):
		self.type = type
		self.description = description

	def WriteJSON (self, tabs, file, comma):
		content = '["' + self.type + '", "' + self.description + '"]'
		if comma:
			content += ','
		file.Write (tabs, content, False)
		
class Function:
	def __init__ (self, name):
		self.name = name
		self.description = ''
		self.parameters = []
		self.returns = []
		self.example = ''

	def GetName (self):
		return self.name

	def HasDescription (self):
		return self.description != ''
		
	def HasParameters (self):
		return len (self.parameters) > 0

	def HasReturns (self):
		return len (self.returns) > 0

	def HasExample (self):
		return self.example != ''

	def SetDescription (self, description):
		self.description = description

	def AddParameter (self, parameter):
		self.parameters.append (parameter)
		
	def AddReturn (self, retVal):
		self.returns.append (retVal)
		
	def SetExample (self, example):
		self.example = example

	def WriteJSON (self, tabs, file, comma):
		file.Write (tabs, '"' + self.name + '" : {', False)
		if self.HasDescription ():
			file.Write (tabs + 1, '"description" : "' + self.description + '"', self.HasParameters () or self.HasReturns () or self.HasExample ())
		if self.HasParameters ():
			file.Write (tabs + 1, '"parameters" : [', False)
			for i in range (0, len (self.parameters)):
				parameter = self.parameters[i]
				parameter.WriteJSON (tabs + 2, file, i < len (self.parameters) - 1)
			file.Write (tabs + 1, ']', self.HasReturns () or self.HasExample ())
		if self.HasReturns ():
			file.Write (tabs + 1, '"returns" : [', False)
			for i in range (0, len (self.returns)):
				parameter = self.returns[i]
				parameter.WriteJSON (tabs + 2, file, i < len (self.returns) - 1)
			file.Write (tabs + 1, ']', self.HasExample ())
		if self.HasExample ():
			file.Write (tabs + 1, '"example" : "' + self.example + '"', False)
		file.Write (tabs, '}', comma)

class Class:
	def __init__ (self, name):
		self.name = name
		self.description = ''
		self.parameters = []
		self.functions = []
		self.example = ''

	def GetName (self):
		return self.name
		
	def HasDescription (self):
		return self.description != ''
		
	def HasParameters (self):
		return len (self.parameters) > 0

	def HasFunctions (self):
		return len (self.functions) > 0

	def HasExample (self):
		return self.example != ''

	def SetDescription (self, description):
		self.description = description

	def AddParameter (self, parameter):
		self.parameters.append (parameter)

	def AddFunction (self, function):
		self.functions.append (function)

	def SetExample (self, example):
		self.example = example

	def WriteJSON (self, tabs, file, comma):
		file.Write (tabs, '"' + self.name + '" : {', False)
		if self.HasDescription ():
			file.Write (tabs + 1, '"description" : "' + self.description + '"', self.HasParameters () or self.HasFunctions () or self.HasExample ())
		if self.HasParameters ():
			file.Write (tabs + 1, '"parameters" : [', False)
			for i in range (0, len (self.parameters)):
				parameter = self.parameters[i]
				parameter.WriteJSON (tabs + 2, file, i < len (self.parameters) - 1)
			file.Write (tabs + 1, ']', self.HasFunctions () or self.HasExample ())
		if self.HasFunctions ():
			file.Write (tabs + 1, '"functions" : {', False)
			for i in range (0, len (self.functions)):
				function = self.functions[i]
				function.WriteJSON (tabs + 2, file, i < len (self.functions) - 1)
			file.Write (tabs + 1, '}', self.HasExample ())
		if self.HasExample ():
			file.Write (tabs + 1, '"example" : "' + self.example + '"', False)
		file.Write (tabs, '}', comma)
		
class Module:
	def __init__ (self, name):
		self.name = name
		self.functions = []
		self.classes = []

	def IsEmpty (self):
		if len (self.functions) > 0:
			return False
		if len (self.classes) > 0:
			return False
		return True

	def HasFunctions (self):
		return len (self.functions) > 0

	def HasClasses (self):
		return len (self.classes) > 0

	def AddFunction (self, function):
		self.functions.append (function)

	def AddClass (self, classVal):
		self.classes.append (classVal)

	def AddClassFunction (self, className, function):
		for classVal in self.classes:
			if classVal.GetName () == className:
				classVal.AddFunction (function)
				break

	def WriteJSON (self, tabs, file, comma):
		file.Write (tabs, '"' + self.name + '" : {', False)
		if self.HasFunctions ():
			file.Write (tabs + 1, '"functions" : {', False)
			for i in range (0, len (self.functions)):
				function = self.functions[i]
				function.WriteJSON (tabs + 2, file, i < len (self.functions) - 1)
			file.Write (tabs + 1, '}', self.HasClasses ())
		if self.HasClasses ():
			file.Write (tabs + 1, '"classes" : {', False)
			for i in range (0, len (self.classes)):
				classVal = self.classes[i]
				classVal.WriteJSON (tabs + 2, file, i < len (self.classes) - 1)
			file.Write (tabs + 1, '}', False)
		file.Write (tabs, '}', comma)

class Documentation:
	def __init__ (self, projectName):
		self.modules = []
		self.projectName = projectName
	
	def AddModule (self, moduleName, sourceFiles):
		module = Module (moduleName)
		for sourceFile in sourceFiles:
			self.ProcessSourceFile (sourceFile, module)
		self.modules.append (module)
	
	def ProcessSourceFile (self, fileName, module):
		parser = SourceFileParser (fileName)
		currentDocParts = parser.Parse ()
		self.ProcessDocParts (currentDocParts, module)
	
	def ProcessDocParts (self, docParts, module):
		currentModule = Module (None)
		for docPart in docParts:
			partType = docPart['partType']
			partContent = docPart['partContent']
			partName = partContent[partType]
			if partType == functionKeyword:
				className = ''
				functionName = ''
				if partName.find (classFunctionSeparator) == -1:
					functionName = partName
				else:
					splitted = partName.split (classFunctionSeparator)
					if len (splitted) == 2:
						className = splitted[0]
						functionName = splitted[1]
				if len (functionName) == 0:
					continue
				theFunction = Function (functionName)
				if descriptionKeyword in partContent.keys ():
					theFunction.SetDescription (partContent[descriptionKeyword])
				if parametersKeyword in partContent.keys ():
					for parameters in partContent[parametersKeyword]:
						theParameter = Parameter (parameters[0], parameters[1], parameters[2])
						theFunction.AddParameter (theParameter)
				if returnsKeyword in partContent.keys ():
					for parameters in partContent[returnsKeyword]:
						theReturn = Return (parameters[0], parameters[1])
						theFunction.AddReturn (theReturn)
				if exampleKeyword in partContent.keys ():
					theFunction.SetExample (partContent[exampleKeyword])
				if len (className) == 0:
					module.AddFunction (theFunction)
				else:
					module.AddClassFunction (className, theFunction)
			elif partType == classKeyword:
				theClass = Class (partName)
				if descriptionKeyword in partContent.keys ():
					theClass.SetDescription (partContent[descriptionKeyword])
				if parametersKeyword in partContent.keys ():
					for parameters in partContent[parametersKeyword]:
						theParameter = Parameter (parameters[0], parameters[1], parameters[2])
						theClass.AddParameter (theParameter)
				if exampleKeyword in partContent.keys ():
					theClass.SetExample (partContent[exampleKeyword])
				module.AddClass (theClass)
				
	def WriteJSON (self, fileName):
		file = JSONFile (fileName)
		file.Open ()
		file.Write (0, '{', False)
		file.Write (1, '"project" : "' + self.projectName +'"', True)
		if len (self.modules) > 0:
			file.Write (1, '"modules" : {', False)
			for i in range (0, len (self.modules)):
				module = self.modules[i]
				module.WriteJSON (2, file, i < len (self.modules) - 1)
			file.Write (1, '}', False)
		file.Write (0, '}', False)
		file.Close ()
