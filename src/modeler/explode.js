/**
* Function: ExplodeBody
* Description:
*	Explodes a body to primitives. The function calls callback functions
*	on geometry start and end, and when a triangle or a line is created.
* Parameters:
*	body {Body} the body
*	materials {Materials} the materials
*	explodeData {object} the parameters and callback functions of explode
* Returns:
*	{boolean} success
*/
JSM.ExplodeBody = function (body, materials, explodeData)
{
	function SeparateByMaterial (materials, itemsByMaterial, itemsWithNoMaterial, callbacks)
	{
		var i;
		for (i = 0; i < materials.Count (); i++) {
			itemsByMaterial.push ([]);
		}

		var itemCount = callbacks.itemCount ();
		var material;
		for (i = 0; i < itemCount; i++) {
			material = callbacks.getMaterial (i);
			if (material !== -1) {
				itemsByMaterial[material].push (i);
			} else {
				itemsWithNoMaterial.push (i);
			}
		}		
	}
	
	function ExplodePolygons (body, materials, explodeData)
	{
		function CalculatePolygonsDerivedData (body, materials)
		{
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

			var textureCoords = null;
			var polygon, material;
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
			
			return {
				vertexNormals : vertexNormals,
				textureCoords : textureCoords
			};
		}
		
		function ExplodePolygonsByMaterial (polygonIndices, materialIndex, derivedData, explodeData)
		{
			function ExplodePolygon (index, derivedData, explodeData)
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
					JSM.Message ('Invalid polygon found.');
					return;
				}
				
				var vertex1, vertex2, vertex3;
				var normal1, normal2, normal3;
				var uv1, uv2, uv3;

				var convexPolygon = false;
				if (explodeData.hasConvexPolygons !== undefined && explodeData.hasConvexPolygons !== null) {
					convexPolygon = explodeData.hasConvexPolygons;
				}
				
				var i;
				if (count == 3 || convexPolygon) {
					for (i = 0; i < count - 2; i++) {
						vertex1 = body.GetVertexPosition (polygon.GetVertexIndex (0));
						vertex2 = body.GetVertexPosition (polygon.GetVertexIndex ((i + 1) % count));
						vertex3 = body.GetVertexPosition (polygon.GetVertexIndex ((i + 2) % count));
						normal1 = derivedData.vertexNormals[index][0];
						normal2 = derivedData.vertexNormals[index][(i + 1) % count];
						normal3 = derivedData.vertexNormals[index][(i + 2) % count];
						uv1 = null;
						uv2 = null;
						uv3 = null;
						if (derivedData.textureCoords !== null) {
							uv1 = derivedData.textureCoords[index][0];
							uv2 = derivedData.textureCoords[index][(i + 1) % count];
							uv3 = derivedData.textureCoords[index][(i + 2) % count];
						}
						
						CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
					}
				} else {
					var polygon3D = new JSM.Polygon ();
					
					var vertex;
					for (i = 0; i < count; i++) {
						vertex = body.GetVertexPosition (polygon.vertices[i]);
						polygon3D.AddVertex (vertex.x, vertex.y, vertex.z);
					}
					
					var normal = JSM.CalculateBodyPolygonNormal (body, index);
					var triangles = JSM.TriangulatePolygon (polygon3D, normal);
					if (triangles !== null) {
						var triangle;
						for (i = 0; i < triangles.length; i++) {
							triangle = triangles[i];
							vertex1 = body.GetVertexPosition (polygon.GetVertexIndex (triangle[0]));
							vertex2 = body.GetVertexPosition (polygon.GetVertexIndex (triangle[1]));
							vertex3 = body.GetVertexPosition (polygon.GetVertexIndex (triangle[2]));
							normal1 = derivedData.vertexNormals[index][triangle[0]];
							normal2 = derivedData.vertexNormals[index][triangle[1]];
							normal3 = derivedData.vertexNormals[index][triangle[2]];
							uv1 = null;
							uv2 = null;
							uv3 = null;
							if (derivedData.textureCoords !== null) {
								uv1 = derivedData.textureCoords[index][triangle[0]];
								uv2 = derivedData.textureCoords[index][triangle[1]];
								uv3 = derivedData.textureCoords[index][triangle[2]];
							}
							
							CreateTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3);
						}
					} else {
						JSM.Message ('Triangulation failed.');
					}
				}
			}
			
			if (polygonIndices.length === 0) {
				return;
			}
			
			var material = materials.GetMaterial (materialIndex);
			if (explodeData.onGeometryStart !== undefined && explodeData.onGeometryStart !== null) {
				explodeData.onGeometryStart (material);
			}

			var i;
			for (i = 0; i < polygonIndices.length; i++) {
				ExplodePolygon (polygonIndices[i], derivedData, explodeData);
			}

			if (explodeData.onGeometryEnd !== undefined && explodeData.onGeometryEnd !== null) {
				explodeData.onGeometryEnd (material);
			}
		}

		if (body.PolygonCount () === 0) {
			return;
		}
		
		var polygonsByMaterial = [];
		var polygonsWithNoMaterial = [];
		SeparateByMaterial (materials, polygonsByMaterial, polygonsWithNoMaterial, {
			itemCount : function () {
				return body.PolygonCount ();
			},
			getMaterial : function (index) {
				var polygon = body.GetPolygon (index);
				return polygon.GetMaterialIndex ();
			}
		});
		
		var derivedData = CalculatePolygonsDerivedData (body, materials);
		var i;
		for (i = 0; i < polygonsByMaterial.length; i++) {
			ExplodePolygonsByMaterial (polygonsByMaterial[i], i, derivedData, explodeData);
		}
		ExplodePolygonsByMaterial (polygonsWithNoMaterial, -1, derivedData, explodeData);
	}

	function ExplodeLines (body, materials, explodeData)
	{
		function ExplodeLinesByMaterial (lineIndices, materialIndex, explodeData)
		{
			if (lineIndices.length === 0) {
				return;
			}
			
			var material = materials.GetMaterial (materialIndex);
			if (explodeData.onLineGeometryStart !== undefined && explodeData.onLineGeometryStart !== null) {
				explodeData.onLineGeometryStart (material);
			}

			if (explodeData.onLine !== undefined && explodeData.onLine !== null) {
				var i, line, beg, end;
				for (i = 0; i < lineIndices.length; i++) {
					line = body.GetLine (lineIndices[i]);
					beg = body.GetVertexPosition (line.GetBegVertexIndex ());
					end = body.GetVertexPosition (line.GetEndVertexIndex ());
					explodeData.onLine (beg, end);
				}
			}

			if (explodeData.onLineGeometryEnd !== undefined && explodeData.onLineGeometryEnd !== null) {
				explodeData.onLineGeometryEnd (material);
			}
		}

		if (body.LineCount () === 0) {
			return;
		}

		var linesByMaterial = [];
		var linesWithNoMaterial = [];
		SeparateByMaterial (materials, linesByMaterial, linesWithNoMaterial, {
			itemCount : function () {
				return body.LineCount ();
			},
			getMaterial : function (index) {
				var line = body.GetLine (index);
				return line.GetMaterialIndex ();
			}
		});
		
		var i;		
		for (i = 0; i < linesByMaterial.length; i++) {
			ExplodeLinesByMaterial (linesByMaterial[i], i, explodeData);
		}
		ExplodeLinesByMaterial (linesWithNoMaterial, -1, explodeData);
	}

	if (explodeData === undefined || explodeData === null) {
		return false;
	}

	if (materials === undefined || materials === null) {
		materials = new JSM.Materials ();
	}	
	
	ExplodePolygons (body, materials, explodeData);
	ExplodeLines (body, materials, explodeData);
	return true;
};
