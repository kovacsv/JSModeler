/**
* Enum: CoordPlanePosition
* Description: Position of a coordinate and a plane.
* Values:
*	{CoordOnPlane} coordinate lies on the plane
*	{CoordInFrontOfPlane} coordinate lies in front of of the plane
*	{CoordAtBackOfPlane} coordinate lies at the back of the plane
*/
JSM.CoordPlanePosition = {
	CoordOnPlane : 0,
	CoordInFrontOfPlane : 1,
	CoordAtBackOfPlane : 2
};

/**
* Enum: LinePlanePosition
* Description: Position of a line and a plane.
* Values:
*	{LineParallelToPlane} line is parallel to the plane
*	{LineIntersectsPlane} line intersects the plane
*/
JSM.LinePlanePosition = {
	LineParallelToPlane : 0,
	LineIntersectsPlane : 1
};

/**
* Class: Plane
* Description: Represents a plane.
* Parameters:
*	a {number} the a component of plane equation
*	b {number} the b component of plane equation
*	c {number} the c component of plane equation
*	d {number} the d component of plane equation
*/
JSM.Plane = function (a, b, c, d)
{
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
};

/**
* Function: Plane.Set
* Description: Sets the plane.
* Parameters:
*	a {number} the a component of plane equation
*	b {number} the b component of plane equation
*	c {number} the c component of plane equation
*	d {number} the d component of plane equation
*/
JSM.Plane.prototype.Set = function (a, b, c, d)
{
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
};

/**
* Function: Plane.GetNormal
* Description: Calculates the normal vector of the plane.
* Returns:
*	{Vector} the result
*/
JSM.Plane.prototype.GetNormal = function ()
{
	return new JSM.Vector (this.a, this.b, this.c);
};

/**
* Function: Plane.CoordSignedDistance
* Description: Calculates the signed distance of a coordinate and the plane.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{number} the result
*/
JSM.Plane.prototype.CoordSignedDistance = function (coord)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;

	var distance = (a * x + b * y + c * z + d) / Math.sqrt (a * a + b * b + c * c);
	return distance;
};

/**
* Function: Plane.CoordDistance
* Description: Calculates the distance of a coordinate and the plane.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{number} the result
*/
JSM.Plane.prototype.CoordDistance = function (coord)
{
	var signed = this.CoordSignedDistance (coord);
	return Math.abs (signed);
};

/**
* Function: Plane.ProjectCoord
* Description: Projects a coordinate to the plane.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{Coord} the projected coordinate
*/
JSM.Plane.prototype.ProjectCoord = function (coord)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;

	var distance = this.CoordDistance (coord);
	var side = a * x + b * y + c * z + d;
	if (JSM.IsGreater (side, 0.0)) {
		distance = -distance;
	}

	var normal = this.GetNormal ().Normalize ();
	var result = coord.Clone ().Offset (normal, distance);
	return result;
};


/**
* Function: Plane.CoordPosition
* Description: Calculates the position of the plane and the given coordinate.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{CoordPlanePosition} thre result
*/
JSM.Plane.prototype.CoordPosition = function (coord)
{
	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;

	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var s = a * x + b * y + c * z + d;
	if (JSM.IsPositive (s)) {
		return JSM.CoordPlanePosition.CoordInFrontOfPlane;
	} else if (JSM.IsNegative (s)) {
		return JSM.CoordPlanePosition.CoordAtBackOfPlane;
	}
	
	return JSM.CoordPlanePosition.CoordOnPlane;
};

/**
* Function: Plane.LinePosition
* Description: Calculates the position of the plane and the given line.
* Parameters:
*	line {Line} the line
*	intersection {Coord} (out) the intersection point if it exists
* Returns:
*	{CoordLinePosition} the result
*/
JSM.Plane.prototype.LinePosition = function (line, intersection)
{
	var	direction = line.direction.Clone ().Normalize ();

	var x1 = line.start.x;
	var y1 = line.start.y;
	var z1 = line.start.z;

	var x2 = line.start.x + direction.x;
	var y2 = line.start.y + direction.y;
	var z2 = line.start.z + direction.z;

	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;

	var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
	if (JSM.IsZero (denom)) {
		return JSM.LinePlanePosition.LineParallelToPlane;
	}

	var u = (a * x1 + b * y1 + c * z1 + d) / denom;
	if (intersection !== undefined) {
		direction.MultiplyScalar (u);
		var i = JSM.CoordAdd (line.start, direction);
		intersection.Set (i.x, i.y, i.z);
	}

	return JSM.LinePlanePosition.LineIntersectsPlane;
};

/**
* Function: Plane.LineIntersection
* Description:
*	Calculates the intersection point of a line and a plane.
*	The line should not be parallel to the plane.
* Parameters:
*	line {Line} the line
* Returns:
*	{Coord} the result
*/
JSM.Plane.prototype.LineIntersection = function (line)
{
	var	direction = line.direction.Clone ().Normalize ();

	var x1 = line.start.x;
	var y1 = line.start.y;
	var z1 = line.start.z;

	var x2 = line.start.x + direction.x;
	var y2 = line.start.y + direction.y;
	var z2 = line.start.z + direction.z;

	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;

	var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
	if (JSM.IsZero (denom)) {
		return null;
	}

	var u = (a * x1 + b * y1 + c * z1 + d) / denom;
	direction.MultiplyScalar (u);
	return JSM.CoordAdd (line.start, direction);
};

/**
* Function: Plane.Clone
* Description: Clones the plane.
* Returns:
*	{Plane} a cloned instance
*/
JSM.Plane.prototype.Clone = function ()
{
	return new JSM.Plane (this.a, this.b, this.c, this.d);
};

/**
* Function: GetPlaneFromCoordAndDirection
* Description: Generates a plane from a coordinate and a direction.
* Parameters:
*	coord {Coord} the coordinate
*	direction {Vector} the direction
* Returns:
*	{Plane} the result
*/
JSM.GetPlaneFromCoordAndDirection = function (coord, direction)
{
	var plane = new JSM.Plane ();
	var normal = direction.Clone ().Normalize ();
	var pa = normal.x;
	var pb = normal.y;
	var pc = normal.z;
	var pd = -(pa * coord.x + pb * coord.y + pc * coord.z);
	plane.Set (pa, pb, pc, pd);
	return plane;
};

/**
* Function: GetPlaneFromThreeCoords
* Description: Generates a plane from three coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
*	c {Coord} the third coordinate
* Returns:
*	{Plane} the result
*/
JSM.GetPlaneFromThreeCoords = function (a, b, c)
{
	var plane = new JSM.Plane ();
	var pa = (b.y - a.y) * (c.z - a.z) - (c.y - a.y) * (b.z - a.z);
	var pb = (b.z - a.z) * (c.x - a.x) - (c.z - a.z) * (b.x - a.x);
	var pc = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
	var pd = -(pa * a.x + pb * a.y + pc * a.z);
	plane.Set (pa, pb, pc, pd);
	return plane;
};

/**
* Function: CoordPlaneSignedDirectionalDistance
* Description: Calculates the signed distance of a coordinate and a plane along a direction vector.
* Parameters:
*	coord {Coord} the coordinate
*	direction {Vector} the direction
*	plane {Plane} the plane
* Returns:
*	{number} the result
*/
JSM.CoordPlaneSignedDirectionalDistance = function (coord, direction, plane)
{
	var	normal = direction.Clone ().Normalize ();

	var x1 = coord.x;
	var y1 = coord.y;
	var z1 = coord.z;

	var x2 = coord.x + normal.x;
	var y2 = coord.y + normal.y;
	var z2 = coord.z + normal.z;

	var a = plane.a;
	var b = plane.b;
	var c = plane.c;
	var d = plane.d;

	var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
	if (JSM.IsZero (denom)) {
		return 0.0;
	}

	var u = (a * x1 + b * y1 + c * z1 + d) / denom;
	normal.MultiplyScalar (u);
	var intersection = JSM.CoordAdd (coord, normal);
	var distance = coord.DistanceTo (intersection);
	var s = a * x1 + b * y1 + c * z1 + d;
	if (JSM.IsNegative (s)) {
		distance = -distance;
	}

	return distance;
};

/**
* Function: CoordPlaneDirectionalDistance
* Description: Calculates the distance of a coordinate and a plane along a direction vector.
* Parameters:
*	coord {Coord} the coordinate
*	direction {Vector} the direction
*	plane {Plane} the plane
* Returns:
*	{number} the result
*/
JSM.CoordPlaneDirectionalDistance = function (coord, direction, plane)
{
	return Math.abs (JSM.CoordPlaneSignedDirectionalDistance (coord, direction, plane));
};
