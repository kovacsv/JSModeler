JSM.SpriteViewer = function ()
{
	this.canvas = null;
	this.camera = null;
	this.settings = null;
	this.callbacks = null;
	this.points = null;
	this.projected = null;
	this.mouse = null;
	this.touch = null;
};

JSM.SpriteViewer.prototype.Start = function (canvasName, settings, callbacks)
{
	if (!this.InitCanvas (canvasName)) {
		return false;
	}

	if (!this.InitSettings (settings, callbacks)) {
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

JSM.SpriteViewer.prototype.InitCanvas = function (canvasName)
{
	this.points = [];
	this.canvas = document.getElementById (canvasName);
	if (!this.canvas) {
		return false;
	}
	
	return true;
};

JSM.SpriteViewer.prototype.InitSettings = function (settings, callbacks)
{
	this.settings = {
		cameraEyePosition : [1.0, 1.0, 1.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0.0, 0.0, 1.0],
		fieldOfView : 45.0,
		nearClippingPlane : 0.1,
		farClippingPlane : 1000.0
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = settings.cameraEyePosition; }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = settings.cameraCenterPosition; }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = settings.cameraUpVector; }
		if (settings.fieldOfView !== undefined) { this.settings.fieldOfView = settings.fieldOfView; }
		if (settings.nearClippingPlane !== undefined) { this.settings.nearClippingPlane = settings.nearClippingPlane; }
		if (settings.farClippingPlane !== undefined) { this.settings.farClippingPlane = settings.farClippingPlane; }
	}
	
	this.callbacks = {
		onPointDraw : null
	};

	if (callbacks !== undefined) {
		if (callbacks.onDrawStart !== undefined) { this.callbacks.onDrawStart = callbacks.onDrawStart; }
		if (callbacks.onPointDraw !== undefined) { this.callbacks.onPointDraw = callbacks.onPointDraw; }
		if (callbacks.onDrawEnd !== undefined) { this.callbacks.onDrawEnd = callbacks.onDrawEnd; }
	}

	return true;
};

JSM.SpriteViewer.prototype.InitCamera = function ()
{
	this.camera = new JSM.Camera (this.settings.cameraEyePosition, this.settings.cameraCenterPosition, this.settings.cameraUpVector);
	if (!this.camera) {
		return false;
	}

	return true;
};

JSM.SpriteViewer.prototype.InitEvents = function ()
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

JSM.SpriteViewer.prototype.AddPoint = function (point)
{
	this.points.push (point);
};

JSM.SpriteViewer.prototype.RemovePoints = function ()
{
	this.points = [];
};

JSM.SpriteViewer.prototype.Resize = function ()
{
	this.Draw ();
};

JSM.SpriteViewer.prototype.NearestPointUnderPosition = function (maxDistance, x, y)
{
	var position = new JSM.Coord2D (x, y);
	
	var minIndex = -1;
	var minDistance = JSM.Inf;
	var i, projected, distance;
	for (i = 0; i < this.projected.length; i++) {
		projected = this.projected[i];
		distance = JSM.CoordDistance2D (new JSM.Coord2D (projected.position.x, projected.position.y), position);
		if (JSM.IsLower (distance, maxDistance) && JSM.IsLower (distance, minDistance)) {
			minIndex = projected.originalIndex;
			minDistance = distance;
		}
	}
	
	return minIndex;
};

JSM.SpriteViewer.prototype.NearestPointUnderMouse = function (maxDistance)
{
	return this.NearestPointUnderPosition (maxDistance, this.mouse.currX, this.mouse.currY);
};

JSM.SpriteViewer.prototype.NearestPointUnderTouch = function (maxDistance)
{
	return this.NearestPointUnderPosition (maxDistance, this.touch.currX, this.touch.currY);
};

JSM.SpriteViewer.prototype.FitInWindow = function ()
{
	var center = this.GetCenter ();
	var radius = this.GetBoundingSphereRadius ();
	this.FitInWindowWithCenterAndRadius (center, radius);
};

JSM.SpriteViewer.prototype.FitInWindowWithCenterAndRadius = function (center, radius)
{
	var offsetToOrigo = JSM.CoordSub (this.camera.center, center);
	this.camera.origo = center;
	this.camera.center = center;
	this.camera.eye = JSM.CoordSub (this.camera.eye, offsetToOrigo);
	var centerEyeDirection = JSM.VectorNormalize (JSM.CoordSub (this.camera.eye, this.camera.center));
	var fieldOfView = this.settings.fieldOfView / 2.0;
	if (this.canvas.width < this.canvas.height) {
		fieldOfView = fieldOfView * this.canvas.width / this.canvas.height;
	}
	var distance = radius / Math.sin (fieldOfView * JSM.DegRad);
	this.camera.eye = JSM.CoordOffset (this.camera.center, centerEyeDirection, distance);
	this.Draw ();
};

JSM.SpriteViewer.prototype.GetCenter = function ()
{
	var boundingBox = this.GetBoundingBox ();
	var center = JSM.MidCoord (boundingBox[0], boundingBox[1]);
	return center;
};

JSM.SpriteViewer.prototype.GetBoundingBox = function ()
{
	var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
	var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
	
	var i, coord;
	for (i = 0; i < this.points.length; i++) {
		coord = this.points[i];
		min.x = JSM.Minimum (min.x, coord.x);
		min.y = JSM.Minimum (min.y, coord.y);
		min.z = JSM.Minimum (min.z, coord.z);
		max.x = JSM.Maximum (max.x, coord.x);
		max.y = JSM.Maximum (max.y, coord.y);
		max.z = JSM.Maximum (max.z, coord.z);
	}

	return [min, max];
};

JSM.SpriteViewer.prototype.GetBoundingSphereRadius = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;

	var i, coord, distance;
	for (i = 0; i < this.points.length; i++) {
		coord = this.points[i];
		distance = JSM.CoordDistance (center, coord);
		if (JSM.IsGreater (distance, radius)) {
			radius = distance;
		}
	}

	return radius;
};

JSM.SpriteViewer.prototype.Draw = function ()
{
	if (this.callbacks.onDrawStart !== null) {
		this.callbacks.onDrawStart (this.canvas);
	}

	var aspectRatio = this.canvas.width / this.canvas.height;
	var viewPort = [0, 0, this.canvas.width, this.canvas.height];
	this.projected = [];
	
	var i, coord, projected;
	for (i = 0; i < this.points.length; i++) {
		coord = this.points[i];
		projected = JSM.Project (coord, this.camera.eye, this.camera.center, this.camera.up, this.settings.fieldOfView * JSM.DegRad, aspectRatio, this.settings.nearClippingPlane, this.settings.farClippingPlane, viewPort);
		projected.y = this.canvas.height - projected.y;
		if (projected !== null) {
			this.projected.push ({position : projected, originalIndex : i});
		}
	}

	this.projected.sort (function (a, b) {
		if (a.position.z > b.position.z) {
			return -1;
		} else if (a.position.z < b.position.z) {
			return 1;
		}
		return 0;
	});
	
	for (i = 0; i < this.projected.length; i++) {
		if (this.callbacks.onPointDraw !== null) {
			this.callbacks.onPointDraw (this.canvas, this.projected[i].originalIndex, this.projected[i].position);
		}
	}

	if (this.callbacks.onDrawEnd !== null) {
		this.callbacks.onDrawEnd (this.canvas);
	}
	return true;
};

JSM.SpriteViewer.prototype.OnMouseDown = function (event)
{
	this.mouse.Down (event, this.canvas);
};

JSM.SpriteViewer.prototype.OnMouseMove = function (event)
{
	this.mouse.Move (event, this.canvas);
	if (!this.mouse.down) {
		return;
	}
	
	var ratio = -0.5;
	this.camera.Orbit (this.mouse.diffX * ratio, this.mouse.diffY * ratio);
	this.Draw ();
};

JSM.SpriteViewer.prototype.OnMouseUp = function (event)
{
	this.mouse.Up (event, this.canvas);
};

JSM.SpriteViewer.prototype.OnMouseOut = function (event)
{
	this.mouse.Out (event, this.canvas);
};

JSM.SpriteViewer.prototype.OnMouseWheel = function (event)
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

JSM.SpriteViewer.prototype.OnTouchStart = function (event)
{
	this.touch.Start (event, this.canvas);
};

JSM.SpriteViewer.prototype.OnTouchMove = function (event)
{
	this.touch.Move (event, this.canvas);
	if (!this.touch.down) {
		return;
	}
	
	var ratio = -0.5;
	this.camera.Orbit (this.touch.diffX * ratio, this.touch.diffY * ratio);
	
	this.Draw ();
};

JSM.SpriteViewer.prototype.OnTouchEnd = function (event)
{
	this.touch.End (event, this.canvas);
};
