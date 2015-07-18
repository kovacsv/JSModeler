JSM.ConvertPolygonToSimplePolygon = function (inputPolygon)
{
	function AddContour (inputPolygon, resultPolygon, holeIndex, conversionData)
	{
		function GetEntryPoint (inputPolygon, resultPolygon, holeIndex, conversionData)
		{
			function IsEntryPoint (inputPolygon, resultPolygon, resultVertex, holeVertex, conversionData)
			{
				function SegmentIntersectsPolygon (polygon, segmentBeg, segmentEnd)
				{
					var position = polygon.SectorPosition (segmentBeg, segmentEnd, -1, -1);
					if (position == JSM.SectorPosition.IntersectionOnePoint || position == JSM.SectorPosition.IntersectionCoincident) {
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
		
		function AddHole (resultPolygon, holePolygon, entryPoint)
		{
			var entryVertex = resultPolygon.GetVertex (entryPoint.beg).Clone ();
			resultPolygon.ShiftVertices (entryPoint.beg + 1);

			var contourBeg = entryPoint.end;
			var contourEnd = holePolygon.GetPrevVertex (contourBeg);
			holePolygon.EnumerateVertices (contourBeg, contourEnd, function (index) {
				resultPolygon.AddVertexCoord (holePolygon.GetVertex (index).Clone ());
			});
			resultPolygon.AddVertexCoord (holePolygon.GetVertex (contourBeg).Clone ());
			resultPolygon.AddVertexCoord (entryVertex);
		}
		
		var entryPoint = GetEntryPoint (inputPolygon, resultPolygon, holeIndex, conversionData);
		if (entryPoint === null) {
			return false;
		}

		var holePolygon = inputPolygon.GetContour (holeIndex);
		AddHole (resultPolygon, holePolygon, entryPoint);
		return true;
	}
	
	var contourCount = inputPolygon.ContourCount ();
	var mainContour = inputPolygon.GetContour (0);
	var resultPolygon = mainContour.Clone ();
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
		entryPositions : []
	};
	while (holeQueue.length > 0) {
		holeIndex = holeQueue.shift ();
		if (AddContour (inputPolygon, resultPolygon, holeIndex, conversionData)) {
			conversionData.addedHoles[holeIndex] = true;
		} else {
			holeQueue.push (holeIndex);
		}
	}
	
	return resultPolygon;
};

JSM.TriangulateSimpleConvexPolygon = function (polygon)
{
	var result = [];
	var i;
	for (i = 1; i < polygon.VertexCount () - 1; i++) {
		result.push ([0, i, i + 1]);
	}
	return result;
};

JSM.TriangulateSimpleConcavePolygonDiagonal = function (inputPolygon, onProcess)
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
		var resultData1 = {
			polygon : new JSM.Polygon2D (),
			map : []
		};
		var resultData2 = {
			polygon : new JSM.Polygon2D (),
			map : []
		};
		polygonData.polygon.EnumerateVertices (diagonal.beg, diagonal.end, function (index) {
			resultData1.polygon.AddVertexCoord (polygonData.polygon.GetVertex (index));
			resultData1.map.push (polygonData.map[index]);
		});
		polygonData.polygon.EnumerateVertices (diagonal.end, diagonal.beg, function (index) {
			resultData2.polygon.AddVertexCoord (polygonData.polygon.GetVertex (index));
			resultData2.map.push (polygonData.map[index]);
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
		if (onProcess !== undefined && onProcess !== null) {
			onProcess (polygonData.polygon, diagonal);
		}
		resultData = SplitPolygon (polygonData, diagonal);
		polygonStack.push (resultData.resultData1);
		polygonStack.push (resultData.resultData2);
	}
	return result;
};

JSM.TriangulateSimpleConcavePolygon = function (polygon)
{
	return JSM.TriangulateSimpleConcavePolygonDiagonal (polygon);
};

JSM.TriangulateSimplePolygon = function (polygon)
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
	if (complexity == JSM.Complexity.Convex) {
		return JSM.TriangulateSimpleConvexPolygon (polygon);
	}
	
	return JSM.TriangulateSimpleConcavePolygon (polygon);
};
