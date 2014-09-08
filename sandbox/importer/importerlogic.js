ImporterLogic = function ()
{
	this.viewer = null;
	this.jsonData = null;
};

ImporterLogic.prototype.Init = function (canvasName)
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
	this.viewer.SetClearColor (0xeeeeee);
	this.viewer.Draw ();
	
	return true;
};

ImporterLogic.prototype.LoadArrayBuffer = function (arrayBuffer)
{
	this.jsonData = JSM.Convert3dsToJsonData (arrayBuffer);
	return this.jsonData;
};

ImporterLogic.prototype.LoadJsonData = function (meshVisibility)
{
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
	
	this.viewer.RemoveMeshes ();
	var meshes = JSM.ConvertJSONDataToThreeMeshes (workJsonData);
	for (i = 0; i < meshes.length; i++) {
		this.viewer.AddMesh (meshes[i]);
	}
	
	this.viewer.Draw ();
};

ImporterLogic.prototype.FitInWindow = function (meshVisibility)
{
	this.viewer.FitInWindow ();
};
