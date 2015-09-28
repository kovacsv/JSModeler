JSM.GetArrayBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function () {
		var arrayBuffer = request.response;
		if (arrayBuffer) {
			onReady (arrayBuffer);
		}
	};

	request.send (null);
};

JSM.GetArrayBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	};

	reader.readAsArrayBuffer (file);
};

JSM.GetStringBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'text';

	request.onload = function () {
		var stringBuffer = request.response;
		if (stringBuffer) {
			onReady (stringBuffer);
		}
	};

	request.send (null);
};

JSM.GetStringBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	};

	reader.readAsText (file);
};

JSM.LoadMultipleBuffersInternal = function (inputList, index, result, onReady)
{
	if (index >= inputList.length) {
		onReady (result);
		return;
	}
	
	var currentInput = inputList[index];
	var loaderFunction = null;
	if (currentInput.isFile) {
		if (currentInput.isArrayBuffer) {
			loaderFunction = JSM.GetArrayBufferFromFile;
		} else {
			loaderFunction = JSM.GetStringBufferFromFile;
		}
	} else {
		if (currentInput.isArrayBuffer) {
			loaderFunction = JSM.GetArrayBufferFromURL;
		} else {
			loaderFunction = JSM.GetStringBufferFromURL;
		}
	}
	
	loaderFunction (currentInput.originalObject, function (resultBuffer) {
		result.push (resultBuffer);
		JSM.LoadMultipleBuffersInternal (inputList, index + 1, result, onReady);
	});
};

JSM.LoadMultipleBuffers = function (inputList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffersInternal (inputList, 0, result, function (result) {
		onReady (result);
	});
};
