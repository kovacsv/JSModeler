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

JSM.LineLineClosestPoint = function (aLine, bLine, aClosestPoint, bClosestPoint)
{
	function Dmnop (v, m, n, o, p)
	{
		var result = (v[m].x - v[n].x) * (v[o].x - v[p].x) + (v[m].y - v[n].y) * (v[o].y - v[p].y) + (v[m].z - v[n].z) * (v[o].z - v[p].z);
		return result;
	}

	var aDir = JSM.VectorNormalize (aLine.direction);
	var aStart = aLine.start;
	var aEnd = JSM.CoordAdd (aStart, aDir);

	var bDir = JSM.VectorNormalize (bLine.direction);
	var bStart = bLine.start;
	var bEnd = JSM.CoordAdd (bStart, bDir);
	
	var v = [aStart, aEnd, bStart, bEnd];
	
	var d1010 = Dmnop (v, 1, 0, 1, 0);
	var d0210 = Dmnop (v, 0, 2, 1, 0);
	var d0232 = Dmnop (v, 0, 2, 3, 2);
	var d3210 = Dmnop (v, 3, 2, 1, 0);
	var d3232 = Dmnop (v, 3, 2, 3, 2);
	var denom = (d1010 * d3232 - d3210 * d3210);
	if (JSM.IsEqual (denom, 0.0)) {
		return false;
	}
	
	var nom = (d0232 * d3210 - d0210 * d3232);
	var mua = nom / denom;
	var mub = (d0232 + mua * d3210) / d3232;

	if (aClosestPoint !== undefined) {
		var aDir = JSM.VectorNormalize (JSM.CoordSub (aEnd, aStart));
		var aClosest = JSM.CoordAdd (aStart, JSM.VectorMultiply (aDir, mua));
		aClosestPoint.Set (aClosest.x, aClosest.y, aClosest.z);
	}
	
	if (bClosestPoint !== undefined) {
		var bClosest = JSM.CoordAdd (bStart, JSM.VectorMultiply (bDir, mub));
		bClosestPoint.Set (bClosest.x, bClosest.y, bClosest.z);
	}
	
	return true;
}

JSM.LineLinePosition = function (aLine, bLine, intersection)
{
	var aClosestPoint = new JSM.Coord ();
	var bClosestPoint = new JSM.Coord ();
	if (!JSM.LineLineClosestPoint (aLine, bLine, aClosestPoint, bClosestPoint)) {
		return 'LinesIntersectsCoincident';
	}
	
	if (JSM.CoordIsEqual (aClosestPoint, bClosestPoint)) {
		if (intersection !== undefined) {
			intersection.Set (aClosestPoint.x, aClosestPoint.y, aClosestPoint.z);
		}
		return 'LinesIntersectsOnePoint';
	}
	
	return 'LinesDontIntersects';
}
