import os
import sys
import re

currentPath = os.path.dirname (os.path.abspath (__file__))
os.chdir (currentPath)

def Main ():
	result = 0
	if result == 0:
		result = os.system ('checkdependencies.py');
	if result == 0:
		result = os.system ('unittest.py');
	if result == 0:
		result = os.system ('jshintcheck.py');
	if result == 0:
		result = os.system ('build.py');
	if result == 0:
		result = os.system ('document.py');

	print '----------'
	if result == 0:
		print 'Successful publication.'
	else:
		print 'Publication failed.'
	
	return result
		
Main ()
