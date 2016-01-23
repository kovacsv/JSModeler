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
	this.suite.page.open (url, onReady);
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

Test.prototype.Wait = function (time)
{
	slimer.wait (time || 100);
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

var Suite = function (resultFolderPath)
{
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

if (phantom.args.length === 0) {
	console.log ('usage: slimerjs jsmodelertest.js <resultFolderPath>');
	phantom.exit ();
}

var suite = new Suite (phantom.args[0]);

suite.AddTest ('Demo', function (test, onReady) {
	test.Open ('../../documentation/demo/demonstration.html', function () {
		var shapeCoords = [114, 132, 152, 174, 192, 212, 232, 254, 272, 318, 338, 358, 376, 398, 416, 462, 482, 528];
		var buttonsX = 246;
		var settingsCoord = 16;
		var subdivisionCoord = 106;
		var shapesX = 34;
		var i;
		for (i = 0; i < shapeCoords.length; i++) {
			test.Click (shapesX, shapeCoords[i]);
			test.GenerateImage ('Shape', i + 1);
		}
		test.Click (shapesX, 152);
		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('CubeSettings');
		test.WriteToForm (470, 350, '1.0');
		test.WriteToForm (470, 384, '2.0');
		test.WriteToForm (470, 420, '3.0');
		test.Click (614, 460);
		test.GenerateImage ('ResizedCube');
		for (i = 0; i < 3; i++) {
			test.Click (buttonsX, subdivisionCoord);
			test.GenerateImage ('SubdividedCube', i + 1);
		}
		
		test.Click (shapesX, 318);	
		test.Click (buttonsX, 66);
		test.GenerateImage ('PrismInfo');
		test.Click (552, 434); // ok

		test.Move (buttonsX, 144);
		test.GenerateImage ('PrismExportButtons');
		test.Click (274, 144);
		test.GenerateImage ('PrismExportStl');
		test.Click (900, 20);
		
		test.Move (buttonsX, 186);
		test.GenerateImage ('PrismColorbuttons');
		test.Click (322, 186);
		test.GenerateImage ('PrismChangedToRed');

		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('PrismSettings', 1);
		
		var shapeCoords = [
			[310, 478],
			[278, 310],
			[433, 308],
			[458, 467],
			[369, 385]
		];
		
		for (i = 0; i < shapeCoords.length; i++) {
			test.MoveAndClick (shapeCoords[i][0], shapeCoords[i][1]);
		}
		test.MoveAndClick (shapeCoords[0][0], shapeCoords[0][1]);
		test.GenerateImage ('PrismSettings', 2);
		test.Click (782, 574); // ok
		test.GenerateImage ('ModifiedPrism');
		
		test.Click (shapesX, 338);
		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('PrismShellSettings', 1);
		
		for (i = 0; i < shapeCoords.length; i++) {
			test.MoveAndClick (shapeCoords[i][0], shapeCoords[i][1]);
		}
		test.MoveAndClick (shapeCoords[0][0], shapeCoords[0][1]);
		test.GenerateImage ('PrismShellSettings', 2);
		test.Click (782, 574); // ok
		test.GenerateImage ('ModifiedPrismShell');

		test.Click (shapesX, 358);
		test.Click (buttonsX, settingsCoord);
		test.GenerateImage ('LineShellSettings', 1);
		
		for (i = 0; i < shapeCoords.length; i++) {
			test.MoveAndClick (shapeCoords[i][0], shapeCoords[i][1]);
		}
		test.MoveAndClick (shapeCoords[shapeCoords.length - 1][0], shapeCoords[shapeCoords.length - 1][1]);
		test.GenerateImage ('LineShellSettings', 2);
		test.Click (782, 574); // ok
		test.GenerateImage ('ModifiedLineShell');
		
		onReady ();
	});
});

suite.Run (function () {
	slimer.exit ();
});
