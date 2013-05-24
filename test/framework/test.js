Table = function (className)
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

TableRow = function (className)
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

TableColumn = function (className)
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
	}
};

Test = function (name, callback)
{
	this.name = name || null;
	this.callback = callback || null;
	this.resultValues = null;
	this.testDiv = null;
};

Test.prototype =
{
	Run : function (table)
	{
		this.Start (table);
		this.callback (this);
		this.End (table);
	},

	Start : function (table)
	{
		this.resultValues = [];
	},
	
	End : function (table)
	{
		var i;
		var allSucceeded = true;
		for (i = 0; i < this.resultValues.length; i++) {
			if (!this.resultValues[i]) {
				allSucceeded = false;
				break;
			}
		}
		
		var result = '';
		
		var nameSpan = document.createElement ('span');
		nameSpan.innerHTML = this.name;

		var resultSpan = document.createElement ('span');
		if (allSucceeded) {
			var succeededImage = document.createElement ('img');
			succeededImage.src = 'framework/succeeded.gif';
			succeededImage.className = 'resultimg';
			resultSpan.appendChild (succeededImage);
		} else {
			var succeededImage = document.createElement ('img');
			succeededImage.src = 'framework/failed.gif';
			succeededImage.className = 'resultimg';
			resultSpan.appendChild (succeededImage);

			var assertSpan = document.createElement ('span');
			for (i = 0; i < this.resultValues.length; i++) {
				if (this.resultValues[i]) {
					assertSpan.innerHTML += '<span class="assertsucceededspan">' + (i + 1) + '</span> ';
				} else {
					assertSpan.innerHTML += '<span class="assertfailedspan">' + (i + 1) + '</span> ';
				}
			}			
			
			resultSpan.appendChild (assertSpan);
		}

		table.AddRow (this.GetRow ([nameSpan, resultSpan]));
	},

	GetRow : function (elems)
	{
		var row = new TableRow ();
		var i, column;
		for (i = 0; i < elems.length; i++) {
			column = new TableColumn ();
			column.AddContentElem (elems[i]);
			row.AddColumn (column)
		}
		return row;
	},

	Assert : function (condition)
	{
		this.resultValues.push (condition);
	}
}

TestSuite = function ()
{
	this.tests = [];
	this.table = null;
	var myThis = this;
	
	if (window.addEventListener) {
		window.addEventListener ('load', function () {myThis.Run ()});
	} else if (window.attachEvent) {
		window.attachEvent ('onload', function () {myThis.Run ()});
	}
};

TestSuite.prototype =
{
	AddTest : function (test)
	{
		this.tests.push (test);
	},
	
	Run : function ()
	{
		this.Start ();
		this.RunTests ();
		this.End ();
	},

	Start : function ()
	{
		this.table = new Table ('testtable');
		this.table.AddRow (this.GetHeader (['name', 'result']));
	},
	
	End : function ()
	{
		this.table.Place (document.body);				
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
	
	RunTests : function ()
	{
		var i;
		for (i = 0; i < this.tests.length; i++) {
			this.tests[i].Run (this.table);
		}
	}
}

testSuite = new TestSuite ();

AddTest = function (name, callback)
{
	var test = new Test (name, callback);
	testSuite.AddTest (test)
};
