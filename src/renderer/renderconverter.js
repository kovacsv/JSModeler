JSM.ConvertBodyToRenderBody = function (body, materials, parameters)
{
	function MaterialToRenderMaterial (material, materialType)
	{
		var renderAmbient = JSM.HexColorToNormalizedRGBComponents (material.ambient);
		var renderDiffuse = JSM.HexColorToNormalizedRGBComponents (material.diffuse);
		var renderSpecular = JSM.HexColorToNormalizedRGBComponents (material.specular);
		var renderMaterial = new JSM.RenderMaterial (materialType, renderAmbient, renderDiffuse, renderSpecular, material.shininess, material.opacity, material.texture, material.textureWidth, material.textureHeight);
		return renderMaterial;
	}
	
	function OnGeometryStart ()
	{
		vertices = [];
		normals = [];
		uvs = [];
	}

	function OnGeometryEnd (material)
	{
		var materialType = JSM.RenderMaterialType.Polygon;
		if (material.texture !== null) {
			if (material.opacity < 1.0) {
				materialType = JSM.RenderMaterialType.TransparentTexturedPolygon;
			} else {
				materialType = JSM.RenderMaterialType.TexturedPolygon;
			}
		} else {
			if (material.opacity < 1.0) {
				materialType = JSM.RenderMaterialType.TransparentPolygon;
			} else {
				materialType = JSM.RenderMaterialType.Polygon;
			}
		}

		var renderMaterial = MaterialToRenderMaterial (material, materialType);
		var mesh = new JSM.RenderMesh (renderMaterial);
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
	
	function OnLineGeometryStart ()
	{
		vertices = [];
		normals = null;
		uvs = null;
	}

	function OnLineGeometryEnd (material)
	{
		var materialType = JSM.RenderMaterialType.Line;
		if (material.opacity < 1.0) {
			materialType = JSM.RenderMaterialType.TransparentLine;
		}

		var renderMaterial = MaterialToRenderMaterial (material, materialType);
		var mesh = new JSM.RenderMesh (renderMaterial);
		mesh.SetVertexArray (vertices);
		renderBody.AddMesh (mesh);
	}

	function OnLine (begVertex, endVertex)
	{
		vertices.push (begVertex.x, begVertex.y, begVertex.z);
		vertices.push (endVertex.x, endVertex.y, endVertex.z);
	}	
	
	var hasConvexPolygons = false;
	if (parameters !== undefined && parameters !== null) {
		if (parameters.hasConvexPolygons !== undefined && parameters.hasConvexPolygons !== null) {
			hasConvexPolygons = parameters.hasConvexPolygons;
		}
	}
	
	var explodeData = {
		hasConvexPolygons : hasConvexPolygons,
		onGeometryStart : OnGeometryStart,
		onGeometryEnd : OnGeometryEnd,
		onTriangle : OnTriangle,
		onLineGeometryStart : OnLineGeometryStart,
		onLineGeometryEnd : OnLineGeometryEnd,
		onLine : OnLine
	};
	
	var renderBody = new JSM.RenderBody ();
	
	var vertices = null;
	var normals = null;
	var uvs = null;
	
	JSM.ExplodeBody (body, materials, explodeData);
	return renderBody;
};

JSM.ConvertModelToRenderBodies = function (model, materials, parameters)
{
	var bodies = [];
	var i, body, renderBody;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		renderBody = JSM.ConvertBodyToRenderBody (body, materials, parameters);
		bodies.push (renderBody);
	}
	return bodies;
};
