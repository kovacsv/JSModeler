JSM.TestCase = function (callback, name)
{
	this.callback = callback || null;
	this.name = name || null;
};

JSM.Test = function (resultDiv)
{
	this.result = document.getElementById (resultDiv);
	this.testCases = [];

	this.footerStyle = 'color : #000000; padding : 5px; clear : both;';
	this.testCaseStyle = 'color : #666666; background : #eeeeee; margin : 3px; padding : 5px; border : 1px solid #cccccc; border-radius : 5px; float : left;';
	this.successStyle = 'color : #009900;';
	this.failStyle = 'color : #990000;';

	this.failedCount = null;
	
	this.currentAssert = null;
	this.allAssertPassed = null;

	this.testCaseResult = null;
	this.testCaseAsserts = null;
};

JSM.Test.prototype =
{
	Run : function ()
	{
		this.Start ();
		var i;
		for (i = 0; i < this.testCases.length; i++) {
			this.RunOneTestByIndex (i);
		}
		this.End ();
	},
	
	RunOneTestByName : function (name)
	{
		var i, testCase;
		for (i = 0; i < this.testCases.length; i++) {
			testCase = this.testCases[i];
			if (testCase.name == name) {
				this.RunOneTestByIndex (i);
				break;
			}
		}
	},

	RunOneTestByIndex : function (index)
	{
		var testCase = this.testCases[index];
		if (testCase.callback == null) {
			return;
		}
		
		this.StartTestCase (testCase.name);
		testCase.callback (this);
		this.EndTestCase ();
	},
	
	AddTestCase : function (callback, name)
	{
		this.testCases.push (new JSM.TestCase (callback, name));
	},

	Assert : function (condition)
	{
		if (!condition) {
			if (this.allAssertPassed) {
				this.failedCount += 1;
			}
			this.allAssertPassed = false;
		}

		var style = condition ? this.successStyle : this.failStyle;
		this.testCaseAsserts += '<span style=\"' + style + '\">' + this.currentAssert + '</span> ';
		this.currentAssert++;
	},

	Start : function ()
	{
		this.result.innerHTML = '';
		this.failedCount = 0;
	},

	End : function ()
	{
		var result = '';
		result += '<div style="' + this.footerStyle + '">';
		result += 'Test set contains ' + this.testCases.length + ' tests. ';
		if (this.failedCount == 0) {
			result += 'All tests succeeded.';
		} else {
			result += this.failedCount + ' tests failed. ';
		}
		result += '</div>';
		
		this.result.innerHTML += result;
	},

	StartTestCase : function (testCaseName)
	{
		this.currentAssert = 1;
		this.allAssertPassed = true;

		this.testCaseResult = '';
		this.testCaseAsserts = '';

		var name = 'No Name';
		if (testCaseName !== undefined && testCaseName !== null) {
			name = testCaseName;
		}
		
		this.testCaseResult += '<span>' + name + '</span>';
	},
	
	EndTestCase : function ()
	{
		var result = '';
		
		result += '<div style=\"' + this.testCaseStyle + '\">';
		result += this.testCaseResult + ' (' + (this.currentAssert - 1) + ')';
		if (!this.allAssertPassed) {
			result += ': ' + this.testCaseAsserts;
		}
		result += '</div>';
		
		this.result.innerHTML += result;
	}
};
