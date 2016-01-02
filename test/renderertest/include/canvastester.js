var CT = function ()
{
	this.mainVersion = 0;
	this.subVersion = 1;
};

CT.Test = function (canvas, tolerance, renderCallback, referenceImage)
{
	this.canvas = canvas;
	this.tolerance = tolerance;
	this.renderCallback = renderCallback;
	this.referenceImage = referenceImage;
};

CT.Test.prototype.Run = function (onFinished)
{
	var myThis = this;
	this.renderCallback (function () {
		function GetImageData (image, width, height)
		{
			var canvas = document.createElement ('canvas');
			canvas.width = width;
			canvas.height = height;
			var context = canvas.getContext ('2d');
			context.drawImage (image, 0, 0, width, height);
			return context.getImageData (0, 0, width, height);		
		}
		
		var resultImageData = GetImageData (myThis.canvas, myThis.canvas.width, myThis.canvas.height);
		var referenceImage = new Image ();
		referenceImage.src = myThis.referenceImage;
		referenceImage.onload = function () {
			var referenceImageData = GetImageData (referenceImage, referenceImage.width, referenceImage.height);
			myThis.EvaluateResult (resultImageData, referenceImageData, onFinished);
		};
		referenceImage.onerror = function () {
			var referenceImageData = null;
			myThis.EvaluateResult (resultImageData, referenceImageData, onFinished);
		};
	});
};

CT.Test.prototype.EvaluateResult = function (resultImageData, referenceImageData, onFinished)
{
	function CreateImageData (width, height)
	{
		var canvas = document.createElement ('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext ('2d');
		return context.createImageData (width, height);			
	}
	
	function GetMaxPixelDifference (imageData1, imageData2, index)
	{
		var result = 0;
		var i;
		for (i = 0; i < 4; i++) {
			result = Math.max (result, Math.abs (imageData1.data[index + i] - imageData2.data[index + i]));
		}
		return result;
	}

	var result = {
		status : 0,
		differentPixels : 0,
		maxPixelDifference : 0
	};
	
	var differenceImageData = null;
	if (referenceImageData === null) {
		result.status = 1;
	} else {
		if (resultImageData.data.length != referenceImageData.data.length) {
			result.status = 2;
		} else {
			differenceImageData = CreateImageData (referenceImageData.width, referenceImageData.height);
			var i, difference;
			for (i = 0; i < resultImageData.data.length; i += 4) {
				difference = GetMaxPixelDifference (referenceImageData, resultImageData, i);
				result.maxPixelDifference = Math.max (result.maxPixelDifference, difference);
				if (difference <= this.tolerance) {
					differenceImageData.data[i + 0] = referenceImageData.data[i + 0];
					differenceImageData.data[i + 1] = referenceImageData.data[i + 1];
					differenceImageData.data[i + 2] = referenceImageData.data[i + 2];
					differenceImageData.data[i + 3] = 64;
				} else {
					differenceImageData.data[i + 0] = 255;
					differenceImageData.data[i + 1] = 0;
					differenceImageData.data[i + 2] = 0;
					differenceImageData.data[i + 3] = 255;
					result.status = 3;
					result.differentPixels += 1;
				}
			}
		}
	}

	onFinished (this, result, resultImageData, referenceImageData, differenceImageData);
};

CT.TestSuite = function (name, canvas, tolerance, callbacks)
{
	this.name = name;
	this.canvas = canvas;
	this.tolerance = tolerance;
	this.callbacks = callbacks;
	this.allSucceded = true;
	this.currentTest = 0;
	this.tests = [];
};

CT.TestSuite.prototype.AddTest = function (renderCallback, referenceImage)
{
	var test = new CT.Test (this.canvas, this.tolerance, renderCallback, referenceImage);
	this.tests.push (test);
};

CT.TestSuite.prototype.Run = function ()
{
	this.currentTest = 0;
	this.SuiteStarted ();
	this.RunCurrentTest ();
};

CT.TestSuite.prototype.GetName = function ()
{
	return this.name;
};

CT.TestSuite.prototype.IsSucceeded = function ()
{
	return this.allSucceded;
};

CT.TestSuite.prototype.RunCurrentTest = function ()
{
	if (this.currentTest >= this.tests.length) {
		this.SuiteFinished ();
		return;
	}
	
	var test = this.tests[this.currentTest];
	test.Run (this.TestFinished.bind (this));
};

CT.TestSuite.prototype.RunNextTest = function ()
{
	this.currentTest += 1;
	setTimeout (this.RunCurrentTest.bind (this), 0);
};

CT.TestSuite.prototype.SuiteStarted = function ()
{
	this.callbacks.suiteStarted (this);
};

CT.TestSuite.prototype.SuiteFinished = function ()
{
	this.callbacks.suiteFinished (this);
};

CT.TestSuite.prototype.TestFinished = function (test, result, resultImageData, referenceImageData, differenceImageData)
{
	if (result.status !== 0) {
		this.allSucceded = false;
	}
	this.callbacks.testFinished (test, result, resultImageData, referenceImageData, differenceImageData);
	this.RunNextTest ();
};

CT.Tester = function (canvas, tolerance, callbacks)
{
	this.canvas = canvas;
	this.tolerance = tolerance;
	this.callbacks = callbacks;
	var currentSuite = 0;
	this.suites = [];
};

CT.Tester.prototype.AddTestSuite = function (name)
{
	var suite = new CT.TestSuite (name, this.canvas, this.tolerance, {
		suiteStarted : this.SuiteStarted.bind (this),
		testFinished : this.TestFinished.bind (this),
		suiteFinished : this.SuiteFinished.bind (this)
	});
	this.suites.push (suite);
	return suite;
};

CT.Tester.prototype.AddTest = function (suite, renderCallback, referenceImage)
{
	suite.AddTest (renderCallback, referenceImage);
};

CT.Tester.prototype.Run = function ()
{
	this.currentSuite = 0;
	this.RunCurrentSuite ();
};

CT.Tester.prototype.RunCurrentSuite = function ()
{
	if (this.currentSuite >= this.suites.length) {
		return;
	}
	
	var suite = this.suites[this.currentSuite];
	suite.Run (this.SuiteFinished.bind (this));
};

CT.Tester.prototype.RunNextSuite = function ()
{
	this.currentSuite += 1;
	setTimeout (this.RunCurrentSuite.bind (this), 0);
};

CT.Tester.prototype.SuiteStarted = function (suite)
{
	this.callbacks.suiteStarted (suite);
};

CT.Tester.prototype.TestFinished = function (test, result, resultImageData, referenceImageData, differenceImageData)
{
	this.callbacks.testFinished (test, result, resultImageData, referenceImageData, differenceImageData);
};

CT.Tester.prototype.SuiteFinished = function (suite)
{
	this.callbacks.suiteFinished (suite);
	this.RunNextSuite ();
};
