Logger = function (silent)
{
	this.silent = silent;
};

Logger.prototype.WriteTestSuite = function (suiteName)
{
	this.WriteText (suiteName);
};

Logger.prototype.WriteTestResult = function (testName, assertResults, succeeded)
{
	if (succeeded) {
		this.WriteColoredText ('green', '  ' + testName + ' - OK');
	}	else {
		var text = this.GetColoredText ('red', '  ' + testName + ' - FAILED: ');
		var i, assertResult;
		for (i = 0; i < assertResults.length; i++) {
			assertResult = assertResults[i];
			if (assertResult) {
				text += this.GetColoredText ('green', (i + 1) + ' ');
			} else {
				text += this.GetColoredText ('red', (i + 1) + ' ');
			}
		}
		this.WriteText (text);
	}
};

Logger.prototype.WriteOverallResult = function (succeeded)
{
	this.WriteText ('Result');
	var resultString = 'OK';
	var color = 'green';
	if (!succeeded) {
		resultString = 'FAILED';
		color = 'red';
	}
	this.WriteColoredText (color, '  ' + resultString);
};

Logger.prototype.WriteColoredText = function (color, text)
{
	this.WriteText (this.GetColoredText (color, text));
};

Logger.prototype.GetColoredText = function (color, text)
{
	if (color == 'green') {
		return '\x1b[1m\x1b[32m' + text + '\x1b[0m';
	} else if (color == 'red') {
		return '\x1b[1m\x1b[31m' + text + '\x1b[0m';
	}
	return text;
};

Logger.prototype.WriteText = function (text)
{
	if (!this.silent) {
		console.log (text);
	}
};

TestHandler = function ()
{
	this.assertResults = [];
	this.failCount = 0;
};

TestHandler.prototype.Assert = function (condition)
{
	this.assertResults.push (condition);
	if (!condition) {
		this.failCount += 1;
	}
};

TestHandler.prototype.GetAssertResults = function ()
{
	return this.assertResults;
};

TestHandler.prototype.IsSucceeded = function ()
{
	return this.failCount === 0;
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
	return handler;
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
	var i, test, handler;
	for (i = 0; i < this.tests.length; i++) {
		test = this.tests[i];
		handler = test.Run ();
		if (!handler.IsSucceeded ()) {
			allSucceeded = false;
		}
		logger.WriteTestResult (test.name, handler.GetAssertResults (), handler.IsSucceeded ());
	}
	return allSucceeded;
};

UnitTest = function (dirName, argv)
{
	this.suites = [];
	this.dirName = dirName;
	
	this.options = {
		runOnlySuite : null,
		silent : false
	};
	if (argv !== undefined && argv !== null) {
		var i, arg;
		for (i = 0; i < argv.length; i++) {
			arg = argv[i];
			if (arg == '-silent') {
				this.options.silent = true;
			} else if (arg == '-suite' && i < argv.length - 1) {
				this.options.runOnlySuite = argv[i + 1];
			}
		}
	}
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
	var logger = new Logger (this.options.silent);
	
	var allSucceeded = true;
	var i, suite, succeeded;
	for (i = 0; i < this.suites.length; i++) {
		suite = this.suites[i];
		if (this.options.runOnlySuite !== null && this.options.runOnlySuite !== suite.name) {
			continue;
		}
		succeeded = suite.Run (logger);
		if (!succeeded) {
			allSucceeded = false;
		}
	}
	
	logger.WriteOverallResult (allSucceeded);
	return allSucceeded;
};

module.exports = UnitTest;
