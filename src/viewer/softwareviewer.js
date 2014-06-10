JSM.SoftwareViewer = function ()
{
	this.canvas = null;
	this.camera = null;
	this.settings = null;
	this.bodies = null;
	this.drawer = null;
	this.drawMode = null;
	this.mouse = null;
	this.touch = null;
};

JSM.SoftwareViewer.prototype.Start = function (canvasName, settings)
{
	if (!this.InitCanvas (canvasName)) {
		return false;
	}

	if (!this.InitSettings (settings)) {
		return false;
	}
	
	if (!this.InitCamera ()) {
		return false;
	}

	if (!this.InitEvents ()) {
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
		cameraEyePosition : [1.0, 1.0, 1.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0.0, 0.0, 1.0],
		fieldOfView : 45.0,
		nearClippingPlane : 0.1,
		farClippingPlane : 1000.0,
		drawMode : 'Wireframe'
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = settings.cameraEyePosition; }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = settings.cameraCenterPosition; }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = settings.cameraUpVector; }
		if (settings.fieldOfView !== undefined) { this.settings.fieldOfView = settings.fieldOfView; }
		if (settings.nearClippingPlane !== undefined) { this.settings.nearClippingPlane = settings.nearClippingPlane; }
		if (settings.farClippingPlane !== undefined) { this.settings.farClippingPlane = settings.farClippingPlane; }
		if (settings.drawMode !== undefined) { this.settings.drawMode = settings.drawMode; }
	}
	
	return true;
};

JSM.SoftwareViewer.prototype.InitCamera = function ()
{
	this.camera = new JSM.Camera (this.settings.cameraEyePosition, this.settings.cameraCenterPosition, this.settings.cameraUpVector);
	if (!this.camera) {
		return false;
	}

	return true;
};

JSM.SoftwareViewer.prototype.InitEvents = function ()
{
	this.mouse = new JSM.Mouse ();
	if (!this.mouse) {
		return false;
	}

	this.touch = new JSM.Touch ();
	if (!this.touch) {
		return false;
	}

	var myThis = this;
	
	if (document.addEventListener) {
		document.addEventListener ('mousemove', function (event) {myThis.OnMouseMove (event);});
		document.addEventListener ('mouseup', function (event) {myThis.OnMouseUp (event);});
	}

	if (this.canvas.addEventListener) {
		this.canvas.addEventListener ('mousedown', function (event) {myThis.OnMouseDown (event);}, false);
		this.canvas.addEventListener ('DOMMouseScroll', function (event) {myThis.OnMouseWheel (event);}, false);
		this.canvas.addEventListener ('mousewheel', function (event) {myThis.OnMouseWheel (event);}, false);
		this.canvas.addEventListener ('touchstart', function (event) {myThis.OnTouchStart (event);}, false);
		this.canvas.addEventListener ('touchmove', function (event) {myThis.OnTouchMove (event);}, false);
		this.canvas.addEventListener ('touchend', function (event) {myThis.OnTouchEnd (event);}, false);
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

JSM.SoftwareViewer.prototype.OnMouseDown = function (event)
{
	this.mouse.Down (event);
};

JSM.SoftwareViewer.prototype.OnMouseMove = function (event)
{
	this.mouse.Move (event);
	if (!this.mouse.down) {
		return;
	}
	
	var ratio = -0.5;
	this.camera.Orbit (this.mouse.diffX * ratio, this.mouse.diffY * ratio);
	
	this.Draw ();
};

JSM.SoftwareViewer.prototype.OnMouseUp = function (event)
{
	this.mouse.Up (event);
};

JSM.SoftwareViewer.prototype.OnMouseOut = function (event)
{
	this.mouse.Out (event);
};

JSM.SoftwareViewer.prototype.OnMouseWheel = function (event)
{
	var eventParameters = event;
	if (eventParameters === null) {
		eventParameters = window.event;
	}
	
	var delta = 0;
	if (eventParameters.detail) {
		delta = -eventParameters.detail;
	} else if (eventParameters.wheelDelta) {
		delta = eventParameters.wheelDelta / 40;
	}

	var zoomIn = delta > 0;
	this.camera.Zoom (zoomIn);
	this.Draw ();
};

JSM.SoftwareViewer.prototype.OnTouchStart = function (event)
{
	this.touch.Start (event);
};

JSM.SoftwareViewer.prototype.OnTouchMove = function (event)
{
	this.touch.Move (event);
	if (!this.touch.down) {
		return;
	}
	
	var ratio = -0.5;
	this.camera.Orbit (this.touch.diffX * ratio, this.touch.diffY * ratio);
	
	this.Draw ();
};

JSM.SoftwareViewer.prototype.OnTouchEnd = function (event)
{
	this.touch.End (event);
};
