import os
import sys
import re
	
def Main ():
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	result = 0
	if result == 0:
		result = os.system ('jshint.py');
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
