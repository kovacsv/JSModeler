JSM.Read3dsFile = function (arrayBuffer, callbacks)
{
	function Log (logText)
	{
		if (callbacks.onLog !== undefined && callbacks.onLog !== null) {
			callbacks.onLog (logText);
		}
	}

	function Error ()
	{
		if (callbacks.onError !== undefined && callbacks.onError !== null) {
			callbacks.onError ();
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
			Log ('---Read material chunk (' + id.toString (16) + ', ' + length + ')');
			SkipChunk (reader, length);
		}

		function ReadVerticesChunk (reader, id, length)
		{
			Log ('-----Read vertices chunk (' + id.toString (16) + ', ' + length + ')');
			//SkipChunk (reader, length);
			var vertexCount = reader.ReadUnsignedInteger16 ();
			var i, x, y, z;
			for (i = 0; i < vertexCount; i++) {
				x = reader.ReadFloat32 ();
				y = reader.ReadFloat32 ();
				z = reader.ReadFloat32 ();
				Log ('------Vertex found (' + [x, y, z] + ')');
			}
		}	
		
		function ReadMeshChunk (reader, name, id, length)
		{
			Log ('----Read mesh chunk (' + name + ', ' +  id.toString (16) + ', ' + length + ')');
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == 0x4110) {
					ReadVerticesChunk (reader, chunkId, chunkLength);
				} else {
					Log ('-----Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')');
					SkipChunk (reader, chunkLength);
				}
			});
		}

		function ReadLightChunk (reader, name, id, length)
		{
			Log ('----Read light chunk (' + name + ', ' + id.toString (16) + ', ' + length + ')');
			SkipChunk (reader, length);
		}

		function ReadCameraChunk (reader, name, id, length)
		{
			Log ('----Read camera chunk (' + name + ', ' +  id.toString (16) + ', ' + length + ')');
			SkipChunk (reader, length);
		}

		function ReadObjectChunk (reader, id, length)
		{
			Log ('---Read object chunk (' + id.toString (16) + ', ' + length + ')');
			var name = ReadName (reader);
			var endByte = reader.GetPosition () + length - 6 - name.length - 1;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == 0x4100) {
					ReadMeshChunk (reader, name, chunkId, chunkLength);
				} else if (chunkId == 0x4600) {
					ReadLightChunk (reader, name, chunkId, chunkLength);
				} else if (chunkId == 0x4700) {
					ReadCameraChunk (reader, name, chunkId, chunkLength);
				} else {
					Log ('----Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')');
					SkipChunk (reader, chunkLength);
				}
			});
		}

		function ReadEditorChunk (reader, id, length)
		{
			Log ('--Read editor chunk (' + id.toString (16) + ', ' + length + ')');
			
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == 0xAFFF) {
					ReadMaterialChunk (reader, chunkId, chunkLength);
				} else if (chunkId == 0x4000) {
					ReadObjectChunk (reader, chunkId, chunkLength);
				} else {
					Log ('---Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')');
					SkipChunk (reader, chunkLength);
				}
			});
		}
		
		function ReadMainChunk (reader, id, length)
		{
			Log ('-Read main chunk (' + id.toString (16) + ', ' + length + ')');
			
			var endByte = reader.GetPosition () + length - 6;
			ReadChunks (reader, endByte, function (chunkId, chunkLength) {
				if (chunkId == 0x3D3D) {
					ReadEditorChunk (reader, chunkId, chunkLength);
				} else {
					Log ('--Skip chunk (' + chunkId.toString (16) + ', ' + chunkLength + ')');
					SkipChunk (reader, chunkLength);
				}
			});
		}
	
		var endByte = reader.GetByteLength ();
		ReadChunks (reader, endByte, function (chunkId, chunkLength) {
			if (chunkId == 0x4D4D) {
				ReadMainChunk (reader, chunkId, chunkLength);
			} else {
				Log ('Skip chunk (' + chunkId.toString (16) + ', ' + length + ')');
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
