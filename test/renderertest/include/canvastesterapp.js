CanvasTesterApp = function (canvas, tolerance, resultsDivName)
{
	this.resultsDiv = document.getElementById (resultsDivName);
	this.canvasTester = new CT.Tester (canvas, tolerance, this.TestFinished.bind (this), this.AllTestsFinished.bind (this));
	this.testResultDiv = document.createElement ('div');
	this.testResultDiv.className = 'testresult';
	this.resultsDiv.appendChild (this.testResultDiv);
	this.allResultDiv = document.createElement ('div');
	this.allResultDiv.className = 'resultbox success';
	this.allResultDiv.innerHTML = 'processing...';
	this.resultsDiv.appendChild (this.allResultDiv);
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
	this.allResultDiv.className = 'resultbox ' + (success ? 'success' : 'failure');
	this.allResultDiv.innerHTML = (success ? 'success' : 'failure');
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
		var resultBox = document.createElement ('div');
		var success = (result.status == 0);
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
		resultBox.className = 'resultbox left link ' + (success ? 'success' : 'failure');
		resultBox.innerHTML = errorText;
		resultDiv.appendChild (resultBox);
		
		resultBox.onclick = function () {
			while (testResultDiv.lastChild) {
				testResultDiv.removeChild (testResultDiv.lastChild);
			}
			var titleDiv = document.createElement ('div');
			titleDiv.className = 'testresulttitle';
			titleDiv.innerHTML = testObject.referenceImage;
			testResultDiv.appendChild (titleDiv);
			
			var infoDiv = document.createElement ('div');
			infoDiv.className = 'testresultinfo';
			var infoContent = '';
			infoContent += 'Different pixels: ' + result.differentPixels + '<br>';
			infoContent += 'Max pixel difference: ' + result.maxPixelDifference;
			infoDiv.innerHTML = infoContent;
			testResultDiv.appendChild (infoDiv);

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
		
		resultDiv.appendChild (resultBox);
	}

	AddResultLine (result, testObject, resultImageData, referenceImageData, differenceImageData, this.resultsDiv, this.testResultDiv);
};
