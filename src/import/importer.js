JSM.Read3dsFile = function (arrayBuffer, callbacks)
{
	function OnLog (logText, logLevel)
	{
		if (callbacks.onLog !== undefined && callbacks.onLog !== null) {
			callbacks.onLog (logText, logLevel);
		}
	}

	function OnMaterial (material)
	{
		if (callbacks.onMaterial !== undefined && callbacks.onMaterial !== null) {
			callbacks.onMaterial (material);
		}
	}

	function OnMesh (objectName)
	{
		if (callbacks.onMesh !== undefined && callbacks.onMesh !== null) {
			callbacks.onMesh (objectName);
		}
	}

	function OnVertex (x, y, z)
	{
		if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
			callbacks.onVertex (x, y, z);
		}
	}

	function OnFace (v0, v1, v2, flags)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (v0, v1, v2, flags);
		}
	}

	function OnFaceMaterial (faceIndex, materialName)
	{
		if (callbacks.onFaceMaterial !== undefined && callbacks.onFaceMaterial !== null) {
			callbacks.onFaceMaterial (faceIndex, materialName);
		}
	}

	function OnFaceSmoothingGroup (faceIndex, smoothingGroup)
	{
		if (callbacks.onFaceSmoothingGroup !== undefined && callbacks.onFaceSmoothingGroup !== null) {
			callbacks.onFaceSmoothingGroup (faceIndex, smoothingGroup);
		}
	}

	function ReadChunk (reader, onReady)
	{
		var chunkId = reader.ReadUnsignedInteger16 ();
		var chunkLength = reader.ReadUnsignedInteger32 ();
		onReady (chunkId, chunkLength);
	}
	
	function ReadChunks (reader, endByte, onReady)
	{
		while (reader.GetPosition () < endByte) {
			ReadChunk (reader, onReady);
		}
	}
	
	function ReadFile (reader)
	{
		function SkipChunk (reader, length)
		{
			reader.Skip (length - 6);
		}

		function ReadName (reader)
		{
			var name = '';
			var letter = 0;
			var count = 0;
			while (count < 64) {
				letter = reader.ReadCharacter ();
				if (letter === 0) {
					break;
				}
				name = name + String.fromCharCode (letter);
				count = count + 1;
			}
			return name;
		}
		
		function ReadColorChunk (reader, id, length)
		{
			var color = {};
			var endByte = reader.GetPosition () + length - 6;
			var hasLinColor = false;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['MAT_COLOR']) {
					if (!hasLinColor) {
						color.r = reader.ReadUnsignedCharacter () / 255.0;
						color.g = reader.ReadUnsignedCharacter () / 255.0;
						color.b = reader.ReadUnsignedCharacter () / 255.0;
					}
				} else if (chunkId == chunks['MAT_LIN_COLOR']) {
					color.r = reader.ReadUnsignedCharacter () / 255.0;
					color.g = reader.ReadUnsignedCharacter () / 255.0;
					color.b = reader.ReadUnsignedCharacter () / 255.0;
					hasLinColor = true;
				} else if (chunkId == chunks['MAT_COLOR_F']) {
					if (!hasLinColor) {
						color.r = reader.ReadFloat32 ();
						color.g = reader.ReadFloat32 ();
						color.b = reader.ReadFloat32 ();
					}
				} else if (chunkId == chunks['MAT_LIN_COLOR_F']) {
					color.r = reader.ReadFloat32 ();
					color.g = reader.ReadFloat32 ();
					color.b = reader.ReadFloat32 ();
					hasLinColor = true;
				} else {
					SkipChunk (reader, chunkLength);
				}
			});
			return color;
		}
		
		function ReadPercentageChunk (reader, id, length)
		{
			var percentage = 0.0;
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['PERCENTAGE']) {
					percentage = reader.ReadUnsignedInteger16 () / 100.0;
				} else if (chunkId == chunks['PERCENTAGE_F']) {
					percentage = reader.ReadFloat32 ();
				} else {
					SkipChunk (reader, chunkLength);
				}
			});
			return percentage;
		}
		
		function ReadMaterialChunk (reader, id, length)
		{
			OnLog ('Read material chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var material = {};
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['MAT_NAME']) {
					OnLog ('Read material name chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.name = ReadName (reader);
				} else if (chunkId == chunks['MAT_AMBIENT']) {
					OnLog ('Read material ambient chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.ambient = ReadColorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['MAT_DIFFUSE']) {
					OnLog ('Read material diffuse chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.diffuse = ReadColorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['MAT_SPECULAR']) {
					OnLog ('Read material specular chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.specular = ReadColorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['MAT_SHININESS']) {
					OnLog ('Read material shininess chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.shininess = ReadPercentageChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['MAT_TRANSPARENCY']) {
					OnLog ('Read material transparency chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.transparency = ReadPercentageChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
					SkipChunk (reader, chunkLength);
				}
			});
			
			OnMaterial (material);
		}

		function ReadVerticesChunk (reader, id, length)
		{
			OnLog ('Read vertices chunk (' + id.toString (16) + ', ' + length + ')', 4);
			
			var vertexCount = reader.ReadUnsignedInteger16 ();
			var i, x, y, z;
			for (i = 0; i < vertexCount; i++) {
				x = reader.ReadFloat32 ();
				y = reader.ReadFloat32 ();
				z = reader.ReadFloat32 ();
				OnVertex (x, y, z);
			}
		}

		function ReadFaceMaterialsChunk (reader, id, length)
		{
			OnLog ('Read face materials chunk (' + id.toString (16) + ', ' + length + ')', 5);
			
			var materialName = ReadName (reader);
			var faceCount = reader.ReadUnsignedInteger16 ();
			var i, faceIndex;
			for (i = 0; i < faceCount; i++) {
				faceIndex = reader.ReadUnsignedInteger16 ();
				OnFaceMaterial (faceIndex, materialName);
			}
		}
		
		function ReadFaceSmoothingGroupsChunk (reader, faceCount, id, length)
		{
			OnLog ('Read face smoothing groups chunk (' + id.toString (16) + ', ' + length + ')', 5);
			
			var i, smoothingGroup;
			for (i = 0; i < faceCount; i++) {
				smoothingGroup = reader.ReadUnsignedInteger32 ();
				OnFaceSmoothingGroup (i, smoothingGroup);
			}
		}

		function ReadFacesChunk (reader, id, length)
		{
			OnLog ('Read faces chunk (' + id.toString (16) + ', ' + length + ')', 4);
			
			var endByte = reader.GetPosition () + length - 6;
			var faceCount = reader.ReadUnsignedInteger16 ();
			var i, v0, v1, v2, flags;
			for (i = 0; i < faceCount; i++) {
				v0 = reader.ReadUnsignedInteger16 ();
				v1 = reader.ReadUnsignedInteger16 ();
				v2 = reader.ReadUnsignedInteger16 ();
				flags = reader.ReadUnsignedInteger16 ();
				OnFace (v0, v1, v2, flags);
			}

			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['TRI_MATERIAL']) {
					ReadFaceMaterialsChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['TRI_SMOOTH']) {
					ReadFaceSmoothingGroupsChunk (reader, faceCount,  chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 5);
					SkipChunk (reader, chunkLength);
				}
			});
		}

		function ReadMeshChunk (reader, objectName, id, length)
		{
			OnLog ('Read mesh chunk (' + objectName + ', ' +  id.toString (16) + ', ' + length + ')', 3);

			OnMesh (objectName);
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['TRI_VERTEXL']) {
					ReadVerticesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['TRI_FACEL1']) {
					ReadFacesChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 4);
					SkipChunk (reader, chunkLength);
				}
			});
		}

		function ReadLightChunk (reader, objectName, id, length)
		{
			OnLog ('Skip light chunk (' + objectName + ', ' + id.toString (16) + ', ' + length + ')', 3);
			
			SkipChunk (reader, length);
		}

		function ReadCameraChunk (reader, objectName, id, length)
		{
			OnLog ('Skip camera chunk (' + objectName + ', ' +  id.toString (16) + ', ' + length + ')', 3);
			
			SkipChunk (reader, length);
		}

		function ReadObjectChunk (reader, id, length)
		{
			OnLog ('Read object chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var endByte = reader.GetPosition () + length - 6;
			var objectName = ReadName (reader);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['OBJ_TRIMESH']) {
					ReadMeshChunk (reader, objectName, chunkId, chunkLength);
				} else if (chunkId == chunks['OBJ_LIGHT']) {
					ReadLightChunk (reader, objectName, chunkId, chunkLength);
				} else if (chunkId == chunks['OBJ_CAMERA']) {
					ReadCameraChunk (reader, objectName, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
					SkipChunk (reader, chunkLength);
				}
			});
		}

		function ReadEditorChunk (reader, id, length)
		{
			OnLog ('Read editor chunk (' + id.toString (16) + ', ' + length + ')', 1);
			
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['EDIT_MATERIAL']) {
					ReadMaterialChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['EDIT_OBJECT']) {
					ReadObjectChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 2);
					SkipChunk (reader, chunkLength);
				}
			});
		}
		
		function ReadMainChunk (reader, id, length)
		{
			OnLog ('Read main chunk (' + id.toString (16) + ', ' + length + ')', 0);
			
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['EDIT3DS']) {
					ReadEditorChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 1);
					SkipChunk (reader, chunkLength);
				}
			});
		}
	
		var endByte = reader.GetByteLength ();
		ReadChunks (reader, endByte, function (chunkId, chunkLength) {
			if (chunkId == chunks['MAIN3DS']) {
				ReadMainChunk (reader, chunkId, chunkLength);
			} else {
				OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 0);
				SkipChunk (reader, chunkLength);
			}
		});
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var chunks = {
		'MAIN3DS' : 0x4D4D,
		'EDIT3DS' : 0x3D3D,
		'EDIT_MATERIAL' : 0xAFFF,
		'MAT_NAME' : 0xA000,
		'MAT_AMBIENT' : 0xA010,
		'MAT_DIFFUSE' : 0xA020,
		'MAT_SPECULAR' : 0xA030,
		'MAT_SHININESS' : 0xA040,
		'MAT_TRANSPARENCY' : 0xA050,
		'MAT_COLOR_F' : 0x0010,
		'MAT_COLOR' : 0x0011,
		'MAT_LIN_COLOR' : 0x0012,
		'MAT_LIN_COLOR_F' : 0x0013,
		'PERCENTAGE' : 0x0030,
		'PERCENTAGE_F' : 0x0031,
		'EDIT_OBJECT' : 0x4000,
		'OBJ_TRIMESH' : 0x4100,
		'OBJ_LIGHT' : 0x4600,
		'OBJ_CAMERA' : 0x4700,
		'TRI_VERTEXL' : 0x4110,
		'TRI_FACEL1' : 0x4120,
		'TRI_MATERIAL' : 0x4130,
		'TRI_SMOOTH' : 0x4150
	};
	
	var reader = new JSM.BinaryReader (arrayBuffer, true);
	ReadFile (reader);
};

JSM.ConvertTriangleModelToJsonData = function (model)
{
	function ConvertMaterials (model, materials)
	{
		function ColorToArray (color)
		{
			return [color.r, color.g, color.b];
		}
	
		var i, material;
		for (i = 0; i < model.MaterialCount (); i++) {
			material = model.GetMaterial (i);
			materials.push ({
				ambient : ColorToArray (material.ambient),
				diffuse : ColorToArray (material.diffuse),
				specular : ColorToArray (material.specular),
				opacity : material.opacity
			});
		}
	}

	function ConvertBody (model, body, mesh)
	{
		var trianglesByMaterial = [];
		var materialCount = model.MaterialCount ();
		
		var i, j, coord;
		for (i = 0; i < body.VertexCount (); i++) {
			coord = body.GetVertex (i);
			mesh.vertices.push (coord.x, coord.y, coord.z);
		}
		
		for (i = 0; i < body.NormalCount (); i++) {
			coord = body.GetNormal (i);
			mesh.normals.push (coord.x, coord.y, coord.z);
		}

		for (i = 0; i < body.UVCount (); i++) {
			coord = body.GetUV (i);
			mesh.uvs.push (coord.x, coord.y);
		}

		for (i = 0; i < materialCount; i++) {
			trianglesByMaterial.push ([]);
		}

		var triangle;
		for (i = 0; i < body.TriangleCount (); i++) {
			triangle = body.GetTriangle (i);
			if (triangle.mat < 0 || triangle.mat >= materialCount) {
				continue;
			}
			trianglesByMaterial[triangle.mat].push (i);
		}

		var triangles, jsonTriangles;
		for (i = 0; i < trianglesByMaterial.length; i++) {
			triangles = trianglesByMaterial[i];
			if (triangles.length === 0) {
				continue;
			}
			
			jsonTriangles =  {
				material : i,
				parameters : []
			};
			for (j = 0; j < triangles.length; j++) {
				triangle = body.GetTriangle (triangles[j]);
				jsonTriangles.parameters.push (
					triangle.v0, triangle.v1, triangle.v2,
					triangle.n0, triangle.n1, triangle.n2,
					triangle.u0, triangle.u1, triangle.u2
				);
			}
			mesh.triangles.push (jsonTriangles);
		}
	}
	
	var result = {
		version : 1,
		materials : [],
		meshes : []
	};
	
	ConvertMaterials (model, result.materials);
	
	var i, body, mesh;
	for (i = 0; i < model.BodyCount (); i++) {
		mesh = {
			vertices : [],
			normals : [],
			uvs : [],
			triangles : []
		};
		body = model.GetBody (i);
		ConvertBody (model, body, mesh);
		result.meshes.push (mesh);
	}
	
	return result;
};

JSM.Convert3dsToJsonData = function (arrayBuffer)
{
	var triangleModel = new JSM.TriangleModel ();
	var currentBody = null;
	var materialNameToIndex = {};
	
	JSM.Read3dsFile (arrayBuffer, {
		onLog: function (/*logText, logLevel*/) {
		},
		onMaterial : function (material) {
			function GetColor (color)
			{
				if (color === undefined || color === null) {
					return {r : 0.0, g : 0.0, b : 0.0};
				}
				return color;
			}

			function GetOpacity (transparency)
			{
				if (transparency === undefined || transparency === null) {
					return 1.0;
				}
				return 1.0 - transparency;
			}
			
			var index = triangleModel.AddMaterial (
				GetColor (material.ambient),
				GetColor (material.diffuse),
				GetColor (material.specular),
				GetOpacity (material.transparency)
			);
			materialNameToIndex[material.name] = index;
		},
		onMesh : function (/*meshName*/) {
			var index = triangleModel.AddBody (new JSM.TriangleBody ());
			currentBody = triangleModel.GetBody (index);
		},
		onVertex : function (x, y, z) {
			if (currentBody === null) {
				return;
			}
			currentBody.AddVertex (x, y, z);
		},
		onFace : function (v0, v1, v2/*, flags*/) {
			if (currentBody === null) {
				return;
			}
			currentBody.AddTriangle (v0, v1, v2);
		},
		onFaceMaterial : function (faceIndex, materialName) {
			if (currentBody === null) {
				return;
			}
			
			if (materialNameToIndex[materialName] === undefined) {
				return;
			}

			var triangle = currentBody.GetTriangle (faceIndex);
			triangle.mat = materialNameToIndex[materialName];
		},
		onFaceSmoothingGroup : function (faceIndex, smoothingGroup) {
			if (currentBody === null) {
				return;
			}
			
			var triangle = currentBody.GetTriangle (faceIndex);
			triangle.curve = smoothingGroup;
		}
	});
	
	triangleModel.Finalize ();
	return JSM.ConvertTriangleModelToJsonData (triangleModel);
};
