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

	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
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
	
		function GetVertices (lines, lineIndex, vertices)
		{
			var currentLineIndex, currentLine, lineParts, vertex;
			for (currentLineIndex = lineIndex; currentLineIndex < lines.length && vertices.length < 3; currentLineIndex++) {
				currentLine = GetLine (lines, currentLineIndex);
				if (currentLine.length === 0) {
					continue;
				}
				
				lineParts = currentLine.split (/\s+/);
				if (lineParts.length === 0) {
					continue;
				}
				
				if (lineParts[0] == 'vertex') {
					if (lineParts.length < 4) {
						break;
					} else {
						vertex = [parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3])];
						vertices.push (vertex);
					}
				}
			}
			return currentLineIndex + 1;
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
			var vertices = [];
			var nextLineIndex = GetVertices (lines, lineIndex + 1, vertices);
			if (vertices.length != 3) {
				return -1;
			}
			
			OnFace (vertices[0], vertices[1], vertices[2], normal);
			return nextLineIndex;
		}

		return lineIndex + 1;
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var lineIndex = 0;
	var lines = stringBuffer.split ('\n');
	while (lineIndex < lines.length && lineIndex != -1) {
		lineIndex = ProcessLine (lines, lineIndex);
	}
};

JSM.IsBinaryStlFile = function (arrayBuffer)
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
};

JSM.ConvertStlToJsonData = function (arrayBuffer, stringBuffer)
{
	var triangleModel = new JSM.TriangleModel ();
	var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
	var currentBody = triangleModel.GetBody (index);

	if (arrayBuffer !== null) {
		JSM.ReadBinaryStlFile (arrayBuffer, {
			onFace : function (v0, v1, v2, normal) {
				var v0Index = currentBody.AddVertex (v0[0], v0[1], v0[2]);
				var v1Index = currentBody.AddVertex (v1[0], v1[1], v1[2]);
				var v2Index = currentBody.AddVertex (v2[0], v2[1], v2[2]);
				var triangleNormal = new JSM.Vector (normal[0], normal[1], normal[2]).Normalize ();
				var normalIndex = currentBody.AddNormal (triangleNormal.x, triangleNormal.y, triangleNormal.z);
				currentBody.AddTriangle (v0Index, v1Index, v2Index, normalIndex, normalIndex, normalIndex);
			}
		});
	} else if (stringBuffer !== null) {
		JSM.ReadAsciiStlFile (stringBuffer, {
			onFace : function (v0, v1, v2, normal) {
				var v0Index = currentBody.AddVertex (v0[0], v0[1], v0[2]);
				var v1Index = currentBody.AddVertex (v1[0], v1[1], v1[2]);
				var v2Index = currentBody.AddVertex (v2[0], v2[1], v2[2]);
				var triangleNormal = new JSM.Vector (normal[0], normal[1], normal[2]).Normalize ();
				var normalIndex = currentBody.AddNormal (triangleNormal.x, triangleNormal.y, triangleNormal.z);
				currentBody.AddTriangle (v0Index, v1Index, v2Index, normalIndex, normalIndex, normalIndex);
			}
		});
	}
	
	triangleModel.Finalize ();
	
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
