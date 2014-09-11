/**
* Class: Coord2D
* Description: Represents a 2D coordinate.
* Parameters:
*	x {number} the first component
*	y {number} the second component
*/
JSM.Coord2D = function (x, y)
{
	this.x = x;
	this.y = y;
};

/**
* Function: Coord2D.Set
* Description: Sets the coordinate.
* Parameters:
*	x {number} the first component
*	y {number} the second component
*/
JSM.Coord2D.prototype.Set = function (x, y)
{
	this.x = x;
	this.y = y;
};

/**
* Function: Coord2D.ToString
* Description: Converts the coordinate values to string.
* Returns:
*	{string} the string representation of the coordinate
*/
JSM.Coord2D.prototype.ToString = function ()
{
	return ('(' + this.x + ', ' + this.y + ')');
};

/**
* Function: Coord2D.Clone
* Description: Clones the coordinate.
* Returns:
*	{Coord2D} a cloned instance
*/
JSM.Coord2D.prototype.Clone = function ()
{
	return new JSM.Coord2D (this.x, this.y);
};

/**
* Class: PolarCoord
* Description: Represents a 2D polar coordinate.
* Parameters:
*	radius {number} the first component
*	angle {number} the second component
*/
JSM.PolarCoord = function (radius, angle)
{
	this.radius = radius;
	this.angle = angle;
};

/**
* Function: PolarCoord.Set
* Description: Sets the coordinate.
* Parameters:
*	radius {number} the first component
*	angle {number} the second component
*/
JSM.PolarCoord.prototype.Set = function (radius, angle)
{
	this.radius = radius;
	this.angle = angle;
};

/**
* Function: PolarCoord.ToString
* Description: Converts the coordinate values to string.
* Returns:
*	{string} the string representation of the coordinate
*/
JSM.PolarCoord.prototype.ToString = function ()
{
	return ('(' + this.radius + ', ' + this.angle + ')');
};

/**
* Function: PolarCoord.Clone
* Description: Clones the coordinate.
* Returns:
*	{PolarCoord} a cloned instance
*/
JSM.PolarCoord.prototype.Clone = function ()
{
	return new JSM.PolarCoord (this.radius, this.angle);
};

/**
* Class: Coord
* Description: Represents a 3D coordinate.
* Parameters:
*	x {number} the first component
*	y {number} the second component
*	z {number} the third component
*/
JSM.Coord = function (x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
* Function: Coord.Set
* Description: Sets the coordinate.
* Parameters:
*	x {number} the first component
*	y {number} the second component
*	z {number} the third component
*/
JSM.Coord.prototype.Set = function (x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
* Function: Coord.ToString
* Description: Converts the coordinate values to string.
* Returns:
*	{string} the string representation of the coordinate
*/
JSM.Coord.prototype.ToString = function ()
{
	return ('(' + this.x + ', ' + this.y + ', ' + this.z + ')');
};

/**
* Function: Coord.Clone
* Description: Clones the coordinate.
* Returns:
*	{Coord} a cloned instance
*/
JSM.Coord.prototype.Clone = function ()
{
	return new JSM.Coord (this.x, this.y, this.z);
};

/**
* Class: SphericalCoord
* Description: Represents a 3D spherical coordinate.
* Parameters:
*	radius {number} the first component
*	theta {number} the second component
*	phi {number} the third component
*/
JSM.SphericalCoord = function (radius, theta, phi)
{
	this.radius = radius;
	this.theta = theta;
	this.phi = phi;
};

/**
* Function: SphericalCoord.Set
* Description: Sets the coordinate.
* Parameters:
*	radius {number} the first component
*	theta {number} the second component
*	phi {number} the third component
*/
JSM.SphericalCoord.prototype.Set = function (radius, theta, phi)
{
	this.radius = radius;
	this.theta = theta;
	this.phi = phi;
};

/**
* Function: SphericalCoord.ToString
* Description: Converts the coordinate values to string.
* Returns:
*	{string} the string representation of the coordinate
*/
JSM.SphericalCoord.prototype.ToString = function ()
{
	return ('(' + this.radius + ', ' + this.theta + ', ' + this.phi + ')');
};

/**
* Function: SphericalCoord.Clone
* Description: Clones the coordinate.
* Returns:
*	{SphericalCoord} a cloned instance
*/
JSM.SphericalCoord.prototype.Clone = function ()
{
	return new JSM.SphericalCoord (this.radius, this.theta, this.phi);
};

/**
* Class: Vector2D
* Description: Same as Coord2D.
*/
JSM.Vector2D = JSM.Coord2D;

/**
* Class: Vector
* Description: Same as Coord.
*/
JSM.Vector = JSM.Coord;
