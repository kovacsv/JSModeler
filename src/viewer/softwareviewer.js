JSM.SoftwareViewer = function ()
{
	this.canvas = null;
	this.camera = null;
	this.settings = null;
	this.bodies = null;
	this.drawer = null;
	this.drawMode = null;
	this.navigation = null;
};

JSM.SoftwareViewer.prototype.Start = function (canvasName, settings)
{
	if (!this.InitCanvas (canvasName)) {
		return false;
	}

	if (!this.InitSettings (settings)) {
		return false;
	}
	
	if (!this.InitCamera (settings)) {
		return false;
	}

	return true;
};

JSM.SoftwareViewer.prototype.InitCanvas = function (canvasName)
{
	this.bodies = [];
	this.canvas = document.getElementById (canvasName);
	if (!this.canvas) {
		return false;
	}
	
	if (this.canvas instanceof (HTMLCanvasElement)) {
		this.drawer = new JSM.CanvasDrawer (this.canvas);
	} else if (this.canvas instanceof (SVGSVGElement)) {
		this.drawer = new JSM.SVGDrawer (this.canvas);
	}
	
	if (!this.drawer) {
		return false;
	}
	return true;
};

JSM.SoftwareViewer.prototype.InitSettings = function (settings)
{
	this.settings = {
		cameraEyePosition : new JSM.Coord (1.0, 1.0, 1.0),
		cameraCenterPosition : new JSM.Coord (0.0, 0.0, 0.0),
		cameraUpVector : new JSM.Coord (0.0, 0.0, 1.0),
		fieldOfView : 45.0,
		nearClippingPlane : 0.1,
		farClippingPlane : 1000.0,
		drawMode : 'Wireframe'
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = JSM.CoordFromArray (settings.cameraEyePosition); }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = JSM.CoordFromArray (settings.cameraCenterPosition); }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = JSM.CoordFromArray (settings.cameraUpVector); }
		if (settings.fieldOfView !== undefined) { this.settings.fieldOfView = settings.fieldOfView; }
		if (settings.nearClippingPlane !== undefined) { this.settings.nearClippingPlane = settings.nearClippingPlane; }
		if (settings.farClippingPlane !== undefined) { this.settings.farClippingPlane = settings.farClippingPlane; }
		if (settings.drawMode !== undefined) { this.settings.drawMode = settings.drawMode; }
	}
	
	return true;
};

JSM.SoftwareViewer.prototype.InitCamera = function (settings)
{
	this.camera = new JSM.Camera (this.settings.cameraEyePosition, this.settings.cameraCenterPosition, this.settings.cameraUpVector);
	if (!this.camera) {
		return false;
	}

	this.navigation = new JSM.Navigation ();
	var navigationSettings = {
		cameraFixUp : true,
		cameraEnableOrbit : true,
		cameraEnableZoom : true
	};
	if (settings !== undefined) {
		if (settings.cameraFixUp !== undefined) { navigationSettings.cameraFixUp = settings.cameraFixUp; }
		if (settings.cameraEnableOrbit !== undefined) { navigationSettings.cameraEnableOrbit = settings.cameraEnableOrbit; }
		if (settings.cameraEnableZoom !== undefined) { navigationSettings.cameraEnableZoom = settings.cameraEnableZoom; }
	}
	if (!this.navigation.Init (navigationSettings, this.canvas, this.camera, this.Draw.bind (this))) {
		return false;
	}

	return true;
};

JSM.SoftwareViewer.prototype.AddBody = function (body, materials)
{
	this.bodies.push ([body, materials]);
};

JSM.SoftwareViewer.prototype.RemoveBodies = function ()
{
	this.bodies = [];
};

JSM.SoftwareViewer.prototype.Resize = function ()
{
	this.Draw ();
};

JSM.SoftwareViewer.prototype.Draw = function ()
{
	var i, bodyAndMaterials;
	var drawSettings = new JSM.DrawSettings (this.camera, this.settings.fieldOfView, this.settings.nearClippingPlane, this.settings.farClippingPlane, this.settings.drawMode, false);
	this.drawer.Clear ();
	
	for (i = 0; i < this.bodies.length; i++) {
		bodyAndMaterials = this.bodies[i];
		JSM.DrawProjectedBody (bodyAndMaterials[0], bodyAndMaterials[1], drawSettings, this.drawer);
	}

	return true;
};
