import os
import sys
import re
import random
import struct

def WriteMessage (message, value = None):
	if value == None:
		print message + '.'
	else:
		print message + ': ' + str (value) + '.'

def WriteError (message, value = None):
	WriteMessage ('Error: ' + message, value)

class BinaryReader ():
	def __init__ (self, fileName):
		self.file = None
		self.fileName = fileName
	
	def Open (self):
		self.file = open (self.fileName, 'rb')
		self.currentPosition = 0
	
	def Close (self):
		self.file.close ()
		self.currentPosition = 0
	
	def GetCurrentPosition (self):
		return self.currentPosition
	
	def Skip (self, bytes):
		return self.ReadBytes (bytes)
	
	def ReadChar (self):
		return self.ReadBinary (1, '<c')

	def ReadSignedChar (self):
		return self.ReadBinary (1, '<b')		
		
	def ReadUnsignedChar (self):
		return self.ReadBinary (1, '<B')

	def ReadString (self, length):
		return self.ReadBytes (length)
		
	def ReadShort (self):
		return self.ReadBinary (2, '<h')

	def ReadUnsignedShort (self):
		return self.ReadBinary (2, '<H')

	def ReadLong (self):
		return self.ReadBinary (4, '<l')

	def ReadUnsignedLong (self):
		return self.ReadBinary (4, '<L')

	def ReadDouble (self):
		return self.ReadBinary (8, '<d')

	def ReadBytes (self, bytes = 1):
		value = self.file.read (bytes)
		self.currentPosition += bytes
		return value

	def ReadBinary (self, bytes, format):
		value = self.ReadBytes (bytes)
		return struct.unpack (format, value)[0]
	
class LasReader ():
	def __init__ (self, fileName):
		self.reader = BinaryReader (fileName)
		self.data = {}

	def Open (self):
		self.reader.Open ()
	
	def Close (self):
		self.reader.Close ()
	
	def Read (self):
		if not self.ReadHeader ():
			WriteError ('Failed to read header')
			return None
		if not self.ReadPointData ():
			WriteError ('Failed to read point data')
			return None
		return self.data
	
	def ReadHeader (self):
		header = {}
		
		header['signature'] = self.reader.ReadString (4)
		WriteMessage ('File signature', header['signature'])
		if header['signature'] != 'LASF':
			WriteError ('Invalid file signature')
			return False
		
		self.reader.Skip (20)
		header['versionMajor'] = self.reader.ReadUnsignedChar ()
		header['versionMinor'] = self.reader.ReadUnsignedChar ()
		WriteMessage ('Major version', header['versionMajor'])
		WriteMessage ('Minor version', header['versionMinor'])

		self.reader.Skip (70)
		header['offsetToPointData'] = self.reader.ReadUnsignedLong ()
		WriteMessage ('Offset to point data', header['offsetToPointData'])
		
		self.reader.Skip (4)
		header['pointDataFormat'] = self.reader.ReadUnsignedChar ()
		WriteMessage ('Point data format', header['pointDataFormat'])
		
		header['pointRecordLength'] = self.reader.ReadUnsignedShort ()
		WriteMessage ('Point record length', header['pointRecordLength'])

		header['pointRecordNum'] = self.reader.ReadUnsignedLong ()
		WriteMessage ('Number of point records', header['pointRecordNum'])
		
		self.reader.Skip (20)
		header['xScale'] = self.reader.ReadDouble ()
		WriteMessage ('X scale factor', header['xScale'])
		header['yScale'] = self.reader.ReadDouble ()
		WriteMessage ('Y scale factor', header['yScale'])
		header['zScale'] = self.reader.ReadDouble ()
		WriteMessage ('Z scale factor', header['zScale'])
		header['xOffset'] = self.reader.ReadDouble ()
		WriteMessage ('X Offset factor', header['xOffset'])
		header['yOffset'] = self.reader.ReadDouble ()
		WriteMessage ('Y Offset factor', header['yOffset'])
		header['zOffset'] = self.reader.ReadDouble ()
		WriteMessage ('Z Offset factor', header['zOffset'])
		
		self.data['header'] = header
		return True
		
	def ReadPointData (self):
		header = self.data['header']
		pointRecordLength = header['pointRecordLength']
		
		pointData = []
		colorData = []
		self.reader.Skip (header['offsetToPointData'] - self.reader.GetCurrentPosition ())
		for i in range (0, header['pointRecordNum']):
			x = self.reader.ReadLong () * header['xScale'] + header['xOffset']
			y = self.reader.ReadLong () * header['yScale'] + header['yOffset']
			z = self.reader.ReadLong () * header['zScale'] + header['zOffset']
			pointData.append ([x, y, z])
			intensity = self.reader.ReadUnsignedShort ()
			colorData.append ([0, 0, 0])
			self.reader.Skip (pointRecordLength - 3 * 4 - 2)
		
		self.data['pointData'] = pointData
		self.data['colorData'] = colorData
		return True

def GetExampleData ():
	data = {}
	data['pointData'] = []
	data['colorData'] = []
	for i in range (0, 10000):
		x = random.random ()
		y = random.random ()
		z = random.random ()
		data['pointData'].append ([x, y, z])
		data['colorData'].append ([x, y, z])
	return data		
		
def ConvertToJson (points, colors, fileName):
	def WriteArray (file, arr):
		for i in range (0, len (points)):
			current = arr[i]
			last = i == (len (arr) - 1)
			file.write ('\t\t' + str (current[0]) + ', ' + str (current[1]) + ', ' + str (current[2]))
			if not last:
				file.write (',')
			file.write ('\n')

	file = open (fileName, 'wb')
	file.write ('{\n')
	file.write ('\t \"points\" : [\n')
	WriteArray (file, points)
	file.write ('\t],\n')
	file.write ('\t \"colors\" : [\n')
	WriteArray (file, colors)
	file.write ('\t]\n')
	file.write ('}\n')
	file.close ()
		
def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)
	
	if len (argv) != 3:
		print 'Usage: las2json.py <lasFilePath> <resultFilePath>'
		return 1	
	
	lasFilePath = argv[1]
	resultFilePath = argv[2]
	reader = LasReader (lasFilePath)
	reader.Open ()
	data = reader.Read ()
	reader.Close ()
    
	if data == None:
		return 1

	ConvertToJson (data['pointData'], data['colorData'], resultFilePath)
	return 0
	
sys.exit (Main (sys.argv))
