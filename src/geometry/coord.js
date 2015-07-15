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
* Class: Vector
* Description: Same as Coord.
*/
JSM.Vector = JSM.Coord;

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
