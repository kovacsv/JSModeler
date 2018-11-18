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
			texture : material.texture
		});
		return renderMaterial;
	}
	
	var hasConvexPolygons = false;
	if (parameters !== undefined && parameters !== null) {
		if (parameters.hasConvexPolygons !== undefined && parameters.hasConvexPolygons !== null) {
			hasConvexPolygons = parameters.hasConvexPolygons;
		}
	}
	
	var renderBody = new JSM.RenderBody ();
	
	var vertices = null;
	var normals = null;
	var uvs = null;
	
	var explodeData = {
		hasConvexPolygons : hasConvexPolygons,
		onPointGeometryStart : function () {
			vertices = [];
			normals = null;
			uvs = null;
		},		
		onPointGeometryEnd : function (material) {
			var materialType = JSM.RenderMaterialFlags.Point;
			var renderMaterial = MaterialToRenderMaterial (material, materialType);
			var mesh = new JSM.RenderMesh (renderMaterial);
			mesh.SetVertexArray (vertices);
			renderBody.AddMesh (mesh);
		},
		onPoint : function (vertex) {
			vertices.push (vertex.x, vertex.y, vertex.z);
		},		
		onLineGeometryStart : function () {
			vertices = [];
			normals = null;
			uvs = null;
		},
		onLineGeometryEnd : function (material) {
			var materialType = JSM.RenderMaterialFlags.Line;
			var renderMaterial = MaterialToRenderMaterial (material, materialType);
			var mesh = new JSM.RenderMesh (renderMaterial);
			mesh.SetVertexArray (vertices);
			renderBody.AddMesh (mesh);
		},
		onLine : function (begVertex, endVertex) {
			vertices.push (begVertex.x, begVertex.y, begVertex.z);
			vertices.push (endVertex.x, endVertex.y, endVertex.z);
		},		
		onGeometryStart : function () {
			vertices = [];
			normals = [];
			uvs = [];
		},
		onGeometryEnd : function (material) {
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
		},
		onTriangle : function (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3) {
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
	};
	
	JSM.ExplodeBody (body, materials, explodeData);
	return renderBody;
};

JSM.ConvertModelToRenderBodies = function (model, parameters)
{
	var bodies = [];
	var materials = model.GetMaterialSet ();
	var i, body, renderBody;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		renderBody = JSM.ConvertBodyToRenderBody (body, materials, parameters);
		bodies.push (renderBody);
	}
	return bodies;
};

JSM.ConvertJSONDataToRenderBodies = function (jsonData, asyncCallbacks)
{
	function ConvertMeshToRenderBody (mesh, materials)
	{
		function ConvertTrianglesToRenderMesh (mesh, triangles, materials)
		{
			function GetTextureCoordinate (u, v, offset, scale, rotation)
			{
				var result = new JSM.Vector2D (u, v);
				if (!JSM.IsZero (rotation)) {
					var si = Math.sin (rotation * JSM.DegRad);
					var co = Math.cos (rotation * JSM.DegRad);
					result.x = co * u - si * v;
					result.y = si * u + co * v;
				}
				result.x = offset[0] + result.x * scale[0];
				result.y = offset[1] + result.y * scale[1];
				return result;
			}

			function AppendTriangleCoords (targetArray, sourceArray, indexArray, startIndex, componentCount)
			{
				var vertexIndex, sourceVertexIndex, componentIndex;
				for (vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
					sourceVertexIndex = indexArray[startIndex + vertexIndex];
					for (componentIndex = 0; componentIndex < componentCount; componentIndex++) {
						targetArray.push (sourceArray[sourceVertexIndex * componentCount + componentIndex]);
					}
				}
			}
			
			var material = materials[triangles.material];
			var renderMaterial = new JSM.RenderMaterial (JSM.RenderMaterialFlags.Triangle, {
				ambient : material.ambient || [1.0, 1.0, 1.0],
				diffuse : material.diffuse || [1.0, 1.0, 1.0],
				specular : material.specular || [1.0, 1.0, 1.0],
				shininess : material.shininess || 0.0,
				opacity : material.opacity || 1.0,
			});
			
			var hasTexture = (material.texture !== undefined && material.texture !== null);
			if (hasTexture) {
				renderMaterial.SetType (JSM.RenderMaterialFlags.Triangle + JSM.RenderMaterialFlags.Textured);
				renderMaterial.texture = material.texture;
				renderMaterial.ambient = [1.0, 1.0, 1.0];
				renderMaterial.diffuse = [1.0, 1.0, 1.0];
			}
			
			var renderMesh = new JSM.RenderMesh (renderMaterial);
			var vertexArray = [];
			var normalArray = [];
			var uvArray = [];
			
			var i;
			for	(i = 0; i < triangles.parameters.length; i += 9) {
				AppendTriangleCoords (vertexArray, mesh.vertices, triangles.parameters, i, 3);
				AppendTriangleCoords (normalArray, mesh.normals, triangles.parameters, i + 3, 3);
				AppendTriangleCoords (uvArray, mesh.uvs, triangles.parameters, i + 6, 2);
			}

			if (hasTexture) {
				var offset = material.offset || [0.0, 0.0];
				var scale = material.scale || [1.0, 1.0];
				var rotation = material.rotation || 0.0;
				var transformedUV;
				for	(i = 0; i < uvArray.length; i += 2) {
					transformedUV = GetTextureCoordinate (uvArray[i + 0], uvArray[i + 1], offset, scale, rotation);
					uvArray[i + 0] = transformedUV.x;
					uvArray[i + 1] = -transformedUV.y;
				}
			}
			
			renderMesh.SetVertexArray (vertexArray);
			renderMesh.SetNormalArray (normalArray);
			renderMesh.SetUVArray (uvArray);
			return renderMesh;
		}
		
		var renderBody = new JSM.RenderBody ();
		var i, triangles, renderMesh;
		for (i = 0; i < mesh.triangles.length; i++) {
			triangles = mesh.triangles[i];
			renderMesh = ConvertTrianglesToRenderMesh (mesh, triangles, materials);
			renderBody.AddMesh (renderMesh);
		}
		return renderBody;
	}
	
	function AddMesh (meshes, materials, meshIndex, resultBodies)
	{
		var renderBody = ConvertMeshToRenderBody (meshes[meshIndex], materials);
		resultBodies.push (renderBody);
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
	
	var meshIndex = 0;
	JSM.AsyncRunTask (
		function () {
			AddMesh (meshes, materials, meshIndex, resultBodies);
			meshIndex = meshIndex + 1;
			return true;
		},
		asyncCallbacks,
		meshes.length, 0, resultBodies
	);

	return resultBodies;
};
