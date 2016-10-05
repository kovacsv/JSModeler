module.exports = function (unitTest)
{

var generalSuite = unitTest.AddTestSuite ('GeometryGeneral');

generalSuite.AddTest ('Vector2DTest', function (test) {
	var coord1 = new JSM.Coord2D (1.0, 0.0);
	var coord2 = new JSM.Coord2D (0.0, 1.0);
	test.Assert (JSM.CoordAdd2D (coord1, coord2).IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (JSM.IsEqual (coord1.DistanceTo (coord2), Math.sqrt (2.0)));
	test.Assert (JSM.MidCoord2D (coord1, coord2).IsEqual (new JSM.Coord2D (0.5, 0.5)));
	var coord3 = coord1.Clone ().MultiplyScalar (10);
	test.Assert (coord3.IsEqual (new JSM.Coord2D (10, 0)));
	test.Assert (JSM.IsEqual (coord3.Length (), 10.0));
	var coord4 = coord3.Clone ().Normalize ();
	test.Assert (coord3.IsEqual (new JSM.Coord2D (10, 0)));
	test.Assert (coord4.IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (JSM.IsEqual (coord4.Length (), 1.0));
	var coord5 = coord3.Clone ().SetLength (5);
	test.Assert (coord3.IsEqual (new JSM.Coord2D (10, 0)));
	test.Assert (coord5.IsEqual (new JSM.Coord2D (5, 0)));
	test.Assert (JSM.IsEqual (coord5.Length (), 5.0));
	var coord6 = coord1.Clone ().Offset (coord2, 3.0);
	test.Assert (coord1.IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (coord6.IsEqual (new JSM.Coord2D (1, 3)));
	var coord7 = coord3.Normalize ();
	test.Assert (coord3.IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (coord7.IsEqual (new JSM.Coord2D (1, 0)));
	
	var origo = new JSM.Coord2D (0.0, 0.0);
	var rotated = coord1.Clone ().Rotate (Math.PI / 2.0, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (0, 1)));
	var rotated = coord1.Clone ().Rotate (Math.PI, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (-1, 0)));
	var rotated = coord1.Clone ().Rotate (Math.PI * 3.0 / 2.0, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (0, -1)));
	var rotated = coord1.Clone ().Rotate (Math.PI * 2.0, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (1, 0)));

	var origo = new JSM.Coord2D (-1.0, 0.0);
	var rotated = coord1.Clone ().Rotate (Math.PI / 2.0, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (-1, 2)));
	var rotated = coord1.Clone ().Rotate (Math.PI, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (-3, 0)));
	var rotated = coord1.Clone ().Rotate (Math.PI * 3.0 / 2.0, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (-1, -2)));
	var rotated = coord1.Clone ().Rotate (Math.PI * 2.0, origo);
	test.Assert (rotated.IsEqual (new JSM.Coord2D (1, 0)));
});

generalSuite.AddTest ('VectorTest', function (test) {
	var coord2d1 = new JSM.Coord2D (1, 2);
	var coord2d2 = new JSM.Coord2D (3, 4);
	var coord2d3 = new JSM.Coord2D (1, 6);

	test.Assert (coord2d1.IsEqual (new JSM.Coord2D (1, 2)));
	test.Assert (JSM.MidCoord2D (coord2d1, coord2d2).IsEqual (new JSM.Coord2D (2, 3)));
	test.Assert (JSM.IsEqual (coord2d1.DistanceTo (coord2d2), 2.8284271247));
	test.Assert (JSM.CoordOrientation2D (coord2d1, coord2d2, coord2d3) == JSM.Orientation.CounterClockwise);

	var coord1 = new JSM.Coord (1, 2, 3);
	var coord2 = new JSM.Coord (4, 5, 6);

	test.Assert (coord1.IsEqual (new JSM.Coord (1, 2, 3)));
	test.Assert (JSM.MidCoord (coord1, coord2).IsEqual (new JSM.Coord (2.5, 3.5, 4.5)));
	test.Assert (coord1.Clone ().MultiplyScalar (3).IsEqual (new JSM.Coord (3, 6, 9)));
	test.Assert (JSM.IsEqual (JSM.VectorDot (coord1, coord2), 32));
	test.Assert (JSM.VectorCross (coord1, coord2).IsEqual (new JSM.Coord (-3, 6, -3)));
	test.Assert (JSM.IsEqual (coord1.Length (), 3.7416573867));
	test.Assert (coord1.Clone ().Normalize ().IsEqual (new JSM.Coord (0.2672612419, 0.5345224838, 0.8017837257)));
	test.Assert (JSM.IsEqual (coord1.Clone ().SetLength (123).Length (), 123));
	test.Assert (JSM.IsEqual (coord1.DistanceTo (coord2), 5.1961524227));
	test.Assert (JSM.CoordAdd (coord1, coord2).IsEqual (new JSM.Coord (5, 7, 9)));
	test.Assert (JSM.CoordSub (coord1, coord2).IsEqual (new JSM.Coord (-3, -3, -3)));
	test.Assert (coord2.Clone ().Offset (coord1, 5.0).IsEqual (new JSM.Coord (5.3363062095, 7.672612419, 10.0089186285)));
	
	test.Assert (coord1.Clone ().Offset (new JSM.Coord (1.0, 0.0, 0.0), 5.0).IsEqual (new JSM.Coord (6.0, 2.0, 3.0)));
	test.Assert (coord1.Clone ().Offset (new JSM.Coord (0.0, 1.0, 0.0), 5.0).IsEqual (new JSM.Coord (1.0, 7.0, 3.0)));
	test.Assert (coord1.Clone ().Offset (new JSM.Coord (0.0, 0.0, 1.0), 5.0).IsEqual (new JSM.Coord (1.0, 2.0, 8.0)));

	var coord = new JSM.Coord (1.0, 1.0, 1.0);
	var direction = new JSM.Vector (1.0, 0.0, 0.0);
	test.Assert (coord.Clone ().Offset (direction, 1.0).IsEqual (new JSM.Coord (2.0, 1.0, 1.0)));
	
	var coord = new JSM.Coord (1.0, 1.0, 1.0);
	var axis = new JSM.Vector (0.0, 0.0, 1.0);
	var origo = new JSM.Vector (0.0, 0.0, 0.0);
	var angle = 90.0 * JSM.DegRad;
	test.Assert (coord.Clone ().Rotate (axis, angle, origo).IsEqual (new JSM.Coord (-1.0, 1.0, 1.0)));

	var vector1 = new JSM.Vector2D (1.0, 0.0);
	var vector2 = new JSM.Vector2D (0.0, 1.0);
	test.Assert (JSM.IsEqual (vector1.AngleTo (vector2), 90.0 * JSM.DegRad));

	var vector1 = new JSM.Vector (1.0, 0.0, 0.0);
	var vector2 = new JSM.Vector (0.0, 1.0, 0.0);
	test.Assert (JSM.IsEqual (vector1.AngleTo (vector2), 90.0 * JSM.DegRad));

	var vector = new JSM.Vector (1.0, 0.0, 0.0);
	test.Assert (JSM.IsEqual (vector.Length (), 1.0));
	
	var vector = new JSM.Vector (1.0, 2.0, 3.0);
	var multiplied = vector.Clone ().MultiplyScalar (2.0);
	test.Assert (multiplied.IsEqual (new JSM.Coord (2.0, 4.0, 6.0)));
	
	var vector = new JSM.Vector (10.0, 0.0, 0.0);
	var normal = vector.Clone ().Normalize ();
	test.Assert (normal.IsEqual (new JSM.Coord (1.0, 0.0, 0.0)));
	
	var another = vector.Clone ().SetLength (5.0);
	test.Assert (another.IsEqual (new JSM.Coord (5.0, 0.0, 0.0)));

	var cartesian = JSM.SphericalToCartesian (1.0, 0.0, 90.0 * JSM.DegRad);
	test.Assert (cartesian.IsEqual (new JSM.Coord (0.0, 0.0, 1.0)));

	var cartesian = JSM.CylindricalToCartesian (1.0, 1.0, 90.0 * JSM.DegRad);
	test.Assert (cartesian.IsEqual (new JSM.Coord (0.0, 1.0, 1.0)));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	var normal = new JSM.Coord (0.0, 1.0, 0.0);
	var coord2D = coord.ToCoord2D (normal);
	test.Assert (coord.IsEqual (new JSM.Coord (1.0, 2.0, 3.0)));
	test.Assert (coord2D.IsEqual (new JSM.Coord2D (1.0, -3.0)));

	var coords = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	var normal = JSM.CalculateNormal (coords);
	test.Assert (normal.IsEqual (new JSM.Coord (0.0, 0.0, 1.0)));
	var centroid = JSM.CalculateCentroid (coords);
	test.Assert (centroid.IsEqual (new JSM.Coord (0.5, 0.5, 0.0)));
	
	var coords2 = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	var normal2 = JSM.CalculateNormal (coords2);
	test.Assert (normal2.IsEqual (new JSM.Coord (0.0, 0.0, 1.0)));
	var centroid2 = JSM.CalculateCentroid (coords2);
	test.Assert (centroid2.IsEqual (new JSM.Coord (0.5, 0.5, 0.0)));

	var coords3 = [
		new JSM.Coord (0.0, 1.0, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.0, 0.0, 0.0)
	];
	var normal3 = JSM.CalculateNormal (coords3);
	test.Assert (normal3.IsEqual (new JSM.Coord (0.0, 0.0, -1.0)));
	var centroid3 = JSM.CalculateCentroid (coords3);
	test.Assert (centroid3.IsEqual (new JSM.Coord (0.3, 0.5, 0.0)));

	var vector1 = new JSM.Vector2D (1.0, 0.0);
	var vector2 = new JSM.Vector2D (0.0, 1.0);
	test.Assert (JSM.IsEqual (vector1.AngleTo (vector2), Math.PI / 2.0));
	test.Assert (JSM.IsEqual (vector2.AngleTo (vector1), Math.PI / 2.0));

	var vector1 = new JSM.Vector (1.0, 0.0, 0.0);
	var vector2 = new JSM.Vector (0.0, 1.0, 0.0);
	test.Assert (JSM.IsEqual (vector1.AngleTo (vector2), Math.PI / 2.0));
	test.Assert (JSM.IsEqual (vector2.AngleTo (vector1), Math.PI / 2.0));

	var coord1 = new JSM.Vector (0.0, 0.0, 0.0);
	var coord2 = new JSM.Vector (1.0, 0.0, 0.0);
	var coord3 = new JSM.Vector (0.0, 1.0, 0.0);
	var normal1 = new JSM.Vector (0.0, 0.0, 1.0);
	var normal2 = new JSM.Vector (0.0, 0.0, -1.0);
	var normal3 = new JSM.Vector (0.0, -1.0, -1.0);

	test.Assert (JSM.CoordOrientation (coord1, coord2, coord3, normal1) == JSM.Orientation.CounterClockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord2, normal1) == JSM.Orientation.Clockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord3, normal1) == JSM.Orientation.Invalid);

	test.Assert (JSM.CoordOrientation (coord1, coord2, coord3, normal2) == JSM.Orientation.Clockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord2, normal2) == JSM.Orientation.CounterClockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord3, normal2) == JSM.Orientation.Invalid);

	test.Assert (JSM.CoordOrientation (coord1, coord2, coord3, normal3) == JSM.Orientation.Clockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord2, normal3) == JSM.Orientation.CounterClockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord3, normal3) == JSM.Orientation.Invalid);

	var coord1 = new JSM.Vector (0.0, 0.0, 0.0);
	var coord2 = new JSM.Vector (1.0, 0.0, 0.0);
	var coord3 = new JSM.Vector (0.0, 0.0, 1.0);
	var normal1 = new JSM.Vector (0.0, 1.0, 0.0);
	var normal2 = new JSM.Vector (0.0, -1.0, 0.0);

	test.Assert (JSM.CoordOrientation (coord1, coord2, coord3, normal2) == JSM.Orientation.CounterClockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord2, normal2) == JSM.Orientation.Clockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord3, normal2) == JSM.Orientation.Invalid);

	test.Assert (JSM.CoordOrientation (coord1, coord2, coord3, normal1) == JSM.Orientation.Clockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord2, normal1) == JSM.Orientation.CounterClockwise);
	test.Assert (JSM.CoordOrientation (coord1, coord3, coord3, normal1) == JSM.Orientation.Invalid);
	
	var coord1 = new JSM.Vector2D (0.0, 0.0);
	var coord2 = new JSM.Vector2D (1.0, 0.0);
	var coord3 = new JSM.Vector2D (-1.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.CoordSignedDistance2D (coord1, coord2, JSM.CoordSub2D (coord2, coord1)), 1.0));
	test.Assert (JSM.IsEqual (JSM.CoordSignedDistance2D (coord1, coord3, JSM.CoordSub2D (coord1, coord3)), -1.0));

	var coord1 = new JSM.Vector (0.0, 0.0, 0.0);
	var coord2 = new JSM.Vector (1.0, 0.0, 0.0);
	var coord3 = new JSM.Vector (-1.0, 0.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.CoordSignedDistance (coord1, coord2, JSM.CoordSub (coord2, coord1)), 1.0));
	test.Assert (JSM.IsEqual (JSM.CoordSignedDistance (coord1, coord3, JSM.CoordSub (coord1, coord3)), -1.0));
	
	var coord = new JSM.Coord2D (1.0, 2.0);
	test.Assert (!coord.IsEqualWithEps (new JSM.Coord2D (1.0, 3.0), 0.1));
	test.Assert (!coord.IsEqualWithEps (new JSM.Coord2D (2.0, 2.0), 0.1));
	test.Assert (coord.IsEqualWithEps (new JSM.Coord2D (1.0, 3.0), 1.1));
	test.Assert (coord.IsEqualWithEps (new JSM.Coord2D (2.0, 2.0), 1.1));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	test.Assert (!coord.IsEqualWithEps (new JSM.Coord (1.0, 2.0, 4.0), 0.1));
	test.Assert (!coord.IsEqualWithEps (new JSM.Coord (1.0, 3.0, 3.0), 0.1));
	test.Assert (!coord.IsEqualWithEps (new JSM.Coord (2.0, 2.0, 3.0), 0.1));
	test.Assert (coord.IsEqualWithEps (new JSM.Coord (1.0, 2.0, 4.0), 1.1));
	test.Assert (coord.IsEqualWithEps (new JSM.Coord (1.0, 3.0, 3.0), 1.1));
	test.Assert (coord.IsEqualWithEps (new JSM.Coord (2.0, 2.0, 3.0), 1.1));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	coord.Add (new JSM.Coord (4.0, 5.0, 6.0));
	test.Assert (coord.IsEqual (new JSM.Coord (5.0, 7.0, 9.0)));
	coord.Sub (new JSM.Coord (4.0, 5.0, 6.0));
	test.Assert (coord.IsEqual (new JSM.Coord (1.0, 2.0, 3.0)));
	
	var coord = new JSM.Coord (1.0, 0.0, 0.0);
	
	test.Assert (coord.IsCollinearWith (new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (coord.IsCollinearWith (new JSM.Coord (2.0, 0.0, 0.0)));
	test.Assert (coord.IsCollinearWith (new JSM.Coord (-1.0, 0.0, 0.0)));
	test.Assert (coord.IsCollinearWith (new JSM.Coord (-2.0, 0.0, 0.0)));
	test.Assert (!coord.IsCollinearWith (new JSM.Coord (1.0, 0.1, 0.0)));
	test.Assert (!coord.IsCollinearWith (new JSM.Coord (2.0, 0.1, 0.0)));
	test.Assert (!coord.IsCollinearWith (new JSM.Coord (-1.0, 0.1, 0.0)));
	test.Assert (!coord.IsCollinearWith (new JSM.Coord (-2.0, 0.1, 0.0)));
	
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, 2.0, 0.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, 0.0, 2.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, -1.0, 0.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, 0.0, -1.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, -2.0, 0.0)));
	test.Assert (coord.IsPerpendicularWith (new JSM.Coord (0.0, 0.0, -2.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, 1.0, 0.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, 0.0, 1.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, 2.0, 0.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, 0.0, 2.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, -1.0, 0.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, 0.0, -1.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, -2.0, 0.0)));
	test.Assert (!coord.IsPerpendicularWith (new JSM.Coord (0.1, 0.0, -2.0)));
});

generalSuite.AddTest ('TriangleNormalTest', function (test) {
	test.Assert (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 0.0)).IsEqual (new JSM.Vector (0.0, 0.0, 1.0)));
	test.Assert (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, -1.0, 0.0)).IsEqual (new JSM.Vector (0.0, 0.0, -1.0)));
	
	test.Assert (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 1.0, 1.0)).IsEqual (new JSM.Vector (1.0, 0.0, 0.0)));
	test.Assert (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 1.0, -1.0)).IsEqual (new JSM.Vector (-1.0, 0.0, 0.0)));

	test.Assert (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, -1.0)).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)));
	test.Assert (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 1.0)).IsEqual (new JSM.Vector (0.0, -1.0, 0.0)));
});

generalSuite.AddTest ('BarycentricInterpolation', function (test) {
	var vertex0 = new JSM.Coord (0, 0, 0);
	var vertex1 = new JSM.Coord (1, 0, 0);
	var vertex2 = new JSM.Coord (1, 1, 0);
	var value0 = new JSM.Coord (0, 0, 0);
	var value1 = new JSM.Coord (1, 0, 0);
	var value2 = new JSM.Coord (1, 1, 0);

	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (0, 0, 0));
	test.Assert (result.IsEqual (new JSM.Coord (0, 0, 0)));
	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (0.6, 0.4, 0));
	test.Assert (result.IsEqual (new JSM.Coord (0.6, 0.4, 0)));

	var value0 = new JSM.Coord (1, 1, 1);
	var value1 = new JSM.Coord (5, 5, 5);
	var value2 = new JSM.Coord (100, 100, 100);
	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (0, 0, 0));
	test.Assert (result.IsEqual (new JSM.Coord (1, 1, 1)));
	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (1, 0, 0));
	test.Assert (result.IsEqual (new JSM.Coord (5, 5, 5)));
	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (1, 1, 0));
	test.Assert (result.IsEqual (new JSM.Coord (100, 100, 100)));
	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (0.5, 0.5, 0));
	test.Assert (result.IsEqual (new JSM.Coord (50.5, 50.5, 50.5)));
	var result = JSM.BarycentricInterpolation (vertex0, vertex1, vertex2, value0, value1, value2, new JSM.Coord (0.8, 0.8, 0));
	test.Assert (result.IsEqual (new JSM.Coord (80.2, 80.2, 80.2)));
});

generalSuite.AddTest ('CircleTest', function (test) {
	test.Assert (JSM.PolarToCartesian (1.0, 0.0 * JSM.DegRad).IsEqual (new JSM.Coord2D (1.0, 0.0)));
	test.Assert (JSM.PolarToCartesian (1.0, 90.0 * JSM.DegRad).IsEqual (new JSM.Coord2D (0.0, 1.0)));
	test.Assert (JSM.PolarToCartesian (1.0, 180.0 * JSM.DegRad).IsEqual (new JSM.Coord2D (-1.0, 0.0)));
	test.Assert (JSM.PolarToCartesian (1.0, 270.0 * JSM.DegRad).IsEqual (new JSM.Coord2D (0.0, -1.0)));
	test.Assert (JSM.PolarToCartesian (1.0, 360.0 * JSM.DegRad).IsEqual (new JSM.Coord2D (1.0, 0.0)));
	test.Assert (JSM.PolarToCartesian (1.0, 450.0 * JSM.DegRad).IsEqual (new JSM.Coord2D (0.0, 1.0)));
	
	var unitRadius = 2.0 * 1.0 * Math.PI;
	test.Assert (JSM.IsEqual (JSM.GetArcLengthFromAngle (1.0, 0.0 * JSM.DegRad), 0.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLengthFromAngle (1.0, 90.0 * JSM.DegRad), unitRadius / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLengthFromAngle (1.0, 180.0 * JSM.DegRad), unitRadius / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLengthFromAngle (1.0, 270.0 * JSM.DegRad), 3.0 * unitRadius / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLengthFromAngle (1.0, 360.0 * JSM.DegRad), unitRadius));
	test.Assert (JSM.IsEqual (JSM.GetArcLengthFromAngle (1.0, 450.0 * JSM.DegRad), 5.0 * unitRadius / 4.0));
	
	test.Assert (JSM.IsEqual (JSM.GetAngleFromArcLength (1.0, 0.0), 0.0 * JSM.DegRad));
	test.Assert (JSM.IsEqual (JSM.GetAngleFromArcLength (1.0, unitRadius / 4.0), 90.0 * JSM.DegRad));
	test.Assert (JSM.IsEqual (JSM.GetAngleFromArcLength (1.0, unitRadius / 2.0), 180.0 * JSM.DegRad));
	test.Assert (JSM.IsEqual (JSM.GetAngleFromArcLength (1.0, 3.0 * unitRadius / 4.0), 270.0 * JSM.DegRad));
	test.Assert (JSM.IsEqual (JSM.GetAngleFromArcLength (1.0, unitRadius), 360.0 * JSM.DegRad));
	test.Assert (JSM.IsEqual (JSM.GetAngleFromArcLength (1.0, 5.0 * unitRadius / 4.0), 450.0 * JSM.DegRad));
});

generalSuite.AddTest ('MatrixTest', function (test) {
	var vector1 = [1, 2, 3, 4];
	var matrix1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
	var matrix2 = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
	
	var a = JSM.MatrixVectorMultiply (matrix1, JSM.MatrixVectorMultiply (matrix2, vector1));
	var b = JSM.MatrixVectorMultiply (JSM.MatrixMultiply (matrix2, matrix1), vector1);
	test.Assert (a.toString () == b.toString ());
	
	var vector2 = JSM.MatrixVectorMultiply (matrix1, vector1);
	var matrix3 = JSM.MatrixMultiply (matrix1, matrix2);
	
	test.Assert (vector2[0] == 90);
	test.Assert (vector2[1] == 100);
	test.Assert (vector2[2] == 110);
	test.Assert (vector2[3] == 120);

	test.Assert (matrix3[0] == 250);
	test.Assert (matrix3[1] == 260);
	test.Assert (matrix3[2] == 270);
	test.Assert (matrix3[3] == 280);
	test.Assert (matrix3[4] == 618);
	test.Assert (matrix3[5] == 644);
	test.Assert (matrix3[6] == 670);
	test.Assert (matrix3[7] == 696);
	test.Assert (matrix3[8] == 986);
	test.Assert (matrix3[9] == 1028);
	test.Assert (matrix3[10] == 1070);
	test.Assert (matrix3[11] == 1112);
	test.Assert (matrix3[12] == 1354);
	test.Assert (matrix3[13] == 1412);
	test.Assert (matrix3[14] == 1470);
	test.Assert (matrix3[15] == 1528);
	
	var vector = [1, 1, 1, 0];
	var rotX = JSM.MatrixRotationX (90 * JSM.DegRad);
	var rotXVec = JSM.MatrixVectorMultiply (rotX, vector);
	var rotXVec2 = JSM.ApplyTransformation (rotX, JSM.CoordFromArray (vector));
	var rotY = JSM.MatrixRotationY (90 * JSM.DegRad);
	var rotYVec = JSM.MatrixVectorMultiply (rotY, vector);
	var rotYVec2 = JSM.ApplyTransformation (rotY, JSM.CoordFromArray (vector));
	var rotZ = JSM.MatrixRotationZ (90 * JSM.DegRad);
	var rotZVec = JSM.MatrixVectorMultiply (rotZ, vector);
	var rotZVec2 = JSM.ApplyTransformation (rotZ, JSM.CoordFromArray (vector));

	test.Assert (JSM.IsEqual (rotXVec[0], 1.0));
	test.Assert (JSM.IsEqual (rotXVec[1], -1.0));
	test.Assert (JSM.IsEqual (rotXVec[2], 1.0));
	test.Assert (JSM.IsEqual (rotXVec[3], 0.0));

	test.Assert (JSM.IsEqual (rotXVec2.x, 1.0));
	test.Assert (JSM.IsEqual (rotXVec2.y, -1.0));
	test.Assert (JSM.IsEqual (rotXVec2.z, 1.0));

	test.Assert (JSM.IsEqual (rotYVec[0], 1.0));
	test.Assert (JSM.IsEqual (rotYVec[1], 1.0));
	test.Assert (JSM.IsEqual (rotYVec[2], -1.0));
	test.Assert (JSM.IsEqual (rotYVec[3], 0.0));

	test.Assert (JSM.IsEqual (rotYVec2.x, 1.0));
	test.Assert (JSM.IsEqual (rotYVec2.y, 1.0));
	test.Assert (JSM.IsEqual (rotYVec2.z, -1.0));

	test.Assert (JSM.IsEqual (rotZVec[0], -1.0));
	test.Assert (JSM.IsEqual (rotZVec[1], 1.0));
	test.Assert (JSM.IsEqual (rotZVec[2], 1.0));
	test.Assert (JSM.IsEqual (rotZVec[3], 0.0));

	test.Assert (JSM.IsEqual (rotZVec2.x, -1.0));
	test.Assert (JSM.IsEqual (rotZVec2.y, 1.0));
	test.Assert (JSM.IsEqual (rotZVec2.z, 1.0));
	
	var matrix = [
		1, 0, 0, 1,
		0, 2, 1, 2,
		2, 1, 0, 1,
		2, 0, 1, 4
	];
	
	var inverse = JSM.MatrixInvert (matrix);
	test.Assert (inverse.toString () == [
		-2, -0.5, 1, 0.5,
		1, 0.5, 0, -0.5,
		-8, -1, 2, 2,
		3, 0.5, -1, -0.5
	].toString ());
	
	var transposed = JSM.MatrixTranspose (matrix1);
	test.Assert ([
		1, 5, 9, 13,
		2, 6, 10, 14,
		3, 7, 11, 15,
		4, 8, 12, 16
	].toString () == transposed.toString ());
});

generalSuite.AddTest ('ArcLengthTest', function (test) {
	var a1 = new JSM.Vector (0.0, 1.0, 0.0);
	var a2 = new JSM.Vector (0.0, -1.0, 0.0);
	var a3 = new JSM.Vector (-1.0, 0.0, 0.0);
	var a4 = new JSM.Vector (1.0, 1.0, 0.0);
	var a5 = new JSM.Vector (1.0, -1.0, 0.0);
	
	var b1 = new JSM.Vector (1.0, 0.0, 0.0);
	
	var radius1 = 1.0;
	var radius2 = 2.0;
	
	var circ1 = 2.0 * radius1 * Math.PI;
	var circ2 = 2.0 * radius2 * Math.PI;
	
	var normal1 = new JSM.Vector (0.0, 0.0, 1.0);
	var normal2 = new JSM.Vector (0.0, 0.0, -1.0);
	
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a1, a1, radius1), 0.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a1, b1, radius1), circ1 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a2, b1, radius1), circ1 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a3, b1, radius1), circ1 / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a4, b1, radius1), circ1 / 8.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a5, b1, radius1), circ1 / 8.0));

	test.Assert (JSM.IsEqual (JSM.GetArcLength (a1, a1, radius2), 0.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a1, b1, radius2), circ2 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a2, b1, radius2), circ2 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a3, b1, radius2), circ2 / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a4, b1, radius2), circ2 / 8.0));
	test.Assert (JSM.IsEqual (JSM.GetArcLength (a5, b1, radius2), circ2 / 8.0));
	
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a1, b1, radius1, normal1), circ1 * 1.0 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a2, b1, radius1, normal1), circ1 * 3.0 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a3, b1, radius1, normal1), circ1 / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a4, b1, radius1, normal1), circ1 * 1.0 / 8.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a5, b1, radius1, normal1), circ1 * 7.0 / 8.0));

	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a1, b1, radius2, normal1), circ2 * 1.0 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a2, b1, radius2, normal1), circ2 * 3.0 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a3, b1, radius2, normal1), circ2 / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a4, b1, radius2, normal1), circ2 * 1.0 / 8.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a5, b1, radius2, normal1), circ2 * 7.0 / 8.0));

	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a1, b1, radius2, normal2), circ2 * 3.0 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a2, b1, radius2, normal2), circ2 * 1.0 / 4.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a3, b1, radius2, normal2), circ2 / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a4, b1, radius2, normal2), circ2 * 7.0 / 8.0));
	test.Assert (JSM.IsEqual (JSM.GetFullArcLength (a5, b1, radius2, normal2), circ2 * 1.0 / 8.0));

	var v1 = new JSM.Vector (1.0, 0.0, 0.0);
	var v2 = new JSM.Vector (1.0, 0.0, 0.0);
	var normal = new JSM.Vector (0.0, 0.0, 1.0);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.GetVectorsFullAngle (v1, v2, normal), 0.0));
	for (var i = 0.0; i < Math.PI; i = i + 5.0 * JSM.DegRad) {
		test.Assert (JSM.IsEqual (JSM.GetVectorsFullAngle (v1.Clone ().Rotate (normal, i, origo), v2, normal), i));
	}
});

generalSuite.AddTest ('TransformationTest', function (test) {
	var transformation = new JSM.IdentityTransformation ();
	
	var coord = new JSM.Coord (1.0, 1.0, 1.0);
	var direction = new JSM.Vector (1.0, 0.0, 0.0);
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (1.0, 1.0, 1.0)));

	transformation = JSM.OffsetTransformation (direction, 1.0);
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (2.0, 1.0, 1.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (1.0, 2.0, 3.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (2.0, 3.0, 4.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (1.0, 0.0, 0.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (2.0, 1.0, 1.0)));
	transformation = JSM.TranslationTransformation (new JSM.Coord (-1.0, 0.0, 0.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (0.0, 1.0, 1.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, 1.0, 0.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (1.0, 2.0, 1.0)));
	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, -1.0, 0.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (1.0, 0.0, 1.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, 0.0, 1.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (1.0, 1.0, 2.0)));
	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, 0.0, -1.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (1.0, 1.0, 0.0)));

	var axis = new JSM.Vector (0.0, 0.0, 1.0);
	var angle = 90.0 * JSM.DegRad;
	transformation = JSM.RotationTransformation (axis, angle);
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (-1.0, 1.0, 1.0)));
	transformation = JSM.RotationZTransformation (angle);
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (-1.0, 1.0, 1.0)));
	
	var trX = new JSM.RotationXTransformation (angle);
	var trY = new JSM.RotationYTransformation (angle);
	var trZ = new JSM.RotationZTransformation (angle);
	
	var axisX = new JSM.Vector (1.0, 0.0, 0.0);
	var axisY = new JSM.Vector (0.0, 1.0, 0.0);
	var axisZ = new JSM.Vector (0.0, 0.0, 1.0);
	
	var trRotX = new JSM.RotationTransformation (axisX, angle);
	var trRotY = new JSM.RotationTransformation (axisY, angle);
	var trRotZ = new JSM.RotationTransformation (axisZ, angle);

	test.Assert (trX.Apply (coord).IsEqual (trRotX.Apply (coord)));
	test.Assert (trY.Apply (coord).IsEqual (trRotY.Apply (coord)));
	test.Assert (trZ.Apply (coord).IsEqual (trRotZ.Apply (coord)));

	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	trRotX = new JSM.RotationTransformation (axisX, angle, origo);
	trRotY = new JSM.RotationTransformation (axisY, angle, origo);
	trRotZ = new JSM.RotationTransformation (axisZ, angle, origo);

	test.Assert (trX.Apply (coord).IsEqual (trRotX.Apply (coord)));
	test.Assert (trY.Apply (coord).IsEqual (trRotY.Apply (coord)));
	test.Assert (trZ.Apply (coord).IsEqual (trRotZ.Apply (coord)));

	var origo = new JSM.Coord (1.0, 2.0, 3.0);
	var trXOrigo = new JSM.RotationXTransformation (angle, origo);
	var trYOrigo = new JSM.RotationYTransformation (angle, origo);
	var trZOrigo = new JSM.RotationZTransformation (angle, origo);

	var trRotXOrigo = new JSM.RotationTransformation (axisX, angle, origo);
	var trRotYOrigo = new JSM.RotationTransformation (axisY, angle, origo);
	var trRotZOrigo = new JSM.RotationTransformation (axisZ, angle, origo);

	test.Assert (trXOrigo.Apply (coord).IsEqual (trRotXOrigo.Apply (coord)));
	test.Assert (trYOrigo.Apply (coord).IsEqual (trRotYOrigo.Apply (coord)));
	test.Assert (trZOrigo.Apply (coord).IsEqual (trRotZOrigo.Apply (coord)));

	var coord = new JSM.Coord (2.0, 0.0, 0.0);
	transformation = new JSM.RotationZTransformation (90.0 * JSM.DegRad, new JSM.Coord (0.0, 0.0, 0.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (0.0, 2.0, 0.0)));
	transformation = new JSM.RotationZTransformation (90.0 * JSM.DegRad, new JSM.Coord (1.0, 0.0, 0.0));
	test.Assert (transformation.Apply (coord).IsEqual (new JSM.Coord (1.0, 1.0, 0.0)));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	var axis = new JSM.Vector (4.0, 5.0, 6.0);
	var angle = 7.0 * JSM.DegRad;
	var origo = new JSM.Coord (8.0, 9.0, 10.0);
	transformation = new JSM.RotationTransformation (axis, angle, origo);
	test.Assert (coord.Clone ().Rotate (axis, angle, origo).IsEqual (transformation.Apply (coord)));
	
	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	var direction = new JSM.Coord (4.0, 5.0, 6.0);
	var axis = new JSM.Vector (4.0, 5.0, 6.0);
	var angle = 7.0 * JSM.DegRad;
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var result1 = coord.Clone ();
	result1.Offset (direction, 11.0);
	result1.Rotate (axis, angle, origo);
	
	var offsetTransformation = new JSM.OffsetTransformation (direction, 11.0);
	var rotateTransformation = new JSM.RotationTransformation (axis, angle, origo);
	
	var transformation = new JSM.Transformation ();
	transformation.Append (offsetTransformation);
	transformation.Append (rotateTransformation);
	
	var result2 = transformation.Apply (coord);
	test.Assert (result1.IsEqual (result2));

	var trX = new JSM.RotationXTransformation (10 * JSM.DegRad);
	var trY = new JSM.RotationYTransformation (20 * JSM.DegRad);
	var trZ = new JSM.RotationZTransformation (30 * JSM.DegRad);
	var trXYZ = new JSM.RotationXYZTransformation (10 * JSM.DegRad, 20 * JSM.DegRad, 30 * JSM.DegRad);
	
	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	coord = trX.Apply (coord);
	coord = trY.Apply (coord);
	coord = trZ.Apply (coord);
	
	test.Assert (trXYZ.Apply (new JSM.Coord (1.0, 2.0, 3.0)).IsEqual (coord));
});

generalSuite.AddTest ('SectorTest', function (test) {
	var beg = new JSM.Coord2D (1.0, 2.0);
	var end = new JSM.Coord2D (3.0, 4.0);
	
	var sector = new JSM.Sector2D (beg, end);
	test.Assert (sector.beg.IsEqual (new JSM.Coord2D (1.0, 2.0)));
	test.Assert (sector.end.IsEqual (new JSM.Coord2D (3.0, 4.0)));
	
	sector.Set (end, beg);
	test.Assert (sector.beg.IsEqual (new JSM.Coord2D (3.0, 4.0)));
	test.Assert (sector.end.IsEqual (new JSM.Coord2D (1.0, 2.0)));

	var beg = new JSM.Coord (1.0, 2.0, 3.0);
	var end = new JSM.Coord (4.0, 5.0, 6.0);
	
	var sector = new JSM.Sector (beg, end);
	test.Assert (sector.beg.IsEqual (new JSM.Coord (1.0, 2.0, 3.0)));
	test.Assert (sector.end.IsEqual (new JSM.Coord (4.0, 5.0, 6.0)));
	
	sector.Set (end, beg);
	test.Assert (sector.beg.IsEqual (new JSM.Coord (4.0, 5.0, 6.0)));
	test.Assert (sector.end.IsEqual (new JSM.Coord (1.0, 2.0, 3.0)));
});

generalSuite.AddTest ('SectorSegmentationTest', function (test) {
	var sector = new JSM.Sector2D (new JSM.Coord2D (0.0, 0.0), new JSM.Coord2D (2.0, 0.0));
	var segmentedCoords = JSM.GetSectorSegmentation2D (sector, 2, segmentedCoords);
	test.Assert (segmentedCoords.length == 3);
	test.Assert (segmentedCoords[0].IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (segmentedCoords[1].IsEqual (new JSM.Coord2D (1.0, 0.0)));
	test.Assert (segmentedCoords[2].IsEqual (new JSM.Coord2D (2.0, 0.0)));

	var segmentedCoords = JSM.GetSectorSegmentation2D (sector, 4, segmentedCoords);
	test.Assert (segmentedCoords.length == 5);
	test.Assert (segmentedCoords[0].IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (segmentedCoords[1].IsEqual (new JSM.Coord2D (0.5, 0.0)));
	test.Assert (segmentedCoords[2].IsEqual (new JSM.Coord2D (1.0, 0.0)));
	test.Assert (segmentedCoords[3].IsEqual (new JSM.Coord2D (1.5, 0.0)));
	test.Assert (segmentedCoords[4].IsEqual (new JSM.Coord2D (2.0, 0.0)));

	var sector = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (2.0, 0.0, 0.0));
	var segmentedCoords = JSM.GetSectorSegmentation (sector, 2, segmentedCoords);
	test.Assert (segmentedCoords.length == 3);
	test.Assert (segmentedCoords[0].IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (segmentedCoords[1].IsEqual (new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (segmentedCoords[2].IsEqual (new JSM.Coord (2.0, 0.0, 0.0)));
});

generalSuite.AddTest ('CoordLinePositionTest', function (test)
{
	var start2D = new JSM.Coord2D (1.0, 1.0);
	var direction2D = new JSM.Coord2D (1.0, 0.0);
	var line2D = new JSM.Line2D (start2D, direction2D);
	test.Assert (line2D.CoordPosition (new JSM.Coord2D (0.0, 0.0)) == JSM.CoordLinePosition2D.CoordAtLineRight);
	test.Assert (line2D.CoordPosition (new JSM.Coord2D (0.0, -1.0)) == JSM.CoordLinePosition2D.CoordAtLineRight);
	test.Assert (line2D.CoordPosition (new JSM.Coord2D (0.0, 2.0)) == JSM.CoordLinePosition2D.CoordAtLineLeft);
	test.Assert (line2D.CoordPosition (new JSM.Coord2D (0.0, 3.0)) == JSM.CoordLinePosition2D.CoordAtLineLeft);
	test.Assert (line2D.CoordPosition (new JSM.Coord2D (0.0, 1.0)) == JSM.CoordLinePosition2D.CoordOnLine);
	
	var start = new JSM.Coord (1.0, 1.0, 1.0);
	var direction = new JSM.Coord (1.0, 0.0, 0.0);
	var line = new JSM.Line (start, direction);

	var projected = new JSM.Coord (0.0, 0.0, 0.0);
	test.Assert (line.CoordPosition (new JSM.Coord (0.0, 0.0, 0.0), projected) == JSM.CoordLinePosition.CoordOutsideOfLine);
	test.Assert (projected.IsEqual (new JSM.Coord (0.0, 1.0, 1.0)));
	test.Assert (line.CoordPosition (new JSM.Coord (1.0, 1.0, 1.0), projected) == JSM.CoordLinePosition.CoordOnLine);
	test.Assert (projected.IsEqual (new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (line.CoordPosition (new JSM.Coord (2.0, 1.0, 1.0), projected) == JSM.CoordLinePosition.CoordOnLine);
	test.Assert (projected.IsEqual (new JSM.Coord (2.0, 1.0, 1.0)));

	test.Assert (line.ProjectCoord (new JSM.Coord (0.0, 0.0, 0.0)).IsEqual (new JSM.Coord (0.0, 1.0, 1.0)));
	test.Assert (line.ProjectCoord (new JSM.Coord (1.0, 1.0, 1.0)).IsEqual (new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (line.ProjectCoord (new JSM.Coord (2.0, 1.0, 1.0)).IsEqual (new JSM.Coord (2.0, 1.0, 1.0)));
});

generalSuite.AddTest ('LineLinePosition2DTest', function (test)
{	
	var line1 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (1.0, 0.0));
	var line1b = new JSM.Line2D (new JSM.Coord2D (2.0, 0.0), new JSM.Vector2D (10.0, 0.0));
	var line1c = new JSM.Line2D (new JSM.Coord2D (2.0, 0.0), new JSM.Vector2D (-10.0, 0.0));
	var line1d = new JSM.Line2D (new JSM.Coord2D (-2.0, 0.0), new JSM.Vector2D (10.0, 0.0));
	var line1e = new JSM.Line2D (new JSM.Coord2D (-2.0, 0.0), new JSM.Vector2D (-10.0, 0.0));
	var line1f = new JSM.Line2D (new JSM.Coord2D (0.5, 0.0), new JSM.Vector2D (1.0, 0.0));
	var line1g = new JSM.Line2D (new JSM.Coord2D (0.5, 0.0), new JSM.Vector2D (-1.0, 0.0));
	var line2 = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (1.0, 0.0));
	var line3 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line4 = new JSM.Line2D (new JSM.Coord2D (1.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line5 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (1.0, 1.0));
	var line5b = new JSM.Line2D (new JSM.Coord2D (1.0, 1.0), new JSM.Vector2D (1.0, 1.0));
	var line5c = new JSM.Line2D (new JSM.Coord2D (10.0, 10.0), new JSM.Vector2D (100.0, 100.0));
	var line6 = new JSM.Line2D (new JSM.Coord2D (1.0, 0.0), new JSM.Vector2D (-1.0, 1.0));
	var line6b = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (-1.0, 1.0));
	var line6c = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (-10.0, 10.0));
	
	var line7 = new JSM.Line2D (new JSM.Coord2D (1.0, 1.0), new JSM.Vector2D (1.0, 0.0));
	var line8 = new JSM.Line2D (new JSM.Coord2D (6.0, 6.0), new JSM.Vector2D (0.0, 1.0));
	
	var intersection = new JSM.Coord2D (0.0, 0.0);
	
	test.Assert (line1.LinePosition (line1, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line1b, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line1c, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line1d, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line1e, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line1f, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line1g, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);

	test.Assert (line5.LinePosition (line5, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line5.LinePosition (line5b, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line5.LinePosition (line5c, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);

	test.Assert (line6.LinePosition (line6, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line6.LinePosition (line6b, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);
	test.Assert (line6.LinePosition (line6c, intersection) == JSM.LineLinePosition2D.LinesIntersectsCoincident);

	test.Assert (line2.LinePosition (line1, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line2.LinePosition (line1b, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line2.LinePosition (line1c, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line2.LinePosition (line1d, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line2.LinePosition (line1e, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line2.LinePosition (line1f, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line2.LinePosition (line1g, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);

	test.Assert (line1.LinePosition (line2, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line1b.LinePosition (line2, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	test.Assert (line1c.LinePosition (line2, intersection) == JSM.LineLinePosition2D.LinesDontIntersect);
	
	test.Assert (line1.LinePosition (line3, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (line1.LinePosition (line4, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (1.0, 0.0)));
	
	test.Assert (line3.LinePosition (line1, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (line4.LinePosition (line1, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (1.0, 0.0)));

	test.Assert (line1.LinePosition (line5, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (line1.LinePosition (line6, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (1.0, 0.0)));

	test.Assert (line2.LinePosition (line5, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (1.0, 1.0)));
	test.Assert (line2.LinePosition (line6, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.0, 1.0)));

	test.Assert (line3.LinePosition (line5, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (line3.LinePosition (line6, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.0, 1.0)));

	test.Assert (line5.LinePosition (line6, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.5, 0.5)));
	test.Assert (line5.LinePosition (line6b, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.5, 0.5)));
	test.Assert (line5.LinePosition (line6c, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.5, 0.5)));
	
	test.Assert (line6.LinePosition (line5, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.5, 0.5)));
	test.Assert (line6.LinePosition (line5b, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.5, 0.5)));
	test.Assert (line6.LinePosition (line5c, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (0.5, 0.5)));

	test.Assert (line7.LinePosition (line8, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (6.0, 1.0)));
	test.Assert (line8.LinePosition (line7, intersection) == JSM.LineLinePosition2D.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (6.0, 1.0)));
});

generalSuite.AddTest ('LineLinePositionTest', function (test)
{	
	var line1 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0));
	var line2 = new JSM.Line (new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0));
	var line3 = new JSM.Line (new JSM.Coord (0.0, 0.5, 0.0), new JSM.Coord (0.0, 1.0, 0.0));
	var line4 = new JSM.Line (new JSM.Coord (2.0, 3.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0));
	var line5 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 0.0));
	var line6 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	var line7 = new JSM.Line (new JSM.Coord (0.0, 0.0, 1.0), new JSM.Coord (1.0, 0.0, 0.0));
	var line8 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 1.0));
	var line9 = new JSM.Line (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (-1.0, 1.0, 1.0));
	
	var intersection = new JSM.Coord (0.0, 0.0, 0.0);
	test.Assert (line1.LinePosition (line1, intersection) == JSM.LineLinePosition.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line2, intersection) == JSM.LineLinePosition.LinesIntersectsCoincident);
	test.Assert (line1.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesIntersectsCoincident);
	test.Assert (line2.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesIntersectsCoincident);
	test.Assert (line3.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesDontIntersect);
	test.Assert (line4.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesDontIntersect);
	test.Assert (line5.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesDontIntersect);
	test.Assert (line6.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (line1.LinePosition (line3, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (line1.LinePosition (line4, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (2.0, 0.0, 0.0)));
	test.Assert (line1.LinePosition (line5, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (line2.LinePosition (line3, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (line2.LinePosition (line4, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (2.0, 1.0, 0.0)));
	test.Assert (line2.LinePosition (line5, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (1.0, 1.0, 0.0)));
	test.Assert (line5.LinePosition (line6, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (line6.LinePosition (line7, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (line8.LinePosition (line9, intersection) == JSM.LineLinePosition.LinesIntersectsOnePoint);
	test.Assert (intersection.IsEqual (new JSM.Coord (0.5, 0.5, 0.5)));
});

generalSuite.AddTest ('CoordSectorPositionTest', function (test)
{
	var sector1 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0));
	var sector2 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 0.0));
	var sector3 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 1.0));
	var sector4 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (42.0, 0.0, 0.0));
	
	test.Assert (sector1.CoordPosition (new JSM.Coord (0.0, 0.0, 1.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord (0.0, 0.0, -1.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord (0.25, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord (0.5, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord (0.75, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord (0.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);
	test.Assert (sector1.CoordPosition (new JSM.Coord (1.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);
	test.Assert (sector1.CoordPosition (new JSM.Coord (-0.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord (1.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);

	test.Assert (sector2.CoordPosition (new JSM.Coord (1.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord (0.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);

	test.Assert (sector3.CoordPosition (new JSM.Coord (0.0, 0.0, 1.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (0.0, 0.0, -1.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (0.25, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (0.5, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (0.75, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (0.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);
	test.Assert (sector3.CoordPosition (new JSM.Coord (1.0, 1.0, 1.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);
	test.Assert (sector3.CoordPosition (new JSM.Coord (1.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (-0.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (1.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord (0.5, 0.5, 0.5)) == JSM.CoordSectorPosition.CoordInsideOfSector);

	test.Assert (sector4.CoordPosition (new JSM.Coord (0.0, 0.0, 1.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (0.0, 0.0, -1.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (0.25, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (0.5, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (0.75, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (0.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);
	test.Assert (sector4.CoordPosition (new JSM.Coord (1.0, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (-0.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);
	test.Assert (sector4.CoordPosition (new JSM.Coord (1.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordInsideOfSector);	
	test.Assert (sector4.CoordPosition (new JSM.Coord (42, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOnSectorEndCoord);	
	test.Assert (sector4.CoordPosition (new JSM.Coord (42.1, 0.0, 0.0)) == JSM.CoordSectorPosition.CoordOutsideOfSector);	
});

generalSuite.AddTest ('CoordSectorPosition2DTest', function (test)
{
	var coord = new JSM.Coord2D (1.0, 0.0);
	var sector = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));
	test.Assert (sector.CoordPosition (coord) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);

	var sector1 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (4.0, 3.0));
	var sector3 = new JSM.Sector2D (new JSM.Coord2D (1.0, 1.0), new JSM.Coord2D (3.0, 1.0));
	var sector4 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));

	test.Assert (sector1.CoordPosition (new JSM.Coord2D (0.0, 0.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector1.CoordPosition (new JSM.Coord2D (1.0, 2.0)) == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);
	test.Assert (sector1.CoordPosition (new JSM.Coord2D (1.0, 2.001)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);

	test.Assert (sector2.CoordPosition (new JSM.Coord2D (0.0, 0.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (7.0, 5.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (-2.0, 2.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (2.0, 2.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (3.0, 2.5)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (2.0, 3.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (3.0, 3.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (1.0, 2.0)) == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (4.0, 3.0)) == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (2.5, 2.5)) == JSM.CoordSectorPosition2D.CoordInsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (1.75, 2.25)) == JSM.CoordSectorPosition2D.CoordInsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (2.5, 2.501)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector2.CoordPosition (new JSM.Coord2D (1.75, 2.26)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);

	test.Assert (sector3.CoordPosition (new JSM.Coord2D (4.0, 1.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (3.001, 1.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (0.0, 1.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (0.999, 1.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (1.0, 1.0)) == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (3.0, 1.0)) == JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (1.1, 1.0)) == JSM.CoordSectorPosition2D.CoordInsideOfSector);
	test.Assert (sector3.CoordPosition (new JSM.Coord2D (1.123456789, 1.0)) == JSM.CoordSectorPosition2D.CoordInsideOfSector);

	test.Assert (sector4.CoordPosition (new JSM.Coord2D (0.0, 0.0)) == JSM.CoordSectorPosition2D.CoordOutsideOfSector);
});

generalSuite.AddTest ('CoordSectorPosition2DTest2', function (test)
{
	var coord1 = new JSM.Coord2D (0, 0);
	var coord2 = new JSM.Coord2D (10, 10);
	var sector = null;
	
	var i, beg, end;
	for (i = 0; i < 2; i++) {
		if (i === 0) {
			beg = coord1;
			end = coord2;
		} else if (i === 1) {
			beg = coord2;
			end = coord1;
		}
		
		sector = new JSM.Sector2D (beg, end);
		
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(0, 0)), JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(10, 10)), JSM.CoordSectorPosition2D.CoordOnSectorEndCoord);

		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(-1, -1)), JSM.CoordSectorPosition2D.CoordOutsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(11, 11)), JSM.CoordSectorPosition2D.CoordOutsideOfSector);

		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(1, 2)), JSM.CoordSectorPosition2D.CoordOutsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(2, 1)), JSM.CoordSectorPosition2D.CoordOutsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(8, 9)), JSM.CoordSectorPosition2D.CoordOutsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(9, 8)), JSM.CoordSectorPosition2D.CoordOutsideOfSector);

		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(2, 2)), JSM.CoordSectorPosition2D.CoordInsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(3, 3)), JSM.CoordSectorPosition2D.CoordInsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(5, 5)), JSM.CoordSectorPosition2D.CoordInsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(8, 8)), JSM.CoordSectorPosition2D.CoordInsideOfSector);
		test.AssertEqual (sector.CoordPosition (new JSM.Coord2D(9, 9)), JSM.CoordSectorPosition2D.CoordInsideOfSector);
	}
});

generalSuite.AddTest ('ProjectCoordToSector2DTest', function (test)
{
	var sector1 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (4.0, 3.0));
	var sector3 = new JSM.Sector2D (new JSM.Coord2D (1.0, 1.0), new JSM.Coord2D (3.0, 1.0));
	var sector4 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));

	test.Assert (sector1.ProjectCoord (new JSM.Coord2D (0.0, 0.0)).IsEqual (new JSM.Coord2D (1.0, 2.0)));
	test.Assert (sector1.ProjectCoord (new JSM.Coord2D (1.0, 2.0)).IsEqual (new JSM.Coord2D (1.0, 2.0)));
	test.Assert (sector1.ProjectCoord (new JSM.Coord2D (1.0, 2.001)).IsEqual (new JSM.Coord2D (1.0, 2.0)));

	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (0.0, 0.0)).IsEqual (new JSM.Coord2D (1.0, 2.0)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (7.0, 5.0)).IsEqual (new JSM.Coord2D (4.0, 3.0)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (-2.0, 2.0)).IsEqual (new JSM.Coord2D (1, 2)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (2.0, 2.0)).IsEqual (new JSM.Coord2D (1.9, 2.3)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (3.0, 2.5)).IsEqual (new JSM.Coord2D (2.95, 2.65)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (2.0, 3.0)).IsEqual (new JSM.Coord2D (2.2, 2.4)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (3.0, 3.0)).IsEqual (new JSM.Coord2D (3.1, 2.7)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (1.0, 2.0)).IsEqual (new JSM.Coord2D (1.0, 2.0)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (4.0, 3.0)).IsEqual (new JSM.Coord2D (4.0, 3.0)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (2.5, 2.5)).IsEqual (new JSM.Coord2D (2.5, 2.5)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (1.75, 2.25)).IsEqual (new JSM.Coord2D (1.75, 2.25)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (2.5, 2.501)).IsEqual (new JSM.Coord2D (2.5003, 2.5001)));
	test.Assert (sector2.ProjectCoord (new JSM.Coord2D (1.75, 2.26)).IsEqual (new JSM.Coord2D (1.753, 2.251)));

	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (4.0, 1.0)).IsEqual (new JSM.Coord2D (3.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (3.001, 1.0)).IsEqual (new JSM.Coord2D (3.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (0.0, 1.0)).IsEqual (new JSM.Coord2D (1.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (0.999, 1.0)).IsEqual (new JSM.Coord2D (1.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (1.0, 1.0)).IsEqual (new JSM.Coord2D (1.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (3.0, 1.0)).IsEqual (new JSM.Coord2D (3.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (1.1, 1.0)).IsEqual (new JSM.Coord2D (1.1, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (2.0, 0.0)).IsEqual (new JSM.Coord2D (2.0, 1.0)));
	test.Assert (sector3.ProjectCoord (new JSM.Coord2D (1.123456789, 1.0)).IsEqual (new JSM.Coord2D (1.123456789, 1.0)));

	test.Assert (sector4.ProjectCoord (new JSM.Coord2D (0.0, 0.0)).IsEqual (new JSM.Coord2D (0.0, 1.0)));
});

generalSuite.AddTest ('SectorSectorPositionTest', function (test)
{
	var GetSector2D = function (a, b, c, d)
	{
		return new JSM.Sector2D (new JSM.Coord2D (a, b), new JSM.Coord2D (c, d));
	}

	var sector1 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (0.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	test.Assert (sector1.SectorPosition (sector2) == JSM.SectorSectorPosition2D.SectorsDontIntersect);

	var sector1 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (4.0, 3.0));
	var sector3 = new JSM.Sector2D (new JSM.Coord2D (1.0, 1.0), new JSM.Coord2D (3.0, 1.0));
	var sector4 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));

	var intersection = new JSM.Coord2D (0.0, 0.0);
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 0.0, 0.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 0.0, 1.0, 0.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 0.0, 1.0, 1.0), intersection) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (1.0, 1.0)));
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 0.0, 3.0, 1.0), intersection) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (new JSM.Coord2D (3.0, 1.0)));
	test.Assert (sector3.SectorPosition (GetSector2D (1.0, 1.0, 3.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (sector3.SectorPosition (GetSector2D (3.0, 1.0, 1.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);

	test.Assert (sector3.SectorPosition (GetSector2D (1.0, 0.0, 1.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (sector3.SectorPosition (GetSector2D (1.0, 0.0, 1.0, 2.0)) == JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (sector3.SectorPosition (GetSector2D (3.0, 0.0, 3.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (sector3.SectorPosition (GetSector2D (3.0, 0.0, 3.0, 2.0)) == JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (sector3.SectorPosition (GetSector2D (2.0, 0.0, 4.0, 2.0)) == JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);

	test.Assert (sector3.SectorPosition (GetSector2D (-1.0, 1.0, 0.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (4.0, 1.0, 5.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 0.0, 2.0, 0.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (1.0, 0.0, 3.0, 0.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (1.0, 2.0, 3.0, 2.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 1.0, 1.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (sector3.SectorPosition (GetSector2D (3.0, 1.0, 4.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (sector3.SectorPosition (GetSector2D (0.0, 1.0, 2.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (sector3.SectorPosition (GetSector2D (2.0, 1.0, 2.5, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (sector3.SectorPosition (GetSector2D (2.0, 1.0, 3.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (sector3.SectorPosition (GetSector2D (2.0, 1.0, 4.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
                 
	test.Assert (sector3.SectorPosition (GetSector2D (4.0, 1.0, 5.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (sector3.SectorPosition (GetSector2D (-1.0, 1.0, -3.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
                 
	test.Assert (GetSector2D (-1.0, 1.0, 0.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (GetSector2D (4.0, 1.0, 5.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (GetSector2D (0.0, 0.0, 2.0, 0.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (GetSector2D (1.0, 0.0, 3.0, 0.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (GetSector2D (1.0, 2.0, 3.0, 2.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (GetSector2D (0.0, 1.0, 1.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (GetSector2D (3.0, 1.0, 4.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (GetSector2D (0.0, 1.0, 2.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (GetSector2D (2.0, 1.0, 2.5, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (GetSector2D (2.0, 1.0, 3.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.Assert (GetSector2D (2.0, 1.0, 4.0, 1.0).SectorPosition (sector3) == JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	             
	test.Assert (GetSector2D (0.0, 0.0, 1.0, 1.0).SectorPosition (GetSector2D (3.0, 0.0, 3.0, 3.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.Assert (GetSector2D (3.0, 0.0, 3.0, 3.0).SectorPosition (GetSector2D (0.0, 0.0, 1.0, 1.0)) == JSM.SectorSectorPosition2D.SectorsDontIntersect);
});

generalSuite.AddTest ('SectorSectorPositionTest2', function (test)
{
	function GetSectorsPosition (a, b, c, d, i)
	{
		var sector1 = new JSM.Sector2D (a, b);
		var sector2 = new JSM.Sector2D (c, d);
		return sector1.SectorPosition (sector2, i);
	}
	
	var coord1 = new JSM.Coord2D (0.0, 0.0);
	var coord2 = new JSM.Coord2D (1.0, 0.0);
	var coord3 = new JSM.Coord2D (2.0, 0.0);
	var coord4 = new JSM.Coord2D (3.0, 0.0);
	
	var coord5 = new JSM.Coord2D (0.0, 1.0);
	var coord6 = new JSM.Coord2D (1.0, 1.0);
	var coord7 = new JSM.Coord2D (2.0, 1.0);
	var coord8 = new JSM.Coord2D (3.0, 1.0);

	var coord9 = new JSM.Coord2D (0.0, 2.0);
	var coord10 = new JSM.Coord2D (1.0, 2.0);
	var coord11 = new JSM.Coord2D (2.0, 2.0);
	var coord12 = new JSM.Coord2D (3.0, 2.0);

	var intersection = new JSM.Coord2D (0.0, 0.0);

	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord1, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord1, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);

	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord1, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord3, coord4, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
    
	test.AssertEqual (GetSectorsPosition (coord2, coord10, coord5, coord6, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord2, coord10, coord5, coord7, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
    
	test.AssertEqual (GetSectorsPosition (coord2, coord10, coord5, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord2, coord10, coord8, coord5, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord10, coord2, coord5, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord10, coord2, coord8, coord5, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
    
	test.AssertEqual (GetSectorsPosition (coord5, coord8, coord2, coord10, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord5, coord8, coord10, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord8, coord5, coord2, coord10, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
	test.AssertEqual (GetSectorsPosition (coord8, coord5, coord10, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord6));
    
	test.AssertEqual (GetSectorsPosition (coord1, coord1, coord1, coord1, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord1, coord1, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord1));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord3, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));

	test.AssertEqual (GetSectorsPosition (coord1, coord3, coord2, coord4, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.AssertEqual (GetSectorsPosition (coord1, coord3, coord4, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.AssertEqual (GetSectorsPosition (coord3, coord1, coord2, coord4, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
	test.AssertEqual (GetSectorsPosition (coord3, coord1, coord4, coord2, intersection), JSM.SectorSectorPosition2D.SectorsIntersectCoincident);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord3, coord4, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord4, coord3, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord2, coord1, coord3, coord4, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord2, coord1, coord4, coord3, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord5, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord7, coord8, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord5, coord8, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord2, coord3, coord5, coord8, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord6), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord7), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord8), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord3), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord6, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord7, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord3, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord3, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord3, coord7, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord3, coord8, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord2, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord4, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord8, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord1, coord5, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord1));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord2, coord6, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord3, coord7, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord3));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord4, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord4));
    
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord2, coord6, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord3, coord7, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord3));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord2, coord5, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord3, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord3));
	
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord6, coord3, intersection), JSM.SectorSectorPosition2D.SectorsIntersectOnePoint);
	test.Assert (intersection.IsEqual (coord3));
	test.AssertEqual (GetSectorsPosition (coord1, coord2, coord2, coord8, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
	test.Assert (intersection.IsEqual (coord2));
	test.AssertEqual (GetSectorsPosition (coord1, coord4, coord6, coord4, intersection), JSM.SectorSectorPosition2D.SectorsIntersectEndPoint);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord2, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord6, coord2, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord5, coord1, coord2, coord6, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord5, coord1, coord6, coord2, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
    
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord2, coord8, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord1, coord5, coord8, coord2, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord5, coord1, coord2, coord8, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
	test.AssertEqual (GetSectorsPosition (coord5, coord1, coord8, coord2, intersection), JSM.SectorSectorPosition2D.SectorsDontIntersect);
});

generalSuite.AddTest ('BoxTest', function (test)
{
	var box = new JSM.Box2D (new JSM.Coord2D (0.0, 0.0), new JSM.Coord2D (1.0, 1.0));
	test.Assert (box.GetCenter ().IsEqual (new JSM.Coord2D (0.5, 0.5)));

	var box = new JSM.Box (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 1.0));
	test.Assert (box.GetCenter ().IsEqual (new JSM.Coord (0.5, 0.5, 0.5)));

	var box2 = new JSM.Box (new JSM.Coord (-0.5, -0.5, -0.5), new JSM.Coord (0.5, 0.5, 0.5));
	var box3 = JSM.BoxUnion (box, box2);
	test.Assert (box3.min.IsEqual (new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (box3.max.IsEqual (new JSM.Coord (1.0, 1.0, 1.0)));
});

generalSuite.AddTest ('SphereTest', function (test)
{
	var sphere = new JSM.Sphere (new JSM.Coord (1.0, 1.0, 1.0), 2.0);
	var sphere2 = sphere.Clone ();
	test.Assert (sphere2.GetCenter ().IsEqual (new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (sphere2.GetRadius () == 2.0);

	sphere.Set (new JSM.Coord (3.0, 3.0, 3.0), 4.0);
	test.Assert (sphere.GetCenter ().IsEqual (new JSM.Coord (3.0, 3.0, 3.0)));
	test.Assert (sphere.GetRadius () == 4.0);
});

generalSuite.AddTest ('PlaneTest', function (test)
{
	var plane = new JSM.Plane (1.0, 2.0, 3.0, 4.0);
	test.Assert (plane.a == 1.0 && plane.b == 2.0 && plane.c == 3.0 && plane.d == 4.0);
	plane.Set (5.0, 6.0, 7.0, 8.0);
	test.Assert (plane.a == 5.0 && plane.b == 6.0 && plane.c == 7.0 && plane.d == 8.0);
	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
	test.Assert (plane.a == 0.0 && plane.b == 0.0 && plane.c == 1.0 && plane.d == 0.0);
	plane = JSM.GetPlaneFromThreeCoords (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));
	test.Assert (plane.a == 0.0 && plane.b == 0.0 && plane.c == 1.0 && plane.d == 0.0);

	var coord1 = new JSM.Coord (0.0, 0.0, 0.0);
	var coord1b = new JSM.Coord (0.0, 0.0, 2.0);
	var coord2 = new JSM.Coord (1.0, 0.0, 0.0);
	var coord3 = new JSM.Coord (1.0, 1.0, 1.0);

	var plane1a = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
	var plane2a = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var plane3a = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 1.0, 1.0), new JSM.Vector (0.0, 0.0, 1.0));
	
	var plane1b = JSM.GetPlaneFromThreeCoords (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0));
	var plane2b = JSM.GetPlaneFromThreeCoords (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	var plane3b = JSM.GetPlaneFromThreeCoords (new JSM.Coord (1.0, 1.0, 1.0), new JSM.Coord (2.0, 1.0, 1.0), new JSM.Coord (1.0, 2.0, 1.0));
	
	var plane1, plane2, plane3;
	var i;
	for (i = 0; i < 2; i++) {
		if (i == 0) {
			plane1 = plane1a;
			plane2 = plane2a;
			plane3 = plane3a;
		} else if (i == 1) {
			plane1 = plane1b;
			plane2 = plane2b;
			plane3 = plane3b;
		}
	
		test.Assert (plane1.CoordPosition (coord1) == JSM.CoordPlanePosition.CoordOnPlane);
		test.Assert (plane2.CoordPosition (coord1) == JSM.CoordPlanePosition.CoordOnPlane);
		test.Assert (plane3.CoordPosition (coord1b) == JSM.CoordPlanePosition.CoordInFrontOfPlane);
		test.Assert (plane3.CoordPosition (coord1) == JSM.CoordPlanePosition.CoordAtBackOfPlane);

		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (1.0, 0.0, 0.0), plane1), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (1.0, 0.0, 0.0), plane2), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (0.0, 0.0, 1.0), plane3), -1.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (0.0, 1.0, 1.0), plane3), -1.4142135623));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1b, new JSM.Coord (0.0, 1.0, 1.0), plane3), 1.4142135623));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDirectionalDistance (coord1, new JSM.Coord (0.0, 1.0, 1.0), plane3), 1.4142135623));
		
		test.Assert (JSM.IsEqual (plane1.CoordDistance (coord1), 0.0));
		test.Assert (JSM.IsEqual (plane2.CoordDistance (coord1), 0.0));
		test.Assert (JSM.IsEqual (plane3.CoordDistance (coord1), 1.0));

		test.Assert (JSM.IsEqual (plane1.CoordDistance (coord2), 0.0));
		test.Assert (JSM.IsEqual (plane2.CoordDistance (coord2), 1.0));
		test.Assert (JSM.IsEqual (plane3.CoordDistance (coord2), 1.0));

		test.Assert (JSM.IsEqual (plane1.CoordDistance (coord3), 1.0));
		test.Assert (JSM.IsEqual (plane2.CoordDistance (coord3), 1.0));
		test.Assert (JSM.IsEqual (plane3.CoordDistance (coord3), 0.0));
		
		test.Assert (plane1.ProjectCoord (coord1).IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
		test.Assert (plane2.ProjectCoord (coord1).IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
		test.Assert (plane3.ProjectCoord (coord1).IsEqual (new JSM.Coord (0.0, 0.0, 1.0)));

		test.Assert (plane1.ProjectCoord (coord2).IsEqual (new JSM.Coord (1.0, 0.0, 0.0)));
		test.Assert (plane2.ProjectCoord (coord2).IsEqual (new JSM.Coord (0.0, 0.0, 0.0)));
		test.Assert (plane3.ProjectCoord (coord2).IsEqual (new JSM.Coord (1.0, 0.0, 1.0)));

		test.Assert (plane1.ProjectCoord (coord3).IsEqual (new JSM.Coord (1.0, 1.0, 0.0)));
		test.Assert (plane2.ProjectCoord (coord3).IsEqual (new JSM.Coord (0.0, 1.0, 1.0)));
		test.Assert (plane3.ProjectCoord (coord3).IsEqual (new JSM.Coord (1.0, 1.0, 1.0)));
		
		var line1 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
		var line2 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
		var line3 = new JSM.Line (new JSM.Coord (1.0, 2.0, 3.0), new JSM.Vector (0.0, 0.0, 1.0));
		test.Assert (plane1.LinePosition (line1) == JSM.LinePlanePosition.LineParallelToPlane);
		test.Assert (plane1.LinePosition (line2) == JSM.LinePlanePosition.LineIntersectsPlane);
		
		var intersection = new JSM.Coord (0.0, 0.0, 0.0);
		test.Assert (plane1.LinePosition (line3, intersection) == JSM.LinePlanePosition.LineIntersectsPlane);
		test.Assert (intersection.IsEqual (new JSM.Coord (1.0, 2.0, 0.0)));
		test.Assert (plane1.LineIntersection (line3).IsEqual (new JSM.Coord (1.0, 2.0, 0.0)));
	}
});

generalSuite.AddTest ('ProjectionTest', function (test)
{
	var eye = new JSM.Coord (1, 0, 0);
	var center = new JSM.Coord (0, 0, 0);
	var up = new JSM.Coord (0, 0, 1);
	var width = 200;
	var height = 100;
	var fieldOfView = 45.0;
	var aspectRatio = width / height;
	var nearPlane = 0.1;
	var farPlane = 100;
	var viewPort = [0, 0, width, height];

	var projected = new JSM.Coord (0.0, 0.0, 0.0);

	projected = JSM.Project (new JSM.Coord (0, 0, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 100) && JSM.IsEqual (projected.y, 50));

	projected = JSM.Project (new JSM.Coord (0.5, 0, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 100) && JSM.IsEqual (projected.y, 50));

	projected = JSM.Project (new JSM.Coord (1.5, 0, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 100) && JSM.IsEqual (projected.y, 50));

	projected = JSM.Project (new JSM.Coord (100, 0, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 100) && JSM.IsEqual (projected.y, 50));

	projected = JSM.Project (new JSM.Coord (-100, 0, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 100) && JSM.IsEqual (projected.y, 50));

	projected = JSM.Project (new JSM.Coord (1, 0, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected == null);

	projected = JSM.Project (new JSM.Coord (0, 0.5, 0), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 160.35533905932851) && JSM.IsEqual (projected.y, 50));

	projected = JSM.Project (new JSM.Coord (0, 0, 0.5), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 100) && JSM.IsEqual (projected.y, 110.3553390593285));

	projected = JSM.Project (new JSM.Coord (0, 0.5, 0.5), eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
	test.Assert (projected != null);
	test.Assert (JSM.IsEqual (projected.x, 160.35533905932851) && JSM.IsEqual (projected.y, 110.3553390593285));
});

generalSuite.AddTest ('UnprojectionTest', function (test)
{
	function TestProjection (coord)
	{
		var projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
		if (projected === null) {
			return false;
		}
		var unprojected = JSM.Unproject (projected, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
		return coord.IsEqual (unprojected);
	}
	
	function TestProjectionWindowCoords (coord)
	{
		var projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
		if (projected === null) {
			return false;
		}
		projected.z = 0.0;
		var unprojected = JSM.Unproject (projected, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
		var oldRay = JSM.CoordSub (coord, eye);
		var newRay = JSM.CoordSub (unprojected, eye);
		oldRay.Normalize ();
		newRay.Normalize ();
		return newRay.IsEqual (oldRay);
	}
	
	var eye = new JSM.Coord (1, 0, 0);
	var center = new JSM.Coord (0, 0, 0);
	var up = new JSM.Coord (0, 0, 1);
	var width = 200;
	var height = 100;
	var fieldOfView = 45.0;
	var aspectRatio = width / height;
	var nearPlane = 0.1;
	var farPlane = 100;
	var viewPort = [0, 0, width, height];

	test.Assert (TestProjection (new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.5, 0.0, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.0, 100.0, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.0, 0.0, 100.0)));
	test.Assert (TestProjection (new JSM.Coord (-100.0, 0.0, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.0, -100.0, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.0, 0.0, -100.0)));
	test.Assert (TestProjection (new JSM.Coord (0.5, 0.0, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.0, 0.5, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.0, 0.0, 0.5)));
	test.Assert (TestProjection (new JSM.Coord (0.5, 0.5, 0.0)));
	test.Assert (TestProjection (new JSM.Coord (0.5, 0.0, 0.5)));
	test.Assert (TestProjection (new JSM.Coord (0.0, 0.5, 0.5)));
	
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.5, 0.0, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 100.0, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 0.0, 100.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (-100.0, 0.0, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, -100.0, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 0.0, -100.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.5, 0.0, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 0.5, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 0.0, 0.5)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.5, 0.5, 0.0)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.5, 0.0, 0.5)));
	test.Assert (TestProjectionWindowCoords (new JSM.Coord (0.0, 0.5, 0.5)));
});

generalSuite.AddTest ('ConvexHullTest', function (test)
{
	var result = [];
	var coord = [];
	
	coords = [];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '');

	coords = [
		new JSM.Coord2D	(0, 0)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '');

	coords = [
		new JSM.Coord2D	(0, 0),
		new JSM.Coord2D	(1, 0)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '');

	coords = [
		new JSM.Coord2D	(0, 0),
		new JSM.Coord2D	(1, 0),
		new JSM.Coord2D	(1, 1)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '0,1,2');

	coords = [
		new JSM.Coord2D	(0, 0),
		new JSM.Coord2D	(1, 0),
		new JSM.Coord2D	(1, 1),
		new JSM.Coord2D	(0, 1)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '0,1,2,3');

	coords = [
		new JSM.Coord2D	(0, 0),
		new JSM.Coord2D	(1, 0),
		new JSM.Coord2D	(0.5, 0.5),
		new JSM.Coord2D	(1, 1),
		new JSM.Coord2D	(0, 1)
	];
	
	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '0,1,3,4');

	coords = [
		new JSM.Coord2D	(0, 0),
		new JSM.Coord2D	(1, 0),
		new JSM.Coord2D	(0.5, 0.1),
		new JSM.Coord2D	(0.6, 0.2),
		new JSM.Coord2D	(0.7, 0.3),
		new JSM.Coord2D	(0.8, 0.4),
		new JSM.Coord2D	(1, 1),
		new JSM.Coord2D	(0, 1)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '0,1,6,7');

	coords = [
		new JSM.Coord2D	(0.5, 0.1),
		new JSM.Coord2D	(0.6, 0.2),
		new JSM.Coord2D	(0.7, 0.3),
		new JSM.Coord2D	(0.8, 0.4),
		new JSM.Coord2D	(0, 0),
		new JSM.Coord2D	(1, 0),
		new JSM.Coord2D	(1, 1),
		new JSM.Coord2D	(0, 1)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '4,5,6,7');

	coords = [
		new JSM.Coord2D	(2, 4),
		new JSM.Coord2D	(3, 2),
		new JSM.Coord2D	(4, 1),
		new JSM.Coord2D	(5, 6),
		new JSM.Coord2D	(1, 5),
		new JSM.Coord2D	(0, 4),
		new JSM.Coord2D	(2, 0)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '5,6,2,3,4');

	coords = [
		new JSM.Coord2D	(2, 5),
		new JSM.Coord2D	(3, 3),
		new JSM.Coord2D	(1, 3),
		new JSM.Coord2D	(5, 6),
		new JSM.Coord2D	(0, 1),
		new JSM.Coord2D	(4, 2),
		new JSM.Coord2D	(6, 1),
		new JSM.Coord2D	(4, 4),
		new JSM.Coord2D	(6, 6),
		new JSM.Coord2D	(0, 6)
	];

	result = JSM.ConvexHull2D (coords);
	test.Assert (result.toString () == '4,6,8,3,9');

	coords = [];
	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '');

	coords.push (new JSM.Coord (0, 0, 0));
	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '');

	coords.push (new JSM.Coord (1, 0, 0));
	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '');

	coords.push (new JSM.Coord (1, 1, 0));
	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '');

	coords.push (new JSM.Coord (0, 1, 0));
	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '0,1,2,0,2,3,2,1,3,1,0,3');

	coords = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (1, 0, 0),
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (0, 1, 0),
		new JSM.Coord (0, 0, 1),
		new JSM.Coord (1, 0, 1),
		new JSM.Coord (1, 1, 1),
		new JSM.Coord (0, 1, 1)
	];

	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '2,1,3,1,0,3,0,1,5,4,0,5,1,2,6,5,1,6,3,0,7,0,4,7,2,3,7,6,2,7,4,5,7,5,6,7');
	
	var a = 1.0;
	var b = 0.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;
	var d = 1.0 / c;
	
	coords = [
		new JSM.Coord (+a, +a, +a),
		new JSM.Coord (+a, +a, -a),
		new JSM.Coord (+a, -a, +a),
		new JSM.Coord (-a, +a, +a),
		
		new JSM.Coord (+a, -a, -a),
		new JSM.Coord (-a, +a, -a),
		new JSM.Coord (-a, -a, +a),
		new JSM.Coord (-a, -a, -a),

		new JSM.Coord (+b, +d, +c),
		new JSM.Coord (+b, +d, -c),
		new JSM.Coord (+b, -d, +c),
		new JSM.Coord (+b, -d, -c),

		new JSM.Coord (+d, +c, +b),
		new JSM.Coord (+d, -c, +b),
		new JSM.Coord (-d, +c, +b),
		new JSM.Coord (-d, -c, +b),

		new JSM.Coord (+c, +b, +d),
		new JSM.Coord (-c, +b, +d),
		new JSM.Coord (+c, +b, -d),
		new JSM.Coord (-c, +b, -d)
	];
	
	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '3,8,14,8,0,14,0,12,14,1,9,14,12,1,14,9,5,14,2,10,15,13,2,15,10,6,15,7,11,15,11,4,15,4,13,15,10,2,16,0,8,16,8,10,16,6,10,17,8,3,17,10,8,17,4,11,18,9,1,18,11,9,18,1,12,18,12,0,18,0,16,18,2,13,18,16,2,18,13,4,18,11,7,19,5,9,19,9,11,19,3,14,19,17,3,19,14,5,19,7,15,19,15,6,19,6,17,19');

	coords.push (new JSM.Coord (0, 0, 0));
	coords.push (new JSM.Coord (0.1, 0, 0));
	coords.push (new JSM.Coord (0.1, 0.1, 0));
	coords.push (new JSM.Coord (0, 0.1, 0));
	coords.push (new JSM.Coord (0, 0, 0.1));
	coords.push (new JSM.Coord (0.1, 0, 0.1));
	coords.push (new JSM.Coord (0.1, 0.1, 0.1));
	coords.push (new JSM.Coord (0, 0.1, 0.1));

	result = JSM.ConvexHull3D (coords);
	test.Assert (result.toString () == '3,8,14,8,0,14,0,12,14,1,9,14,12,1,14,9,5,14,2,10,15,13,2,15,10,6,15,7,11,15,11,4,15,4,13,15,10,2,16,0,8,16,8,10,16,6,10,17,8,3,17,10,8,17,4,11,18,9,1,18,11,9,18,1,12,18,12,0,18,0,16,18,2,13,18,16,2,18,13,4,18,11,7,19,5,9,19,9,11,19,3,14,19,17,3,19,14,5,19,7,15,19,15,6,19,6,17,19');
});

generalSuite.AddTest ('OctreeTest', function (test)
{
	var i;
	for (i = 0; i < 2; i++) {
		var maxNodeNum = (i === 0 ? null : 5);
		var octree = new JSM.Octree (new JSM.Box (new JSM.Coord (-1.0, -1.0, -1.0), new JSM.Coord (1.0, 1.0, 1.0)), maxNodeNum);
		var coords = [
			new JSM.Coord (0.0, 0.0, 0.0),
			new JSM.Coord (1.0, 1.0, 1.0),
			new JSM.Coord (-1.0, -1.0, -1.0),
			new JSM.Coord (0.1, 0.0, 0.0),
			new JSM.Coord (0.2, 0.0, 0.0),
			new JSM.Coord (0.3, 0.0, 0.0),
			new JSM.Coord (0.30001, 0.0, 0.0),
			new JSM.Coord (0.30000001, 0.0, 0.0),
			new JSM.Coord (0.30001001, 0.0, 0.0),
			new JSM.Coord (0.99, 0.99, 0.99),
			new JSM.Coord (-0.99, -0.99, -0.99),
			new JSM.Coord (0.99, -0.99, -0.99),
			new JSM.Coord (-0.99, 0.99, -0.99),
			new JSM.Coord (-0.98, 0.99, -0.99),
			new JSM.Coord (-0.97, 0.99, -0.99),
			new JSM.Coord (-0.96, 0.99, -0.99)		
		];
		
		test.Assert (octree.AddCoord (coords[0]) == 0);
		test.Assert (octree.AddCoord (coords[0]) == 0);
		test.Assert (octree.AddCoord (coords[0]) == 0);
		test.Assert (octree.AddCoord (coords[0]) == 0);
		test.Assert (octree.AddCoord (coords[0]) == 0);
		
		test.Assert (octree.AddCoord (coords[1]) == 1);
		test.Assert (octree.AddCoord (coords[2]) == 2);
		test.Assert (octree.AddCoord (coords[0]) == 0);

		test.Assert (octree.AddCoord (coords[3]) == 3);
		test.Assert (octree.AddCoord (coords[4]) == 4);
		test.Assert (octree.AddCoord (coords[5]) == 5);
		test.Assert (octree.AddCoord (coords[6]) == 6);
		test.Assert (octree.AddCoord (coords[7]) == 5);
		test.Assert (octree.AddCoord (coords[8]) == 6);
		
		test.Assert (octree.AddCoord (coords[9]) == 7);
		test.Assert (octree.AddCoord (coords[10]) == 8);
		test.Assert (octree.AddCoord (coords[11]) == 9);
		test.Assert (octree.AddCoord (coords[12]) == 10);
		
		test.Assert (octree.FindCoord (coords[0]) == 0);
		test.Assert (octree.FindCoord (coords[0]) == 0);
		test.Assert (octree.FindCoord (coords[0]) == 0);
		test.Assert (octree.FindCoord (coords[0]) == 0);
		test.Assert (octree.FindCoord (coords[0]) == 0);
		
		test.Assert (octree.FindCoord (coords[1]) == 1);
		test.Assert (octree.FindCoord (coords[2]) == 2);
		test.Assert (octree.FindCoord (coords[0]) == 0);

		test.Assert (octree.FindCoord (coords[3]) == 3);
		test.Assert (octree.FindCoord (coords[4]) == 4);
		test.Assert (octree.FindCoord (coords[5]) == 5);
		test.Assert (octree.FindCoord (coords[6]) == 6);
		test.Assert (octree.FindCoord (coords[7]) == 5);
		test.Assert (octree.FindCoord (coords[8]) == 6);
		
		test.Assert (octree.FindCoord (coords[9]) == 7);
		test.Assert (octree.FindCoord (coords[10]) == 8);
		test.Assert (octree.FindCoord (coords[11]) == 9);
		test.Assert (octree.FindCoord (coords[12]) == 10);

		test.Assert (octree.FindCoord (coords[13]) == -1);
		test.Assert (octree.FindCoord (coords[14]) == -1);
		test.Assert (octree.FindCoord (coords[15]) == -1);

		var nodeCount = 0;
		var coordCount = 0
		var coordsPerNode = {};
		JSM.TraverseOctreeNodes (octree, function (node) {
			coordsPerNode[nodeCount] = node.coords.length;
			nodeCount += 1;
			coordCount += node.coords.length;
			return true;
		});
		
		if (i == 0) {
			test.Assert (nodeCount === 1);
			test.Assert (coordsPerNode[0] == 11);
		} else if (i == 1) {
			test.Assert (nodeCount === 9);
			test.Assert (coordsPerNode[0] == 0);
			test.Assert (coordsPerNode[1] == 3);
			test.Assert (coordsPerNode[2] == 5);
			test.Assert (coordsPerNode[3] == 0);
			test.Assert (coordsPerNode[4] == 1);
			test.Assert (coordsPerNode[5] == 0);
			test.Assert (coordsPerNode[6] == 0);
			test.Assert (coordsPerNode[7] == 2);
			test.Assert (coordsPerNode[8] == 0);
		}
		test.Assert (coordCount == 11);
	}
	
	var octree = new JSM.Octree (new JSM.Box (new JSM.Coord (-1.0, -1.0, -1.0), new JSM.Coord (1.0, 1.0, 1.0)), 3);
	var coords = [
		new JSM.Coord (5.0, 1.0, 0.0),
		new JSM.Coord (5.0, 2.0, 0.0),
		new JSM.Coord (5.0, 3.0, 0.0),
		new JSM.Coord (5.0, 4.0, 0.0),
		new JSM.Coord (5.0, 5.0, 0.0),
		new JSM.Coord (5.0, 6.0, 0.0),
		new JSM.Coord (5.0, 7.0, 0.0)	
	];
	
	test.Assert (octree.AddCoord (coords[0]) == 0);
	test.Assert (octree.AddCoord (coords[1]) == 1);
	test.Assert (octree.AddCoord (coords[2]) == 2);
	test.Assert (octree.AddCoord (coords[3]) == 3);
	test.Assert (octree.AddCoord (coords[4]) == 4);
	test.Assert (octree.AddCoord (coords[5]) == 5);
	test.Assert (octree.AddCoord (coords[6]) == 6);

	test.Assert (octree.FindCoord (coords[0]) == 0);
	test.Assert (octree.FindCoord (coords[1]) == 1);
	test.Assert (octree.FindCoord (coords[2]) == 2);
	test.Assert (octree.FindCoord (coords[3]) == 3);
	test.Assert (octree.FindCoord (coords[4]) == 4);
	test.Assert (octree.FindCoord (coords[5]) == 5);
	test.Assert (octree.FindCoord (coords[6]) == 6);
});

generalSuite.AddTest ('TriangleOctreeTest', function (test)
{
	function CheckCounts (octree, refNodeCount, refTriangleCount)
	{
		var nodeCount = 0;
		var triangleCount = 0
		JSM.TraverseOctreeNodes (octree, function (node) {
			nodeCount += 1;
			triangleCount += node.triangles.length;
			return true;
		});
		return (nodeCount == refNodeCount && triangleCount == refTriangleCount);		
	}
	
	var octree = new JSM.TriangleOctree (new JSM.Box (new JSM.Coord (-1.0, -1.0, -1.0), new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (CheckCounts (octree, 1, 0));
    
	test.Assert (octree.AddTriangle (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.1, 0.0, 0.0), new JSM.Coord (0.1, 0.1, 0.0)));
	test.Assert (octree.AddTriangle (new JSM.Coord (0.0, 0.0, 0.5), new JSM.Coord (0.1, 0.0, 0.5), new JSM.Coord (0.1, 0.1, 0.5)));
	test.Assert (CheckCounts (octree, 73, 2));
	
	test.Assert (octree.AddTriangle (new JSM.Coord (0.0, 0.0, -0.5), new JSM.Coord (0.1, 0.0, -0.5), new JSM.Coord (0.1, 0.1, -0.5)));
	test.Assert (octree.AddTriangle (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Coord (0.6, 0.0, 0.0), new JSM.Coord (0.6, 0.6, 0.0)));
	test.Assert (octree.AddTriangle (new JSM.Coord (0.5, 0.0, 0.5), new JSM.Coord (0.6, 0.0, 0.5), new JSM.Coord (0.6, 0.6, 0.5)));
	test.Assert (octree.AddTriangle (new JSM.Coord (0.5, 0.0, -0.5), new JSM.Coord (0.6, 0.0, -0.5), new JSM.Coord (0.6, 0.6, -0.5)));
	test.Assert (CheckCounts (octree, 97, 6));
	
	var octree = new JSM.TriangleOctree (new JSM.Box (new JSM.Coord (-1.0, -1.0, -1.0), new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (octree.AddTriangle (new JSM.Coord (-1.0, -1.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 0.0), 1));
	test.Assert (CheckCounts (octree, 9, 1));
	test.Assert (octree.AddTriangle (new JSM.Coord (-1.0, -1.0, 1.0), new JSM.Coord (1.0, 0.0, 1.0), new JSM.Coord (1.0, 1.0, 1.0), 2));
	test.Assert (CheckCounts (octree, 9, 2));
	test.Assert (octree.AddTriangle (new JSM.Coord (-1.0, -1.0, -1.0), new JSM.Coord (1.0, 0.0, -1.0), new JSM.Coord (1.0, 1.0, -1.0), 3));
	test.Assert (CheckCounts (octree, 9, 3));
	test.Assert (octree.AddTriangle (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.1, 0.0, 0.0), new JSM.Coord (0.1, 0.1, 0.0), 4));
	test.Assert (CheckCounts (octree, 41, 4));
	
	var nodeIndex = 0;
	var trianglesPerNode = {};
	var userDataSum = 0;
	JSM.TraverseOctreeNodes (octree, function (node) {
		var i = 0;
		for (i = 0; i < node.triangles.length; i++) {
			userDataSum += node.triangles[i].userData;
		}
		trianglesPerNode[nodeIndex] = node.triangles.length;
		nodeIndex += 1;
		return true;
	});
	for (var key in trianglesPerNode) {
		if (key == 0) {
			test.Assert (trianglesPerNode[key] == 3);
		} else if (key == 18) {
			test.Assert (trianglesPerNode[key] == 1);
		} else {
			test.Assert (trianglesPerNode[key] == 0);
		}
	}
	test.Assert (userDataSum == 10);
});

var polygonSuite = unitTest.AddTestSuite ('GeometryPolygon');

polygonSuite.AddTest ('CoordPolygonPosition2DTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 2.0);
	polygon.AddVertex (0.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (1.5, 3.0);

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.0, 0.0)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.5, 5.0)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.0, 3.0)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.0, 4.0)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (3.0, 0.0)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (2.5, 0.5)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (4.0, 2.0)) == JSM.CoordPolygonPosition2D.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (-1.0, 1.0)) == JSM.CoordPolygonPosition2D.Outside);

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.0, 1.5)) == JSM.CoordPolygonPosition2D.OnEdge);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.5, 1.0)) == JSM.CoordPolygonPosition2D.OnEdge);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.0, 0.5)) == JSM.CoordPolygonPosition2D.OnEdge);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 0.0)) == JSM.CoordPolygonPosition2D.OnEdge);

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.0, 2.0)) == JSM.CoordPolygonPosition2D.OnVertex);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.0, 1.0)) == JSM.CoordPolygonPosition2D.OnVertex);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.0, 1.0)) == JSM.CoordPolygonPosition2D.OnVertex);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (3.0, 2.0)) == JSM.CoordPolygonPosition2D.OnVertex);

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.5, 1.5)) == JSM.CoordPolygonPosition2D.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 0.5)) == JSM.CoordPolygonPosition2D.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 1.5)) == JSM.CoordPolygonPosition2D.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (2.5, 1.5)) == JSM.CoordPolygonPosition2D.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 1.0)) == JSM.CoordPolygonPosition2D.Inside);
});

polygonSuite.AddTest ('PolygonVertexVisibility2DTest', function (test)
{
	function GetSector (x1, y1, x2, y2)
	{
		var beg = new JSM.Coord2D (x1, y1);
		var end = new JSM.Coord2D (x2, y2);
		var sector = new JSM.Sector2D (beg, end);
		return sector;
	}

	function GetVisibleVertices (polygon, from)
	{
		var result = [];
		for (var i = 0; i < polygon.VertexCount (); i++) {
			if (polygon.IsDiagonal (from, i)) {
				result.push (i);
			}
		}
		return result;
	}

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (3.0, 0.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	
	test.Assert (GetVisibleVertices (polygon, 0).toString () == [4, 5, 6].toString ());
	test.Assert (GetVisibleVertices (polygon, 1).toString () == [3, 4, 5].toString ());
	test.Assert (GetVisibleVertices (polygon, 2).toString () == [4].toString ());
	test.Assert (GetVisibleVertices (polygon, 3).toString () == [1].toString ());
	test.Assert (GetVisibleVertices (polygon, 4).toString () == [0, 1, 2].toString ());
	test.Assert (GetVisibleVertices (polygon, 5).toString () == [0, 1, 7].toString ());
	test.Assert (GetVisibleVertices (polygon, 6).toString () == [0].toString ());
	test.Assert (GetVisibleVertices (polygon, 7).toString () == [5].toString ());

	test.Assert (polygon.SectorPosition (GetSector (0, 0, 1, 1), 0, 5) == JSM.SectorPolygonPosition2D.NoIntersection);
	test.Assert (polygon.SectorPosition (GetSector (0, 0, 1, 1), 0, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (0, 0, 1, 1), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (0, 0, 0.5, 0.5), 0, -1) == JSM.SectorPolygonPosition2D.NoIntersection);
	test.Assert (polygon.SectorPosition (GetSector (0, 0, 0.5, 0.5), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (0.3, 0.3, 0.8, 0.8), -1, -1) == JSM.SectorPolygonPosition2D.NoIntersection);
	test.Assert (polygon.SectorPosition (GetSector (0.3, 0.3, 1, 1), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (0.3, 0.3, 1.5, 1.5), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnePoint);
	test.Assert (polygon.SectorPosition (GetSector (0.5, 1.5, 0.8, 1.5), -1, -1) == JSM.SectorPolygonPosition2D.NoIntersection);
	test.Assert (polygon.SectorPosition (GetSector (0.5, 1.5, 1, 1.5), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnePoint);
	test.Assert (polygon.SectorPosition (GetSector (0.5, 1.5, 1, 2), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (0.5, 1.5, 1, 2.5), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnePoint);
	test.Assert (polygon.SectorPosition (GetSector (1.1, 1.5, 1.9, 1.5), -1, -1) == JSM.SectorPolygonPosition2D.NoIntersection);
	test.Assert (polygon.SectorPosition (GetSector (1, 2, 1.9, 1.5), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (1, 2, 1.9, 1.5), 6, -1) == JSM.SectorPolygonPosition2D.NoIntersection);
	test.Assert (polygon.SectorPosition (GetSector (1, 2, 2, 2), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (1, 2, 2, 2), 6, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon.SectorPosition (GetSector (1, 2, 2, 2), 6, 3) == JSM.SectorPolygonPosition2D.NoIntersection);
	
	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (118, 121);
	polygon2.AddVertex (244, 89);
	polygon2.AddVertex (188, 222);
	polygon2.AddVertex (104, 219);
	polygon2.AddVertex (135, 139);
	polygon2.AddVertex (167, 140);
	polygon2.AddVertex (152, 189);
	polygon2.AddVertex (170, 189);
	polygon2.AddVertex (192, 118);
	
	test.Assert (polygon2.IsDiagonal (1, 4) == false);

	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (1, 0);
	polygon3.AddVertex (2, 0);
	polygon3.AddVertex (2, 1);
	polygon3.AddVertex (3, 1);
	polygon3.AddVertex (3, 2);
	polygon3.AddVertex (2, 2);
	polygon3.AddVertex (2, 3);
	polygon3.AddVertex (1, 3);
	polygon3.AddVertex (1, 2);
	polygon3.AddVertex (0, 2);
	polygon3.AddVertex (0, 1);
	polygon3.AddVertex (1, 1);
	
	test.Assert (GetVisibleVertices (polygon3, 0).toString () == [2, 5, 6].toString ());
	test.Assert (GetVisibleVertices (polygon3, 1).toString () == [7, 8, 11].toString ());
	test.Assert (GetVisibleVertices (polygon3, 2).toString () == [0, 4, 5, 7, 8, 9, 11].toString ());
	test.Assert (GetVisibleVertices (polygon3, 3).toString () == [5, 8, 9].toString ());
	test.Assert (GetVisibleVertices (polygon3, 4).toString () == [2, 10, 11].toString ());
	test.Assert (GetVisibleVertices (polygon3, 5).toString () == [0, 2, 3, 7, 8, 10, 11].toString ());
	test.Assert (GetVisibleVertices (polygon3, 6).toString () == [0, 8, 11].toString ());
	test.Assert (GetVisibleVertices (polygon3, 7).toString () == [1, 2, 5].toString ());
	test.Assert (GetVisibleVertices (polygon3, 8).toString () == [1, 2, 3, 5, 6, 10, 11].toString ());
	test.Assert (GetVisibleVertices (polygon3, 10).toString () == [4, 5, 8].toString ());
	test.Assert (GetVisibleVertices (polygon3, 11).toString () == [1, 2, 4, 5, 6, 8, 9].toString ());

	var polygon4 = new JSM.Polygon2D ();
	polygon4.AddVertex (0, 0);
	polygon4.AddVertex (3, 0);
	polygon4.AddVertex (3, 3);
	polygon4.AddVertex (0, 3);
	
	test.Assert (polygon4.SectorPosition (GetSector (0, 0, 1, 1), -1, -1) == JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.Assert (polygon4.SectorPosition (GetSector (0, 0, 1, 1), 0, -1) == JSM.SectorPolygonPosition2D.NoIntersection);
});

polygonSuite.AddTest ('PolygonTriangulationTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (3.0, 0.0, 0.0);
	polygon.AddVertex (3.0, 2.0, 0.0);
	polygon.AddVertex (1.5, 3.0, 0.0);
	polygon.AddVertex (0.0, 2.0, 0.0);
	
	var triangles = JSM.TriangulatePolygon (polygon);
	test.Assert (triangles.length == 3);
	test.Assert (triangles[0].toString () == [0, 1, 2].toString ());
	test.Assert (triangles[1].toString () == [0, 2, 3].toString ());
	test.Assert (triangles[2].toString () == [0, 3, 4].toString ());
});

polygonSuite.AddTest ('PolygonOffsetTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (0.0, 1.0, 0.0);
	
	var offseted = JSM.OffsetPolygonContour (polygon, 0.2);
	test.Assert (offseted.vertices[0].IsEqual (new JSM.Coord (0.2, 0.2, 0.0)));
	test.Assert (offseted.vertices[1].IsEqual (new JSM.Coord (0.8, 0.2, 0.0)));
	test.Assert (offseted.vertices[2].IsEqual (new JSM.Coord (0.8, 0.8, 0.0)));
	test.Assert (offseted.vertices[3].IsEqual (new JSM.Coord (0.2, 0.8, 0.0)));

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 2.0, 0.0);
	
	var offseted = JSM.OffsetPolygonContour (polygon, 0.2);
	test.Assert (offseted.vertices[0].IsEqual (new JSM.Coord (0.32360679774997897, 0.2, 0.0)));
	test.Assert (offseted.vertices[1].IsEqual (new JSM.Coord (1.8, 0.2, 0.0)));
	test.Assert (offseted.vertices[2].IsEqual (new JSM.Coord (1.8, 0.8, 0.0)));
	test.Assert (offseted.vertices[3].IsEqual (new JSM.Coord (0.8, 0.8, 0.0)));
	test.Assert (offseted.vertices[4].IsEqual (new JSM.Coord (0.8, 1.1527864045000422, 0.0)));
});

polygonSuite.AddTest ('BSPTreeTest', function (test)
{
	function TestNode (test, node, vertexCount, normalVector)
	{
		test.Assert (node.polygon.VertexCount () == vertexCount);
		test.Assert (node.plane.GetNormal ().IsEqual (normalVector));
	}

	var bspTree = new JSM.BSPTree ();
	
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (-1, 0, -1);
	polygon.AddVertex (1, 0, -1);
	polygon.AddVertex (1, 0, 1);
	polygon.AddVertex (-1, 0, 1);
	bspTree.AddPolygon (polygon, 0);
	test.Assert (bspTree.NodeCount () == 1);
	
	TestNode (test, bspTree.root, 4, new JSM.Coord (0, -1, 0));
	test.Assert (bspTree.root.userData == 0);
	test.Assert (bspTree.root.inside == null);
	test.Assert (bspTree.root.outside == null);
	
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, -1, -1);
	polygon.AddVertex (0, 1, -1);
	polygon.AddVertex (0, 1, 1);
	polygon.AddVertex (0, -1, 1);
	bspTree.AddPolygon (polygon, 1);
	test.Assert (bspTree.NodeCount () == 3);

	TestNode (test, bspTree.root, 4, new JSM.Coord (0, -1, 0));
	test.Assert (bspTree.root.inside != null);
	test.Assert (bspTree.root.outside != null);
	TestNode (test, bspTree.root.inside, 4, new JSM.Coord (1, 0, 0));
	test.Assert (bspTree.root.inside.userData == 1);
	TestNode (test, bspTree.root.outside, 4, new JSM.Coord (1, 0, 0));
	test.Assert (bspTree.root.outside.userData == 1);

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (-1, -1, 0);
	polygon.AddVertex (1, -1, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (-1, 1, 0);
	bspTree.AddPolygon (polygon, 2);
	test.Assert (bspTree.NodeCount () == 7);

	TestNode (test, bspTree.root, 4, new JSM.Coord (0, -1, 0));
	test.Assert (bspTree.root.inside != null);
	test.Assert (bspTree.root.outside != null);
	TestNode (test, bspTree.root.inside, 4, new JSM.Coord (1, 0, 0));
	TestNode (test, bspTree.root.outside, 4, new JSM.Coord (1, 0, 0));
	
	test.Assert (bspTree.root.inside.inside != null);
	test.Assert (bspTree.root.inside.outside != null);
	TestNode (test, bspTree.root.inside.inside, 4, new JSM.Coord (0, 0, 1));
	test.Assert (bspTree.root.inside.inside.userData == 2);
	TestNode (test, bspTree.root.inside.outside, 4, new JSM.Coord (0, 0, 1));
	test.Assert (bspTree.root.inside.outside.userData == 2);
	
	test.Assert (bspTree.root.outside.inside != null);
	test.Assert (bspTree.root.outside.outside != null);
	TestNode (test, bspTree.root.outside.inside, 4, new JSM.Coord (0, 0, 1));
	test.Assert (bspTree.root.outside.inside.userData == 2);
	TestNode (test, bspTree.root.outside.outside, 4, new JSM.Coord (0, 0, 1));
	test.Assert (bspTree.root.outside.outside.userData == 2);
});

var pathSuite = unitTest.AddTestSuite ('GeometryPath');

pathSuite.AddTest ('BasicPathTest', function (test)
{
	var path = new JSM.Path2D ();
	
	test.Assert (path.GetPolygonCount () == 0);
	path.MoveTo (1, 1);
	path.LineTo (2, 1);
	path.LineTo (2, 2);
	
	test.Assert (path.GetPolygonCount () == 0);
	path.Close ();
	test.Assert (path.GetPolygonCount () == 1);
	test.Assert (path.GetPolygon (0).ContourCount () == 1);
	test.Assert (path.GetPolygon (0).VertexCount () == 3);
	test.Assert (path.GetPolygon (0).GetContour (0).GetVertex (0).IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (path.GetPolygon (0).GetContour (0).GetVertex (1).IsEqual (new JSM.Coord2D (2, 1)));
	test.Assert (path.GetPolygon (0).GetContour (0).GetVertex (2).IsEqual (new JSM.Coord2D (2, 2)));
});

}
