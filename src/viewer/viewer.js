JSM.Viewer = function ()
{
	this.settings = null;
	this.canvas = null;
	this.renderer = null;
};

JSM.Viewer.prototype.Init = function (canvasName, settings)
{
	if (!this.InitSettings (settings)) {
		return false;
	}
	
	if (!this.InitRenderer (canvasName)) {
		return false;
	}

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

JSM.Viewer.prototype.InitSettings = function (settings)
{
	this.settings = {
		cameraEyePosition : new JSM.Coord (1.0, 1.0, 1.0),
		cameraCenterPosition : new JSM.Coord (0.0, 0.0, 0.0),
		cameraUpVector : new JSM.Coord (0.0, 0.0, 1.0),
		cameraFixUp : true,
		cameraEnableOrbit : true,
		cameraEnableZoom : true,
		fieldOfView : 45.0,
		nearClippingPlane : 0.1,
		farClippingPlane : 1000.0,
		lightAmbientColor : [0.5, 0.5, 0.5],
		lightDiffuseColor : [0.5, 0.5, 0.5]
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = settings.cameraEyePosition; }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = settings.cameraCenterPosition; }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = settings.cameraUpVector; }
		if (settings.cameraFixUp !== undefined) { this.settings.cameraFixUp = settings.cameraFixUp; }
		if (settings.cameraEnableOrbit !== undefined) { this.settings.cameraEnableOrbit = settings.cameraEnableOrbit; }
		if (settings.cameraEnableZoom !== undefined) { this.settings.cameraEnableZoom = settings.cameraEnableZoom; }
		if (settings.fieldOfView !== undefined) { this.settings.fieldOfView = settings.fieldOfView; }
		if (settings.nearClippingPlane !== undefined) { this.settings.nearClippingPlane = settings.nearClippingPlane; }
		if (settings.farClippingPlane !== undefined) { this.settings.farClippingPlane = settings.farClippingPlane; }
		if (settings.lightAmbientColor !== undefined) { this.settings.lightAmbientColor = settings.lightAmbientColor; }
		if (settings.lightDiffuseColor !== undefined) { this.settings.lightDiffuseColor = settings.lightDiffuseColor; }
	}

	return true;
};

JSM.Viewer.prototype.InitRenderer = function (canvasName)
{
	this.renderer = new JSM.Renderer ();
	if (!this.renderer.Init (canvasName, this.settings)) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.InitNavigation = function ()
{
	var navigation = new JSM.Navigation ();
	var navigationSettings = {
		cameraFixUp : true,
		cameraEnableOrbit : true,
		cameraEnableZoom : true
	};
	if (!navigation.Init (navigationSettings, this.renderer.canvas, this.renderer.camera, this.Draw.bind (this))) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.AddGeometries = function (geometries)
{
	this.renderer.AddGeometries (geometries);
};

JSM.Viewer.prototype.Draw = function ()
{
	this.renderer.Render ();
};
