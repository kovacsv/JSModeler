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

JSM.Viewer.prototype.AddRenderBody = function (renderBody)
{
	this.renderer.AddRenderBody (renderBody);
	this.Draw ();
};

JSM.Viewer.prototype.AddRenderBodies = function (renderBodies)
{
	this.renderer.AddRenderBodies (renderBodies);
	this.Draw ();
};

JSM.Viewer.prototype.RemoveBodies = function ()
{
	this.renderer.RemoveBodies ();
	this.Draw ();
};

JSM.Viewer.prototype.FitInWindow = function ()
{
	var sphere = this.GetBoundingSphere ();
	this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
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
	
	this.renderer.EnumerateBodies (function (body) {
		var transformation = body.GetTransformation ();
		body.EnumerateMeshes (function (mesh) {
			var i, vertex;
			for (i = 0; i < mesh.VertexCount (); i++) {
				vertex = mesh.GetTransformedVertex (i, transformation);
				min.x = JSM.Minimum (min.x, vertex.x);
				min.y = JSM.Minimum (min.y, vertex.y);
				min.z = JSM.Minimum (min.z, vertex.z);
				max.x = JSM.Maximum (max.x, vertex.x);
				max.y = JSM.Maximum (max.y, vertex.y);
				max.z = JSM.Maximum (max.z, vertex.z);
			}
		});
	});

	return new JSM.Box (min, max);
};

JSM.Viewer.prototype.GetBoundingSphere = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;

	this.renderer.EnumerateBodies (function (body) {
		var transformation = body.GetTransformation ();
		body.EnumerateMeshes (function (mesh) {
			var i, vertex, distance;
			for (i = 0; i < mesh.VertexCount (); i++) {
				vertex = mesh.GetTransformedVertex (i, transformation);
				distance = center.DistanceTo (vertex);
				if (JSM.IsGreater (distance, radius)) {
					radius = distance;
				}
			}
		});
	});
	
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
