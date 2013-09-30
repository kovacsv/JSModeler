JSM.CutPolygonByPlane = function (polygon, plane, indexTable)
{
	function AddOriginalVertex (index)
	{
		rawResult.push (new JSM.Coord (vertex.x, vertex.y, vertex.z));
		rawIndexTable.push (index);
	}

	function AddIntersectionVertex (from, to)
	{
		direction = JSM.VectorNormalize (JSM.CoordSub (polygon[to], polygon[from]));
		line = new JSM.Line (polygon[from], direction);
		intersection = JSM.LinePlaneIntersection (line, plane);
		rawResult.push (new JSM.Coord (intersection.x, intersection.y, intersection.z));
		rawIndexTable.push (-1);
	}

	var hasIndexTable = (indexTable !== undefined && indexTable !== null);
	var count = polygon.length;
	var result = [];
	var front = [];
	
	var needCut = false;
	var i, position, vertex;
	for (i = 0; i < count; i++) {
		vertex = polygon[i];
		position = JSM.CoordPlanePosition (vertex, plane);
		front.push (position !== 'CoordAtBackOfPlane');
		if (i > 0 && front[i - 1] !== front[i]) {
			needCut = true;
		}
	}
	
	if (!needCut) {
		if (front[0] === false) {
			return result;
		}
		
		for (i = 0; i < count; i++) {
			vertex = polygon[i];
			result.push (new JSM.Coord (vertex.x, vertex.y, vertex.z));
			if (hasIndexTable) {
				indexTable.push (i);
			}
		}
		return result;
	}
	
	var rawResult = [];
	var rawIndexTable = [];

	var from, to;
	var direction, line, intersection;
	for (i = 0; i < count; i++) {
		from = i - 1;
		to = i;
		if (i === 0) {
			from = count - 1;
		}

		vertex = polygon[to];
		if (front[to]) {
			if (!front[from]) {
				AddIntersectionVertex (from, to);
			}
			AddOriginalVertex (to);
		} else {
			if (front[from]) {
				AddIntersectionVertex (from, to);
			}
		}
	}

	var currentVertex;
	var currentIndex;
	var lastVertex;
	var lastIndex;
	for (i = 0; i < rawResult.length; i++) {
		currentVertex = rawResult[i];
		lastVertex = result[result.length - 1];
		if (i === 0 || !JSM.CoordIsEqual (lastVertex, currentVertex)) {
			result.push (new JSM.Coord (currentVertex.x, currentVertex.y, currentVertex.z));
			if (hasIndexTable) {
				currentIndex = rawIndexTable[i];
				indexTable.push (currentIndex);
			}
		} else {
			if (hasIndexTable) {
				currentIndex = rawIndexTable[i];
				lastIndex = rawIndexTable[i - 1];
				if (currentIndex !== -1) {
					indexTable[indexTable.length - 1] = currentIndex;
				} else if (lastIndex !== -1) {
					indexTable[indexTable.length - 1] = lastIndex;
				}
			}
		}
	}
	
	return result;
};

JSM.CutBodyByPlane = function (body, plane)
{
	function GetInsertedVertexIndex (vertex)
	{
		var index = -1;
	
		var i;
		for (i = originalVertexCount; i < result.VertexCount (); i++) {
			if (JSM.CoordIsEqual (result.GetVertexPosition (i), vertex)) {
				index = i;
				break;
			}
		}
		
		if (index === -1) {
			index = result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertex.x, vertex.y, vertex.z)));
		}
		
		return index;
	}

	var result = new JSM.Body ();

	var cuttedPolygons = [];
	var cuttedIndexTables = [];	
	
	var remainsVertex = [];
	var originalOldToNewIndex = [];
	
	var i, j, polygon, polygon3D, vertexPosition;
	var cuttedPolygon, indexTable;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		
		polygon3D = [];
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			vertexPosition = body.GetVertexPosition (polygon.GetVertexIndex (j));
			polygon3D.push (new JSM.Coord (vertexPosition.x, vertexPosition.y, vertexPosition.z));
		}
		
		indexTable = [];
		cuttedPolygon = JSM.CutPolygonByPlane (polygon3D, plane, indexTable);
		for (j = 0; j < indexTable.length; j++) {
			if (indexTable[j] !== -1) {
				remainsVertex[polygon.GetVertexIndex (indexTable[j])] = true;
			}
		}

		cuttedPolygons.push (cuttedPolygon);
		cuttedIndexTables.push (indexTable);
	}

	var vertex;
	for (i = 0; i < body.VertexCount (); i++) {
		if (remainsVertex[i]) {
			vertex = body.GetVertexPosition (i);
			originalOldToNewIndex[i] = result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertex.x, vertex.y, vertex.z)));
		}
	}

	var originalVertexCount = result.VertexCount ();

	var newPolygon, newPolygonVertices;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		cuttedPolygon = cuttedPolygons[i];
		indexTable = cuttedIndexTables[i];
		if (indexTable.length === 0) {
			continue;
		}

		newPolygonVertices = [];
		for (j = 0; j < indexTable.length; j++) {
			if (indexTable[j] !== -1) {
				newPolygonVertices.push (originalOldToNewIndex[polygon.GetVertexIndex (indexTable[j])]);
			} else {
				vertex = cuttedPolygon[j];
				newPolygonVertices.push (GetInsertedVertexIndex (vertex));
			}
		}
		
		newPolygon = new JSM.BodyPolygon (newPolygonVertices);
		newPolygon.InheritAttributes (polygon);
		result.AddPolygon (newPolygon);
	}

	return result;
};
