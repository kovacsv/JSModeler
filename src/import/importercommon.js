JSM.ImportFileList = function ()
{
	this.descriptors = null;
};

JSM.ImportFileList.prototype.Init = function (fileList)
{
	this.descriptors = [];
	var i, file, descriptor;
	for (i = 0; i < fileList.length; i++) {
		file = fileList[i];
		descriptor = {
			originalObject : file,
			originalFileName : file.name,
			fileName : file.name.toUpperCase (),
			extension : this.GetFileExtension (file.name)
		};
		this.descriptors.push (descriptor);
	}
};

JSM.ImportFileList.prototype.GetFileDescriptor = function (index)
{
	return this.descriptors[index];
};

JSM.ImportFileList.prototype.GetMainFileIndex = function (extension)
{
	var i, descriptor;
	for (i = 0; i < this.descriptors.length; i++) {
		descriptor = this.descriptors[i];
		if (this.IsSupportedExtension (descriptor.extension)) {
			return i;
		}
	}
	return -1;
};

JSM.ImportFileList.prototype.GetFileIndexByName = function (fileName)
{
	var i, descriptor;
	for (i = 0; i < this.descriptors.length; i++) {
		descriptor = this.descriptors[i];
		if (descriptor.fileName == fileName.toUpperCase ()) {
			return i;
		}
	}
	return -1;
};

JSM.ImportFileList.prototype.IsSupportedExtension = function (extension)
{
	if (extension == '.3DS' || extension == '.OBJ' || extension == '.STL') {
		return true;
	}
	return false;
};

JSM.ImportFileList.prototype.GetFileExtension = function (fileName)
{
	var firstPoint = fileName.lastIndexOf ('.');
	if (firstPoint == -1) {
		return '';
	}
	
	var extension = fileName.substr (firstPoint);
	extension = extension.toUpperCase ();
	return extension;
};

JSM.ConvertFileListToJsonData = function (fileList, callbacks)
{
	function OnError ()
	{
		if (callbacks.onError !== undefined && callbacks.onError !== null) {
			callbacks.onError ();
		}
	}

	function OnReady (fileNames, jsonData)
	{
		if (callbacks.onReady !== undefined && callbacks.onReady !== null) {
			callbacks.onReady (fileNames, jsonData);
		}
	}	
	
	var importFileList = new JSM.ImportFileList ();
	importFileList.Init (fileList);
	
	var mainFileIndex = importFileList.GetMainFileIndex ();
	if (mainFileIndex === -1) {
		OnError ();
		return;
	}
	
	var mainFile = importFileList.GetFileDescriptor (mainFileIndex);
	var fileNames = {
		main : mainFile.originalFileName,
		requested : [],
		missing : []
	};

	if (mainFile.extension == '.3DS') {
		JSM.GetArrayBufferFromFile (mainFile.originalObject, function (arrayBuffer) {
			var jsonData = JSM.Convert3dsToJsonData (arrayBuffer);
			OnReady (fileNames, jsonData);
		});
	} else if (mainFile.extension == '.OBJ') {
		JSM.GetStringBuffersFromFileList (fileList, function (stringBuffers) {
			var mainFileBuffer = stringBuffers[mainFileIndex];
			var jsonData = JSM.ConvertObjToJsonData (mainFileBuffer, {
				onFileRequested : function (fileName) {
					var requestedFileIndex = importFileList.GetFileIndexByName (fileName);
					if (requestedFileIndex == -1) {
						fileNames.missing.push (fileName);
						return null;
					}
					fileNames.requested.push (fileName);
					return stringBuffers[requestedFileIndex];
				}
			});
			OnReady (fileNames, jsonData);
		});
	} else if (mainFile.extension == '.STL') {
		JSM.GetArrayBufferFromFile (mainFile.originalObject, function (arrayBuffer) {
			var jsonData = JSM.ConvertStlToJsonData (arrayBuffer);
			OnReady (fileNames, jsonData);
		});
	}
};
