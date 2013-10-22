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
		return 'Clockwise';
	}
	
	return 'Invalid';
};

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

JSM.PolygonComplexity2D = function (polygon)
{
	var hasCounterClockwiseVertex = false;
	var hasClockWiseVertex = false;

	var count = polygon.VertexCount ();
	
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
	var count = polygon.VertexCount ();
	
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
		position = JSM.SectorSectorPosition2D (sector, currentSector);
		if (position !== 'SectorsDontIntersects') {
			return true;
		}
	}
	
	return false;
};

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

JSM.CreatePolygonWithHole2D = function (vertices)
{
	function FindHoleEntryPoint (contourIndex)
	{
		var originalPolygon = new JSM.Polygon2D ();
		var contourPolygon = new JSM.Polygon2D ();
		var i, j, k, vertex;
		for (i = 0; i < result.length; i++) {
			vertex = vertices[result[i]];
			originalPolygon.AddVertex (vertex.x, vertex.y);
		}
	
		var from = contourEnds[contourIndex] + 1;
		var to = contourEnds[contourIndex + 1];
		for (i = from; i < to; i++) {
			vertex = vertices[i];
			contourPolygon.AddVertex (vertex.x, vertex.y);
		}

		var entryPoint = null;
		var originalSector, originalInd, contourInd;
		for (i = 0; i < originalPolygon.VertexCount (); i++) {
			originalInd = result[i];
			for (j = from; j < to; j++) {
				contourInd = j - from;
				originalSector = new JSM.Sector (vertices[originalInd], vertices[j]);
				if (!JSM.SectorIntersectsPolygon2D (originalPolygon, originalSector, i, -1)) {
					if (!JSM.SectorIntersectsPolygon2D (contourPolygon, originalSector, -1, contourInd)) {
						entryPoint = [originalInd, j];
						break;
					}
				}
			}
			if (entryPoint !== null) {
				break;
			}
		}
		
		return entryPoint;
	}

	function AddHoleContour (contourIndex)
	{
		var entryPoint = FindHoleEntryPoint (contourIndex);
		var from = contourEnds[contourIndex] + 1;
		var to = contourEnds[contourIndex + 1];

		var oldResult = [];
		var i, j;
		for (i = 0; i < result.length; i++) {
			oldResult[i] = result[i];
		}
		result = [];
		var first, finished;
		for (i = 0; i < oldResult.length; i++) {
			result.push (oldResult[i]);
			if (oldResult[i] == entryPoint[0]) {
				j = entryPoint[1];
				first = true;
				finished = false;
				while (!finished) {
					result.push (j);
					if (!first && j == entryPoint[1]) {
						finished = true;
					}
					if (first) {
						first = false;
					}
					if (j < to - 1) {
						j = j + 1;
					} else {
						j = from;
					}
				}
				result.push (oldResult[i]);
			}
		}
	}

	function AddContour (contourIndex)
	{
		var from = contourEnds[contourIndex] + 1;
		var to = contourEnds[contourIndex + 1];
		
		if (contourIndex === 0) {
			var i;
			for (i = from; i < to; i++) {
				result.push (i);
			}
		} else {
			AddHoleContour (contourIndex);
		}
	}

	var result = [];
	var count = vertices.length;
	
	var contourEnds = [];
	var contourCount = 0;
	
	var i;
	contourEnds.push (-1);
	for (i = 0; i < vertices.length; i++) {
		if (vertices[i] === null) {
			contourEnds.push (i);
			contourCount = contourCount + 1;
			continue;
		}
	}
	contourEnds.push (i);
	contourCount = contourCount + 1;

	for (i = 0; i < contourCount; i++) {
		AddContour (i);
	}
	
	return result;
};

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

	function GetResult ()
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
	}

	function IsVisibleVertex (currentPolygon2D, vertex1, vertex2)
	{
		if (vertex1 === vertex2) {
			return false;
		}
	
		var currentVertexCount = currentPolygon2D.VertexCount ();
		if (Increase (vertex1, currentVertexCount) === vertex2 || Decrease (vertex1, currentVertexCount) === vertex2) {
			return false;
		}
	
		return JSM.IsPolygonVertexVisible2D (currentPolygon2D, vertex1, vertex2);
	}

	function SplitPolygon (currentPolygon, vertex1, vertex2)
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
	}

	var poly = polygon.Clone ();
	var count = poly.VertexCount ();
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

	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var vertices2D = [];

	var vertex;
	for (i = 0; i < vertices.length; i++) {
		if (vertices[i] !== null) {
			vertex = JSM.GetCoord2DFromCoord (vertices[i], origo, normal);
			vertices2D.push (vertex);
		} else {
			vertices2D.push (null);
		}
	}
	
	return JSM.CreatePolygonWithHole2D (vertices2D);
};

JSM.PolygonTriangulate = function (polygon)
{
	var polygon2D = new JSM.Polygon2D ();
	var normal = JSM.CalculateNormal (polygon.vertices);

	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var vertexCount = polygon.VertexCount ();
	var i, vertex;
	for (i = 0; i < vertexCount; i++) {
		vertex = JSM.GetCoord2DFromCoord (polygon.GetVertex (i), origo, normal);
		polygon2D.AddVertex (vertex.x, vertex.y);
	}
	
	return JSM.PolygonTriangulate2D (polygon2D);
};

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
		angle = JSM.GetVectorsAngle (prevDir, nextDir) / 2.0;
		if (JSM.CoordTurnType (prevVertex, currVertex, nextVertex, normal) === 'Clockwise') {
			angle = Math.PI - angle;
		}

		distance = width / Math.sin (angle);
		offsetedCoord = JSM.CoordOffset (currVertex, nextDir, distance);
		offsetedCoord = JSM.CoordRotate (offsetedCoord, normal, angle, currVertex);
		result.AddVertex (offsetedCoord.x, offsetedCoord.y, offsetedCoord.z);
	}
	
	return result;
};

JSM.CutPolygonWithPlane = function (polygon, plane, frontPolygons, backPolygons, planePolygons)
{
	function AddCutVerticesToPolygon (polygon, plane, cutPolygon, vertexTypes)
	{
		function AddVertex (polygon, index, cutPolygon, originalTypes, vertexTypes)
		{
			function AddIntersectionVertex (cutPolygon, vertexTypes, prevIndex, currIndex, currType)
			{
				if (vertexTypes.length > 0) {
					var prevType = vertexTypes[vertexTypes.length - 1];
					if (prevType !== 0 && currType !== 0 && prevType != currType) {
						var prevVertex = polygon.GetVertex (prevIndex);
						var currVertex = polygon.GetVertex (currIndex);
						var line = new JSM.Line (currVertex, JSM.CoordSub (currVertex, prevVertex));
						var intersection = new JSM.Coord ();
						var linePlanePosition = JSM.LinePlanePosition (line, plane, intersection);
						if (linePlanePosition == 'LineIntersectsPlane') {
							cutPolygon.AddVertex (intersection.x, intersection.y, intersection.z);
							vertexTypes.push (0);
						}
					}
				}
			}
		
			var currIndex, prevIndex, currVertex, currType;
			if (index == polygon.VertexCount ()) {
				currIndex = 0;
				prevIndex = polygon.VertexCount () - 1;
				currType = vertexTypes[currIndex];
				AddIntersectionVertex (cutPolygon, vertexTypes, polygon.VertexCount () - 1, currIndex, currType);
			} else {
				currIndex = index;
				prevIndex = currIndex - 1;
				currType = originalTypes[currIndex];
				AddIntersectionVertex (cutPolygon, vertexTypes, currIndex - 1, currIndex, currType);

				currVertex = polygon.GetVertex (currIndex);
				cutPolygon.AddVertex (currVertex.x, currVertex.y, currVertex.z);
				vertexTypes.push (currType);
			}
			
			return currType;
		}

		var originalTypes = [];
		var backFound = false;
		var frontFound = false;
		
		var i, position, currVertex, currType;
		for (i = 0; i < polygon.VertexCount (); i++) {
			currVertex = polygon.GetVertex (i);
			position = JSM.CoordPlanePosition (currVertex, plane);
			currType = 0;
			if (position == 'CoordInFrontOfPlane') {
				currType = 1;
				frontFound = true;
			} else if (position == 'CoordAtBackOfPlane') {
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

	function GetEntryVertices (vertexTypes, entryVertices)
	{
		function FindPrevSide (index, vertexTypes)
		{
			var currIndex = index;
			while (vertexTypes[currIndex] === 0) {
				currIndex = (currIndex > 0 ? currIndex - 1 : vertexTypes.length - 1);
			}
			return vertexTypes[currIndex];
		}

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

	function AddCuttedPolygons (cutPolygon, entryVertices, vertexTypes, frontPolygons, backPolygons)
	{
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
				distances.push (JSM.CoordPlaneSignedDistance (vertex, referencePlane));
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
		var entryVertices = [];
		GetEntryVertices (vertexTypes, entryVertices);
		if (entryVertices.length === 0 || entryVertices.length % 2 !== 0) {
			return false;
		}
		AddCuttedPolygons (cutPolygon, entryVertices, vertexTypes, frontPolygons, backPolygons);
	}

	if (frontPolygons.length + backPolygons.length + planePolygons.length === 0) {
		return false;
	}
	return true;
};
