/**
* Class: CoordSystem
* Description: Represents coordinate system.
* Parameters:
*	origo {Coord} origo
*	e1 {Vector} first direction vector
*	e2 {Vector} second direction vector
*	e3 {Vector} third direction vector
*/
JSM.CoordSystem = function (origo, e1, e2, e3)
{
	this.origo = origo;
	this.e1 = e1;
	this.e2 = e2;
	this.e3 = e3;
};

/**
* Function: CoordSystem.Set
* Description: Sets the coordinate system.
* Parameters:
*	origo {Coord} origo
*	e1 {Vector} first direction vector
*	e2 {Vector} second direction vector
*	e3 {Vector} third direction vector
*/
JSM.CoordSystem.prototype.Set = function (origo, e1, e2, e3)
{
	this.origo = origo;
	this.e1 = e1;
	this.e2 = e2;
	this.e3 = e3;
};

/**
* Function: CoordSystem.Clone
* Description: Clones the coordinate system.
* Returns:
*	{CoordSystem} a cloned instance
*/
JSM.CoordSystem.prototype.Clone = function ()
{
	return new JSM.CoordSystem (this.origo.Clone (), this.e1.Clone (), this.e2.Clone (), this.e3.Clone ());
};

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

/**
* Function: PolarToCartesian
* Description: Converts a polar coordinate to a cartesian coordinate.
* Parameters:
*	radius {number} the radius component
*	theta {number} the angle component
* Returns:
*	{Coord2D} the result
*/
JSM.PolarToCartesian = function (radius, theta)
{
	var result = new JSM.Coord2D (0.0, 0.0);
	result.x = radius * Math.cos (theta);
	result.y = radius * Math.sin (theta);
	return result;
};


/**
* Function: GetArcLengthFromAngle
* Description: Calculates arc length from radius and angle.
* Parameters:
*	radius {number} the radius of the circle
*	theta {number} the angle of rotation
* Returns:
*	{number} the result
*/
JSM.GetArcLengthFromAngle = function (radius, theta)
{
	return theta * radius;
};

/**
* Function: GetAngleFromArcLength
* Description: Calculates angle from arc length.
* Parameters:
*	radius {number} the radius of the circle
*	arcLength {number} the arc length
* Returns:
*	{number} the result
*/
JSM.GetAngleFromArcLength = function (radius, arcLength)
{
	if (JSM.IsEqual (radius, 0.0)) {
		return 0.0;
	}
	
	return arcLength / radius;
};

/**
* Function: SphericalToCartesian
* Description: Converts a spherical coordinate to a cartesian coordinate.
* Parameters:
*	radius {number} the radius component
*	theta {number} the angle component
*	phi {number} the phi component
* Returns:
*	{Coord} the result
*/
JSM.SphericalToCartesian = function (radius, theta, phi)
{
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = radius * Math.sin (theta) * Math.cos (phi);
	result.y = radius * Math.sin (theta) * Math.sin (phi);
	result.z = radius * Math.cos (theta);
	return result;
};

/**
* Function: CylindricalToCartesian
* Description: Converts a cylindrical coordinate to a cartesian coordinate.
* Parameters:
*	radius {number} the radius component
*	height {number} the height component
*	theta {number} the theta component
* Returns:
*	{Coord} the result
*/
JSM.CylindricalToCartesian = function (radius, height, theta)
{
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = radius * Math.cos (theta);
	result.y = radius * Math.sin (theta);
	result.z = height;
	return result;
};

/**
* Function: GetArcLength
* Description: Calculates arc length between two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	radius {number} the radius component
* Returns:
*	{number} the result
*/
JSM.GetArcLength = function (a, b, radius)
{
	var angle = JSM.GetVectorsAngle (a, b);
	return angle * radius;
};

/**
* Function: GetFullArcLength
* Description: Calculates arc length between two vectors with the given normal vector.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
*	radius {number} the radius component
*	normal {Vector} the normal vector
* Returns:
*	{number} the result
*/
JSM.GetFullArcLength = function (a, b, radius, normal)
{
	var angle = JSM.GetVectorsFullAngle (a, b, normal);
	return angle * radius;
};
