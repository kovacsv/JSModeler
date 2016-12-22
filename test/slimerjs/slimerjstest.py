import os
import sys
import subprocess
from framework import testevaluator

def CheckPIL ():
	pil = pkgutil.find_loader ('PIL')
	if pil == None:
		return False
	return True

def CheckSlimerJSVersion (versionString):
	proc = subprocess.Popen (['slimerjs', '-v'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
	out, err = proc.communicate ()
	if versionString in out:
		return True
	return False

def Main ():
	currentPath = os.path.abspath (os.getcwd ())
	scriptPath = os.path.join (os.path.dirname (os.path.abspath (__file__)), 'slimerjstest.js')
	slimerJSVersion = '0.9.6'
	if not CheckSlimerJSVersion (slimerJSVersion):
		print 'Error: SlimerJS ' + slimerJSVersion + ' is required (npm install -g slimerjs@' + slimerJSVersion + ').'
		return 1

	rootPath = os.path.abspath (os.path.join (os.path.dirname (scriptPath), '..', '..'))
	rootUrl = 'file:///' + rootPath.replace ('\\', '/')
	
	evaluator = testevaluator.Evaluator (currentPath, scriptPath, rootUrl)
	evaluator.Evaluate ()
	
	return 0

sys.exit (Main ())
