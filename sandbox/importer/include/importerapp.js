ImporterApp = function ()
{
	this.viewer = null;
	this.userFiles = null;
	this.mainFile = null;
	this.requestedFiles = null;
	this.meshVisibility = null;
};

ImporterApp.prototype.Init = function ()
{
	window.onresize = this.Resize.bind (this);
	this.Resize ();

	this.viewer = new ImporterViewer ();
	this.viewer.Init ('example');

	window.addEventListener ('dragover', this.DragOver.bind (this), false);
	window.addEventListener ('drop', this.Drop.bind (this), false);
	
	// debug
	var myThis = this;
	JSM.GetArrayBufferFromURL ('cube.3ds', function (arrayBuffer) {
		myThis.viewer.Load3dsBuffer (arrayBuffer);
		myThis.mainFile = {name : 'cube.3ds'};
		myThis.requestedFiles = [];
		myThis.missingFiles = [];
		myThis.JsonLoaded ();
	});
};

ImporterApp.prototype.Resize = function ()
{
	var left = document.getElementById ('left');
	var canvas = document.getElementById ('example');
	canvas.width = document.body.clientWidth - left.offsetWidth;
	canvas.height = document.body.clientHeight;
};

ImporterApp.prototype.JsonLoaded = function ()
{
	var jsonData = this.viewer.GetJsonData ();

	this.meshVisibility = {};
	var i;
	for (i = 0; i < jsonData.meshes.length; i++) {
		this.meshVisibility[i] = true;
	}

	this.GenerateMenu (jsonData, this);
	this.Generate ();
};

ImporterApp.prototype.GenerateMenu = function ()
{
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
	while (menu.lastChild) {
		menu.removeChild (menu.lastChild);
	}

	var importerMenu = new ImporterMenu (menu);

	var filesGroup = importerMenu.AddGroup ('Files', {
		openCloseButton : {
			visible : true,
			open : 'images/opened.png',
			close : 'images/closed.png',
			title : 'Show/Hide Files'
		}
	});	
	
	importerMenu.AddSubItem (filesGroup, this.mainFile.name);
	var i;
	for (i = 0; i < this.requestedFiles.length; i++) {
		importerMenu.AddSubItem (filesGroup, this.requestedFiles[i].name);
	}
	
	if (this.missingFiles.length > 0) {
		var missingFilesGroup = importerMenu.AddGroup ('Missing Files', {
			openCloseButton : {
				visible : true,
				open : 'images/opened.png',
				close : 'images/closed.png',
				title : 'Show/Hide Missing Files'
			}
		});
		
		for (i = 0; i < this.missingFiles.length; i++) {
			importerMenu.AddSubItem (missingFilesGroup, this.missingFiles[i].name);
		}
	}
	
	var materialsGroup = importerMenu.AddGroup ('Materials', {
		openCloseButton : {
			visible : true,
			open : 'images/opened.png',
			close : 'images/closed.png',
			title : 'Show/Hide Materials'
		}
	});

	var i, material;
	for (i = 0; i < jsonData.materials.length; i++) {
		material = jsonData.materials[i];
		AddMaterial (importerMenu, material);
	}
	
	var meshesGroup = importerMenu.AddGroup ('Meshes', {
		openCloseButton : {
			visible : true,
			open : 'images/opened.png',
			close : 'images/closed.png',
			title : 'Show/Hide Meshes'			
		}
	});
	
	var mesh;
	for (i = 0; i < jsonData.meshes.length; i++) {
		mesh = jsonData.meshes[i];
		AddMesh (this, importerMenu, mesh, i);
	}
};

ImporterApp.prototype.Generate = function ()
{
	if (!this.viewer.ShowAllMeshes ()) {
		return;
	}

	this.viewer.FitInWindow ();
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
	
	this.userFiles = event.dataTransfer.files;
	if (this.userFiles.length === 0) {
		return;
	}
	
	this.mainFile = null;
	this.requestedFiles = [];
	this.missingFiles = [];

	var i, file, fileName, firstPoint, extension;
	for (i = 0; i < this.userFiles.length; i++) {
		file = this.userFiles[i];
		fileName = file.name;
		firstPoint = fileName.lastIndexOf ('.');
		if (firstPoint == -1) {
			continue;
		}
		extension = fileName.substr (firstPoint);
		extension = extension.toUpperCase ();
		if (extension == '.3DS' || extension == '.OBJ') {
			this.mainFile = file;
			break;
		}
	}
	
	if (this.mainFile === null) {
		return;
	}
	
	var myThis = this;
	if (extension == '.3DS') {
		JSM.GetArrayBufferFromFile (this.mainFile, function (arrayBuffer) {
			myThis.viewer.Load3dsBuffer (arrayBuffer);
			myThis.JsonLoaded ();
		});
	} else if (extension == '.OBJ') {
		JSM.GetStringBuffersFromFileList (this.userFiles, function (stringBuffers) {
			var fileNameToBuffer = {};
			var i, currentBuffer;
			for (i = 0; i < stringBuffers.length; i++) {
				currentBuffer = stringBuffers[i];
				fileNameToBuffer[currentBuffer.originalObject.name] = currentBuffer;
			}
			var mainFileBuffer = fileNameToBuffer[myThis.mainFile.name];
			if (mainFileBuffer === undefined) {
				return;
			}
			
			myThis.viewer.LoadObjBuffer (mainFileBuffer.resultBuffer, function (fileName) {
				var requestedBuffer = fileNameToBuffer[fileName];
				if (requestedBuffer === undefined) {
					myThis.missingFiles.push ({name : fileName});
					return null;
				}
				myThis.requestedFiles.push (requestedBuffer.originalObject);
				return requestedBuffer.resultBuffer;
			});
			myThis.JsonLoaded ();
		});		
	}
};

window.onload = function ()
{
	var importerApp = new ImporterApp ();
	importerApp.Init ();
};
