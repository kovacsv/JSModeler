JSM.PointCloudViewer = function ()
{
	this.canvas = null;
	this.renderer = null;
	this.navigation = null;
};

JSM.PointCloudViewer.prototype.Init = function (canvas, camera)
{
	if (!this.InitRenderer (canvas, camera)) {
		return false;
	}

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

JSM.PointCloudViewer.prototype.InitRenderer = function (canvas, camera)
{
	this.renderer = new JSM.PointCloudRenderer ();
	if (!this.renderer.Init (canvas, camera)) {
		return false;
	}
	return true;
};

JSM.PointCloudViewer.prototype.InitNavigation = function ()
{
	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.renderer.canvas, this.renderer.camera, this.Draw.bind (this), this.Resize.bind (this))) {
		return false;
	}
	return true;
};

JSM.PointCloudViewer.prototype.SetClearColor = function (red, green, blue)
{
	this.renderer.SetClearColor (red, green, blue);
};

JSM.PointCloudViewer.prototype.SetPointSize = function (pointSize)
{
	this.renderer.SetPointSize (pointSize);
};

JSM.PointCloudViewer.prototype.AddPoints = function (points, colors)
{
	this.renderer.AddPoints (points, colors);
};

JSM.PointCloudViewer.prototype.RemovePoints = function ()
{
	this.renderer.RemovePoints ();
};

JSM.PointCloudViewer.prototype.FitInWindow = function ()
{
	var center = this.GetCenter ();
	var radius = this.GetBoundingSphereRadius (center);
	this.navigation.FitInWindow (center, radius);
	this.Draw ();
};

JSM.PointCloudViewer.prototype.GetCenter = function ()
{
	var boundingBox = this.GetBoundingBox ();
	var center = JSM.MidCoord (boundingBox[0], boundingBox[1]);
	return center;
};

JSM.PointCloudViewer.prototype.GetBoundingBox = function ()
{
	var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
	var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
	
	var i, j, points, point;
	for (i = 0; i < this.renderer.points.length; i++) {
		points = this.renderer.points[i].pointArray;
		for (j = 0; j < points.length; j = j + 3) {
			point = new JSM.Coord (points[j], points[j + 1], points[j + 2]);
			min.x = JSM.Minimum (min.x, point.x);
			min.y = JSM.Minimum (min.y, point.y);
			min.z = JSM.Minimum (min.z, point.z);
			max.x = JSM.Maximum (max.x, point.x);
			max.y = JSM.Maximum (max.y, point.y);
			max.z = JSM.Maximum (max.z, point.z);
		}
	}

	return [min, max];
};

JSM.PointCloudViewer.prototype.GetBoundingSphereRadius = function (center)
{
	if (center === undefined || center === null) {
		center = this.GetCenter ();
	}
	var radius = 0.0;

	var i, j, points, point, distance;
	for (i = 0; i < this.renderer.points.length; i++) {
		points = this.renderer.points[i].pointArray;
		for (j = 0; j < points.length; j = j + 3) {
			point = new JSM.Coord (points[j], points[j + 1], points[j + 2]);
			distance = JSM.CoordDistance (center, point);
			if (JSM.IsGreater (distance, radius)) {
				radius = distance;
			}
		}
	}

	return radius;
};

JSM.PointCloudViewer.prototype.Resize = function ()
{
	this.renderer.Resize ();
	this.Draw ();
};

JSM.PointCloudViewer.prototype.Draw = function ()
{
	this.renderer.Render ();
};
