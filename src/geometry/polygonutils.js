JSM.PolygonSignedArea2D = function (polygon)
{
	var count = polygon.Count ();
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

JSM.PolygonArea2D = function (polygon)
{
	return Math.abs (JSM.PolygonSignedArea2D (polygon));
};

JSM.PolygonOrientation2D = function (polygon)
{
	var signedArea = JSM.PolygonSignedArea2D (polygon);
	if (JSM.IsPositive (signedArea)) {
		return 'CounterClockwise';
	} else if (JSM.IsNegative (signedArea)) {
		return 'ClockWise';
	}
	
	return 'Invalid';
};

JSM.PolygonComplexity2D = function (polygon)
{
	var hasCounterClockwiseVertex = false;
	var hasClockWiseVertex = false;

	var count = polygon.Count ();
	
	var i, prevIndex, currIndex, nextIndex;
	var prev, curr, next, turnType;
	for (i = 0; i < count; i++) {
		prevIndex = (i === 0 ? count - 1 : i - 1);
		currIndex = i;
		nextIndex = (i === count - 1 ? 0 : i + 1);

		prev = polygon.GetVertex (prevIndex);
		curr = polygon.GetVertex (currIndex);
		next = polygon.GetVertex (nextIndex);

		turnType = JSM.CoordTurnType2D (prev, curr, next);
		if (turnType === 'CounterClockwise') {
			hasCounterClockwiseVertex = true;
		} else if (turnType === 'Clockwise') {
			hasClockWiseVertex = true;
		}

		if (hasCounterClockwiseVertex && hasClockWiseVertex) {
			return 'Concave';
		}
	}

	if (!hasCounterClockwiseVertex && !hasClockWiseVertex) {
		return 'Invalid';
	}
	
	return 'Convex';
};

JSM.CoordPolygonPosition2D = function (coord, polygon)
{
	var count = polygon.Count ();
	
	var i, current, next, sector;
	for (i = 0; i < count; i++) {
		current = polygon.GetVertex (i);
		next = polygon.GetVertex ((i + 1) % count);
		sector = new JSM.Sector2D (current, next);
		if (JSM.CoordSectorPosition2D (coord, sector) !== 'CoordOutsideOfSector') {
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
		intersection = new JSM.Coord2D ();
		ssp = JSM.SectorSectorPosition2D (ray, sector, intersection);
		if (ssp === 'SectorsDontIntersects') {
			continue;
		}

		if (ssp === 'SectorsIntersectsOnePoint') {
			intersections++;
		} else if (ssp === 'SectorsIntersectsEndPoint') {
			if (JSM.CoordIsEqual2D (intersection, sector.beg)) {
				if (JSM.IsGreater (sector.beg.y, sector.end.y)) {
					intersections++;
				}
			} else if (JSM.CoordIsEqual2D (intersection, sector.end)) {
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

JSM.IsPolygonVertexVisible2D = function (polygon, from, to)
{
	if (from === to) {
		return false;
	}

	var count = polygon.Count ();
	var prev = (from > 0 ? from - 1 : count - 1);
	var next = (from < count - 1 ? from + 1 : 0);
	if (to === prev || to === next) {
		return false;
	}

	var endPointIntersectionCount = 0;
	var diagonalSector = new JSM.Sector2D (polygon.GetVertex (from), polygon.GetVertex (to));
	
	var i, currentSector, position;
	for (i = 0; i < count; i++) {
		if (i === prev || i === from) {
			continue;
		}

		currentSector = new JSM.Sector2D (polygon.GetVertex (i), polygon.GetVertex ((i + 1) % count));
		position = JSM.SectorSectorPosition2D (diagonalSector, currentSector);
		if (position === 'SectorsIntersectsOnePoint' || position === 'SectorsIntersectsCoincident') {
			return false;
		} else if (position === 'SectorsIntersectsEndPoint') {
			endPointIntersectionCount++;
			if (endPointIntersectionCount > 2) {
				return false;
			}
		}
	}

	var midCoord = JSM.MidCoord2D (diagonalSector.beg, diagonalSector.end);
	if (JSM.CoordPolygonPosition2D (midCoord, polygon) === 'CoordOutsideOfPolygon') {
		return false;
	}

	return true;
};

JSM.PolygonTriangulate2D = function (polygon)
{
	var Increase = function (value, count)
	{
		if (value < count - 1) {
			return value + 1;
		} else {
			return 0;
		}
	};
	
	var Decrease = function (value,  count)
	{
		if (value > 0) {
			return value - 1;
		} else {
			return count - 1;
		}
	};

	var GetResult = function ()
	{
		var result = [];
		
		var i, j, resultPolygon, resultTriangle;
		for (i = 0; i < resultPolygons.length; i++) {
			resultPolygon = resultPolygons[i];
			if (resultPolygon.length !== 3) {
				continue;
			}
			
			if (orientation === 'CounterClockwise') {
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
	};

	var IsVisibleVertex = function (currentPolygon2D, vertex1, vertex2)
	{
		if (vertex1 === vertex2) {
			return false;
		}
	
		var currentVertexCount = currentPolygon2D.Count ();
		if (Increase (vertex1, currentVertexCount) === vertex2 || Decrease (vertex1, currentVertexCount) === vertex2) {
			return false;
		}
	
		return JSM.IsPolygonVertexVisible2D (currentPolygon2D, vertex1, vertex2);
	};

	var SplitPolygon = function (currentPolygon, vertex1, vertex2)
	{
		var currentVertexCount = currentPolygon.length;
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
			resultPolygon.push (currentPolygon[end]);
			for (j = start; j !== end; j = Increase (j, currentVertexCount)) {
				resultPolygon.push (currentPolygon[j]);
			}
			resultPolygons.push (resultPolygon);
		}
	
		return true;
	};

	var poly = new JSM.Polygon2D ();
	poly.Clone (polygon);
	poly.Clone (polygon.vertices);
	var count = poly.Count ();
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
		return GetResult ();
	}

	var complexity = JSM.PolygonComplexity2D (poly);
	var orientation = JSM.PolygonOrientation2D (poly);
	if (complexity === 'Invalid' || orientation === 'Invalid') {
		return [];
	}
	
	if (orientation !== 'CounterClockwise') {
		var i1, i2, tmp;
		for (i = 0; i < count / 2; i++) {
			i1 = i;
			i2 = count - i - 1;
			tmp = poly.vertices[i1];
			poly.vertices[i1] = poly.vertices[i2];
			poly.vertices[i2] = tmp;
		}
	}
	
	if (complexity === 'Convex') {
		var triangle;
		for (i = 0; i < count - 2; i++) {
			triangle = [];
			triangle.push (0);
			triangle.push ((i + 1) % count);
			triangle.push ((i + 2) % count);
			resultPolygons.push (triangle);
		}
		return GetResult ();
	}

	var currentPolygon, currentVertexCount, currentPolygon2D, createdNewPolygons, vertex;
	for (i = 0; i < resultPolygons.length; i++) {
		currentPolygon = resultPolygons[i];
		currentVertexCount = currentPolygon.length;
		if (currentVertexCount === 3) {
			continue;
		}

		currentPolygon2D = new JSM.Polygon2D ();
		for (j = 0; j < currentVertexCount; j++) {
			vertex = poly.GetVertex (currentPolygon[j]);
			currentPolygon2D.AddVertex (vertex.x, vertex.y);
		}

		createdNewPolygons = false;
		for (j = 0; j < currentVertexCount; j++) {
			for (k = 0; k < currentVertexCount; k++) {
				if (IsVisibleVertex (currentPolygon2D, j, k)) {
					SplitPolygon (currentPolygon, j, k);
					createdNewPolygons = true;
					break;
				}
			}

			if (createdNewPolygons) {
				break;
			}
		}
	}

	return GetResult ();	
};

JSM.CheckTriangulation2D = function (polygon, triangles)
{
	var polygonArea = JSM.PolygonSignedArea2D (polygon);
	var trianglesArea = 0.0;
	
	var i, j, triangle, currentTriangle, vertex;
	for (i = 0; i < triangles.length; i++) {
		triangle = triangles[i];
		if (triangle.length !== 3) {
			return false;
		}
		
		currentTriangle = new JSM.Polygon2D ();
		for (j = 0; j < triangle.length; j++) {
			vertex = polygon.GetVertex (triangle[j]);
			currentTriangle.AddVertex (vertex.x, vertex.y);
		}
		
		trianglesArea += JSM.PolygonSignedArea2D (currentTriangle);
	}
	
	if (!JSM.IsEqual (polygonArea, trianglesArea)) {
		return false;
	}
	
	return true;
};

JSM.PolygonTriangulate = function (polygon)
{
	var polygon2D = new JSM.Polygon2D ();
	var normal = JSM.CalculateNormal (polygon.vertices);

	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var vertexCount = polygon.Count ();
	var i, vertex;
	for (i = 0; i < vertexCount; i++) {
		vertex = JSM.GetCoord2DFromCoord (polygon.GetVertex (i), origo, normal);
		polygon2D.AddVertex (vertex.x, vertex.y);
	}
	
	return JSM.PolygonTriangulate2D (polygon2D);
};
