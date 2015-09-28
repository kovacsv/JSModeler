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
* Function: Coord2D.IsEqual
* Description: Returns if the coordinate is equal with the given one.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	{boolean} the result
*/
JSM.Coord2D.prototype.IsEqual = function (coord)
{
	return JSM.IsEqual (this.x, coord.x) && JSM.IsEqual (this.y, coord.y);
};

/**
* Function: Coord2D.IsEqualWithEps
* Description: Returns if the coordinate is equal with the given one. Uses the given epsilon for comparison.
* Parameters:
*	coord {Coord2D} the coordinate
*	eps {number} the epsilon
* Returns:
*	{boolean} the result
*/
JSM.Coord2D.prototype.IsEqualWithEps = function (coord, eps)
{
	return JSM.IsEqualWithEps (this.x, coord.x, eps) && JSM.IsEqualWithEps (this.y, coord.y, eps);
};

/**
* Function: Coord2D.DistanceTo
* Description: Calculates the coordinate distance to the given one.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	{number} the result
*/
JSM.Coord2D.prototype.DistanceTo = function (coord)
{
	return Math.sqrt ((coord.x - this.x) * (coord.x - this.x) + (coord.y - this.y) * (coord.y - this.y));
};

/**
* Function: Coord2D.Length
* Description: Calculates the length of the coordinate vector.
* Returns:
*	{number} the result
*/
JSM.Coord2D.prototype.Length = function ()
{
	return Math.sqrt (this.x * this.x + this.y * this.y);
};

/**
* Function: Coord2D.MultiplyScalar
* Description: Multiplies the vector with a scalar.
* Parameters:
*	scalar {number} the scalar
* Returns:
*	{Coord2D} this pointer
*/
JSM.Coord2D.prototype.MultiplyScalar = function (scalar)
{
	this.x *= scalar;
	this.y *= scalar;
	return this;
};

/**
* Function: Coord2D.Normalize
* Description: Normalizes the coordinate vector.
* Returns:
*	{Coord2D} this pointer
*/
JSM.Coord2D.prototype.Normalize = function ()
{
	var length = this.Length ();
	if (JSM.IsPositive (length)) {
		this.MultiplyScalar (1.0 / length);
	}
	return this;
};

/**
* Function: Coord2D.SetLength
* Description: Sets the length of the coordinate vector.
* Parameters:
*	length {number} the length
* Returns:
*	{Coord2D} this pointer
*/
JSM.Coord2D.prototype.SetLength = function (length)
{
	var thisLength = this.Length ();
	if (JSM.IsPositive (thisLength)) {
		this.MultiplyScalar (length / thisLength);
	}
	return this;
};

/**
* Function: Coord2D.Offset
* Description: Offsets the coordinate.
* Parameters:
*	direction {Vector2D} the direction of the offset
*	distance {number} the distance of the offset
* Returns:
*	{Coord2D} this pointer
*/
JSM.Coord2D.prototype.Offset = function (direction, distance)
{
	var normal = direction.Clone ().Normalize ();
	this.x += normal.x * distance;
	this.y += normal.y * distance;
	return this;
};

/**
* Function: Coord2D.Rotate
* Description: Rotates the coordinate.
* Parameters:
*	angle {number} the angle of the rotation
*	origo {Coord2D} the origo of the rotation
* Returns:
*	{Coord2D} this pointer
*/
JSM.Coord2D.prototype.Rotate = function (angle, origo)
{
	var x = this.x - origo.x;
	var y = this.y - origo.y;
	var co = Math.cos (angle);
	var si = Math.sin (angle);
	this.x = x * co - y * si + origo.x;
	this.y = x * si + y * co + origo.y;
	return this;
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
* Class: Vector2D
* Description: Same as Coord2D.
*/
JSM.Vector2D = JSM.Coord2D;

/**
* Function: CoordFromArray2D
* Description: Returns a coordinate from an array of components.
* Parameters:
*	array {number[2]} the array of components
* Returns:
*	{Coord2D} the result
*/
JSM.CoordFromArray2D = function (array)
{
	return new JSM.Coord2D (array[0], array[1]);
};

/**
* Function: CoordToArray2D
* Description: Returns array of components from a coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	array {number[2]} the result
*/
JSM.CoordToArray2D = function (coord)
{
	return [coord.x, coord.y];
};

/**
* Function: CoordAdd2D
* Description: Adds two coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{Coord2D} the result
*/
JSM.CoordAdd2D = function (a, b)
{
	return new JSM.Coord2D (a.x + b.x, a.y + b.y);
};

/**
* Function: CoordSub2D
* Description: Subs two coordinates.
* Parameters:
*	a {Coord2D} the first coordinate
*	b {Coord2D} the second coordinate
* Returns:
*	{Coord2D} the result
*/
JSM.CoordSub2D = function (a, b)
{
	return new JSM.Coord2D (a.x - b.x, a.y - b.y, a.z - b.z);
};
