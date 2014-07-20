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
		drawMode : 'Wireframe'
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = JSM.CoordFromArray (settings.cameraEyePosition); }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = JSM.CoordFromArray (settings.cameraCenterPosition); }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = JSM.CoordFromArray (settings.cameraUpVector); }
		if (settings.drawMode !== undefined) { this.settings.drawMode = settings.drawMode; }
	}
	
	return true;
};

JSM.SoftwareViewer.prototype.InitCamera = function (settings)
{
	this.camera = new JSM.Camera (
		JSM.CoordFromArray (settings.cameraEyePosition),
		JSM.CoordFromArray (settings.cameraCenterPosition),
		JSM.CoordFromArray (settings.cameraUpVector),
		settings.fieldOfView,
		settings.nearClippingPlane,
		settings.farClippingPlane
	);
	if (!this.camera) {
		return false;
	}

	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.canvas, this.camera, this.Draw.bind (this))) {
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
	var drawSettings = {
		camera : this.camera,
		fieldOfView : this.camera.fieldOfView,
		nearPlane : this.camera.nearClippingPlane,
		farPlane : this.camera.farClippingPlane,
		drawMode : this.settings.drawMode,
		clear : true
	};
	this.drawer.Clear ();
	
	for (i = 0; i < this.bodies.length; i++) {
		bodyAndMaterials = this.bodies[i];
		JSM.DrawProjectedBody (bodyAndMaterials[0], bodyAndMaterials[1], drawSettings, this.drawer);
	}

	return true;
};
