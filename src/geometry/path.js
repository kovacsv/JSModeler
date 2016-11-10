/**
* Class: Path2D
* Description: Helper class for building polygons
* Parameters:
*	settings {object} path settings
*/
JSM.Path2D = function (settings)
{
	this.settings = {
		segmentation : 10,
		offset : new JSM.Vector2D (0.0, 0.0),
		scale : new JSM.Coord2D (1.0, 1.0)
	};
	JSM.CopyObjectProperties (settings, this.settings, true);
	
	this.position = new JSM.Coord2D (0.0, 0.0);
	this.positionAdded = false;
	this.polygons = [];
	this.currentPolygon = null;
};

/**
* Function: Path2D.MoveTo
* Description: Moves the current position to the given position.
* Parameters:
*	x {number} new x position
*	y {number} new y position
*/
JSM.Path2D.prototype.MoveTo = function (x, y)
{
	this.Close ();
	this.position.Set (x, y);
	this.positionAdded = false;
};

/**
* Function: Path2D.LineTo
* Description: Draws a line from current position to the given position.
* Parameters:
*	x {number} line end x position
*	y {number} line end y position
*/
JSM.Path2D.prototype.LineTo = function (x, y)
{
	if (!this.positionAdded) {
		this.AddPolygonPoint (this.position.x, this.position.y);
	}
	this.AddPolygonPoint (x, y);
};

/**
* Function: Path2D.CubicBezierTo
* Description: Draws a cubic bezier curve from the current position to the given position.
* Parameters:
*	x {number} curve end x position
*	y {number} curve end y position
*	cp1x {number} first control point x position
*	cp1y {number} first control point y position
*	cp2x {number} second control point x position
*	cp2y {number} second control point y position
*/
JSM.Path2D.prototype.CubicBezierTo = function (x, y, cp1x, cp1y, cp2x, cp2y)
{
	var bezierPoints = JSM.GenerateCubicBezierCurve (
		new JSM.Coord2D (this.position.x, this.position.y),
		new JSM.Coord2D (cp1x, cp1y),
		new JSM.Coord2D (cp2x, cp2y),
		new JSM.Coord2D (x, y),
		this.settings.segmentation
	);
	var i;
	for (i = 1; i < bezierPoints.length; i++) {
		this.LineTo (bezierPoints[i].x, bezierPoints[i].y);
	}
};

/**
* Function: Path2D.Close
* Description: Closes the current polygon.
*/
JSM.Path2D.prototype.Close = function ()
{
	function CheckAndCorrectPolygon (polygon)
	{
		if (polygon.VertexCount () === 0) {
			return false;
		}
		if (polygon.GetVertex (0).IsEqual (polygon.GetVertex (polygon.VertexCount () - 1))) {
			polygon.RemoveVertex (polygon.VertexCount () - 1);
		}
		if (polygon.VertexCount () < 3) {
			return false;
		}
		return true;
	}
	
	function FindBasePolygon (polygons, polygon)
	{
		function IsBasePolygon (basePolygon, polygon)
		{
			baseOrientation = baseContour.GetOrientation ();
			polygonOrientation = polygon.GetOrientation ();
			if (baseOrientation !== polygonOrientation) {
				var firstVertex = polygon.GetVertex (0);
				var firstVertexPosition = baseContour.CoordPosition (firstVertex);
				if (firstVertexPosition == JSM.CoordPolygonPosition2D.Inside) {
					return true;
				}
			}
			return false;
		}
		
		var i, baseContour, baseOrientation, polygonOrientation;
		for (i = polygons.length - 1; i >= 0; i--) {
			baseContour = polygons[i].GetContour (0);
			if (IsBasePolygon (baseContour, polygon)) {
				return polygons[i];
			}
		}
		return null;
	}

	if (this.currentPolygon !== null) {
		if (CheckAndCorrectPolygon (this.currentPolygon)) {
			var basePolygon = FindBasePolygon (this.polygons, this.currentPolygon);
			if (basePolygon === null) {
				var contourPolygon = new JSM.ContourPolygon2D ();
				contourPolygon.AddContour (this.currentPolygon);
				this.polygons.push (contourPolygon);
			} else {
				basePolygon.AddContour (this.currentPolygon);
			}
		}
		this.currentPolygon = null;
	}
};			

/**
* Function: Path2D.PolygonCount
* Description: Returns the polygon count of the path.
* Returns:
*	{integer} the result
*/
JSM.Path2D.prototype.PolygonCount = function ()
{
	return this.polygons.length;
};

/**
* Function: Path2D.GetPolygon
* Description: Returns the polygons from the path at the given index.
* Parameters:
*	index {integer} the polygon index
* Returns:
*	{ContourPolygon2D} the result
*/
JSM.Path2D.prototype.GetPolygon = function (index)
{
	return this.polygons[index];
};

/**
* Function: Path2D.GetPolygons
* Description: Returns the polygons from the path.
* Returns:
*	{ContourPolygon2D[*]} the result
*/
JSM.Path2D.prototype.GetPolygons = function ()
{
	return this.polygons;
};

/**
* Function: Path2D.GetCurrentPolygon
* Description: Returns the current polygon.
* Returns:
*	{Polygon2D} the result
*/
JSM.Path2D.prototype.GetCurrentPolygon = function ()
{
	if (this.currentPolygon === null) {
		this.currentPolygon = new JSM.Polygon2D ();
	}
	return this.currentPolygon;
};		

/**
* Function: Path2D.AddPolygonPoint
* Description: Adds a point to the current polygon.
* Parameters:
*	x {number} the x position of the point
*	y {number} the y position of the point
*/
JSM.Path2D.prototype.AddPolygonPoint = function (x, y)
{
	var polygon = this.GetCurrentPolygon ();
	var polygonX = this.settings.offset.x + x * this.settings.scale.x;
	var polygonY = this.settings.offset.y + y * this.settings.scale.y;
	polygon.AddVertex (polygonX, polygonY);
	this.position.Set (x, y);
	this.positionAdded = true;
};
