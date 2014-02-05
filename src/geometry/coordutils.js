/**
* Function: CoordIsEqual2D
* Description: Determines if the given coordinates are equal.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{boolean} the result
*/
JSM.CoordIsEqual2D = function (a, b)
{
	return JSM.IsEqual (a.x, b.x) && JSM.IsEqual (a.y, b.y);
};

/**
* Function: CoordIsEqual2DWithEps
* Description: Determines if the given coordinates are equal. Uses the given epsilon for comparison.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
*	eps {number} the epsilon value
* Returns:
*	{boolean} the result
*/
JSM.CoordIsEqual2DWithEps = function (a, b, eps)
{
	return JSM.IsEqualWithEps (a.x, b.x, eps) && JSM.IsEqualWithEps (a.y, b.y, eps);
};

/**
* Function: CoordDistance2D
* Description: Calculates the distance of two coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{number} the result
*/
JSM.CoordDistance2D = function (a, b)
{
	var x1 = a.x;
	var y1 = a.y;
	var x2 = b.x;
	var y2 = b.y;

	return Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

/**
* Function: MidCoord2D
* Description: Calculates the coordinate in the middle of two coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{Coord2D} the result
*/
JSM.MidCoord2D = function (a, b)
{
	return new JSM.Coord2D ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
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
	var result = new JSM.Coord2D ();
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
	if (JSM.IsEqual (angle, Math.PI)) {
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
	var result = new JSM.Vector ();
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
	var result = new JSM.Vector ();
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
* Description: Calculates the angle of two vectors relative to a given reference vector.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	reference {Vector} the reference vector
* Returns:
*	{number} the result
*/
JSM.GetVectorsFullAngle = function (a, b, reference)
{
	var angle = JSM.GetVectorsAngle (a, b);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	
	if (JSM.CoordTurnType (b, origo, a, reference) == 'Clockwise') {
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
	return new JSM.Vector (a.x + b.x, a.y + b.y, a.z + b.z);
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
	return new JSM.Vector (a.x - b.x, a.y - b.y, a.z - b.z);
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
	var result = new JSM.Coord ();
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

	var result = new JSM.Coord ();
	result.x = - u * (- u * x - v * y - w * z) * (1 - Math.cos (angle)) + x * Math.cos (angle) + (- w * y + v * z) * Math.sin (angle);
	result.y = - v * (- u * x - v * y - w * z) * (1 - Math.cos (angle)) + y * Math.cos (angle) + (w * x - u * z) * Math.sin (angle);
	result.z = - w * (- u * x - v * y - w * z) * (1 - Math.cos (angle)) + z * Math.cos (angle) + (- v * x + u * y) * Math.sin (angle);
	
	result = JSM.CoordAdd (result, origo);
	return result;
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
*	coords {Coord} the array of coordinates
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
* Function: CalculateNormal
* Description: Calculates normal vector for the given coordinates.
* Parameters:
*	coords {Coord} the array of coordinates
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
	var result = new JSM.Coord ();
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
	var result = new JSM.SphericalCoord ();
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
	var result = new JSM.Coord ();
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
* Description: Calculates arc length between two vectors relative to a given reference vector.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	radius {number} the radius component
*	reference {Vector} the reference vector
* Returns:
*	{number} the result
*/
JSM.GetFullArcLength = function (a, b, radius, reference)
{
	var angle = JSM.GetVectorsFullAngle (a, b, reference);
	return angle * radius;
};
