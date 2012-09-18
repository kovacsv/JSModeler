JSM.CoordLinePosition2D = function (coord, line)
{
	var x = coord.x;
	var y = coord.y;
	var a = line.start;
	var b = line.direction;

	var position = b.x * (y - a.y) - b.y * (x - a.x);
	if (JSM.IsPositive (position)) {
		return 'CoordAtLineLeft';
	} else if (JSM.IsNegative (position)) {
		return 'CoordAtLineRight';
	}

	return 'CoordOnLine';
}

JSM.CoordLinePosition = function (coord, line, projected)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = line.start;
	var b = line.direction;

	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = a.x + b.x;
	var y2 = a.y + b.y;
	var z2 = a.z + b.z;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
	if (JSM.IsZero (denom)) {
		if (projected !== undefined) {
			projected.Set (a.x, a.y, a.z);
		}

		if (JSM.CoordIsEqual (a, coord)) {
			return 'CoordOnLine';
		}

		return 'CoordOutsideOfLine';
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
	var c = JSM.CoordAdd (a, JSM.VectorMultiply (b, u));
	if (projected !== undefined) {
		projected.Set (c.x, c.y, c.z);
	}

	var distance = JSM.CoordDistance (coord, c);
	if (JSM.IsZero (distance)) {
		return 'CoordOnLine';
	}

	return 'CoordOutsideOfLine';
}

JSM.ProjectCoordToLine = function (coord, line)
{
	var result = new JSM.Coord ();

	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = line.start;
	var b = line.direction;

	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = a.x + b.x;
	var y2 = a.y + b.y;
	var z2 = a.z + b.z;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
	if (JSM.IsZero (denom)) {
		result.Set (a.x, a.y, a.z);
		return result;
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
	var c = JSM.CoordAdd (a, JSM.VectorMultiply (b, u));

	result.Set (c.x, c.y, c.z);
	return result;
}
