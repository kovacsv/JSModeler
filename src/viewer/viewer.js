JSM.Viewer = function ()
{
	this.renderer = null;
	this.navigation = null;
};

JSM.Viewer.prototype.Init = function (canvas, camera, light)
{
	if (!this.InitRenderer (canvas, camera, light)) {
		return false;
	}

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

JSM.Viewer.prototype.InitRenderer = function (canvas, camera, light)
{
	this.renderer = new JSM.Renderer ();
	if (!this.renderer.Init (canvas, camera, light)) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.InitNavigation = function ()
{
	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.renderer.canvas, this.renderer.camera, this.Draw.bind (this), this.Resize.bind (this))) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.SetClearColor = function (red, green, blue)
{
	this.renderer.SetClearColor (red, green, blue);
	this.Draw ();
};

JSM.Viewer.prototype.AddGeometries = function (geometries)
{
	this.renderer.AddGeometries (geometries);
	this.Draw ();
};

JSM.Viewer.prototype.RemoveGeometries = function ()
{
	this.renderer.RemoveGeometries ();
	this.Draw ();
};

JSM.Viewer.prototype.FitInWindow = function ()
{
	var sphere = this.GetBoundingSphere ();
	this.navigation.FitInWindow (sphere.GetOrigo (), sphere.GetRadius ());
	this.Draw ();
};

JSM.Viewer.prototype.GetCenter = function ()
{
	var boundingBox = this.GetBoundingBox ();
	return boundingBox.GetCenter ();
};

JSM.Viewer.prototype.GetBoundingBox = function ()
{
	var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
	var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
	
	var i, j, geometry, vertex;
	for (i = 0; i < this.renderer.geometries.length; i++) {
		geometry = this.renderer.geometries[i];
		for (j = 0; j < geometry.VertexCount (); j = j + 1) {
			vertex = geometry.GetTransformedVertex (j);
			min.x = JSM.Minimum (min.x, vertex.x);
			min.y = JSM.Minimum (min.y, vertex.y);
			min.z = JSM.Minimum (min.z, vertex.z);
			max.x = JSM.Maximum (max.x, vertex.x);
			max.y = JSM.Maximum (max.y, vertex.y);
			max.z = JSM.Maximum (max.z, vertex.z);
		}
	}

	return new JSM.Box (min, max);
};

JSM.Viewer.prototype.GetBoundingSphere = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;

	var i, j, geometry, vertex, distance;
	for (i = 0; i < this.renderer.geometries.length; i++) {
		geometry = this.renderer.geometries[i];
		for (j = 0; j < geometry.VertexCount (); j = j + 1) {
			vertex = geometry.GetTransformedVertex (j);
			distance = JSM.CoordDistance (center, vertex);
			if (JSM.IsGreater (distance, radius)) {
				radius = distance;
			}
		}
	}

	var sphere = new JSM.Sphere (center, radius);
	return sphere;
};

JSM.Viewer.prototype.Resize = function ()
{
	this.renderer.Resize ();
	this.Draw ();
};

JSM.Viewer.prototype.Draw = function ()
{
	this.renderer.Render ();
};
