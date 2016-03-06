JSM.CutVertexType = {
	Left : 1,
	Right : 2,
	Cut : 3
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
	this.originalPolygonVertexTypes = null;
	this.cutPolygon = null;
	this.cutPolygonVertexTypes = null;
	this.cutVertexIndices = null;
	this.cutVertexDistances = null;
	this.entryVertices = null;
};

JSM.PolygonCutter.prototype.CalculateOriginalPolygonData = function (polygon)
{
	this.originalPolygon = polygon;
	this.originalPolygonVertexTypes = [];
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
		this.originalPolygonVertexTypes.push (type);
	}
	
	if (aSideFound && bSideFound) {
		return null;
	}
	
	if (aSideFound) {
		return JSM.CutVertexType.Left;
	} else if (bSideFound) {
		return JSM.CutVertexType.Right;
	}
	
	return JSM.CutVertexType.Cut;
};

JSM.PolygonCutter.prototype.CalculateCutPolygonData = function ()
{
	function IsIntersectionVertex (cutPolygonVertexTypes, originalType)
	{
		if (cutPolygonVertexTypes.length === 0) {
			return false;
		}
		var prevType = cutPolygonVertexTypes[cutPolygonVertexTypes.length - 1];
		if (prevType == JSM.CutVertexType.Cut || originalType == JSM.CutVertexType.Cut) {
			return false;
		}
		return prevType != originalType;
	}
	
	function AddCutVertexToPolygon (polygonCutter, vertex, type)
	{
		polygonCutter.cutPolygon.AddVertexCoord (vertex);
		polygonCutter.cutPolygonVertexTypes.push (type);
		if (type == JSM.CutVertexType.Cut) {
			polygonCutter.cutVertexIndices.push (polygonCutter.cutPolygonVertexTypes.length - 1);
		}
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
		AddCutVertexToPolygon (polygonCutter, intersection, JSM.CutVertexType.Cut);
		return true;
	}
	
	function AddOriginalVertex (polygonCutter, originalIndex, originalType)
	{
		var vertex = polygonCutter.originalPolygon.GetVertex (originalIndex).Clone ();
		AddCutVertexToPolygon (polygonCutter, vertex, originalType);
		return true;
	}
	
	function SortCutVertices (cutPolygon, cutVertexIndices, cutVertexDistances)
	{
		if (cutVertexIndices.length < 2) {
			return false;
		}

		JSM.BubbleSort (cutVertexDistances,
			function (a, b) {
				return JSM.IsLower (a, b);
			},
			function (i, j) {
				JSM.SwapArrayValues (cutVertexIndices, i, j);
				JSM.SwapArrayValues (cutVertexDistances, i, j);
			}
		);
		
		return true;
	}	

	this.cutPolygon = this.geometryInterface.createPolygon ();
	this.cutPolygonVertexTypes = [];
	this.cutVertexIndices = [];
	
	var vertexCount = this.originalPolygon.VertexCount ();
	var i, lastVertex, originalIndex, originalType;
	for (i = 0; i <= vertexCount; i++) {
		lastVertex = (i === vertexCount);
		originalIndex = i;
		if (lastVertex) {
			originalIndex = 0;
		}
		
		originalType = this.originalPolygonVertexTypes[originalIndex];
		if (IsIntersectionVertex (this.cutPolygonVertexTypes, originalType)) {
			AddIntersectionVertex (this, originalIndex);
		}
		
		if (!lastVertex) {
			AddOriginalVertex (this, originalIndex, originalType);
		}
	}
	
	this.cutVertexDistances = this.geometryInterface.getVertexDistances (this.cutPolygon, this.cutVertexIndices);
	if (!SortCutVertices (this.cutPolygon, this.cutVertexIndices, this.cutVertexDistances)) {
		return false;
	}
	
	return true;
};

JSM.PolygonCutter.prototype.CalculateEntryVertices = function ()
{
	function IsEntryVertex (cutPolygonVertexTypes, cutVertexIndices, cutVertexDistances, index)
	{
		var vertexIndex = cutVertexIndices[index];
		var vertexDistance = cutVertexDistances[index];
		var currSideType = cutPolygonVertexTypes[vertexIndex];
		if (currSideType != JSM.CutVertexType.Cut) {
			return false;
		}
		
		var prevIndex = JSM.PrevIndex (vertexIndex, cutPolygonVertexTypes.length);
		var nextIndex = JSM.NextIndex (vertexIndex, cutPolygonVertexTypes.length);
		var prevSideType = cutPolygonVertexTypes[prevIndex];
		var nextSideType = cutPolygonVertexTypes[nextIndex];

		if (prevSideType == JSM.CutVertexType.Right) {
			if (nextSideType == JSM.CutVertexType.Left) {
				return true;
			} else if (nextSideType == JSM.CutVertexType.Cut) {
				return vertexDistance < cutVertexDistances[index + 1];
			}
		} else if (prevSideType == JSM.CutVertexType.Left) {
			if (nextSideType == JSM.CutVertexType.Right) {
				return true;
			} else if (nextSideType == JSM.CutVertexType.Cut) {
				return vertexDistance > cutVertexDistances[index - 1];
			}
		} else if (prevSideType == JSM.CutVertexType.Cut) {
			if (nextSideType == JSM.CutVertexType.Left) {
				return vertexDistance < cutVertexDistances[index + 1];
			} else if (nextSideType == JSM.CutVertexType.Right) {
				return vertexDistance > cutVertexDistances[index - 1];
			}
		}
		
		return false;
	}

	this.entryVertices = [];
	var i, vertexIndex;
	for (i = 0; i < this.cutVertexIndices.length; i++) {
		vertexIndex = this.cutVertexIndices[i];
		if (IsEntryVertex (this.cutPolygonVertexTypes, this.cutVertexIndices, this.cutVertexDistances, i)) {
			this.entryVertices.push (vertexIndex);
		}
	}

	if (this.entryVertices.length === 0 || this.entryVertices.length % 2 !== 0) {
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
						if (polygonCutter.cutPolygonVertexTypes[currVertexIndex] !== JSM.CutVertexType.Cut) {
							polygonSide = polygonCutter.cutPolygonVertexTypes[currVertexIndex];
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
			var type = JSM.CutVertexType.Cut;
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
			var i, vertex;
			var distances = [];
			for (i = 0; i < vertexIndices.length; i++) {
				vertex = polygon.GetVertex (vertexIndices[i]);
				distances.push (JSM.CoordSignedDistance2D (line.start, vertex, line.direction));
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
			var type = JSM.CutVertexType.Cut;
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
			var polygonNormal = polygon.GetNormal ();
			var planeNormal = new JSM.Vector (plane.a, plane.b, plane.c);
			var refPlaneNormal = JSM.VectorCross (planeNormal, polygonNormal);
			var refPlane = JSM.GetPlaneFromCoordAndDirection (polygon.GetVertex (0), refPlaneNormal);
			var i, vertex;
			var distances = [];
			for (i = 0; i < vertexIndices.length; i++) {
				vertex = polygon.GetVertex (vertexIndices[i]);
				distances.push (refPlane.CoordSignedDistance (vertex));
			}
			return distances;
		}
	};
	
	var cutter = new JSM.PolygonCutter (geometryInterface);
	return cutter.Cut (polygon, frontPolygons, backPolygons, cutPolygons);
};
