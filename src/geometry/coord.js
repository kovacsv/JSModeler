/**
* Class: Coord2D
* Description: Represents a 2D coordinate.
*/
JSM.Coord2D = function (x, y)
{
	this.x = JSM.ValueOrDefault (x, 0.0);
	this.y = JSM.ValueOrDefault (y, 0.0);
};

/**
* Function: Coord2D->Set
* Description: Sets the coordinate.
*/
JSM.Coord2D.prototype.Set = function (x, y)
{
	this.x = JSM.ValueOrDefault (x, 0.0);
	this.y = JSM.ValueOrDefault (y, 0.0);
};

/**
* Function: Coord2D->ToString
* Description: Converts the coordinate values to string.
*/
JSM.Coord2D.prototype.ToString = function ()
{
	return ('(' + this.x + ', ' + this.y + ')');
};

/**
* Function: Coord2D->Clone
* Description: Clones the coordinate.
*/
JSM.Coord2D.prototype.Clone = function ()
{
	return new JSM.Coord2D (this.x, this.y);
};

/**
* Class: PolarCoord
* Description: Represents a 2D polar coordinate.
*/
JSM.PolarCoord = function (radius, angle)
{
	this.radius = JSM.ValueOrDefault (radius, 1.0);
	this.angle = JSM.ValueOrDefault (angle, 0.0);
};

/**
* Function: PolarCoord->Set
* Description: Sets the coordinate.
*/
JSM.PolarCoord.prototype.Set = function (radius, angle)
{
	this.radius = JSM.ValueOrDefault (radius, 1.0);
	this.angle = JSM.ValueOrDefault (angle, 0.0);
};

/**
* Function: PolarCoord->ToString
* Description: Converts the coordinate values to string.
*/
JSM.PolarCoord.prototype.ToString = function ()
{
	return ('(' + this.radius + ', ' + this.angle + ')');
};

/**
* Function: PolarCoord->Clone
* Description: Clones the coordinate.
*/
JSM.PolarCoord.prototype.Clone = function ()
{
	return new JSM.PolarCoord (this.radius, this.angle);
};

/**
* Class: Coord
* Description: Represents a 3D coordinate.
*/
JSM.Coord = function (x, y, z)
{
	this.x = JSM.ValueOrDefault (x, 0.0);
	this.y = JSM.ValueOrDefault (y, 0.0);
	this.z = JSM.ValueOrDefault (z, 0.0);
};

/**
* Function: Coord->Set
* Description: Sets the coordinate.
*/
JSM.Coord.prototype.Set = function (x, y, z)
{
	this.x = JSM.ValueOrDefault (x, 0.0);
	this.y = JSM.ValueOrDefault (y, 0.0);
	this.z = JSM.ValueOrDefault (z, 0.0);
};

/**
* Function: Coord->ToString
* Description: Converts the coordinate values to string.
*/
JSM.Coord.prototype.ToString = function ()
{
	return ('(' + this.x + ', ' + this.y + ', ' + this.z + ')');
};

/**
* Function: Coord->Clone
* Description: Clones the coordinate.
*/
JSM.Coord.prototype.Clone = function ()
{
	return new JSM.Coord (this.x, this.y, this.z);
};

/**
* Class: SphericalCoord
* Description: Represents a 3D spherical coordinate.
*/
JSM.SphericalCoord = function (radius, theta, phi)
{
	this.radius = JSM.ValueOrDefault (radius, 0.0);
	this.theta = JSM.ValueOrDefault (theta, 0.0);
	this.phi = JSM.ValueOrDefault (phi, 0.0);
};

/**
* Function: SphericalCoord->Set
* Description: Sets the coordinate.
*/
JSM.SphericalCoord.prototype.Set = function (radius, theta, phi)
{
	this.radius = JSM.ValueOrDefault (radius, 0.0);
	this.theta = JSM.ValueOrDefault (theta, 0.0);
	this.phi = JSM.ValueOrDefault (phi, 0.0);
};

/**
* Function: SphericalCoord->ToString
* Description: Converts the coordinate values to string.
*/
JSM.SphericalCoord.prototype.ToString = function ()
{
	return ('(' + this.radius + ', ' + this.theta + ', ' + this.phi + ')');
};

/**
* Function: SphericalCoord->Clone
* Description: Clones the coordinate.
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
