JSM.Viewer = function ()
{
	this.canvas = null;
	this.renderer = null;
	this.navigation = null;
};

JSM.Viewer.prototype.Init = function (canvasName, camera, light)
{
	if (!this.InitRenderer (canvasName, camera, light)) {
		return false;
	}

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

JSM.Viewer.prototype.InitRenderer = function (canvasName, camera, light)
{
	this.renderer = new JSM.Renderer ();
	if (!this.renderer.Init (canvasName, camera, light)) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.InitNavigation = function ()
{
	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.renderer.canvas, this.renderer.camera, this.Draw.bind (this))) {
		return false;
	}
	return true;
};

JSM.Viewer.prototype.AddGeometries = function (geometries)
{
	this.renderer.AddGeometries (geometries);
};

JSM.Viewer.prototype.Draw = function ()
{
	this.renderer.Render ();
};
