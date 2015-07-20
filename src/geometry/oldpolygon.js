/**
* Class: OldContourPolygon2D
* Description: Represents a 2D polygon with more contours.
*/
JSM.OldContourPolygon2D = function ()
{
	this.polygons = [];
};

/**
* Function: OldContourPolygon2D.AddVertex
* Description: Adds a vertex to a contour of the polygon.
* Parameters:
*	contour {integer} the index of the contour
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*/
JSM.OldContourPolygon2D.prototype.AddVertex = function (contour, x, y)
{
	if (this.polygons[contour] === undefined) {
		this.polygons[contour] = new JSM.Polygon2D ();
	}
	this.polygons[contour].AddVertex (x, y);
};

/**
* Function: OldContourPolygon2D.VertexCount
* Description: Returns the vertex count of a contour of the polygon.
* Parameters:
*	contour {integer} the index of the contour
* Returns:
*	{integer} vertex count
*/
JSM.OldContourPolygon2D.prototype.VertexCount = function (contour)
{
	if (this.polygons[contour] === undefined) {
		return 0;
	}
	return this.polygons[contour].VertexCount ();
};

/**
* Function: OldContourPolygon2D.GetVertex
* Description: Returns the vertex of a contour with the given index.
* Parameters:
*	contour {integer} the index of the contour
*	index {integer} the index of the vertex
* Returns:
*	{Coord2D} the vertex
*/
JSM.OldContourPolygon2D.prototype.GetVertex = function (contour, index)
{
	return this.polygons[contour].GetVertex (index);
};

/**
* Function: OldContourPolygon2D.SetVertex
* Description: Modifies the coordinates of an existing vertex of a contour.
* Parameters:
*	contour {integer} the index of the contour
*	index {integer} the index of the vertex
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*/
JSM.OldContourPolygon2D.prototype.SetVertex = function (contour, index, x, y)
{
	this.polygons[contour].SetVertex (index, x, y);
};

/**
* Function: OldContourPolygon2D.AddContour
* Description: Adds new contour to the polygon.
*/
JSM.OldContourPolygon2D.prototype.AddContour = function ()
{
	this.polygons.push (new JSM.Polygon2D ());
};

/**
* Function: OldContourPolygon2D.ContourCount
* Description: Returns the contour count of the polygon.
* Returns:
*	{integer} contour count
*/
JSM.OldContourPolygon2D.prototype.ContourCount = function ()
{
	return this.polygons.length;
};

/**
* Function: OldContourPolygon2D.GetContour
* Description: Returns the contour with the given index.
* Parameters:
*	contour {integer} the index of the contour
* Returns:
*	{Polygon2D} the contour
*/
JSM.OldContourPolygon2D.prototype.GetContour = function (contour)
{
	return this.polygons[contour];
};

/**
* Function: OldContourPolygon2D.Clear
* Description: Makes the polygon empty.
*/
JSM.OldContourPolygon2D.prototype.Clear = function ()
{
	this.polygons = [];
};

/**
* Function: OldContourPolygon2D.Clone
* Description: Clones the polygon.
* Returns:
*	{OldContourPolygon2D} a cloned instance
*/
JSM.OldContourPolygon2D.prototype.Clone = function ()
{
	var result = new JSM.OldContourPolygon2D ();
	var i;
	for (i = 0; i < this.polygons.length; i++) {
		result.polygons.push (this.polygons[i].Clone ());
	}
	return result;
};
