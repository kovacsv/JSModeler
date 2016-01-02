function RenderBody (viewer, body, materials, onFinished, beforeDraw)
{
	viewer.RemoveBodies ();
	var renderBody = JSM.ConvertBodyToRenderBody (body, materials);
	if (beforeDraw !== undefined && beforeDraw !== null) {
		beforeDraw (renderBody);
	}
	viewer.AddRenderBody (renderBody);
	viewer.FitInWindow ();
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

function RenderModel (viewer, model, materials, onFinished, beforeDraw)
{
	viewer.RemoveBodies ();
	var renderBodies = JSM.ConvertModelToRenderBodies (model, materials);
	if (beforeDraw !== undefined && beforeDraw !== null) {
		beforeDraw (renderBodies);
	}
	viewer.AddRenderBodies (renderBodies);
	viewer.FitInWindow ();
	if (onFinished !== undefined && onFinished !== null) {
		onFinished ();
	}
}		

function RenderModelAndWait (viewer, model, materials, onFinished, beforeDraw)
{
	RenderModel (viewer, model, materials, null, beforeDraw);
	setTimeout (function () {
		viewer.Draw ();
		onFinished ();
	}, 100);
}
