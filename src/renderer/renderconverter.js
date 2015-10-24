JSM.ConvertBodyToRenderMeshes = function (body, materials)
{
	function OnGeometryStart (material)
	{
		vertices = [];
		normals = [];
		uvs = [];

		var renderAmbient = JSM.HexColorToNormalizedRGBComponents (material.ambient);
		var renderDiffuse = JSM.HexColorToNormalizedRGBComponents (material.diffuse);
		var renderSpecular = JSM.HexColorToNormalizedRGBComponents (material.specular);
		var renderMaterial = new JSM.RenderMaterial (renderAmbient, renderDiffuse, renderSpecular, material.shininess, material.opacity, material.texture, material.textureWidth, material.textureHeight);

		mesh = new JSM.RenderMesh ();
		mesh.SetMaterial (renderMaterial);
		meshes.push (mesh);
	}

	function OnGeometryEnd (material)
	{
		mesh.SetVertexArray (vertices);
		mesh.SetNormalArray (normals);
		if (material.texture !== null) {
			mesh.SetUVArray (uvs);
		}
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
	
	var meshes = [];
	var mesh = null;
	
	var vertices = null;
	var normals = null;
	var uvs = null;
	
	JSM.ExplodeBodyToTriangles (body, materials, explodeData);
	return meshes;
};

JSM.ConvertModelToRenderMeshes = function (model, materials)
{
	var meshes = [];
	var i, j, body, currentGeometries;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		currentGeometries = JSM.ConvertBodyToRenderMeshes (body, materials, meshes);
		for (j = 0; j < currentGeometries.length; j++) {
			meshes.push (currentGeometries[j]);
		}
	}
	return meshes;
};
