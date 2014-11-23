module.exports = function (unitTest)
{

var generalSuite = unitTest.AddTestSuite ('GeometryGeneral');

generalSuite.AddTest ('VectorTest', function (test) {
	var coord2d1 = new JSM.Coord2D (1, 2);
	var coord2d2 = new JSM.Coord2D (3, 4);
	var coord2d3 = new JSM.Coord2D (1, 6);

	test.Assert (JSM.CoordIsEqual2D (coord2d1, new JSM.Coord2D (1, 2)));
	test.Assert (JSM.CoordIsEqual2D (JSM.MidCoord2D (coord2d1, coord2d2), new JSM.Coord2D (2, 3)));
	test.Assert (JSM.IsEqual (JSM.CoordDistance2D (coord2d1, coord2d2), 2.8284271247));
	test.Assert (JSM.CoordTurnType2D (coord2d1, coord2d2, coord2d3) == 'CounterClockwise');

	var coord1 = new JSM.Coord (1, 2, 3);
	var coord2 = new JSM.Coord (4, 5, 6);

	test.Assert (JSM.CoordIsEqual (coord1, new JSM.Coord (1, 2, 3)));
	test.Assert (JSM.CoordIsEqual (JSM.MidCoord (coord1, coord2), new JSM.Coord (2.5, 3.5, 4.5)));
	test.Assert (JSM.CoordIsEqual (JSM.VectorMultiply (coord1, 3), new JSM.Coord (3, 6, 9)));
	test.Assert (JSM.IsEqual (JSM.VectorDot (coord1, coord2), 32));
	test.Assert (JSM.CoordIsEqual (JSM.VectorCross (coord1, coord2), new JSM.Coord (-3, 6, -3)));
	test.Assert (JSM.IsEqual (JSM.VectorLength (coord1), 3.7416573867));
	test.Assert (JSM.CoordIsEqual (JSM.VectorNormalize (coord1), new JSM.Coord (0.2672612419, 0.5345224838, 0.8017837257)));
	test.Assert (JSM.IsEqual (JSM.VectorLength (JSM.VectorSetLength (coord1, 123)), 123));
	test.Assert (JSM.IsEqual (JSM.CoordDistance (coord1, coord2), 5.1961524227));
	test.Assert (JSM.CoordIsEqual (JSM.CoordAdd (coord1, coord2), new JSM.Coord (5, 7, 9)));
	test.Assert (JSM.CoordIsEqual (JSM.CoordSub (coord1, coord2), new JSM.Coord (-3, -3, -3)));
	test.Assert (JSM.CoordIsEqual (JSM.CoordOffset (coord2, coord1, 5.0), new JSM.Coord (5.3363062095, 7.672612419, 10.0089186285)));
	
	test.Assert (JSM.CoordIsEqual (JSM.CoordOffset (coord1, new JSM.Coord (1.0, 0.0, 0.0), 5.0), new JSM.Coord (6.0, 2.0, 3.0)));
	test.Assert (JSM.CoordIsEqual (JSM.CoordOffset (coord1, new JSM.Coord (0.0, 1.0, 0.0), 5.0), new JSM.Coord (1.0, 7.0, 3.0)));
	test.Assert (JSM.CoordIsEqual (JSM.CoordOffset (coord1, new JSM.Coord (0.0, 0.0, 1.0), 5.0), new JSM.Coord (1.0, 2.0, 8.0)));

	var coord = new JSM.Coord (1.0, 1.0, 1.0);
	var direction = new JSM.Vector (1.0, 0.0, 0.0);
	test.Assert (JSM.CoordIsEqual (JSM.CoordOffset (coord, direction, 1.0), new JSM.Coord (2.0, 1.0, 1.0)));
	
	var coord = new JSM.Coord (1.0, 1.0, 1.0);
	var axis = new JSM.Vector (0.0, 0.0, 1.0);
	var origo = new JSM.Vector (0.0, 0.0, 0.0);
	var angle = 90.0 * JSM.DegRad;
	test.Assert (JSM.CoordIsEqual (JSM.CoordRotate (coord, axis, angle, origo), new JSM.Coord (-1.0, 1.0, 1.0)));

	var vector1 = new JSM.Vector (1.0, 0.0, 0.0);
	var vector2 = new JSM.Vector (0.0, 1.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.GetVectorsAngle (vector1, vector2), 90.0 * JSM.DegRad));

	var vector = new JSM.Vector (1.0, 0.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.VectorLength (vector), 1.0));
	
	var vector = new JSM.Vector (1.0, 2.0, 3.0);
	var multiplied = JSM.VectorMultiply (vector, 2.0);
	test.Assert (JSM.CoordIsEqual (multiplied, new JSM.Coord (2.0, 4.0, 6.0)));
	
	var vector = new JSM.Vector (10.0, 0.0, 0.0);
	var normal = JSM.VectorNormalize (vector);
	test.Assert (JSM.CoordIsEqual (normal, new JSM.Coord (1.0, 0.0, 0.0)));
	
	var another = JSM.VectorSetLength (vector, 5.0);
	test.Assert (JSM.CoordIsEqual (another, new JSM.Coord (5.0, 0.0, 0.0)));

	var cartesian = JSM.SphericalToCartesian (1.0, 0.0, 90.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (cartesian, new JSM.Coord (0.0, 0.0, 1.0)));

	var cartesian = JSM.CylindricalToCartesian (1.0, 1.0, 90.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (cartesian, new JSM.Coord (0.0, 1.0, 1.0)));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	var normal = new JSM.Coord (0.0, 1.0, 0.0);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var coord2D = JSM.GetCoord2DFromCoord (coord, origo, normal);
	test.Assert (JSM.CoordIsEqual2D (coord2D, new JSM.Coord (1.0, -3.0)));

	var coords = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	var normal = JSM.CalculateNormal (coords);
	test.Assert (JSM.CoordIsEqual (normal, new JSM.Coord (0.0, 0.0, 1.0)));
	var centroid = JSM.CalculateCentroid (coords);
	test.Assert (JSM.CoordIsEqual (centroid, new JSM.Coord (0.5, 0.5, 0.0)));
	
	var coords2 = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	var normal2 = JSM.CalculateNormal (coords2);
	test.Assert (JSM.CoordIsEqual (normal2, new JSM.Coord (0.0, 0.0, 1.0)));
	var centroid2 = JSM.CalculateCentroid (coords2);
	test.Assert (JSM.CoordIsEqual (centroid2, new JSM.Coord (0.5, 0.5, 0.0)));

	var coords3 = [
		new JSM.Coord (0.0, 1.0, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.0, 0.0, 0.0)
	];
	var normal3 = JSM.CalculateNormal (coords3);
	test.Assert (JSM.CoordIsEqual (normal3, new JSM.Coord (0.0, 0.0, -1.0)));
	var centroid3 = JSM.CalculateCentroid (coords3);
	test.Assert (JSM.CoordIsEqual (centroid3, new JSM.Coord (0.3, 0.5, 0.0)));

	var vector1 = new JSM.Vector (1.0, 0.0, 0.0);
	var vector2 = new JSM.Vector (0.0, 1.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.GetVectorsAngle (vector1, vector2), Math.PI / 2.0));
	test.Assert (JSM.IsEqual (JSM.GetVectorsAngle (vector2, vector1), Math.PI / 2.0));

	var coord1 = new JSM.Vector (0.0, 0.0, 0.0);
	var coord2 = new JSM.Vector (1.0, 0.0, 0.0);
	var coord3 = new JSM.Vector (0.0, 1.0, 0.0);
	var normal1 = new JSM.Vector (0.0, 0.0, 1.0);
	var normal2 = new JSM.Vector (0.0, 0.0, -1.0);
	var normal3 = new JSM.Vector (0.0, -1.0, -1.0);

	test.Assert (JSM.CoordTurnType (coord1, coord2, coord3, normal1) == 'CounterClockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord2, normal1) == 'Clockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord3, normal1) == 'Collinear');

	test.Assert (JSM.CoordTurnType (coord1, coord2, coord3, normal2) == 'Clockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord2, normal2) == 'CounterClockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord3, normal2) == 'Collinear');

	test.Assert (JSM.CoordTurnType (coord1, coord2, coord3, normal3) == 'Clockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord2, normal3) == 'CounterClockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord3, normal3) == 'Collinear');

	var coord1 = new JSM.Vector (0.0, 0.0, 0.0);
	var coord2 = new JSM.Vector (1.0, 0.0, 0.0);
	var coord3 = new JSM.Vector (0.0, 0.0, 1.0);
	var normal1 = new JSM.Vector (0.0, 1.0, 0.0);
	var normal2 = new JSM.Vector (0.0, -1.0, 0.0);

	test.Assert (JSM.CoordTurnType (coord1, coord2, coord3, normal2) == 'CounterClockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord2, normal2) == 'Clockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord3, normal2) == 'Collinear');

	test.Assert (JSM.CoordTurnType (coord1, coord2, coord3, normal1) == 'Clockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord2, normal1) == 'CounterClockwise');
	test.Assert (JSM.CoordTurnType (coord1, coord3, coord3, normal1) == 'Collinear');
	
	var coord1 = new JSM.Vector (0.0, 0.0, 0.0);
	var coord2 = new JSM.Vector (1.0, 0.0, 0.0);
	var coord3 = new JSM.Vector (-1.0, 0.0, 0.0);
	test.Assert (JSM.IsEqual (JSM.CoordSignedDistance (coord1, coord2, JSM.CoordSub (coord2, coord1)), 1.0));
	test.Assert (JSM.IsEqual (JSM.CoordSignedDistance (coord1, coord3, JSM.CoordSub (coord1, coord3)), -1.0));
	
	var coord = new JSM.Coord2D (1.0, 2.0);
	test.Assert (!JSM.CoordIsEqual2DWithEps (coord, new JSM.Coord2D (1.0, 3.0), 0.1));
	test.Assert (!JSM.CoordIsEqual2DWithEps (coord, new JSM.Coord2D (2.0, 2.0), 0.1));
	test.Assert (JSM.CoordIsEqual2DWithEps (coord, new JSM.Coord2D (1.0, 3.0), 1.1));
	test.Assert (JSM.CoordIsEqual2DWithEps (coord, new JSM.Coord2D (2.0, 2.0), 1.1));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	test.Assert (!JSM.CoordIsEqualWithEps (coord, new JSM.Coord (1.0, 2.0, 4.0), 0.1));
	test.Assert (!JSM.CoordIsEqualWithEps (coord, new JSM.Coord (1.0, 3.0, 3.0), 0.1));
	test.Assert (!JSM.CoordIsEqualWithEps (coord, new JSM.Coord (2.0, 2.0, 3.0), 0.1));
	test.Assert (JSM.CoordIsEqualWithEps (coord, new JSM.Coord (1.0, 2.0, 4.0), 1.1));
	test.Assert (JSM.CoordIsEqualWithEps (coord, new JSM.Coord (1.0, 3.0, 3.0), 1.1));
	test.Assert (JSM.CoordIsEqualWithEps (coord, new JSM.Coord (2.0, 2.0, 3.0), 1.1));
});

generalSuite.AddTest ('TriangleNormalTest', function (test) {
	test.Assert (JSM.CoordIsEqual (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 0.0)), new JSM.Vector (0.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, -1.0, 0.0)), new JSM.Vector (0.0, 0.0, -1.0)));
	
	test.Assert (JSM.CoordIsEqual (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 1.0, 1.0)), new JSM.Vector (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 1.0, -1.0)), new JSM.Vector (-1.0, 0.0, 0.0)));

	test.Assert (JSM.CoordIsEqual (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, -1.0)), new JSM.Vector (0.0, 1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.CalculateTriangleNormal (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 1.0)), new JSM.Vector (0.0, -1.0, 0.0)));
});

generalSuite.AddTest ('SphericalTest', function (test) {
	function TestConversion (x, y, z) {
		var original = new JSM.Coord (x, y, z);
		
		var spherical = JSM.CartesianToSpherical (original.x, original.y, original.z);
		var cartesian = JSM.SphericalToCartesian (spherical.radius, spherical.theta, spherical.phi);
		test.Assert (JSM.CoordIsEqual (original, cartesian));
		
		var origo = new JSM.Coord (1.0, 2.0, 3.0);
		var spherical = JSM.CartesianToSphericalWithOrigo (original, origo);
		var cartesian = JSM.SphericalToCartesianWithOrigo (spherical, origo);
		test.Assert (JSM.CoordIsEqual (original, cartesian));
	}

	var x, y, z;
	for (x = -1.0; x <= 1.0; x = x + 1.0) {
		for (y = -1.0; y <= 1.0; y = y + 1.0) {
			for (z = -1.0; z <= 1.0; z = z + 1.0) {
				TestConversion (x, y, z);
			}
		}
	}
	
	var coord = new JSM.Coord (1.0, 0.0, 0.0);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0)));
	
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 45.0 * JSM.DegRad), new JSM.Coord (0.7071067811865569, 0.7071067811865381, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 90.0 * JSM.DegRad), new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 180.0 * JSM.DegRad), new JSM.Coord (-1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 270.0 * JSM.DegRad), new JSM.Coord (0.0, -1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 360.0 * JSM.DegRad), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 450.0 * JSM.DegRad), new JSM.Coord (0.0, 1.0, 0.0)));
	
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, -45.0 * JSM.DegRad), new JSM.Coord (0.7071067811865569, -0.7071067811865381, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, -90.0 * JSM.DegRad), new JSM.Coord (0.0, -1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, -180.0 * JSM.DegRad), new JSM.Coord (-1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, -270.0 * JSM.DegRad), new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, -360.0 * JSM.DegRad), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, -450.0 * JSM.DegRad), new JSM.Coord (0.0, -1.0, 0.0)));

	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 90.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, -1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 180.0 * JSM.DegRad, 0.0), new JSM.Coord (-1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 270.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 360.0 * JSM.DegRad, 0.0), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 450.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, -1.0)));

	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, -90.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, -180.0 * JSM.DegRad, 0.0), new JSM.Coord (-1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, -270.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, -1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, -360.0 * JSM.DegRad, 0.0), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, -450.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, 1.0)));
	
	var coord = new JSM.Coord (2.0, 0.0, 0.0);
	var origo = new JSM.Coord (1.0, 0.0, 0.0);
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 0.0), new JSM.Coord (2.0, 0.0, 0.0)));

	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 45.0 * JSM.DegRad), new JSM.Coord (1.7071067811865569, 0.7071067811865381, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 90.0 * JSM.DegRad), new JSM.Coord (1.0, 1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 180.0 * JSM.DegRad), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 270.0 * JSM.DegRad), new JSM.Coord (1.0, -1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 360.0 * JSM.DegRad), new JSM.Coord (2.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 0.0, 450.0 * JSM.DegRad), new JSM.Coord (1.0, 1.0, 0.0)));

	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 90.0 * JSM.DegRad, 0.0), new JSM.Coord (1.0, 0.0, -1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 180.0 * JSM.DegRad, 0.0), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 270.0 * JSM.DegRad, 0.0), new JSM.Coord (1.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 360.0 * JSM.DegRad, 0.0), new JSM.Coord (2.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (JSM.MoveCoordOnSphere (coord, origo, 450.0 * JSM.DegRad, 0.0), new JSM.Coord (1.0, 0.0, -1.0)));

	var current = new JSM.Coord (1.0, 0.0, 0.0);
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (current, new JSM.Coord (0.0, 1.0, 0.0)));
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (current, new JSM.Coord (-1.0, 0.0, 0.0)));
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (current, new JSM.Coord (0.0, -1.0, 0.0)));
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (current, new JSM.Coord (1.0, 0.0, 0.0)));
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	current = JSM.MoveCoordOnSphere (current, origo, 0.0, 45.0 * JSM.DegRad);
	test.Assert (JSM.CoordIsEqual (current, new JSM.Coord (0.0, 1.0, 0.0)));
});

generalSuite.AddTest ('CircleTest', function (test) {
	test.Assert (JSM.CoordIsEqual2D (JSM.PolarToCartesian (1.0, 0.0 * JSM.DegRad), new JSM.Coord2D (1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual2D (JSM.PolarToCartesian (1.0, 90.0 * JSM.DegRad), new JSM.Coord2D (0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual2D (JSM.PolarToCartesian (1.0, 180.0 * JSM.DegRad), new JSM.Coord2D (-1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual2D (JSM.PolarToCartesian (1.0, 270.0 * JSM.DegRad), new JSM.Coord2D (0.0, -1.0)));
	test.Assert (JSM.CoordIsEqual2D (JSM.PolarToCartesian (1.0, 360.0 * JSM.DegRad), new JSM.Coord2D (1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual2D (JSM.PolarToCartesian (1.0, 450.0 * JSM.DegRad), new JSM.Coord2D (0.0, 1.0)));
	
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
		test.Assert (JSM.IsEqual (JSM.GetVectorsFullAngle (JSM.CoordRotate (v1, normal, i, origo), v2, normal), i));
	}
});

generalSuite.AddTest ('TransformationTest', function (test) {
	var transformation = new JSM.IdentityTransformation ();
	
	var coord = new JSM.Coord (1.0, 1.0, 1.0);
	var direction = new JSM.Vector (1.0, 0.0, 0.0);
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (1.0, 1.0, 1.0)));

	transformation = JSM.OffsetTransformation (direction, 1.0);
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (2.0, 1.0, 1.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (1.0, 2.0, 3.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (2.0, 3.0, 4.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (1.0, 0.0, 0.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (2.0, 1.0, 1.0)));
	transformation = JSM.TranslationTransformation (new JSM.Coord (-1.0, 0.0, 0.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (0.0, 1.0, 1.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, 1.0, 0.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (1.0, 2.0, 1.0)));
	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, -1.0, 0.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (1.0, 0.0, 1.0)));

	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, 0.0, 1.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (1.0, 1.0, 2.0)));
	transformation = JSM.TranslationTransformation (new JSM.Coord (0.0, 0.0, -1.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (1.0, 1.0, 0.0)));

	var axis = new JSM.Vector (0.0, 0.0, 1.0);
	var angle = 90.0 * JSM.DegRad;
	transformation = JSM.RotationTransformation (axis, angle);
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (-1.0, 1.0, 1.0)));
	transformation = JSM.RotationZTransformation (angle);
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (-1.0, 1.0, 1.0)));
	
	var trX = new JSM.RotationXTransformation (angle);
	var trY = new JSM.RotationYTransformation (angle);
	var trZ = new JSM.RotationZTransformation (angle);
	
	var axisX = new JSM.Vector (1.0, 0.0, 0.0);
	var axisY = new JSM.Vector (0.0, 1.0, 0.0);
	var axisZ = new JSM.Vector (0.0, 0.0, 1.0);
	
	var trRotX = new JSM.RotationTransformation (axisX, angle);
	var trRotY = new JSM.RotationTransformation (axisY, angle);
	var trRotZ = new JSM.RotationTransformation (axisZ, angle);

	test.Assert (JSM.CoordIsEqual (trX.Apply (coord), trRotX.Apply (coord)));
	test.Assert (JSM.CoordIsEqual (trY.Apply (coord), trRotY.Apply (coord)));
	test.Assert (JSM.CoordIsEqual (trZ.Apply (coord), trRotZ.Apply (coord)));

	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	trRotX = new JSM.RotationTransformation (axisX, angle, origo);
	trRotY = new JSM.RotationTransformation (axisY, angle, origo);
	trRotZ = new JSM.RotationTransformation (axisZ, angle, origo);

	test.Assert (JSM.CoordIsEqual (trX.Apply (coord), trRotX.Apply (coord)));
	test.Assert (JSM.CoordIsEqual (trY.Apply (coord), trRotY.Apply (coord)));
	test.Assert (JSM.CoordIsEqual (trZ.Apply (coord), trRotZ.Apply (coord)));

	var origo = new JSM.Coord (1.0, 2.0, 3.0);
	var trXOrigo = new JSM.RotationXTransformation (angle, origo);
	var trYOrigo = new JSM.RotationYTransformation (angle, origo);
	var trZOrigo = new JSM.RotationZTransformation (angle, origo);

	var trRotXOrigo = new JSM.RotationTransformation (axisX, angle, origo);
	var trRotYOrigo = new JSM.RotationTransformation (axisY, angle, origo);
	var trRotZOrigo = new JSM.RotationTransformation (axisZ, angle, origo);

	test.Assert (JSM.CoordIsEqual (trXOrigo.Apply (coord), trRotXOrigo.Apply (coord)));
	test.Assert (JSM.CoordIsEqual (trYOrigo.Apply (coord), trRotYOrigo.Apply (coord)));
	test.Assert (JSM.CoordIsEqual (trZOrigo.Apply (coord), trRotZOrigo.Apply (coord)));

	var coord = new JSM.Coord (2.0, 0.0, 0.0);
	transformation = new JSM.RotationZTransformation (90.0 * JSM.DegRad, new JSM.Coord (0.0, 0.0, 0.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (0.0, 2.0, 0.0)));
	transformation = new JSM.RotationZTransformation (90.0 * JSM.DegRad, new JSM.Coord (1.0, 0.0, 0.0));
	test.Assert (JSM.CoordIsEqual (transformation.Apply (coord), new JSM.Coord (1.0, 1.0, 0.0)));

	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	var axis = new JSM.Vector (4.0, 5.0, 6.0);
	var angle = 7.0 * JSM.DegRad;
	var origo = new JSM.Coord (8.0, 9.0, 10.0);
	transformation = new JSM.RotationTransformation (axis, angle, origo);
	test.Assert (JSM.CoordIsEqual (JSM.CoordRotate (coord, axis, angle, origo), transformation.Apply (coord)));
	
	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	var direction = new JSM.Coord (4.0, 5.0, 6.0);
	var axis = new JSM.Vector (4.0, 5.0, 6.0);
	var angle = 7.0 * JSM.DegRad;
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var result1 = coord;
	result1 = JSM.CoordOffset (result1, direction, 11.0);
	result1 = JSM.CoordRotate (result1, axis, angle, origo);
	
	var offsetTransformation = new JSM.OffsetTransformation (direction, 11.0);
	var rotateTransformation = new JSM.RotationTransformation (axis, angle, origo);
	
	var transformation = new JSM.Transformation ();
	transformation.Append (offsetTransformation);
	transformation.Append (rotateTransformation);
	
	var result2 = transformation.Apply (coord);
	test.Assert (JSM.CoordIsEqual (result1, result2));

	var trX = new JSM.RotationXTransformation (10 * JSM.DegRad);
	var trY = new JSM.RotationYTransformation (20 * JSM.DegRad);
	var trZ = new JSM.RotationZTransformation (30 * JSM.DegRad);
	var trXYZ = new JSM.RotationXYZTransformation (10 * JSM.DegRad, 20 * JSM.DegRad, 30 * JSM.DegRad);
	
	var coord = new JSM.Coord (1.0, 2.0, 3.0);
	coord = trX.Apply (coord);
	coord = trY.Apply (coord);
	coord = trZ.Apply (coord);
	
	test.Assert (JSM.CoordIsEqual (trXYZ.Apply (new JSM.Coord (1.0, 2.0, 3.0)), coord));
});

generalSuite.AddTest ('SectorTest', function (test) {
	var beg = new JSM.Coord2D (1.0, 2.0);
	var end = new JSM.Coord2D (3.0, 4.0);
	
	var sector = new JSM.Sector2D (beg, end);
	test.Assert (JSM.CoordIsEqual2D (sector.beg, new JSM.Coord2D (1.0, 2.0)));
	test.Assert (JSM.CoordIsEqual2D (sector.end, new JSM.Coord2D (3.0, 4.0)));
	
	sector.Set (end, beg);
	test.Assert (JSM.CoordIsEqual2D (sector.beg, new JSM.Coord2D (3.0, 4.0)));
	test.Assert (JSM.CoordIsEqual2D (sector.end, new JSM.Coord2D (1.0, 2.0)));

	var beg = new JSM.Coord (1.0, 2.0, 3.0);
	var end = new JSM.Coord (4.0, 5.0, 6.0);
	
	var sector = new JSM.Sector (beg, end);
	test.Assert (JSM.CoordIsEqual (sector.beg, new JSM.Coord (1.0, 2.0, 3.0)));
	test.Assert (JSM.CoordIsEqual (sector.end, new JSM.Coord (4.0, 5.0, 6.0)));
	
	sector.Set (end, beg);
	test.Assert (JSM.CoordIsEqual (sector.beg, new JSM.Coord (4.0, 5.0, 6.0)));
	test.Assert (JSM.CoordIsEqual (sector.end, new JSM.Coord (1.0, 2.0, 3.0)));
});

generalSuite.AddTest ('CoordLinePositionTest', function (test)
{
	var start2D = new JSM.Coord2D (1.0, 1.0);
	var direction2D = new JSM.Coord2D (1.0, 0.0);
	var line2D = new JSM.Line2D (start2D, direction2D);
	test.Assert (JSM.CoordLinePosition2D (new JSM.Coord2D (0.0, 0.0), line2D) == 'CoordAtLineRight');
	test.Assert (JSM.CoordLinePosition2D (new JSM.Coord2D (0.0, 2.0), line2D) == 'CoordAtLineLeft');
	test.Assert (JSM.CoordLinePosition2D (new JSM.Coord2D (0.0, 1.0), line2D) == 'CoordOnLine');

	var start = new JSM.Coord (1.0, 1.0, 1.0);
	var direction = new JSM.Coord (1.0, 0.0, 0.0);
	var line = new JSM.Line (start, direction);

	var projected = new JSM.Coord (0.0, 0.0, 0.0);
	test.Assert (JSM.CoordLinePosition (new JSM.Coord (0.0, 0.0, 0.0), line, projected) == 'CoordOutsideOfLine');
	test.Assert (JSM.CoordIsEqual (projected, new JSM.Coord (0.0, 1.0, 1.0)));
	test.Assert (JSM.CoordLinePosition (new JSM.Coord (1.0, 1.0, 1.0), line, projected) == 'CoordOnLine');
	test.Assert (JSM.CoordIsEqual (projected, new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (JSM.CoordLinePosition (new JSM.Coord (2.0, 1.0, 1.0), line, projected) == 'CoordOnLine');
	test.Assert (JSM.CoordIsEqual (projected, new JSM.Coord (2.0, 1.0, 1.0)));

	test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToLine (new JSM.Coord (0.0, 0.0, 0.0), line), new JSM.Coord (0.0, 1.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToLine (new JSM.Coord (1.0, 1.0, 1.0), line), new JSM.Coord (1.0, 1.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToLine (new JSM.Coord (2.0, 1.0, 1.0), line), new JSM.Coord (2.0, 1.0, 1.0)));
	
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
	test.Assert (JSM.LineLinePosition (line1, line1, intersection) == 'LinesIntersectsCoincident');
	test.Assert (JSM.LineLinePosition (line1, line2, intersection) == 'LinesIntersectsCoincident');
	test.Assert (JSM.LineLinePosition (line1, line7, intersection) == 'LinesIntersectsCoincident');
	test.Assert (JSM.LineLinePosition (line2, line7, intersection) == 'LinesIntersectsCoincident');
	test.Assert (JSM.LineLinePosition (line3, line7, intersection) == 'LinesDontIntersects');
	test.Assert (JSM.LineLinePosition (line4, line7, intersection) == 'LinesDontIntersects');
	test.Assert (JSM.LineLinePosition (line5, line7, intersection) == 'LinesDontIntersects');
	test.Assert (JSM.LineLinePosition (line6, line7, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (JSM.LineLinePosition (line1, line3, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line1, line4, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (2.0, 0.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line1, line5, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line2, line3, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line2, line4, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (2.0, 1.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line2, line5, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (1.0, 1.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line5, line6, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.LineLinePosition (line6, line7, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (JSM.LineLinePosition (line8, line9, intersection) == 'LinesIntersectsOnePoint');
	test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (0.5, 0.5, 0.5)));
});

generalSuite.AddTest ('CoordSectorPositionTest', function (test)
{
	var sector1 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0));
	var sector2 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 0.0));
	var sector3 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 1.0));
	var sector4 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (42.0, 0.0, 0.0));
	
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 1.0), sector1) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, -1.0), sector1) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.25, 0.0, 0.0), sector1) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.5, 0.0, 0.0), sector1) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.75, 0.0, 0.0), sector1) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 0.0), sector1) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.0, 0.0, 0.0), sector1) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (-0.1, 0.0, 0.0), sector1) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.1, 0.0, 0.0), sector1) == 'CoordOutsideOfSector');
	
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.0, 0.0, 0.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 0.0), sector2) == 'CoordOnSectorEndCoord');
    
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 1.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, -1.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.25, 0.0, 0.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.5, 0.0, 0.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.75, 0.0, 0.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 0.0), sector3) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.0, 1.0, 1.0), sector3) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.0, 0.0, 0.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (-0.1, 0.0, 0.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.1, 0.0, 0.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.5, 0.5, 0.5), sector3) == 'CoordInsideOfSector');
	
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 1.0), sector4) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, -1.0), sector4) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.25, 0.0, 0.0), sector4) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.5, 0.0, 0.0), sector4) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.75, 0.0, 0.0), sector4) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (0.0, 0.0, 0.0), sector4) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.0, 0.0, 0.0), sector4) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (-0.1, 0.0, 0.0), sector4) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (1.1, 0.0, 0.0), sector4) == 'CoordInsideOfSector');	
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (42, 0.0, 0.0), sector4) == 'CoordOnSectorEndCoord');	
	test.Assert (JSM.CoordSectorPosition (new JSM.Coord (42.1, 0.0, 0.0), sector4) == 'CoordOutsideOfSector');	
});

generalSuite.AddTest ('CoordSectorPosition2DTest', function (test)
{
	var coord = new JSM.Coord2D (1.0, 0.0);
	var sector = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));
	test.Assert (JSM.CoordSectorPosition2D (coord, sector) == 'CoordOutsideOfSector');

	var sector1 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (4.0, 3.0));
	var sector3 = new JSM.Sector2D (new JSM.Coord2D (1.0, 1.0), new JSM.Coord2D (3.0, 1.0));
	var sector4 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));

	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (0.0, 0.0), sector1) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.0, 2.0), sector1) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.0, 2.001), sector1) == 'CoordOutsideOfSector');

	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (0.0, 0.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (7.0, 5.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (-2.0, 2.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (2.0, 2.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (3.0, 2.5), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (2.0, 3.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (3.0, 3.0), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.0, 2.0), sector2) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (4.0, 3.0), sector2) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (2.5, 2.5), sector2) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.75, 2.25), sector2) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (2.5, 2.501), sector2) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.75, 2.26), sector2) == 'CoordOutsideOfSector');

	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (4.0, 1.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (3.001, 1.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (0.0, 1.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (0.999, 1.0), sector3) == 'CoordOutsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.0, 1.0), sector3) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (3.0, 1.0), sector3) == 'CoordOnSectorEndCoord');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.1, 1.0), sector3) == 'CoordInsideOfSector');
	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (1.123456789, 1.0), sector3) == 'CoordInsideOfSector');

	test.Assert (JSM.CoordSectorPosition2D (new JSM.Coord2D (0.0, 0.0), sector4) == 'CoordOutsideOfSector');
});

generalSuite.AddTest ('SectorSectorPositionTest', function (test)
{
	var GetSector2D = function (a, b, c, d)
	{
		return new JSM.Sector2D (new JSM.Coord2D (a, b), new JSM.Coord2D (c, d));
	}

	var sector1 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (0.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	test.Assert (JSM.SectorSectorPosition2D (sector1, sector2) == 'SectorsDontIntersects');

	var sector1 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (1.0, 2.0));
	var sector2 = new JSM.Sector2D (new JSM.Coord2D (1.0, 2.0), new JSM.Coord2D (4.0, 3.0));
	var sector3 = new JSM.Sector2D (new JSM.Coord2D (1.0, 1.0), new JSM.Coord2D (3.0, 1.0));
	var sector4 = new JSM.Sector2D (new JSM.Coord2D (0.0, 1.0), new JSM.Coord2D (1.0, 1.0));

	var intersection = new JSM.Coord2D (0.0, 0.0);
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 0.0, 0.0, 1.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 0.0, 1.0, 0.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 0.0, 1.0, 1.0), intersection) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.CoordIsEqual2D (intersection, new JSM.Coord2D (1.0, 1.0)));
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 0.0, 3.0, 1.0), intersection) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.CoordIsEqual2D (intersection, new JSM.Coord2D (3.0, 1.0)));
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (1.0, 1.0, 3.0, 1.0)) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (3.0, 1.0, 1.0, 1.0)) == 'SectorsIntersectsCoincident');

	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (1.0, 0.0, 1.0, 1.0)) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (1.0, 0.0, 1.0, 2.0)) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (3.0, 0.0, 3.0, 1.0)) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (3.0, 0.0, 3.0, 2.0)) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (2.0, 0.0, 4.0, 2.0)) == 'SectorsIntersectsEndPoint');

	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (-1.0, 1.0, 0.0, 1.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (4.0, 1.0, 5.0, 1.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 0.0, 2.0, 0.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (1.0, 0.0, 3.0, 0.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (1.0, 2.0, 3.0, 2.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 1.0, 1.0, 1.0)) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (3.0, 1.0, 4.0, 1.0)) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (0.0, 1.0, 2.0, 1.0)) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (2.0, 1.0, 2.5, 1.0)) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (2.0, 1.0, 3.0, 1.0)) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (2.0, 1.0, 4.0, 1.0)) == 'SectorsIntersectsCoincident');

	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (4.0, 1.0, 5.0, 1.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (sector3, GetSector2D (-1.0, 1.0, -3.0, 1.0)) == 'SectorsDontIntersects');

	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (-1.0, 1.0, 0.0, 1.0), sector3) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (4.0, 1.0, 5.0, 1.0), sector3) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (0.0, 0.0, 2.0, 0.0), sector3) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (1.0, 0.0, 3.0, 0.0), sector3) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (1.0, 2.0, 3.0, 2.0), sector3) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (0.0, 1.0, 1.0, 1.0), sector3) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (3.0, 1.0, 4.0, 1.0), sector3) == 'SectorsIntersectsEndPoint');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (0.0, 1.0, 2.0, 1.0), sector3) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (2.0, 1.0, 2.5, 1.0), sector3) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (2.0, 1.0, 3.0, 1.0), sector3) == 'SectorsIntersectsCoincident');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (2.0, 1.0, 4.0, 1.0), sector3) == 'SectorsIntersectsCoincident');
	
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (0.0, 0.0, 1.0, 1.0), GetSector2D (3.0, 0.0, 3.0, 3.0)) == 'SectorsDontIntersects');
	test.Assert (JSM.SectorSectorPosition2D (GetSector2D (3.0, 0.0, 3.0, 3.0), GetSector2D (0.0, 0.0, 1.0, 1.0)) == 'SectorsDontIntersects');
});

generalSuite.AddTest ('BoxTest', function (test)
{
	var box = new JSM.Box2D (new JSM.Coord2D (0.0, 0.0), new JSM.Coord2D (1.0, 1.0));
	test.Assert (JSM.CoordIsEqual2D (box.GetCenter (), new JSM.Coord2D (0.5, 0.5)));

	var box = new JSM.Box (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 1.0, 1.0));
	test.Assert (JSM.CoordIsEqual (box.GetCenter (), new JSM.Coord (0.5, 0.5, 0.5)));

	var box2 = new JSM.Box (new JSM.Coord (-0.5, -0.5, -0.5), new JSM.Coord (0.5, 0.5, 0.5));
	var box3 = JSM.BoxUnion (box, box2);
	test.Assert (JSM.CoordIsEqual (box3.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (box3.max, new JSM.Coord (1.0, 1.0, 1.0)));
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
	
		test.Assert (JSM.CoordPlanePosition (coord1, plane1) == 'CoordOnPlane');
		test.Assert (JSM.CoordPlanePosition (coord1, plane2) == 'CoordOnPlane');
		test.Assert (JSM.CoordPlanePosition (coord1b, plane3) == 'CoordInFrontOfPlane');
		test.Assert (JSM.CoordPlanePosition (coord1, plane3) == 'CoordAtBackOfPlane');

		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (1.0, 0.0, 0.0), plane1), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (1.0, 0.0, 0.0), plane2), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (0.0, 0.0, 1.0), plane3), -1.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1, new JSM.Coord (0.0, 1.0, 1.0), plane3), -1.4142135623));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneSignedDirectionalDistance (coord1b, new JSM.Coord (0.0, 1.0, 1.0), plane3), 1.4142135623));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDirectionalDistance (coord1, new JSM.Coord (0.0, 1.0, 1.0), plane3), 1.4142135623));
		
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord1, plane1), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord1, plane2), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord1, plane3), 1.0));

		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord2, plane1), 0.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord2, plane2), 1.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord2, plane3), 1.0));

		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord3, plane1), 1.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord3, plane2), 1.0));
		test.Assert (JSM.IsEqual (JSM.CoordPlaneDistance (coord3, plane3), 0.0));
		
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord1, plane1), new JSM.Coord (0.0, 0.0, 0.0)));
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord1, plane2), new JSM.Coord (0.0, 0.0, 0.0)));
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord1, plane3), new JSM.Coord (0.0, 0.0, 1.0)));

		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord2, plane1), new JSM.Coord (1.0, 0.0, 0.0)));
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord2, plane2), new JSM.Coord (0.0, 0.0, 0.0)));
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord2, plane3), new JSM.Coord (1.0, 0.0, 1.0)));

		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord3, plane1), new JSM.Coord (1.0, 1.0, 0.0)));
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord3, plane2), new JSM.Coord (0.0, 1.0, 1.0)));
		test.Assert (JSM.CoordIsEqual (JSM.ProjectCoordToPlane (coord3, plane3), new JSM.Coord (1.0, 1.0, 1.0)));
		
		var line1 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
		var line2 = new JSM.Line (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
		var line3 = new JSM.Line (new JSM.Coord (1.0, 2.0, 3.0), new JSM.Vector (0.0, 0.0, 1.0));
		test.Assert (JSM.LinePlanePosition (line1, plane1) == 'LineParallelToPlane');
		test.Assert (JSM.LinePlanePosition (line2, plane1) == 'LineIntersectsPlane');
		
		var intersection = new JSM.Coord (0.0, 0.0, 0.0);
		test.Assert (JSM.LinePlanePosition (line3, plane1, intersection) == 'LineIntersectsPlane');
		test.Assert (JSM.CoordIsEqual (intersection, new JSM.Coord (1.0, 2.0, 0.0)));
		test.Assert (JSM.CoordIsEqual (JSM.LinePlaneIntersection (line3, plane1), new JSM.Coord (1.0, 2.0, 0.0)));
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
	var octree = new JSM.Octree (new JSM.Box (new JSM.Coord (-1.0, -1.0, -1.0), new JSM.Coord (1.0, 1.0, 1.0)));
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

var polygonSuite = unitTest.AddTestSuite ('GeometryPolygon');

polygonSuite.AddTest ('PolygonTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (JSM.IsEqual (JSM.PolygonSignedArea2D (polygon), 0.5));
	test.Assert (JSM.PolygonOrientation2D (polygon) == 'CounterClockwise');
	test.Assert (JSM.PolygonComplexity2D (polygon) == 'Convex');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.2, 0.2), polygon) == 'CoordInsideOfPolygon');
	
	JSM.ChangePolygonOrientation2D (polygon);
	test.Assert (JSM.IsEqual (JSM.PolygonSignedArea2D (polygon), -0.5));
	test.Assert (JSM.PolygonOrientation2D (polygon) == 'Clockwise');
	test.Assert (JSM.PolygonComplexity2D (polygon) == 'Convex');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.2, 0.2), polygon) == 'CoordInsideOfPolygon');
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (JSM.IsPolygonVertexVisible2D (polygon, 0, 2) == true);
	
	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (triangles.length == 2);
	test.Assert (triangles[0].toString () == '0,1,2');
	test.Assert (triangles[1].toString () == '0,2,3');
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles) == true);

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (0.0, 1.0, 0.0);
	var triangles = JSM.PolygonTriangulate (polygon);
	test.Assert (triangles.length == 2);
	test.Assert (triangles[0].toString () == '0,1,2');
	test.Assert (triangles[1].toString () == '0,2,3');
	
	var vertices = [
		new JSM.Coord2D (-0.5, -0.5),
		new JSM.Coord2D (0.5, -0.5),
		new JSM.Coord2D (0.5, 0.5),
		new JSM.Coord2D (0.0, 0.5),
		new JSM.Coord2D (0.0, 0.0),
		new JSM.Coord2D (-0.5, 0.0)	
	]
	
	var polygon = JSM.CreatePolygonFromVertices (vertices);
	test.Assert (polygon.VertexCount () == 6);
	
	vertices[0].x = 1.0;
	vertices[0].y = 1.0;

	test.Assert (polygon.GetVertex (0).x == -0.5 && polygon.GetVertex (0).y == -0.5);
	
	var vertices = [
		new JSM.Coord2D (-0.5, 0.0),
		new JSM.Coord2D (0.0, 0.0),
		new JSM.Coord2D (0.0, 0.5),
		new JSM.Coord2D (0.5, 0.5),
		new JSM.Coord2D (0.5, -0.5),
		new JSM.Coord2D (-0.5, -0.5),
	];
	
	var polygon = JSM.CreatePolygonFromVertices (vertices);
	test.Assert (JSM.PolygonOrientation2D (polygon) == 'Clockwise');

	var polygon = JSM.CreateCCWPolygonFromVertices (vertices);
	test.Assert (JSM.PolygonOrientation2D (polygon) == 'CounterClockwise');
});

polygonSuite.AddTest ('ContourPolygon2DTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	test.Assert (polygon.ContourCount () == 0);
	test.Assert (polygon.VertexCount (0) == 0);
	test.Assert (polygon.VertexCount (1) == 0);
	test.Assert (polygon.VertexCount (2) == 0);
	
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (0, 1, 0);
	polygon.AddVertex (0, 1, 1);
	test.Assert (polygon.ContourCount () == 1);
	test.Assert (polygon.VertexCount (0) == 3);
	test.Assert (polygon.VertexCount (1) == 0);
	test.Assert (polygon.VertexCount (2) == 0);

	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (1, 2, 0);
	polygon.AddVertex (1, 2, 2);
	test.Assert (polygon.ContourCount () == 2);
	test.Assert (polygon.VertexCount (0) == 3);
	test.Assert (polygon.VertexCount (1) == 3);
	test.Assert (polygon.VertexCount (2) == 0);

	polygon.AddContour ();
	test.Assert (polygon.ContourCount () == 3);
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 3, 0);
	polygon.AddVertex (2, 3, 3);
	test.Assert (polygon.ContourCount () == 3);
	test.Assert (polygon.VertexCount (0) == 3);
	test.Assert (polygon.VertexCount (1) == 3);
	test.Assert (polygon.VertexCount (2) == 3);

	test.Assert (JSM.CoordIsEqual2D (polygon.GetVertex (0, 1), new JSM.Coord2D (1, 0)));
	test.Assert (JSM.CoordIsEqual2D (polygon.GetVertex (1, 1), new JSM.Coord2D (2, 0)));
	test.Assert (JSM.CoordIsEqual2D (polygon.GetVertex (2, 1), new JSM.Coord2D (3, 0)));
	
	var cloned = polygon.Clone ();
	test.Assert (cloned.ContourCount () == 3);
	test.Assert (cloned.VertexCount (0) == 3);
	test.Assert (cloned.VertexCount (1) == 3);
	test.Assert (cloned.VertexCount (2) == 3);

	test.Assert (JSM.CoordIsEqual2D (cloned.GetVertex (0, 1), new JSM.Coord2D (1, 0)));
	test.Assert (JSM.CoordIsEqual2D (cloned.GetVertex (1, 1), new JSM.Coord2D (2, 0)));
	test.Assert (JSM.CoordIsEqual2D (cloned.GetVertex (2, 1), new JSM.Coord2D (3, 0)));

	cloned.SetVertex (1, 1, 5, 6);
	test.Assert (JSM.CoordIsEqual2D (polygon.GetVertex (1, 1), new JSM.Coord2D (2, 0)));
	test.Assert (JSM.CoordIsEqual2D (cloned.GetVertex (1, 1), new JSM.Coord2D (5, 6)));
	
	polygon.Clear ();
	test.Assert (polygon.ContourCount () == 0);
	test.Assert (polygon.VertexCount (0) == 0);
	test.Assert (polygon.VertexCount (1) == 0);
	test.Assert (polygon.VertexCount (2) == 0);
});

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

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.0, 0.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.5, 5.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.0, 3.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.0, 4.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (3.0, 0.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (2.5, 0.5), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (4.0, 2.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (-1.0, 1.0), polygon) == 'CoordOutsideOfPolygon');

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.0, 1.5), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.5, 1.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.0, 0.5), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 0.0), polygon) == 'CoordOnPolygonEdge');

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.0, 2.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.0, 1.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.0, 1.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (3.0, 2.0), polygon) == 'CoordOnPolygonEdge');

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.5, 1.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 0.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 1.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (2.5, 1.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 1.0), polygon) == 'CoordInsideOfPolygon');
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
			if (JSM.IsPolygonVertexVisible2D (polygon, from, i)) {
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

	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0, 0, 1, 1), 0, 5) == false);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0, 0, 1, 1), 0, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0, 0, 1, 1), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0, 0, 0.5, 0.5), 0, -1) == false);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0, 0, 0.5, 0.5), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.3, 0.3, 0.8, 0.8), -1, -1) == false);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.3, 0.3, 1, 1), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.3, 0.3, 1.5, 1.5), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.5, 1.5, 0.8, 1.5), -1, -1) == false);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.5, 1.5, 1, 1.5), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.5, 1.5, 1, 2), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (0.5, 1.5, 1, 2.5), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (1.1, 1.5, 1.9, 1.5), -1, -1) == false);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (1, 2, 1.9, 1.5), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (1, 2, 1.9, 1.5), 6, -1) == false);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (1, 2, 2, 2), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (1, 2, 2, 2), 6, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon, GetSector (1, 2, 2, 2), 6, 3) == false);
	
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
	
	test.Assert (JSM.IsPolygonVertexVisible2D (polygon2, 1, 4) == false);

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
	
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon4, GetSector (0, 0, 1, 1), -1, -1) == true);
	test.Assert (JSM.SectorIntersectsPolygon2D (polygon4, GetSector (0, 0, 1, 1), 0, -1) == false);
});

polygonSuite.AddTest ('PolygonTriangulation2DTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (3.0, 0.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (1.5, 3.0);
	polygon.AddVertex (0.0, 2.0);
	
	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles));
	test.Assert (triangles.length == 3);
	test.Assert (triangles[0].toString () == [0, 1, 2].toString ());
	test.Assert (triangles[1].toString () == [0, 2, 3].toString ());
	test.Assert (triangles[2].toString () == [0, 3, 4].toString ());

	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (3.0, 0.0);
	polygon2.AddVertex (3.0, 2.0);
	polygon2.AddVertex (2.0, 2.0);
	polygon2.AddVertex (2.0, 1.0);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 2.0);
	polygon2.AddVertex (0.0, 2.0);
	
	var triangles = JSM.PolygonTriangulate2D (polygon2);
	test.Assert (JSM.CheckTriangulation2D (polygon2, triangles));
	test.Assert (triangles.length == 6);
	test.Assert (triangles[0].toString () == [1, 4, 0].toString ());
	test.Assert (triangles[1].toString () == [5, 0, 4].toString ());
	test.Assert (triangles[2].toString () == [2, 4, 1].toString ());
	test.Assert (triangles[3].toString () == [4, 2, 3].toString ());
	test.Assert (triangles[4].toString () == [6, 0, 5].toString ());
	test.Assert (triangles[5].toString () == [0, 6, 7].toString ());
	
	var polygon2cw = new JSM.Polygon2D ();
	polygon2cw.AddVertex (0.0, 0.0);
	polygon2cw.AddVertex (0.0, 2.0);
	polygon2cw.AddVertex (1.0, 2.0);
	polygon2cw.AddVertex (1.0, 1.0);
	polygon2cw.AddVertex (2.0, 1.0);
	polygon2cw.AddVertex (2.0, 2.0);
	polygon2cw.AddVertex (3.0, 2.0);
	polygon2cw.AddVertex (3.0, 0.0);
	
	var triangles = JSM.PolygonTriangulate2D (polygon2cw);
	test.Assert (JSM.CheckTriangulation2D (polygon2cw, triangles));
	test.Assert (triangles.length == 6);
	test.Assert (triangles[0].toString () == [6, 7, 5].toString ());
	test.Assert (triangles[1].toString () == [5, 7, 4].toString ());
	test.Assert (triangles[2].toString () == [4, 7, 3].toString ());
	test.Assert (triangles[3].toString () == [2, 3, 1].toString ());
	test.Assert (triangles[4].toString () == [1, 3, 0].toString ());
	test.Assert (triangles[5].toString () == [7, 0, 3].toString ());

	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (0.0, 0.0);
	polygon3.AddVertex (5.0, 0.0);
	polygon3.AddVertex (5.0, 1.0);
	polygon3.AddVertex (1.0, 1.0);
	polygon3.AddVertex (1.0, 5.0);
	polygon3.AddVertex (4.0, 5.0);
	polygon3.AddVertex (4.0, 3.0);
	polygon3.AddVertex (3.0, 3.0);
	polygon3.AddVertex (3.0, 4.0);
	polygon3.AddVertex (2.0, 4.0);
	polygon3.AddVertex (2.0, 2.0);
	polygon3.AddVertex (5.0, 2.0);
	polygon3.AddVertex (5.0, 6.0);
	polygon3.AddVertex (0.0, 6.0);

	var triangles = JSM.PolygonTriangulate2D (polygon3);
	test.Assert (JSM.CheckTriangulation2D (polygon3, triangles));
	test.Assert (triangles.length == 12);
	test.Assert (triangles[0].toString () == [2, 0, 1].toString ());
	test.Assert (triangles[1].toString () == [3, 0, 2].toString ());
	test.Assert (triangles[2].toString () == [4, 0, 3].toString ());
	test.Assert (triangles[3].toString () == [5, 12, 4].toString ());
	test.Assert (triangles[4].toString () == [13, 4, 12].toString ());
	test.Assert (triangles[5].toString () == [4, 13, 0].toString ());
	test.Assert (triangles[6].toString () == [6, 12, 5].toString ());
	test.Assert (triangles[7].toString () == [7, 10, 6].toString ());
	test.Assert (triangles[8].toString () == [11, 6, 10].toString ());
	test.Assert (triangles[9].toString () == [6, 11, 12].toString ());
	test.Assert (triangles[10].toString () == [8, 10, 7].toString ());
	test.Assert (triangles[11].toString () == [10, 8, 9].toString ());

	var polygon4 = new JSM.Polygon2D ();
	polygon4.AddVertex (52, 221);
	polygon4.AddVertex (101, 89);
	polygon4.AddVertex (244, 89);
	polygon4.AddVertex (188, 222);
	polygon4.AddVertex (104, 219);
	polygon4.AddVertex (135, 139);
	polygon4.AddVertex (167, 140);
	polygon4.AddVertex (152, 189);
	polygon4.AddVertex (170, 189);
	polygon4.AddVertex (192, 118);
	polygon4.AddVertex (118, 121);
	polygon4.AddVertex (77, 223);
	
	var triangles = JSM.PolygonTriangulate2D (polygon4);
	test.Assert (JSM.CheckTriangulation2D (polygon4, triangles));
	test.Assert (triangles.length == 10);

	var polygon5 = new JSM.Polygon2D ();
	polygon5.AddVertex (1, 0);
	polygon5.AddVertex (2, 0);
	polygon5.AddVertex (2, 1);
	polygon5.AddVertex (3, 1);
	polygon5.AddVertex (3, 2);
	polygon5.AddVertex (2, 2);
	polygon5.AddVertex (2, 3);
	polygon5.AddVertex (1, 3);
	polygon5.AddVertex (1, 2);
	polygon5.AddVertex (0, 2);
	polygon5.AddVertex (0, 1);
	polygon5.AddVertex (1, 1);	

	var triangles = JSM.PolygonTriangulate2D (polygon5);
	test.Assert (JSM.CheckTriangulation2D (polygon5, triangles));
	test.Assert (triangles.length == 10);
	test.Assert (triangles[0].toString () == [2, 0, 1].toString ());
	test.Assert (triangles[1].toString () == [2, 5, 0].toString ());
	test.Assert (triangles[2].toString () == [6, 0, 5].toString ());
	test.Assert (triangles[3].toString () == [3, 5, 2].toString ());
	test.Assert (triangles[4].toString () == [5, 3, 4].toString ());
	test.Assert (triangles[5].toString () == [8, 6, 7].toString ());
	test.Assert (triangles[6].toString () == [6, 11, 0].toString ());
	test.Assert (triangles[7].toString () == [8, 11, 6].toString ());
	test.Assert (triangles[8].toString () == [9, 11, 8].toString ());
	test.Assert (triangles[9].toString () == [11, 9, 10].toString ());
});

polygonSuite.AddTest ('PolygonTriangulationTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (3.0, 0.0, 0.0);
	polygon.AddVertex (3.0, 2.0, 0.0);
	polygon.AddVertex (1.5, 3.0, 0.0);
	polygon.AddVertex (0.0, 2.0, 0.0);
	
	var triangles = JSM.PolygonTriangulate (polygon);
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
	test.Assert (JSM.CoordIsEqual (offseted.vertices[0], new JSM.Coord (0.2, 0.2, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[1], new JSM.Coord (0.8, 0.2, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[2], new JSM.Coord (0.8, 0.8, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[3], new JSM.Coord (0.2, 0.8, 0.0)));

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 2.0, 0.0);
	
	var offseted = JSM.OffsetPolygonContour (polygon, 0.2);
	test.Assert (JSM.CoordIsEqual (offseted.vertices[0], new JSM.Coord (0.32360679774997897, 0.2, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[1], new JSM.Coord (1.8, 0.2, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[2], new JSM.Coord (1.8, 0.8, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[3], new JSM.Coord (0.8, 0.8, 0.0)));
	test.Assert (JSM.CoordIsEqual (offseted.vertices[4], new JSM.Coord (0.8, 1.1527864045000422, 0.0)));
});

polygonSuite.AddTest ('PolygonWithHole2DTest', function (test)
{
	function GetVisibleVertices (polygon, from)
	{
		var result = [];
		for (var i = 0; i < polygon.VertexCount (); i++) {
			if (JSM.IsPolygonVertexVisible2D (polygon, from, i)) {
				result.push (i);
			}
		}
		return result;
	}

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (3, 0);
	polygon.AddVertex (3, 3);
	polygon.AddVertex (0, 3);
	polygon.AddVertex (0, 0);
	polygon.AddVertex (1, 1);
	polygon.AddVertex (1, 2);
	polygon.AddVertex (2, 2);
	polygon.AddVertex (2, 1);
	polygon.AddVertex (1, 1);

	test.Assert (JSM.IsEqual (JSM.PolygonSignedArea2D (polygon), 8.0));

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.0, 0.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.0, 1.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (2.0, 2.0), polygon) == 'CoordOnPolygonEdge');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (3.0, 3.0), polygon) == 'CoordOnPolygonEdge');

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (-1.0, -1.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (4.0, 4.0), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (-1.0, 1.5), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (4.0, 1.5), polygon) == 'CoordOutsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 1.5), polygon) == 'CoordOutsideOfPolygon');

	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 0.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (2.5, 1.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (1.5, 2.5), polygon) == 'CoordInsideOfPolygon');
	test.Assert (JSM.CoordPolygonPosition2D (new JSM.Coord2D (0.5, 1.5), polygon) == 'CoordInsideOfPolygon');

	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles));
	test.Assert (triangles.length == 8);
	test.Assert (triangles[0].toString () == [2, 7, 1].toString ());
	test.Assert (triangles[1].toString () == [8, 1, 7].toString ());
	test.Assert (triangles[2].toString () == [3, 7, 2].toString ());
	test.Assert (triangles[3].toString () == [9, 1, 8].toString ());
	test.Assert (triangles[4].toString () == [1, 9, 0].toString ());
	test.Assert (triangles[5].toString () == [5, 3, 4].toString ());
	test.Assert (triangles[6].toString () == [6, 3, 5].toString ());
	test.Assert (triangles[7].toString () == [3, 6, 7].toString ());

	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0, 0);
	polygon2.AddVertex (6, 0);
	polygon2.AddVertex (6, 3);
	polygon2.AddVertex (5, 2);
	polygon2.AddVertex (5, 1);
	polygon2.AddVertex (4, 1);
	polygon2.AddVertex (4, 2);
	polygon2.AddVertex (5, 2);
	polygon2.AddVertex (6, 3);
	polygon2.AddVertex (0, 3);
	polygon2.AddVertex (1, 2);
	polygon2.AddVertex (2, 2);
	polygon2.AddVertex (2, 1);
	polygon2.AddVertex (1, 1);
	polygon2.AddVertex (1, 2);
	polygon2.AddVertex (0, 3);

	test.Assert (JSM.IsEqual (JSM.PolygonSignedArea2D (polygon2), 16.0));

	var triangles = JSM.PolygonTriangulate2D (polygon2);
	test.Assert (JSM.CheckTriangulation2D (polygon2, triangles));
	test.Assert (triangles.length == 14);
	test.Assert (triangles[0].toString () == [1, 4, 0].toString ());
	test.Assert (triangles[1].toString () == [5, 0, 4].toString ());
	test.Assert (triangles[2].toString () == [2, 4, 1].toString ());
	test.Assert (triangles[3].toString () == [4, 2, 3].toString ());
	test.Assert (triangles[4].toString () == [5, 12, 0].toString ());
	test.Assert (triangles[5].toString () == [13, 0, 12].toString ());
	test.Assert (triangles[6].toString () == [6, 12, 5].toString ());
	test.Assert (triangles[7].toString () == [14, 0, 13].toString ());	
	test.Assert (triangles[8].toString () == [0, 14, 15].toString ());	
	test.Assert (triangles[9].toString () == [8, 6, 7].toString ());	
	test.Assert (triangles[10].toString () == [9, 6, 8].toString ());	
	test.Assert (triangles[11].toString () == [6, 11, 12].toString ());	
	test.Assert (triangles[12].toString () == [9, 11, 6].toString ());	
	test.Assert (triangles[13].toString () == [11, 9, 10].toString ());	

	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (0, 0);
	polygon3.AddVertex (5, 0);
	polygon3.AddVertex (2.5, 5);
	polygon3.AddVertex (2, 2);
	polygon3.AddVertex (3, 2);
	polygon3.AddVertex (3, 1);
	polygon3.AddVertex (2, 1);
	polygon3.AddVertex (2, 2);
	polygon3.AddVertex (2.5, 5);

	var triangles = JSM.PolygonTriangulate2D (polygon3);
	test.Assert (JSM.CheckTriangulation2D (polygon3, triangles));
	test.Assert (triangles.length == 7);
	test.Assert (triangles[0].toString () == [1, 5, 0].toString ());
	test.Assert (triangles[1].toString () == [6, 0, 5].toString ());
	test.Assert (triangles[2].toString () == [1, 4, 5].toString ());
	test.Assert (triangles[3].toString () == [7, 0, 6].toString ());
	test.Assert (triangles[4].toString () == [0, 7, 8].toString ());
	test.Assert (triangles[5].toString () == [2, 4, 1].toString ());
	test.Assert (triangles[6].toString () == [4, 2, 3].toString ());
});

polygonSuite.AddTest ('CreatePolygonWithHole2DTest', function (test)
{
	function CreatePolygon2D (vertices, indices)
	{
		var result = new JSM.Polygon2D ();
	
		var i, vertex;
		for (i = 0; i < indices.length; i++) {
			vertex = vertices[indices[i]];
			result.AddVertex (vertex.x, vertex.y);
		}
		
		return result;
	}

	var vertices = [
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (7, 0),
		new JSM.Coord2D (7, 3),
		new JSM.Coord2D (0, 3)
	];
	
	var indices = JSM.CreatePolygonWithHole2D (vertices);
	test.Assert (indices.toString () == [0, 1, 2, 3].toString ());

	var polygon = CreatePolygon2D (vertices, indices);
	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles));
	test.Assert (triangles.length == 2);
	test.Assert (triangles[0].toString () == [0, 1, 2].toString ());
	test.Assert (triangles[1].toString () == [0, 2, 3].toString ());
	
	var vertices = [
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (7, 0),
		new JSM.Coord2D (7, 3),
		new JSM.Coord2D (0, 3),
		null,
		new JSM.Coord2D (1, 1),
		new JSM.Coord2D (1, 2),
		new JSM.Coord2D (2, 2),
		new JSM.Coord2D (2, 1),
	];
	
	var indices = JSM.CreatePolygonWithHole2D (vertices);
	test.Assert (indices.toString () == [0, 5, 6, 7, 8, 5, 0, 1, 2, 3].toString ());

	var polygon = CreatePolygon2D (vertices, indices);
	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles));
	test.Assert (triangles.length == 8);
	test.Assert (triangles[0].toString () == [3, 8, 2].toString ());
	test.Assert (triangles[1].toString () == [9, 2, 8].toString ());
	test.Assert (triangles[2].toString () == [4, 8, 3].toString ());
	test.Assert (triangles[3].toString () == [0, 2, 9].toString ());
	test.Assert (triangles[4].toString () == [2, 0, 1].toString ());
	test.Assert (triangles[5].toString () == [8, 6, 7].toString ());
	test.Assert (triangles[6].toString () == [4, 6, 8].toString ());
	test.Assert (triangles[7].toString () == [6, 4, 5].toString ());
	
	var vertices = [
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (7, 0),
		new JSM.Coord2D (7, 3),
		new JSM.Coord2D (0, 3),
		null,
		new JSM.Coord2D (1, 1),
		new JSM.Coord2D (1, 2),
		new JSM.Coord2D (2, 2),
		new JSM.Coord2D (2, 1),
		null,
		new JSM.Coord2D (3, 1),
		new JSM.Coord2D (3, 2),
		new JSM.Coord2D (4, 2),
		new JSM.Coord2D (4, 1),
	];
	
	var indices = JSM.CreatePolygonWithHole2D (vertices);
	test.Assert (indices.toString () == [0, 5, 6, 7, 10, 11, 12, 13, 10, 7, 8, 5, 0, 1, 2, 3].toString ());

	var polygon = CreatePolygon2D (vertices, indices);
	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles));
	test.Assert (triangles.length == 14);
	test.Assert (triangles[0].toString () == [15, 2, 14].toString ());
	test.Assert (triangles[1].toString () == [5, 3, 4].toString ());
	test.Assert (triangles[2].toString () == [6, 14, 5].toString ());
	test.Assert (triangles[3].toString () == [0, 2, 15].toString ());
	test.Assert (triangles[4].toString () == [2, 0, 1].toString ());
	test.Assert (triangles[5].toString () == [14, 3, 5].toString ());
	test.Assert (triangles[6].toString () == [3, 14, 2].toString ());
	test.Assert (triangles[7].toString () == [7, 14, 6].toString ());
	test.Assert (triangles[8].toString () == [8, 12, 7].toString ());
	test.Assert (triangles[9].toString () == [13, 7, 12].toString ());
	test.Assert (triangles[10].toString () == [7, 13, 14].toString ());
	test.Assert (triangles[11].toString () == [12, 10, 11].toString ());
	test.Assert (triangles[12].toString () == [8, 10, 12].toString ());
	test.Assert (triangles[13].toString () == [10, 8, 9].toString ());

	var vertices = [
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (7, 0),
		new JSM.Coord2D (7, 3),
		new JSM.Coord2D (0, 3),
		null,
		new JSM.Coord2D (1, 1),
		new JSM.Coord2D (1, 2),
		new JSM.Coord2D (2, 2),
		new JSM.Coord2D (2, 1),
		null,
		new JSM.Coord2D (3, 1),
		new JSM.Coord2D (3, 2),
		new JSM.Coord2D (4, 2),
		new JSM.Coord2D (4, 1),
		null,
		new JSM.Coord2D (5, 1),
		new JSM.Coord2D (5, 2),
		new JSM.Coord2D (6, 2),
		new JSM.Coord2D (6, 1)
	];
	
	var indices = JSM.CreatePolygonWithHole2D (vertices);
	test.Assert (indices.toString () == [0, 5, 6, 7, 10, 11, 12, 15, 16, 17, 18, 15, 12, 13, 10, 7, 8, 5, 0, 1, 2, 3].toString ());

	var polygon = CreatePolygon2D (vertices, indices);
	var triangles = JSM.PolygonTriangulate2D (polygon);
	test.Assert (JSM.CheckTriangulation2D (polygon, triangles));
	test.Assert (triangles.length == 20);	
	test.Assert (triangles[0].toString () == [21, 2, 20].toString ());
	test.Assert (triangles[1].toString () == [5, 3, 4].toString ());
	test.Assert (triangles[2].toString () == [0, 2, 21].toString ());
	test.Assert (triangles[3].toString () == [2, 0, 1].toString ());
	test.Assert (triangles[4].toString () == [20, 3, 5].toString ());
	test.Assert (triangles[5].toString () == [3, 20, 2].toString ());
	test.Assert (triangles[6].toString () == [8, 6, 7].toString ());
	test.Assert (triangles[7].toString () == [9, 20, 8].toString ());
	test.Assert (triangles[8].toString () == [20, 6, 8].toString ());
	test.Assert (triangles[9].toString () == [6, 20, 5].toString ());
	test.Assert (triangles[10].toString () == [10, 20, 9].toString ());
	test.Assert (triangles[11].toString () == [11, 18, 10].toString ());
	test.Assert (triangles[12].toString () == [19, 10, 18].toString ());
	test.Assert (triangles[13].toString () == [10, 19, 20].toString ());
	test.Assert (triangles[14].toString () == [11, 13, 18].toString ());
	test.Assert (triangles[15].toString () == [13, 11, 12].toString ());
	test.Assert (triangles[16].toString () == [14, 18, 13].toString ());
	test.Assert (triangles[17].toString () == [18, 16, 17].toString ());
	test.Assert (triangles[18].toString () == [14, 16, 18].toString ());
	test.Assert (triangles[19].toString () == [16, 14, 15].toString ());

	var vertices = [
		new JSM.Coord2D (300.8485412597656, 319.4265441894531),
		new JSM.Coord2D (338.24835205078125, 396.81103515625),
		new JSM.Coord2D (421.9165954589844, 416.66839599609375),
		new JSM.Coord2D (489.1433410644531, 362.9385986328125),
		new JSM.Coord2D (489.543701171875, 276.95245361328125),
		new JSM.Coord2D (422.18115234375, 223.48004150390625),
		new JSM.Coord2D (337.93084716796875, 241.53892517089844),
        null,
		new JSM.Coord2D (400.6557922363281, 231.74929809570312),
		new JSM.Coord2D (468.43548583984375, 264.9992980957031),
		new JSM.Coord2D (484.7142639160156, 338.9593505859375),
		new JSM.Coord2D (437.7185363769531, 398.06951904296875),
		new JSM.Coord2D (362.0542297363281, 397.45257568359375),
		new JSM.Coord2D (315.2279052734375, 338.1394348144531),
		new JSM.Coord2D (332.49664306640625, 264.4938659667969)
	];
	
	var indices = JSM.CreatePolygonWithHole2D (vertices);
	test.Assert (indices.toString () == [0, 13, 14, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6].toString ());
});

polygonSuite.AddTest ('CreatePolygonWithHoleTest', function (test)
{
	function CreatePolygon (vertices, indices)
	{
		var result = new JSM.Polygon ();
	
		var i, vertex;
		for (i = 0; i < indices.length; i++) {
			vertex = vertices[indices[i]];
			result.AddVertex (vertex.x, vertex.y, vertex.z);
		}
		
		return result;
	}

	var i, j;
	for (i = 0; i <= 3; i++) {
		var vertices = [
			new JSM.Coord (0, 0, 0),
			new JSM.Coord (7, 0, 0),
			new JSM.Coord (7, 3, 0),
			new JSM.Coord (0, 3, 0),
			null,
			new JSM.Coord (1, 1, 0),
			new JSM.Coord (1, 2, 0),
			new JSM.Coord (2, 2, 0),
			new JSM.Coord (2, 1, 0),
			null,
			new JSM.Coord (3, 1, 0),
			new JSM.Coord (3, 2, 0),
			new JSM.Coord (4, 2, 0),
			new JSM.Coord (4, 1, 0),
			null,
			new JSM.Coord (5, 1, 0),
			new JSM.Coord (5, 2, 0),
			new JSM.Coord (6, 2, 0),
			new JSM.Coord (6, 1, 0)
		];
		
		if (i > 0) {
			var transformation;
			if (i == 1) {
				transformation = new JSM.RotationXTransformation (90.0 * JSM.DegRad);
			} else if (i == 2) {
				transformation = new JSM.RotationYTransformation (90.0 * JSM.DegRad);
			} else if (i == 3) {
				transformation = new JSM.RotationZTransformation (90.0 * JSM.DegRad);
			}
			var j;
			for (j = 0; j < vertices.length; j++) {
				if (vertices[j] !== null) {
					vertices[j] = transformation.Apply (vertices[j]);
				}
			}
		}
		
		var indices = JSM.CreatePolygonWithHole (vertices);
		test.Assert (indices.toString () == [0, 5, 6, 7, 10, 11, 12, 15, 16, 17, 18, 15, 12, 13, 10, 7, 8, 5, 0, 1, 2, 3].toString ());

		var polygon = CreatePolygon (vertices, indices);
		var triangles = JSM.PolygonTriangulate (polygon);
		test.Assert (triangles.length == 20);	
		test.Assert (triangles[0].toString () == [21, 2, 20].toString ());
		test.Assert (triangles[1].toString () == [5, 3, 4].toString ());
		test.Assert (triangles[2].toString () == [0, 2, 21].toString ());
		test.Assert (triangles[3].toString () == [2, 0, 1].toString ());
		test.Assert (triangles[4].toString () == [20, 3, 5].toString ());
		test.Assert (triangles[5].toString () == [3, 20, 2].toString ());
		test.Assert (triangles[6].toString () == [8, 6, 7].toString ());
		test.Assert (triangles[7].toString () == [9, 20, 8].toString ());
		test.Assert (triangles[8].toString () == [20, 6, 8].toString ());
		test.Assert (triangles[9].toString () == [6, 20, 5].toString ());
		test.Assert (triangles[10].toString () == [10, 20, 9].toString ());
		test.Assert (triangles[11].toString () == [11, 18, 10].toString ());
		test.Assert (triangles[12].toString () == [19, 10, 18].toString ());
		test.Assert (triangles[13].toString () == [10, 19, 20].toString ());
		test.Assert (triangles[14].toString () == [11, 13, 18].toString ());
		test.Assert (triangles[15].toString () == [13, 11, 12].toString ());
		test.Assert (triangles[16].toString () == [14, 18, 13].toString ());
		test.Assert (triangles[17].toString () == [18, 16, 17].toString ());
		test.Assert (triangles[18].toString () == [14, 16, 18].toString ());
		test.Assert (triangles[19].toString () == [16, 14, 15].toString ());
	}	
});

polygonSuite.AddTest ('OldCutPolygonTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (0.0, 1.0, 0.0);
	
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (1.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (0.0, 1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (-1.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));

	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (0.5, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (0.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (0.0, 0.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.5, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (0.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (1.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (1.0, 1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.8, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.8, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (0.8, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (0.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (0.0, 0.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (-1.0, 1.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (0.0, 1.0, 0.0))
		);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Vector (0.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Vector (1.0, 0.0, 0.0))
		);
	
	polygon = new JSM.Polygon ();
	polygon.AddVertex (-1.0, -1.0, 0.0);
	polygon.AddVertex (-1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, -1.0, 0.0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (0.0, -1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (-1.0, -1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (-1.0, 1.0, 0.0))
		);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Vector (0.0, -1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Vector (0.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Vector (1.0, -1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.0, -1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (0.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (1.0, -1.0, 0.0))
		);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Vector (0.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Vector (0.0, -1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Vector (-1.0, -1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Vector (-1.0, 1.0, 0.0))
		);

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 2.0, 0.0);
	polygon.AddVertex (2.0, 2.0, 0.0);
	polygon.AddVertex (2.0, 3.0, 0.0);
	polygon.AddVertex (0.0, 3.0, 0.0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (3.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 1);

	test.Assert (frontPolygons[0].VertexCount () == 8);
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (1.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (1.5, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (1.0, 2.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (4), new JSM.Vector (1.5, 2.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (5), new JSM.Vector (1.5, 3.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (6), new JSM.Vector (0.0, 3.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (7), new JSM.Vector (0.0, 0.0, 0.0))
		);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Vector (1.5, 3.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Vector (1.5, 2.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Vector (2.0, 2.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Vector (2.0, 3.0, 0.0))
		);

	test.Assert (backPolygons[1].VertexCount () == 4);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[1].GetVertex (0), new JSM.Vector (1.5, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[1].GetVertex (1), new JSM.Vector (1.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[1].GetVertex (2), new JSM.Vector (2.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[1].GetVertex (3), new JSM.Vector (2.0, 1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (0.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (0.5, 3.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (0.0, 3.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (0.0, 0.0, 0.0))
		);

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Vector (0.5, 3.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Vector (0.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Vector (2.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Vector (2.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (5), new JSM.Vector (1.0, 2.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (6), new JSM.Vector (2.0, 2.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (7), new JSM.Vector (2.0, 3.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 2);

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Vector (1.5, 3.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Vector (1.5, 2.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Vector (2.0, 2.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Vector (2.0, 3.0, 0.0))
		);

	test.Assert (frontPolygons[1].VertexCount () == 4);
	test.Assert (
		JSM.CoordIsEqual (frontPolygons[1].GetVertex (0), new JSM.Vector (1.5, 1.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[1].GetVertex (1), new JSM.Vector (1.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[1].GetVertex (2), new JSM.Vector (2.0, 0.0, 0.0)) &&
		JSM.CoordIsEqual (frontPolygons[1].GetVertex (3), new JSM.Vector (2.0, 1.0, 0.0))
		);

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (
		JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Vector (1.5, 0.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Vector (1.5, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Vector (1.0, 1.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Vector (1.0, 2.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Vector (1.5, 2.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (5), new JSM.Vector (1.5, 3.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (6), new JSM.Vector (0.0, 3.0, 0.0)) &&
		JSM.CoordIsEqual (backPolygons[0].GetVertex (7), new JSM.Vector (0.0, 0.0, 0.0))
		);
});

polygonSuite.AddTest ('CutPolygonTest', function (test)
{
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var revPlane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));

	// two cut polygons in both sides
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (1, 2, 0);
	polygon.AddVertex (4, 2, 0);
	polygon.AddVertex (4, 5, 0);
	polygon.AddVertex (0, 5, 0);
	polygon.AddVertex (0, 4, 0);
	polygon.AddVertex (3, 4, 0);
	polygon.AddVertex (3, 3, 0);
	polygon.AddVertex (0, 3, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 2);

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (1, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (1, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (5), new JSM.Coord (2, 3, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (6), new JSM.Coord (0, 3, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (7), new JSM.Coord (0, 0, 0)));

	test.Assert (backPolygons[1].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (0), new JSM.Coord (2, 4, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (1), new JSM.Coord (2, 5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (2), new JSM.Coord (0, 5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (3), new JSM.Coord (0, 4, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 8);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 4, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 4, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (3, 3, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (4), new JSM.Coord (2, 3, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (5), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (6), new JSM.Coord (4, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (7), new JSM.Coord (4, 5, 0)));

	test.Assert (frontPolygons[1].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (0), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (1), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (2), new JSM.Coord (3, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (3), new JSM.Coord (3, 1, 0)));

	// same with reversed plane
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, revPlane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 2);

	test.Assert (frontPolygons[0].VertexCount () == 8);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (1, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (1, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (4), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (5), new JSM.Coord (2, 3, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (6), new JSM.Coord (0, 3, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (7), new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[1].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (0), new JSM.Coord (2, 4, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (1), new JSM.Coord (2, 5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (2), new JSM.Coord (0, 5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[1].GetVertex (3), new JSM.Coord (0, 4, 0)));

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 4, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (3, 4, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (3, 3, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Coord (2, 3, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (5), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (6), new JSM.Coord (4, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (7), new JSM.Coord (4, 5, 0)));

	test.Assert (backPolygons[1].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (0), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (1), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (2), new JSM.Coord (3, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[1].GetVertex (3), new JSM.Coord (3, 1, 0)));

	// all outside
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (0, 1, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (1, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 1, 0)));

	// all outside, some on the plane
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 2, 0);
	polygon.AddVertex (0, 2, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 2, 0)));

	// all inside
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (4, 0, 0);
	polygon.AddVertex (4, 1, 0);
	polygon.AddVertex (3, 1, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (3, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (4, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (4, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (3, 1, 0)));

	// all inside, some on the plane
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (2, 1, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (3, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (2, 1, 0)));
	
	// both sides, clean cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (3, 3, 0);
	polygon.AddVertex (0, 3, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 3, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 3, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 3, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (3, 3, 0)));

	// both sides, edge on the plane cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 1, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (3, 2, 0);
	polygon.AddVertex (0, 2, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 5);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Coord (2, 0, 0)));
	
	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (3, 2, 0)));

	// both sides, edge on the plane cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 1, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (3, 2, 0);
	polygon.AddVertex (0, 2, 0);
	polygon.AddVertex (0, 0, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 5);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Coord (2, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (3, 2, 0)));

	// both sides, edge on the plane cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (2, 1, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (3, 2, 0);
	polygon.AddVertex (0, 2, 0);
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 5);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (4), new JSM.Coord (2, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (3, 2, 0)));
	
	// cut triangle
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (0, 2, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (2, 0.6666666666666666, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 2, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (2, 0.6666666666666666, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (2, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (3, 0, 0)));

	// cut triangles from polygon
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (10, 0, 0);
	polygon.AddVertex (10, 3, 0);
	polygon.AddVertex (9, 1, 0);
	polygon.AddVertex (8, 3, 0);
	polygon.AddVertex (7, 1, 0);
	polygon.AddVertex (6, 3, 0);
	polygon.AddVertex (5, 1, 0);
	polygon.AddVertex (4, 3, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (2, 3, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (0, 3, 0);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 2.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 6);	

	test.Assert (backPolygons[0].VertexCount () == 19);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[1].VertexCount () == 3);
	test.Assert (frontPolygons[2].VertexCount () == 3);
	test.Assert (frontPolygons[3].VertexCount () == 3);
	test.Assert (frontPolygons[4].VertexCount () == 3);
	test.Assert (frontPolygons[5].VertexCount () == 3);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 2.0, 0.0), new JSM.Vector (0.0, -1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 6);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (frontPolygons[0].VertexCount () == 19);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[1].VertexCount () == 3);
	test.Assert (backPolygons[2].VertexCount () == 3);
	test.Assert (backPolygons[3].VertexCount () == 3);
	test.Assert (backPolygons[4].VertexCount () == 3);
	test.Assert (backPolygons[5].VertexCount () == 3);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 1.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].VertexCount () == 13);

	// cut through existing vertices
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (4, 0, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (4, 2, 0);
	polygon.AddVertex (0, 2, 0);
	polygon.AddVertex (1, 1, 0);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 1.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (3, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (1, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (4, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (1, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (3, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (4, 2, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (0, 2, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 1.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 1.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 6);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, -1.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 6);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 0);
	test.Assert (planePolygons.length == 1);
	test.Assert (planePolygons[0].VertexCount () == 6);
});

polygonSuite.AddTest ('CutTriangleTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (0, 1, 0);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, -1.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 0);
	test.Assert (planePolygons.length == 1);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, -1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 0);
	test.Assert (planePolygons.length == 1);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0.5, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));
	
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (0.5, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (1, 0, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0.5, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (0, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (3), new JSM.Coord (0, 0, 0)));
	
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (0.5, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (1, 0, 0)));

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (0.5, 1, 0);
	
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0.5, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (0.5, 1, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0.5, 1, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (0.5, 0, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (1, 0, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.5, 0.0), new JSM.Vector (0.0, 1.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (0), new JSM.Coord (0.75, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (1), new JSM.Coord (0.25, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (2), new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (backPolygons[0].GetVertex (3), new JSM.Coord (1, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (0), new JSM.Coord (0.25, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (1), new JSM.Coord (0.75, 0.5, 0)));
	test.Assert (JSM.CoordIsEqual (frontPolygons[0].GetVertex (2), new JSM.Coord (0.5, 1, 0)));
});

polygonSuite.AddTest ('BSPTreeTest', function (test)
{
	function TestNode (test, node, vertexCount, normalVector)
	{
		test.Assert (node.polygon.VertexCount () == vertexCount);
		test.Assert (JSM.CoordIsEqual (node.plane.GetNormal (), normalVector));
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

}
