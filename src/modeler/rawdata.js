JSM.ConvertRawDataToThreeMeshes = function (rawData, textureLoadedCallback)
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
					ambient : ambientColor.getHex (),
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
					textureUVs.push (new THREE.UV (textureOffset[0] + uvs[u1 + 0] * textureScale[0], textureOffset[1] + uvs[u1 + 1] * textureScale[1]));
					textureUVs.push (new THREE.UV (textureOffset[0] + uvs[u2 + 0] * textureScale[0], textureOffset[1] + uvs[u2 + 1] * textureScale[1]));
					textureUVs.push (new THREE.UV (textureOffset[0] + uvs[u3 + 0] * textureScale[0], textureOffset[1] + uvs[u3 + 1] * textureScale[1]));
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

	var materials = rawData['materials'];
	if (materials === undefined) {
		return result;
	}
	
	var meshes = rawData['meshes'];
	if (meshes === undefined) {
		return result;
	}
	
	var i;
	for (i = 0; i < meshes.length; i++) {
		AddMesh (meshes[i]);
	}

	return result;
};
