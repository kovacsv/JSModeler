JSM.GetArrayBufferFromURL = function (url, callbacks)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function () {
		var arrayBuffer = request.response;
		if (arrayBuffer && callbacks.onReady) {
			callbacks.onReady (arrayBuffer);
		}
	};
	
	request.onerror = function () {
		if (callbacks.onError) {
			callbacks.onError ();
		}
	};

	request.send (null);
};

JSM.GetArrayBufferFromFile = function (file, callbacks)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE && callbacks.onReady) {
			callbacks.onReady (event.target.result);
		}
	};
	
	reader.onerror = function () {
		if (callbacks.onError) {
			callbacks.onError ();
		}
	};

	reader.readAsArrayBuffer (file);
};

JSM.GetStringBufferFromURL = function (url, callbacks)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'text';

	request.onload = function () {
		var stringBuffer = request.response;
		if (stringBuffer && callbacks.onReady) {
			callbacks.onReady (stringBuffer);
		}
	};
	
	request.onerror = function () {
		if (callbacks.onError) {
			callbacks.onError ();
		}
	};

	request.send (null);
};

JSM.GetStringBufferFromFile = function (file, callbacks)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE && callbacks.onReady) {
			callbacks.onReady (event.target.result);
		}
	};

	reader.onerror = function () {
		if (callbacks.onError) {
			callbacks.onError ();
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
	
	loaderFunction (currentInput.originalObject, {
		onReady : function (resultBuffer) {
			result.push (resultBuffer);
			JSM.LoadMultipleBuffersInternal (inputList, index + 1, result, onReady);
		},
		onError : function () {
			result.push (null);
			JSM.LoadMultipleBuffersInternal (inputList, index + 1, result, onReady);
		}
	});
};

JSM.LoadMultipleBuffers = function (inputList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffersInternal (inputList, 0, result, function (result) {
		onReady (result);
	});
};
