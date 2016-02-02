JSM.ConvertBodyToThreeMeshes = function (body, materials, conversionData)
{
	function OnPointGeometryStart (material)
	{
		threeMaterial = new THREE.PointsMaterial ({
			color : material.diffuse,
			size: material.pointSize
		});
		threeGeometry = new THREE.Geometry ();
	}

	function OnPointGeometryEnd ()
	{
		var points = new THREE.Points (threeGeometry, threeMaterial);
		meshes.push (points);
	}

	function OnPoint (vertex)
	{
		threeGeometry.vertices.push (new THREE.Vector3 (vertex.x, vertex.y, vertex.z));
	}	
	
	function OnLineGeometryStart (material)
	{
		threeMaterial = new THREE.LineBasicMaterial ({
			color : material.diffuse
		});
	}

	function OnLineGeometryEnd ()
	{

	}

	function OnLine (begVertex, endVertex)
	{
		var lineGeometry = new THREE.Geometry ();
		lineGeometry.vertices.push (new THREE.Vector3 (begVertex.x, begVertex.y, begVertex.z));
		lineGeometry.vertices.push (new THREE.Vector3 (endVertex.x, endVertex.y, endVertex.z));
		var line = new THREE.Line (lineGeometry, threeMaterial);
		meshes.push (line);
	}

	function OnGeometryStart (material)
	{
		var hasTexture = (material.texture !== null);
		var hasOpacity = (material.opacity !== 1.0);

		var diffuse = material.diffuse;
		var specular = material.specular;
		var shininess = material.shininess;
		if (shininess === 0.0) {
			specular = 0x000000;
			shininess = 1;
		}

		threeMaterial = new THREE.MeshPhongMaterial ({
			color : diffuse,
			specular : specular,
			shininess : shininess
		});

		if (!material.singleSided) {
			threeMaterial.side = THREE.DoubleSide;
		}
		
		if (hasOpacity) {
			threeMaterial.opacity = material.opacity;
			threeMaterial.transparent = true;
		}
		
		if (hasTexture) {
			var textureName = material.texture;
			var loader = new THREE.TextureLoader ();
			loader.load (textureName, function (texture) {
				texture.image = JSM.ResizeImageToPowerOfTwoSides (texture.image);
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				threeMaterial.map = texture;
				threeMaterial.needsUpdate = true;
				if (theConversionData.textureLoadedCallback !== null) {
					theConversionData.textureLoadedCallback ();
				}
			});
		}
		
		threeGeometry = new THREE.Geometry ();
	}

	function OnGeometryEnd ()
	{
		threeGeometry.computeFaceNormals ();
		var mesh = new THREE.Mesh (threeGeometry, threeMaterial);
		meshes.push (mesh);
	}

	function OnTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
	{
		var lastVertexIndex = threeGeometry.vertices.length;
		threeGeometry.vertices.push (new THREE.Vector3 (vertex1.x, vertex1.y, vertex1.z));
		threeGeometry.vertices.push (new THREE.Vector3 (vertex2.x, vertex2.y, vertex2.z));
		threeGeometry.vertices.push (new THREE.Vector3 (vertex3.x, vertex3.y, vertex3.z));
		var face = new THREE.Face3 (lastVertexIndex + 0, lastVertexIndex + 1, lastVertexIndex + 2);
		threeGeometry.faces.push (face);
		
		if (normal1 !== null && normal2 !== null && normal3 !== null) {
			var normalArray = [];
			normalArray.push (new THREE.Vector3 (normal1.x, normal1.y, normal1.z));
			normalArray.push (new THREE.Vector3 (normal2.x, normal2.y, normal2.z));
			normalArray.push (new THREE.Vector3 (normal3.x, normal3.y, normal3.z));
			threeGeometry.faces[threeGeometry.faces.length - 1].vertexNormals = normalArray;
		}

		if (uv1 !== null && uv2 !== null && uv3 !== null) {
			var uvArray = [];
			uvArray.push (new THREE.Vector2 (uv1.x, -uv1.y));
			uvArray.push (new THREE.Vector2 (uv2.x, -uv2.y));
			uvArray.push (new THREE.Vector2 (uv3.x, -uv3.y));
			threeGeometry.faceVertexUvs[0].push (uvArray);
		}
	}

	var theConversionData = {
		textureLoadedCallback : null,
		hasConvexPolygons : false
	};

	if (conversionData !== undefined && conversionData !== null) {
		theConversionData.textureLoadedCallback = JSM.ValueOrDefault (conversionData.textureLoadedCallback, theConversionData.textureLoadedCallback);
		theConversionData.hasConvexPolygons = JSM.ValueOrDefault (conversionData.hasConvexPolygons, theConversionData.hasConvexPolygons);
	}
	
	var explodeData = {
		hasConvexPolygons : theConversionData.hasConvexPolygons,
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

	var meshes = [];
	var threeGeometry = null;
	var threeMaterial = null;
	JSM.ExplodeBody (body, materials, explodeData);
	return meshes;
};

JSM.ConvertModelToThreeMeshes = function (model, materials, conversionData)
{
	var meshes = [];
	var i, j, body, currentMeshes;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		currentMeshes = JSM.ConvertBodyToThreeMeshes (body, materials, conversionData);
		for (j = 0; j < currentMeshes.length; j++) {
			meshes.push (currentMeshes[j]);
		}
	}

	return meshes;
};

JSM.ConvertJSONDataToThreeMeshes = function (jsonData, textureLoadedCallback, asyncCallbacks)
{
	function AddMesh (mesh, meshIndex, resultMeshes)
	{
		function AddTriangles (currentTriangles, resultMeshes)
		{
			function GetTextureCoordinate (u, v, offset, scale, rotation)
			{
				var result = new THREE.Vector2 (u, v);
				if (!JSM.IsZero (rotation)) {
					var si = Math.sin (rotation * JSM.DegRad);
					var co = Math.cos (rotation * JSM.DegRad);
					result.x = co * u - si * v;
					result.y = si * u + co * v;
				}
				result.x = textureOffset[0] + result.x * textureScale[0];
				result.y = textureOffset[1] + result.y * textureScale[1];
				return result;
			}
		
			var materialIndex = currentTriangles.material;
			var parameters = currentTriangles.parameters;
			var materialData = materials[materialIndex];
			
			var textureName = materialData.texture;
			var textureOffset = materialData.offset;
			var textureScale = materialData.scale;
			var textureRotation = materialData.rotation;
			
			var diffuseColor = new THREE.Color ();
			var specularColor = new THREE.Color ();
			var shininess = materialData.shininess || 0.0;

			diffuseColor.setRGB (materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2]);
			specularColor.setRGB (materialData.specular[0], materialData.specular[1], materialData.specular[2]);

			if (textureName !== undefined && textureName !== null) {
				diffuseColor.setRGB (1.0, 1.0, 1.0);
				specularColor.setRGB (1.0, 1.0, 1.0);
				
				if (textureOffset === undefined || textureOffset === null) {
					textureOffset = [0.0, 0.0];
				}
				if (textureScale === undefined || textureScale === null) {
					textureScale = [1.0, 1.0];
				}
				if (textureRotation === undefined || textureRotation === null) {
					textureRotation = 0.0;
				}
			}

			if (shininess === 0.0) {
				specularColor.setRGB (0.0, 0.0, 0.0);
				shininess = 1;
			}
			
			var material = new THREE.MeshPhongMaterial ({
					color : diffuseColor.getHex (),
					specular : specularColor.getHex (),
					shininess : shininess,
					side : THREE.DoubleSide
				}
			);

			if (materialData.opacity !== 1.0) {
				material.opacity = materialData.opacity;
				material.transparent = true;
			}
			
			if (textureName !== undefined && textureName !== null) {
				var loader = new THREE.TextureLoader ();
				loader.load (textureName, function (texture) {
					texture.image = JSM.ResizeImageToPowerOfTwoSides (texture.image);
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					material.map = texture;
					material.needsUpdate = true;
					if (textureLoadedCallback !== undefined && textureLoadedCallback !== null) {
						textureLoadedCallback ();
					}
				});
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

				if (textureName !== undefined && textureName !== null) {
					textureUVs = [];
					textureUVs.push (GetTextureCoordinate (uvs[u1 + 0], uvs[u1 + 1], textureOffset, textureScale, textureRotation));
					textureUVs.push (GetTextureCoordinate (uvs[u2 + 0], uvs[u2 + 1], textureOffset, textureScale, textureRotation));
					textureUVs.push (GetTextureCoordinate (uvs[u3 + 0], uvs[u3 + 1], textureOffset, textureScale, textureRotation));
					geometry.faceVertexUvs[0].push (textureUVs);
				}
			}

			var mesh = new THREE.Mesh (geometry, material);
			mesh.originalJsonIndex = meshIndex;
			resultMeshes.push (mesh);
		}

		var vertices = mesh.vertices;
		if (vertices === undefined) {
			return;
		}

		var normals = mesh.normals;
		if (normals === undefined) {
			return;
		}

		var uvs = mesh.uvs;
		if (uvs === undefined) {
			return;
		}
	
		var triangles = mesh.triangles;
		var i;
		for (i = 0; i < triangles.length; i++) {
			AddTriangles (triangles[i], resultMeshes);
		}
	}

	var resultMeshes = [];

	var materials = jsonData.materials;
	if (materials === undefined) {
		return resultMeshes;
	}
	
	var meshes = jsonData.meshes;
	if (meshes === undefined) {
		return resultMeshes;
	}
	
	var i = 0;
	JSM.AsyncRunTask (
		function () {
			AddMesh (meshes[i], i, resultMeshes);
			i = i + 1;
			return true;
		},
		asyncCallbacks,
		meshes.length, 0, resultMeshes
	);

	return resultMeshes;
};
