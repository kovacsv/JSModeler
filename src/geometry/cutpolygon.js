JSM.CutPolygonInternal = function (polygon, geometryInterface, aSidePolygons, bSidePolygons, cutPolygons)
{
	function GetOriginalPolygonData (polygon)
	{
		var originalPolygonData = {
			polygon : polygon,
			vertexTypes : [],
			backFound : false,
			frontFound : false
		};
		var i, vertex, type;
		for (i = 0; i < polygon.VertexCount (); i++) {
			vertex = polygon.GetVertex (i);
			type = geometryInterface.getVertexSide (vertex);
			if (type == 1) {
				originalPolygonData.frontFound = true;
			} else if (type == -1) {
				originalPolygonData.backFound = true;
			}
			originalPolygonData.vertexTypes.push (type);
		}
		return originalPolygonData;
	}	
	
	function GetCutPolygonData (originalPolygonData)
	{
		function AddVertex (originalPolygonData, cutPolygonData, index)
		{
			function IsIntersectionVertex (cutVertexTypes, originalType)
			{
				if (cutVertexTypes.length === 0) {
					return false;
				}
				var prevType = cutVertexTypes[cutVertexTypes.length - 1];
				return prevType !== 0 && originalType !== 0 && prevType != originalType;
			}
			
			function AddIntersectionVertex (polygon, cutPolygonData, currIndex)
			{
				var prevIndex = polygon.GetPrevVertex (currIndex);
				var prevVertex = polygon.GetVertex (prevIndex);
				var currVertex = polygon.GetVertex (currIndex);
				var intersection = geometryInterface.getIntersectionVertex (prevVertex, currVertex);
				if (intersection !== null) {
					cutPolygonData.polygon.AddVertexCoord (intersection);
					cutPolygonData.vertexTypes.push (0);
				}
			}
			
			function AddOriginalVertex (polygon, cutPolygonData, currIndex, originalType)
			{
				cutPolygonData.polygon.AddVertexCoord (polygon.GetVertex (currIndex).Clone ());
				cutPolygonData.vertexTypes.push (originalType);
			}
		
			var lastVertex = (index === originalPolygonData.polygon.VertexCount ());
			var currIndex = index;
			if (lastVertex) {
				currIndex = 0;
			}
			
			var originalType = originalPolygonData.vertexTypes[currIndex];
			if (IsIntersectionVertex (cutPolygonData.vertexTypes, originalType)) {
				AddIntersectionVertex (originalPolygonData.polygon, cutPolygonData, currIndex);
			}
			
			if (!lastVertex) {
				AddOriginalVertex (originalPolygonData.polygon, cutPolygonData, currIndex, originalType);
			}
		}
		
		var cutPolygonData = {
			polygon : geometryInterface.createPolygon (),
			vertexTypes : []
		};
		
		var i;
		for (i = 0; i <= polygon.VertexCount (); i++) {
			AddVertex (originalPolygonData, cutPolygonData, i);
		}
		
		return cutPolygonData;
	}

	function AddCuttedPolygons (cutPolygonData, aSidePolygons, bSidePolygons)
	{
		function GetEntryVertices (cutVertexTypes)
		{
			function FindPrevSideType (index, cutVertexTypes)
			{
				var currIndex = JSM.PrevIndex (index, cutVertexTypes.length);
				while (currIndex != index) {
					if (cutVertexTypes[currIndex] !== 0) {
						return cutVertexTypes[currIndex];
					}
					currIndex = JSM.PrevIndex (currIndex, cutVertexTypes.length);
				}
				return 0;
			}

			var entryVertices = [];
			var i, currSide, prevIndex, nextIndex, prevSideType, nextSideType;
			for (i = 0; i < cutVertexTypes.length; i++) {
				currSide = cutVertexTypes[i];
				if (currSide === 0) {
					prevIndex = JSM.PrevIndex (i, cutVertexTypes.length);
					nextIndex = JSM.NextIndex (i, cutVertexTypes.length);
					prevSideType = cutVertexTypes[prevIndex];
					nextSideType = cutVertexTypes[nextIndex];
					if (nextSideType !== 0 && prevSideType === 0) {
						prevSideType = FindPrevSideType (prevIndex, cutVertexTypes);
					}
					if ((prevSideType == -1 && nextSideType == 1) || (prevSideType == 1 && nextSideType == -1)) {
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
			var distances = geometryInterface.getVertexDistances (cutPolygon, entryVertices, referenceCoord1, referenceCoord2);
			var i, j;
			for (i = 0; i < entryVertices.length - 1; i++) {
				for (j = 0; j < entryVertices.length - i - 1; j++) {
					if (JSM.IsGreater (distances[j], distances[j + 1])) {
						SwapArrayValues (distances, j, j + 1);
						SwapArrayValues (entryVertices, j, j + 1);
					}
				}
			}
		}
			
		function AddOneSideCuttedPolygons (cutPolygonData, entryVertices, aSidePolygons, bSidePolygons, reversed)
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
			
			function GetNextVertex (currVertexIndex, cutPolygon, entryPairs)
			{
				if (entryPairs[currVertexIndex] != -1) {
					var nextVertex = entryPairs[currVertexIndex];
					RemoveEntryPairFromArray (entryPairs, currVertexIndex);
					return nextVertex;
				} else {
					return JSM.NextIndex (currVertexIndex, cutPolygon.VertexCount ());
				}				
			}

			function AddCutPolygon (cutPolygonData, entryVertices, entryPairs, currEntryVertex, aSidePolygons, bSidePolygons)
			{
				var startVertexIndex = entryVertices[currEntryVertex];
				if (entryPairs[startVertexIndex] !== -1) {
					var currPolygon = geometryInterface.createPolygon ();
					currPolygon.AddVertexCoord (cutPolygonData.polygon.GetVertex (startVertexIndex).Clone ());
					var currVertexIndex = GetNextVertex (startVertexIndex, cutPolygonData.polygon, entryPairs);
					var polygonSide = null;
					while (currVertexIndex != startVertexIndex) {
						if (polygonSide === null) {
							if (cutPolygonData.vertexTypes[currVertexIndex] !== 0) {
								polygonSide = cutPolygonData.vertexTypes[currVertexIndex];
							}
						}
						currPolygon.AddVertexCoord (cutPolygonData.polygon.GetVertex (currVertexIndex).Clone ());
						currVertexIndex = GetNextVertex (currVertexIndex, cutPolygonData.polygon, entryPairs);
					}
					if (polygonSide == 1) {
						aSidePolygons.push (currPolygon);
					} else if (polygonSide == -1) {
						bSidePolygons.push (currPolygon);
					}
				}				
				
			}
			
			var entryPairs = [];
			CreateEntryPairsArray (cutPolygonData.polygon, entryVertices, entryPairs);
			
			var currEntryVertex = reversed ? entryVertices.length - 1 : 0;
			while (currEntryVertex >= 0 && currEntryVertex < entryVertices.length) {
				AddCutPolygon (cutPolygonData, entryVertices, entryPairs, currEntryVertex, aSidePolygons, bSidePolygons);
				currEntryVertex = reversed ? currEntryVertex - 2 : currEntryVertex + 2;
			}
		}

		var entryVertices = GetEntryVertices (cutPolygonData.vertexTypes);
		if (entryVertices.length === 0 || entryVertices.length % 2 !== 0) {
			return;
		}

		SortEntryVertices (cutPolygonData.polygon, entryVertices);
		AddOneSideCuttedPolygons (cutPolygonData, entryVertices, aSidePolygons, bSidePolygons, false);
		AddOneSideCuttedPolygons (cutPolygonData, entryVertices, aSidePolygons, bSidePolygons, true);
	}
	
	var originalPolygonData = GetOriginalPolygonData (polygon);
	if (originalPolygonData.backFound && originalPolygonData.frontFound) {
		var cutPolygonData = GetCutPolygonData (originalPolygonData);
		AddCuttedPolygons (cutPolygonData, aSidePolygons, bSidePolygons);
	} else {
		var cloned = polygon.Clone ();
		if (originalPolygonData.frontFound) {
			aSidePolygons.push (cloned);
		} else if (originalPolygonData.backFound) {
			bSidePolygons.push (cloned);
		} else {
			cutPolygons.push (cloned);
		}		
	}	
	
	if (aSidePolygons.length + bSidePolygons.length + cutPolygons.length === 0) {
		return false;
	}
	return true;
};

/**
* Function: CutPolygon2DWithLine
* Description:
*	Cuts a polygon with a line. The result array contains cutted
*	polygons grouped by their position to the line.
* Parameters:
*	polygon {Polygon2D} the polygon
*	line {Line2D} the line
*	leftPolygons {Polygon2D[*]} (out) polygons on the left of the line
*	rightPolygons {Polygon2D[*]} (out) polygons on the right of the line
*	cutPolygons {Polygon2D[*]} (out) polygons on the line
* Returns:
*	{boolean} success
*/
JSM.CutPolygon2DWithLine = function (polygon, line, leftPolygons, rightPolygons, cutPolygons)
{
	var geometryInterface = {
		createPolygon : function () {
			return new JSM.Polygon2D ();
		},
		getVertexSide : function (vertex) {
			var position = line.CoordPosition (vertex);
			var type = 0;
			if (position == JSM.CoordLinePosition2D.CoordAtLineLeft) {
				type = 1;
			} else if (position == JSM.CoordLinePosition2D.CoordAtLineRight) {
				type = -1;
			}
			return type;
		},
		getIntersectionVertex : function (prevVertex, currVertex) {
			var edgeLine = new JSM.Line2D (currVertex, JSM.CoordSub2D (currVertex, prevVertex));
			var intersection = new JSM.Coord2D (0.0, 0.0);
			var lineLinePosition = line.LinePosition (edgeLine, intersection);
			if (lineLinePosition != JSM.LineLinePosition2D.LinesIntersectsOnePoint) {
				return null;
			}
			return intersection;
		},
		getVertexDistances : function (polygon, vertexIndices, referenceCoord1, referenceCoord2) {
			var direction = JSM.CoordSub2D (referenceCoord2, referenceCoord1);
			var i, vertex;
			var distances = [];
			for (i = 0; i < vertexIndices.length; i++) {
				vertex = polygon.GetVertex (vertexIndices[i]);
				distances.push (JSM.CoordSignedDistance2D (referenceCoord1, vertex, direction));
			}
			return distances;
		}
	};
	
	return JSM.CutPolygonInternal (polygon, geometryInterface, leftPolygons, rightPolygons, cutPolygons);
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
*	cutPolygons {Polygon[*]} (out) polygons on the plane
* Returns:
*	{boolean} success
*/
JSM.CutPolygonWithPlane = function (polygon, plane, frontPolygons, backPolygons, cutPolygons)
{
	var geometryInterface = {
		createPolygon : function () {
			return new JSM.Polygon ();
		},
		getVertexSide : function (vertex) {
			var position = plane.CoordPosition (vertex);
			var type = 0;
			if (position == JSM.CoordPlanePosition.CoordInFrontOfPlane) {
				type = 1;
			} else if (position == JSM.CoordPlanePosition.CoordAtBackOfPlane) {
				type = -1;
			}
			return type;
		},
		getIntersectionVertex : function (prevVertex, currVertex) {
			var line = new JSM.Line (currVertex, JSM.CoordSub (currVertex, prevVertex));
			var intersection = new JSM.Coord (0.0, 0.0, 0.0);
			var linePlanePosition = plane.LinePosition (line, intersection);
			if (linePlanePosition != JSM.LinePlanePosition.LineIntersectsPlane) {
				return null;
			}
			return intersection;
		},
		getVertexDistances : function (polygon, vertexIndices, referenceCoord1, referenceCoord2) {
			var direction = JSM.CoordSub (referenceCoord2, referenceCoord1);
			var referencePlane = JSM.GetPlaneFromCoordAndDirection (referenceCoord1, direction);
			var i, vertex;
			var distances = [];
			for (i = 0; i < vertexIndices.length; i++) {
				vertex = polygon.GetVertex (vertexIndices[i]);
				distances.push (referencePlane.CoordSignedDistance (vertex));
			}
			return distances;
		}
	};
	
	return JSM.CutPolygonInternal (polygon, geometryInterface, frontPolygons, backPolygons, cutPolygons);
};
