/**
* Function: ExplodeBodyToTriangles
* Description:
*	Explodes a body to triangles. The function calls callback functions
*	on geometry start and end, and when a triangle is created.
* Parameters:
*	body {Body} the body
*	materials {Materials} the materials
*	explodeData {object} the parameters and callback functions of explode
* Returns:
*	{boolean} success
*/
JSM.ExplodeBodyToTriangles = function (body, materials, explodeData)
{
	function ExplodeBodyDataToTriangles (body, materials, vertexNormals, textureCoords, explodeData)
	{
		function ExplodePolygonsByMaterial (polygonIndices, materialIndex)
		{
			function ExplodePolygon (index)
			{
				function CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
				{
					if (explodeData.onTriangle !== undefined && explodeData.onTriangle !== null) {
						explodeData.onTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
					}
				}

				var polygon = body.GetPolygon (index);
				var count = polygon.VertexIndexCount ();
				if (count < 3) {
					return;
				}
				
				var vertex1, vertex2, vertex3;
				var normal1, normal2, normal3;
				var uv1, uv2, uv3;

				var i;
				if (count == 3 || hasConvexPolygons) {
					for (i = 0; i < count - 2; i++) {
						vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
						vertex2 = body.GetVertex (polygon.GetVertexIndex ((i + 1) % count)).position;
						vertex3 = body.GetVertex (polygon.GetVertexIndex ((i + 2) % count)).position;
						normal1 = vertexNormals[index][0];
						normal2 = vertexNormals[index][(i + 1) % count];
						normal3 = vertexNormals[index][(i + 2) % count];
						uv1 = null;
						uv2 = null;
						uv3 = null;
						if (hasTextureCoords) {
							uv1 = textureCoords[index][0];
							uv2 = textureCoords[index][(i + 1) % count];
							uv3 = textureCoords[index][(i + 2) % count];
						}
						
						CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
					}
				} else {
					var polygon3D = new JSM.Polygon ();
					
					var vertex;
					for (i = 0; i < count; i++) {
						vertex = body.GetVertex (polygon.vertices[i]);
						polygon3D.AddVertex (vertex.position.x, vertex.position.y, vertex.position.z);
					}
					
					var normal = JSM.CalculateBodyPolygonNormal (body, index);
					var triangles = JSM.TriangulatePolygon (polygon3D, normal);
					if (triangles !== null) {
						var triangle;
						for (i = 0; i < triangles.length; i++) {
							triangle = triangles[i];
							vertex1 = body.GetVertex (polygon.GetVertexIndex (triangle[0])).position;
							vertex2 = body.GetVertex (polygon.GetVertexIndex (triangle[1])).position;
							vertex3 = body.GetVertex (polygon.GetVertexIndex (triangle[2])).position;
							normal1 = vertexNormals[index][triangle[0]];
							normal2 = vertexNormals[index][triangle[1]];
							normal3 = vertexNormals[index][triangle[2]];
							uv1 = null;
							uv2 = null;
							uv3 = null;
							if (hasTextureCoords) {
								uv1 = textureCoords[index][triangle[0]];
								uv2 = textureCoords[index][triangle[1]];
								uv3 = textureCoords[index][triangle[2]];
							}
							
							CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
						}
					}
				}
			}
			
			var hasConvexPolygons = false;
			if (explodeData.hasConvexPolygons !== undefined && explodeData.hasConvexPolygons !== null) {
				hasConvexPolygons = explodeData.hasConvexPolygons;
			}

			var material = materials.GetMaterial (materialIndex);
			if (explodeData.onGeometryStart !== undefined && explodeData.onGeometryStart !== null) {
				explodeData.onGeometryStart (material);
			}

			var i;
			for (i = 0; i < polygonIndices.length; i++) {
				ExplodePolygon (polygonIndices[i]);
			}

			if (explodeData.onGeometryEnd !== undefined && explodeData.onGeometryEnd !== null) {
				explodeData.onGeometryEnd (material);
			}
		}

		var i;
		var polygonsByMaterial = [];
		var polygonsWithNoMaterial = [];
		
		if (materials === undefined || materials === null) {
			materials = new JSM.Materials ();
		}
		
		for (i = 0; i < materials.Count (); i++) {
			polygonsByMaterial[i] = [];
		}

		var polygon, material;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			if (!polygon.HasMaterialIndex ()) {
				polygonsWithNoMaterial.push (i);
				continue;
			}
			
			material = polygon.GetMaterialIndex ();
			polygonsByMaterial[material].push (i);
		}

		var polygons;
		for (i = 0; i < polygonsByMaterial.length; i++) {
			polygons = polygonsByMaterial[i];
			if (polygons.length === 0) {
				continue;
			}
			
			ExplodePolygonsByMaterial (polygons, i);
		}

		if (polygonsWithNoMaterial.length !== 0) {
			ExplodePolygonsByMaterial (polygonsWithNoMaterial, -1);
		}
	}

	if (explodeData === undefined || explodeData === null) {
		return false;
	}

	var vertexNormals = JSM.CalculateBodyVertexNormals (body);

	var i, j;
	var hasTextureCoords = false;
	if (materials !== undefined && materials !== null) {
		for (i = 0; i < materials.Count (); i++) {
			if (materials.GetMaterial (i).texture !== null) {
				hasTextureCoords = true;
				break;
			}
		}
	}

	var textureCoords, polygon, material;
	if (hasTextureCoords) {
		textureCoords = JSM.CalculateBodyTextureCoords (body);
		for (i = 0; i < textureCoords.length; i++) {
			polygon = body.GetPolygon (i);
			if (polygon.HasMaterialIndex ()) {
				material = materials.GetMaterial (polygon.GetMaterialIndex ());
				for (j = 0; j < textureCoords[i].length; j++) {
					textureCoords[i][j].x /= material.textureWidth;
					textureCoords[i][j].y /= -material.textureHeight;
				}
			}
		}
	}
	
	ExplodeBodyDataToTriangles (body, materials, vertexNormals, textureCoords, explodeData);
	return true;
};
