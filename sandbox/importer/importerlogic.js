Importer = function ()
{
	this.viewer = null;
	this.callbacks = null;
};

Importer.prototype.Init = function (canvasName, callbacks)
{
	var viewerSettings = {
		cameraEyePosition : [8.0, 6.0, 4.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0, 0, 1],
		nearClippingPlane : 1.0,
		farClippingPlane : 100000
	};

	this.viewer = new JSM.ThreeViewer ();
	if (!this.viewer.Start (canvasName, viewerSettings)) {
		return false;
	}
	this.viewer.SetClearColor (0x222222);
	this.viewer.Draw ();
	
	window.addEventListener ('dragover', this.DragOver.bind (this), false);
	window.addEventListener ('drop', this.Drop.bind (this), false);
	
	this.callbacks = callbacks;
	return true;
};

Importer.prototype.DragOver = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	event.dataTransfer.dropEffect = 'copy';	
};
		
Importer.prototype.Drop = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	
	var files = event.dataTransfer.files;
	if (files.length == 0) {
		return;
	}
	
	this.LoadFile (files[0]);
};

Importer.prototype.LoadFile = function (file)
{
	var myThis = this;
	this.viewer.RemoveMeshes ();
	JSM.GetArrayBufferFromFile (file, function (arrayBuffer) {
		myThis.LoadModel (arrayBuffer);
	});		
};

Importer.prototype.LoadModel = function (arrayBuffer)
{
	var jsonData = JSM.Convert3dsToJsonData (arrayBuffer);
	if (this.callbacks.jsonLoaded !== undefined) {
		this.callbacks.jsonLoaded (jsonData);
	}
	
	var meshes = JSM.ConvertJSONDataToThreeMeshes (jsonData);
	for (var i = 0; i < meshes.length; i++) {
		this.viewer.AddMesh (meshes[i]);
	}
	
	this.viewer.FitInWindow ();
	this.viewer.Draw ();
};
