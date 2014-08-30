JSM.Read3dsFile = function (arrayBuffer, callbacks)
{
	function OnLog (logText, logLevel)
	{
		if (callbacks.onLog !== undefined && callbacks.onLog !== null) {
			callbacks.onLog (logText, logLevel);
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

	function OnFace (v0, v1, v2)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (v0, v1, v2);
		}
	}

	function OnFaceMaterial (v0, v1, v2)
	{
		if (callbacks.onFaceMaterial !== undefined && callbacks.onFaceMaterial !== null) {
			callbacks.onFaceMaterial (v0, v1, v2);
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
		
		function ReadMaterialChunk (reader, id, length)
		{
			OnLog ('Read material chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')', 3);
				SkipChunk (reader, chunkLength);
			});
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
				OnFaceMaterial (materialName, faceIndex);
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
				if (chunkId == 0x4130) {
					ReadFaceMaterialsChunk (reader, chunkId, chunkLength);
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
				if (chunkId == 0x4110) {
					ReadVerticesChunk (reader, chunkId, chunkLength);
				} else if (chunkId == 0x4120) {
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
				if (chunkId == 0x4100) {
					ReadMeshChunk (reader, objectName, chunkId, chunkLength);
				} else if (chunkId == 0x4600) {
					ReadLightChunk (reader, objectName, chunkId, chunkLength);
				} else if (chunkId == 0x4700) {
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
				if (chunkId == 0xAFFF) {
					ReadMaterialChunk (reader, chunkId, chunkLength);
				} else if (chunkId == 0x4000) {
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
				if (chunkId == 0x3D3D) {
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
				OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + length + ')', 0);
				SkipChunk (reader, chunkLength);
			}
		});
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var chunks = {
		'MAIN3DS' : 0x4D4D
	};
	
	var reader = new JSM.BinaryReader (arrayBuffer, true);
	ReadFile (reader);
};
