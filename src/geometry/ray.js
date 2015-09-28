/**
* Class: Ray
* Description: Represents a Ray.
* Parameters:
*	origin {Coord} the starting point of the ray
*	direction {Vector} the direction of the ray
*	length {number} the length of the ray, null means infinite ray
*/
JSM.Ray = function (origin, direction, length)
{
	this.origin = origin;
	this.direction = direction.Normalize ();
	this.length = length;
};

/**
* Function: Ray.Set
* Description: Sets the ray.
* Parameters:
*	origin {Coord} the starting point of the ray
*	direction {Vector} the direction of the ray
*	length {number} the length of the ray, null means infinite ray
*/
JSM.Ray.prototype.Set = function (origin, direction, length)
{
	this.origin = origin;
	this.direction = direction.Normalize ();
	this.length = length;
};

/**
* Function: Ray.GetOrigin
* Description: Returns the origin of the ray.
* Returns:
*	{Coord} the result
*/
JSM.Ray.prototype.GetOrigin = function ()
{
	return this.origin;
};

/**
* Function: Ray.GetDirection
* Description: Returns the direction of the ray.
* Returns:
*	{Vector} the result
*/
JSM.Ray.prototype.GetDirection = function ()
{
	return this.direction;
};

/**
* Function: Ray.IsLengthReached
* Description:
*	Returns if the given length is greater than the length of the ray.
*	Always return false in case of infinite ray.
* Returns:
*	{boolean} the result
*/
JSM.Ray.prototype.IsLengthReached = function (length)
{
	if (this.length === undefined || this.length === null) {
		return false;
	}
	return JSM.IsGreater (length, this.length);
};

/**
* Function: Ray.Clone
* Description: Clones the ray.
* Returns:
*	{Ray} a cloned instance
*/
JSM.Ray.prototype.Clone = function ()
{
	return new JSM.Ray (this.origin.Clone (), this.direction.Clone (), this.length);
};
