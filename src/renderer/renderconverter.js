JSM.ConvertBodyToRenderBody = function (body, materials)
{
	function OnGeometryStart ()
	{
		vertices = [];
		normals = [];
		uvs = [];
	}

	function OnGeometryEnd (material)
	{
		var renderAmbient = JSM.HexColorToNormalizedRGBComponents (material.ambient);
		var renderDiffuse = JSM.HexColorToNormalizedRGBComponents (material.diffuse);
		var renderSpecular = JSM.HexColorToNormalizedRGBComponents (material.specular);
		var renderMaterial = new JSM.RenderMaterial (renderAmbient, renderDiffuse, renderSpecular, material.shininess, material.opacity, material.texture, material.textureWidth, material.textureHeight);

		var mesh = new JSM.RenderMesh ();
		mesh.SetMaterial (renderMaterial);

		mesh.SetVertexArray (vertices);
		mesh.SetNormalArray (normals);
		if (material.texture !== null) {
			mesh.SetUVArray (uvs);
		}

		renderBody.AddMesh (mesh);
	}

	function OnTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
	{
		vertices.push (vertex1.x, vertex1.y, vertex1.z);
		vertices.push (vertex2.x, vertex2.y, vertex2.z);
		vertices.push (vertex3.x, vertex3.y, vertex3.z);
		
		normals.push (normal1.x, normal1.y, normal1.z);
		normals.push (normal2.x, normal2.y, normal2.z);
		normals.push (normal3.x, normal3.y, normal3.z);
		
		if (uv1 !== null && uv2 !== null && uv3 !== null) {
			uvs.push (uv1.x, uv1.y);
			uvs.push (uv2.x, uv2.y);
			uvs.push (uv3.x, uv3.y);
		}
	}
	
	var explodeData = {
		hasConvexPolygons : false,
		onGeometryStart : OnGeometryStart,
		onGeometryEnd : OnGeometryEnd,
		onTriangle : OnTriangle
	};
	
	var renderBody = new JSM.RenderBody ();
	
	var vertices = null;
	var normals = null;
	var uvs = null;
	
	JSM.ExplodeBodyToTriangles (body, materials, explodeData);
	return renderBody;
};

JSM.ConvertModelToRenderBodies = function (model, materials)
{
	var bodies = [];
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		bodies.push (JSM.ConvertBodyToRenderBody (body, materials));
	}
	return bodies;
};
