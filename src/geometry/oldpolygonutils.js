/**
* Function: CreatePolygonFromVertices
* Description: Creates a cloned polygon from the given vertices.
* Parameters:
*	vertices {Coord2D[*]} the vertices
* Returns:
*	{OldPolygon2D} the result
*/
JSM.CreatePolygonFromVertices = function (vertices)
{
	var polygon = new JSM.OldPolygon2D ();

	var i, current;
	for (i = 0; i < vertices.length; i++) {
		current = vertices[i];
		polygon.AddVertex (current.x, current.y);
	}
	
	return polygon;
};

/**
* Function: PolygonSignedArea2D
* Description:
*	Calculates the signed area of a polygon. The result is positive if the polygon has
*	counter clockwise orientation, negative if it has clockwise orientation.
* Parameters:
*	polygon {OldPolygon2D} the polygon
* Returns:
*	{number} the result
*/
JSM.PolygonSignedArea2D = function (polygon)
{
	var count = polygon.VertexCount ();
	var area = 0.0;
	
	var i, current, next;
	for (i = 0; i < count; i++) {
		current = polygon.GetVertex (i);
		next = polygon.GetVertex ((i + 1) % count);
		area += current.x * next.y - next.x * current.y;
	}
	
	area /= 2.0;
	return area;
};

/**
* Function: PolygonArea2D
* Description: Calculates the area of a polygon.
* Parameters:
*	polygon {OldPolygon2D} the polygon
* Returns:
*	{number} the result
*/
JSM.PolygonArea2D = function (polygon)
{
	return Math.abs (JSM.PolygonSignedArea2D (polygon));
};

/**
* Function: PolygonOrientation2D
* Description: Calculates the orientation of a polygon.
* Parameters:
*	polygon {OldPolygon2D} the polygon
* Returns:
*	{Orientation} the result
*/
JSM.PolygonOrientation2D = function (polygon)
{
	var signedArea = JSM.PolygonSignedArea2D (polygon);
	if (JSM.IsPositive (signedArea)) {
		return JSM.Orientation.CounterClockwise;
	} else if (JSM.IsNegative (signedArea)) {
		return JSM.Orientation.Clockwise;
	}
	
	return JSM.Orientation.Invalid;
};

/**
* Function: ChangePolygonOrientation2D
* Description: Reverses the orientation of a polygon.
* Parameters:
*	polygon {OldPolygon2D} the polygon
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
*	{OldPolygon2D} the result
*/
JSM.CreateCCWPolygonFromVertices = function (vertices)
{
	var polygon = JSM.CreatePolygonFromVertices (vertices);
	if (JSM.PolygonOrientation2D (polygon) != JSM.Orientation.CounterClockwise) {
		JSM.ChangePolygonOrientation2D (polygon);
	}
	return polygon;
};

/**
* Function: PolygonComplexity2D
* Description: Calculates the complexity of a polygon.
* Parameters:
*	polygon {OldPolygon2D} the polygon
* Returns:
*	{Complexity} the result
*/
JSM.PolygonComplexity2D = function (polygon)
{
	var hasCounterClockwiseVertex = false;
	var hasClockWiseVertex = false;

	var count = polygon.VertexCount ();
	
	var i, prevIndex, currIndex, nextIndex;
	var prev, curr, next, orientation;
	for (i = 0; i < count; i++) {
		prevIndex = (i === 0 ? count - 1 : i - 1);
		currIndex = i;
		nextIndex = (i === count - 1 ? 0 : i + 1);

		prev = polygon.GetVertex (prevIndex);
		curr = polygon.GetVertex (currIndex);
		next = polygon.GetVertex (nextIndex);

		orientation = JSM.CoordOrientation2D (prev, curr, next);
		if (orientation == JSM.Orientation.CounterClockwise) {
			hasCounterClockwiseVertex = true;
		} else if (orientation == JSM.Orientation.Clockwise) {
			hasClockWiseVertex = true;
		}

		if (hasCounterClockwiseVertex && hasClockWiseVertex) {
			return JSM.Complexity.Concave;
		}
	}

	if (!hasCounterClockwiseVertex && !hasClockWiseVertex) {
		return JSM.Complexity.Invalid;
	}
	
	return JSM.Complexity.Convex;
};

/**
* Function: CoordPolygonPosition2D
* Description: Calculates the position of a coordinate and a polygon.
* Parameters:
*	coord {Coord} the coordinate
*	polygon {OldPolygon2D} the polygon
* Returns:
*	{string} 'CoordOutsideOfPolygon', 'CoordInsideOfPolygon', or 'CoordOnPolygonEdge'
*/
JSM.CoordPolygonPosition2D = function (coord, polygon)
{
	var count = polygon.VertexCount ();
	
	var i, current, next, sector;
	for (i = 0; i < count; i++) {
		current = polygon.GetVertex (i);
		next = polygon.GetVertex ((i + 1) % count);
		sector = new JSM.Sector2D (current, next);
		
		if (sector.CoordPosition (coord) != JSM.CoordSectorPosition2D.CoordOutsideOfSector) {
			return 'CoordOnPolygonEdge';
		}
	}

	var maxHorizontalDistance = 0.0;
	var currentDistance;
	for (i = 0; i < count; i++) {
		currentDistance = Math.abs (polygon.GetVertex (i).x - coord.x);
		if (JSM.IsGreater (currentDistance, maxHorizontalDistance)) {
			maxHorizontalDistance = currentDistance;
		}
	}

	var ray = new JSM.Sector2D (coord, new JSM.Coord2D (coord.x + 2.0 * maxHorizontalDistance, coord.y));

	var intersections = 0;
	var intersection, ssp;
	for (i = 0; i < count; i++) {
		current = polygon.GetVertex (i);
		next = polygon.GetVertex ((i + 1) % count);

		sector = new JSM.Sector2D (current, next);
		intersection = new JSM.Coord2D (0.0, 0.0);
		ssp = ray.OldSectorPosition (sector, intersection);
		if (ssp === JSM.OldSectorSectorPosition2D.SectorsDontIntersect) {
			continue;
		}

		if (ssp === JSM.OldSectorSectorPosition2D.SectorsIntersectOnePoint) {
			intersections++;
		} else if (ssp === JSM.OldSectorSectorPosition2D.SectorsIntersectEndPoint) {
			if (intersection.IsEqual (sector.beg)) {
				if (JSM.IsGreater (sector.beg.y, sector.end.y)) {
					intersections++;
				}
			} else if (intersection.IsEqual (sector.end)) {
				if (JSM.IsLower (sector.beg.y, sector.end.y)) {
					intersections++;
				}
			}
		}
	}

	if (intersections % 2 === 0) {
		return 'CoordOutsideOfPolygon';
	}

	return 'CoordInsideOfPolygon';
};

/**
* Function: SectorIntersectsPolygon2D
* Description:
*	Determines if a sector intersects a polygon. The sides next to the starting and
*	ending vertices will be skipped. To avoid this, give -1 for these values.
* Parameters:
*	polygon {OldPolygon2D} the polygon
*	sector {Sector2D} the sector
*	from {integer} index of starting vertex
*	end {integer} index of ending vertex
* Returns:
*	{boolean} the result
*/
JSM.SectorIntersectsPolygon2D = function (polygon, sector, from, to)
{
	var count = polygon.VertexCount ();
	
	var i, sectorBeg, sectorEnd, currentSector, position;
	for (i = 0; i < count; i++) {
		sectorBeg = i;
		sectorEnd = (i + 1) % count;
		if (sectorBeg == from || sectorEnd == from || sectorBeg == to || sectorEnd == to) {
			continue;
		}
		
		currentSector = new JSM.Sector2D (polygon.GetVertex (sectorBeg), polygon.GetVertex (sectorEnd));
		position = sector.OldSectorPosition (currentSector);
		if (position !== JSM.OldSectorSectorPosition2D.SectorsDontIntersect) {
			return true;
		}
	}
	
	return false;
};

/**
* Function: IsPolygonVertexVisible2D
* Description:
*	Determines if a polygons vertex is visible from an another vertex. It means that the
*	sector between the vertices does not intersects any side of the polygon and the sector
*	lies fully inside the polygon.
* Parameters:
*	polygon {OldPolygon2D} the polygon
*	from {integer} index of starting vertex
*	end {integer} index of ending vertex
* Returns:
*	{boolean} the result
*/
JSM.IsPolygonVertexVisible2D = function (polygon, from, to)
{
	if (from === to) {
		return false;
	}

	var count = polygon.VertexCount ();
	var prev = (from > 0 ? from - 1 : count - 1);
	var next = (from < count - 1 ? from + 1 : 0);
	if (to === prev || to === next) {
		return false;
	}

	var diagonalSector = new JSM.Sector2D (polygon.GetVertex (from), polygon.GetVertex (to));
	if (JSM.SectorIntersectsPolygon2D (polygon, diagonalSector, from, to)) {
		return false;
	}

	var midCoord = JSM.MidCoord2D (diagonalSector.beg, diagonalSector.end);
	if (JSM.CoordPolygonPosition2D (midCoord, polygon) !== 'CoordInsideOfPolygon') {
		return false;
	}

	return true;
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
			polygon = new JSM.OldPolygon2D ();
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
			if (JSM.SectorIntersectsPolygon2D (originalPolygon, currentSector, originalIndex, -1)) {
				return false;
			}
			
			if (JSM.SectorIntersectsPolygon2D (currentHolePolygon, currentSector, -1, currentHoleIndex)) {
				return false;
			}
			
			var i, currentContourPolygon;
			for (i = 0; i < contourPolygons.length; i++) {
				if (i == contourIndex || finishedContours[i] !== undefined) {
					continue;
				}
				currentContourPolygon = contourPolygons[i];
				if (JSM.SectorIntersectsPolygon2D (currentContourPolygon, currentSector, -1, -1)) {
					return false;
				}
			}
			
			return true;
		}
		
		var originalPolygon = new JSM.OldPolygon2D ();
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
* Function: PolygonTriangulate2D
* Description:
*	Triangulates a polygon. The result defines triangles as an
*	array of arrays with three original vertex indices.
* Parameters:
*	polygon {OldPolygon2D} the polygon
* Returns:
*	{integer[3][*]} the result
*/
JSM.PolygonTriangulate2D = function (polygon)
{
	function Increase (value, count)
	{
		if (value < count - 1) {
			return value + 1;
		} else {
			return 0;
		}
	}
	
	function Decrease (value,  count)
	{
		if (value > 0) {
			return value - 1;
		} else {
			return count - 1;
		}
	}

	function GetResult (resultPolygons, orientation)
	{
		var result = [];
		var i, j, resultPolygon, resultTriangle;
		for (i = 0; i < resultPolygons.length; i++) {
			resultPolygon = resultPolygons[i];
			if (resultPolygon.length !== 3) {
				continue;
			}
			
			if (orientation == JSM.Orientation.CounterClockwise) {
				result.push (resultPolygon);
			} else {
				resultTriangle = [];
				for (j = resultPolygon.length - 1; j >= 0; j--) {
					resultTriangle.push (count - resultPolygon[j] - 1);
				}
				result.push (resultTriangle);
			}
		}
		return result;
	}

	function IsVisibleVertex (polygon, vertex1, vertex2)
	{
		if (vertex1 === vertex2) {
			return false;
		}
	
		var currentVertexCount = polygon.VertexCount ();
		if (Increase (vertex1, currentVertexCount) === vertex2 || Decrease (vertex1, currentVertexCount) === vertex2) {
			return false;
		}
	
		return JSM.IsPolygonVertexVisible2D (polygon, vertex1, vertex2);
	}

	function SplitPolygon (polygon, vertex1, vertex2, resultPolygons)
	{
		var currentVertexCount = polygon.length;
		if (currentVertexCount <= 3) {
			return true;
		}
	
		var i, j, start, end, resultPolygon;
		for (i = 0; i < 2; i++) {
			start = -1;
			end = -1;
			if (i === 0) {
				start = vertex1;
				end = vertex2;
			} else if (i === 1) {
				start = vertex2;
				end = vertex1;
			}
	
			resultPolygon = [];
			resultPolygon.push (polygon[end]);
			for (j = start; j !== end; j = Increase (j, currentVertexCount)) {
				resultPolygon.push (polygon[j]);
			}
			resultPolygons.push (resultPolygon);
		}
	
		return true;
	}

	var workPolygon = polygon.Clone ();
	var count = workPolygon.VertexCount ();
	if (count < 3) {
		return [];
	}

	var resultPolygons = [];
	var firstPolygon = [];
	
	var i, j, k;
	for (i = 0; i < count; i++) {
		firstPolygon.push (i);
	}
	
	resultPolygons.push (firstPolygon);
	if (count === 3) {
		return resultPolygons;
	}

	var complexity = JSM.PolygonComplexity2D (workPolygon);
	var orientation = JSM.PolygonOrientation2D (workPolygon);
	if (complexity == JSM.Complexity.Invalid || orientation == JSM.Orientation.Invalid) {
		return [];
	}
	
	if (orientation !== JSM.Orientation.CounterClockwise) {
		var i1, i2, tmp;
		for (i = 0; i < count / 2; i++) {
			i1 = i;
			i2 = count - i - 1;
			tmp = workPolygon.vertices[i1];
			workPolygon.vertices[i1] = workPolygon.vertices[i2];
			workPolygon.vertices[i2] = tmp;
		}
	}
	
	if (complexity == JSM.Complexity.Convex) {
		var triangle;
		for (i = 0; i < count - 2; i++) {
			triangle = [];
			triangle.push (0);
			triangle.push ((i + 1) % count);
			triangle.push ((i + 2) % count);
			resultPolygons.push (triangle);
		}
		return GetResult (resultPolygons, orientation);
	}

	var currentPolygon, currentVertexCount, currentPolygon2D, createdNewPolygons, vertex;
	for (i = 0; i < resultPolygons.length; i++) {
		currentPolygon = resultPolygons[i];
		currentVertexCount = currentPolygon.length;
		if (currentVertexCount === 3) {
			continue;
		}

		currentPolygon2D = new JSM.OldPolygon2D ();
		for (j = 0; j < currentVertexCount; j++) {
			vertex = workPolygon.GetVertex (currentPolygon[j]);
			currentPolygon2D.AddVertex (vertex.x, vertex.y);
		}

		createdNewPolygons = false;
		for (j = 0; j < currentVertexCount; j++) {
			for (k = 0; k < currentVertexCount; k++) {
				if (IsVisibleVertex (currentPolygon2D, j, k)) {
					SplitPolygon (currentPolygon, j, k, resultPolygons);
					createdNewPolygons = true;
					break;
				}
			}
			if (createdNewPolygons) {
				break;
			}
		}
	}

	return GetResult (resultPolygons, orientation);
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

/**
* Function: PolygonTriangulate
* Description:
*	Triangulates a polygon. The result defines triangles as an
*	array of arrays with three original vertex indices.
* Parameters:
*	polygon {Polygon} the polygon
* Returns:
*	{integer[3][*]} the result
*/
JSM.PolygonTriangulate = function (polygon)
{
	var polygon2D = new JSM.OldPolygon2D ();
	var normal = JSM.CalculateNormal (polygon.vertices);

	var vertexCount = polygon.VertexCount ();
	var i, vertex;
	for (i = 0; i < vertexCount; i++) {
		vertex = polygon.GetVertex (i).ToCoord2D (normal);
		polygon2D.AddVertex (vertex.x, vertex.y);
	}
	
	return JSM.PolygonTriangulate2D (polygon2D);
};

/**
* Function: OffsetPolygonContour
* Description: Offsets all vertices of a polygon.
* Parameters:
*	polygon {Polygon} the polygon
*	width {number} the width of the offset
* Returns:
*	{Polygon} the result
*/
JSM.OffsetPolygonContour = function (polygon, width)
{
	var count = polygon.VertexCount ();
	var normal = JSM.CalculateNormal (polygon.vertices);

	var prev, curr, next;
	var prevVertex, currVertex, nextVertex;
	var prevDir, nextDir;
	var distance, offsetedCoord;
	
	var result = new JSM.Polygon ();
	
	var i, angle;
	for (i = 0; i < count; i++) {
		prev = (i === 0 ? count - 1 : i - 1);
		curr = i;
		next = (i === count - 1 ? 0 : i + 1);
		
		prevVertex = polygon.GetVertex (prev);
		currVertex = polygon.GetVertex (curr);
		nextVertex = polygon.GetVertex (next);

		prevDir = JSM.CoordSub (prevVertex, currVertex);
		nextDir = JSM.CoordSub (nextVertex, currVertex);
		angle = prevDir.AngleTo (nextDir) / 2.0;
		if (JSM.CoordOrientation (prevVertex, currVertex, nextVertex, normal) == JSM.Orientation.Clockwise) {
			angle = Math.PI - angle;
		}

		distance = width / Math.sin (angle);
		offsetedCoord = currVertex.Clone ();
		offsetedCoord.Offset (nextDir, distance);
		offsetedCoord.Rotate (normal, angle, currVertex);
		result.AddVertex (offsetedCoord.x, offsetedCoord.y, offsetedCoord.z);
	}
	
	return result;
};

/**
* Function: CutPolygonWithPlane
* Description:
*	Cuts a polygon with a plane. The result array contains cutted
*	polygons grouped by their position to the plane.
* Parameters:
*	polygon {Polygon} the polygon
*	plane {Plane} the plane
*	frontPolygons {Polygon[*]} (out) polygons in front of the plane
*	backPolygons {Polygon[*]} (out) polygons at the back of the plane
*	planePolygons {Polygon[*]} (out) polygons on the plane
* Returns:
*	{boolean} success
*/
JSM.CutPolygonWithPlane = function (polygon, plane, frontPolygons, backPolygons, planePolygons)
{
	function AddCutVerticesToPolygon (polygon, plane, cutPolygon, vertexTypes)
	{
		function AddVertex (polygon, index, cutPolygon, originalTypes, vertexTypes)
		{
			function AddIntersectionVertex (polygon, cutPolygon, vertexTypes, prevIndex, currIndex, currType)
			{
				var prevType = vertexTypes[vertexTypes.length - 1];
				if (prevType !== 0 && currType !== 0 && prevType != currType) {
					var prevVertex = polygon.GetVertex (prevIndex);
					var currVertex = polygon.GetVertex (currIndex);
					var line = new JSM.Line (currVertex, JSM.CoordSub (currVertex, prevVertex));
					var intersection = new JSM.Coord (0.0, 0.0, 0.0);
					var linePlanePosition = plane.LinePosition (line, intersection);
					if (linePlanePosition == JSM.LinePlanePosition.LineIntersectsPlane) {
						cutPolygon.AddVertex (intersection.x, intersection.y, intersection.z);
						vertexTypes.push (0);
					}
				}
			}
			
			function AddOriginalVertex (polygon, cutPolygon, vertexTypes, currIndex, currType)
			{
				var currVertex = polygon.GetVertex (currIndex);
				cutPolygon.AddVertex (currVertex.x, currVertex.y, currVertex.z);
				vertexTypes.push (currType);
			}
		
			var firstVertex = (index === 0);
			var lastVertex = (index === polygon.VertexCount ());
			
			var currIndex, prevIndex;
			if (lastVertex) {
				currIndex = 0;
				prevIndex = polygon.VertexCount () - 1;
			} else {
				currIndex = index;
				prevIndex = currIndex - 1;
			}
			
			var currType = originalTypes[currIndex];
			if (!firstVertex) {
				AddIntersectionVertex (polygon, cutPolygon, vertexTypes, prevIndex, currIndex, currType);
			}
			
			if (!lastVertex) {
				AddOriginalVertex (polygon, cutPolygon, vertexTypes, currIndex, currType);
			}

			return currType;
		}

		var originalTypes = [];
		var backFound = false;
		var frontFound = false;
		
		var i, position, currVertex, currType;
		for (i = 0; i < polygon.VertexCount (); i++) {
			currVertex = polygon.GetVertex (i);
			position = plane.CoordPosition (currVertex);
			currType = 0;
			if (position == JSM.CoordPlanePosition.CoordInFrontOfPlane) {
				currType = 1;
				frontFound = true;
			} else if (position == JSM.CoordPlanePosition.CoordAtBackOfPlane) {
				currType = -1;
				backFound = true;
			}
			originalTypes.push (currType);
		}
		
		if (backFound && frontFound) {
			for (i = 0; i <= polygon.VertexCount (); i++) {
				AddVertex (polygon, i, cutPolygon, originalTypes, vertexTypes);
			}
			return 0;
		} else {
			if (backFound) {
				return -1;
			} else if (frontFound) {
				return 1;
			}
			return 0;
		}
	}

	function AddSimplePolygon (polygon, foundSide, frontPolygons, backPolygons, planePolygons)
	{
		if (foundSide == 1) {
			frontPolygons.push (polygon);
		} else if (foundSide == -1) {
			backPolygons.push (polygon);
		} else {
			planePolygons.push (polygon);
		}
	}

	function AddCuttedPolygons (cutPolygon, vertexTypes, frontPolygons, backPolygons)
	{
		function GetEntryVertices (vertexTypes)
		{
			function FindPrevSide (index, vertexTypes)
			{
				var currIndex = index;
				while (vertexTypes[currIndex] === 0) {
					currIndex = (currIndex > 0 ? currIndex - 1 : vertexTypes.length - 1);
				}
				return vertexTypes[currIndex];
			}

			var entryVertices = [];
			var i, currSide, prevIndex, nextIndex, prevSide, nextSide;
			for (i = 0; i < vertexTypes.length; i++) {
				currSide = vertexTypes[i];
				if (currSide === 0) {
					prevIndex = (i > 0 ? i - 1 : vertexTypes.length - 1);
					nextIndex = (i < vertexTypes.length - 1 ? i + 1 : 0);
					prevSide = vertexTypes[prevIndex];
					nextSide = vertexTypes[nextIndex];
					if (nextSide !== 0 && prevSide === 0) {
						prevSide = FindPrevSide (prevIndex, vertexTypes);
					}

					if ((prevSide == -1 && nextSide == 1) || (prevSide == 1 && nextSide == -1)) {
						entryVertices.push (i);
					}
				}
			}
			return entryVertices;
		}

		function SortEntryVertices (cutPolygon, entryVertices)
		{
			function SwapArrayValues (array, from, to)
			{
				var temp = array[from];
				array[from] = array[to];
				array[to] = temp;
			}

			if (entryVertices.length < 2) {
				return;
			}

			var referenceCoord1 = cutPolygon.GetVertex (entryVertices[0]);
			var referenceCoord2 = cutPolygon.GetVertex (entryVertices[1]);
			var direction = JSM.CoordSub (referenceCoord2, referenceCoord1);
			var referencePlane = JSM.GetPlaneFromCoordAndDirection (referenceCoord1, direction);

			var i, j, vertex;
			var distances = [];
			for (i = 0; i < entryVertices.length; i++) {
				vertex = cutPolygon.GetVertex (entryVertices[i]);
				distances.push (referencePlane.CoordSignedDistance (vertex));
			}

			for (i = 0; i < entryVertices.length - 1; i++) {
				for (j = 0; j < entryVertices.length - i - 1; j++) {
					if (JSM.IsGreater (distances[j], distances[j + 1])) {
						SwapArrayValues (distances, j, j + 1);
						SwapArrayValues (entryVertices, j, j + 1);
					}
				}
			}
		}
			
		function GetOneSideCuttedPolygons (cutPolygon, entryVertices, vertexTypes, frontPolygons, backPolygons, reversed)
		{
			function AddEntryPairToArray (entryPairs, entryVertices, index)
			{
				entryPairs[entryVertices[index]] = entryVertices[index + 1];
				entryPairs[entryVertices[index + 1]] = entryVertices[index];
			}

			function RemoveEntryPairFromArray (entryPairs, index)
			{
				entryPairs[entryPairs[index]] = -1;
				entryPairs[index] = -1;
			}

			function CreateEntryPairsArray (cutPolygon, entryVertices, entryPairs)
			{
				var i;
				for (i = 0; i < cutPolygon.VertexCount (); i++) {
					entryPairs.push (-1);
				}

				for (i = 0; i < entryVertices.length; i = i + 2) {
					AddEntryPairToArray (entryPairs, entryVertices, i);
				}
			}

			var entryPairs = [];
			CreateEntryPairsArray (cutPolygon, entryVertices, entryPairs);

			var currEntryVertex = 0;
			if (reversed) {
				currEntryVertex = entryVertices.length - 1;
			}

			var startVertexIndex = entryVertices[currEntryVertex];
			var currVertexIndex = startVertexIndex;

			var sideFound = false;
			var polygonSide = 0;

			var currPolygon = new JSM.Polygon ();
			var currVertex;

			while (true) {
				if (!sideFound) {
					polygonSide = vertexTypes[currVertexIndex];
					if (polygonSide !== 0) {
						sideFound = true;
					}
				}

				if (currPolygon.VertexCount () > 0 && currVertexIndex == startVertexIndex) {
					if (polygonSide == 1) {
						frontPolygons.push (currPolygon);
					} else if (polygonSide == -1) {
						backPolygons.push (currPolygon);
					}

					currPolygon = new JSM.Polygon ();
					if (currEntryVertex > 0 && currEntryVertex < entryVertices.length) {
						startVertexIndex = entryVertices[currEntryVertex];
						currVertexIndex = startVertexIndex;
						continue;
					} else {
						break;
					}
				}

				currVertex = cutPolygon.GetVertex (currVertexIndex);
				currPolygon.AddVertex (currVertex.x, currVertex.y, currVertex.z);
				
				if (entryPairs[currVertexIndex] != -1) {
					if (!reversed) {
						currEntryVertex = currEntryVertex + 2;
					} else {
						currEntryVertex = currEntryVertex - 2;
					}
					currVertexIndex = entryPairs[currVertexIndex];
					RemoveEntryPairFromArray (entryPairs, currVertexIndex);
				} else {
					if (currVertexIndex < cutPolygon.VertexCount () - 1) {
						currVertexIndex = currVertexIndex + 1;
					} else {
						currVertexIndex = 0;
					}
				}
			}
		}

		var entryVertices = GetEntryVertices (vertexTypes);
		if (entryVertices.length === 0 || entryVertices.length % 2 !== 0) {
			return;
		}

		SortEntryVertices (cutPolygon, entryVertices);
		GetOneSideCuttedPolygons (cutPolygon, entryVertices, vertexTypes, frontPolygons, backPolygons, false);
		GetOneSideCuttedPolygons (cutPolygon, entryVertices, vertexTypes, frontPolygons, backPolygons, true);
	}

	var cutPolygon = new JSM.Polygon ();

	var vertexTypes = [];
	var foundSide = AddCutVerticesToPolygon (polygon, plane, cutPolygon, vertexTypes);
	if (cutPolygon.VertexCount () === 0 && vertexTypes.length === 0) {
		AddSimplePolygon (polygon, foundSide, frontPolygons, backPolygons, planePolygons);
	} else {
		AddCuttedPolygons (cutPolygon, vertexTypes, frontPolygons, backPolygons);
	}

	if (frontPolygons.length + backPolygons.length + planePolygons.length === 0) {
		return false;
	}
	return true;
};
