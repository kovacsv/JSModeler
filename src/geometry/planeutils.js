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

JSM.LinePlanePosition = function (line, plane, intersection)
{
	var	direction = JSM.VectorNormalize (line.direction);

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
		var i = JSM.CoordAdd (line.start, JSM.VectorMultiply (direction, u));
		intersection.Set (i.x, i.y, i.z);
	}

	return 'LineIntersectsPlane';
};

JSM.LinePlaneIntersection = function (line, plane)
{
	var	direction = JSM.VectorNormalize (line.direction);

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
	result = JSM.CoordAdd (line.start, JSM.VectorMultiply (direction, u));
	return result;
};


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

JSM.CoordPlaneDistance = function (coord, plane)
{
	return Math.abs (JSM.CoordPlaneSignedDistance (coord, plane));
};

JSM.CoordPlaneSignedDirectionalDistance = function (coord, direction, plane)
{
	var	normal = JSM.VectorNormalize (direction);

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
	var intersection = JSM.CoordAdd (coord, JSM.VectorMultiply (normal, u));
	var distance = JSM.CoordDistance (coord, intersection);
	var s = a * x1 + b * y1 + c * z1 + d;
	if (JSM.IsNegative (s)) {
		distance = -distance;
	}

	return distance;
};

JSM.CoordPlaneDirectionalDistance = function (coord, direction, plane)
{
	return Math.abs (JSM.CoordPlaneSignedDirectionalDistance (coord, direction, plane));
};

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

	var normal = JSM.VectorNormalize (new JSM.Coord (a, b, c));
	var result = JSM.CoordOffset (coord, normal, distance);

	return result;
};
