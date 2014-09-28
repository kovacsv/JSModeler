JSM.ReadBinaryStlFile = function (arrayBuffer, callbacks)
{
	function OnFace (v0, v1, v2, normal)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (v0, v1, v2, normal);
		}
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

	var reader = new JSM.BinaryReader (arrayBuffer, true);
	reader.Skip (80);
	
	var triangleCount = reader.ReadUnsignedInteger32 ();
	var i, v0, v1, v2, normal;
	for (i = 0; i < triangleCount; i++) {
		normal = ReadVector (reader);
		v0 = ReadVector (reader);
		v1 = ReadVector (reader);
		v2 = ReadVector (reader);
		reader.Skip (2);
		OnFace (v0, v1, v2, normal);
	}
};

JSM.ReadAsciiStlFile = function (stringBuffer, callbacks)
{
	function OnFace (v0, v1, v2, normal)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (v0, v1, v2, normal);
		}
	}

	function ProcessLine (lines, lineIndex)
	{
		function GetLine (lines, lineIndex)
		{
			return lines[lineIndex].trim ();
		}
	
		function GetVertexFromLine (lines, lineIndex)
		{
			var line = GetLine (lines, lineIndex);
			var lineParts = line.split (/\s+/);
			if (lineParts.length < 4 || lineParts[0] != 'vertex') {
				return null;
			}
			var vertex = [parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3])];
			return vertex;
		}
	
		var line = GetLine (lines, lineIndex);
		if (line.length === 0) {
			return lineIndex + 1;
		}
		
		var lineParts = line.split (/\s+/);
		if (lineParts.length === 0) {
			return lineIndex + 1;
		}

		if (lineParts[0] == 'solid') {
			return lineIndex + 1;
		} else if (lineParts[0] == 'facet' && lineParts[1] == 'normal') {
			if (lineParts.length < 5) {
				return -1;
			}
			
			var normal = [parseFloat (lineParts[2]), parseFloat (lineParts[3]), parseFloat (lineParts[4])];
			var v0 = GetVertexFromLine (lines, lineIndex + 2);
			var v1 = GetVertexFromLine (lines, lineIndex + 3);
			var v2 = GetVertexFromLine (lines, lineIndex + 4);
			if (v0 === null || v1 === null || v2 === null) {
				return -1;
			}
			
			OnFace (v0, v1, v2, normal);
			return lineIndex + 6;
		}

		return lineIndex + 1;
	}
	
	var lineIndex = 0;
	var lines = stringBuffer.split ('\n');
	while (lineIndex < lines.length && lineIndex != -1) {
		lineIndex = ProcessLine (lines, lineIndex);
	}
};

JSM.ConvertStlToJsonData = function (arrayBuffer)
{
	function IsBinaryFile (arrayBuffer)
	{
		var byteLength = arrayBuffer.byteLength;
		if (byteLength < 84) {
			return false;
		}
		
		var reader = new JSM.BinaryReader (arrayBuffer, true);
		reader.Skip (80);
		
		var triangleCount = reader.ReadUnsignedInteger32 ();
		if (byteLength != triangleCount * 50 + 84) {
			return false;
		}
		
		return true;
	}

	var triangleModel = new JSM.TriangleModel ();
	var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
	var currentBody = triangleModel.GetBody (index);

	if (IsBinaryFile (arrayBuffer)) {
		JSM.ReadBinaryStlFile (arrayBuffer, {
			onFace : function (v0, v1, v2, normal) {
				var v0Index = currentBody.AddVertex (v0[0], v0[1], v0[2]);
				var v1Index = currentBody.AddVertex (v1[0], v1[1], v1[2]);
				var v2Index = currentBody.AddVertex (v2[0], v2[1], v2[2]);
				var triangleNormal = JSM.VectorNormalize (new JSM.Vector (normal[0], normal[1], normal[2]));
				var normalIndex = currentBody.AddNormal (triangleNormal.x, triangleNormal.y, triangleNormal.z);
				currentBody.AddTriangle (v0Index, v1Index, v2Index, normalIndex, normalIndex, normalIndex);
			}
		});
	} else {
		var stringBuffer = String.fromCharCode.apply (null, new Uint8Array(arrayBuffer));
		JSM.ReadAsciiStlFile (stringBuffer, {
			onFace : function (v0, v1, v2, normal) {
				var v0Index = currentBody.AddVertex (v0[0], v0[1], v0[2]);
				var v1Index = currentBody.AddVertex (v1[0], v1[1], v1[2]);
				var v2Index = currentBody.AddVertex (v2[0], v2[1], v2[2]);
				var triangleNormal = JSM.VectorNormalize (new JSM.Vector (normal[0], normal[1], normal[2]));
				var normalIndex = currentBody.AddNormal (triangleNormal.x, triangleNormal.y, triangleNormal.z);
				currentBody.AddTriangle (v0Index, v1Index, v2Index, normalIndex, normalIndex, normalIndex);
			}
		});
	}
	
	triangleModel.Finalize ();
	
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
