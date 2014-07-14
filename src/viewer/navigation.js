JSM.Navigation = function ()
{
	this.canvas = null;
	this.camera = null;
	this.callback = null;
	
	this.mouse = null;
	this.touch = null;
	
	this.settings = null;
};

JSM.Navigation.prototype.Init = function (settings, canvas, camera, callback)
{
	this.settings = {
		cameraFixUp : true,
		cameraEnableOrbit : true,
		cameraEnableZoom : true
	};

	if (settings !== undefined) {
		if (settings.cameraFixUp !== undefined) { this.settings.cameraFixUp = settings.cameraFixUp; }
		if (settings.cameraEnableOrbit !== undefined) { this.settings.cameraEnableOrbit = settings.cameraEnableOrbit; }
		if (settings.cameraEnableZoom !== undefined) { this.settings.cameraEnableZoom = settings.cameraEnableZoom; }
	}

	this.canvas = canvas;
	this.camera = camera;
	this.callback = callback;

	this.mouse = new JSM.Mouse ();
	this.touch = new JSM.Touch ();
	
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

JSM.Navigation.prototype.OnMouseDown = function (event)
{
	event.preventDefault ();
	this.mouse.Down (event, this.canvas);
};

JSM.Navigation.prototype.OnMouseMove = function (event)
{
	event.preventDefault ();
	this.mouse.Move (event, this.canvas);
	if (!this.mouse.down) {
		return;
	}
	
	var ratio = -0.5;
	this.camera.Orbit (this.mouse.diffX * ratio, this.mouse.diffY * ratio);
	
	this.directionalLight.position = new THREE.Vector3 ().subVectors (this.camera.eye, this.camera.center);
	this.callback ();
};

JSM.Navigation.prototype.OnMouseUp = function (event)
{
	event.preventDefault ();
	this.mouse.Up (event, this.canvas);
};

JSM.Navigation.prototype.OnMouseOut = function (event)
{
	event.preventDefault ();
	this.mouse.Out (event, this.canvas);
};

JSM.Navigation.prototype.OnMouseWheel = function (event)
{
	event.preventDefault ();
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
	this.directionalLight.position = new THREE.Vector3 ().subVectors (this.camera.eye, this.camera.center);
	this.callback ();
};

JSM.Navigation.prototype.OnTouchStart = function (event)
{
	event.preventDefault ();
	this.touch.Start (event, this.canvas);
};

JSM.Navigation.prototype.OnTouchMove = function (event)
{
	event.preventDefault ();
	this.touch.Move (event, this.canvas);
	if (!this.touch.down) {
		return;
	}
	
	var ratio = -0.5;
	this.camera.Orbit (this.touch.diffX * ratio, this.touch.diffY * ratio);
	
	this.directionalLight.position = new THREE.Vector3 ().subVectors (this.camera.eye, this.camera.center);
	this.callback ();
};

JSM.Navigation.prototype.OnTouchEnd = function (event)
{
	event.preventDefault ();
	this.touch.End (event, this.canvas);
};
