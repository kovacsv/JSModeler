/**
* Class: Sphere
* Description: Represents a sphere.
* Parameters:
*	center {Coord} the center of the sphere
*	radius {number} the radius of the sphere
*/
JSM.Sphere = function (center, radius)
{
	this.center = center;
	this.radius = radius;
};

/**
* Function: Sphere.Set
* Description: Sets the sphere.
* Parameters:
*	center {Coord} the center of the sphere
*	radius {number} the radius of the sphere
*/
JSM.Sphere.prototype.Set = function (center, radius)
{
	this.center = center;
	this.radius = radius;
};

/**
* Function: Sphere.GetCenter
* Description: Returns the center of the sphere.
* Returns:
*	{Coord} the result
*/
JSM.Sphere.prototype.GetCenter = function ()
{
	return this.center;
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
	return new JSM.Sphere (this.center.Clone (), this.radius);
};
