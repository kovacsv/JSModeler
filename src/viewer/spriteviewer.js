JSM.SpriteViewer = function ()
{
	this.canvas = null;
	this.camera = null;
	this.callbacks = null;
	this.points = null;
	this.projected = null;
	this.navigation = null;
};

JSM.SpriteViewer.prototype.Start = function (canvas, camera, callbacks)
{
	if (!this.InitCanvas (canvas)) {
		return false;
	}

	if (!this.InitCamera (camera)) {
		return false;
	}

	if (!this.InitCallbacks (callbacks)) {
		return false;
	}
	
	return true;
};

JSM.SpriteViewer.prototype.InitCanvas = function (canvas)
{
	this.points = [];
	this.canvas = canvas;
	if (!this.canvas) {
		return false;
	}
	
	return true;
};

JSM.SpriteViewer.prototype.InitCamera = function (camera)
{
	this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
	if (!this.camera) {
		return false;
	}

	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.canvas, this.camera, this.Draw.bind (this))) {
		return false;
	}

	return true;
};

JSM.SpriteViewer.prototype.InitCallbacks = function (callbacks)
{
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
		distance = position.DistanceTo (new JSM.Coord2D (projected.position.x, projected.position.y));
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
	var sphere = this.GetBoundingSphere ();
	this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
	this.Draw ();
};

JSM.SpriteViewer.prototype.GetCenter = function ()
{
	var boundingBox = this.GetBoundingBox ();
	return boundingBox.GetCenter ();
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

	return new JSM.Box (min, max);
};

JSM.SpriteViewer.prototype.GetBoundingSphere = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;

	var i, coord, distance;
	for (i = 0; i < this.points.length; i++) {
		coord = this.points[i];
		distance = center.DistanceTo (coord);
		if (JSM.IsGreater (distance, radius)) {
			radius = distance;
		}
	}

	var sphere = new JSM.Sphere (center, radius);
	return sphere;
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
		projected = JSM.Project (coord, this.camera.eye, this.camera.center, this.camera.up, this.camera.fieldOfView * JSM.DegRad, aspectRatio, this.camera.nearClippingPlane, this.camera.farClippingPlane, viewPort);
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
