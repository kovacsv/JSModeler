JSM.CoordSystemToDirectionVectors = function (system)
{
	return new JSM.CoordSystem (
		system.origo,
		JSM.CoordSub (system.e1, system.origo),
		JSM.CoordSub (system.e2, system.origo),
		JSM.CoordSub (system.e3, system.origo)
	);
};

JSM.CoordSystemToAbsoluteCoords = function (system)
{
	return new JSM.CoordSystem (
		system.origo,
		JSM.CoordAdd (system.e1, system.origo),
		JSM.CoordAdd (system.e2, system.origo),
		JSM.CoordAdd (system.e3, system.origo)
	);
};

JSM.ChangeCoordSystem = function (coord, from, to)
{
	var fromE1 = JSM.VectorNormalize (from.e1);
	var fromE2 = JSM.VectorNormalize (from.e2);
	var fromE3 = JSM.VectorNormalize (from.e3);

	var toE1 = JSM.VectorNormalize (to.e1);
	var toE2 = JSM.VectorNormalize (to.e2);
	var toE3 = JSM.VectorNormalize (to.e3);

	var offseted = JSM.CoordSub (coord, from.origo);
	var result = new JSM.Coord ();
	result.x = JSM.VectorDot (toE1, fromE1) * offseted.x + JSM.VectorDot (toE1, fromE2) * offseted.y + JSM.VectorDot (toE1, fromE3) * offseted.z;
	result.y = JSM.VectorDot (toE2, fromE1) * offseted.x + JSM.VectorDot (toE2, fromE2) * offseted.y + JSM.VectorDot (toE2, fromE3) * offseted.z;
	result.z = JSM.VectorDot (toE3, fromE1) * offseted.x + JSM.VectorDot (toE3, fromE2) * offseted.y + JSM.VectorDot (toE3, fromE3) * offseted.z;
	result = JSM.CoordAdd (result, to.origo);
	return result;
};
