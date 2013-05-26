JSM.ConversionData = function (textureLoadedCallback, hasConvexPolygons, doubleSided)
{
	this.textureLoadedCallback = JSM.ValueOrDefault (textureLoadedCallback, null);
	this.hasConvexPolygons = JSM.ValueOrDefault (hasConvexPolygons, false);
	this.doubleSided = JSM.ValueOrDefault (doubleSided, true);
};

JSM.ConvertBodyToThreeMeshesSpecial = function (body, materials, vertexNormals, textureCoords, conversionData)
{
	var AddTriangle = function (geometry, vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
	{
		var lastVertexIndex = geometry.vertices.length;
		geometry.vertices.push (new THREE.Vector3 (vertex1.x, vertex1.y, vertex1.z));
		geometry.vertices.push (new THREE.Vector3 (vertex2.x, vertex2.y, vertex2.z));
		geometry.vertices.push (new THREE.Vector3 (vertex3.x, vertex3.y, vertex3.z));
		var face = new THREE.Face3 (lastVertexIndex + 0, lastVertexIndex + 1, lastVertexIndex + 2);
		geometry.faces.push (face);
		
		if (normal1 !== undefined && normal2 !== undefined && normal3 !== undefined) {
			var normalArray = [];
			normalArray.push (new THREE.Vector3 (normal1.x, normal1.y, normal1.z));
			normalArray.push (new THREE.Vector3 (normal2.x, normal2.y, normal2.z));
			normalArray.push (new THREE.Vector3 (normal3.x, normal3.y, normal3.z));
			geometry.faces[geometry.faces.length - 1].vertexNormals = normalArray;
		}

		if (uv1 !== undefined && uv2 !== undefined && uv3 !== undefined) {
			var uvArray = [];
			uvArray.push (new THREE.UV (uv1.x, -uv1.y));
			uvArray.push (new THREE.UV (uv2.x, -uv2.y));
			uvArray.push (new THREE.UV (uv3.x, -uv3.y));
			geometry.faceVertexUvs[0].push (uvArray);
		}
	};

	var AddPolygon = function (geometry, index, hasTexture)
	{
		var polygon = body.GetPolygon (index);
		var count = polygon.VertexIndexCount ();
		if (count < 3) {
			return;
		}
		
		var vertex1, vertex2, vertex3;
		var normal1, normal2, normal3;
		var uv1, uv2, uv3;

		if (count === 3) {
			vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
			vertex2 = body.GetVertex (polygon.GetVertexIndex (1)).position;
			vertex3 = body.GetVertex (polygon.GetVertexIndex (2)).position;
			normal1 = undefined;
			normal2 = undefined;
			normal3 = undefined;
			if (hasVertexNormals) {
				normal1 = vertexNormals[index][0];
				normal2 = vertexNormals[index][1];
				normal3 = vertexNormals[index][2];
			}
			uv1 = undefined;
			uv2 = undefined;
			uv3 = undefined;
			if (hasTexture && hasTextureCoords) {
				uv1 = textureCoords[index][0];
				uv2 = textureCoords[index][1];
				uv3 = textureCoords[index][2];
			}

			AddTriangle (
				geometry,
				vertex1,
				vertex2,
				vertex3,
				normal1,
				normal2,
				normal3,
				uv1,
				uv2,
				uv3
			);
		} else {
			var i;
		
			var useTriangulation = false;
			if (!conversionData.hasConvexPolygons) {
				useTriangulation = true;
			}
			if (useTriangulation) {
				var polygon3D = new JSM.Polygon ();
				
				var vertex;
				for (i = 0; i < count; i++) {
					vertex = body.GetVertex (polygon.vertices[i]);
					polygon3D.AddVertex (vertex.position.x, vertex.position.y, vertex.position.z);
				}
				
				var normal = JSM.CalculateBodyPolygonNormal (body, index);
				var triangles = JSM.PolygonTriangulate (polygon3D, normal);
				
				var triangle;
				for (i = 0; i < triangles.length; i++) {
					triangle = triangles[i];
					vertex1 = body.GetVertex (polygon.GetVertexIndex (triangle[0])).position;
					vertex2 = body.GetVertex (polygon.GetVertexIndex (triangle[1])).position;
					vertex3 = body.GetVertex (polygon.GetVertexIndex (triangle[2])).position;
					normal1 = undefined;
					normal2 = undefined;
					normal3 = undefined;
					if (hasVertexNormals) {
						normal1 = vertexNormals[index][triangle[0]];
						normal2 = vertexNormals[index][triangle[1]];
						normal3 = vertexNormals[index][triangle[2]];
					}
					uv1 = undefined;
					uv2 = undefined;
					uv3 = undefined;
					if (hasTexture && hasTextureCoords) {
						uv1 = textureCoords[index][triangle[0]];
						uv2 = textureCoords[index][triangle[1]];
						uv3 = textureCoords[index][triangle[2]];
					}
					
					AddTriangle (
						geometry,
						vertex1,
						vertex2,
						vertex3,
						normal1,
						normal2,
						normal3,
						uv1,
						uv2,
						uv3
					);
				}
			} else {
				for (i = 0; i < count - 2; i++) {
					vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
					vertex2 = body.GetVertex (polygon.GetVertexIndex ((i + 1) % count)).position;
					vertex3 = body.GetVertex (polygon.GetVertexIndex ((i + 2) % count)).position;
					normal1 = undefined;
					normal2 = undefined;
					normal3 = undefined;
					if (hasVertexNormals) {
						normal1 = vertexNormals[index][0];
						normal2 = vertexNormals[index][(i + 1) % count];
						normal3 = vertexNormals[index][(i + 2) % count];
					}
					uv1 = undefined;
					uv2 = undefined;
					uv3 = undefined;
					if (hasTexture && hasTextureCoords) {
						uv1 = textureCoords[index][0];
						uv2 = textureCoords[index][(i + 1) % count];
						uv3 = textureCoords[index][(i + 2) % count];
					}
					
					AddTriangle (
						geometry,
						vertex1,
						vertex2,
						vertex3,
						normal1,
						normal2,
						normal3,
						uv1,
						uv2,
						uv3
					);
				}
			}
		}
	};
	
	var CreateGeometry = function (polygonIndices, materialIndex)
	{
		var geometry = new THREE.Geometry ();
		var modelerMaterial = materials.GetMaterial (materialIndex);
		var hasTexture = (modelerMaterial.texture !== null);
		var hasOpacity = (modelerMaterial.opacity !== 1.0);

		var i;
		for (i = 0; i < polygonIndices.length; i++) {
			AddPolygon (geometry, polygonIndices[i], hasTexture);
		}

		var material = null;		
		material = new THREE.MeshLambertMaterial ({
			ambient : modelerMaterial.ambient,
			color : modelerMaterial.diffuse
		});
		
		if (conversionData.doubleSided) {
			material.side = THREE.DoubleSide;
		}
		
		if (hasOpacity) {
			material.opacity = modelerMaterial.opacity;
			material.transparent = true;
		} 
		if (hasTexture) {
			var textureName = modelerMaterial.texture;
			var texture = THREE.ImageUtils.loadTexture (textureName, new THREE.UVMapping (), function (image) {
				if (conversionData.textureLoadedCallback !== null) {
					conversionData.textureLoadedCallback ();
				}
			});
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			material.map = texture;
		}

		geometry.computeCentroids();
		geometry.computeFaceNormals();

		var mesh = new THREE.Mesh (geometry, material);
		meshes.push (mesh);
	};

	var i, j;
	var polygonsByMaterial = [];
	var polygonsWithNoMaterial = [];
	var hasVertexNormals = (vertexNormals !== undefined && vertexNormals !== null);
	var hasTextureCoords = (textureCoords !== undefined && textureCoords !== null);
	
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

	var meshes = [];
	var polygons;
	for (i = 0; i < polygonsByMaterial.length; i++) {
		polygons = polygonsByMaterial[i];
		if (polygons.length === 0) {
			continue;
		}
		
		CreateGeometry (polygons, i);
	}

	if (polygonsWithNoMaterial.length !== 0) {
		CreateGeometry (polygonsWithNoMaterial, -1);
	}
	return meshes;
};

JSM.ConvertBodyToThreeMeshes = function (body, materials, conversionData)
{
	if (conversionData === undefined) {
		conversionData = new JSM.ConversionData ();
	}

	var vertexNormals = JSM.CalculateBodyVertexNormals (body);

	var i, j;
	var hasTextures = false;
	if (materials !== undefined && materials !== null) {
		var projection = body.GetTextureProjectionType ();
		var coords = body.GetTextureProjectionCoords ();
		for (i = 0; i < materials.Count (); i++) {
			if (materials.GetMaterial (i).texture !== null) {
				hasTextures = true;
				break;
			}
		}
	}

	var textureCoords, polygon, material;
	if (hasTextures) {
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
	
	return JSM.ConvertBodyToThreeMeshesSpecial (body, materials, vertexNormals, textureCoords, conversionData);
};

JSM.ConvertModelToThreeMeshes = function (model, materials, conversionData)
{
	var meshes = [];
	var currentMeshes = [];
	var i, j, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		currentMeshes = JSM.ConvertBodyToThreeMeshes (body, materials, conversionData);
		for (j = 0; j < currentMeshes.length; j++) {
			meshes.push (currentMeshes[j]);
		}
	}

	return meshes;
};
