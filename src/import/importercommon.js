JSM.ImportFileList = function ()
{
	this.originalList = null;
	this.descriptors = null;
	this.isFile = null;
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
	this.isFile = true;
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
	this.isFile = false;
};

JSM.ImportFileList.prototype.GetOriginalList = function ()
{
	return this.originalList;
};

JSM.ImportFileList.prototype.GetInputList = function ()
{
	function IsArrayBuffer (descriptor)
	{
		if (descriptor.extension == '.OBJ' || descriptor.extension == '.MTL') {
			return false;
		}
		return true;
	}

	var result = [];
	var i, descriptor, inputListElem;
	for (i = 0; i < this.descriptors.length; i++) {
		descriptor = this.descriptors[i];
		inputListElem = {
			originalObject : descriptor.originalObject,
			isFile : this.IsFile (),
			isArrayBuffer : IsArrayBuffer (descriptor)
		};
		result.push (inputListElem);
	}
	return result;
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

JSM.ImportFileList.prototype.IsFile = function ()
{
	return this.isFile;
};

JSM.ImportFileList.prototype.GetMainFileIndex = function ()
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
	
	function FileRequested (importFileList, resultBuffers, fileName, fileNames)
	{
		var requestedFileIndex = importFileList.GetFileIndexByName (fileName);
		var currentFileName = importFileList.GetFileName (fileName);
		if (requestedFileIndex == -1) {
			fileNames.missing.push (currentFileName);
			return null;
		}
		if (fileNames.requested.indexOf (currentFileName) == -1) {
			fileNames.requested.push (currentFileName);
		}
		return resultBuffers[requestedFileIndex];	
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

	var inputList = importFileList.GetInputList ();
	try {
		if (mainFile.extension == '.3DS') {
			JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
				var mainFileBuffer = resultBuffers[mainFileIndex];
				var jsonData = JSM.Convert3dsToJsonData (mainFileBuffer, {
					onFileRequested : function (fileName) {
						return FileRequested (importFileList, resultBuffers, fileName, fileNames);
					}
				});
				OnReady (fileNames, jsonData);
			});
		} else if (mainFile.extension == '.OBJ') {
			JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
				var mainFileBuffer = resultBuffers[mainFileIndex];
				var jsonData = JSM.ConvertObjToJsonData (mainFileBuffer, {
					onFileRequested : function (fileName) {
						return FileRequested (importFileList, resultBuffers, fileName, fileNames);
					}
				});
				OnReady (fileNames, jsonData);
			});
		} else if (mainFile.extension == '.STL') {
			JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
				var mainFileBuffer = resultBuffers[mainFileIndex];
				if (JSM.IsBinaryStlFile (mainFileBuffer)) {
					var jsonData = JSM.ConvertStlToJsonData (mainFileBuffer, null);
					OnReady (fileNames, jsonData);
				} else {
					var i;
					for (i = 0; i < inputList.length; i++) {
						inputList[i].isArrayBuffer = false;
					}
					JSM.LoadMultipleBuffers (inputList, function (resultBuffers) {
						var mainFileBuffer = resultBuffers[mainFileIndex];
						var jsonData = JSM.ConvertStlToJsonData (null, mainFileBuffer);
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
