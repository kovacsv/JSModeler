function ClearViewer (viewer, mode, info)
{
	if (mode == 'three') {
		viewer.RemoveMeshes ();
	} else if (mode == 'internal') {
		viewer.RemoveMeshes ();
	}
	info.innerHTML = '';
	viewer.Draw ();
}

function SetInfoString (viewer, info)
{
	info.innerHTML = '';
	if (mode == 'three') {
		var meshCount = viewer.MeshCount ();
		var vertexCount = viewer.VertexCount ();
		var faceCount = viewer.FaceCount ();
		
		info.innerHTML += meshCount + (meshCount < 2 ? ' mesh' : ' meshes') + ', ';
		info.innerHTML += vertexCount + (vertexCount < 2 ? ' vertex' : ' vertices') + ', ';
		info.innerHTML += faceCount + (faceCount < 2 ? ' face' : ' faces');
	}
}

function AddBodyToViewer (viewer, mode, body, materials, info)
{
	function TextureLoaded () {
		viewer.Draw ();
	}

	if (mode == 'three') {
		var conversionData = {
			textureLoadedCallback : TextureLoaded,
			hasConvexPolygons : false
		};
		var meshes = JSM.ConvertBodyToThreeMeshes (body, materials, conversionData);
		viewer.AddMeshes (meshes);
	} else if (mode == 'internal') {
		var renderBody = JSM.ConvertBodyToRenderBody (body, materials);
		viewer.AddRenderBody (renderBody);	
	}
	SetInfoString (viewer, info);

	viewer.FitInWindow ();
	viewer.Draw ();
}

function AddModelToViewer (viewer, mode, model, materials, info)
{
	function TextureLoaded () {
		viewer.Draw ();
	}

	if (mode == 'three') {
		var conversionData = {
			textureLoadedCallback : TextureLoaded,
			hasConvexPolygons : false
		};
		var meshes = JSM.ConvertModelToThreeMeshes (model, materials, conversionData);
		viewer.AddMeshes (meshes);
	} else if (mode == 'internal') {
		var renderBodies = JSM.ConvertModelToRenderBodies (model, materials);
		viewer.AddRenderBodies (renderBodies);	
	}	

	SetInfoString (viewer, info);

	viewer.FitInWindow ();
	viewer.Draw ();
}

function OffsetOneBody (body, offsetX, offsetY, offsetZ)
{
	body.Transform (new JSM.TranslationTransformation (new JSM.Coord (offsetX, offsetY, offsetZ)));
}

function OffsetTwoBodies (body1, body2, offsetX, offsetY, offsetZ)
{
	OffsetOneBody (body1, -offsetX, -offsetY, -offsetZ);
	OffsetOneBody (body2, offsetX, offsetY, offsetZ);
}
