JSM.ConvertContourPolygonToPolygon2D = function (inputPolygon, vertexMap)
{
	function AddResultVertex (resultPolygon, vertex, vertexMap, originalContour, originalVertex)
	{
		resultPolygon.AddVertexCoord (vertex);
		if (vertexMap !== undefined && vertexMap !== null) {
			vertexMap.push ([originalContour, originalVertex]);
		}
	}
	
	function AddContour (inputPolygon, resultPolygon, holeIndex, vertexMap, conversionData)
	{
		function GetEntryPoint (inputPolygon, resultPolygon, holeIndex, conversionData)
		{
			function IsEntryPoint (inputPolygon, resultPolygon, resultVertex, holeVertex, conversionData)
			{
				function SegmentIntersectsPolygon (polygon, segmentBeg, segmentEnd)
				{
					var sector = new JSM.Sector2D (segmentBeg, segmentEnd);
					var position = polygon.SectorPosition (sector, -1, -1);
					if (position == JSM.SectorPolygonPosition2D.IntersectionOnePoint || position == JSM.SectorPolygonPosition2D.IntersectionCoincident) {
						return true;
					}
					return false;
				}

				if (SegmentIntersectsPolygon (resultPolygon, resultVertex, holeVertex)) {
					return false;
				}
				
				var i, hole;
				for (i = 1; i < inputPolygon.ContourCount (); i++) {
					if (conversionData.addedHoles[i] !== undefined) {
						continue;
					}
					hole = inputPolygon.GetContour (i);
					if (SegmentIntersectsPolygon (hole, resultVertex, holeVertex)) {
						return false;
					}
				}
				
				return true;
			}
			
			function IsExistingEntryPosition (coord, conversionData)
			{
				var i;
				for (i = 0; i < conversionData.entryPositions.length; i++) {
					if (coord.IsEqual (conversionData.entryPositions[i])) {
						return true;
					}
				}
				return false;
			}

			var holePolygon = inputPolygon.GetContour (holeIndex);
			var resultVertexIndex, holeVertexIndex, resultVertex, holeVertex;
			for (resultVertexIndex = 0; resultVertexIndex < resultPolygon.VertexCount (); resultVertexIndex++) {
				for (holeVertexIndex = 0; holeVertexIndex < holePolygon.VertexCount (); holeVertexIndex++) {
					resultVertex = resultPolygon.GetVertex (resultVertexIndex);
					holeVertex = holePolygon.GetVertex (holeVertexIndex);
					if (IsEntryPoint (inputPolygon, resultPolygon, resultVertex, holeVertex, conversionData)) {
						if (IsExistingEntryPosition (resultVertex, conversionData) || IsExistingEntryPosition (holeVertex, conversionData)) {
							continue;
						}
						conversionData.entryPositions.push (resultVertex.Clone ());
						conversionData.entryPositions.push (holeVertex.Clone ());
						return {
							beg : resultVertexIndex,
							end : holeVertexIndex
						};
					}
				}
			}
			return null;
		}
		
		function AddHole (resultPolygon, inputPolygon, holeIndex, entryPoint, vertexMap)
		{
			var holePolygon = inputPolygon.GetContour (holeIndex);
			var mainContourBeg = entryPoint.beg;
			var mainEntryVertex = resultPolygon.GetVertex (mainContourBeg).Clone ();
			resultPolygon.ShiftVertices (mainContourBeg + 1);

			var mainEntryContourIndex = 0;
			var mainEntryVertexIndex = 0;
			if (vertexMap !== undefined && vertexMap !== null) {
				mainEntryContourIndex = vertexMap[mainContourBeg][0];
				mainEntryVertexIndex = vertexMap[mainContourBeg][1];
				JSM.ShiftArray (vertexMap, mainContourBeg + 1);
			}

			var contourBeg = entryPoint.end;
			var contourEnd = holePolygon.GetPrevVertex (contourBeg);
			holePolygon.EnumerateVertices (contourBeg, contourEnd, function (index) {
				AddResultVertex (resultPolygon, holePolygon.GetVertex (index).Clone (), vertexMap, holeIndex, index);
			});
			AddResultVertex (resultPolygon, holePolygon.GetVertex (contourBeg).Clone (), vertexMap, holeIndex, contourBeg);
			AddResultVertex (resultPolygon, mainEntryVertex, vertexMap, mainEntryContourIndex, mainEntryVertexIndex);
		}
		
		var entryPoint = GetEntryPoint (inputPolygon, resultPolygon, holeIndex, conversionData);
		if (entryPoint === null) {
			return false;
		}

		AddHole (resultPolygon, inputPolygon, holeIndex, entryPoint, vertexMap);
		return true;
	}
	
	var contourCount = inputPolygon.ContourCount ();
	var mainContour = inputPolygon.GetContour (0);
	var resultPolygon = new JSM.Polygon2D ();
	var i, vertex;
	for (i = 0; i < mainContour.VertexCount (); i++) {
		vertex = mainContour.GetVertex (i);
		AddResultVertex (resultPolygon, vertex.Clone (), vertexMap, 0, i);
	}
	if (contourCount == 1) {
		return resultPolygon;
	}
	
	var holeQueue = [];
	var holeIndex;
	for (holeIndex = 1; holeIndex < contourCount; holeIndex++) {
		holeQueue.push (holeIndex);
	}
	
	var conversionData = {
		addedHoles : {},
		holeTryouts : {},
		entryPositions : []
	};
	
	while (holeQueue.length > 0) {
		holeIndex = holeQueue.shift ();
		if (AddContour (inputPolygon, resultPolygon, holeIndex, vertexMap, conversionData)) {
			conversionData.addedHoles[holeIndex] = true;
		} else {
			if (conversionData.holeTryouts[holeIndex] === undefined) {
				conversionData.holeTryouts[holeIndex] = 0;
			}
			conversionData.holeTryouts[holeIndex] += 1;
			if (conversionData.holeTryouts[holeIndex] > 10) {
				return null;
			}
			holeQueue.push (holeIndex);
		}
	}
	
	return resultPolygon;
};

JSM.TriangulateConvexPolygon = function (polygon)
{
	var result = [];
	var i;
	for (i = 1; i < polygon.VertexCount () - 1; i++) {
		result.push ([0, i, i + 1]);
	}
	return result;
};

JSM.TriangulateConcavePolygon2D = function (inputPolygon)
{
	function GetInitialVertexMap (count)
	{
		var result = [];
		var i;
		for (i = 0; i < count; i++) {
			result[i] = i;
		}
		return result;
	}
	
	function FindSplitDiagonal (polygon)
	{
		var count = polygon.VertexCount ();
		var i, j;
		for (i = 0; i < count; i++) {
			for (j = 0; j < count; j++) {
				if (i == j) {
					continue;
				}
				if (polygon.IsDiagonal (i, j)) {
					return {
						beg : i,
						end : j
					};
				}
			}
		}
		return null;
	}

	function SplitPolygon (polygonData, diagonal)
	{
		function AddVertex (polygonData, resultData, index)
		{
			resultData.polygon.AddVertexCoord (polygonData.polygon.GetVertex (index));
			resultData.map.push (polygonData.map[index]);
		}
		
		var resultData1 = {
			polygon : new JSM.Polygon2D (),
			map : []
		};
		var resultData2 = {
			polygon : new JSM.Polygon2D (),
			map : []
		};

		var beg, end;
		
		beg = diagonal.beg;
		end = polygonData.polygon.GetPrevVertex (diagonal.end);
		AddVertex (polygonData, resultData1, diagonal.end);
		polygonData.polygon.EnumerateVertices (beg, end, function (index) {
			AddVertex (polygonData, resultData1, index);
		});

		beg = diagonal.end;
		end = polygonData.polygon.GetPrevVertex (diagonal.beg);
		AddVertex (polygonData, resultData2, diagonal.beg);
		polygonData.polygon.EnumerateVertices (beg, end, function (index) {
			AddVertex (polygonData, resultData2, index);
		});
		
		return {
			resultData1 : resultData1,
			resultData2 : resultData2
		};
	}
	
	var polygonStack = [];
	var count = inputPolygon.VertexCount ();
	var inputMap = GetInitialVertexMap (count);
	polygonStack.push ({
		polygon : inputPolygon,
		map : inputMap
	});
	
	var result = [];
	var polygonData, vertexCount, diagonal, resultData;
	while (polygonStack.length > 0) {
		polygonData = polygonStack.pop ();
		vertexCount = polygonData.polygon.VertexCount ();
		if (vertexCount < 3) {
			continue;
		}
		if (vertexCount == 3) {
			result.push (polygonData.map);
			continue;
		}
		diagonal = FindSplitDiagonal (polygonData.polygon);
		if (diagonal === null) {
			return null;
		}
		resultData = SplitPolygon (polygonData, diagonal);
		polygonStack.push (resultData.resultData1);
		polygonStack.push (resultData.resultData2);
	}
	return result;
};

JSM.TriangulatePolygon2D = function (polygon)
{
	if (polygon === null) {
		return null;
	}
	
	var vertexCount = polygon.VertexCount ();
	if (vertexCount < 3) {
		return null;
	}
	
	if (vertexCount == 3) {
		return [[0, 1, 2]];
	}
	
	var complexity = polygon.GetComplexity ();
	if (complexity === JSM.Complexity.Invalid) {
		return null;
	}
	
	if (complexity == JSM.Complexity.Convex) {
		return JSM.TriangulateConvexPolygon (polygon);
	}
	
	return JSM.TriangulateConcavePolygon2D (polygon);
};

/**
* Function: TriangulatePolygon
* Description:
*	Triangulates a polygon. The result defines triangles as an
*	array of arrays with three original vertex indices.
* Parameters:
*	polygon {Polygon} the polygon
* Returns:
*	{integer[3][*]} the result
*/
JSM.TriangulatePolygon = function (polygon)
{
	var polygon2D = polygon.ToPolygon2D ();
	return JSM.TriangulatePolygon2D (polygon2D);
};
