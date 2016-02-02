var fs = require ('fs');
var path = require ('path');

var Test = function (suite, name, callback)
{
	this.suite = suite;
	this.name = name;
	this.callback = callback;
};

Test.prototype.Open = function (url, onReady)
{
	function DisableFocusRectangle (page)
	{
		var links = page.evaluate (function () {
			return document.getElementsByTagName ('a');
		});
		
		var i, link;
		for (i = 0; i < links.length; i++) {
			link = links[i];
			link.style.outline = 'none';
		}
	}	
	
	var myThis = this;
	this.suite.page.open (this.suite.rootUrl + url, function () {
		myThis.Wait (1000);
		DisableFocusRectangle (myThis.suite.page);
		onReady ();
	});
};

Test.prototype.Run = function (onReady)
{
	this.callback (this, onReady);
};

Test.prototype.Click = function (x, y, wait)
{
	this.suite.page.sendEvent ('click', x, y, 'left', 0);
	this.Wait (wait);
};

Test.prototype.Move = function (x, y, wait)
{
	this.suite.page.sendEvent ('mousemove', x, y, null, 0);
	this.Wait (wait);
};

Test.prototype.MoveAndClick = function (x, y, wait)
{
	this.Move (x, y, wait);
	this.Click (x, y, wait);
};

Test.prototype.DragDrop = function (fromX, fromY, toX, toY, wait)
{
	this.suite.page.sendEvent ('mousedown', fromX, fromY, 'left', 0);
	this.Wait (wait);
	this.suite.page.sendEvent ('mousemove', toX, toY, 'left', 0);
	this.Wait (wait);
	this.suite.page.sendEvent ('mouseup', toX, toY, 'left', 0);
	this.Wait (wait);
};

Test.prototype.WriteString = function (text, wait)
{
	this.suite.page.sendEvent ('keypress', text);
	this.Wait (wait);
};

Test.prototype.WriteToForm = function (x, y, text, wait)
{
	this.Click (x, y, wait);

	var mod = this.suite.page.event.modifier.ctrl;
	this.suite.page.sendEvent ('keypress', this.suite.page.event.key.A, null, null, mod);	

	this.WriteString (text, wait);
};

Test.prototype.Wait = function (wait)
{
	slimer.wait (wait || 100);
};

Test.prototype.GenerateImage = function (stepName, number)
{
	var fileName = this.name + '_' + stepName;
	if (number !== undefined && number !== null) {
		var numberStr = number.toString ();
		while (numberStr.length < 3) {
			numberStr = '0' + numberStr;
		}
		fileName += '_' + numberStr;
	}
	var imagePath = fs.absolute (this.suite.resultFolderPath + '/' + fileName + '.png');
	console.log ('Generating: ' + fileName);
	this.suite.page.render (imagePath);
};

var Suite = function (rootUrl, resultFolderPath)
{
	this.rootUrl = rootUrl;
	this.resultFolderPath = resultFolderPath;
	
	this.page = require ('webpage').create ();;
	this.page.viewportSize = { width:1024, height:768 };
	this.onFinished = null;

	this.tests = [];
	this.current = null;
};

Suite.prototype.AddTest = function (name, callback)
{
	var test = new Test (this, name, callback);
	this.tests.push (test);	
}

Suite.prototype.Run = function (onFinished)
{
	this.onFinished = onFinished;

	this.current = 0;
	this.RunCurrentTest ();
}

Suite.prototype.RunCurrentTest = function ()
{
	if (this.current < this.tests.length) {
		var test = this.tests[this.current];
		console.log ('Running test: ' + test.name);
		test.Run (this.RunNextTest.bind (this));
	} else {
		this.onFinished ();
	}
}

Suite.prototype.RunNextTest = function ()
{
	this.current++;
	this.RunCurrentTest ();
}

module.exports = {
	Suite : Suite
};
