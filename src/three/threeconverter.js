JSM.ConvertBodyToThreeMeshes = function (body, materials, conversionData)
{
	function OnGeometryStart ()
	{
		geometry = new THREE.Geometry ();
	}

	function OnGeometryEnd (material)
	{
		var hasTexture = (material.texture !== null);
		var hasOpacity = (material.opacity !== 1.0);

		var threeMaterial = new THREE.MeshPhongMaterial ({
			ambient : material.ambient,
			color : material.diffuse,
			specular : material.specular
		});
		
		if (theConversionData.doubleSided) {
			threeMaterial.side = THREE.DoubleSide;
		}
		
		if (hasOpacity) {
			threeMaterial.opacity = material.opacity;
			threeMaterial.transparent = true;
		}
		if (hasTexture) {
			var textureName = material.texture;
			var texture = THREE.ImageUtils.loadTexture (textureName, new THREE.UVMapping (), function () {
				if (theConversionData.textureLoadedCallback !== null) {
					theConversionData.textureLoadedCallback ();
				}
			});
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			threeMaterial.map = texture;
		}

		geometry.computeFaceNormals ();

		var mesh = new THREE.Mesh (geometry, threeMaterial);
		meshes.push (mesh);
	}

	function OnTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
	{
		var lastVertexIndex = geometry.vertices.length;
		geometry.vertices.push (new THREE.Vector3 (vertex1.x, vertex1.y, vertex1.z));
		geometry.vertices.push (new THREE.Vector3 (vertex2.x, vertex2.y, vertex2.z));
		geometry.vertices.push (new THREE.Vector3 (vertex3.x, vertex3.y, vertex3.z));
		var face = new THREE.Face3 (lastVertexIndex + 0, lastVertexIndex + 1, lastVertexIndex + 2);
		geometry.faces.push (face);
		
		if (normal1 !== null && normal2 !== null && normal3 !== null) {
			var normalArray = [];
			normalArray.push (new THREE.Vector3 (normal1.x, normal1.y, normal1.z));
			normalArray.push (new THREE.Vector3 (normal2.x, normal2.y, normal2.z));
			normalArray.push (new THREE.Vector3 (normal3.x, normal3.y, normal3.z));
			geometry.faces[geometry.faces.length - 1].vertexNormals = normalArray;
		}

		if (uv1 !== null && uv2 !== null && uv3 !== null) {
			var uvArray = [];
			uvArray.push (new THREE.Vector2 (uv1.x, -uv1.y));
			uvArray.push (new THREE.Vector2 (uv2.x, -uv2.y));
			uvArray.push (new THREE.Vector2 (uv3.x, -uv3.y));
			geometry.faceVertexUvs[0].push (uvArray);
		}
	}
	
	var theConversionData = {
		textureLoadedCallback : null,
		hasConvexPolygons : false,
		doubleSided : true
	};

	if (conversionData !== undefined && conversionData !== null) {
		theConversionData.textureLoadedCallback = JSM.ValueOrDefault (conversionData.textureLoadedCallback, theConversionData.textureLoadedCallback);
		theConversionData.hasConvexPolygons = JSM.ValueOrDefault (conversionData.hasConvexPolygons, theConversionData.hasConvexPolygons);
		theConversionData.doubleSided = JSM.ValueOrDefault (conversionData.doubleSided, theConversionData.doubleSided);
	}
	
	var explodeData = {
		hasConvexPolygons : theConversionData.hasConvexPolygons,
		onGeometryStart : OnGeometryStart,
		onGeometryEnd : OnGeometryEnd,
		onTriangle : OnTriangle
	};

	var meshes = [];
	var geometry = null;
	JSM.ExplodeBodyToTriangles (body, materials, explodeData);
	return meshes;
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

JSM.ConvertJSONDataToThreeMeshes = function (jsonData, textureLoadedCallback, environment)
{
	function AddMesh (mesh, meshIndex)
	{
		function AddTriangles (currentTriangles)
		{
			var materialIndex = currentTriangles.material;
			var parameters = currentTriangles.parameters;
			var materialData = materials[materialIndex];
			
			var textureName = materialData.texture;
			var textureOffset = materialData.offset;
			var textureScale = materialData.scale;
			
			var ambientColor = new THREE.Color ();
			var diffuseColor = new THREE.Color ();
			var specularColor = new THREE.Color ();
			ambientColor.setRGB (materialData.ambient[0], materialData.ambient[1], materialData.ambient[2]);
			diffuseColor.setRGB (materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2]);
			specularColor.setRGB (materialData.specular[0], materialData.specular[1], materialData.specular[2]);

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
			
			var material = new THREE.MeshPhongMaterial ({
					ambient : diffuseColor.getHex (),
					color : diffuseColor.getHex (),
					specular : specularColor.getHex (),
					side : THREE.DoubleSide
				}
			);
			
			if (materialData.opacity !== 1.0) {
				material.opacity = materialData.opacity;
				material.transparent = true;
			}
			
			if (textureName !== undefined) {
				var texture = THREE.ImageUtils.loadTexture (textureName, new THREE.UVMapping (), function () {
					if (textureLoadedCallback !== undefined && textureLoadedCallback !== null) {
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
			mesh.originalJsonIndex = meshIndex;
			result.push (mesh);
		}

		var vertices = mesh.vertices;
		if (vertices === undefined) {
			return result;
		}

		var normals = mesh.normals;
		if (normals === undefined) {
			return result;
		}

		var uvs = mesh.uvs;
		if (uvs === undefined) {
			return result;
		}
	
		var triangles = mesh.triangles;
		var i;
		for (i = 0; i < triangles.length; i++) {
			AddTriangles (triangles[i]);
		}
	}

	var result = [];

	var materials = jsonData.materials;
	if (materials === undefined) {
		return result;
	}
	
	var meshes = jsonData.meshes;
	if (meshes === undefined) {
		return result;
	}
	
	var i = 0;
	JSM.AsyncRunTask (function () {
			AddMesh (meshes[i], i);
			i = i + 1;
			return true;
		}, environment, meshes.length, 0, result
	);

	return result;
};

JSM.JSONFileConverter = function (onReady, onTextureLoaded)
{
	this.onReady = onReady;
	this.onTextureLoaded = onTextureLoaded;
};

JSM.JSONFileConverter.prototype.Convert = function (fileName)
{
	var loader = new JSM.JSONFileLoader (this.OnReady.bind (this));
	loader.Load (fileName);
};

JSM.JSONFileConverter.prototype.OnReady = function (jsonData)
{
	if (this.onReady === null) {
		return;
	}
	
	var meshes = JSM.ConvertJSONDataToThreeMeshes (jsonData, this.onTextureLoaded);
	this.onReady (meshes);
};
