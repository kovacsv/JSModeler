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

JSM.GetVectorsFullAngle = function (referenceVector, currentVector, normal)
{
	var angle = JSM.GetVectorsAngle (referenceVector, currentVector);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	
	if (JSM.CoordTurnType (currentVector, origo, referenceVector, normal) == 'Clockwise') {
		angle = 2.0 * Math.PI - angle;
	}
	
	return angle;
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
