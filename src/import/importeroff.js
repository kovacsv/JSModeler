JSM.ReadOffFile = function (stringBuffer, callbacks)
{
	function OnVertex (x, y, z)
	{
		if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
			callbacks.onVertex (x, y, z);
		}
	}

	function OnFace (vertices)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (vertices);
		}
	}

	function ProcessLine (line, readState)
	{
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

		if (!readState.offHeaderFound) {
			if (lineParts.length == 1 && lineParts[0] == 'OFF') {
				readState.offHeaderFound = true;
			}
			return;
		}
		
		if (!readState.infoFound) {
			if (lineParts.length == 3) {
				readState.vertexCount = parseInt (lineParts[0]);
				readState.faceCount = parseInt (lineParts[1]);
				readState.infoFound = true;
			}
			return;
		}
		
		if (readState.readVertices < readState.vertexCount) {
			if (lineParts.length == 3) {
				OnVertex (parseFloat (lineParts[0]), parseFloat (lineParts[1]), parseFloat (lineParts[2]));
				readState.readVertices += 1;
			}
			return;
		}
		
		if (readState.readFaces < readState.faceCount) {
			var vertexCount = parseInt (lineParts[0]);
			if (lineParts.length >= vertexCount + 1) {
				var vertices = [];
				var i, vertex;
				for (i = 1; i < vertexCount + 1; i++) {
					vertex = parseInt (lineParts[i]);
					vertices.push (vertex);
				}
				OnFace (vertices);
				readState.readFaces += 1;
			}
			return;
		}
	}
	
	function ProcessFile (stringBuffer)
	{
		var readState = {
			offHeaderFound : false,
			infoFound : false,
			vertexCount : 0,
			faceCount : 0,
			readVertices : 0,
			readFaces : 0
		};
		
		var lines = stringBuffer.split ('\n');
		var i, line;
		for (i = 0; i < lines.length; i++) {
			line = lines[i].trim ();
			ProcessLine (line, readState);
		}
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	ProcessFile (stringBuffer);
};

JSM.ConvertOffToJsonData = function (stringBuffer)
{
	var triangleModel = new JSM.TriangleModel ();
	var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
	var currentBody = triangleModel.GetBody (index);
	
	JSM.ReadOffFile (stringBuffer, {
		onVertex : function (x, y, z) {
			currentBody.AddVertex (x, y, z);
		},
		onFace : function (vertices) {
			var i, v0, v1, v2;
			var count = vertices.length;
			for (i = 0; i < count - 2; i++) {
				v0 = vertices[0];
				v1 = vertices[i + 1];
				v2 = vertices[i + 2];
				currentBody.AddTriangle (v0, v1, v2);
			}
		}
	});

	triangleModel.Finalize ();
	
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
