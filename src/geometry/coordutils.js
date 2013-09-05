JSM.CoordIsEqual2D = function (a, b)
{
	return JSM.IsEqual (a.x, b.x) && JSM.IsEqual (a.y, b.y);
};

JSM.CoordDistance2D = function (a, b)
{
	var x1 = a.x;
	var y1 = a.y;
	var x2 = b.x;
	var y2 = b.y;

	return Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

JSM.MidCoord2D = function (a, b)
{
	return new JSM.Coord2D ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
};

JSM.CoordIsEqual = function (a, b)
{
	return JSM.IsEqual (a.x, b.x) && JSM.IsEqual (a.y, b.y) && JSM.IsEqual (a.z, b.z);
};

JSM.SphericalCoordIsEqual = function (a, b)
{
	return JSM.IsEqual (a.radius, b.radius) && JSM.IsEqual (a.phi, b.phi) && JSM.IsEqual (a.theta, b.theta);
};

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

JSM.MidCoord = function (a, b)
{
	return new JSM.Coord ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0, (a.z + b.z) / 2.0);
};

JSM.VectorMultiply = function (vector, scalar)
{
	var result = new JSM.Vector ();
	result.x = vector.x * scalar;
	result.y = vector.y * scalar;
	result.z = vector.z * scalar;
	return result;
};

JSM.VectorDot = function (a, b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

JSM.VectorCross = function (a, b)
{
	var result = new JSM.Vector ();
	result.x = a.y * b.z - a.z * b.y;
	result.y = a.z * b.x - a.x * b.z;
	result.z = a.x * b.y - a.y * b.x;
	return result;
};

JSM.VectorLength = function (vector)
{
	var x = vector.x;
	var y = vector.y;
	var z = vector.z;

	return Math.sqrt (x * x + y * y + z * z);
};

JSM.VectorNormalize = function (vector)
{
	var length = JSM.VectorLength (vector);
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	if (JSM.IsGreater (length, 0.0)) {
		result = JSM.VectorMultiply (vector, 1.0 / length);
	}
	return result;
};

JSM.VectorSetLength = function (vector, length)
{
	var ratio = length / JSM.VectorLength (vector);
	var result = JSM.VectorMultiply (vector, ratio);
	return result;
};

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

JSM.VectorsAreCollinear = function (a, b)
{
	var angle = JSM.GetVectorsAngle (a, b);
	return JSM.IsEqual (angle, 0.0) || JSM.IsEqual (angle, Math.PI);
};

JSM.CoordAdd = function (a, b)
{
	return new JSM.Vector (a.x + b.x, a.y + b.y, a.z + b.z);
};

JSM.CoordSub = function (a, b)
{
	return new JSM.Vector (a.x - b.x, a.y - b.y, a.z - b.z);
};

JSM.CoordOffset = function (coord, direction, distance)
{
	var normal = JSM.VectorNormalize (direction);
	var result = new JSM.Coord ();
	result.x = coord.x + normal.x * distance;
	result.y = coord.y + normal.y * distance;
	result.z = coord.z + normal.z * distance;
	return result;
};
	
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

JSM.PolarToCartesian = function (radius, theta)
{
	var result = new JSM.Coord2D ();
	result.x = radius * Math.cos (theta);
	result.y = radius * Math.sin (theta);
	return result;
};

JSM.GetPolarArcLengthFromAngle = function (radius, theta)
{
	return theta * radius;
};

JSM.GetPolarAngleFromArcLength = function (radius, arcLength)
{
	if (JSM.IsEqual (radius, 0.0)) {
		return 0.0;
	}
	
	return arcLength / radius;
};

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

JSM.SphericalToCartesian = function (radius, theta, phi)
{
	var result = new JSM.Coord ();
	result.x = radius * Math.sin (theta) * Math.cos (phi);
	result.y = radius * Math.sin (theta) * Math.sin (phi);
	result.z = radius * Math.cos (theta);
	return result;
};

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

JSM.SphericalToCartesianWithOrigo = function (spherical, origo)
{
	var cartesian = JSM.SphericalToCartesian (spherical.radius, spherical.theta, spherical.phi);
	var offseted = JSM.CoordAdd (cartesian, origo);
	return offseted;
};

JSM.CartesianToSphericalWithOrigo = function (cartesian, origo)
{
	var offseted = JSM.CoordSub (cartesian, origo);
	var spherical = JSM.CartesianToSpherical (offseted.x, offseted.y, offseted.z);
	return spherical;
};

JSM.MoveCoordOnSphere = function (coord, origo, thetaAngle, phiAngle)
{
	var spherical = JSM.CartesianToSphericalWithOrigo (coord, origo);
	spherical.theta += thetaAngle;
	spherical.phi += phiAngle;
	var cartesian = JSM.SphericalToCartesianWithOrigo (spherical, origo);
	return cartesian;
};

JSM.CylindricalToCartesian = function (radius, height, theta)
{
	var result = new JSM.Coord ();
	result.x = radius * Math.cos (theta);
	result.y = radius * Math.sin (theta);
	result.z = height;
	return result;
};

JSM.GetCoord2DFromCoord = function (coord, origo, normal)
{
	var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
	var axis = JSM.VectorCross (normal, zNormal);
	var angle = JSM.GetVectorsAngle (normal, zNormal);

	var rotated = JSM.CoordRotate (coord, axis, angle, origo);
	return new JSM.Coord2D (rotated.x, rotated.y);
};

JSM.GetArcLength = function (a, b, radius)
{
	var angle = JSM.GetVectorsAngle (a, b);
	return angle * radius;
};

JSM.GetVectorsFullAngle = function (referenceVector, currentVector, normal)
{
	var angle = JSM.GetVectorsAngle (referenceVector, currentVector);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	
	if (JSM.CoordTurnType (currentVector, origo, referenceVector, normal) == 'Clockwise') {
		angle = 2.0 * Math.PI - angle;
	}
	
	return angle;
};

JSM.GetFullArcLength = function (referenceVector, currentVector, radius, normal)
{
	var angle = JSM.GetVectorsFullAngle (referenceVector, currentVector, normal);
	return angle * radius;
};
