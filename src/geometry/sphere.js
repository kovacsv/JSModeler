/**
* Class: Sphere
* Description: Represents a sphere.
* Parameters:
*	origo {Coord} the origo of the sphere
*	radius {number} the radius of the sphere
*/
JSM.Sphere = function (origo, radius)
{
	this.origo = origo;
	this.radius = radius;
};

/**
* Function: Sphere.Set
* Description: Sets the sphere.
* Parameters:
*	origo {Coord} the origo of the sphere
*	radius {number} the radius of the sphere
*/
JSM.Sphere.prototype.Set = function (origo, radius)
{
	this.origo = origo;
	this.radius = radius;
};

/**
* Function: Sphere.GetOrigo
* Description: Returns the origo of the sphere.
* Returns:
*	{Coord} the result
*/
JSM.Sphere.prototype.GetOrigo = function ()
{
	return this.origo;
};

/**
* Function: Sphere.GetRadius
* Description: Returns the radius of the sphere.
* Returns:
*	{number} the result
*/
JSM.Sphere.prototype.GetRadius = function ()
{
	return this.radius;
};

/**
* Function: Sphere.Clone
* Description: Clones the sphere.
* Returns:
*	{Sphere} a cloned instance
*/
JSM.Sphere.prototype.Clone = function ()
{
	return new JSM.Sphere (this.origo.Clone (), this.radius);
};
