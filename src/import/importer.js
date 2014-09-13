JSM.GetArrayBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function () {
		var arrayBuffer = request.response;
		if (arrayBuffer) {
			onReady (arrayBuffer);
		}
	};

	request.send (null);
};

JSM.GetArrayBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	};

	reader.readAsArrayBuffer (file);
};

JSM.GetStringBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'text';

	request.onload = function () {
		var stringBuffer = request.response;
		if (stringBuffer) {
			onReady (stringBuffer);
		}
	};

	request.send (null);
};

JSM.LoadMultipleBuffers = function (inputList, result, index, loaderFunction, onReady)
{
	if (index >= inputList.length) {
		onReady (result);
		return;
	}
	
	var originalObject = inputList[index];
	loaderFunction (originalObject, function (resultBuffer) {
		result.push ({
			originalObject : originalObject,
			resultBuffer : resultBuffer
		});
		JSM.LoadMultipleBuffers (inputList, result, index + 1, loaderFunction, onReady);
	});
};

JSM.GetStringBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	};

	reader.readAsText (file);
};

JSM.GetStringBuffersFromURLList = function (urlList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffers (urlList, result, 0, JSM.GetStringBufferFromURL, function (result) {
		onReady (result);
	});
};

JSM.GetStringBuffersFromFileList = function (fileList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffers (fileList, result, 0, JSM.GetStringBufferFromFile, function (result) {
		onReady (result);
	});
};

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

	function OnTransformation (matrix)
	{
		if (callbacks.onTransformation !== undefined && callbacks.onTransformation !== null) {
			callbacks.onTransformation (matrix);
		}
	}
	
	function OnPivotPoint (objectName, pivotPoint)
	{
		if (callbacks.onPivotPoint !== undefined && callbacks.onPivotPoint !== null) {
			callbacks.onPivotPoint (objectName, pivotPoint);
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
	
	function SkipChunk (reader, length)
	{
		reader.Skip (length - 6);
	}
	
	function GetChunkEnd (reader, length)
	{
		return reader.GetPosition () + length - 6;
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

	function ReadChunks (reader, endByte, onReady)
	{
		while (reader.GetPosition () < endByte) {
			ReadChunk (reader, onReady);
		}
	}

	function ReadFile (reader)
	{
		function ReadColorChunk (reader, id, length)
		{
			var color = {};
			var endByte = GetChunkEnd (reader, length);
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
			var endByte = GetChunkEnd (reader, length);
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
			var endByte = GetChunkEnd (reader, length);
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
			
			var endByte = GetChunkEnd (reader, length);
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

		function ReadTransformationChunk (reader, id, length)
		{
			OnLog ('Read transformation chunk (' + id.toString (16) + ', ' + length + ')', 4);
			var matrix = [];
			var i, j;
			for (i = 0; i < 4; i++) {
				for (j = 0; j < 3; j++) {
					matrix.push (reader.ReadFloat32 ());
				}
				if (i < 3) {
					matrix.push (0);
				} else {
					matrix.push (1);
				}
			}

			OnTransformation (matrix);
		}

		function ReadMeshChunk (reader, objectName, id, length)
		{
			OnLog ('Read mesh chunk (' + objectName + ', ' +  id.toString (16) + ', ' + length + ')', 3);

			OnMesh (objectName);
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['TRI_VERTEXL']) {
					ReadVerticesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['TRI_FACEL1']) {
					ReadFacesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['TRI_TRANSFORMATION']) {
					ReadTransformationChunk (reader, chunkId, chunkLength);
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
			
			var endByte = GetChunkEnd (reader, length);
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
			
			var endByte = GetChunkEnd (reader, length);
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

		function ReadObjectNodeChunk (reader, id, length)
		{
			OnLog ('Read object node chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var objectName = '';
			var pivotPoint = [0.0, 0.0, 0.0];
			
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['OBJECT_HIERARCHY']) {
					objectName = ReadName (reader);
					SkipChunk (reader, chunkLength - objectName.length - 1);
				} else if (chunkId == chunks['OBJECT_PIVOT']) {
					pivotPoint[0] = reader.ReadFloat32 ();
					pivotPoint[1] = reader.ReadFloat32 ();
					pivotPoint[2] = reader.ReadFloat32 ();
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
					SkipChunk (reader, chunkLength);
				}
			});

			OnPivotPoint (objectName, pivotPoint);
		}
		
		function ReadKeyFrameChunk (reader, id, length)
		{
			OnLog ('Read keyframe chunk (' + id.toString (16) + ', ' + length + ')', 1);
			
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['OBJECT_NODE']) {
					ReadObjectNodeChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 2);
					SkipChunk (reader, chunkLength);
				}
			});
		}
		
		function ReadMainChunk (reader, id, length)
		{
			OnLog ('Read main chunk (' + id.toString (16) + ', ' + length + ')', 0);
			
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks['EDIT3DS']) {
					ReadEditorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks['KF3DS']) {
					ReadKeyFrameChunk (reader, chunkId, chunkLength);
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
		'TRI_TRANSFORMATION' : 0x4160,
		'TRI_MATERIAL' : 0x4130,
		'TRI_SMOOTH' : 0x4150,
		'KF3DS' : 0xB000,
		'OBJECT_NODE' : 0xB002,
		'OBJECT_HIERARCHY' : 0xB010,
		'OBJECT_PIVOT' : 0xB013,
		'OBJECT_ID' : 0xB030
	};
	
	var reader = new JSM.BinaryReader (arrayBuffer, true);
	ReadFile (reader);
};

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

	function OnUseMaterial (name)
	{
		if (callbacks.onUseMaterial !== undefined && callbacks.onUseMaterial !== null) {
			callbacks.onUseMaterial (name);
		}
	}

	function OnVertex (x, y, z)
	{
		if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
			callbacks.onVertex (x, y, z);
		}
	}

	function OnNormal (x, y, z)
	{
		if (callbacks.onNormal !== undefined && callbacks.onNormal !== null) {
			callbacks.onNormal (x, y, z);
		}
	}

	function OnFace (vertices, normals)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (vertices, normals);
		}
	}

	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
	}

	function ProcessLine (line)
	{
		if (line.length === 0) {
			return;
		}
		
		if (line[0] == '#') {
			return;
		}
		
		var lineParts = line.split (/\s+/);
		if (lineParts.length === 0) {
			return;
		}

		if (lineParts[0] == 'v') {
			if (lineParts.length < 4) {
				return;
			}
			OnVertex (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'vn') {
			if (lineParts.length < 4) {
				return;
			}
			OnNormal (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'f') {
			if (lineParts.length < 4) {
				return;
			}
			
			var vertices = [];
			var normals = [];
			
			var i, partSplitted;
			for (i = 1; i < lineParts.length; i++) {
				partSplitted = lineParts[i].split ('/');
				vertices.push (parseInt (partSplitted[0], 10) - 1);
				if (partSplitted.length == 3) {
					normals.push (partSplitted[2] - 1);
				}
			}
			OnFace (vertices, normals);
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
		} else if (lineParts[0] == 'mtllib') {
			if (lineParts.length < 2) {
				return;
			}
			
			var fileName = lineParts[1];
			var fileStringBuffer = OnFileRequested (fileName);
			if (fileStringBuffer === null) {
				return;
			}
			ProcessFile (fileStringBuffer);
		}
	}
	
	function ProcessFile (stringBuffer)
	{
		var lines = stringBuffer.split ('\n');
		var i, line;
		for (i = 0; i < lines.length; i++) {
			line = lines[i].trim ();
			ProcessLine (line);
		}
	}
	
	ProcessFile (stringBuffer);
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
				name : material.name,
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

		mesh.uvs.push (0.0, 0.0);

		for (i = 0; i < materialCount; i++) {
			trianglesByMaterial.push ([]);
		}

		var triangle;
		for (i = 0; i < body.TriangleCount (); i++) {
			triangle = body.GetTriangle (i);
			if (triangle.mat === undefined || triangle.mat < 0 || triangle.mat >= materialCount) {
				continue;
			}
			trianglesByMaterial[triangle.mat].push (i);
		}

		var triangleCount = 0;
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
					0, 0, 0
				);
			}
			triangleCount = triangleCount + triangles.length;
			mesh.triangles.push (jsonTriangles);
		}
		
		mesh.additionalInfo.push ({name : 'vertexCount', value : mesh.vertices.length / 3});
		mesh.additionalInfo.push ({name : 'triangleCount', value : triangleCount});
	}
	
	var result = {
		version : 1,
		materials : [],
		meshes : []
	};
	
	ConvertMaterials (model, result.materials);
	
	var i, body, mesh;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		if (body.TriangleCount () === 0) {
			continue;
		}
		mesh = {
			name : body.GetName (),
			vertices : [],
			normals : [],
			uvs : [],
			triangles : [],
			additionalInfo : []
		};
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
	var meshNameToIndex = {};
	var meshData = [];
	var currentMeshData = null;
	
	JSM.Read3dsFile (arrayBuffer, {
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
				material.name,
				GetColor (material.ambient),
				GetColor (material.diffuse),
				GetColor (material.specular),
				GetOpacity (material.transparency)
			);
			materialNameToIndex[material.name] = index;
		},
		onMesh : function (meshName) {
			var index = triangleModel.AddBody (new JSM.TriangleBody (meshName));
			currentBody = triangleModel.GetBody (index);
			meshData.push ({
				faceToMaterial : {},
				faceToSmoothingGroup : {}
			});
			currentMeshData = meshData[meshData.length - 1];
			meshNameToIndex[meshName] = index;
		},
		onTransformation : function (matrix) {
			if (currentBody === null || currentMeshData === null) {
				return;
			}
			currentMeshData.transformation = matrix;
		},
		onPivotPoint : function (objectName, pivotPoint) {
			var meshIndex = meshNameToIndex[objectName];
			if (meshIndex === undefined) {
				return;
			}
			meshData[meshIndex].pivotPoint = pivotPoint;
		},
		onVertex : function (x, y, z) {
			if (currentBody === null || currentMeshData === null) {
				return;
			}
			currentBody.AddVertex (x, y, z);
		},
		onFace : function (v0, v1, v2/*, flags*/) {
			if (currentBody === null || currentMeshData === null) {
				return;
			}
			currentBody.AddTriangle (v0, v1, v2);
		},
		onFaceMaterial : function (faceIndex, materialName) {
			if (currentBody === null || currentMeshData === null) {
				return;
			}
			currentMeshData.faceToMaterial[faceIndex] = materialName;
		},
		onFaceSmoothingGroup : function (faceIndex, smoothingGroup) {
			if (currentBody === null || currentMeshData === null) {
				return;
			}
			currentMeshData.faceToSmoothingGroup[faceIndex] = smoothingGroup;
		}
	});
	
	var i, j, triangle;
	var matrix, invMatrix, vertex, transformedVertex;
	var materialName, materialIndex, smoothingGroup;
	for (i = 0; i < triangleModel.BodyCount (); i++) {
		currentBody = triangleModel.GetBody (i);
		currentMeshData = meshData[i];
		
		if (currentMeshData.transformation !== undefined) {
			matrix = JSM.MatrixClone (currentMeshData.transformation);
			invMatrix = JSM.MatrixInvert (currentMeshData.transformation);
			if (currentMeshData.pivotPoint !== undefined) {
				invMatrix[12] -= currentMeshData.pivotPoint[0];
				invMatrix[13] -= currentMeshData.pivotPoint[1];
				invMatrix[14] -= currentMeshData.pivotPoint[2];
			}
			if (invMatrix !== null) {
				matrix = JSM.MatrixMultiply (invMatrix, matrix);
				for (j = 0; j < currentBody.VertexCount (); j++) {
					vertex = currentBody.GetVertex (j);
					transformedVertex = JSM.ApplyTransformation (matrix, vertex);
					currentBody.SetVertex (j, transformedVertex.x, transformedVertex.y, transformedVertex.z);
				}
			}
		}

		for (j = 0; j < currentBody.TriangleCount (); j++) {
			triangle = currentBody.GetTriangle (j);
			
			materialName = currentMeshData.faceToMaterial[j];
			if (materialName !== undefined) {
				materialIndex = materialNameToIndex[materialName];
				if (materialIndex !== undefined) {
					triangle.mat = materialIndex;
				}
			}
			
			smoothingGroup = currentMeshData.faceToSmoothingGroup[j];
			if (smoothingGroup !== undefined) {
				triangle.curve = smoothingGroup;
			}
		}
	}
	
	triangleModel.Finalize ();
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
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

	var triangleModel = new JSM.TriangleModel ();
	var index = triangleModel.AddBody (new JSM.TriangleBody ('Model'));
	var currentBody = triangleModel.GetBody (index);
	var materialNameToIndex = {};
	var currentMaterial = null;
	var currentMaterialIndex = null;
	
	JSM.ReadObjFile (stringBuffer, {
		onNewMaterial : function (name) {
			var index = triangleModel.AddMaterial (
				name,
				{r : 1.0, g : 0.0, b : 0.0},
				{r : 1.0, g : 0.0, b : 0.0},
				{r : 0.0, g : 0.0, b : 0.0},
				1.0
			);
			currentMaterial = triangleModel.GetMaterial (index);
			materialNameToIndex[name] = index;
		},
		onMaterialComponent : function (name, red, green, blue) {
			function SetMaterialColor (color, r, g, b)
			{
				color.r = r;
				color.g = g;
				color.b = b;
			}
			
			if (currentMaterial === null) {
				return;
			}
			if (name == 'Ka') {
				SetMaterialColor (currentMaterial.ambient, red, green, blue);
			} else if (name == 'Kd') {
				SetMaterialColor (currentMaterial.diffuse, red, green, blue);
			} else if (name == 'Ks') {
				SetMaterialColor (currentMaterial.specular, red, green, blue);
			}
		},
		onUseMaterial : function (name) {
			var materialIndex = materialNameToIndex[name];
			if (materialIndex !== undefined) {
				currentMaterialIndex = materialIndex;
			}
		},
		onVertex : function (x, y, z) {
			currentBody.AddVertex (z, x, y);
		},
		onNormal : function (x, y, z) {
			currentBody.AddNormal (z, x, y);
		},
		onFace : function (vertices, normals) {
			var i, triangle, triangleIndex;
			var hasNormals = (vertices.length == normals.length);
			var count = vertices.length;
			for (i = 0; i < count - 2; i++) {
				if (hasNormals) {
					triangleIndex = currentBody.AddTriangle (
						vertices[0], vertices[(i + 1) % count], vertices[(i + 2) % count],
						normals[0], normals[(i + 1) % count], normals[(i + 2) % count]
					);
				} else {
					triangleIndex = currentBody.AddTriangle (
						vertices[0], vertices[(i + 1) % count], vertices[(i + 2) % count]
					);
				}
				if (currentMaterialIndex !== null) {
					triangle = currentBody.GetTriangle (triangleIndex);
					triangle.mat = currentMaterialIndex;
				}
			}
		},
		onFileRequested : OnFileRequested
	});

	triangleModel.Finalize ();
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
