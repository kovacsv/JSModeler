/**
* Class: Polygon
* Description: Represents a 3D polygon.
*/
JSM.Polygon = function ()
{
	this.vertices = null;
	this.cache = null;
	this.Clear ();
};

/**
* Function: Polygon.AddVertex
* Description: Adds a vertex to the polygon.
* Parameters:
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*	z {number} the z coordinate of the vertex
*/
JSM.Polygon.prototype.AddVertex = function (x, y, z)
{
	this.AddVertexCoord (new JSM.Coord (x, y, z));
};

/**
* Function: Polygon.AddVertexCoord
* Description: Adds a vertex coordinate to the polygon.
* Parameters:
*	coord {Coord} the coordinate
*/
JSM.Polygon.prototype.AddVertexCoord = function (coord)
{
	this.vertices.push (coord);
	this.ClearCache ();
};

/**
* Function: Polygon.GetVertex
* Description: Returns the vertex with the given index.
* Parameters:
*	index {integer} the index of the vertex
* Returns:
*	{Coord} the vertex
*/
JSM.Polygon.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

/**
* Function: Polygon.VertexCount
* Description: Returns the vertex count of the polygon.
* Returns:
*	{integer} vertex count
*/
JSM.Polygon.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

/**
* Function: Polygon.GetNextVertex
* Description: Returns the vertex index after the given one.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{integer} the result
*/
JSM.Polygon.prototype.GetNextVertex = function (index)
{
	var count = this.vertices.length;
	return (index < count - 1 ? index + 1 : 0);
};

/**
* Function: Polygon.GetVertexAngle
* Description: Returns the angle of the given vertex.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{number} the result
*/
JSM.Polygon.prototype.GetVertexAngle = function (index)
{
	var prev = this.vertices[this.GetPrevVertex (index)];
	var curr = this.vertices[index];
	var next = this.vertices[this.GetNextVertex (index)];
	var prevDir = JSM.CoordSub (prev, curr);
	var nextDir = JSM.CoordSub (next, curr);
	return prevDir.AngleTo (nextDir);
};

/**
* Function: Polygon.GetPrevVertex
* Description: Returns the vertex index before the given one.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{integer} the result
*/
JSM.Polygon.prototype.GetPrevVertex = function (index)
{
	var count = this.vertices.length;
	return (index > 0 ? index - 1 : count - 1);
};

/**
* Function: Polygon.GetNormal
* Description: Calculates the normal vector of the polygon.
* Returns:
*	{Vector} the result
*/
JSM.Polygon.prototype.GetNormal = function ()
{
	if (this.cache.normal !== null) {
		return this.cache.normal;
	}
	var result = JSM.CalculateNormal (this.vertices);
	this.cache.normal = result;
	return result;
};

/**
* Function: Polygon.ToPolygon2D
* Description: Converts the polygon to a 2D polygon.
* Returns:
*	{Polygon2D} the result
*/
JSM.Polygon.prototype.ToPolygon2D = function ()
{
	var normal = this.GetNormal ();
	var result = new JSM.Polygon2D ();
	var i, vertex;
	for (i = 0; i < this.vertices.length; i++) {
		vertex = this.vertices[i].ToCoord2D (normal);
		result.AddVertex (vertex.x, vertex.y);
	}
	return result;
};

/**
* Function: Polygon.ToArray
* Description: Creates an array of vertices from polygon.
* Returns:
*	{Coord[*]} the result
*/
JSM.Polygon.prototype.ToArray = function ()
{
	var vertices = [];
	var i, vertex;
	for (i = 0; i < this.vertices.length; i++) {
		vertex = this.vertices[i];
		vertices.push (vertex.Clone ());
	}
	return vertices;
};

/**
* Function: Polygon.FromArray
* Description: Creates the polygon from an array of vertices.
* Parameters:
*	vertices {Coord[*]} the array of vertices
*/
JSM.Polygon.prototype.FromArray = function (vertices)
{
	this.Clear ();
	var i, vertex;
	for (i = 0; i < vertices.length; i++) {
		vertex = vertices[i];
		this.AddVertex (vertex.x, vertex.y, vertex.z);
	}
};

/**
* Function: Polygon.Clear
* Description: Makes the polygon empty.
*/
JSM.Polygon.prototype.Clear = function ()
{
	this.vertices = [];
	this.ClearCache ();
};

/**
* Function: Polygon.ClearCache
* Description: Clears stored values from the polygon.
*/
JSM.Polygon.prototype.ClearCache = function ()
{
	this.cache = {
		normal : null
	};
};

/**
* Function: Polygon.Clone
* Description: Clones the polygon.
* Returns:
*	{Polygon} a cloned instance
*/
JSM.Polygon.prototype.Clone = function ()
{
	var result = new JSM.Polygon ();
	var i, vertex;
	for (i = 0; i < this.vertices.length; i++) {
		vertex = this.vertices[i];
		result.AddVertexCoord (vertex.Clone ());
	}
	return result;
};

/**
* Class: ContourPolygon
* Description: Represents a 3D polygon with more contours.
*/
JSM.ContourPolygon = function ()
{
	this.contours = null;
	this.Clear ();
};

/**
* Function: ContourPolygon.AddVertex
* Description: Adds a vertex to the last contour of the polygon.
* Parameters:
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*	z {number} the z coordinate of the vertex
*/
JSM.ContourPolygon.prototype.AddVertex = function (x, y, z)
{
	this.lastContour.AddVertex (x, y, z);
};

/**
* Function: ContourPolygon.AddVertexCoord
* Description: Adds a vertex coordinate to the last contour of the polygon.
* Parameters:
*	coord {Coord} the coordinate
*/
JSM.ContourPolygon.prototype.AddVertexCoord = function (coord)
{
	this.lastContour.AddVertexCoord (coord);
};

/**
* Function: ContourPolygon.AddContourVertex
* Description: Adds a vertex to the given contour of the polygon.
* Parameters:
*	contourIndex {integer} the index of the contour
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*	z {number} the z coordinate of the vertex
*/
JSM.ContourPolygon.prototype.AddContourVertex = function (contourIndex, x, y, z)
{
	return this.contours[contourIndex].AddVertex (x, y, z);
};

/**
* Function: ContourPolygon.AddContourVertexCoord
* Description: Adds a vertex coordinate to the given contour of the polygon.
* Parameters:
*	contourIndex {integer} the index of the contour
*	coord {Coord} the coordinate
*/
JSM.ContourPolygon.prototype.AddContourVertexCoord = function (contourIndex, coord)
{
	return this.contours[contourIndex].AddVertexCoord (coord);
};

/**
* Function: ContourPolygon.VertexCount
* Description: Returns the vertex count of the polygon.
* Returns:
*	{integer} vertex count
*/
JSM.ContourPolygon.prototype.VertexCount = function ()
{
	var vertexCount = 0;
	var i;
	for (i = 0; i < this.contours.length; i++) {
		vertexCount += this.contours[i].VertexCount ();
	}
	return vertexCount;
};

/**
* Function: ContourPolygon.ContourVertexCount
* Description: Returns the vertex count of the given contour of the polygon.
* Parameters:
*	contourIndex {integer} the index of the contour
* Returns:
*	{integer} vertex count
*/
JSM.ContourPolygon.prototype.ContourVertexCount = function (contourIndex)
{
	return this.contours[contourIndex].VertexCount ();
};

/**
* Function: ContourPolygon.AddContour
* Description:
*	Adds a contour to the polygon. If the given contour is null,
*	an empty contour is added to the polygon.
* Parameters:
*	contour {Polygon} the new contour
*/
JSM.ContourPolygon.prototype.AddContour = function (contour)
{
	if (contour === undefined || contour === null) {
		this.lastContour = new JSM.Polygon ();
	} else {
		this.lastContour = contour;
	}
	this.contours.push (this.lastContour);
};

/**
* Function: ContourPolygon.GetLastContour
* Description: Returns the last contour of the polygon.
* Returns:
*	{Polygon} the result
*/
JSM.ContourPolygon.prototype.GetLastContour = function ()
{
	return this.lastContour;
};

/**
* Function: ContourPolygon.GetContourVertex
* Description: Returns the vertex of the given contour with the given index.
* Parameters:
*	contourIndex {integer} the index of the contour
*	vertexIndex {integer} the index of the vertex
* Returns:
*	{Coord} the vertex
*/
JSM.ContourPolygon.prototype.GetContourVertex = function (contourIndex, vertexIndex)
{
	return this.contours[contourIndex].GetVertex (vertexIndex);
};

/**
* Function: ContourPolygon.GetContour
* Description: Returns the contour with the given index.
* Parameters:
*	contourIndex {integer} the index of the contour
* Returns:
*	{Polygon} the contour
*/
JSM.ContourPolygon.prototype.GetContour = function (contourIndex)
{
	return this.contours[contourIndex];
};

/**
* Function: ContourPolygon.ContourCount
* Description: Returns the contour count of the polygon.
* Returns:
*	{integer} contour count
*/
JSM.ContourPolygon.prototype.ContourCount = function ()
{
	return this.contours.length;
};

/**
* Function: ContourPolygon.ToContourPolygon2D
* Description: Converts the polygon to a 2D polygon.
* Returns:
*	{ContourPolygon2D} the result
*/
JSM.ContourPolygon.prototype.ToContourPolygon2D = function ()
{
	var normal = this.contours[0].GetNormal ();
	var result = new JSM.ContourPolygon2D ();
	var i, j, contour, vertex;
	for (i = 0; i < this.contours.length; i++) {
		result.AddContour ();
		contour = this.contours[i];
		for (j = 0; j < contour.VertexCount (); j++) {
			vertex = contour.GetVertex (j);
			result.AddVertexCoord (vertex.ToCoord2D (normal));
		}
	}
	return result;
};

/**
* Function: ContourPolygon.ToArray
* Description:
*	Creates an array of vertices from polygon. The result contains
*	null values between contours.
* Returns:
*	{Coord[*]} the result
*/
JSM.ContourPolygon.prototype.ToArray = function ()
{
	var vertices = [];
	var i, j, contour, vertex;
	for (i = 0; i < this.contours.length; i++) {
		contour = this.contours[i];
		for (j = 0; j < contour.VertexCount (); j++) {
			vertex = contour.GetVertex (j);
			vertices.push (vertex.Clone ());
		}
		if (i < this.contours.length - 1) {
			vertices.push (null);
		}
	}
	return vertices;
};

/**
* Function: ContourPolygon.FromArray
* Description:
*	Creates the polygon from an array of vertices. The input should contain
*	null values between contours.
* Parameters:
*	vertices {Coord[*]} the array of vertices
*/
JSM.ContourPolygon.prototype.FromArray = function (vertices)
{
	this.Clear ();
	this.AddContour ();
	var i, vertex;
	for (i = 0; i < vertices.length; i++) {
		vertex = vertices[i];
		if (vertex === null) {
			this.AddContour ();
		} else {
			this.AddVertex (vertex.x, vertex.y, vertex.z);
		}
	}
};

/**
* Function: ContourPolygon.Clear
* Description: Makes the polygon empty.
*/
JSM.ContourPolygon.prototype.Clear = function ()
{
	this.contours = [];
	this.lastContour = null;
};

/**
* Function: ContourPolygon.Clone
* Description: Clones the polygon.
* Returns:
*	{ContourPolygon} a cloned instance
*/
JSM.ContourPolygon.prototype.Clone = function ()
{
	var result = new JSM.ContourPolygon ();
	var i, contour;
	for (i = 0; i < this.contours.length; i++) {
		contour = this.contours[i];
		result.AddContour (contour.Clone ());
	}
	return result;

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
	var normal = polygon.GetNormal ();

	var prev, curr, next;
	var prevVertex, currVertex, nextVertex;
	var prevDir, nextDir;
	var distance, offsetedCoord;
	
	var result = new JSM.Polygon ();
	
	var i, angle;
	for (i = 0; i < count; i++) {
		prev = polygon.GetPrevVertex (i);
		curr = i;
		next = polygon.GetNextVertex (i);
		
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
	function AddCutVerticesToPolygon (polygon, plane, cutPolygon, cutVertexTypes)
	{
		function AddVertex (polygon, index, cutPolygon, originalTypes, cutVertexTypes)
		{
			function IsIntersectionVertex (cutVertexTypes, originalType)
			{
				if (cutVertexTypes.length === 0) {
					return false;
				}
				var prevType = cutVertexTypes[cutVertexTypes.length - 1];
				return prevType !== 0 && originalType !== 0 && prevType != originalType;
			}
			
			function AddIntersectionVertex (polygon, cutPolygon, cutVertexTypes, currIndex)
			{
				var prevIndex = polygon.GetPrevVertex (currIndex);
				var prevVertex = polygon.GetVertex (prevIndex);
				var currVertex = polygon.GetVertex (currIndex);
				var line = new JSM.Line (currVertex, JSM.CoordSub (currVertex, prevVertex));
				var intersection = new JSM.Coord (0.0, 0.0, 0.0);
				var linePlanePosition = plane.LinePosition (line, intersection);
				if (linePlanePosition == JSM.LinePlanePosition.LineIntersectsPlane) {
					cutPolygon.AddVertex (intersection.x, intersection.y, intersection.z);
					cutVertexTypes.push (0);
				}
			}
			
			function AddOriginalVertex (polygon, cutPolygon, cutVertexTypes, currIndex, originalType)
			{
				var currVertex = polygon.GetVertex (currIndex);
				cutPolygon.AddVertex (currVertex.x, currVertex.y, currVertex.z);
				cutVertexTypes.push (originalType);
			}
		
			var lastVertex = (index === polygon.VertexCount ());
			var currIndex = index;
			if (lastVertex) {
				currIndex = 0;
			}
			var originalType = originalTypes[currIndex];
			if (IsIntersectionVertex (cutVertexTypes, originalType)) {
				AddIntersectionVertex (polygon, cutPolygon, cutVertexTypes, currIndex);
			}
			if (!lastVertex) {
				AddOriginalVertex (polygon, cutPolygon, cutVertexTypes, currIndex, originalType);
			}

			return originalType;
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
				AddVertex (polygon, i, cutPolygon, originalTypes, cutVertexTypes);
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

	function AddCuttedPolygons (cutPolygon, cutVertexTypes, frontPolygons, backPolygons)
	{
		function GetEntryVertices (cutVertexTypes)
		{
			function FindPrevSide (index, cutVertexTypes)
			{
				var currIndex = index;
				while (cutVertexTypes[currIndex] === 0) {
					currIndex = (currIndex > 0 ? currIndex - 1 : cutVertexTypes.length - 1);
				}
				return cutVertexTypes[currIndex];
			}

			var entryVertices = [];
			var i, currSide, prevIndex, nextIndex, prevSide, nextSide;
			for (i = 0; i < cutVertexTypes.length; i++) {
				currSide = cutVertexTypes[i];
				if (currSide === 0) {
					prevIndex = (i > 0 ? i - 1 : cutVertexTypes.length - 1);
					nextIndex = (i < cutVertexTypes.length - 1 ? i + 1 : 0);
					prevSide = cutVertexTypes[prevIndex];
					nextSide = cutVertexTypes[nextIndex];
					if (nextSide !== 0 && prevSide === 0) {
						prevSide = FindPrevSide (prevIndex, cutVertexTypes);
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
			
		function GetOneSideCuttedPolygons (cutPolygon, entryVertices, cutVertexTypes, frontPolygons, backPolygons, reversed)
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
					polygonSide = cutVertexTypes[currVertexIndex];
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

		var entryVertices = GetEntryVertices (cutVertexTypes);
		if (entryVertices.length === 0 || entryVertices.length % 2 !== 0) {
			return;
		}

		SortEntryVertices (cutPolygon, entryVertices);
		GetOneSideCuttedPolygons (cutPolygon, entryVertices, cutVertexTypes, frontPolygons, backPolygons, false);
		GetOneSideCuttedPolygons (cutPolygon, entryVertices, cutVertexTypes, frontPolygons, backPolygons, true);
	}

	var cutPolygon = new JSM.Polygon ();

	var cutVertexTypes = [];
	var foundSide = AddCutVerticesToPolygon (polygon, plane, cutPolygon, cutVertexTypes);
	if (cutPolygon.VertexCount () === 0 && cutVertexTypes.length === 0) {
		AddSimplePolygon (polygon, foundSide, frontPolygons, backPolygons, planePolygons);
	} else {
		AddCuttedPolygons (cutPolygon, cutVertexTypes, frontPolygons, backPolygons);
	}

	if (frontPolygons.length + backPolygons.length + planePolygons.length === 0) {
		return false;
	}
	return true;
};
