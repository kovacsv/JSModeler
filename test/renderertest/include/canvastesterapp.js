CanvasTesterApp = function (canvas, tolerance, resultsDivName)
{
	this.resultsDiv = document.getElementById (resultsDivName);
	this.canvasTester = new CanvasTester (canvas, tolerance, this.TestFinished.bind (this), this.AllTestsFinished.bind (this));
	this.testResultDiv = document.createElement ('div');
	this.testResultDiv.className = 'testresult';
	this.resultsDiv.appendChild (this.testResultDiv);
};

CanvasTesterApp.prototype.AddTest = function (renderCallback, referenceImage)
{
	this.canvasTester.AddTest (renderCallback, referenceImage);
};

CanvasTesterApp.prototype.Run = function ()
{
	this.canvasTester.Run ();
};

CanvasTesterApp.prototype.AllTestsFinished = function (success)
{
	var allResultDiv = document.createElement ('div');
	allResultDiv.className = 'allresult ' + (success ? 'success' : 'failure');
	allResultDiv.innerHTML = (success ? 'success' : 'failure');
	this.resultsDiv.insertBefore (allResultDiv, this.resultsDiv.firstChild);
};

CanvasTesterApp.prototype.TestFinished = function (result, testObject, resultImageData, referenceImageData, differenceImageData)
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
	
	function AddResultLine (result, testObject, resultImageData, referenceImageData, differenceImageData, resultDiv, testResultDiv)
	{
		var resultTitle = document.createElement ('div');
		var success = (result == 0);
		var errorText = '';
		if (result === 0) {
			errorText = 'ok';
		} else if (result === 1) {
			errorText = 'missing reference';
		} else if (result === 2) {
			errorText = 'size mismatch';
		} else if (result === 3) {
			errorText = 'difference';
		}
		resultTitle.className = 'resulttitle ' + (success ? 'success' : 'failure');
		resultTitle.innerHTML = errorText;
		resultDiv.appendChild (resultTitle);
		
		resultTitle.onclick = function () {
			while (testResultDiv.lastChild) {
				testResultDiv.removeChild (testResultDiv.lastChild);
			}
			var titleDiv = document.createElement ('div');
			titleDiv.className = 'testresulttitle';
			titleDiv.innerHTML = testObject.referenceImage;
			testResultDiv.appendChild (titleDiv);
			
			var mainDiv = document.createElement ('div');
			mainDiv.className = 'testresultmain';
			DrawImageData (resultImageData, mainDiv);
			if (!success && referenceImageData !== null) {
				DrawImageData (referenceImageData, mainDiv);
			}
			if (!success && differenceImageData !== null) {
				DrawImageData (differenceImageData, mainDiv);
			}
			testResultDiv.appendChild (mainDiv);
			if (testResultDiv.style.display != 'block') {
				testResultDiv.style.display = 'block';
			}
			testObject.renderCallback (function () {});
		};
		
		resultDiv.appendChild (resultTitle);
	}

	AddResultLine (result, testObject, resultImageData, referenceImageData, differenceImageData, this.resultsDiv, this.testResultDiv);
};
