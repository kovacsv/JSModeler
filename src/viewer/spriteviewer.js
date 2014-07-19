JSM.SpriteViewer = function ()
{
	this.canvas = null;
	this.camera = null;
	this.settings = null;
	this.callbacks = null;
	this.points = null;
	this.projected = null;
	this.navigation = null;
};

JSM.SpriteViewer.prototype.Start = function (canvasName, settings, callbacks)
{
	if (!this.InitCanvas (canvasName)) {
		return false;
	}

	if (!this.InitSettings (settings, callbacks)) {
		return false;
	}
	
	if (!this.InitCamera (settings)) {
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
		cameraEyePosition : new JSM.Coord (1.0, 1.0, 1.0),
		cameraCenterPosition : new JSM.Coord (0.0, 0.0, 0.0),
		cameraUpVector : new JSM.Coord (0.0, 0.0, 1.0),
		fieldOfView : 45.0,
		nearClippingPlane : 0.1,
		farClippingPlane : 1000.0
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = JSM.CoordFromArray (settings.cameraEyePosition); }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = JSM.CoordFromArray (settings.cameraCenterPosition); }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = JSM.CoordFromArray (settings.cameraUpVector); }
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

JSM.SpriteViewer.prototype.InitCamera = function (settings)
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
	return this.NearestPointUnderPosition (maxDistance, this.navigation.mouse.currX, this.navigation.mouse.currY);
};

JSM.SpriteViewer.prototype.NearestPointUnderTouch = function (maxDistance)
{
	return this.NearestPointUnderPosition (maxDistance, this.navigation.touch.currX, this.navigation.touch.currY);
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
