CanvasTesterApp = function (canvas, tolerance, resultsDivName)
{
	this.resultsDiv = document.getElementById (resultsDivName);
	this.canvasTester = new CT.Tester (canvas, tolerance, {
		suiteStarted : this.SuiteStarted.bind (this),
		testFinished : this.TestFinished.bind (this),
		suiteFinished : this.SuiteFinished.bind (this)
	});
	this.suiteDivs = {
		title : null,
		testResults : null,
		detailedResults : null
	};
};

CanvasTesterApp.prototype.AddTestSuite = function (name)
{
	return this.canvasTester.AddTestSuite (name);
};

CanvasTesterApp.prototype.AddTest = function (suite, renderCallback, referenceImage)
{
	this.canvasTester.AddTest (suite, renderCallback, referenceImage);
};

CanvasTesterApp.prototype.Run = function ()
{
	this.canvasTester.Run ();
};

CanvasTesterApp.prototype.SuiteStarted = function (suiteObject)
{
	this.suiteDivs.title = document.createElement ('div');
	this.suiteDivs.title.className = 'resultbox suite success';
	this.suiteDivs.title.innerHTML = suiteObject.GetName () + ': processing...';
	this.resultsDiv.appendChild (this.suiteDivs.title);
	
	this.suiteDivs.detailedResults = document.createElement ('div');
	this.suiteDivs.detailedResults.className = 'testresult';
	this.resultsDiv.appendChild (this.suiteDivs.detailedResults);

	this.suiteDivs.testResults = document.createElement ('div');
	this.suiteDivs.testResults.className = 'suiteresultbox';
	this.resultsDiv.appendChild (this.suiteDivs.testResults);
};

CanvasTesterApp.prototype.SuiteFinished = function (suiteObject)
{
	var success = suiteObject.IsSucceeded ();
	this.suiteDivs.title.className = 'resultbox suite ' + (success ? 'success' : 'failure');
	this.suiteDivs.title.innerHTML = suiteObject.GetName () + ': ' + (success ? 'success' : 'failure');
};

CanvasTesterApp.prototype.TestFinished = function (testObject, result, resultImageData, referenceImageData, differenceImageData)
{
	function DrawImageData (imageData, parentDiv)
	{
		var canvas = document.createElement ('canvas');
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		var context = canvas.getContext ('2d');
		context.putImageData (imageData, 0, 0);
		parentDiv.appendChild (canvas);		
	}

	function AddResultLine (testObject, result, resultImageData, referenceImageData, differenceImageData, suiteDivs)
	{
		var testResults = suiteDivs.testResults;
		var detailedResults = suiteDivs.detailedResults;

		var resultBox = document.createElement ('div');
		var success = (result.status === 0);
		var errorText = '';
		if (result.status === 0) {
			errorText = 'ok';
		} else if (result.status === 1) {
			errorText = 'missing reference';
		} else if (result.status === 2) {
			errorText = 'size mismatch';
		} else if (result.status === 3) {
			errorText = 'difference';
		}
		resultBox.className = 'resultbox test link ' + (success ? 'success' : 'failure');
		resultBox.innerHTML = errorText;
		testResults.appendChild (resultBox);
		
		resultBox.onclick = function () {
			while (detailedResults.lastChild) {
				detailedResults.removeChild (detailedResults.lastChild);
			}
			var titleDiv = document.createElement ('div');
			titleDiv.className = 'testresulttitle';
			titleDiv.innerHTML = testObject.referenceImage;
			detailedResults.appendChild (titleDiv);
			
			var infoDiv = document.createElement ('div');
			infoDiv.className = 'testresultinfo';
			var infoContent = '';
			infoContent += 'Different pixels: ' + result.differentPixels + '<br>';
			infoContent += 'Max pixel difference: ' + result.maxPixelDifference;
			infoDiv.innerHTML = infoContent;
			detailedResults.appendChild (infoDiv);

			var mainDiv = document.createElement ('div');
			mainDiv.className = 'testresultmain';
			DrawImageData (resultImageData, mainDiv);
			if (!success && referenceImageData !== null) {
				DrawImageData (referenceImageData, mainDiv);
			}
			if (!success && differenceImageData !== null) {
				DrawImageData (differenceImageData, mainDiv);
			}
			detailedResults.appendChild (mainDiv);
			if (detailedResults.style.display != 'block') {
				detailedResults.style.display = 'block';
			}
			testObject.renderCallback (function () {});
		};
	}

	AddResultLine (testObject, result, resultImageData, referenceImageData, differenceImageData, this.suiteDivs);
};
