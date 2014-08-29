JSM.Read3dsFile = function (arrayBuffer, callbacks)
{
	function OnLog (logText, logLevel)
	{
		if (callbacks.onLog !== undefined && callbacks.onLog !== null) {
			callbacks.onLog (logText, logLevel);
		}
	}

	function OnError ()
	{
		if (callbacks.onError !== undefined && callbacks.onError !== null) {
			callbacks.onError ();
		}
	}

	function OnMesh ()
	{
		if (callbacks.onMesh !== undefined && callbacks.onMesh !== null) {
			callbacks.onMesh ();
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

	function ReadChunk (reader, onReady)
	{
		var chunkId = reader.ReadUnsignedInteger16 ();
		var chunkLength = reader.ReadUnsignedInteger32 ();
		onReady (chunkId, chunkLength);	
	}
	
	function ReadChunks (reader, endByte, onReady)
	{
		var chunkId, chunkLength;
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
			while (count < 12) {
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
			SkipChunk (reader, length);
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
			
			var endByte = reader.GetPosition () + length - 6;
			var name = ReadName (reader);

			// todo: identify material by name
			var faces = [];
			var faceCount = reader.ReadUnsignedInteger16 ();
			var i, faceIndex;
			for (i = 0; i < faceCount; i++) {
				faceIndex = reader.ReadUnsignedInteger16 ();
				faces.push (faceIndex);
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
				OnFace (v0, v1, v2);
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

		function ReadMeshChunk (reader, name, id, length)
		{
			OnLog ('Read mesh chunk (' + name + ', ' +  id.toString (16) + ', ' + length + ')', 3);
			
			OnMesh ();
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

		function ReadLightChunk (reader, name, id, length)
		{
			OnLog ('Skip light chunk (' + name + ', ' + id.toString (16) + ', ' + length + ')', 3);
			
			SkipChunk (reader, length);
		}

		function ReadCameraChunk (reader, name, id, length)
		{
			OnLog ('Skip camera chunk (' + name + ', ' +  id.toString (16) + ', ' + length + ')', 3);
			
			SkipChunk (reader, length);
		}

		function ReadObjectChunk (reader, id, length)
		{
			OnLog ('Read object chunk (' + id.toString (16) + ', ' + length + ')', 2);
			
			var endByte = reader.GetPosition () + length - 6;
			var name = ReadName (reader);
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == 0x4100) {
					ReadMeshChunk (reader, name, chunkId, chunkLength);
				} else if (chunkId == 0x4600) {
					ReadLightChunk (reader, name, chunkId, chunkLength);
				} else if (chunkId == 0x4700) {
					ReadCameraChunk (reader, name, chunkId, chunkLength);
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
			if (chunkId == 0x4D4D) {
				ReadMainChunk (reader, chunkId, chunkLength);
			} else {
				OnLog ('Skip chunk (' + chunkId.toString (16) + ', ' + length + ')', 0);
				SkipChunk (reader, chunkLength);
			}			
		});
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {}
	}

	var reader = new JSM.BinaryReader (arrayBuffer, true);
	ReadFile (reader);
};
