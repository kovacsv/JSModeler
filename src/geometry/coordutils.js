/**
* Function: CoordFromArray
* Description: Returns a coordinate from an array of components.
* Parameters:
*	array {number[3]} the array of components
* Returns:
*	{Coord} the result
*/
JSM.CoordFromArray = function (array)
{
	return new JSM.Coord (array[0], array[1], array[2]);
};

/**
* Function: CoordToArray
* Description: Returns array of components from a coordinate.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	array {number[3]} the result
*/
JSM.CoordToArray = function (coord)
{
	return [coord.x, coord.y, coord.z];
};

/**
* Function: CoordIsEqual
* Description: Determines if the given coordinates are equal.
* Parameters:
*	a {Coord} first coordinate
*	b {Coord} second coordinate
* Returns:
*	{boolean} the result
*/
JSM.CoordIsEqual = function (a, b)
{
	return JSM.IsEqual (a.x, b.x) && JSM.IsEqual (a.y, b.y) && JSM.IsEqual (a.z, b.z);
};

/**
* Function: CoordIsEqualWithEps
* Description: Determines if the given coordinates are equal. Uses the given epsilon for comparison.
* Parameters:
*	a {Coord} first coordinate
*	b {Coord} second coordinate
*	eps {number} epsilon value
* Returns:
*	{boolean} the result
*/
JSM.CoordIsEqualWithEps = function (a, b, eps)
{
	return JSM.IsEqualWithEps (a.x, b.x, eps) && JSM.IsEqualWithEps (a.y, b.y, eps) && JSM.IsEqualWithEps (a.z, b.z, eps);
};


/**
* Function: CoordAdd
* Description: Adds two coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
* Returns:
*	{Coord} the result
*/
JSM.CoordAdd = function (a, b)
{
	return new JSM.Coord (a.x + b.x, a.y + b.y, a.z + b.z);
};

/**
* Function: CoordSub
* Description: Subs two coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
* Returns:
*	{Coord} the result
*/
JSM.CoordSub = function (a, b)
{
	return new JSM.Coord (a.x - b.x, a.y - b.y, a.z - b.z);
};

/**
* Function: SphericalCoordIsEqual
* Description: Determines if the given coordinates are equal.
* Parameters:
*	a {SpericalCoord} first coordinate
*	b {SpericalCoord} second coordinate
* Returns:
*	{boolean} the result
*/
JSM.SphericalCoordIsEqual = function (a, b)
{
	return JSM.IsEqual (a.radius, b.radius) && JSM.IsEqual (a.phi, b.phi) && JSM.IsEqual (a.theta, b.theta);
};

/**
* Function: CoordDistance
* Description: Calculates the distance of two coordinates.
* Parameters:
*	a {Coord} first coordinate
*	b {Coord} second coordinate
* Returns:
*	{number} the result
*/
JSM.CoordDistance = function (a, b)
{
	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = b.x;
	var y2 = b.y;
	var z2 = b.z;

	return Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
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
	var distance = JSM.CoordDistance (a, b);
	
	var angle = JSM.GetVectorsAngle (abDirection, direction);
	if (JSM.IsPositive (angle)) {
		distance = -distance;
	}

	return distance;
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
* Function: VectorMultiply
* Description: Multiplies a vector with a scalar.
* Parameters:
*	vector {Vector} the vector
*	scalar {number} the scalar
* Returns:
*	{Vector} the result
*/
JSM.VectorMultiply = function (vector, scalar)
{
	var result = new JSM.Vector (0.0, 0.0, 0.0);
	result.x = vector.x * scalar;
	result.y = vector.y * scalar;
	result.z = vector.z * scalar;
	return result;
};

/**
* Function: VectorDot
* Description: Calculates the dot product of two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
* Returns:
*	{number} the result
*/
JSM.VectorDot = function (a, b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

/**
* Function: VectorCross
* Description: Calculates the cross product of two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
* Returns:
*	{Vector} the result
*/
JSM.VectorCross = function (a, b)
{
	var result = new JSM.Vector (0.0, 0.0, 0.0);
	result.x = a.y * b.z - a.z * b.y;
	result.y = a.z * b.x - a.x * b.z;
	result.z = a.x * b.y - a.y * b.x;
	return result;
};

/**
* Function: VectorLength
* Description: Calculates length of a vector.
* Parameters:
*	vector {Vector} the vector
* Returns:
*	{number} the result
*/
JSM.VectorLength = function (vector)
{
	var x = vector.x;
	var y = vector.y;
	var z = vector.z;

	return Math.sqrt (x * x + y * y + z * z);
};

/**
* Function: VectorNormalize
* Description: Normalize a vector.
* Parameters:
*	vector {Vector} the vector
* Returns:
*	{Vector} the result
*/
JSM.VectorNormalize = function (vector)
{
	var length = JSM.VectorLength (vector);
	var result = new JSM.Vector (0.0, 0.0, 0.0);
	if (JSM.IsGreater (length, 0.0)) {
		result = JSM.VectorMultiply (vector, 1.0 / length);
	}
	return result;
};

/**
* Function: VectorSetLength
* Description: Sets the length of a vector.
* Parameters:
*	vector {Vector} the vector
*	length {number} the length
* Returns:
*	{Vector} the result
*/
JSM.VectorSetLength = function (vector, length)
{
	var ratio = length / JSM.VectorLength (vector);
	var result = JSM.VectorMultiply (vector, ratio);
	return result;
};


/**
* Function: CoordOffset
* Description: Offsets a coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	direction {Vector} the direction of the offset
*	distance {number} the distance of the offset
* Returns:
*	{Coord} the result
*/
JSM.CoordOffset = function (coord, direction, distance)
{
	var normal = JSM.VectorNormalize (direction);
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = coord.x + normal.x * distance;
	result.y = coord.y + normal.y * distance;
	result.z = coord.z + normal.z * distance;
	return result;
};

/**
* Function: CoordRotate
* Description: Rotates a coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	axis {Vector} the axis of the rotation
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Coord} the result
*/
JSM.CoordRotate = function (coord, axis, angle, origo)
{
	var offseted = JSM.CoordSub (coord, origo);
	var normal = JSM.VectorNormalize (axis);

	var u = normal.x;
	var v = normal.y;
	var w = normal.z;

	var x = offseted.x;
	var y = offseted.y;
	var z = offseted.z;

	var si = Math.sin (angle);
	var co = Math.cos (angle);
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = - u * (- u * x - v * y - w * z) * (1.0 - co) + x * co + (- w * y + v * z) * si;
	result.y = - v * (- u * x - v * y - w * z) * (1.0 - co) + y * co + (w * x - u * z) * si;
	result.z = - w * (- u * x - v * y - w * z) * (1.0 - co) + z * co + (- v * x + u * y) * si;
	
	result = JSM.CoordAdd (result, origo);
	return result;
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
	var aDirection = JSM.VectorNormalize (a);
	var bDirection = JSM.VectorNormalize (b);
	if (JSM.CoordIsEqual (aDirection, bDirection)) {
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
	
	if (JSM.CoordTurnType (a, origo, b, normal) == 'Clockwise') {
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

	var rotated = JSM.CoordRotate (coord, axis, angle, origo);
	return new JSM.Coord2D (rotated.x, rotated.y);
};

/**
* Function: CoordTurnType
* Description: Calculates the turn type of three coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
*	c {Coord} the third coordinate
*	normal {Vector} normal vector for calculation
* Returns:
*	{string} 'CounterClockwise', 'Clockwise', or 'Collinear'
*/
JSM.CoordTurnType = function (a, b, c, normal)
{
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var a2 = JSM.GetCoord2DFromCoord (a, origo, normal);
	var b2 = JSM.GetCoord2DFromCoord (b, origo, normal);
	var c2 = JSM.GetCoord2DFromCoord (c, origo, normal);
	var turnType = JSM.CoordTurnType2D (a2, b2, c2);

	var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
	var angle = JSM.GetVectorsAngle (normal, zNormal);
	if (JSM.IsEqual (angle, Math.PI)) {
		if (turnType === 'CounterClockwise') {
			turnType = 'Clockwise';
		} else if (turnType === 'Clockwise') {
			turnType = 'CounterClockwise';
		}
	}
	
	return turnType;
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
		centroid = JSM.VectorMultiply (centroid, 1.0 / count);
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

	var normalized = JSM.VectorNormalize (normal);
	return normalized;
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

	var normalized = JSM.VectorNormalize (normal);
	return normalized;
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
	
	var edge0 = JSM.CoordDistance (vertex0, vertex1);
	var edge1 = JSM.CoordDistance (vertex1, vertex2);
	var edge2 = JSM.CoordDistance (vertex2, vertex0);
	
	var distance0 = JSM.CoordDistance (vertex0, position);
	var distance1 = JSM.CoordDistance (vertex1, position);
	var distance2 = JSM.CoordDistance (vertex2, position);
	
	var area = GetTriangleArea (edge0, edge1, edge2);
	if (JSM.IsZero (area)) {
		return value0;
	}
	
	var area0 = GetTriangleArea (edge0, distance0, distance1);
	var area1 = GetTriangleArea (edge1, distance1, distance2);
	var area2 = GetTriangleArea (edge2, distance0, distance2);
	
	var interpolated0 = JSM.VectorMultiply (value0, area1);
	var interpolated1 = JSM.VectorMultiply (value1, area2);
	var interpolated2 = JSM.VectorMultiply (value2, area0);
	var interpolated = JSM.CoordAdd (JSM.CoordAdd (interpolated0, interpolated1), interpolated2);
	return JSM.VectorMultiply (interpolated, 1.0 / area);
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
* Function: CartesianToSpherical
* Description: Converts a cartesian coordinate to a spherical coordinate.
* Parameters:
*	x {number} the x component
*	y {number} the y component
*	z {number} the z component
* Returns:
*	{SphericalCoord} the result
*/
JSM.CartesianToSpherical = function (x, y, z)
{
	var result = new JSM.SphericalCoord (0.0, 0.0, 0.0);
	result.radius = Math.sqrt (x * x + y * y + z * z);
	if (JSM.IsZero (result.radius)) {
		return result;
	}
	result.theta = Math.acos (z / result.radius);
	result.phi = Math.atan2 (y, x);
	return result;
};

/**
* Function: SphericalToCartesianWithOrigo
* Description: Converts a spherical coordinate to a cartesian coordinate with the given origo.
* Parameters:
*	spherical {SphericalCoord} the coordinate
*	origo {Coord} the origo
* Returns:
*	{Coord} the result
*/
JSM.SphericalToCartesianWithOrigo = function (spherical, origo)
{
	var cartesian = JSM.SphericalToCartesian (spherical.radius, spherical.theta, spherical.phi);
	var offseted = JSM.CoordAdd (cartesian, origo);
	return offseted;
};

/**
* Function: CartesianToSphericalWithOrigo
* Description: Converts a cartesian coordinate to a spherical coordinate with the given origo.
* Parameters:
*	cartesian {Coord} the coordinate
*	origo {Coord} the origo
* Returns:
*	{SphericalCoord} the result
*/
JSM.CartesianToSphericalWithOrigo = function (cartesian, origo)
{
	var offseted = JSM.CoordSub (cartesian, origo);
	var spherical = JSM.CartesianToSpherical (offseted.x, offseted.y, offseted.z);
	return spherical;
};

/**
* Function: MoveCoordOnSphere
* Description: Moves a coordinate on a surface of a sphere with the given angles.
* Parameters:
*	coord {Coord} the coordinate
*	origo {Coord} the origo
*	thetaAngle {number} the theta angle
*	phiAngle {number} the phi angle
* Returns:
*	{Coord} the result
*/
JSM.MoveCoordOnSphere = function (coord, origo, thetaAngle, phiAngle)
{
	var spherical = JSM.CartesianToSphericalWithOrigo (coord, origo);
	spherical.theta += thetaAngle;
	spherical.phi += phiAngle;
	var cartesian = JSM.SphericalToCartesianWithOrigo (spherical, origo);
	return cartesian;
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
	var angle = JSM.GetVectorsAngle (a, b);
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
