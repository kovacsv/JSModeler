JSM.Viewer = function ()
{
	this.camera = null;
	this.renderer = null;
	this.navigation = null;
	this.cameraLight = null;
};

JSM.Viewer.prototype.Init = function (canvas, camera)
{
	if (!this.InitRenderer (canvas)) {
		return false;
	}

	if (!this.InitNavigation (camera)) {
		return false;
	}

	if (!this.InitLights ()) {
		return false;
	}

	return true;
};

JSM.Viewer.prototype.Reset = function ()
{
	this.RemoveBodies ();
	this.RemoveLights ();
	this.SetAmbientLight (new JSM.RenderAmbientLight (0x7f7f7f));
	this.EnableCameraLight ();
};

JSM.Viewer.prototype.InitRenderer = function (canvas)
{
	this.renderer = new JSM.Renderer ();
	if (!this.renderer.Init (canvas)) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.InitNavigation = function (camera)
{
	this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
	if (!this.camera) {
		return false;
	}

	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.renderer.canvas, this.camera, this.Draw.bind (this), this.Resize.bind (this))) {
		return false;
	}

	return true;
};

JSM.Viewer.prototype.InitLights = function ()
{
	this.SetAmbientLight (new JSM.RenderAmbientLight (0x7f7f7f));
	this.EnableCameraLight ();
	return true;
};

JSM.Viewer.prototype.SetClearColor = function (red, green, blue)
{
	this.renderer.SetClearColor (red, green, blue);
};

JSM.Viewer.prototype.EnableCameraLight = function ()
{
	if (this.cameraLight !== null) {
		return;
	}
	this.cameraLight = new JSM.RenderDirectionalLight (0x7f7f7f, 0xffffff, new JSM.Vector (1.0, 0.0, 0.0));
	this.AddLight (this.cameraLight);
};

JSM.Viewer.prototype.DisableCameraLight = function ()
{
	if (this.cameraLight === null) {
		return;
	}
	this.RemoveLight (this.cameraLight);
	this.cameraLight = null;
};

JSM.Viewer.prototype.GetCameraLight = function ()
{
	return this.cameraLight;
};

JSM.Viewer.prototype.SetAmbientLight = function (light)
{
	this.renderer.SetAmbientLight (light);
};

JSM.Viewer.prototype.AddLight = function (light)
{
	this.renderer.AddLight (light);
};

JSM.Viewer.prototype.RemoveLight = function (light)
{
	this.renderer.RemoveLight (light);
};

JSM.Viewer.prototype.RemoveLights = function ()
{
	this.renderer.RemoveLights ();
	this.cameraLight = null;
};

JSM.Viewer.prototype.AddBody = function (renderBody)
{
	this.renderer.AddBody (renderBody, this.Draw.bind (this));
};

JSM.Viewer.prototype.AddBodies = function (renderBodies)
{
	this.renderer.AddBodies (renderBodies, this.Draw.bind (this));
};

JSM.Viewer.prototype.RemoveBody = function (body)
{
	this.renderer.RemoveBody (body);
};

JSM.Viewer.prototype.RemoveBodies = function ()
{
	this.renderer.RemoveBodies ();
};

JSM.Viewer.prototype.FitInWindow = function ()
{
	var sphere = this.GetBoundingSphere ();
	this.navigation.FitInWindow (sphere.GetCenter (), sphere.GetRadius ());
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

JSM.Viewer.prototype.FindObjects = function (screenX, screenY)
{
	return this.renderer.FindObjects (this.camera, screenX, screenY);
};

JSM.Viewer.prototype.Resize = function ()
{
	this.renderer.Resize ();
};

JSM.Viewer.prototype.Draw = function ()
{
	var camera = this.camera;
	var cameraLight = this.GetCameraLight ();
	if (cameraLight !== null) {
		cameraLight.direction = JSM.CoordSub (camera.center, camera.eye).Normalize ();
	}
	this.renderer.Render (camera);
};
