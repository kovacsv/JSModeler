ImporterViewer = function ()
{
	this.viewer = null;
	this.jsonData = null;
};

ImporterViewer.prototype.Init = function (canvasName)
{
	var viewerSettings = {
		cameraEyePosition : [8.0, 6.0, 4.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0, 0, 1],
		nearClippingPlane : 10.0,
		farClippingPlane : 100000000
	};

	this.viewer = new JSM.ThreeViewer ();
	if (!this.viewer.Start (canvasName, viewerSettings)) {
		return false;
	}
	this.viewer.SetClearColor (0xdddddd);
	this.viewer.Draw ();
	
	return true;
};

ImporterViewer.prototype.Load3dsBuffer = function (arrayBuffer)
{
	this.jsonData = JSM.Convert3dsToJsonData (arrayBuffer);
};

ImporterViewer.prototype.LoadObjBuffer = function (stringBuffer, onFileRequested)
{
	this.jsonData = JSM.ConvertObjToJsonData (stringBuffer, {onFileRequested : onFileRequested});
};

ImporterViewer.prototype.GetJsonData = function ()
{
	return this.jsonData;
};

ImporterViewer.prototype.ShowAllMeshes = function (inEnvironment)
{
	this.viewer.RemoveMeshes ();
	if (this.jsonData.materials.length === 0 || this.jsonData.meshes.length === 0) {
		return;
	}

	var myThis = this;
	var currentMeshIndex = 0;
	var environment = new JSM.AsyncEnvironment ({
		onStart : function (taskCount/*, meshes*/) {
			inEnvironment.OnStart (taskCount);
			myThis.viewer.EnableDraw (false);
		},
		onProcess : function (currentTask, meshes) {
			while (currentMeshIndex < meshes.length) {
				myThis.viewer.AddMesh (meshes[currentMeshIndex]);
				currentMeshIndex = currentMeshIndex + 1;
			}
			inEnvironment.OnProcess (currentTask);
		},
		onFinish : function (meshes) {
			myThis.viewer.AdjustClippingPlanes ();
			myThis.viewer.EnableDraw (true);
			myThis.viewer.Draw ();
			inEnvironment.OnFinish (meshes);
		}
	});
	
	JSM.ConvertJSONDataToThreeMeshes (this.jsonData, null, environment);
};

ImporterViewer.prototype.ShowMesh = function (index)
{
	var i, mesh;
	var workJsonData = {
		version : this.jsonData.version,
		materials : this.jsonData.materials,
		meshes : [this.jsonData.meshes[index]]
	};
	
	var meshes = JSM.ConvertJSONDataToThreeMeshes (workJsonData);
	for (i = 0; i < meshes.length; i++) {
		mesh = meshes[i];
		mesh.originalJsonIndex = index;
		this.viewer.AddMesh (mesh);
	}
	
	this.viewer.Draw ();
};

ImporterViewer.prototype.HideMesh = function (index)
{
	var meshesToRemove = [];
	var currentIndex = 0;
	this.viewer.scene.traverse (function (current) {
		if (current instanceof THREE.Mesh) {
			if (current.originalJsonIndex == index) {
				meshesToRemove.push (current);
			}
			currentIndex = currentIndex + 1;
		}
	});
	
	var i, mesh;
	for (i = 0; i < meshesToRemove.length; i++) {
		mesh = meshesToRemove[i];
		this.viewer.scene.remove (mesh);
	}

	this.viewer.Draw ();
};

ImporterViewer.prototype.FitInWindow = function ()
{
	if (this.viewer.MeshCount () > 0) {
		this.viewer.FitInWindow ();
	}
};

ImporterViewer.prototype.SetFixUp = function ()
{
	this.viewer.navigation.EnableFixUp (!this.viewer.navigation.cameraFixUp);
};

ImporterViewer.prototype.SetNamedView = function (viewName)
{
	this.viewer.SetNamedView (viewName);
};
