Logger = function (silent)
{
	this.silent = silent;
};

Logger.prototype.WriteTestSuite = function (suiteName)
{
	this.WriteColoredText ('blue', suiteName);
};

Logger.prototype.WriteTestResult = function (testName, failStackLines)
{
	if (failStackLines.length === 0) {
		this.WriteColoredText ('green', '  ' + testName + ' - OK');
	} else {
		this.WriteColoredText ('red', '  ' + testName + ' - FAILED');
		var i, stackLine;
		for (i = 0; i < failStackLines.length; i++) {
			stackLine = failStackLines[i];
			this.WriteColoredText ('red', '    ' + stackLine);
		}
	}
};

Logger.prototype.WriteOverallResult = function (succeeded)
{
	this.WriteColoredText ('blue', 'Result');
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
	} else if (color == 'blue') {
		return '\x1b[1m\x1b[36m' + text + '\x1b[0m';
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
	this.failStackLines = [];
};

TestHandler.prototype.Assert = function (condition)
{
	function AddStackLine (failStackLines)
	{
		var error = new Error ();
		var stack = error.stack;
		var splitted = stack.split ('\n');
		if (splitted.length < 4) {
			failStackLines.push ('Invalid stack.');
			return;
		}
		
		var stackLine = splitted[3];
		var match = stackLine.match (/\((.*)\)/);
		if (match.length != 2) {
			failStackLines.push ('Invalid stack line.');
			return;
		}
		
		failStackLines.push (match[1]);
	}

	if (!condition) {
		AddStackLine (this.failStackLines);
	}
};

TestHandler.prototype.GetFailStackLines = function ()
{
	return this.failStackLines;
};

TestHandler.prototype.IsSucceeded = function ()
{
	return this.failStackLines.length === 0;
};

Test = function (name, testFunction)
{
	this.name = name;
	this.testFunction = testFunction;
};

Test.prototype.Run = function (logger)
{
	var handler = new TestHandler ();
	this.testFunction (handler);
	logger.WriteTestResult (this.name, handler.GetFailStackLines ());
	return handler.IsSucceeded ();
};

TestSuite = function (name, filter)
{
	this.name = name;
	this.tests = [];
	this.filter = filter;
};

TestSuite.prototype.AddTest = function (name, testFunction)
{
	if (this.filter.runOnlySuite !== null && this.filter.runOnlySuite !== this.name) {
		return;
	}

	if (this.filter.runOnlyTest !== null && this.filter.runOnlyTest !== name) {
		return;
	}

	var test = new Test (name, testFunction);
	this.tests.push (test);
};

TestSuite.prototype.IsEmpty = function ()
{
	return this.tests.length === 0;
};

TestSuite.prototype.Run = function (logger)
{
	logger.WriteTestSuite (this.name);

	var allSucceeded = true;
	var i, test, succeeded;
	for (i = 0; i < this.tests.length; i++) {
		test = this.tests[i];
		succeeded = test.Run (logger);
		if (!succeeded) {
			allSucceeded = false;
		}
	}
	return allSucceeded;
};

UnitTest = function (dirName, argv)
{
	this.suites = [];
	this.dirName = dirName;
	
	this.filter = {
		runOnlySuite : null,
		runOnlyTest : null
	};
	this.silent = false;
	
	if (argv !== undefined && argv !== null) {
		var i, arg;
		for (i = 0; i < argv.length; i++) {
			arg = argv[i];
			if (arg == '-silent') {
				this.silent = true;
			} else if (arg == '-suite' && i < argv.length - 1) {
				this.filter.runOnlySuite = argv[i + 1];
			} else if (arg == '-test' && i < argv.length - 1) {
				this.filter.runOnlyTest = argv[i + 1];
			}
		}
	}
	
	this.logger = new Logger (this.silent);
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
	var suite = new TestSuite (suiteName, this.filter);
	this.suites.push (suite);
	return suite;
};

UnitTest.prototype.Run = function ()
{
	var allSucceeded = true;
	var i, suite, succeeded;
	for (i = 0; i < this.suites.length; i++) {
		suite = this.suites[i];
		if (suite.IsEmpty ()) {
			continue;
		}
		succeeded = suite.Run (this.logger);
		if (!succeeded) {
			allSucceeded = false;
		}
	}
	
	this.logger.WriteOverallResult (allSucceeded);
	return allSucceeded;
};

module.exports = UnitTest;
