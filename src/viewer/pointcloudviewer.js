JSM.PointCloudViewer = function ()
{
	this.canvas = null;
	this.renderer = null;
	this.navigation = null;
};

JSM.PointCloudViewer.prototype.Init = function (canvasName, camera)
{
	if (!this.InitRenderer (canvasName, camera)) {
		return false;
	}

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

JSM.PointCloudViewer.prototype.InitRenderer = function (canvasName, camera)
{
	this.renderer = new JSM.PointCloudRenderer ();
	if (!this.renderer.Init (canvasName, camera)) {
		return false;
	}
	return true;
};

JSM.PointCloudViewer.prototype.InitNavigation = function ()
{
	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.renderer.canvas, this.renderer.camera, this.Resize.bind (this))) {
		return false;
	}
	return true;
};

JSM.PointCloudViewer.prototype.AddPoints = function (points, colors)
{
	this.renderer.AddPoints (points, colors);
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
