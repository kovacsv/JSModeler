import os
import sys
import time

parentDir = os.path.dirname (os.path.dirname (os.path.abspath (__file__)))
sys.path.insert (0, os.path.join (parentDir, 'JSVisualTester')) 
from TestRunnerLibrary import TestRunner
from TestRunnerLibrary import Browser

def TestViewer (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'test\\viewertest\\viewertest.html'))
	index = 0
	for i in range (0, 42): 
		browser.Capture ('viewertest_' + str (index))
		browser.KeyPress (39, 0)
		index = index + 1

def UnitTest (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'test\\unittest\\jsmodeler.html'))
	browser.Capture ('unittest_jsmodeler')
	browser.SetURL (os.path.join (path, 'test\\unittest\\viewer.html'))
	browser.Capture ('unittest_viewer')

def TestSVGToModel (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'test\\viewertest\\svgtomodeltest.html'))
	index = 0
	for i in range (0, 12): 
		browser.Capture ('svgtomodeltest_' + str (index))
		browser.KeyPress (39, 0)
		index = index + 1

def TestCSG (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'test\\viewertest\\csgtest.html'))
	index = 0
	for i in range (0, 30): 
		browser.Capture ('csgtest_' + str (index))
		browser.KeyPress (39, 0)
		index = index + 1

def TestDialogs (browser, path):
	def WriteToField (browser, x, y, text):
		browser.DragDrop (x, y, x - 200, y)
		browser.TextWrite (text)

	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'test\\viewertest\\dialogtest.html'))
	browser.Capture ('dialogtest')
	
	browser.Click (50, 20)
	browser.Capture ('dialogtest')
	WriteToField (browser, 627, 272, 'Modified Text')
	browser.Click (543, 307)
	WriteToField (browser, 550, 338, '5')
	WriteToField (browser, 620, 338, '6')
	WriteToField (browser, 680, 338, '7')
	WriteToField (browser, 577, 373, '00cc00')
	browser.Click (595, 405)
	browser.Click (745, 438)
	browser.Capture ('dialogtest')
	browser.Click (745, 446)

	browser.Click (50, 20)
	browser.Capture ('dialogtest')
	WriteToField (browser, 627, 272, 'Another Modified Text')
	browser.Click (690, 446)
	
	browser.Click (50, 20)
	browser.Capture ('dialogtest')
	browser.Click (745, 446)

	browser.Click (140, 20)
	browser.Capture ('dialogtest')
	browser.Click (877, 401)
	
	browser.Click (230, 20)
	browser.Capture ('dialogtest')
	browser.Click (390, 274)
	browser.Click (412, 381)
	browser.Click (495, 195)
	browser.Click (482, 420)
	browser.Click (495, 195)
	browser.Click (489, 262)
	browser.Click (390, 274)
	browser.Click (868, 531)
	
	browser.Click (230, 20)
	browser.Capture ('dialogtest')
	browser.Click (868, 531)

	browser.Capture ('dialogtest')
		
def TestCamera (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'test\\viewertest\\cameratest.html'))
	
	resetButtons = [35, 100, 160]
	fixUpButtons = [-1, 220]

	startX = 650
	startY = 350
	diffX = 50
	diffY = 50
	
	for fixUpButton in fixUpButtons:
		if fixUpButton != -1:
			browser.Click (fixUpButton, 23)
			
		for resetButton in resetButtons:
			browser.Click (resetButton, 23)
			browser.Capture ('camera')

			browser.DragDrop (startX, startY, startX + diffX, startY)
			browser.Capture ('camera')

			browser.DragDrop (startX + diffX, startY, startX, startY)
			browser.Capture ('camera')
			
			browser.DragDrop (startX, startY, startX, startY + diffY)
			browser.Capture ('camera')

			browser.DragDrop (startX, startY + diffY, startX, startY)
			browser.Capture ('camera')

			browser.DragDrop (startX, startY, startX + diffX, startY + diffY)
			browser.Capture ('camera')

			browser.DragDrop (startX + diffX, startY + diffY, startX, startY)
			browser.Capture ('camera')

def TestDemonstration (browser, path):
	def WriteToField (browser, x, y, text):
		browser.DragDrop (x, y, x - 50, y)
		browser.TextWrite (text)	
	
	def OpenSettings (browser):
		browser.Click (245, 22)
		browser.Capture ('demonstration');

	def CheckInfo (browser):
		browser.Click (245, 65)
		browser.Capture ('demonstration');
	
	def Subdivide (browser):
		browser.Click (245, 105)
		browser.Capture ('demonstration');

	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\demo\\demonstration.html'))
	
	yClicks = [112, 132, 151, 173, 193, 212, 232, 255, 273, 318, 339, 356, 376, 398, 415, 462, 481, 527]
	for yClick in yClicks:
		browser.Click (35, yClick)
		browser.Capture ('demonstration');
	
	browser.Click (35, 151);
	OpenSettings (browser)
	
	WriteToField (browser, 540, 305, '0.5')
	WriteToField (browser, 540, 336, '1.5')
	WriteToField (browser, 540, 374, '2.5')
	browser.Click (693, 414)
	browser.Capture ('demonstration');
	
	CheckInfo (browser)
	Subdivide (browser)
	Subdivide (browser)
	Subdivide (browser)
	
	for i in range (0, 4):
		if i == 0 or i == 1:
			browser.Click (35, 318)
		elif i == 2:
			browser.Click (35, 339)
		else:
			browser.Click (35, 356)
		OpenSettings (browser)
		start = [380, 280]
		end = [380, 280]
		if i == 1:
			browser.Click (500, 195)
			start = [361, 241]
			end = [361, 241]
		elif i == 3:
			end = [454, 244]
		
		browser.Click (start[0], start[1])
		browser.Click (361, 402)
		browser.Click (523, 363)
		browser.Click (411, 358)
		browser.Click (428, 300)
		browser.Click (476, 266)
		browser.Click (454, 244)
		browser.Click (end[0], end[1])
		browser.Capture ('demonstration');
		
		browser.Click (862, 528)
		browser.Capture ('demonstration');
	
	browser.Click (35, 318)
	OpenSettings (browser)
	WriteToField (browser, 384, 195, '0.02')
	browser.Click (862, 528)

	OpenSettings (browser)
	browser.DragDrop (477, 266, 510, 286)
	browser.Click (862, 528)
	
def TestOldDemonstration (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\olddemo\\demonstration.html'))
	
	xClicks = [30, 80, 130, 190, 230, 260, 290, 340, 390, 450, 510, 570, 610, 660, 720, 780]
	index = 1
	for xClick in xClicks:
		browser.Click (xClick, 60)
		browser.Capture ('olddemonstration_' + str (index));
		index = index + 1	

def TestLegoBuilder (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\examples\\legobuilder.html'))
	browser.Capture ('lego_empty');
	browser.DragDrop (40, 128, 80, 150)
	browser.Capture ('lego_red_brick');

	browser.Click (125, 25)
	browser.DragDrop (100, 130, 120, 150)
	browser.Capture ('lego_blue_brick');
	
	browser.Click (170, 25)
	browser.Click (75, 75)
	browser.DragDrop (140, 125, 170, 150)
	browser.Capture ('lego_small_green_brick');
	
	browser.Click (30, 75)
	browser.Capture ('lego_undo_green_brick');
	
	browser.Click (75, 75)
	browser.DragDrop (140, 125, 170, 150)
	browser.Capture ('lego_large_green_brick');
	
	browser.Click (28, 25)
	browser.DragDrop (60, 128, 60, 350)
	browser.Capture ('lego_yellow_brick_1');
	
	browser.Click (75, 75)
	browser.DragDrop (40, 310, 220, 310)
	browser.Capture ('lego_yellow_brick_2');
	
	browser.Click (75, 75)
	browser.DragDrop (200, 128, 200, 350)
	browser.Capture ('lego_yellow_brick_3');
	
	browser.Click (150, 25)
	browser.Click (180, 270)
	browser.Click (180, 270)
	browser.Click (180, 270)
	browser.Click (180, 270)
	browser.Capture ('lego_blue_tower');
	
	browser.Click (290, 25)
	browser.Click (75, 75)
	browser.DragDrop (100, 170, 260, 350)
	browser.Capture ('lego_small_brown_brick');
	
	browser.Click (75, 25)
	browser.Click (75, 75)
	browser.DragDrop (120, 190, 180, 250)
	browser.Capture ('lego_large_red_brick');
	
	browser.DragDrop (750, 450, 750, 380)
	browser.Capture ('lego_from_down');
	
	browser.DragDrop (750, 380, 750, 450)
	browser.Click (290, 75)
	browser.Capture ('lego_cleared');

def TestTicTacToe (browser, path):
	if browser.GetName () != 'firefox':
		return

	fullPath = os.path.join (path, 'documentation\\examples\\tictactoe.html')
	browser.SetURL ('file:///' + fullPath + '#norandom')
	browser.Capture ('tictactoe_empty');
	browser.Click (683, 312)
	browser.Capture ('tictactoe_1');
	browser.Click (675, 429)
	browser.Capture ('tictactoe_2');
	browser.Click (524, 323)
	browser.Capture ('tictactoe_3');

def TestDeform (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\examples\\deform.html'))
	browser.Capture ('deform_main');
	browser.DragDrop (700, 400, 700, 300)
	browser.Capture ('deform_modified');

def TestSolids (browser, path):
	browser.SetURL (os.path.join (path, 'documentation\\examples\\solids.html'))
	yClicks = [125, 142, 157, 172, 188, 216, 148, 163, 176, 192, 206, 222, 238, 253, 268, 281, 300, 312, 326, 356, 167, 181, 197]
	index = 1
	for yClick in yClicks:
		browser.Click (70, yClick)
		browser.Capture ('solids_' + str (index));
		index = index + 1
	
	browser.Click (70, 126)
	browser.Click (70, 222)
	
	browser.Click (42, 450)
	browser.Capture ('solids_nocolor');
	browser.Click (42, 430)
	browser.Capture ('solids_nofaces');

	browser.Click (70, 500)
	browser.Capture ('solids_stl');
	browser.Click (70, 600)

	browser.Click (70, 515)
	browser.Capture ('solids_obj');
	browser.Click (70, 600)

def TestRobot (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\examples\\robot\\robot.html'))
	browser.Capture ('robot');

def TestClock (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	fullPath = os.path.join (path, 'documentation\\examples\\clock.html')
	browser.SetURL ('file:///' + fullPath + '#fixtime')
	browser.Capture ('clock');

def TestSVGTo3D (browser, path):
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\examples\\svgto3d.html'))
	browser.Capture ('svgto3d');
	
	coordinates = [
		[260, 290],
		[470, 290],
		[700, 290],
		[920, 290],
		[260, 500],
		[470, 500],
		[700, 500],
		[920, 500],
		[-1, -1],
		[260, 520],
		[470, 520],
		[700, 520],
		[920, 520]
	]
	
	for coordinate in coordinates:
		if coordinate == [-1, -1]:
			browser.KeyPress (34, 0)
			continue
		browser.Click (coordinate[0], coordinate[1])
		browser.Capture ('svgto3d');
		browser.KeyPress (27, 0)

def TestCSGApp (browser, path):
	def WriteToField (browser, x, y, text):
		browser.DragDrop (x, y, x - 50, y)
		browser.TextWrite (text)		
		
	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\examples\\csg.html'))
	browser.Capture ('csg')
	
	WriteToField (browser, 215, 460, '0.0')
	browser.KeyPress (13, 0)
	browser.Capture ('csg')

	WriteToField (browser, 140, 360, '0.3')
	browser.KeyPress (13, 0)
	browser.Capture ('csg')
	
	WriteToField (browser, 126, 460, '0.0')
	browser.KeyPress (13, 0)
	browser.Capture ('csg')

	WriteToField (browser, 170, 460, '0.0')
	browser.KeyPress (13, 0)
	browser.Capture ('csg')

	browser.Click (140, 310)
	browser.Capture ('csg')

	browser.Click (90, 528)
	browser.Capture ('csg')

	browser.Click (215, 528)
	browser.Capture ('csg')

	browser.Click (140, 528)
	browser.Capture ('csg')

	browser.Click (90, 116)
	browser.Capture ('csg')
	
	browser.Click (40, 370)
	browser.Capture ('csg')

def TestBezier (browser, path):
	def MoveControlPoint (browser, x, y, distance):
		browser.DragDrop (x, y, x, y + distance)
		browser.Capture ('bezier')		

	if browser.GetName () != 'firefox' and browser.GetName () != 'chrome':
		return

	browser.SetURL (os.path.join (path, 'documentation\\examples\\bezier.html'))
	browser.Capture ('bezier')

	browser.Click (175, 130)
	browser.Capture ('bezier')
	browser.Click (120, 130)
	browser.Capture ('bezier')
	
	browser.Click (112, 160)
	browser.Capture ('bezier')
	browser.Click (144, 160)
	browser.Capture ('bezier')
	browser.Click (202, 160)
	browser.Capture ('bezier')
	browser.Click (232, 160)
	browser.Capture ('bezier')
	browser.Click (172, 160)
	browser.Capture ('bezier')
	
	MoveControlPoint (browser, 897, 418, -40)
	MoveControlPoint (browser, 966, 357, 70)
	MoveControlPoint (browser, 748, 371, -80)
	MoveControlPoint (browser, 831, 324, -100)
	
	browser.Click (60, 316)
	browser.Capture ('bezier')
	browser.Click (60, 550)

	browser.Click (60, 396)
	browser.Capture ('bezier')
	browser.Click (60, 550)

	browser.Click (60, 412)
	browser.Capture ('bezier')
	browser.Click (60, 550)

def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	testRunner = TestRunner.TestRunner ()
	
	path = os.path.join (currentPath, '..', 'JSModeler');
	browserSpecs = [
		['firefox', [2, 114, 2, 2]]
		#['chrome', [3, 81, 3, 3]]
	]

	start = time.time ()
	for browserSpec in browserSpecs:
		browser = Browser.Browser (testRunner, browserSpec[0])
		
		browser.Open (1200, 800, browserSpec[1])
		TestViewer (browser, path)
		UnitTest (browser, path)
		TestSVGToModel (browser, path)
		TestCSG (browser, path)
		TestDialogs (browser, path)
		TestDemonstration (browser, path)
		TestOldDemonstration (browser, path)
		TestLegoBuilder (browser, path)
		TestTicTacToe (browser, path)
		TestDeform (browser, path)
		TestSolids (browser, path)
		TestRobot (browser, path)
		TestClock (browser, path)
		TestSVGTo3D (browser, path)
		TestCSGApp (browser, path)
		TestBezier (browser, path)
		browser.Close ()
	end = time.time ()
	
	print ('time: ' + str (end - start))	
	testRunner.GenerateResult ()
	
	exit (0)
	
Main (sys.argv)
