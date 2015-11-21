import os
import sys
from jsmbuild import jsmbuild

def PrintTitle (title):
	print '-- ' + title + ' --'

def PrintMessage (message):
	print message

def PrintErrors (builder):
	for error in builder.GetErrors ():
		print error

def Main ():
	builder = jsmbuild.JSMBuilder ()

	PrintTitle ('Init build system')
	currentPath = os.path.dirname (os.path.abspath (__file__))
	if not builder.Init (currentPath):
		PrintErrors (builder)
		return 1
    
	PrintTitle ('Check dependencies')
	if not builder.CheckDependencies ():
		PrintErrors (builder)
		return 1
	
	PrintTitle ('Run unit tests')
	if not builder.RunUnitTests ():
		PrintErrors (builder)
		return 1
    
	PrintTitle ('JSHint check')
	if not builder.JSHintCheck ():
		PrintErrors (builder)
		return 1

	PrintTitle ('Build')
	if not builder.Build ():
		PrintErrors (builder)
		return 1
	
	PrintTitle ('Document')
	if not builder.Document ():
		PrintErrors (builder)
		return 1

	PrintMessage ('---------------------------')
	PrintMessage ('Build finished successfully')
	return 0
	
sys.exit (Main ())
