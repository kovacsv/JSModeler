JSM.Navigation = function ()
{
	this.canvas = null;
	this.camera = null;
	this.drawCallback = null;
	this.resizeCallback = null;
	
	this.mouse = null;
	this.touch = null;
	
	this.cameraFixUp = null;
	this.cameraEnableOrbit = null;
	this.cameraEnableZoom = null;
};

JSM.Navigation.prototype.Init = function (canvas, camera, drawCallback, resizeCallback)
{
	this.cameraFixUp = true;
	this.cameraEnableOrbit = true;
	this.cameraEnableZoom = true;

	this.canvas = canvas;
	this.camera = camera;
	this.drawCallback = drawCallback;
	this.resizeCallback = resizeCallback;

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
	if (window.addEventListener) {
		window.addEventListener ('resize', function (event) {myThis.OnResize (event);}, false);
	}
	
	return true;
};

JSM.Navigation.prototype.Orbit = function (angleX, angleY)
{
	var radAngleX = angleX * JSM.DegRad;
	var radAngleY = angleY * JSM.DegRad;
	
	var viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.camera.center, this.camera.eye));
	var horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, this.camera.up));

	if (this.cameraFixUp) {
		var originalAngle = JSM.GetVectorsAngle (viewDirection, this.camera.up);
		var angleLimit = 5.0 * JSM.DegRad;
		var skipVertical = (radAngleY < 0 && originalAngle > Math.PI - angleLimit) || (radAngleY > 0 && originalAngle < angleLimit);
		if (!skipVertical) {
			this.camera.eye = JSM.CoordRotate (this.camera.eye, horizontalDirection, radAngleY, this.camera.center);
		}
		this.camera.eye = JSM.CoordRotate (this.camera.eye, this.camera.up, radAngleX, this.camera.center);
	} else {
		var verticalDirection = JSM.VectorNormalize (JSM.VectorCross (horizontalDirection, viewDirection));
		this.camera.eye = JSM.CoordRotate (this.camera.eye, horizontalDirection, radAngleY, this.camera.center);
		this.camera.eye = JSM.CoordRotate (this.camera.eye, verticalDirection, radAngleX, this.camera.center);
		this.camera.up = verticalDirection;
	}
};

JSM.Navigation.prototype.Zoom = function (zoomIn)
{
	var direction = JSM.CoordSub (this.camera.center, this.camera.eye);
	var distance = JSM.VectorLength (direction);
	if (zoomIn && distance < 0.1) {
		return 0;
	}

	var move = distance * 0.1;
	if (!zoomIn) {
		move = move * -1.0;
	}

	this.camera.eye = JSM.CoordOffset (this.camera.eye, direction, move);
};

JSM.Navigation.prototype.DrawCallback = function ()
{
	if (this.drawCallback !== undefined && this.drawCallback !== null) {
		this.drawCallback ();
	}
};

JSM.Navigation.prototype.ResizeCallback = function ()
{
	if (this.resizeCallback !== undefined && this.resizeCallback !== null) {
		this.resizeCallback ();
	}
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
	
	if (!this.cameraEnableOrbit) {
		return;
	}
	
	var ratio = -0.5;
	this.Orbit (this.mouse.diffX * ratio, this.mouse.diffY * ratio);
	
	this.DrawCallback ();
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
	if (!this.cameraEnableZoom) {
		return;
	}

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
	this.Zoom (zoomIn);
	this.DrawCallback ();
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

	if (!this.cameraEnableOrbit) {
		return;
	}
	
	var ratio = -0.5;
	this.Orbit (this.touch.diffX * ratio, this.touch.diffY * ratio);
	this.DrawCallback ();
};

JSM.Navigation.prototype.OnTouchEnd = function (event)
{
	event.preventDefault ();
	this.touch.End (event, this.canvas);
};

JSM.Navigation.prototype.OnResize = function (event)
{
	event.preventDefault ();
	this.ResizeCallback ();
};
