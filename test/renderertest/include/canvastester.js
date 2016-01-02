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
	
	onFinished (result, this, resultImageData, referenceImageData, differenceImageData);
};

CT.Tester = function (canvas, tolerance, testFinishedCallback, allTestsFinishedCallback)
{
	this.canvas = canvas;
	this.tolerance = tolerance;
	this.testFinishedCallback = testFinishedCallback;
	this.allTestsFinishedCallback = allTestsFinishedCallback;
	this.allSuccess = true;
	this.currentTest = 0;
	this.tests = [];
};

CT.Tester.prototype.AddTest = function (renderCallback, referenceImage)
{
	var test = new CT.Test (this.canvas, this.tolerance, renderCallback, referenceImage);
	this.tests.push (test);
};

CT.Tester.prototype.Run = function ()
{
	this.currentTest = 0;
	this.RunCurrentTest ();
};

CT.Tester.prototype.RunCurrentTest = function ()
{
	if (this.currentTest >= this.tests.length) {
		this.allTestsFinishedCallback (this.allSuccess);
		return;
	}
	
	var test = this.tests[this.currentTest];
	test.Run (this.TestFinished.bind (this));
};

CT.Tester.prototype.RunNextTest = function ()
{
	this.currentTest += 1;
	setTimeout (this.RunCurrentTest.bind (this), 0);
};

CT.Tester.prototype.TestFinished = function (result, testObject, resultImageData, referenceImageData, differenceImageData)
{
	if (result.status !== 0) {
		this.allSuccess = false;
	}
	this.testFinishedCallback (result, testObject, resultImageData, referenceImageData, differenceImageData);
	this.RunNextTest ();
};
