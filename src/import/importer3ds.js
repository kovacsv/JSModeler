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
	
	function OnObjectNode (objectNode)
	{
		if (callbacks.onObjectNode !== undefined && callbacks.onObjectNode !== null) {
			callbacks.onObjectNode (objectNode);
		}
	}

	function OnVertex (x, y, z)
	{
		if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
			callbacks.onVertex (x, y, z);
		}
	}

	function OnTextureVertex (x, y)
	{
		if (callbacks.onTextureVertex !== undefined && callbacks.onTextureVertex !== null) {
			callbacks.onTextureVertex (x, y);
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

	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
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

	function ReadVector (reader)
	{
		var result = [];
		var i;
		for (i = 0; i < 3; i++) {
			result[i] = reader.ReadFloat32 ();
		}
		return result;
	}

	function ReadChunks (reader, endByte, onReady)
	{
		while (reader.GetPosition () <= endByte - 6) {
			ReadChunk (reader, onReady);
		}
	}

	function ReadFile (reader)
	{
		function ReadColorChunk (reader, id, length)
		{
			var color = {
				r : 0.0,
				g : 0.0,
				b : 0.0
			};
			var endByte = GetChunkEnd (reader, length);
			var hasLinColor = false;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks.MAT_COLOR) {
					if (!hasLinColor) {
						color.r = reader.ReadUnsignedCharacter () / 255.0;
						color.g = reader.ReadUnsignedCharacter () / 255.0;
						color.b = reader.ReadUnsignedCharacter () / 255.0;
					}
				} else if (chunkId == chunks.MAT_LIN_COLOR) {
					color.r = reader.ReadUnsignedCharacter () / 255.0;
					color.g = reader.ReadUnsignedCharacter () / 255.0;
					color.b = reader.ReadUnsignedCharacter () / 255.0;
					hasLinColor = true;
				} else if (chunkId == chunks.MAT_COLOR_F) {
					if (!hasLinColor) {
						color.r = reader.ReadFloat32 ();
						color.g = reader.ReadFloat32 ();
						color.b = reader.ReadFloat32 ();
					}
				} else if (chunkId == chunks.MAT_LIN_COLOR_F) {
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
				if (chunkId == chunks.PERCENTAGE) {
					percentage = reader.ReadUnsignedInteger16 () / 100.0;
				} else if (chunkId == chunks.PERCENTAGE_F) {
					percentage = reader.ReadFloat32 ();
				} else {
					SkipChunk (reader, chunkLength);
				}
			});
			return percentage;
		}

		function ReadTextureMapChunk (reader, id, length)
		{
			var textureMap = {
				name : null,
				offset : {x : 0.0, y : 0.0},
				scale :  {x : 0.0, y : 0.0},
				rotation : 0.0
			};
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks.MAT_TEXMAP_NAME) {
					textureMap.name = ReadName (reader);
				} else if (chunkId == chunks.MAT_TEXMAP_UOFFSET) {
					textureMap.offset.x = reader.ReadFloat32 ();
				} else if (chunkId == chunks.MAT_TEXMAP_VOFFSET) {
					textureMap.offset.y = reader.ReadFloat32 ();
				} else if (chunkId == chunks.MAT_TEXMAP_USCALE) {
					textureMap.scale.x = reader.ReadFloat32 ();
				} else if (chunkId == chunks.MAT_TEXMAP_VSCALE) {
					textureMap.scale.y = reader.ReadFloat32 ();
				} else if (chunkId == chunks.MAT_TEXMAP_ROTATION) {
					textureMap.rotation = reader.ReadFloat32 ();
				} else {
					SkipChunk (reader, chunkLength);
				}
			});
			return textureMap;
		}

		function ReadMaterialChunk (reader, id, length)
		{
			OnLog ('Read material chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var material = {};
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks.MAT_NAME) {
					OnLog ('Read material name chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.name = ReadName (reader);
				} else if (chunkId == chunks.MAT_AMBIENT) {
					OnLog ('Read material ambient chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.ambient = ReadColorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.MAT_DIFFUSE) {
					OnLog ('Read material diffuse chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.diffuse = ReadColorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.MAT_SPECULAR) {
					OnLog ('Read material specular chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.specular = ReadColorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.MAT_SHININESS) {
					OnLog ('Read material shininess chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.shininess = ReadPercentageChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.MAT_TRANSPARENCY) {
					OnLog ('Read material transparency chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.transparency = ReadPercentageChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.MAT_TEXMAP) {
					OnLog ('Read material texture map chunk (' + id.toString (16) + ', ' + length + ')', 3);
					material.textureMap = ReadTextureMapChunk (reader, chunkId, chunkLength);
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

		function ReadTextureVerticesChunk (reader, id, length)
		{
			OnLog ('Read texture vertices chunk (' + id.toString (16) + ', ' + length + ')', 4);
			
			var texVertexCount = reader.ReadUnsignedInteger16 ();
			var i, x, y;
			for (i = 0; i < texVertexCount; i++) {
				x = reader.ReadFloat32 ();
				y = reader.ReadFloat32 ();
				OnTextureVertex (x, y);
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
				if (chunkId == chunks.TRI_MATERIAL) {
					ReadFaceMaterialsChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.TRI_SMOOTH) {
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
				if (chunkId == chunks.TRI_VERTEX) {
					ReadVerticesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.TRI_TEXVERTEX) {
					ReadTextureVerticesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.TRI_FACE) {
					ReadFacesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.TRI_TRANSFORMATION) {
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
				if (chunkId == chunks.OBJ_TRIMESH) {
					ReadMeshChunk (reader, objectName, chunkId, chunkLength);
				} else if (chunkId == chunks.OBJ_LIGHT) {
					ReadLightChunk (reader, objectName, chunkId, chunkLength);
				} else if (chunkId == chunks.OBJ_CAMERA) {
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
				if (chunkId == chunks.EDIT_MATERIAL) {
					ReadMaterialChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.EDIT_OBJECT) {
					ReadObjectChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 2);
					SkipChunk (reader, chunkLength);
				}
			});
		}

		function ReadObjectNodeChunk (reader, id, length)
		{
			function ReadTrackVector (reader, type)
			{
				var result = [];
				reader.Skip (10);
				
				var i, flags, current, tmp;
				var keyNum = reader.ReadInteger32 ();
				for (i = 0; i < keyNum; i++) {
					reader.ReadInteger32 ();
					flags = reader.ReadUnsignedInteger16 ();
					if (flags !== 0) {
						reader.ReadFloat32 ();
					}
					
					current = null;
					if (type == chunks.OBJECT_ROTATION) {
						tmp = reader.ReadFloat32 ();
						current = ReadVector (reader);
						current[3] = tmp;
					} else {
						current = ReadVector (reader);
					}
					result.push (current);
				}

				return result;
			}
		
			OnLog ('Read object node chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var objectNode = {
				name : '',
				nodeId : -1,
				flags : -1,
				userId : -1,
				pivot : [0.0, 0.0, 0.0],
				positions : [],
				rotations : [],
				scales : []
			};
			
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks.OBJECT_HIERARCHY) {
					objectNode.name = ReadName (reader);
					objectNode.flags = reader.ReadUnsignedInteger32 ();
					objectNode.userId = reader.ReadUnsignedInteger16 ();
				} else if (chunkId == chunks.OBJECT_PIVOT) {
					objectNode.pivot = ReadVector (reader);
				} else if (chunkId == chunks.OBJECT_POSITION) {
					objectNode.positions = ReadTrackVector (reader, chunks.OBJECT_POSITION);
				} else if (chunkId == chunks.OBJECT_ROTATION) {
					objectNode.rotations = ReadTrackVector (reader, chunks.OBJECT_ROTATION);
				} else if (chunkId == chunks.OBJECT_SCALE) {
					objectNode.scales = ReadTrackVector (reader, chunks.OBJECT_SCALE);
				} else if (chunkId == chunks.OBJECT_ID) {
					objectNode.nodeId = reader.ReadUnsignedInteger16 ();
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
					SkipChunk (reader, chunkLength);
				}
			});

			OnObjectNode (objectNode);
		}
		
		function ReadKeyFrameChunk (reader, id, length)
		{
			OnLog ('Read keyframe chunk (' + id.toString (16) + ', ' + length + ')', 1);
			
			var endByte = GetChunkEnd (reader, length);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == chunks.OBJECT_NODE) {
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
				if (chunkId == chunks.EDIT3DS) {
					ReadEditorChunk (reader, chunkId, chunkLength);
				} else if (chunkId == chunks.KF3DS) {
					ReadKeyFrameChunk (reader, chunkId, chunkLength);
				} else {
					OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 1);
					SkipChunk (reader, chunkLength);
				}
			});
		}
	
		var endByte = reader.GetByteLength ();
		ReadChunks (reader, endByte, function (chunkId, chunkLength) {
			if (chunkId == chunks.MAIN3DS) {
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
		MAIN3DS : 0x4D4D,
		EDIT3DS : 0x3D3D,
		EDIT_MATERIAL : 0xAFFF,
		MAT_NAME : 0xA000,
		MAT_AMBIENT : 0xA010,
		MAT_DIFFUSE : 0xA020,
		MAT_SPECULAR : 0xA030,
		MAT_SHININESS : 0xA040,
		MAT_TRANSPARENCY : 0xA050,
		MAT_COLOR_F : 0x0010,
		MAT_COLOR : 0x0011,
		MAT_LIN_COLOR : 0x0012,
		MAT_LIN_COLOR_F : 0x0013,
		MAT_TEXMAP : 0xA200,
		MAT_TEXMAP_NAME : 0xA300,
		MAT_TEXMAP_UOFFSET : 0xA358,
		MAT_TEXMAP_VOFFSET : 0xA35A,
		MAT_TEXMAP_USCALE : 0xA354,
		MAT_TEXMAP_VSCALE : 0xA356,
		MAT_TEXMAP_ROTATION : 0xA35C,
		PERCENTAGE : 0x0030,
		PERCENTAGE_F : 0x0031,
		EDIT_OBJECT : 0x4000,
		OBJ_TRIMESH : 0x4100,
		OBJ_LIGHT : 0x4600,
		OBJ_CAMERA : 0x4700,
		TRI_VERTEX : 0x4110,
		TRI_TEXVERTEX : 0x4140,
		TRI_FACE : 0x4120,
		TRI_TRANSFORMATION : 0x4160,
		TRI_MATERIAL : 0x4130,
		TRI_SMOOTH : 0x4150,
		KF3DS : 0xB000,
		OBJECT_NODE : 0xB002,
		OBJECT_HIERARCHY : 0xB010,
		OBJECT_PIVOT : 0xB013,
		OBJECT_POSITION : 0xB020,
		OBJECT_ROTATION : 0xB021,
		OBJECT_SCALE : 0xB022,
		OBJECT_ID : 0xB030
	};
	
	var reader = new JSM.BinaryReader (arrayBuffer, true);
	ReadFile (reader);
};

JSM.Convert3dsToJsonData = function (arrayBuffer, callbacks)
{
	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
	}

	function FinalizeMeshes (nodeHierarcy, triangleModel, materialNameToIndex)
	{
		function ApplyTransformation (body, node, nodeHierarcy)
		{
			function MatrixScale (matrix, scale)
			{
				var x = scale[0];
				var y = scale[1];
				var z = scale[2];
			
				var i;
				for (i = 0; i < 4; i++) {
					matrix[0 * 4 + i] *= x;
					matrix[1 * 4 + i] *= y;
					matrix[2 * 4 + i] *= z;
				}
				
				return matrix;
			}

			function MatrixTranslate (matrix, translation)
			{
				var x = translation[0];
				var y = translation[1];
				var z = translation[2];

				var i;
				for (i = 0; i < 3; i++) {
					matrix[3 * 4 + i] += matrix[0 * 4 + i] * x + matrix[1 * 4 + i] * y + matrix[2 * 4 + i] * z;
				}
				
				return matrix;
			}

			function MatrixRotate (matrix, quaternion)
			{
				var rotation = JSM.MatrixRotationQuaternion (quaternion);
				return JSM.MatrixMultiply (rotation, matrix);
			}

			function TransformBodyVertices (body, matrix)
			{
				var i, vertex, transformedVertex;
				for (i = 0; i < body.VertexCount (); i++) {
					vertex = body.GetVertex (i);
					transformedVertex = JSM.ApplyTransformation (matrix, vertex);
					body.SetVertex (i, transformedVertex.x, transformedVertex.y, transformedVertex.z);
				}			
			}
			
			function FlipByXCoordinates (body, matrix, invMatrix)	
			{
				var determinant = JSM.MatrixDeterminant (matrix);
				if (!JSM.IsNegative (determinant)) {
					return;
				}

				var flippedMatrix = JSM.MatrixClone (matrix);
				MatrixScale (flippedMatrix, [-1.0, 1.0, 1.0]);
				
				var finalMatrix = JSM.MatrixMultiply (invMatrix, flippedMatrix);
				TransformBodyVertices (body, finalMatrix);
			}

			function GetNodeTransformation (node, nodeHierarcy)
			{
				function GetNodePosition (node)
				{
					if (node.positions.length === 0) {
						return [0.0, 0.0, 0.0];
					}
					return node.positions[0];
				}
			
				function GetNodeRotation (node)
				{
					function GetQuatFromAxisAndAngle (quat)
					{
						var result = [0.0, 0.0, 0.0, 1.0];
						var length = Math.sqrt (quat[0] * quat[0] + quat[1] * quat[1] + quat[2] * quat[2]);
						if (JSM.IsPositive (length)) {
							var omega = quat[3] * -0.5;
							var si = Math.sin (omega) / length;
							result = [si * quat[0], si * quat[1], si * quat[2], Math.cos (omega)];
						}
						return result;
					}

					if (node.rotations.length === 0) {
						return [0.0, 0.0, 0.0, 0.0];
					}
					
					var quat = node.rotations[0];
					return GetQuatFromAxisAndAngle (quat);
				}

				function GetNodeScale (node)
				{
					if (node.scales.length === 0) {
						return [0.0, 0.0, 0.0, 0.0];
					}
					return node.scales[0];
				}
				
				if (node.matrix !== undefined) {
					return node.matrix;
				}
				
				var result = JSM.MatrixIdentity ();
				result = MatrixTranslate (result, GetNodePosition (node));
				result = MatrixRotate (result, GetNodeRotation (node));
				result = MatrixScale (result, GetNodeScale (node));
				
				if (node.userId != 65535) {
					var parentIndex = nodeHierarcy.nodeIdToIndex[node.userId];
					if (parentIndex !== undefined) {
						var parentNode = nodeHierarcy.nodes[parentIndex];
						var parentTransformation = GetNodeTransformation (parentNode, nodeHierarcy);
						result = JSM.MatrixMultiply (result, parentTransformation);
					}
				}
				
				node.matrix = result;
				return result;
			}
		
			function GetNodePivotPoint (node)
			{
				if (node === undefined || node === null) {
					return [0.0, 0.0, 0.0];
				}
				return node.pivot;
			}

			function GetMeshTransformation (mesh)
			{
				if (mesh === undefined || mesh === null) {
					return null;
				}
				return mesh.transformation;
			}
			
			var currentMeshData = body.meshData;
			var meshTransformation = GetMeshTransformation (currentMeshData);
			if (meshTransformation === null) {
				return;
			}
			
			var nodeTransformation = null;
			if (node !== null) {
				nodeTransformation = GetNodeTransformation (node, nodeHierarcy);
			} else {
				nodeTransformation = meshTransformation;
			}

			var matrix = JSM.MatrixClone (nodeTransformation);
			var meshMatrix = JSM.MatrixClone (meshTransformation);
			var invMeshMatrix = JSM.MatrixInvert (meshMatrix);
			if (invMeshMatrix === null) {
				return;
			}

			FlipByXCoordinates (body, meshMatrix, invMeshMatrix);

			var nodePivotPoint = GetNodePivotPoint (node);
			MatrixTranslate (matrix, [-nodePivotPoint[0], -nodePivotPoint[1], -nodePivotPoint[2]]);
			var finalMatrix = JSM.MatrixMultiply (invMeshMatrix, matrix);
			TransformBodyVertices (body, finalMatrix);
		}

		function FinalizeMaterials (body, materialNameToIndex)
		{
			var hasTextureCoordinates = (body.UVCount () == body.VertexCount ());
			var currentMeshData = body.meshData;
			var i, triangle, materialName, materialIndex, smoothingGroup;
			for (i = 0; i < body.TriangleCount (); i++) {
				triangle = body.GetTriangle (i);
				if (hasTextureCoordinates) {
					triangle.u0 = triangle.v0;
					triangle.u1 = triangle.v1;
					triangle.u2 = triangle.v2;
				}
				
				materialName = currentMeshData.faceToMaterial[i];
				if (materialName !== undefined) {
					materialIndex = materialNameToIndex[materialName];
					if (materialIndex !== undefined) {
						triangle.mat = materialIndex;
					}
				}
				
				smoothingGroup = currentMeshData.faceToSmoothingGroup[i];
				if (smoothingGroup !== undefined) {
					triangle.curve = smoothingGroup;
				}
			}
		}

		function FinalizeMesh (body, node, materialNameToIndex, nodeHierarcy)
		{
			ApplyTransformation (body, node, nodeHierarcy);
			FinalizeMaterials (body, materialNameToIndex);		
		}
		
		function DuplicateBody (model, body, bodyIndex, instanceIndex)
		{
			var clonedBody = body.Clone ();
			clonedBody.SetName (clonedBody.GetName () + ' (' + instanceIndex + ')');
			if (bodyIndex < model.BodyCount ()) {
				model.AddBodyToIndex (clonedBody, bodyIndex);
			} else {
				model.AddBody (clonedBody);
			}
			return clonedBody;
		}

		var i, j, currentBody, currentMeshData, currentNode;
		var firstNode, addedBody;
		for (i = 0; i < triangleModel.BodyCount (); i++) {
			currentBody = triangleModel.GetBody (i);
			currentMeshData = currentBody.meshData;
			if (currentMeshData.objectNodes.length === 0) {
				FinalizeMesh (currentBody, null, materialNameToIndex, nodeHierarcy);
			} else {
				firstNode = nodeHierarcy.nodes[currentMeshData.objectNodes[0]];
				for (j = 1; j < currentMeshData.objectNodes.length; j++) {
					currentNode = nodeHierarcy.nodes[currentMeshData.objectNodes[j]];
					addedBody = DuplicateBody (triangleModel, currentBody, i + 1, j + 1);
					addedBody.meshData = currentBody.meshData;
					FinalizeMesh (addedBody, currentNode, materialNameToIndex, nodeHierarcy);
					i = i + 1;
				}
				FinalizeMesh (currentBody, firstNode, materialNameToIndex, nodeHierarcy);
			}
		}
	}

	var triangleModel = new JSM.TriangleModel ();
	var currentBody = null;
	
	var materialNameToIndex = {};
	var bodyNameToIndex = {};

	var nodeHierarcy = {
		nodes : [],
		nodeIdToIndex : {}
	};
	
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
			
			function GetShininess (shininess)
			{
				if (shininess === undefined || shininess === null) {
					return 0.0;
				}
				return shininess;
			}
			
			var index = triangleModel.AddMaterial (
				material.name,
				GetColor (material.ambient),
				GetColor (material.diffuse),
				GetColor (material.specular),
				GetShininess (material.shininess),
				GetOpacity (material.transparency)
			);

			var currentMaterial = triangleModel.GetMaterial (index);
			if (material.textureMap !== undefined && material.textureMap !== null) {
				var textureBuffer = OnFileRequested (material.textureMap.name);
				if (textureBuffer !== null) {
					var blob = new window.Blob ([textureBuffer]);
					var blobURL = window.URL.createObjectURL (blob);
					currentMaterial.texture = blobURL;
					currentMaterial.offset = material.textureMap.offset;
					currentMaterial.scale = material.textureMap.scale;
					currentMaterial.rotation = -material.textureMap.rotation;
				}
			}

			if (materialNameToIndex[material.name] === undefined) {
				materialNameToIndex[material.name] = index;
			}
		},
		onMesh : function (meshName) {
			var index = triangleModel.AddBody (new JSM.TriangleBody (meshName));
			currentBody = triangleModel.GetBody (index);
			currentBody.meshData ={
				faceToMaterial : {},
				faceToSmoothingGroup : {},
				objectNodes : [],
				transformation : null
			};
			bodyNameToIndex[meshName] = index;
		},
		onTransformation : function (matrix) {
			if (currentBody === null) {
				return;
			}
			currentBody.meshData.transformation = matrix;
		},
		onObjectNode : function (objectNode) {
			var nodeIndex = nodeHierarcy.nodes.length;
			nodeHierarcy.nodes.push (objectNode);
			nodeHierarcy.nodeIdToIndex[objectNode.nodeId] = nodeIndex;

			var bodyIndex = bodyNameToIndex[objectNode.name];
			if (bodyIndex === undefined) {
				return;
			}
			var body = triangleModel.GetBody (bodyIndex);
			body.meshData.objectNodes.push (nodeIndex);
		},
		onVertex : function (x, y, z) {
			if (currentBody === null) {
				return;
			}
			currentBody.AddVertex (x, y, z);
		},
		onTextureVertex : function (x, y) {
			if (currentBody === null) {
				return;
			}
			currentBody.AddUV (x, y);
		},
		onFace : function (v0, v1, v2) {
			if (currentBody === null) {
				return;
			}
			currentBody.AddTriangle (v0, v1, v2);
		},
		onFaceMaterial : function (faceIndex, materialName) {
			if (currentBody === null) {
				return;
			}
			currentBody.meshData.faceToMaterial[faceIndex] = materialName;
		},
		onFaceSmoothingGroup : function (faceIndex, smoothingGroup) {
			if (currentBody === null) {
				return;
			}
			currentBody.meshData.faceToSmoothingGroup[faceIndex] = smoothingGroup;
		},
		onFileRequested : OnFileRequested
	});
	
	FinalizeMeshes (nodeHierarcy, triangleModel, materialNameToIndex);
	triangleModel.Finalize ();

	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
