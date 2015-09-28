/**
* Enum: CoordLinePosition2D
* Description: Position of a coordinate and a line.
* Values:
*	{CoordOnLine} coordinate lies on the line
*	{CoordAtLineLeft} coordinate lies on the left side of the line
*	{CoordAtLineRight} coordinate lies on the left side right the line
*/
JSM.CoordLinePosition2D = {
	CoordOnLine : 0,
	CoordAtLineLeft : 1,
	CoordAtLineRight : 2
};

/**
* Enum: CoordLinePosition
* Description: Position of a coordinate and a line.
* Values:
*	{CoordOnLine} coordinate lies on the line
*	{CoordOutsideOfLine} coordinate lies outside of the line
*/
JSM.CoordLinePosition = {
	CoordOnLine : 0,
	CoordOutsideOfLine : 1
};

/**
* Enum: LineLinePosition
* Description: Position of two lines.
* Values:
*	{LinesDontIntersect} lines do not intersect
*	{LinesIntersectsCoincident} lines intersect coincident
*	{LinesIntersectsOnePoint} lines intersect one point
*/
JSM.LineLinePosition = {
	LinesDontIntersect : 0,
	LinesIntersectsOnePoint : 1,
	LinesIntersectsCoincident : 2
};

/**
* Class: Line2D
* Description: Represents a 2D infinite line.
* Parameters:
*	start {Coord2D} the start point of the line
*	direction {Vector2D} the direction of the line
*/
JSM.Line2D = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line2D.Set
* Description: Sets the line.
* Parameters:
*	start {Coord2D} the start point of the line
*	direction {Vector2D} the direction of the line
*/
JSM.Line2D.prototype.Set = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line2D.CoordPosition
* Description: Calculates the position of the line and the given coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	{CoordLinePosition2D} the result
*/
JSM.Line2D.prototype.CoordPosition = function (coord)
{
	var x = coord.x;
	var y = coord.y;
	var a = this.start;
	var b = this.direction;

	var position = b.x * (y - a.y) - b.y * (x - a.x);
	if (JSM.IsPositive (position)) {
		return JSM.CoordLinePosition2D.CoordAtLineLeft;
	} else if (JSM.IsNegative (position)) {
		return JSM.CoordLinePosition2D.CoordAtLineRight;
	}

	return JSM.CoordLinePosition2D.CoordOnLine;
};

/**
* Function: Line2D.Clone
* Description: Clones the line.
* Returns:
*	{Line2D} a cloned instance
*/
JSM.Line2D.prototype.Clone = function ()
{
	return new JSM.Line2D (this.start.Clone (), this.direction.Clone ());
};

/**
* Class: Line
* Description: Represents a 3D infinite line.
* Parameters:
*	start {Coord} the start point of the line
*	direction {Vector} the direction of the line
*/
JSM.Line = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line.Set
* Description: Sets the line.
* Parameters:
*	start {Coord} the start point of the line
*	direction {Vector} the direction of the line
*/
JSM.Line.prototype.Set = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line.CoordPosition
* Description: Calculates the position of the line and the given coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	projected {Coord} (out) the projected coordinate
* Returns:
*	{CoordLinePosition} the result
*/
JSM.Line.prototype.CoordPosition = function (coord, projected)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = this.start;
	var b = this.direction;

	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = a.x + b.x;
	var y2 = a.y + b.y;
	var z2 = a.z + b.z;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
	if (JSM.IsZero (denom)) {
		if (projected !== undefined) {
			projected.Set (a.x, a.y, a.z);
		}

		if (a.IsEqual (coord)) {
			return JSM.CoordLinePosition.CoordOnLine;
		}

		return JSM.CoordLinePosition.CoordOutsideOfLine;
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
	var bu = b.Clone ().MultiplyScalar (u);
	var c = JSM.CoordAdd (a, bu);
	if (projected !== undefined) {
		projected.Set (c.x, c.y, c.z);
	}

	var distance = coord.DistanceTo (c);
	if (JSM.IsZero (distance)) {
		return JSM.CoordLinePosition.CoordOnLine;
	}

	return JSM.CoordLinePosition.CoordOutsideOfLine;
};

/**
* Function: Line.ProjectCoord
* Description: Calculates the projected coordinate of the given coordinate.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{Coord} the result
*/
JSM.Line.prototype.ProjectCoord = function (coord)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = this.start;
	var b = this.direction;

	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = a.x + b.x;
	var y2 = a.y + b.y;
	var z2 = a.z + b.z;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
	if (JSM.IsZero (denom)) {
		return a.Clone ();
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
	var bu = b.Clone ().MultiplyScalar (u);
	return JSM.CoordAdd (a, bu);
};

/**
* Function: Line.ClosestPoint
* Description: Calculates the closest points between the line and a given line.
* Parameters:
*	line {Line} the line
*	thisClosestPoint {Coord} (out) the closest point on the current line
*	lineClosestPoint {Coord} (out) the closest point on the given line
* Returns:
*	{boolean} success
*/
JSM.Line.prototype.ClosestPoint = function (line, thisClosestPoint, lineClosestPoint)
{
	function Dmnop (v, m, n, o, p)
	{
		var result = (v[m].x - v[n].x) * (v[o].x - v[p].x) + (v[m].y - v[n].y) * (v[o].y - v[p].y) + (v[m].z - v[n].z) * (v[o].z - v[p].z);
		return result;
	}

	var aDir = this.direction.Clone ().Normalize ();
	var aStart = this.start;
	var aEnd = JSM.CoordAdd (aStart, aDir);

	var bDir = line.direction.Clone ().Normalize ();
	var bStart = line.start;
	var bEnd = JSM.CoordAdd (bStart, bDir);
	
	var v = [aStart, aEnd, bStart, bEnd];
	var d1010 = Dmnop (v, 1, 0, 1, 0);
	var d0210 = Dmnop (v, 0, 2, 1, 0);
	var d0232 = Dmnop (v, 0, 2, 3, 2);
	var d3210 = Dmnop (v, 3, 2, 1, 0);
	var d3232 = Dmnop (v, 3, 2, 3, 2);
	var denom = (d1010 * d3232 - d3210 * d3210);
	if (JSM.IsEqual (denom, 0.0)) {
		return false;
	}
	
	var nom = (d0232 * d3210 - d0210 * d3232);
	var mua = nom / denom;
	var mub = (d0232 + mua * d3210) / d3232;

	if (thisClosestPoint !== undefined) {
		aDir.MultiplyScalar (mua);
		var aClosest = JSM.CoordAdd (aStart, aDir);
		thisClosestPoint.Set (aClosest.x, aClosest.y, aClosest.z);
	}
	
	if (lineClosestPoint !== undefined) {
		bDir.MultiplyScalar (mub);
		var bClosest = JSM.CoordAdd (bStart, bDir);
		lineClosestPoint.Set (bClosest.x, bClosest.y, bClosest.z);
	}
	
	return true;
};

/**
* Function: Line.LinePosition
* Description: Calculates the position of the line and the given line.
* Parameters:
*	line {Line} the line
*	intersection {Coord} (out) the intersection point if it exists
* Returns:
*	{LineLinePosition} the result
*/
JSM.Line.prototype.LinePosition = function (line, intersection)
{
	var thisClosestPoint = new JSM.Coord (0.0, 0.0, 0.0);
	var lineClosestPoint = new JSM.Coord (0.0, 0.0, 0.0);
	if (!this.ClosestPoint (line, thisClosestPoint, lineClosestPoint)) {
		return JSM.LineLinePosition.LinesIntersectsCoincident;
	}
	
	if (thisClosestPoint.IsEqual (lineClosestPoint)) {
		if (intersection !== undefined) {
			intersection.Set (thisClosestPoint.x, thisClosestPoint.y, thisClosestPoint.z);
		}
		return JSM.LineLinePosition.LinesIntersectsOnePoint;
	}
	
	return JSM.LineLinePosition.LinesDontIntersect;
};

/**
* Function: Line.Clone
* Description: Clones the line.
* Returns:
*	{Line} a cloned instance
*/
JSM.Line.prototype.Clone = function ()
{
	return new JSM.Line (this.start.Clone (), this.direction.Clone ());
};
