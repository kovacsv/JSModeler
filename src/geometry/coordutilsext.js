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

JSM.CalculateNormal = function (coords)
{
	var count = coords.length;
	var normal = new JSM.Vector (0.0, 0.0, 0.0);
	if (count >= 3) {
		for (var i = 0; i < count; i++) {
			var currentIndex = i % count;
			var nextIndex = (i + 1) % count;
	
			var current = coords[currentIndex];
			var next = coords[nextIndex];
	
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
	result.x = radius * Math.sin (phi) * Math.cos (theta);
	result.y = radius * Math.sin (phi) * Math.sin (theta);
	result.z = radius * Math.cos (phi);
	return result;
};

JSM.CylindricalToCartesian = function (radius, theta, height)
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

JSM.GetFullArcLength = function (referenceVector, currentVector, radius, normal)
{
	var angle = JSM.GetVectorsFullAngle (referenceVector, currentVector, normal);
	return angle * radius;
};
