/**
* Function: CoordFromArray2D
* Description: Returns a coordinate from an array of components.
* Parameters:
*	array {number[2]} the array of components
* Returns:
*	{Coord2D} the result
*/
JSM.CoordFromArray2D = function (array)
{
	return new JSM.Coord2D (array[0], array[1]);
};

/**
* Function: CoordToArray2D
* Description: Returns array of components from a coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	array {number[2]} the result
*/
JSM.CoordToArray2D = function (coord)
{
	return [coord.x, coord.y];
};

/**
* Function: CoordAdd2D
* Description: Adds two coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{Coord2D} the result
*/
JSM.CoordAdd2D = function (a, b)
{
	return new JSM.Coord2D (a.x + b.x, a.y + b.y);
};

/**
* Function: CoordSub2D
* Description: Subs two coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{Coord2D} the result
*/
JSM.CoordSub2D = function (a, b)
{
	return new JSM.Coord2D (a.x - b.x, a.y - b.y, a.z - b.z);
};

/**
* Function: MidCoord2D
* Description: Calculates the coordinate in the middle of two coordinates.
* Parameters:
*	a {Coord2D} first coordinate
*	b {Coord2D} second coordinate
* Returns:
*	{Coord2D} the result
*/
JSM.MidCoord2D = function (a, b)
{
	return new JSM.Coord2D ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
};

/**
* Function: CoordOffset2D
* Description: Offsets a coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
*	direction {Vector2D} the direction of the offset
*	distance {number} the distance of the offset
* Returns:
*	{Coord2D} the result
*/
JSM.CoordOffset2D = function (coord, direction, distance)
{
	var normal = direction.Clone ().Normalize ();
	var result = new JSM.Coord2D (0.0, 0.0);
	result.x = coord.x + normal.x * distance;
	result.y = coord.y + normal.y * distance;
	return result;
};

/**
* Function: CoordRotate2D
* Description: Rotates a coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
*	angle {number} the angle of the rotation
*	origo {Coord2D} the origo of the rotation
* Returns:
*	{Coord} the result
*/
JSM.CoordRotate2D = function (coord, angle, origo)
{
	var offseted = JSM.CoordSub2D (coord, origo);
	var result = new JSM.Coord2D ();
	var co = Math.cos (angle);
	var si = Math.sin (angle);
	result.x = offseted.x * co - offseted.y * si;
	result.y = offseted.x * si + offseted.y * co;
	result = JSM.CoordAdd2D (result, origo);
	return result;	
};

/**
* Function: PolarToCartesian
* Description: Converts a polar coordinate to a cartesian coordinate.
* Parameters:
*	radius {number} the radius component
*	theta {number} the angle component
* Returns:
*	{Coord2D} the result
*/
JSM.PolarToCartesian = function (radius, theta)
{
	var result = new JSM.Coord2D (0.0, 0.0);
	result.x = radius * Math.cos (theta);
	result.y = radius * Math.sin (theta);
	return result;
};

/**
* Function: GetArcLengthFromAngle
* Description: Calculates arc length from radius and angle.
* Parameters:
*	radius {number} the radius of the circle
*	theta {number} the angle of rotation
* Returns:
*	{number} the result
*/
JSM.GetArcLengthFromAngle = function (radius, theta)
{
	return theta * radius;
};

/**
* Function: GetAngleFromArcLength
* Description: Calculates angle from arc length.
* Parameters:
*	radius {number} the radius of the circle
*	arcLength {number} the arc length
* Returns:
*	{number} the result
*/
JSM.GetAngleFromArcLength = function (radius, arcLength)
{
	if (JSM.IsEqual (radius, 0.0)) {
		return 0.0;
	}
	
	return arcLength / radius;
};

/**
* Function: CoordTurnType2D
* Description: Calculates the turn type of three coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
*	c {Coord2D} the third coordinate
* Returns:
*	{string} 'CounterClockwise', 'Clockwise', or 'Collinear'
*/
JSM.CoordTurnType2D = function (a, b, c)
{
	var m00 = a.x;
	var m01 = a.y;
	var m02 = 1.0;
	var m10 = b.x;
	var m11 = b.y;
	var m12 = 1.0;
	var m20 = c.x;
	var m21 = c.y;
	var m22 = 1.0;

	var determinant = JSM.MatrixDeterminant3x3 (m00, m01, m02, m10, m11, m12, m20, m21, m22);
	if (JSM.IsPositive (determinant)) {
		return 'CounterClockwise';
	} else if (JSM.IsNegative (determinant)) {
		return 'Clockwise';
	} else {
		return 'Collinear';
	}
};
