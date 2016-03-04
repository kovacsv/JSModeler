JSM.CutVertexType = {
	Left : 1,
	Right : 2,
	OnCut : 3
};

JSM.PolygonCutter = function (geometryInterface)
{
	this.geometryInterface = geometryInterface;
	this.Reset ();
};

JSM.PolygonCutter.prototype.Cut = function (polygon, aSidePolygons, bSidePolygons, cutPolygons)
{
	this.Reset ();
	
	var allVertexType = this.CalculateOriginalPolygonData (polygon);
	if (allVertexType !== null) {
		var cloned = polygon.Clone ();
		if (allVertexType == JSM.CutVertexType.Left) {
			aSidePolygons.push (cloned);
		} else if (allVertexType == JSM.CutVertexType.Right) {
			bSidePolygons.push (cloned);
		} else {
			cutPolygons.push (cloned);
		}
		return true;
	}
	
	if (!this.CalculateCutPolygonData ()) {
		return false;
	}

	if (!this.CalculateEntryVertices ()) {
		return false;
	}
	
	if (!this.CalculateCuttedPolygons (aSidePolygons, bSidePolygons)) {
		return false;
	}	
	
	return true;
};

JSM.PolygonCutter.prototype.Reset = function ()
{
	this.originalPolygon = null;
	this.originalVertexTypes = null;
	this.cutPolygon = null;
	this.cutVertexTypes = null;
	this.entryVertices = null;
};

JSM.PolygonCutter.prototype.CalculateOriginalPolygonData = function (polygon)
{
	this.originalPolygon = polygon;
	this.originalVertexTypes = [];
	var aSideFound = false;
	var bSideFound = false;
	
	var i, vertex, type;
	for (i = 0; i < this.originalPolygon.VertexCount (); i++) {
		vertex = this.originalPolygon.GetVertex (i);
		type = this.geometryInterface.getVertexSide (vertex);
		if (type == JSM.CutVertexType.Left) {
			aSideFound = true;
		} else if (type == JSM.CutVertexType.Right) {
			bSideFound = true;
		}
		this.originalVertexTypes.push (type);
	}
	
	if (aSideFound && bSideFound) {
		return null;
	}
	
	if (aSideFound) {
		return JSM.CutVertexType.Left;
	} else if (bSideFound) {
		return JSM.CutVertexType.Right;
	}
	
	return JSM.CutVertexType.OnCut;
};

JSM.PolygonCutter.prototype.CalculateCutPolygonData = function ()
{
	function AddVertex (polygonCutter, index)
	{
		function IsIntersectionVertex (cutVertexTypes, originalType)
		{
			if (cutVertexTypes.length === 0) {
				return false;
			}
			var prevType = cutVertexTypes[cutVertexTypes.length - 1];
			return prevType !== JSM.CutVertexType.OnCut && originalType !== JSM.CutVertexType.OnCut && prevType != originalType;
		}
		
		function AddIntersectionVertex (polygonCutter, originalIndex)
		{
			var prevIndex = polygonCutter.originalPolygon.GetPrevVertex (originalIndex);
			var prevVertex = polygonCutter.originalPolygon.GetVertex (prevIndex);
			var currVertex = polygonCutter.originalPolygon.GetVertex (originalIndex);
			var intersection = polygonCutter.geometryInterface.getIntersectionVertex (prevVertex, currVertex);
			if (intersection === null) {
				return false;
			}
			polygonCutter.cutPolygon.AddVertexCoord (intersection);
			polygonCutter.cutVertexTypes.push (JSM.CutVertexType.OnCut);
			return true;
		}
		
		function AddOriginalVertex (polygonCutter, originalIndex, originalType)
		{
			polygonCutter.cutPolygon.AddVertexCoord (polygonCutter.originalPolygon.GetVertex (originalIndex).Clone ());
			polygonCutter.cutVertexTypes.push (originalType);
			return true;
		}
	
		var lastVertex = (index === polygonCutter.originalPolygon.VertexCount ());
		var originalIndex = index;
		if (lastVertex) {
			originalIndex = 0;
		}
		
		var originalType = polygonCutter.originalVertexTypes[originalIndex];
		if (IsIntersectionVertex (polygonCutter.cutVertexTypes, originalType)) {
			if (!AddIntersectionVertex (polygonCutter, originalIndex)) {
				return false;
			}
		}
		
		if (!lastVertex) {
			if (!AddOriginalVertex (polygonCutter, originalIndex, originalType)) {
				return false;
			}
		}
		
		return true;
	}
	
	this.cutPolygon = this.geometryInterface.createPolygon ();
	this.cutVertexTypes = [];
	
	var i;
	for (i = 0; i <= this.originalPolygon.VertexCount (); i++) {
		if (!AddVertex (this, i)) {
			return false;
		}
	}
	
	return true;
};

JSM.PolygonCutter.prototype.CalculateEntryVertices = function ()
{
	function SortEntryVertices (cutPolygon, entryVertices, geometryInterface)
	{
		if (entryVertices.length < 2) {
			return false;
		}

		var distances = geometryInterface.getVertexDistances (cutPolygon, entryVertices);
		JSM.BubbleSort (distances,
			function (a, b) {
				return JSM.IsGreater (a, b);
			},
			function (i, j) {
				JSM.SwapArrayValues (distances, i, j);
				JSM.SwapArrayValues (entryVertices, i, j);
			}
		);
		
		return true;
	}	

	function IsEntryVertex (cutVertexTypes, index)
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
			return JSM.CutVertexType.OnCut;
		}
		
		var currSideType = cutVertexTypes[index];
		if (currSideType !== JSM.CutVertexType.OnCut) {
			return false;
		}
		
		var prevIndex = JSM.PrevIndex (index, cutVertexTypes.length);
		var nextIndex = JSM.NextIndex (index, cutVertexTypes.length);
		var prevSideType = cutVertexTypes[prevIndex];
		var nextSideType = cutVertexTypes[nextIndex];

		if (nextSideType != JSM.CutVertexType.OnCut && prevSideType == JSM.CutVertexType.OnCut) {
			prevSideType = FindPrevSideType (prevIndex, cutVertexTypes);
		}

		if (prevSideType == JSM.CutVertexType.Right && nextSideType == JSM.CutVertexType.Left) {
			return true;
		} else if (prevSideType == JSM.CutVertexType.Left && nextSideType == JSM.CutVertexType.Right) {
			return true;
		}
		
		return false;
	}

	this.entryVertices = [];
	var i;
	for (i = 0; i < this.cutVertexTypes.length; i++) {
		if (IsEntryVertex (this.cutVertexTypes, i)) {
			this.entryVertices.push (i);
		}
	}

	if (this.entryVertices.length === 0 || this.entryVertices.length % 2 !== 0) {
		return false;
	}
	
	if (!SortEntryVertices (this.cutPolygon, this.entryVertices, this.geometryInterface)) {
		return false;
	}
	
	return true;
};

JSM.PolygonCutter.prototype.CalculateCuttedPolygons = function (aSidePolygons, bSidePolygons)
{
	function AddOneSideCuttedPolygons (polygonCutter, aSidePolygons, bSidePolygons, reversed)
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

		function AddCutPolygon (polygonCutter, entryPairs, currEntryVertex, aSidePolygons, bSidePolygons)
		{
			var startVertexIndex = polygonCutter.entryVertices[currEntryVertex];
			if (entryPairs[startVertexIndex] !== -1) {
				var currPolygon = polygonCutter.geometryInterface.createPolygon ();
				currPolygon.AddVertexCoord (polygonCutter.cutPolygon.GetVertex (startVertexIndex).Clone ());
				var currVertexIndex = GetNextVertex (startVertexIndex, polygonCutter.cutPolygon, entryPairs);
				var polygonSide = null;
				while (currVertexIndex != startVertexIndex) {
					if (polygonSide === null) {
						if (polygonCutter.cutVertexTypes[currVertexIndex] !== JSM.CutVertexType.OnCut) {
							polygonSide = polygonCutter.cutVertexTypes[currVertexIndex];
						}
					}
					currPolygon.AddVertexCoord (polygonCutter.cutPolygon.GetVertex (currVertexIndex).Clone ());
					currVertexIndex = GetNextVertex (currVertexIndex, polygonCutter.cutPolygon, entryPairs);
				}
				if (polygonSide == JSM.CutVertexType.Left) {
					aSidePolygons.push (currPolygon);
				} else if (polygonSide == JSM.CutVertexType.Right) {
					bSidePolygons.push (currPolygon);
				}
			}				
			
		}
		
		var entryPairs = [];
		CreateEntryPairsArray (polygonCutter.cutPolygon, polygonCutter.entryVertices, entryPairs);
		
		var currEntryVertex = reversed ? polygonCutter.entryVertices.length - 1 : 0;
		while (currEntryVertex >= 0 && currEntryVertex < polygonCutter.entryVertices.length) {
			AddCutPolygon (polygonCutter, entryPairs, currEntryVertex, aSidePolygons, bSidePolygons);
			currEntryVertex = reversed ? currEntryVertex - 2 : currEntryVertex + 2;
		}
	}

	AddOneSideCuttedPolygons (this, aSidePolygons, bSidePolygons, false);
	AddOneSideCuttedPolygons (this, aSidePolygons, bSidePolygons, true);
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
			var type = JSM.CutVertexType.OnCut;
			if (position == JSM.CoordLinePosition2D.CoordAtLineLeft) {
				type = JSM.CutVertexType.Left;
			} else if (position == JSM.CoordLinePosition2D.CoordAtLineRight) {
				type = JSM.CutVertexType.Right;
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
		getVertexDistances : function (polygon, vertexIndices) {
			var referenceCoord1 = polygon.GetVertex (vertexIndices[0]);
			var referenceCoord2 = polygon.GetVertex (vertexIndices[1]);
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
	
	var cutter = new JSM.PolygonCutter (geometryInterface);
	return cutter.Cut (polygon, leftPolygons, rightPolygons, cutPolygons);
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
			var type = JSM.CutVertexType.OnCut;
			if (position == JSM.CoordPlanePosition.CoordInFrontOfPlane) {
				type = JSM.CutVertexType.Left;
			} else if (position == JSM.CoordPlanePosition.CoordAtBackOfPlane) {
				type = JSM.CutVertexType.Right;
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
		getVertexDistances : function (polygon, vertexIndices) {
			var referenceCoord1 = polygon.GetVertex (vertexIndices[0]);
			var referenceCoord2 = polygon.GetVertex (vertexIndices[1]);
			var direction = JSM.CoordSub (referenceCoord2, referenceCoord1);
			var i, vertex;
			var distances = [];
			for (i = 0; i < vertexIndices.length; i++) {
				vertex = polygon.GetVertex (vertexIndices[i]);
				distances.push (JSM.CoordSignedDistance (referenceCoord1, vertex, direction));
			}
			return distances;
		}
	};
	
	var cutter = new JSM.PolygonCutter (geometryInterface);
	return cutter.Cut (polygon, frontPolygons, backPolygons, cutPolygons);
};
