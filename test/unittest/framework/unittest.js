Logger = function ()
{

};

Logger.prototype.WriteTestSuite = function (suiteName)
{
	console.log (suiteName);
};

Logger.prototype.WriteTestResult = function (testName, succeeded)
{
	var resultString = 'OK';
	var color = '32m';
	if (!succeeded) {
		resultString = 'FAILED';
		var color = '31m';
	}
	this.WriteColoredText (color, '  ' + testName + ' - ' + resultString);
};

Logger.prototype.WriteOverallResult = function (succeeded)
{
	console.log ('Result');
	var resultString = 'OK';
	var color = '32m';
	if (!succeeded) {
		resultString = 'FAILED';
		var color = '31m';
	}
	this.WriteColoredText (color, '  ' + resultString);
};

Logger.prototype.WriteColoredText = function (color, text)
{
	console.log ('\x1b[' + color + text + '\x1b[0m');
}

TestHandler = function ()
{
	this.failCount = 0;
};

TestHandler.prototype.Assert = function (condition)
{
	if (!condition) {
		this.failCount += 1;
	}
};

TestHandler.prototype.IsSucceeded = function ()
{
	return this.failCount == 0;
};

Test = function (name, callback)
{
	this.name = name;
	this.callback = callback;
};

Test.prototype.Run = function ()
{
	var handler = new TestHandler ();
	this.callback (handler);
	return handler.IsSucceeded ();
};

TestSuite = function (name)
{
	this.name = name;
	this.tests = [];
};

TestSuite.prototype.AddTest = function (name, callback)
{
	var test = new Test (name, callback);
	this.tests.push (test);
};

TestSuite.prototype.Run = function (logger)
{
	logger.WriteTestSuite (this.name);

	var allSucceeded = true;
	var i, test, succeeded;
	for (i = 0; i < this.tests.length; i++) {
		test = this.tests[i];
		succeeded = test.Run ();
		if (!succeeded) {
			allSucceeded = false;
		}
		logger.WriteTestResult (test.name, succeeded);
	}
	return allSucceeded;
};

UnitTest = function (dirName)
{
	this.suites = [];
	this.dirName = dirName;
};

UnitTest.prototype.IncludeSourceFile = function (fileName)
{
	var path = require ('path');
	var fullPath = path.resolve (this.dirName, fileName);

	var fs = require ('fs');
	var content = fs.readFileSync (fullPath).toString ();

	eval.apply (global, [content]);
};

UnitTest.prototype.AddTestFile = function (fileName)
{
	var path = require ('path');
	var fullPath = path.resolve (this.dirName, fileName);
	require (fullPath) (this);
};

UnitTest.prototype.AddTestSuite = function (suiteName)
{
	var suite = new TestSuite (suiteName);
	this.suites.push (suite);
	return suite;
};

UnitTest.prototype.Run = function ()
{
	var logger = new Logger ();
	
	var allSucceeded = true;
	var i, suite, succeeded;
	for (i = 0; i < this.suites.length; i++) {
		suite = this.suites[i];
		succeeded = suite.Run (logger);
		if (!succeeded) {
			allSucceeded = false;
		}
	}
	
	logger.WriteOverallResult (allSucceeded);
	return allSucceeded;
};

module.exports = UnitTest;
