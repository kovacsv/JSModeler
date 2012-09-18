JSM.TestCase = function (callback, name)
{
	this.callback = callback || null;
	this.name = name || null;
};

JSM.Test = function (resultDiv)
{
	this.result = document.getElementById (resultDiv);
	this.testCases = [];

	this.basicStyle = 'color:#000000;';
	this.successStyle = 'color:#00aa00;';
	this.failStyle = 'color:#aa0000;';

	this.currentTest = null;
	this.allPassed = null;
};

JSM.Test.prototype =
{
	Run : function ()
	{
		for (var i = 0; i < this.testCases.length; i++) {
			testCase = this.testCases[i];
			if (testCase.callback == null) {
				continue;
			}
			
			this.currentTest = 1;
			this.allPassed = true;

			this.WriteName (testCase.name);
			testCase.callback (this);
	
			this.WriteTestCaseResult ();
		}
	},
	
	AddTestCase : function (callback, name)
	{
		this.testCases.push (new JSM.TestCase (callback, name));
	},

	Assert : function (condition)
	{
		if (!condition) {
			this.allPassed = false;
		}

		this.WriteTestCaseAssert (condition);
		this.currentTest++;
	},

	WriteName : function (string)
	{
		var style = this.basicStyle;
		var text = 'No Name';
		if (string != null) {
			text = string
		}
		
		this.Write ('<span style=\"' + style + '\">' + text + ':</span> ');
	},
	
	WriteTestCaseAssert : function (condition)
	{
		var style = condition ? this.successStyle : this.failStyle;
		this.Write ('<span style=\"' + style + '\">' + this.currentTest + '</span> ');
	},	

	WriteTestCaseResult : function ()
	{
		var style = this.allPassed ? this.successStyle : this.failStyle;
		var text = this.allPassed ? 'success' : 'fail';
		this.Write ('<span style=\"' + style + '\"> - ' + text + '</span><br>');
	},
	
	Write : function (string)
	{
		this.result.innerHTML += string;
	}
};
