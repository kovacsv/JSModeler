/**
* Enum: Complexity
* Description: Complexity of a polygon.
* Values:
*	{Invalid} invalid polygon
*	{Convex} convex polygon
*	{Concave} concave polygon
*	{Complex} complex polygon (contains holes)
*/
JSM.Complexity = {
	Invalid : 0,
	Convex : 1,
	Concave : 2,
	Complex : 3
};

/**
* Enum: CoordPolygonPosition2D
* Description: Position of a coordinate and a polygon.
* Values:
*	{OnVertex} coordinate lies on a vertex of the polygon
*	{OnEdge} coordinate lies on an edge of the polygon
*	{Inside} coordinate lies inside the polygon
*	{Outside} coordinate lies outside of the polygon
*/
JSM.CoordPolygonPosition2D = {
	OnVertex : 0,
	OnEdge : 1,
	Inside : 2,
	Outside : 3
};

/**
* Enum: SectorPolygonPosition2D
* Description: Position of a sector and a polygon.
* Values:
*	{IntersectionOnePoint} sector intersects polygon
*	{IntersectionCoincident} sector lies on an edge of the polygon
*	{IntersectionOnVertex} sector intersects polygon on a vertex
*	{NoIntersection} sector does not intersect polygon
*/
JSM.SectorPolygonPosition2D = {
	IntersectionOnePoint : 0,
	IntersectionCoincident : 1,
	IntersectionOnVertex : 2,
	NoIntersection : 3
};

/**
* Class: Polygon2D
* Description: Represents a 2D polygon.
*/
JSM.Polygon2D = function ()
{
	this.vertices = null;
	this.cache = null;
	this.Clear ();
};

/**
* Function: Polygon2D.AddVertex
* Description: Adds a vertex to the polygon.
* Parameters:
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*/
JSM.Polygon2D.prototype.AddVertex = function (x, y)
{
	this.AddVertexCoord (new JSM.Coord2D (x, y));
};

/**
* Function: Polygon2D.AddVertexCoord
* Description: Adds a vertex coordinate to the polygon.
* Parameters:
*	coord {Coord} the coordinate
*/
JSM.Polygon2D.prototype.AddVertexCoord = function (coord)
{
	this.vertices.push (coord);
	this.ClearCache ();
};

/**
* Function: Polygon2D.GetVertex
* Description: Returns the vertex with the given index.
* Parameters:
*	index {integer} the index of the vertex
* Returns:
*	{Coord2D} the vertex
*/
JSM.Polygon2D.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

/**
* Function: Polygon2D.RemoveVertex
* Description: Removes a vertex from the polygon.
* Parameters:
*	index {integer} the index of the vertex
*/
JSM.Polygon2D.prototype.RemoveVertex = function (index)
{
	this.vertices.splice (index, 1);
};

/**
* Function: Polygon2D.VertexCount
* Description: Returns the vertex count of the polygon.
* Returns:
*	{integer} vertex count
*/
JSM.Polygon2D.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

/**
* Function: Polygon2D.EnumerateVertices
* Description:
*	Enumerates the vertices of the polygon, and calls
*	a function for each vertex.
* Parameters:
*	from {integer} the start vertex index
*	to {integer} the end vertex index
*	callback {function} the callback function
*/
JSM.Polygon2D.prototype.EnumerateVertices = function (from, to, callback)
{
	var count = this.vertices.length;
	var index = from;
	callback (index);
	while (index != to) {
		index = (index + 1) % count;
		callback (index);
	}
};

/**
* Function: Polygon2D.GetNextVertex
* Description: Returns the vertex index after the given one.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{integer} the result
*/
JSM.Polygon2D.prototype.GetNextVertex = function (index)
{
	return JSM.NextIndex (index, this.vertices.length);
};

/**
* Function: Polygon2D.GetPrevVertex
* Description: Returns the vertex index before the given one.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{integer} the result
*/
JSM.Polygon2D.prototype.GetPrevVertex = function (index)
{
	return JSM.PrevIndex (index, this.vertices.length);
};

/**
* Function: Polygon2D.ShiftVertices
* Description: Shifts polygon vertices.
* Parameters:
*	count {integer} the number of shifts
*/
JSM.Polygon2D.prototype.ShiftVertices = function (count)
{
	JSM.ShiftArray (this.vertices, count);
	this.ClearCache ();
};

/**
* Function: Polygon2D.ReverseVertices
* Description: Reverses the orientation of the vertices.
*/
JSM.Polygon2D.prototype.ReverseVertices = function ()
{
	this.vertices.reverse ();
	this.ClearCache ();
};

/**
* Function: Polygon2D.GetVertexAngle
* Description: Returns the angle of the given vertex.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{number} the result
*/
JSM.Polygon2D.prototype.GetVertexAngle = function (index)
{
	var prev = this.vertices[this.GetPrevVertex (index)];
	var curr = this.vertices[index];
	var next = this.vertices[this.GetNextVertex (index)];
	var prevDir = JSM.CoordSub2D (prev, curr);
	var nextDir = JSM.CoordSub2D (next, curr);
	return prevDir.AngleTo (nextDir);
};

/**
* Function: Polygon2D.GetSignedArea
* Description: Calculates the signed area of the polygon.
* Returns:
*	{number} the result
*/
JSM.Polygon2D.prototype.GetSignedArea = function ()
{
	if (this.cache.signedArea !== null) {
		return this.cache.signedArea;
	}
	
	var count = this.vertices.length;
	var result = 0.0;
	if (count >= 3) {
		var i, current, next;
		for (i = 0; i < count; i++) {
			current = this.vertices[i];
			next = this.vertices[(i + 1) % count];
			result += current.x * next.y - next.x * current.y;
		}
		result *= 0.5;
	}
	
	this.cache.signedArea = result;
	return result;
};

/**
* Function: Polygon2D.GetArea
* Description: Calculates the area of the polygon.
* Returns:
*	{number} the result
*/
JSM.Polygon2D.prototype.GetArea = function ()
{
	var signedArea = this.GetSignedArea ();
	return Math.abs (signedArea);
};

/**
* Function: Polygon2D.GetOrientation
* Description: Calculates the orientation of the polygon.
* Returns:
*	{Orientation} the result
*/
JSM.Polygon2D.prototype.GetOrientation = function ()
{
	if (this.cache.orientation !== null) {
		return this.cache.orientation;
	}

	var result = JSM.Orientation.Invalid;
	if (this.vertices.length >= 3) {
		var signedArea = this.GetSignedArea ();
		if (JSM.IsPositive (signedArea)) {
			result = JSM.Orientation.CounterClockwise;
		} else if (JSM.IsNegative (signedArea)) {
			result = JSM.Orientation.Clockwise;
		}
	}
	
	this.cache.orientation = result;
	return result;
};


/**
* Function: Polygon2D.GetComplexity
* Description: Calculates the complexity of the polygon.
* Returns:
*	{Complexity} the result
*/
JSM.Polygon2D.prototype.GetComplexity = function ()
{
	if (this.cache.complexity !== null) {
		return this.cache.complexity;
	}
	
	var count = this.vertices.length;
	if (count < 3) {
		return JSM.Complexity.Invalid;
	}
	
	var result = JSM.Complexity.Invalid;
	var polygonOrientain = this.GetOrientation ();
	if (polygonOrientain != JSM.Orientation.Invalid) {
		result = JSM.Complexity.Convex;
		var i;
		for (i = 0; i < count; i++) {
			if (this.IsConcaveVertex (i)) {
				result = JSM.Complexity.Concave;
				break;
			}
		}
	}
	
	this.cache.complexity = result;
	return result;
};

/**
* Function: Polygon2D.GetVertexOrientation
* Description: Calculates the orientation of the given vertex of the polygon.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{Orientation} the result
*/
JSM.Polygon2D.prototype.GetVertexOrientation = function (index)
{
	if (this.cache.vertexOrientations[index] !== undefined) {
		return this.cache.vertexOrientations[index];
	}

	var prev = this.vertices[this.GetPrevVertex (index)];
	var curr = this.vertices[index];
	var next = this.vertices[this.GetNextVertex (index)];
	
	var result = JSM.CoordOrientation2D (prev, curr, next);
	this.cache.vertexOrientations[index] = result;
	return result;
};

/**
* Function: Polygon2D.IsConvexVertex
* Description: Returns if the given vertex is convex.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{boolean} the result
*/
JSM.Polygon2D.prototype.IsConvexVertex = function (index)
{
	var orientation = this.GetOrientation ();
	var vertexOrientation = this.GetVertexOrientation (index);
	if (vertexOrientation == JSM.Orientation.Invalid) {
		return false;
	}
	return vertexOrientation == orientation;
};

/**
* Function: Polygon2D.IsConcaveVertex
* Description: Returns if the given vertex is concave.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{boolean} the result
*/
JSM.Polygon2D.prototype.IsConcaveVertex = function (index)
{
	var orientation = this.GetOrientation ();
	var vertexOrientation = this.GetVertexOrientation (index);
	if (vertexOrientation == JSM.Orientation.Invalid) {
		return false;
	}
	return vertexOrientation != orientation;
};

/**
* Function: Polygon2D.CoordPosition
* Description: Calculates the position of a coordinate and the polygon.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	{CoordPolygonPosition2D} the result
*/
JSM.Polygon2D.prototype.CoordPosition = function (coord)
{
	function IntersectionCount (coord, beg, end)
	{
		function GetIntersection (coord, beg, end)
		{
			var result = new JSM.Coord2D (beg.x, coord.y);
			if (!JSM.IsEqual (beg.y, coord.y)) {
				var yMoveRatio = Math.abs ((beg.y - coord.y) / (end.y - beg.y));
				result.x = beg.x + (end.x - beg.x) * yMoveRatio;
			}
			return result;
		}

		var begYDist = beg.y - coord.y;
		var endYDist = end.y - coord.y;
		
		var begBelow = JSM.IsNegative (begYDist);
		var begAbove = JSM.IsPositive (begYDist);
		var endBelow = JSM.IsNegative (endYDist);
		var endAbove = JSM.IsPositive (endYDist);
		if ((begBelow && endBelow) || (begAbove && endAbove)) {
			return 0;
		}

		var begOnLine = !begBelow && !begAbove;
		var endOnLine = !endBelow && !endAbove;
		if (begOnLine && endOnLine) {
			return 0;
		}

		var intersection = GetIntersection (coord, beg, end);
		if (JSM.IsLower (intersection.x, coord.x)) {
			return 0;
		} else if (JSM.IsGreater (intersection.x, coord.x)) {
			if (begOnLine || endOnLine) {
				var upwardEdge = JSM.IsGreater (end.y, beg.y);
				if (begOnLine && upwardEdge || endOnLine && !upwardEdge) {
					return 1;
				}
				return 0;
			}
			return 1;
		}
		return 1;
	}
	
	var vertexCount = this.vertices.length;
	var intersections = 0;
	var i, edgeFrom, edgeTo, sector, position;
	for (i = 0; i < vertexCount; i++) {
		edgeFrom = this.vertices[i];
		edgeTo = this.vertices[(i + 1) % vertexCount];
		sector = new JSM.Sector2D (edgeFrom, edgeTo);
		position = sector.CoordPosition (coord);
		if (position == JSM.CoordSectorPosition2D.CoordInsideOfSector) {
			return JSM.CoordPolygonPosition2D.OnEdge;
		} else if (position == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
			return JSM.CoordPolygonPosition2D.OnVertex;
		}
		intersections += IntersectionCount (coord, edgeFrom, edgeTo);
	}
	
	if (intersections % 2 !== 0) {
		return JSM.CoordPolygonPosition2D.Inside;
	}
	return JSM.CoordPolygonPosition2D.Outside;
};

/**
* Function: Polygon2D.SectorPosition
* Description:
*	Calculates the position of a sector and the polygon. The given begin and end
*	vertex indices are omitted form intersection checking.
* Parameters:
*	sector {Sector2D} the sector
*	begIndex {integer} begin vertex index
*	endIndex {integer} end vertex index
* Returns:
*	{CoordSectorPosition2D} the result
*/
JSM.Polygon2D.prototype.SectorPosition = function (sector, begIndex, endIndex)
{
	var result = JSM.SectorPolygonPosition2D.NoIntersection;
	var vertexCount = this.vertices.length;
	if (vertexCount < 3) {
		return result;
	}
	
	var i, edgeBegIndex, edgeEndIndex, edgeBeg, edgeEnd;
	var currentSector, position;
	for (i = 0; i < vertexCount; i++) {
		edgeBegIndex = i;
		edgeEndIndex = (i + 1) % vertexCount;
		edgeBeg = this.vertices[edgeBegIndex];
		edgeEnd = this.vertices[edgeEndIndex];
		if (edgeBegIndex == begIndex || edgeEndIndex == begIndex || edgeBegIndex == endIndex || edgeEndIndex == endIndex) {
			continue;
		}
		currentSector = new JSM.Sector2D (edgeBeg, edgeEnd);
		position = sector.SectorPosition (currentSector);
		if (position == JSM.SectorSectorPosition2D.SectorsIntersectOnePoint) {
			return JSM.SectorPolygonPosition2D.IntersectionOnePoint;
		} else if (position == JSM.SectorSectorPosition2D.SectorsIntersectCoincident) {
			return JSM.SectorPolygonPosition2D.IntersectionCoincident;
		} else if (position == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint) {
			result = JSM.SectorPolygonPosition2D.IntersectionOnVertex;
		}
	}
	
	return result;
};

/**
* Function: Polygon2D.IsDiagonal
* Description: Returns if the sector between two vertices is diagonal.
* Parameters:
*	from {integer} begin vertex index
*	to {integer} end vertex index
* Returns:
*	{boolean} the result
*/
JSM.Polygon2D.prototype.IsDiagonal = function (from, to)
{
	function DiagonalIntersectsAnyEdges (polygon, from, to)
	{
		var fromVertex = polygon.GetVertex (from);
		var toVertex = polygon.GetVertex (to);
		var sector = new JSM.Sector2D (fromVertex, toVertex);
		var position = polygon.SectorPosition (sector, from, to);
		if (position != JSM.SectorPolygonPosition2D.NoIntersection) {
			return true;
		}
		return false;
	}
	
	function DiagonalInsideOfPolygon (polygon, from, to)
	{
		var fromVertex = polygon.GetVertex (from);
		var toVertex = polygon.GetVertex (to);
		var midCoord = new JSM.Coord2D (
			(fromVertex.x + toVertex.x) / 2.0,
			(fromVertex.y + toVertex.y) / 2.0
		);
		var position = polygon.CoordPosition (midCoord);
		return position == JSM.CoordPolygonPosition2D.Inside;
	}
	
	if (from == to) {
		return false;
	}

	if (this.GetPrevVertex (from) == to || this.GetNextVertex (from) == to) {
		return false;
	}

	var fromVertex = this.vertices[from];
	var toVertex = this.vertices[to];
	if (fromVertex.IsEqual (toVertex)) {
		return false;
	}

	if (DiagonalIntersectsAnyEdges (this, from, to)) {
		return false;
	}
	
	if (!DiagonalInsideOfPolygon (this, from, to)) {
		return false;
	}
	
	return true;
};

/**
* Function: Polygon2D.ToArray
* Description: Creates an array of vertices from polygon.
* Returns:
*	{Coord2D[*]} the result
*/
JSM.Polygon2D.prototype.ToArray = function ()
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
* Function: Polygon2D.FromArray
* Description: Creates the polygon from an array of vertices.
* Parameters:
*	vertices {Coord2D[*]} the array of vertices
*/
JSM.Polygon2D.prototype.FromArray = function (vertices)
{
	this.Clear ();
	var i, vertex;
	for (i = 0; i < vertices.length; i++) {
		vertex = vertices[i];
		this.AddVertex (vertex.x, vertex.y);
	}
};

/**
 * Function: Polygon2D.GetBoundingBox
 * Description: Calculates the bounding box of the polygon.
 * Returns:
 *	{Box2D} the result
 */
JSM.Polygon2D.prototype.GetBoundingBox = function ()
{
	if (this.cache.boundingBox !== null) {
		return this.cache.boundingBox;
	}

	var result = new JSM.Box2D (
		new JSM.Coord2D (JSM.Inf, JSM.Inf),
		new JSM.Coord2D (-JSM.Inf, -JSM.Inf)
	);

	var i, coord;
	for (i = 0; i < this.vertices.length; i++) {
		coord = this.vertices[i];
		result.min.x = JSM.Minimum (result.min.x, coord.x);
		result.min.y = JSM.Minimum (result.min.y, coord.y);
		result.max.x = JSM.Maximum (result.max.x, coord.x);
		result.max.y = JSM.Maximum (result.max.y, coord.y);
	}

	this.cache.boundingBox = result;
	return result;
};

/**
* Function: Polygon2D.Clear
* Description: Makes the polygon empty.
*/
JSM.Polygon2D.prototype.Clear = function ()
{
	this.vertices = [];
	this.ClearCache ();
};

/**
* Function: Polygon2D.ClearCache
* Description: Clears stored values from the polygon.
*/
JSM.Polygon2D.prototype.ClearCache = function ()
{
	this.cache = {
		signedArea : null,
		orientation : null,
		vertexOrientations : {},
		complexity : null,
		boundingBox : null
	};
};

/**
* Function: Polygon2D.Clone
* Description: Clones the polygon.
* Returns:
*	{Polygon2D} a cloned instance
*/
JSM.Polygon2D.prototype.Clone = function ()
{
	var result = new JSM.Polygon2D ();
	var i, vertex;
	for (i = 0; i < this.vertices.length; i++) {
		vertex = this.vertices[i];
		result.AddVertexCoord (vertex.Clone ());
	}
	return result;
};

/**
* Class: ContourPolygon2D
* Description: Represents a 2D polygon with more contours.
*/
JSM.ContourPolygon2D = function ()
{
	this.contours = null;
	this.Clear ();
};

/**
* Function: ContourPolygon2D.AddVertex
* Description: Adds a vertex to the last contour of the polygon.
* Parameters:
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*/
JSM.ContourPolygon2D.prototype.AddVertex = function (x, y)
{
	this.lastContour.AddVertex (x, y);
};

/**
* Function: ContourPolygon2D.AddVertexCoord
* Description: Adds a vertex coordinate to the last contour of the polygon.
* Parameters:
*	coord {Coord2D} the coordinate
*/
JSM.ContourPolygon2D.prototype.AddVertexCoord = function (coord)
{
	this.lastContour.AddVertexCoord (coord);
};

/**
* Function: ContourPolygon2D.AddContourVertex
* Description: Adds a vertex to the given contour of the polygon.
* Parameters:
*	contourIndex {integer} the index of the contour
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*/
JSM.ContourPolygon2D.prototype.AddContourVertex = function (contourIndex, x, y)
{
	return this.contours[contourIndex].AddVertex (x, y);
};

/**
* Function: ContourPolygon2D.AddContourVertexCoord
* Description: Adds a vertex coordinate to the given contour of the polygon.
* Parameters:
*	contourIndex {integer} the index of the contour
*	coord {Coord2D} the coordinate
*/
JSM.ContourPolygon2D.prototype.AddContourVertexCoord = function (contourIndex, coord)
{
	return this.contours[contourIndex].AddVertexCoord (coord);
};

/**
* Function: ContourPolygon2D.VertexCount
* Description: Returns the vertex count of the polygon.
* Returns:
*	{integer} vertex count
*/
JSM.ContourPolygon2D.prototype.VertexCount = function ()
{
	var vertexCount = 0;
	var i;
	for (i = 0; i < this.contours.length; i++) {
		vertexCount += this.contours[i].VertexCount ();
	}
	return vertexCount;
};

/**
* Function: ContourPolygon2D.ReverseVertices
* Description: Reverses the orientation of the vertices.
*/
JSM.ContourPolygon2D.prototype.ReverseVertices = function ()
{
	var i;
	for (i = 0; i < this.contours.length; i++) {
		this.contours[i].ReverseVertices ();
	}
};

/**
* Function: ContourPolygon2D.ContourVertexCount
* Description: Returns the vertex count of the given contour of the polygon.
* Parameters:
*	contourIndex {integer} the index of the contour
* Returns:
*	{integer} vertex count
*/
JSM.ContourPolygon2D.prototype.ContourVertexCount = function (contourIndex)
{
	return this.contours[contourIndex].VertexCount ();
};

/**
* Function: ContourPolygon2D.AddContour
* Description:
*	Adds a contour to the polygon. If the given contour is null,
*	an empty contour is added to the polygon.
* Parameters:
*	contour {Polygon2D} the new contour
*/
JSM.ContourPolygon2D.prototype.AddContour = function (contour)
{
	if (contour === undefined || contour === null) {
		this.lastContour = new JSM.Polygon2D ();
	} else {
		this.lastContour = contour;
	}
	this.contours.push (this.lastContour);
};

/**
* Function: ContourPolygon2D.GetLastContour
* Description: Returns the last contour of the polygon.
* Returns:
*	{Polygon2D} the result
*/
JSM.ContourPolygon2D.prototype.GetLastContour = function ()
{
	return this.lastContour;
};

/**
* Function: ContourPolygon2D.GetContourVertex
* Description: Returns the vertex of the given contour with the given index.
* Parameters:
*	contourIndex {integer} the index of the contour
*	vertexIndex {integer} the index of the vertex
* Returns:
*	{Coord2D} the vertex
*/
JSM.ContourPolygon2D.prototype.GetContourVertex = function (contourIndex, vertexIndex)
{
	return this.contours[contourIndex].GetVertex (vertexIndex);
};

/**
* Function: ContourPolygon2D.GetContour
* Description: Returns the contour with the given index.
* Parameters:
*	contourIndex {integer} the index of the contour
* Returns:
*	{Polygon2D} the contour
*/
JSM.ContourPolygon2D.prototype.GetContour = function (index)
{
	return this.contours[index];
};

/**
* Function: ContourPolygon2D.ContourCount
* Description: Returns the contour count of the polygon.
* Returns:
*	{integer} contour count
*/
JSM.ContourPolygon2D.prototype.ContourCount = function ()
{
	return this.contours.length;
};

/**
* Function: ContourPolygon2D.GetSignedArea
* Description: Calculates the signed area of the polygon.
* Returns:
*	{number} the result
*/
JSM.ContourPolygon2D.prototype.GetSignedArea = function ()
{
	var area = 0.0;
	var i;
	for (i = 0; i < this.contours.length; i++) {
		area += this.contours[i].GetSignedArea ();
	}
	return area;
};

/**
* Function: ContourPolygon2D.GetArea
* Description: Calculates the area of the polygon.
* Returns:
*	{number} the result
*/
JSM.ContourPolygon2D.prototype.GetArea = function ()
{
	var signedArea = this.GetSignedArea ();
	return Math.abs (signedArea);
};

/**
* Function: ContourPolygon2D.GetOrientation
* Description: Calculates the orientation of the polygon.
* Returns:
*	{Orientation} the result
*/
JSM.ContourPolygon2D.prototype.GetOrientation = function ()
{
	if (this.lastContour === null) {
		return JSM.Orientation.Invalid;
	}
	var orientation = this.contours[0].GetOrientation ();
	if (this.contours.length == 1) {
		return orientation;
	}
	if (orientation == JSM.Orientation.Invalid) {
		return JSM.Orientation.Invalid;
	}
	var i, contourOrientation;
	for (i = 1; i < this.contours.length; i++) {
		contourOrientation = this.contours[i].GetOrientation ();
		if (contourOrientation == JSM.Orientation.Invalid) {
			return JSM.Orientation.Invalid;
		}
		if (orientation == contourOrientation) {
			return JSM.Orientation.Invalid;
		}
	}
	return orientation;
};

/**
* Function: ContourPolygon2D.GetComplexity
* Description: Calculates the complexity of the polygon.
* Returns:
*	{Complexity} the result
*/
JSM.ContourPolygon2D.prototype.GetComplexity = function ()
{
	if (this.lastContour === null) {
		return JSM.Complexity.Invalid;
	}
	if (this.contours.length == 1) {
		return this.contours[0].GetComplexity ();
	}
	var i, contourComplexity;
	for (i = 1; i < this.contours.length; i++) {
		contourComplexity = this.contours[i].GetComplexity ();
		if (contourComplexity == JSM.Complexity.Invalid) {
			return JSM.Complexity.Invalid;
		}
	}
	return JSM.Complexity.Complex;
};

/**
* Function: ContourPolygon2D.ToArray
* Description:
*	Creates an array of vertices from polygon. The result contains
*	null values between contours.
* Returns:
*	{Coord2D[*]} the result
*/
JSM.ContourPolygon2D.prototype.ToArray = function ()
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
* Function: ContourPolygon2D.FromArray
* Description:
*	Creates the polygon from an array of vertices. The input should contain
*	null values between contours.
* Parameters:
*	vertices {Coord2D[*]} the array of vertices
*/
JSM.ContourPolygon2D.prototype.FromArray = function (vertices)
{
	this.Clear ();
	this.AddContour ();
	var i, vertex;
	for (i = 0; i < vertices.length; i++) {
		vertex = vertices[i];
		if (vertex === null) {
			this.AddContour ();
		} else {
			this.AddVertex (vertex.x, vertex.y);
		}
	}
};

/**
* Function: ContourPolygon2D.Clear
* Description: Makes the polygon empty.
*/
JSM.ContourPolygon2D.prototype.Clear = function ()
{
	this.contours = [];
	this.lastContour = null;
};

/**
* Function: ContourPolygon2D.Clone
* Description: Clones the polygon.
* Returns:
*	{ContourPolygon2D} a cloned instance
*/
JSM.ContourPolygon2D.prototype.Clone = function ()
{
	var result = new JSM.ContourPolygon2D ();
	var i, contour;
	for (i = 0; i < this.contours.length; i++) {
		contour = this.contours[i];
		result.AddContour (contour.Clone ());
	}
	return result;
};
