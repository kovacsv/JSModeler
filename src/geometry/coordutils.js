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
	
	var angle = JSM.GetVectorsAngle (abDirection, direction);
	if (JSM.IsPositive (angle)) {
		distance = -distance;
	}

	return distance;
};

/**
* Function: GetVectorsAngle
* Description: Calculates the angle of two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
* Returns:
*	{number} the result
*/
JSM.GetVectorsAngle = function (a, b)
{
	var aDirection = a.Clone ().Normalize ();
	var bDirection = b.Clone ().Normalize ();
	if (aDirection.IsEqual (bDirection)) {
		return 0.0;
	}
	
	var product = JSM.VectorDot (aDirection, bDirection);
	return JSM.ArcCos (product);
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
	var angle = JSM.GetVectorsAngle (a, b);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	
	if (JSM.CoordOrientation (a, origo, b, normal) == JSM.Orientation.Clockwise) {
		angle = 2.0 * Math.PI - angle;
	}
	
	return angle;
};

/**
* Function: VectorsAreCollinear
* Description: Determines if two vectors are collinear.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
* Returns:
*	{boolean} the result
*/
JSM.VectorsAreCollinear = function (a, b)
{
	var angle = JSM.GetVectorsAngle (a, b);
	return JSM.IsEqual (angle, 0.0) || JSM.IsEqual (angle, Math.PI);
};

/**
* Function: GetCoord2DFromCoord
* Description: Transforms a 3D coordinate to a 2D coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	origo {Coord} the origo of transformation
*	normal {Vector} the normal vector of transformation
* Returns:
*	{Coord2D} the result
*/
JSM.GetCoord2DFromCoord = function (coord, origo, normal)
{
	var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
	var axis = JSM.VectorCross (normal, zNormal);
	var angle = JSM.GetVectorsAngle (normal, zNormal);

	var rotated = coord.Clone ().Rotate (axis, angle, origo);
	return new JSM.Coord2D (rotated.x, rotated.y);
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
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var a2 = JSM.GetCoord2DFromCoord (a, origo, normal);
	var b2 = JSM.GetCoord2DFromCoord (b, origo, normal);
	var c2 = JSM.GetCoord2DFromCoord (c, origo, normal);
	var orientation = JSM.CoordOrientation2D (a2, b2, c2);

	var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
	var angle = JSM.GetVectorsAngle (normal, zNormal);
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
