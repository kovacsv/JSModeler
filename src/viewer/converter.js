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
			uvArray.push (new THREE.Vector2 (uv1.x, -uv1.y));
			uvArray.push (new THREE.Vector2 (uv2.x, -uv2.y));
			uvArray.push (new THREE.Vector2 (uv3.x, -uv3.y));
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

JSM.ConvertJSONDataToThreeMeshes = function (jsonData, textureLoadedCallback)
{
	var AddMesh = function (mesh)
	{
		var AddTriangles = function (currentTriangles)
		{
			var materialIndex = currentTriangles['material'];
			var parameters = currentTriangles['parameters'];
			var materialData = materials[materialIndex];
			
			var textureName = materialData['texture'];
			var textureOffset = materialData['offset'];
			var textureScale = materialData['scale'];
			
			var ambientColor = new THREE.Color ();
			var diffuseColor = new THREE.Color ();
			var specularColor = new THREE.Color ();
			ambientColor.setRGB (materialData['ambient'][0], materialData['ambient'][1], materialData['ambient'][2]);
			diffuseColor.setRGB (materialData['diffuse'][0], materialData['diffuse'][1], materialData['diffuse'][2]);
			specularColor.setRGB (materialData['specular'][0], materialData['specular'][1], materialData['specular'][2]);

			if (textureName !== undefined) {
				ambientColor.setRGB (1.0, 1.0, 1.0);
				diffuseColor.setRGB (1.0, 1.0, 1.0);
				specularColor.setRGB (1.0, 1.0, 1.0);
				
				if (textureOffset === undefined) {
					textureOffset = [0.0, 0.0];
				}
				if (textureScale === undefined) {
					textureScale = [1.0, 1.0];
				}
			}
			
			var material = new THREE.MeshLambertMaterial ({
					ambient : diffuseColor.getHex (),
					color : diffuseColor.getHex (),
					side : THREE.DoubleSide
				}
			);
			
			if (materialData['opacity'] !== 1.0) {
				material.opacity = materialData['opacity'];
				material.transparent = true;
			}
			
			if (textureName !== undefined) {
				var texture = THREE.ImageUtils.loadTexture (textureName, new THREE.UVMapping (), function (image) {
					if (textureLoadedCallback !== undefined) {
						textureLoadedCallback ();
					}
				});
				
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				material.map = texture;
			}
			
			var geometry = new THREE.Geometry ();

			var v1, v2, v3, n1, n2, n3, u1, u2, u3;
			var lastVertex, lastFace, vertexNormals, textureUVs;
			var j;
			for (j = 0; j < parameters.length; j += 9) {
				v1 = 3 * parameters[j + 0];
				v2 = 3 * parameters[j + 1];
				v3 = 3 * parameters[j + 2];
				n1 = 3 * parameters[j + 3];
				n2 = 3 * parameters[j + 4];
				n3 = 3 * parameters[j + 5];
				u1 = 2 * parameters[j + 6];
				u2 = 2 * parameters[j + 7];
				u3 = 2 * parameters[j + 8];
				
				lastVertex = geometry.vertices.length;
				lastFace = geometry.faces.length;
				
				geometry.vertices.push (new THREE.Vector3 (vertices[v1 + 0], vertices[v1 + 1], vertices[v1 + 2]));
				geometry.vertices.push (new THREE.Vector3 (vertices[v2 + 0], vertices[v2 + 1], vertices[v2 + 2]));
				geometry.vertices.push (new THREE.Vector3 (vertices[v3 + 0], vertices[v3 + 1], vertices[v3 + 2]));
				geometry.faces.push (new THREE.Face3 (lastVertex + 0, lastVertex + 1, lastVertex + 2));

				vertexNormals = [];
				vertexNormals.push (new THREE.Vector3 (normals[n1 + 0], normals[n1 + 1], normals[n1 + 2]));
				vertexNormals.push (new THREE.Vector3 (normals[n2 + 0], normals[n2 + 1], normals[n2 + 2]));
				vertexNormals.push (new THREE.Vector3 (normals[n3 + 0], normals[n3 + 1], normals[n3 + 2]));
				geometry.faces[lastFace].vertexNormals = vertexNormals;

				if (textureName !== undefined) {
					textureUVs = [];
					textureUVs.push (new THREE.Vector2 (textureOffset[0] + uvs[u1 + 0] * textureScale[0], textureOffset[1] + uvs[u1 + 1] * textureScale[1]));
					textureUVs.push (new THREE.Vector2 (textureOffset[0] + uvs[u2 + 0] * textureScale[0], textureOffset[1] + uvs[u2 + 1] * textureScale[1]));
					textureUVs.push (new THREE.Vector2 (textureOffset[0] + uvs[u3 + 0] * textureScale[0], textureOffset[1] + uvs[u3 + 1] * textureScale[1]));
					geometry.faceVertexUvs[0].push (textureUVs);
				}
			}

			var mesh = new THREE.Mesh (geometry, material);
			result.push (mesh);
		};

		var vertices = mesh['vertices'];
		if (vertices === undefined) {
			return result;
		}

		var normals = mesh['normals'];
		if (normals === undefined) {
			return result;
		}

		var uvs = mesh['uvs'];
		if (uvs === undefined) {
			return result;
		}
	
		var triangles = mesh['triangles'];
		var i;
		for (i = 0; i < triangles.length; i++) {
			AddTriangles (triangles[i]);
		}
	};

	var result = [];

	var materials = jsonData['materials'];
	if (materials === undefined) {
		return result;
	}
	
	var meshes = jsonData['meshes'];
	if (meshes === undefined) {
		return result;
	}
	
	var i;
	for (i = 0; i < meshes.length; i++) {
		AddMesh (meshes[i]);
	}

	return result;
};

JSM.JSONFileConverter = function ()
{
	this.textureLoadedCallback = null;
	this.onReady = null;
};

JSM.JSONFileConverter.prototype =
{
	Convert : function (fileName, textureLoadedCallback)
	{
		var myThis = this;
		var request = new XMLHttpRequest ();
		request.overrideMimeType ('application/json');
		request.open ('GET', fileName, true);
		request.onreadystatechange = function () {
			if (request.readyState == 4) {
				myThis.OnReady (request.responseText);
			}
		}
		this.textureLoadedCallback = textureLoadedCallback;
		request.send (null)				
	},
	
	OnReady : function (responseText) 
	{
		if (this.onReady == null) {
			return;
		}
		
		var jsonData = JSON.parse (responseText);
		var meshes = JSM.ConvertJSONDataToThreeMeshes (jsonData, this.textureLoadedCallback);
		this.onReady (meshes);
	}
};
