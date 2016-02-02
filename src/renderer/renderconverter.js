JSM.ConvertBodyToRenderBody = function (body, materials, parameters)
{
	function MaterialToRenderMaterial (material, materialType)
	{
		var renderAmbient = JSM.HexColorToNormalizedRGBComponents (material.ambient);
		var renderDiffuse = JSM.HexColorToNormalizedRGBComponents (material.diffuse);
		var renderSpecular = JSM.HexColorToNormalizedRGBComponents (material.specular);
		var renderMaterial = new JSM.RenderMaterial (materialType, {
			ambient : renderAmbient,
			diffuse : renderDiffuse,
			specular : renderSpecular,
			shininess : material.shininess,
			opacity : material.opacity,
			singleSided : material.singleSided,
			pointSize : material.pointSize,
			texture : material.texture,
			textureWidth : material.textureWidth,
			textureHeight : material.textureHeight
		});
		return renderMaterial;
	}
	
	function OnPointGeometryStart ()
	{
		vertices = [];
		normals = null;
		uvs = null;
	}

	function OnPointGeometryEnd (material)
	{
		var materialType = JSM.RenderMaterialFlags.Point;
		var renderMaterial = MaterialToRenderMaterial (material, materialType);
		var mesh = new JSM.RenderMesh (renderMaterial);
		mesh.SetVertexArray (vertices);
		renderBody.AddMesh (mesh);
	}

	function OnPoint (vertex)
	{
		vertices.push (vertex.x, vertex.y, vertex.z);
	}
	
	function OnLineGeometryStart ()
	{
		vertices = [];
		normals = null;
		uvs = null;
	}

	function OnLineGeometryEnd (material)
	{
		var materialType = JSM.RenderMaterialFlags.Line;
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
	
	function OnGeometryStart ()
	{
		vertices = [];
		normals = [];
		uvs = [];
	}

	function OnGeometryEnd (material)
	{
		var materialType = JSM.RenderMaterialFlags.Triangle;
		if (material.texture !== null) {
			materialType += JSM.RenderMaterialFlags.Textured;
		}
		if (material.opacity < 1.0) {
			materialType += JSM.RenderMaterialFlags.Transparent;
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
	
	var hasConvexPolygons = false;
	if (parameters !== undefined && parameters !== null) {
		if (parameters.hasConvexPolygons !== undefined && parameters.hasConvexPolygons !== null) {
			hasConvexPolygons = parameters.hasConvexPolygons;
		}
	}
	
	var explodeData = {
		hasConvexPolygons : hasConvexPolygons,
		onPointGeometryStart : OnPointGeometryStart,
		onPointGeometryEnd : OnPointGeometryEnd,
		onPoint : OnPoint,
		onLineGeometryStart : OnLineGeometryStart,
		onLineGeometryEnd : OnLineGeometryEnd,
		onLine : OnLine,
		onGeometryStart : OnGeometryStart,
		onGeometryEnd : OnGeometryEnd,
		onTriangle : OnTriangle
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

JSM.ConvertJSONDataToRenderBodies = function (jsonData)
{
	function ConvertMeshToRenderBody (mesh, materials)
	{
		function ConvertTrianglesToRenderMesh (mesh, triangles, materials)
		{
			function AppendCoord (targetArray, sourceArray, indexArray, startIndex)
			{
				var vertexIndex, sourceVertexIndex, componentIndex;
				for (vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
					sourceVertexIndex = indexArray[startIndex + vertexIndex];
					for (componentIndex = 0; componentIndex < 3; componentIndex++) {
						targetArray.push (sourceArray[sourceVertexIndex * 3 + componentIndex]);
					}
				}
			}
			
			var material = materials[triangles.material];
			var renderMaterial = new JSM.RenderMaterial (JSM.RenderMaterialFlags.Triangle, {
				ambient : material.diffuse || [1.0, 1.0, 1.0],
				diffuse : material.diffuse || [1.0, 1.0, 1.0],
				specular : material.specular || [1.0, 1.0, 1.0],
				shininess : material.shininess || 0.0,
				opacity : material.opacity || 1.0
			});
			
			var renderMesh = new JSM.RenderMesh (renderMaterial);
			var vertexArray = [];
			var normalArray = [];
			var uvArray = [];
			
			var i;
			for	(i = 0; i < triangles.parameters.length; i += 9) {
				AppendCoord (vertexArray, mesh.vertices, triangles.parameters, i);
				AppendCoord (normalArray, mesh.normals, triangles.parameters, i + 3);
				AppendCoord (uvArray, mesh.uvs, triangles.parameters, i + 6);
			}

			renderMesh.SetVertexArray (vertexArray);
			renderMesh.SetNormalArray (normalArray);
			renderMesh.SetUVArray (uvArray);
			return renderMesh;
		}
		
		var renderBody = new JSM.RenderBody ();
		var i, triangles;
		for (i = 0; i < mesh.triangles.length; i++) {
			triangles = mesh.triangles[i];
			renderBody.AddMesh (ConvertTrianglesToRenderMesh (mesh, triangles, materials));
		}
		return renderBody;
	}
	
	var resultBodies = [];

	var materials = jsonData.materials;
	if (materials === undefined) {
		return resultBodies;
	}
	
	var meshes = jsonData.meshes;
	if (meshes === undefined) {
		return resultBodies;
	}
	
	var i = 0;
	for (i = 0; i < meshes.length; i++) {
		resultBodies.push (ConvertMeshToRenderBody (meshes[i], materials));
	}

	return resultBodies;
};
