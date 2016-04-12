/**
* Enum: Orientation
* Description: Orientation of coordinates.
* Values:
*	{Invalid} invalid orientation or collinear
*	{CounterClockwise} counter clockwise orientation
*	{Clockwise} clockwise orientation
*/
JSM.Orientation = {
	Invalid : 0,
	CounterClockwise : 1,
	Clockwise : 2
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
* Function: CoordOrientation2D
* Description: Calculates the turn type of three coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
*	c {Coord2D} the third coordinate
* Returns:
*	{Orientation} the result
*/
JSM.CoordOrientation2D = function (a, b, c)
{
	var m00 = a.x;
	var m01 = a.y;
	var m10 = b.x;
	var m11 = b.y;
	var m20 = c.x;
	var m21 = c.y;
    
	var determinant = m00 * m11 + m01 * m20 + m10 * m21 - m11 * m20 - m01 * m10 - m00 * m21;
	if (JSM.IsPositive (determinant)) {
		return JSM.Orientation.CounterClockwise;
	} else if (JSM.IsNegative (determinant)) {
		return JSM.Orientation.Clockwise;
	}
	
	return JSM.Orientation.Invalid;	
};

/**
* Function: CoordSignedDistance2D
* Description: Calculates the distance of two coordinates along a direction vector.
* Parameters:
*	a {Coord2D} first coordinate
*	b {Coord2D} second coordinate
*	direction {Vector2D} direction vector
* Returns:
*	{number} the result
*/
JSM.CoordSignedDistance2D = function (a, b, direction)
{
	var abDirection = JSM.CoordSub2D (b, a);
	var distance = a.DistanceTo (b);
	
	var angle = abDirection.AngleTo (direction);
	if (JSM.IsPositive (angle)) {
		distance = -distance;
	}

	return distance;
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
* Function: MidCoord
* Description: Calculates the coordinate in the middle of two coordinates.
* Parameters:
*	a {Coord} first coordinate
*	b {Coord} second coordinate
* Returns:
*	{Coord} the result
*/
JSM.MidCoord = function (a, b)
{
	return new JSM.Coord ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0, (a.z + b.z) / 2.0);
};

/**
* Function: CoordSignedDistance
* Description: Calculates the distance of two coordinates along a direction vector.
* Parameters:
*	a {Coord} first coordinate
*	b {Coord} second coordinate
*	direction {Vector} direction vector
* Returns:
*	{number} the result
*/
JSM.CoordSignedDistance = function (a, b, direction)
{
	var abDirection = JSM.CoordSub (b, a);
	var distance = a.DistanceTo (b);
	
	var angle = abDirection.AngleTo (direction);
	if (JSM.IsPositive (angle)) {
		distance = -distance;
	}

	return distance;
};

/**
* Function: GetVectorsFullAngle
* Description: Calculates the full angle (0 to pi) of two vectors with the given normal vector.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	normal {Vector} the normal vector
* Returns:
*	{number} the result
*/
JSM.GetVectorsFullAngle = function (a, b, normal)
{
	var angle = a.AngleTo (b);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	
	if (JSM.CoordOrientation (a, origo, b, normal) == JSM.Orientation.Clockwise) {
		angle = 2.0 * Math.PI - angle;
	}
	
	return angle;
};

/**
* Function: CoordOrientation
* Description: Calculates the turn type of three coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
*	c {Coord} the third coordinate
*	normal {Vector} normal vector for calculation
* Returns:
*	{Orientation} the result
*/
JSM.CoordOrientation = function (a, b, c, normal)
{
	var a2 = a.ToCoord2D (normal);
	var b2 = b.ToCoord2D (normal);
	var c2 = c.ToCoord2D (normal);
	var orientation = JSM.CoordOrientation2D (a2, b2, c2);

	var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
	var angle = normal.AngleTo (zNormal);
	if (JSM.IsEqual (angle, Math.PI)) {
		if (orientation == JSM.Orientation.CounterClockwise) {
			orientation = JSM.Orientation.Clockwise;
		} else if (orientation == JSM.Orientation.Clockwise) {
			orientation = JSM.Orientation.CounterClockwise;
		}
	}
	
	return orientation;
};

/**
* Function: SphericalToCartesian
* Description: Converts a spherical coordinate to a cartesian coordinate.
* Parameters:
*	radius {number} the radius component
*	theta {number} the angle component
*	phi {number} the phi component
* Returns:
*	{Coord} the result
*/
JSM.SphericalToCartesian = function (radius, theta, phi)
{
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = radius * Math.sin (theta) * Math.cos (phi);
	result.y = radius * Math.sin (theta) * Math.sin (phi);
	result.z = radius * Math.cos (theta);
	return result;
};

/**
* Function: CylindricalToCartesian
* Description: Converts a cylindrical coordinate to a cartesian coordinate.
* Parameters:
*	radius {number} the radius component
*	height {number} the height component
*	theta {number} the theta component
* Returns:
*	{Coord} the result
*/
JSM.CylindricalToCartesian = function (radius, height, theta)
{
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = radius * Math.cos (theta);
	result.y = radius * Math.sin (theta);
	result.z = height;
	return result;
};

/**
* Function: GetArcLength
* Description: Calculates arc length between two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	radius {number} the radius component
* Returns:
*	{number} the result
*/
JSM.GetArcLength = function (a, b, radius)
{
	var angle = a.AngleTo (b);
	return angle * radius;
};

/**
* Function: GetFullArcLength
* Description: Calculates arc length between two vectors with the given normal vector.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	radius {number} the radius component
*	normal {Vector} the normal vector
* Returns:
*	{number} the result
*/
JSM.GetFullArcLength = function (a, b, radius, normal)
{
	var angle = JSM.GetVectorsFullAngle (a, b, normal);
	return angle * radius;
};

/**
* Function: CalculateCentroid
* Description: Calculates center points of the given coordinates.
* Parameters:
*	coords {Coord[*]} the array of coordinates
* Returns:
*	{Coord} the result
*/
JSM.CalculateCentroid = function (coords)
{
	var count = coords.length;
	var centroid = new JSM.Coord (0.0, 0.0, 0.0);
	if (count >= 1) {
		var i;
		for (i = 0; i < count; i++) {
			centroid = JSM.CoordAdd (centroid, coords[i]);
		}
		centroid.MultiplyScalar (1.0 / count);
	}

	return centroid;
};

/**
* Function: CalculateTriangleNormal
* Description: Calculates normal vector for the given triangle vertices.
* Parameters:
*	v0 {Coord} the first vertex of the triangle
*	v1 {Coord} the second vertex of the triangle
*	v2 {Coord} the third vertex of the triangle
* Returns:
*	{Vector} the result
*/
JSM.CalculateTriangleNormal = function (v0, v1, v2)
{
	var v = JSM.CoordSub (v1, v0);
	var w = JSM.CoordSub (v2, v0);
	
	var normal = new JSM.Vector (0.0, 0.0, 0.0);
	normal.x = (v.y * w.z - v.z * w.y);
	normal.y = (v.z * w.x - v.x * w.z);
	normal.z = (v.x * w.y - v.y * w.x);

	normal.Normalize ();
	return normal;
};

/**
* Function: CalculateNormal
* Description: Calculates normal vector for the given coordinates.
* Parameters:
*	coords {Coord[*]} the array of coordinates
* Returns:
*	{Vector} the result
*/
JSM.CalculateNormal = function (coords)
{
	var count = coords.length;
	var normal = new JSM.Vector (0.0, 0.0, 0.0);
	if (count >= 3) {
		var i, currentIndex, nextIndex;
		var current, next;
		for (i = 0; i < count; i++) {
			currentIndex = i % count;
			nextIndex = (i + 1) % count;
	
			current = coords[currentIndex];
			next = coords[nextIndex];
	
			normal.x += (current.y - next.y) * (current.z + next.z);
			normal.y += (current.z - next.z) * (current.x + next.x);
			normal.z += (current.x - next.x) * (current.y + next.y);
		}
	}

	normal.Normalize ();
	return normal;
};

/**
* Function: BarycentricInterpolation
* Description: Calculates barycentric interpolation for the given values.
* Parameters:
*	vertex0, vertex1, vertex2 {Coord} the vertices of interpolation
*	value0, value1, value2 {Coord} the values to interpolate
*	position {Coord} the position of interpolation
* Returns:
*	{Coord} the result
*/
JSM.BarycentricInterpolation = function (vertex0, vertex1, vertex2, value0, value1, value2, position)
{
	function GetTriangleArea (a, b, c)
	{
		var s = (a + b + c) / 2.0;
		var areaSquare = s * (s - a) * (s - b) * (s - c);
		if (areaSquare < 0.0) {
			return 0.0;
		}
		return Math.sqrt (areaSquare);
	}
	
	var edge0 = vertex0.DistanceTo (vertex1);
	var edge1 = vertex1.DistanceTo (vertex2);
	var edge2 = vertex2.DistanceTo (vertex0);
	
	var distance0 = vertex0.DistanceTo (position);
	var distance1 = vertex1.DistanceTo (position);
	var distance2 = vertex2.DistanceTo (position);
	
	var area = GetTriangleArea (edge0, edge1, edge2);
	if (JSM.IsZero (area)) {
		return value0;
	}
	
	var area0 = GetTriangleArea (edge0, distance0, distance1);
	var area1 = GetTriangleArea (edge1, distance1, distance2);
	var area2 = GetTriangleArea (edge2, distance0, distance2);
	
	var interpolated0 = value0.Clone ().MultiplyScalar (area1);
	var interpolated1 = value1.Clone ().MultiplyScalar (area2);
	var interpolated2 = value2.Clone ().MultiplyScalar (area0);
	var interpolated = JSM.CoordAdd (JSM.CoordAdd (interpolated0, interpolated1), interpolated2);
	interpolated.MultiplyScalar (1.0 / area);
	return interpolated;
};
