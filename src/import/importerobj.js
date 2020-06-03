JSM.ReadObjFile = function (stringBuffer, callbacks)
{
	function OnNewMaterial (name)
	{
		if (callbacks.onNewMaterial !== undefined && callbacks.onNewMaterial !== null) {
			callbacks.onNewMaterial (name);
		}
	}

	function OnMaterialComponent (name, red, green, blue)
	{
		if (callbacks.onMaterialComponent !== undefined && callbacks.onMaterialComponent !== null) {
			callbacks.onMaterialComponent (name, red, green, blue);
		}
	}

	function OnMaterialParameter (name, value)
	{
		if (callbacks.onMaterialParameter !== undefined && callbacks.onMaterialParameter !== null) {
			callbacks.onMaterialParameter (name, value);
		}
	}

	function OnMaterialTexture (textureName)
	{
		if (callbacks.onMaterialTexture !== undefined && callbacks.onMaterialTexture !== null) {
			callbacks.onMaterialTexture (textureName);
		}
	}
	
	function OnUseMaterial (name)
	{
		if (callbacks.onUseMaterial !== undefined && callbacks.onUseMaterial !== null) {
			callbacks.onUseMaterial (name);
		}
	}

	function OnMesh (meshName)
	{
		if (callbacks.onMesh !== undefined && callbacks.onMesh !== null) {
			callbacks.onMesh (meshName);
		}
	}
	
	function OnVertex (x, y, z)
	{
		if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
			callbacks.onVertex (x, y, z);
		}
	}

	function OnColorVertex (x, y, z, r, g, b)
	{
		if (typeof(callbacks.onColorVertex) === 'function') {
			callbacks.onColorVertex (x, y, z, r, g, b);
		}
	}

	function OnNormal (x, y, z)
	{
		if (callbacks.onNormal !== undefined && callbacks.onNormal !== null) {
			callbacks.onNormal (x, y, z);
		}
	}

	function OnTexCoord (x, y)
	{
		if (callbacks.onTexCoord !== undefined && callbacks.onTexCoord !== null) {
			callbacks.onTexCoord (x, y);
		}
	}

	function OnFace (vertices, normals, uvs)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (vertices, normals, uvs);
		}
	}

	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
	}

	function ProcessLine (line, objectCounter)
	{
		function GetIndex (index, count)
		{
			if (index > 0) {
				return index - 1;
			} else {
				return count + index;
			}
		}

		function GetFileName (line, keyword)
		{
			var fileNameIndex = line.indexOf (keyword) + keyword.length;
			var fileName = line.substr (fileNameIndex, line.length - fileNameIndex);
			return fileName.trim ();
		}
	
		if (line.length === 0) {
			return;
		}
		
		if (line[0] == '#') {
			return;
		}

		var lineParts = line.split (/\s+/);
		if (lineParts.length === 0 || lineParts[0][0] == '#') {
			return;
		}

		var i, fileName;
		if (lineParts[0] == 'g') {
			if (lineParts.length < 2) {
				return;
			}
			var meshName = '';
			for (i = 1; i < lineParts.length; i++) {
				meshName += lineParts[i];
				if (i < lineParts.length - 1) {
					meshName += ' ';
				}
			}
			OnMesh (meshName);
		} else if (lineParts[0] == 'v') {
			if (lineParts.length < 4) {
				return;
			}
			objectCounter.vertexCount += 1;
			if (lineParts.length < 7) {
				OnVertex (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
			} else {
				OnColorVertex (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]), parseFloat (lineParts[4]), parseFloat (lineParts[5]), parseFloat (lineParts[6]));
			}
		} else if (lineParts[0] == 'vn') {
			if (lineParts.length < 4) {
				return;
			}
			objectCounter.normalCount += 1;
			OnNormal (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'vt') {
			if (lineParts.length < 3) {
				return;
			}
			objectCounter.uvCount += 1;
			OnTexCoord (parseFloat (lineParts[1]), parseFloat (lineParts[2]));
		} else if (lineParts[0] == 'f') {
			if (lineParts.length < 4) {
				return;
			}
			
			var vertices = [];
			var normals = [];
			var uvs = [];
			
			var partSplitted;
			for (i = 1; i < lineParts.length; i++) {
				partSplitted = lineParts[i].split ('/');
				vertices.push (GetIndex (parseInt (partSplitted[0], 10), objectCounter.vertexCount));
				if (partSplitted.length > 1 && partSplitted[1].length > 0) {
					uvs.push (GetIndex (parseInt (partSplitted[1], 10), objectCounter.uvCount));
				}
				if (partSplitted.length > 2 && partSplitted[2].length > 0) {
					normals.push (GetIndex (parseInt (partSplitted[2], 10), objectCounter.normalCount));
				}
			}
			OnFace (vertices, normals, uvs);
		} else if (lineParts[0] == 'usemtl') {
			if (lineParts.length < 2) {
				return;
			}
			
			OnUseMaterial (lineParts[1]);
		} else if (lineParts[0] == 'newmtl') {
			if (lineParts.length < 2) {
				return;
			}
			
			OnNewMaterial (lineParts[1]);
		} else if (lineParts[0] == 'Ka' || lineParts[0] == 'Kd' || lineParts[0] == 'Ks') {
			if (lineParts.length < 4) {
				return;
			}
			
			OnMaterialComponent (lineParts[0], parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'Ns' || lineParts[0] == 'Tr' || lineParts[0] == 'd') {
			if (lineParts.length < 2) {
				return;
			}

			OnMaterialParameter (lineParts[0], lineParts[1]);
		} else if (lineParts[0] == 'map_Kd') {
			if (lineParts.length < 2) {
				return;
			}
			
			fileName = GetFileName (line, 'map_Kd');
			OnMaterialTexture (fileName);
		} else if (lineParts[0] == 'mtllib') {
			if (lineParts.length < 2) {
				return;
			}

			fileName = GetFileName (line, 'mtllib');
			var fileStringBuffer = OnFileRequested (fileName.trim ());
			if (fileStringBuffer === null) {
				return;
			}
			ProcessFile (fileStringBuffer);
		}
	}
	
	function ProcessFile (stringBuffer, objectCounter)
	{
		var lines = stringBuffer.split ('\n');
		var i, line;
		for (i = 0; i < lines.length; i++) {
			line = lines[i].trim ();
			ProcessLine (line, objectCounter);
		}
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var objectCounter = {
		vertexCount : 0,
		normalCount : 0,
		uvCount : 0
	};

	ProcessFile (stringBuffer, objectCounter);
};

JSM.ConvertObjToJsonData = function (stringBuffer, callbacks)
{
	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
	}

	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var triangleModel = new JSM.TriangleModel ();
	var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
	var currentBody = triangleModel.GetBody (index);
	
	var materialNameToIndex = {};
	var currentMaterial = null;
	var currentMaterialIndex = null;

	var globalVertices = [];
	var globalVertexMaterialIndices = [];
	var globalNormals = [];
	var globalUVs = [];
	
	var globalToLocalVertices = {};
	var globalToLocalNormals = {};
	var globalToLocalUVs = {};
	
	JSM.ReadObjFile (stringBuffer, {
		onNewMaterial : function (name) {
			var index = triangleModel.AddMaterial ({
				name : name
			});
			currentMaterial = triangleModel.GetMaterial (index);
			materialNameToIndex[name] = index;
		},
		onMaterialComponent : function (name, red, green, blue) {
			if (currentMaterial === null) {
				return;
			}
			if (name == 'Ka') {
				currentMaterial.ambient = [red, green, blue];
			} else if (name == 'Kd') {
				currentMaterial.diffuse = [red, green, blue];
			} else if (name == 'Ks') {
				currentMaterial.specular = [red, green, blue];
			}
		},
		onMaterialParameter : function (name, value) {
			if (currentMaterial === null) {
				return;
			}
			if (name == 'Ns') {
				currentMaterial.shininess = 0.0;
				if (JSM.IsPositive (value)) {
					currentMaterial.shininess = (Math.log2 (parseFloat (value)) - 1) / 10.0;
				}
			} else if (name == 'Tr') {
				currentMaterial.opacity = 1.0 - parseFloat (value);
			} else if (name == 'd') {
				currentMaterial.opacity = parseFloat (value);
			}			
		},
		onMaterialTexture : function (textureName) {
			if (currentMaterial === null) {
				return;
			}

			var textureBuffer = OnFileRequested (textureName);
			if (textureBuffer === null) {
				return;
			}
			
			var blob = new window.Blob ([textureBuffer]);
			var blobURL = window.URL.createObjectURL (blob);
			currentMaterial.texture = blobURL;
		},
		onUseMaterial : function (name) {
			var materialIndex = materialNameToIndex[name];
			if (materialIndex !== undefined) {
				currentMaterialIndex = materialIndex;
			}
		},
		onMesh : function (meshName) {
			var index = triangleModel.AddBody (new JSM.TriangleBody (meshName));
			currentBody = triangleModel.GetBody (index);
			globalToLocalVertices = {};
			globalToLocalNormals = {};
			globalToLocalUVs = {};
		},
		onVertex : function (x, y, z) {
			globalVertices.push (new JSM.Coord (x, y, z));
			globalVertexMaterialIndices.push (undefined);
		},
		onColorVertex : function (x, y, z, r, g, b) {
			var colorMaterialName = 'Color #' + ((Math.round (255 * r) << 16) | (Math.round (255 * g) << 8) | Math.round (255 * b)).toString (16);
			var materialIndex = materialNameToIndex[colorMaterialName];
			if (materialIndex === undefined) {
				materialIndex = triangleModel.AddMaterial ({
					name : colorMaterialName
				});
				var colorMaterial = triangleModel.GetMaterial (materialIndex);
				colorMaterial.ambient = [r / 4, g / 4, b / 4];
				colorMaterial.diffuse = [r, g, b];
				colorMaterial.specular = [ 1, 1, 1 ];
				colorMaterial.shininess = 0.01;
				materialNameToIndex[colorMaterialName] = materialIndex;
			}
			globalVertices.push (new JSM.Coord (x, y, z));
			globalVertexMaterialIndices.push (materialIndex);
		},
		onNormal : function (x, y, z) {
			globalNormals.push (new JSM.Coord (x, y, z));
		},
		onTexCoord : function (x, y) {
			globalUVs.push (new JSM.Coord2D (x, y));
		},
		onFace : function (vertices, normals, uvs) {
			function GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, valueAdderFunc)
			{
				if (globalIndex < 0 || globalIndex >= globalValueArray.length) {
					return undefined;
				}				
				var result = globalToLocalIndices[globalIndex];
				if (result === undefined) {
					var globalValue = globalValueArray[globalIndex];
					result = valueAdderFunc (globalValue);
					globalToLocalIndices[globalIndex] = result;
				}
				return result;
			}
			
			function GetLocalVertexIndex (triangleBody, globalValueArray, globalToLocalIndices, globalIndex)
			{
				return GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, function (val) {
					return triangleBody.AddVertex (val.x, val.y, val.z);
				});
			}
			
			function GetLocalNormalIndex (triangleBody, globalValueArray, globalToLocalIndices, globalIndex)
			{
				return GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, function (val) {
					return triangleBody.AddNormal (val.x, val.y, val.z);
				});
			}
			
			function GetLocalUVIndex (triangleBody, globalValueArray, globalToLocalIndices, globalIndex)
			{
				return GetLocalIndex (globalValueArray, globalToLocalIndices, globalIndex, function (val) {
					return triangleBody.AddUV (val.x, val.y);
				});
			}
			
			var i, gv0, gv1, gv2, v0, v1, v2, triangle, triangleIndex;
			var hasNormals = (normals.length == vertices.length);
			var hasUVs = (uvs.length == vertices.length);
			var count = vertices.length;
			gv0 = vertices[0];
			v0 = GetLocalVertexIndex (currentBody, globalVertices, globalToLocalVertices, gv0);
			for (i = 0; i < count - 2; i++) {
				gv1 = vertices[(i + 1) % count];
				gv2 = vertices[(i + 2) % count];
				v1 = GetLocalVertexIndex (currentBody, globalVertices, globalToLocalVertices, gv1);
				v2 = GetLocalVertexIndex (currentBody, globalVertices, globalToLocalVertices, gv2);
				triangleIndex = currentBody.AddTriangle (v0, v1, v2);
				triangle = currentBody.GetTriangle (triangleIndex);
				if (hasNormals) {
					triangle.n0 = GetLocalNormalIndex (currentBody, globalNormals, globalToLocalNormals, normals[0]);
					triangle.n1 = GetLocalNormalIndex (currentBody, globalNormals, globalToLocalNormals, normals[(i + 1) % count]);
					triangle.n2 = GetLocalNormalIndex (currentBody, globalNormals, globalToLocalNormals, normals[(i + 2) % count]);
				}
				if (hasUVs) {
					triangle.u0 = GetLocalUVIndex (currentBody, globalUVs, globalToLocalUVs, uvs[0]);
					triangle.u1 = GetLocalUVIndex (currentBody, globalUVs, globalToLocalUVs, uvs[(i + 1) % count]);
					triangle.u2 = GetLocalUVIndex (currentBody, globalUVs, globalToLocalUVs, uvs[(i + 2) % count]);
				}
				if (currentMaterialIndex !== null) {
					triangle.mat = currentMaterialIndex;
				} else {
					var materialIndex = globalVertexMaterialIndices[gv0];
					if (materialIndex !== undefined && materialIndex === globalVertexMaterialIndices[gv1] && materialIndex === globalVertexMaterialIndices[gv2]) {
						triangle.mat = materialIndex;
					}
				}
			}
		},
		onFileRequested : OnFileRequested
	});

	triangleModel.Finalize ();
	
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
