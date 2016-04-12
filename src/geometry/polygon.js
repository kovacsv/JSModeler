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
	return JSM.NextIndex (index, this.vertices.length);
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
	return JSM.PrevIndex (index, this.vertices.length);
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
