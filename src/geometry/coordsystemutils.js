/**
* Function: CoordSystemToDirectionVectors
* Description: Converts coordinate system vectors to origo relative direction vectors.
* Parameters:
*	system {CoordSystem} the coordinate system
* Returns:
*	{CoordSystem} the result
*/
JSM.CoordSystemToDirectionVectors = function (system)
{
	return new JSM.CoordSystem (
		system.origo,
		JSM.CoordSub (system.e1, system.origo),
		JSM.CoordSub (system.e2, system.origo),
		JSM.CoordSub (system.e3, system.origo)
	);
};

/**
* Function: CoordSystemToAbsoluteCoords
* Description: Converts coordinate system vectors to absolute coordinates.
* Parameters:
*	system {CoordSystem} the coordinate system
* Returns:
*	{CoordSystem} the result
*/
JSM.CoordSystemToAbsoluteCoords = function (system)
{
	return new JSM.CoordSystem (
		system.origo,
		JSM.CoordAdd (system.e1, system.origo),
		JSM.CoordAdd (system.e2, system.origo),
		JSM.CoordAdd (system.e3, system.origo)
	);
};
