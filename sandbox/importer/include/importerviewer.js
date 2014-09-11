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
		nearClippingPlane : 1.0,
		farClippingPlane : 100000000
	};

	this.viewer = new JSM.ThreeViewer ();
	if (!this.viewer.Start (canvasName, viewerSettings)) {
		return false;
	}
	this.viewer.SetClearColor (0x222222);
	this.viewer.Draw ();
	
	return true;
};

ImporterViewer.prototype.LoadArrayBuffer = function (arrayBuffer)
{
	var timer = new JSM.Timer ();
	timer.Start ();
	this.jsonData = JSM.Convert3dsToJsonData (arrayBuffer);
	timer.Stop ();
};

ImporterViewer.prototype.GetJsonData = function ()
{
	return this.jsonData;
};

ImporterViewer.prototype.LoadJsonData = function (meshVisibility)
{
	this.viewer.RemoveMeshes ();
	if (this.jsonData.materials.length === 0 || this.jsonData.meshes.length === 0) {
		return false;
	}

	var i;
	var workJsonData = null;
	if (meshVisibility === undefined || meshVisibility === null) {
		workJsonData = this.jsonData;
	} else {
		workJsonData = {
			version : this.jsonData.version,
			materials : this.jsonData.materials,
			meshes : []
		};
		
		for (i = 0; i < this.jsonData.meshes.length; i++) {
			if (meshVisibility[i]) {
				workJsonData.meshes.push (this.jsonData.meshes[i]);
			}
		}
	}
	
	var meshes = JSM.ConvertJSONDataToThreeMeshes (workJsonData);
	for (i = 0; i < meshes.length; i++) {
		this.viewer.AddMesh (meshes[i]);
	}
	
	this.viewer.Draw ();
	return true;
};

ImporterViewer.prototype.FitInWindow = function ()
{
	this.viewer.FitInWindow ();
};
