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
* Function: CoordPlanePosition
* Description: Calculates the position of a coordinate and a plane.
* Parameters:
*	coord {Coord} the coordinate
*	plane {Plane} the plane
* Returns:
*	{string} 'CoordInFrontOfPlane', 'CoordAtBackOfPlane', or 'CoordOnPlane'
*/
JSM.CoordPlanePosition = function (coord, plane)
{
	var a = plane.a;
	var b = plane.b;
	var c = plane.c;
	var d = plane.d;

	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var s = a * x + b * y + c * z + d;
	if (JSM.IsPositive (s)) {
		return 'CoordInFrontOfPlane';
	} else if (JSM.IsNegative (s)) {
		return 'CoordAtBackOfPlane';
	}
	
	return 'CoordOnPlane';
};

/**
* Function: LinePlanePosition
* Description: Calculates the position of a line and a plane.
* Parameters:
*	line {Line} the line
*	plane {Plane} the plane
*	intersection {Coord} (out) the intersection point if it exists
* Returns:
*	{string} 'LineParallelToPlane', or 'LineIntersectsPlane'
*/
JSM.LinePlanePosition = function (line, plane, intersection)
{
	var	direction = line.direction.Clone ().Normalize ();

	var x1 = line.start.x;
	var y1 = line.start.y;
	var z1 = line.start.z;

	var x2 = line.start.x + direction.x;
	var y2 = line.start.y + direction.y;
	var z2 = line.start.z + direction.z;

	var a = plane.a;
	var b = plane.b;
	var c = plane.c;
	var d = plane.d;

	var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
	if (JSM.IsZero (denom)) {
		return 'LineParallelToPlane';
	}

	var u = (a * x1 + b * y1 + c * z1 + d) / denom;
	if (intersection !== undefined) {
		direction.MultiplyScalar (u);
		var i = JSM.CoordAdd (line.start, direction);
		intersection.Set (i.x, i.y, i.z);
	}

	return 'LineIntersectsPlane';
};

/**
* Function: LinePlaneIntersection
* Description: Calculates the intersection point of a line and a plane.
* Parameters:
*	line {Line} the line
*	plane {Plane} the plane
* Returns:
*	{Coord} the result
*/
JSM.LinePlaneIntersection = function (line, plane)
{
	var	direction = line.direction.Clone ().Normalize ();

	var x1 = line.start.x;
	var y1 = line.start.y;
	var z1 = line.start.z;

	var x2 = line.start.x + direction.x;
	var y2 = line.start.y + direction.y;
	var z2 = line.start.z + direction.z;

	var a = plane.a;
	var b = plane.b;
	var c = plane.c;
	var d = plane.d;

	var result = new JSM.Coord (0.0, 0.0, 0.0);
	var denom = (a * (x1 - x2) + b * (y1 - y2) + c * (z1 - z2));
	if (JSM.IsZero (denom)) {
		return result;
	}

	var u = (a * x1 + b * y1 + c * z1 + d) / denom;
	direction.MultiplyScalar (u);
	result = JSM.CoordAdd (line.start, direction);
	return result;
};

/**
* Function: CoordPlaneSignedDistance
* Description: Calculates the signed distance of a coordinate and a plane.
* Parameters:
*	coord {Coord} the coordinate
*	plane {Plane} the plane
* Returns:
*	{number} the result
*/
JSM.CoordPlaneSignedDistance = function (coord, plane)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = plane.a;
	var b = plane.b;
	var c = plane.c;
	var d = plane.d;

	var distance = (a * x + b * y + c * z + d) / Math.sqrt (a * a + b * b + c * c);
	return distance;
};

/**
* Function: CoordPlaneDistance
* Description: Calculates the distance of a coordinate and a plane.
* Parameters:
*	coord {Coord} the coordinate
*	plane {Plane} the plane
* Returns:
*	{number} the result
*/
JSM.CoordPlaneDistance = function (coord, plane)
{
	return Math.abs (JSM.CoordPlaneSignedDistance (coord, plane));
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

/**
* Function: ProjectCoordToPlane
* Description: Projects a coordinate to a plane.
* Parameters:
*	coord {Coord} the coordinate
*	plane {Plane} the plane
* Returns:
*	{Coord} the projected coordinate
*/
JSM.ProjectCoordToPlane = function (coord, plane)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = plane.a;
	var b = plane.b;
	var c = plane.c;
	var d = plane.d;

	var distance = JSM.CoordPlaneDistance (coord, plane);
	var side = a * x + b * y + c * z + d;
	if (JSM.IsGreater (side, 0.0)) {
		distance = -distance;
	}

	var normal = new JSM.Coord (a, b, c).Normalize ();
	var result = coord.Clone ().Offset (normal, distance);

	return result;
};
