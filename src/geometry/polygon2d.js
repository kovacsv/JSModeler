JSM.Complexity = {
	Invalid : 0,
	Convex : 1,
	Concave : 2,
	Complex : 3
};

JSM.CoordPolygonPosition = {
	OnVertex : 0,
	OnEdge : 1,
	Inside : 2,
	Outside : 3
};

JSM.SectorPolygonPosition = {
	IntersectionOnePoint : 0,
	IntersectionCoincident : 1,
	IntersectionOnVertex : 2,
	NoIntersection : 3
};

JSM.Polygon2D = function ()
{
	this.vertices = null;
	this.cache = null;
	this.Clear ();
};

JSM.Polygon2D.prototype.AddVertex = function (x, y)
{
	this.AddVertexCoord (new JSM.Coord2D (x, y));
};

JSM.Polygon2D.prototype.AddVertexCoord = function (coord)
{
	this.vertices.push (coord);
	this.ClearCache ();
};

JSM.Polygon2D.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

JSM.Polygon2D.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

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

JSM.Polygon2D.prototype.GetNextVertex = function (index)
{
	var count = this.vertices.length;
	return (index < count - 1 ? index + 1 : 0);
};

JSM.Polygon2D.prototype.GetPrevVertex = function (index)
{
	var count = this.vertices.length;
	return (index > 0 ? index - 1 : count - 1);
};

JSM.Polygon2D.prototype.ShiftVertices = function (count)
{
	JSM.ShiftArray (this.vertices, count);
	this.ClearCache ();
};

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

JSM.Polygon2D.prototype.GetArea = function ()
{
	var signedArea = this.GetSignedArea ();
	return Math.abs (signedArea);
};

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

JSM.Polygon2D.prototype.IsConvexVertex = function (index)
{
	var orientation = this.GetOrientation ();
	var vertexOrientation = this.GetVertexOrientation (index);
	if (vertexOrientation == JSM.Orientation.Invalid) {
		return false;
	}
	return vertexOrientation == orientation;
};

JSM.Polygon2D.prototype.IsConcaveVertex = function (index)
{
	var orientation = this.GetOrientation ();
	var vertexOrientation = this.GetVertexOrientation (index);
	if (vertexOrientation == JSM.Orientation.Invalid) {
		return false;
	}
	return vertexOrientation != orientation;
};

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
			return JSM.CoordPolygonPosition.OnEdge;
		} else if (position == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
			return JSM.CoordPolygonPosition.OnVertex;
		}
		intersections += IntersectionCount (coord, edgeFrom, edgeTo);
	}
	
	if (intersections % 2 !== 0) {
		return JSM.CoordPolygonPosition.Inside;
	}
	return JSM.CoordPolygonPosition.Outside;
};

JSM.Polygon2D.prototype.SectorPosition = function (sector, begIndex, endIndex)
{
	var result = JSM.SectorPolygonPosition.NoIntersection;
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
			return JSM.SectorPolygonPosition.IntersectionOnePoint;
		} else if (position == JSM.SectorSectorPosition2D.SectorsIntersectCoincident) {
			return JSM.SectorPolygonPosition.IntersectionCoincident;
		} else if (position == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint) {
			result = JSM.SectorPolygonPosition.IntersectionOnVertex;
		}
	}
	
	return result;
};

JSM.Polygon2D.prototype.IsDiagonal = function (from, to)
{
	function DiagonalIntersectsAnyEdges (polygon, from, to)
	{
		var fromVertex = polygon.GetVertex (from);
		var toVertex = polygon.GetVertex (to);
		var sector = new JSM.Sector2D (fromVertex, toVertex);
		var position = polygon.SectorPosition (sector, from, to);
		if (position != JSM.SectorPolygonPosition.NoIntersection) {
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
		return position == JSM.CoordPolygonPosition.Inside;
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

JSM.Polygon2D.prototype.FromArray = function (vertices)
{
	this.Clear ();
	var i, vertex;
	for (i = 0; i < vertices.length; i++) {
		vertex = vertices[i];
		this.AddVertex (vertex.x, vertex.y);
	}
};

JSM.Polygon2D.prototype.Clear = function ()
{
	this.vertices = [];
	this.ClearCache ();
};

JSM.Polygon2D.prototype.Clone = function ()
{
	var result = new JSM.Polygon2D ();
	var i, vertex;
	for (i = 0; i < this.vertices.length; i++) {
		vertex = this.vertices[i];
		result.AddVertex (vertex.x, vertex.y);
	}
	return result;
};

JSM.Polygon2D.prototype.ClearCache = function ()
{
	this.cache = {
		signedArea : null,
		orientation : null,
		vertexOrientations : {},
		complexity : null
	};
};

JSM.ContourPolygon2D = function ()
{
	this.contours = null;
	this.Clear ();
};

JSM.ContourPolygon2D.prototype.AddVertex = function (x, y)
{
	this.lastContour.AddVertex (x, y);
};

JSM.ContourPolygon2D.prototype.AddVertexCoord = function (coord)
{
	this.lastContour.AddVertexCoord (coord);
};

JSM.ContourPolygon2D.prototype.GetVertex = function (index)
{
	var contourIndex = 0;
	var currentIndex = 0;
	while (index >= currentIndex + this.contours[contourIndex].VertexCount ()) {
		currentIndex += this.contours[contourIndex].VertexCount ();
		contourIndex += 1;
	}
	var vertexIndex = index - currentIndex;
	return this.GetContourVertex (contourIndex, vertexIndex);
};

JSM.ContourPolygon2D.prototype.VertexCount = function ()
{
	var vertexCount = 0;
	var i;
	for (i = 0; i < this.contours.length; i++) {
		vertexCount += this.contours[i].VertexCount ();
	}
	return vertexCount;
};

JSM.ContourPolygon2D.prototype.AddContour = function (contour)
{
	if (contour === undefined || contour === null) {
		this.lastContour = new JSM.Polygon2D ();
	} else {
		this.lastContour = contour;
	}
	this.contours.push (this.lastContour);
};

JSM.ContourPolygon2D.prototype.GetContourVertex = function (contourIndex, vertexIndex)
{
	return this.contours[contourIndex].GetVertex (vertexIndex);
};

JSM.ContourPolygon2D.prototype.GetContour = function (index)
{
	return this.contours[index];
};

JSM.ContourPolygon2D.prototype.ContourCount = function ()
{
	return this.contours.length;
};

JSM.ContourPolygon2D.prototype.GetSignedArea = function ()
{
	var area = 0.0;
	var i;
	for (i = 0; i < this.contours.length; i++) {
		area += this.contours[i].GetSignedArea ();
	}
	return area;
};

JSM.ContourPolygon2D.prototype.GetArea = function ()
{
	var signedArea = this.GetSignedArea ();
	return Math.abs (signedArea);
};

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

JSM.ContourPolygon2D.prototype.Clear = function ()
{
	this.contours = [];
	this.lastContour = null;
};

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
