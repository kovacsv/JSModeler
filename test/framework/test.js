var Table = function (className)
{
	this.table = null;
	this.Init (className);
};

Table.prototype =
{
	Init : function (className)
	{
		this.table = document.createElement ('table');
		if (className !== undefined) {
			this.table.className = className;
		}
	},
	
	Place : function (parentElement)
	{
		parentElement.appendChild (this.table);
	},
	
	AddRow : function (tableRow)
	{
		this.table.appendChild (tableRow.row);
	}
};

var TableRow = function (className)
{
	this.row = null;
	this.Init (className);
};

TableRow.prototype =
{
	Init : function (className)
	{
		this.row = document.createElement ('tr');
		if (className !== undefined) {
			this.row.className = className;
		}
	},
	
	AddColumn : function (tableColumn)
	{
		this.row.appendChild (tableColumn.column);
	}	
};

var TableColumn = function (className)
{
	this.column = null;
	this.Init (className);
};

TableColumn.prototype =
{
	Init : function (className)
	{
		this.column = document.createElement ('td');
		if (className !== undefined) {
			this.column.className = className;
		}
	},
	
	AddContentElem : function (elem)
	{
		this.column.appendChild (elem);
	},
	
	AddContentText : function (text)
	{
		var span = document.createElement ('span');
		span.innerHTML = text;
		this.AddContentElem (span);
	},
	
	SetColSpan : function (colSpan)
	{
		this.column.colSpan = colSpan;
	},

	SetRowSpan : function (rowSpan)
	{
		this.column.rowSpan = rowSpan;
	}
};

var Test = function (name, callback)
{
	this.name = name || null;
	this.callback = callback || null;
	this.resultValues = null;
};

Test.prototype =
{
	Run : function ()
	{
		this.resultValues = [];
		this.callback (this);
		return this.resultValues;
	},
	
	GetName : function ()
	{
		return this.name;
	},

	GetResult : function ()
	{
		return this.resultValues;
	},

	Assert : function (condition)
	{
		this.resultValues.push (condition);
	}
}

var TestSuite = function (name)
{
	this.name = name;
	this.tests = [];
};

TestSuite.prototype =
{
	AddTest : function (test)
	{
		this.tests.push (test);
	},
	
	GetTest : function (index)
	{
		return this.tests[index];
	},
	
	TestCount : function ()
	{
		return this.tests.length;
	},
	
	GetName : function ()
	{
		return this.name;
	}
}

var TestRunner = function ()
{
	this.testSuites = [];
	this.index = 0;
	
	this.runOnlySuite = null;
	this.runOnlyTest = null;
	this.table = null;
	
	var myThis = this;
	if (window.addEventListener) {
		window.addEventListener ('load', function () {myThis.Run ()});
		window.addEventListener ('hashchange', function () {window.location.reload ();});
	} else if (window.attachEvent) {
		window.attachEvent ('onload', function () {myThis.Run ()});
		window.attachEvent ('onhashchange', function () {window.location.reload ();});
	}
};

TestRunner.prototype =
{
	AddTestSuite : function (testSuite)
	{
		this.testSuites.push (testSuite);
	},
	
	AddTestToLastSuite : function (test)
	{
		var count = this.testSuites.length;
		if (count == 0) {
			return;
		}
		this.testSuites[count - 1].AddTest (test);
	},
	
	Run : function ()
	{
		this.table = new Table ('testtable');
		this.table.AddRow (this.GetHeader (['index', 'suite', 'name', 'result']));
		
		this.index = 0;
		this.RunTestSuites ();
		
		this.table.Place (document.body);
	},

	RunTestSuites : function ()
	{
		this.CalculateRunOnlyTest ();
	
		var i;
		for (i = 0; i < this.testSuites.length; i++) {
			this.RunTestSuite (i);
		}
	},
	
	RunTestSuite : function (index)
	{
		var testSuite = this.testSuites[index];
		var testSuiteName = testSuite.GetName ();
		if (this.runOnlySuite != null && this.runOnlySuite != testSuiteName) {	
			return;
		}
		
		var i;
		for (i = 0; i < testSuite.TestCount (); i++) {
			this.RunTest (index, i);
		}
	},

	RunTest : function (suiteIndex, testIndex)
	{
		var testSuite = this.testSuites[suiteIndex];
		var testSuiteName = testSuite.GetName ();
		
		var test = testSuite.GetTest (testIndex);
		var testName = test.GetName ();
		if (this.runOnlyTest != null && this.runOnlyTest != testName) {	
			return;
		}
		
		var indexSpan = document.createElement ('span');
		var currentLocation = window.location.href.split("#")[0];
		indexSpan.innerHTML = '<a href="' + currentLocation + '">' + (this.index + 1) + '</a>';

		var suiteSpan = document.createElement ('span');
		suiteSpan.innerHTML = '<a href="' + currentLocation + '#' + testSuiteName + '">' + testSuiteName + '</a>';

		var nameSpan = document.createElement ('span');
		nameSpan.innerHTML = '<a href="' + currentLocation + '#' + testSuiteName + '@' + testName + '">' + testName + '</a>';

		var invalidTest = false;
		try {
			test.Run ();
		} catch (e) {
			invalidTest = true;
		}
		
		var i;
		var allSucceeded = true;
		var resultValues = test.GetResult ();
		for (i = 0; i < resultValues.length; i++) {
			if (!resultValues[i]) {
				allSucceeded = false;
				break;
			}
		}
		
		var resultSpan = document.createElement ('span');
		if (invalidTest) {
			var succeededSpan = document.createElement ('span');
			succeededSpan.className = 'failedspan';
			succeededSpan.innerHTML = 'invalid';
			resultSpan.appendChild (succeededSpan);
		} else if (allSucceeded) {
			var succeededSpan = document.createElement ('span');
			succeededSpan.className = 'passedspan';
			succeededSpan.innerHTML = 'passed';
			resultSpan.appendChild (succeededSpan);
		} else {
			var succeededSpan = document.createElement ('span');
			succeededSpan.className = 'failedspan';
			succeededSpan.innerHTML = 'failed - ';
			resultSpan.appendChild (succeededSpan);

			var assertSpan = document.createElement ('span');
			for (i = 0; i < resultValues.length; i++) {
				if (resultValues[i]) {
					assertSpan.innerHTML += '<span class="passedspan">' + (i + 1) + '</span> ';
				} else {
					assertSpan.innerHTML += '<span class="failedspan">' + (i + 1) + '</span> ';
				}
			}			
			
			resultSpan.appendChild (assertSpan);
		}
		
		this.table.AddRow (this.GetRow ([indexSpan, suiteSpan, nameSpan, resultSpan]));
		this.index = this.index + 1;
	},	
	
	CalculateRunOnlyTest : function ()
	{
		this.runOnlySuite = null;
		this.runOnlyTest = null;

		var fullHash = window.location.hash;
		if (fullHash.length == 0) {
			return;
		}
		
		var hash = fullHash.substr (1);
		if (hash.length == 0) {
			return;
		}
		
		if (hash.search ('@') == -1) {
			this.runOnlySuite = hash;
		} else {
			var splitted = hash.split ('@');
			this.runOnlySuite = splitted[0];
			this.runOnlyTest = splitted[1];
		}
	},
	
	GetHeader : function (texts)
	{
		var row = new TableRow ('tableheader');
		var i, column;
		for (i = 0; i < texts.length; i++) {
			column = new TableColumn ();
			column.AddContentText (texts[i]);
			row.AddColumn (column)
		}
		return row;
	},

	GetRow : function (elems)
	{
		var row = new TableRow ('tablecontent');
		var i, column;
		for (i = 0; i < elems.length; i++) {
			column = new TableColumn ();
			column.AddContentElem (elems[i]);
			row.AddColumn (column)
		}
		return row;
	}
};

var testRunner = new TestRunner ();

var AddTestSuite = function (name)
{
	var testSuite = new TestSuite (name);
	testRunner.AddTestSuite (testSuite);
};

var AddTest = function (name, callback)
{
	var test = new Test (name, callback);
	testRunner.AddTestToLastSuite (test)
};
