CanvasTesterApp = function (canvas, resultsDivName)
{
	this.canvas = canvas;
	this.resultsDiv = document.getElementById (resultsDivName);
	this.canvasTester = new CanvasTester (canvas, this.TestFinished.bind (this), this.AllTestsFinished.bind (this));
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
	
	function AddResultLine (result, testObject, resultImageData, referenceImageData, differenceImageData, parentDiv)
	{
		var resultDiv = document.createElement ('div');
		
		var resultTitle = document.createElement ('div');
		var success = (result == 0);
		var errorText = '';
		if (result === 0) {
			errorText = 'success';
		} else if (result === 1) {
			errorText = 'missing reference';
		} else if (result === 2) {
			errorText = 'size mismatch';
		} else if (result === 3) {
			errorText = 'difference';
		}
		resultTitle.className = 'resulttitle ' + (success ? 'success' : 'failure');
		resultTitle.innerHTML = testObject.referenceImage + ' - ' + errorText;
		resultDiv.appendChild (resultTitle);
		
		var resultImages = document.createElement ('div');
		var resultImagesGenerated = false;
		resultImages.className = 'resultimages';
		resultDiv.appendChild (resultImages);

		resultTitle.onclick = function () {
			if (!resultImagesGenerated) {
				DrawImageData (resultImageData, resultImages);
				if (!success && referenceImageData !== null) {
					DrawImageData (referenceImageData, resultImages);
				}
				if (!success && differenceImageData !== null) {
					DrawImageData (differenceImageData, resultImages);
				}
				resultImagesGenerated = true;
			}
			if (resultImages.style.display != 'block') {
				resultImages.style.display = 'block';
				testObject.renderCallback (function () {});
			} else {
				resultImages.style.display = 'none';
			}
		};
		
		parentDiv.appendChild (resultDiv);
	}

	AddResultLine (result, testObject, resultImageData, referenceImageData, differenceImageData, this.resultsDiv);
};
