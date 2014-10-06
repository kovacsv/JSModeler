ImporterApp = function ()
{
	this.viewer = null;
	this.fileNames = null;
	this.inGenerate = false;
	this.dialog = null;
};

ImporterApp.prototype.Init = function ()
{
	var myThis = this;
	var top = document.getElementById ('top');
	var importerButtons = new ImporterButtons (top);
	importerButtons.AddButton ('images/openfile.png', 'Open File', function () { myThis.OpenFile (); });
	importerButtons.AddButton ('images/fitinwindow.png', 'Fit In Window', function () { myThis.FitInWindow (); });
	importerButtons.AddButton ('images/fixup.png', 'Enable/Disable Fixed Up Vector', function () { myThis.SetFixUp (); });
	importerButtons.AddButton ('images/top.png', 'Set Up Vector (Z)', function () { myThis.SetNamedView ('z'); });
	importerButtons.AddButton ('images/bottom.png', 'Set Up Vector (-Z)', function () { myThis.SetNamedView ('-z'); });
	importerButtons.AddButton ('images/front.png', 'Set Up Vector (Y)', function () { myThis.SetNamedView ('y'); });
	importerButtons.AddButton ('images/back.png', 'Set Up Vector (-Y)', function () { myThis.SetNamedView ('-y'); });
	importerButtons.AddButton ('images/left.png', 'Set Up Vector (X)', function () { myThis.SetNamedView ('x'); });
	importerButtons.AddButton ('images/right.png', 'Set Up Vector (-X)', function () { myThis.SetNamedView ('-x'); });
	
	window.addEventListener ('resize', this.Resize.bind (this), false);
	this.Resize ();

	this.viewer = new ImporterViewer ();
	this.viewer.Init ('example');

	window.addEventListener ('dragover', this.DragOver.bind (this), false);
	window.addEventListener ('drop', this.Drop.bind (this), false);
	
	var fileInput = document.getElementById ('file');
	fileInput.addEventListener ('change', this.FileSelected.bind (this), false);
	
	// debug
	//JSM.GetArrayBufferFromURL ('cube.3ds', function (arrayBuffer) {
	//	myThis.viewer.Load3dsBuffer (arrayBuffer);
	//	myThis.fileNames = {
	//		main : 'cube.3ds',
	//		requested : [],
	//		missing : []
	//	};
	//	var menu = document.getElementById ('menu');
	//	var progressBar = new ImporterProgressBar (menu);		
	//	myThis.JsonLoaded (progressBar);
	//});
};

ImporterApp.prototype.Resize = function ()
{
	function SetWidth (elem, value)
	{
		elem.width = value;
		elem.style.width = value + 'px';
	}

	function SetHeight (elem, value)
	{
		elem.height = value;
		elem.style.height = value + 'px';
	}

	var top = document.getElementById ('top');
	var left = document.getElementById ('left');
	var canvas = document.getElementById ('example');
	var height = document.body.clientHeight - top.offsetHeight;

	SetHeight (canvas, 0);
	SetWidth (canvas, 0);

	SetHeight (left, height);

	SetHeight (canvas, height);
	SetWidth (canvas, document.body.clientWidth - left.offsetWidth);
	
	if (this.dialog !== null) {
		this.dialog.Resize ();
	}
};

ImporterApp.prototype.JsonLoaded = function (progressBar)
{
	var jsonData = this.viewer.GetJsonData ();
	this.meshVisibility = {};
	var i;
	for (i = 0; i < jsonData.meshes.length; i++) {
		this.meshVisibility[i] = true;
	}

	this.Generate (progressBar);
};

ImporterApp.prototype.GenerateMenu = function ()
{
	function AddDefaultGroup (menu, name)
	{
		var group = menu.AddGroup (name, {
			openCloseButton : {
				visible : false,
				open : 'images/opened.png',
				close : 'images/closed.png',
				title : 'Show/Hide ' + name
			}
		});
		return group;
	}

	function AddMaterial (importerMenu, material)
	{
		importerMenu.AddSubItem (materialsGroup, material.name, {
			openCloseButton : {
				visible : false,
				open : 'images/info.png',
				close : 'images/info.png',
				onOpen : function (content, material) {
					var table = new InfoTable (content);
					table.AddColorRow ('Ambient', material.ambient);
					table.AddColorRow ('Diffuse', material.diffuse);
					table.AddColorRow ('Specular', material.specular);
					table.AddRow ('Opacity', material.opacity.toFixed (2));
				},
				title : 'Show/Hide Information',
				userData : material
			}
		});
	}

	function AddMesh (importerApp, importerMenu, mesh, meshIndex)
	{
		importerMenu.AddSubItem (meshesGroup, mesh.name, {
			openCloseButton : {
				visible : false,
				open : 'images/info.png',
				close : 'images/info.png',
				onOpen : function (content, mesh) {
					function GetVisibleName (name)
					{
						if (name == 'vertexCount') {
							return 'Vertex count';
						} else if (name == 'triangleCount') {
							return 'Triangle count';
						}
						return name;
					}

					var table = new InfoTable (content);
					var i, additionalInfo;
					for (i = 0; i < mesh.additionalInfo.length; i++) {
						additionalInfo = mesh.additionalInfo[i];
						table.AddRow (GetVisibleName (additionalInfo.name), additionalInfo.value);
					}
				},
				title : 'Show/Hide Information',
				userData : mesh
			},
			userButton : {
				visible : true,
				onCreate : function (image) {
					image.src = 'images/visible.png';
				},
				onClick : function (image, meshIndex) {
					var visible = importerApp.ShowHideMesh (meshIndex);
					image.src = visible ? 'images/visible.png' : 'images/hidden.png';
				},
				title : 'Show/Hide Mesh',
				userData : meshIndex
			}
		});
	}
	
	var jsonData = this.viewer.GetJsonData ();
	var menu = document.getElementById ('menu');
	var importerMenu = new ImporterMenu (menu);

	var filesGroup = AddDefaultGroup (importerMenu, 'Files');
	importerMenu.AddSubItem (filesGroup, this.fileNames.main);
	var i;
	for (i = 0; i < this.fileNames.requested.length; i++) {
		importerMenu.AddSubItem (filesGroup, this.fileNames.requested[i]);
	}
	
	if (this.fileNames.missing.length > 0) {
		var missingFilesGroup = AddDefaultGroup (importerMenu, 'Missing Files');
		for (i = 0; i < this.fileNames.missing.length; i++) {
			importerMenu.AddSubItem (missingFilesGroup, this.fileNames.missing[i]);
		}
	}
	
	var materialsGroup = AddDefaultGroup (importerMenu, 'Materials');
	var material;
	for (i = 0; i < jsonData.materials.length; i++) {
		material = jsonData.materials[i];
		AddMaterial (importerMenu, material);
	}
	
	var meshesGroup = AddDefaultGroup (importerMenu, 'Meshes');
	var mesh;
	for (i = 0; i < jsonData.meshes.length; i++) {
		mesh = jsonData.meshes[i];
		AddMesh (this, importerMenu, mesh, i);
	}
};

ImporterApp.prototype.GenerateError = function (errorMessage)
{
	this.viewer.RemoveMeshes ();
	var menu = document.getElementById ('menu');
	while (menu.lastChild) {
		menu.removeChild (menu.lastChild);
	}
	
	this.dialog = new FloatingDialog ();
	this.dialog.Open ({
		title : 'Error',
		text : errorMessage,
		buttons : [
			{
				text : 'ok',
				callback : function (dialog) {
					dialog.Close ();
				}
			}
		]
	});	
};

ImporterApp.prototype.Generate = function (progressBar)
{
	var jsonData = this.viewer.GetJsonData ();
	if (jsonData.materials.length === 0 || jsonData.meshes.length === 0) {
		this.GenerateError ('Failed to load file. Maybe something is wrong with your file.');
		return;
	}

	var myThis = this;
	myThis.inGenerate = true;
	var environment = new JSM.AsyncEnvironment ({
		onStart : function (taskCount) {
			progressBar.Init (taskCount);
		},
		onProcess : function (currentTask) {
			progressBar.Step (currentTask + 1);
		},
		onFinish : function () {
			myThis.FitInWindow ();
			myThis.GenerateMenu ();
			myThis.inGenerate = false;
		}
	});
	
	this.viewer.ShowAllMeshes (environment);
};

ImporterApp.prototype.FitInWindow = function ()
{
	this.viewer.FitInWindow ();
};

ImporterApp.prototype.SetFixUp = function ()
{
	this.viewer.SetFixUp ();
};

ImporterApp.prototype.SetNamedView = function (viewName)
{
	this.viewer.SetNamedView (viewName);
};

ImporterApp.prototype.SetView = function (viewType)
{
	this.viewer.SetView (viewType);
};

ImporterApp.prototype.ShowHideMesh = function (meshIndex)
{
	this.meshVisibility[meshIndex] = !this.meshVisibility[meshIndex];
	if (this.meshVisibility[meshIndex]) {
		this.viewer.ShowMesh (meshIndex);
	} else {
		this.viewer.HideMesh (meshIndex);
	}
	return this.meshVisibility[meshIndex];
};

ImporterApp.prototype.ProcessFiles = function (fileList)
{
	function GetFileNamesFromFileList ()
	{
		var result = [];
		var i;
		for (i = 0; i < userFiles.length; i++) {
			result.push (userFiles[i].name);
		}
		return result;
	}

	function GetFileIndexFromFileNames (fileName, fileNames)
	{
		var i;
		for (i = 0; i < fileNames.length; i++) {
			if (fileName == fileNames[i]) {
				return i;
			}
		}
		return -1;
	}

	function GetFileExtension (fileName)
	{
		var firstPoint = fileName.lastIndexOf ('.');
		if (firstPoint == -1) {
			return null;
		}
		var extension = fileName.substr (firstPoint);
		extension = extension.toUpperCase ();
		return extension;
	}
	
	function GetMainFileIndexFromFileNames (fileNames)
	{
		var i, fileName, extension;
		for (i = 0; i < fileNames.length; i++) {
			fileName = fileNames[i];
			extension = GetFileExtension (fileName);
			if (extension === null) {
				continue;
			}
			if (extension == '.3DS' || extension == '.OBJ' || extension == '.STL') {
				return i;
			}
		}
		return -1;
	}

	function Load3ds (importerApp, arrayBuffer, progressBar)
	{
		importerApp.viewer.Load3dsBuffer (arrayBuffer);
		importerApp.JsonLoaded (progressBar);	
	}
	
	function LoadObj (importerApp, mainFileName, fileNameList, stringBuffers, progressBar)
	{
		var mainFileBufferIndex = GetFileIndexFromFileNames (mainFileName, fileNameList);
		if (mainFileBuffer == -1) {
			return;
		}

		var mainFileBuffer = stringBuffers[mainFileBufferIndex];
		if (mainFileBuffer === undefined) {
			return;
		}
		
		importerApp.viewer.LoadObjBuffer (mainFileBuffer.resultBuffer, function (fileName) {
			function GetLastName (fileName)
			{
				var separatorIndex = fileName.lastIndexOf ('/');
				if (separatorIndex == -1) {
					separatorIndex = fileName.lastIndexOf ('\\');
				}
				if (separatorIndex == -1) {
					return fileName;
				}
				return fileName.substr (separatorIndex + 1);
			}

			lastName = GetLastName (fileName);
			var requestedFileIndex = GetFileIndexFromFileNames (lastName, fileNameList);
			if (requestedFileIndex == -1) {
				importerApp.fileNames.missing.push (lastName);
				return null;
			}
			var requestedBuffer = stringBuffers[requestedFileIndex];
			importerApp.fileNames.requested.push (requestedBuffer.originalObject.name);
			return requestedBuffer.resultBuffer;
		});
		importerApp.JsonLoaded (progressBar);
	}

	function LoadStl (importerApp, arrayBuffer, progressBar)
	{
		importerApp.viewer.LoadStlBuffer (arrayBuffer);
		importerApp.JsonLoaded (progressBar);	
	}
	
	if (this.inGenerate) {
		return;
	}
	
	var userFiles = fileList;
	if (userFiles.length === 0) {
		return;
	}
	
	this.fileNames = {
		main : null,
		requested : [],
		missing : []
	};
	
	var fileNameList = GetFileNamesFromFileList (userFiles);
	var mainFileIndex = GetMainFileIndexFromFileNames (fileNameList);
	if (mainFileIndex == -1) {
		this.GenerateError ('No readable file found. You can view 3ds, obj and stl files.');
		return;
	}
	
	var mainFile = userFiles[mainFileIndex];
	var mainFileName = mainFile.name;
	var extension = GetFileExtension (mainFile.name);
	this.fileNames.main = mainFile.name;
	
	var menu = document.getElementById ('menu');
	var progressBar = new ImporterProgressBar (menu);

	var myThis = this;
	if (extension == '.3DS') {
		JSM.GetArrayBufferFromFile (mainFile, function (arrayBuffer) {
			Load3ds (myThis, arrayBuffer, progressBar);
		});
	} else if (extension == '.OBJ') {
		JSM.GetStringBuffersFromFileList (userFiles, function (stringBuffers) {
			LoadObj (myThis, mainFileName, fileNameList, stringBuffers, progressBar);
		});
	} else if (extension == '.STL') {
		JSM.GetArrayBufferFromFile (mainFile, function (arrayBuffer) {
			LoadStl (myThis, arrayBuffer, progressBar);
		});
	}
};

ImporterApp.prototype.DragOver = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	event.dataTransfer.dropEffect = 'copy';
};

ImporterApp.prototype.Drop = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	this.ProcessFiles (event.dataTransfer.files);
};

ImporterApp.prototype.FileSelected = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	this.ProcessFiles (event.target.files);
};

ImporterApp.prototype.OpenFile = function ()
{
	var fileInput = document.getElementById('file');
	fileInput.click ();
};

window.onload = function ()
{
	var importerApp = new ImporterApp ();
	importerApp.Init ();
};
