JSM.ImportFileList = function ()
{
	this.originalList = null;
	this.descriptors = null;
	this.type = null;
};

JSM.ImportFileList.prototype.InitFromFiles = function (fileList)
{
	this.originalList = fileList;
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
	this.type = 'file';
};

JSM.ImportFileList.prototype.InitFromURLs = function (urlList)
{
	this.originalList = urlList;
	this.descriptors = [];
	var i, url, fileName, descriptor;
	for (i = 0; i < urlList.length; i++) {
		url = urlList[i];
		fileName = this.GetFileName (url);
		descriptor = {
			originalObject : url,
			originalFileName : fileName,
			fileName : fileName.toUpperCase (),
			extension : this.GetFileExtension (fileName)
		};
		this.descriptors.push (descriptor);
	}
	this.type = 'url';
};

JSM.ImportFileList.prototype.GetOriginalList = function (index)
{
	return this.originalList;
};

JSM.ImportFileList.prototype.GetFileName = function (fullFileName)
{
	var splitted = fullFileName.split ('/');
	if (splitted.length == 1) {
		splitted = fullFileName.split ('\\');
	}
	if (splitted.length === 0) {
		return '';
	}
	return splitted[splitted.length - 1];
};

JSM.ImportFileList.prototype.GetFileDescriptor = function (index)
{
	return this.descriptors[index];
};

JSM.ImportFileList.prototype.GetType = function (index)
{
	return this.type;
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
	var i, descriptor, currentFileName;
	for (i = 0; i < this.descriptors.length; i++) {
		descriptor = this.descriptors[i];
		currentFileName = this.GetFileName (fileName);
		if (descriptor.fileName == currentFileName.toUpperCase ()) {
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

JSM.ConvertImportFileListToJsonData = function (importFileList, callbacks)
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

	var loaderFunctions = null;
	var importType = importFileList.GetType ();
	if (importType == 'file') {
		loaderFunctions = {
			getArrayBuffer : JSM.GetArrayBufferFromFile,
			getStringBuffer : JSM.GetStringBufferFromFile,
			getStringBuffers : JSM.GetStringBuffersFromFileList
		};
	} else if (importType == 'url') {
		loaderFunctions = {
			getArrayBuffer : JSM.GetArrayBufferFromURL,
			getStringBuffer : JSM.GetStringBufferFromURL,
			getStringBuffers : JSM.GetStringBuffersFromURLList
		};
	}
	
	if (loaderFunctions === null) {
		OnError ();
		return;
	}
	
	try {
		if (mainFile.extension == '.3DS') {
			loaderFunctions.getArrayBuffer (mainFile.originalObject, function (arrayBuffer) {
				var jsonData = JSM.Convert3dsToJsonData (arrayBuffer);
				OnReady (fileNames, jsonData);
			});
		} else if (mainFile.extension == '.OBJ') {
			loaderFunctions.getStringBuffers (importFileList.GetOriginalList (), function (stringBuffers) {
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
			loaderFunctions.getArrayBuffer (mainFile.originalObject, function (arrayBuffer) {
				if (JSM.IsBinaryStlFile (arrayBuffer)) {
					var jsonData = JSM.ConvertStlToJsonData (arrayBuffer, null);
					OnReady (fileNames, jsonData);
				} else {
					loaderFunctions.getStringBuffer (mainFile.originalObject, function (stringBuffer) {
						var jsonData = JSM.ConvertStlToJsonData (null, stringBuffer);
						OnReady (fileNames, jsonData);
					});
				}
			});
		}
	} catch (exception) {
		OnError ();
		return;
	}
};

JSM.ConvertFileListToJsonData = function (fileList, callbacks)
{
	var importFileList = new JSM.ImportFileList ();
	importFileList.InitFromFiles (fileList);
	JSM.ConvertImportFileListToJsonData (importFileList, callbacks);
};

JSM.ConvertURLListToJsonData = function (urlList, callbacks)
{
	var importFileList = new JSM.ImportFileList ();
	importFileList.InitFromURLs (urlList);
	JSM.ConvertImportFileListToJsonData (importFileList, callbacks);
};
