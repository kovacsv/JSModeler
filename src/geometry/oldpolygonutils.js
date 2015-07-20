/**
* Function: CreatePolygonFromVertices
* Description: Creates a cloned polygon from the given vertices.
* Parameters:
*	vertices {Coord2D[*]} the vertices
* Returns:
*	{Polygon2D} the result
*/
JSM.CreatePolygonFromVertices = function (vertices)
{
	var polygon = new JSM.Polygon2D ();

	var i, current;
	for (i = 0; i < vertices.length; i++) {
		current = vertices[i];
		polygon.AddVertex (current.x, current.y);
	}
	
	return polygon;
};

/**
* Function: ChangePolygonOrientation2D
* Description: Reverses the orientation of a polygon.
* Parameters:
*	polygon {Polygon2D} the polygon
*/
JSM.ChangePolygonOrientation2D = function (polygon)
{
	var oldPolygon = polygon.Clone ();
	polygon.Clear ();
	
	var i, oldVertex;
	for (i = oldPolygon.VertexCount () - 1; i >= 0; i--) {
		oldVertex = oldPolygon.GetVertex (i);
		polygon.AddVertex (oldVertex.x, oldVertex.y);
	}
};

/**
* Function: CreateCCWPolygonFromVertices
* Description: Creates a cloned polygon from the given vertices with couter clockwise orientation.
* Parameters:
*	vertices {Coord2D[*]} the vertices
* Returns:
*	{Polygon2D} the result
*/
JSM.CreateCCWPolygonFromVertices = function (vertices)
{
	var polygon = JSM.CreatePolygonFromVertices (vertices);
	if (polygon.GetOrientation () != JSM.Orientation.CounterClockwise) {
		JSM.ChangePolygonOrientation2D (polygon);
	}
	return polygon;
};

/**
* Function: CreatePolygonWithHole2D
* Description:
*	Creates a simple polygon from multiple contours by creating in-out edges between
*	contours. The input array should contain null values at contour ends.
* Parameters:
*	vertices {Coord2D[*]} array of contour vertices with null values at contour ends
* Returns:
*	{int[*]} the result
*/
JSM.CreatePolygonWithHole2D = function (vertices)
{
	function GetContourEnds (vertices)
	{
		var contourEnds = [];
		contourEnds.push (-1);
		var i;
		for (i = 0; i < vertices.length; i++) {
			if (vertices[i] === null) {
				contourEnds.push (i);
				continue;
			}
		}
		contourEnds.push (i);
		return contourEnds;
	}

	function GetContourPolygons (vertices, contourCount, contourEnds)
	{
		var contourPolygons = [];
		var i, j, from, to, polygon, vertex;
		for (i = 0; i < contourCount; i++) {
			from = contourEnds[i] + 1;
			to = contourEnds[i + 1];
			polygon = new JSM.Polygon2D ();
			for (j = from; j < to; j++) {
				vertex = vertices[j];
				polygon.AddVertex (vertex.x, vertex.y);
			}
			contourPolygons.push (polygon);
		}
		return contourPolygons;
	}

	function FindHoleEntryPoint (vertices, contourIndex)
	{
		function IsNotIntersectingSector (currentSector, originalIndex, currentHoleIndex, originalPolygon, currentHolePolygon, contourPolygons, finishedContours)
		{
			if (originalPolygon.SectorPosition (currentSector, originalIndex, -1) != JSM.SectorPolygonPosition.NoIntersection) {
				return false;
			}
			
			if (currentHolePolygon.SectorPosition (currentSector, -1, currentHoleIndex) != JSM.SectorPolygonPosition.NoIntersection) {
				return false;
			}
			
			var i, currentContourPolygon;
			for (i = 0; i < contourPolygons.length; i++) {
				if (i == contourIndex || finishedContours[i] !== undefined) {
					continue;
				}
				currentContourPolygon = contourPolygons[i];
				if (currentContourPolygon.SectorPosition (currentSector, -1, -1) != JSM.SectorPolygonPosition.NoIntersection) {
					return false;
				}
			}
			
			return true;
		}
		
		var originalPolygon = new JSM.Polygon2D ();
		var i, j, vertex;
		for (i = 0; i < resultIndices.length; i++) {
			vertex = vertices[resultIndices[i]];
			originalPolygon.AddVertex (vertex.x, vertex.y);
		}
		
		var entryPoint = null;
		var from = contourEnds[contourIndex] + 1;
		var currentHolePolygon = contourPolygons[contourIndex];
		
		var currentSector;
		for (i = 0; i < originalPolygon.VertexCount (); i++) {
			for (j = 0; j < currentHolePolygon.VertexCount (); j++) {
				currentSector = new JSM.Sector2D (originalPolygon.GetVertex (i), currentHolePolygon.GetVertex (j));
				if (IsNotIntersectingSector (currentSector, i, j, originalPolygon, currentHolePolygon, contourPolygons, finishedContours)) {
					entryPoint = [resultIndices[i], j + from];
					break;
				}
			}
			if (entryPoint !== null) {
				break;
			}
		}

		return entryPoint;
	}

	function AddHoleContour (vertices, contourIndex)
	{
		var entryPoint = FindHoleEntryPoint (vertices, contourIndex);
		if (entryPoint === null) {
			return false;
		}
		
		var from = contourEnds[contourIndex] + 1;
		var to = contourEnds[contourIndex + 1];

		var oldResult = [];
		var i;
		for (i = 0; i < resultIndices.length; i++) {
			oldResult[i] = resultIndices[i];
		}
		
		resultIndices = [];
		var first, finished, originalInd, contourInd;
		for (i = 0; i < oldResult.length; i++) {
			originalInd = oldResult[i];
			resultIndices.push (originalInd);
			if (originalInd == entryPoint[0]) {
				contourInd = entryPoint[1];
				first = true;
				finished = false;
				while (!finished) {
					resultIndices.push (contourInd);
					if (!first && contourInd == entryPoint[1]) {
						finished = true;
					}
					if (first) {
						first = false;
					}
					if (contourInd < to - 1) {
						contourInd = contourInd + 1;
					} else {
						contourInd = from;
					}
				}
				resultIndices.push (originalInd);
			}
		}
		
		return true;
	}

	function AddContour (vertices, contourIndex)
	{
		if (finishedContours[contourIndex] !== undefined) {
			return false;
		}
	
		var added = false;
		var from = contourEnds[contourIndex] + 1;
		var to = contourEnds[contourIndex + 1];
		
		if (contourIndex === 0) {
			var i;
			for (i = from; i < to; i++) {
				resultIndices.push (i);
			}
			finishedContours[contourIndex] = true;
		} else {
			if (AddHoleContour (vertices, contourIndex)) {
				finishedContours[contourIndex] = true;
				added = true;
			}
		}
		
		return added;
	}

	var resultIndices = [];
	var contourEnds = GetContourEnds (vertices);
	var contourCount = contourEnds.length - 1;
	if (contourCount === 0) {
		contourCount = 1;
	}

	var contourPolygons = GetContourPolygons (vertices, contourCount, contourEnds);
	var finishedContours = {};
	var finishedContourCount = 1;
	AddContour (vertices, 0);
	
	var i = 0;
	var addedContourInCurrentRound = false;
	while (finishedContourCount < contourCount) {
		if (AddContour (vertices, i)) {
			finishedContourCount += 1;
			addedContourInCurrentRound = true;
		}
		if (i < contourCount - 1) {
			i = i + 1;
		} else {
			i = 0;
			if (!addedContourInCurrentRound) {
				break;
			}
			addedContourInCurrentRound = false;
		}
	}
	
	return resultIndices;
};

/**
* Function: CreatePolygonWithHole
* Description:
*	Creates a simple polygon from multiple contours by creating in-out edges between
*	contours. The input array should contain null values at contour ends.
* Parameters:
*	vertices {Coord[*]} array of contour vertices with null values at contour ends
* Returns:
*	{int[*]} the result
*/
JSM.CreatePolygonWithHole = function (vertices)
{
	var noNullVertices = [];
	var i;
	for (i = 0; i < vertices.length; i++) {
		if (vertices[i] !== null) {
			noNullVertices.push (vertices[i]);
		}
	}

	var normal = JSM.CalculateNormal (noNullVertices);
	var vertices2D = [];
	var vertex;
	for (i = 0; i < vertices.length; i++) {
		if (vertices[i] !== null) {
			vertex = vertices[i].ToCoord2D (normal);
			vertices2D.push (vertex);
		} else {
			vertices2D.push (null);
		}
	}
	
	return JSM.CreatePolygonWithHole2D (vertices2D);
};
