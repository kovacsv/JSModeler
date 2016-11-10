function OffsetOneBody (body, offsetX, offsetY, offsetZ)
{
	body.Transform (new JSM.TranslationTransformation (new JSM.Coord (offsetX, offsetY, offsetZ)));
}

function OffsetTwoBodies (body1, body2, offsetX, offsetY, offsetZ)
{
	OffsetOneBody (body1, -offsetX, -offsetY, -offsetZ);
	OffsetOneBody (body2, offsetX, offsetY, offsetZ);
}

function RenderBody (viewer, body, materials, onFinished, beforeDraw)
{
	viewer.Reset ();
	var renderBody = JSM.ConvertBodyToRenderBody (body, materials);
	if (beforeDraw !== undefined && beforeDraw !== null) {
		beforeDraw (renderBody);
	}
	viewer.AddBody (renderBody);
	viewer.FitInWindow ();
	viewer.Draw ();
	if (onFinished !== undefined && onFinished !== null) {
		onFinished ();
	}
}

function RenderBodyAndWait (viewer, body, materials, onFinished, beforeDraw)
{
	RenderBody (viewer, body, materials, null, beforeDraw);
	setTimeout (function () {
		viewer.Draw ();
		onFinished ();
	}, 100);
}

function RenderModel (viewer, model, onFinished, beforeDraw)
{
	viewer.Reset ();
	var renderBodies = JSM.ConvertModelToRenderBodies (model);
	if (beforeDraw !== undefined && beforeDraw !== null) {
		beforeDraw (renderBodies);
	}
	viewer.AddBodies (renderBodies);
	viewer.FitInWindow ();
	viewer.Draw ();
	if (onFinished !== undefined && onFinished !== null) {
		onFinished ();
	}
}		

function RenderModelAndWait (viewer, model, onFinished, beforeDraw)
{
	RenderModel (viewer, model, null, beforeDraw);
	setTimeout (function () {
		viewer.Draw ();
		onFinished ();
	}, 100);
}
