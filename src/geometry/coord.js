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
* Function: Coord.IsEqual
* Description: Returns if the coordinate is equal with the given one.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{boolean} the result
*/
JSM.Coord.prototype.IsEqual = function (coord)
{
	return JSM.IsEqual (this.x, coord.x) && JSM.IsEqual (this.y, coord.y) && JSM.IsEqual (this.z, coord.z);
};

/**
* Function: Coord.IsEqualWithEps
* Description: Returns if the coordinate is equal with the given one. Uses the given epsilon for comparison.
* Parameters:
*	coord {Coord} the coordinate
*	eps {number} the epsilon
* Returns:
*	{boolean} the result
*/
JSM.Coord.prototype.IsEqualWithEps = function (coord, eps)
{
	return JSM.IsEqualWithEps (this.x, coord.x, eps) && JSM.IsEqualWithEps (this.y, coord.y, eps) && JSM.IsEqualWithEps (this.z, coord.z, eps);
};

/**
* Function: Coord.DistanceTo
* Description: Calculates the coordinate distance to the given one.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{number} the result
*/
JSM.Coord.prototype.DistanceTo = function (coord)
{
	return Math.sqrt ((coord.x - this.x) * (coord.x - this.x) + (coord.y - this.y) * (coord.y - this.y) + (coord.z - this.z) * (coord.z - this.z));
};

/**
* Function: Coord.AngleTo
* Description: Calculates the coordinate vector angle to the given one.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{number} the result
*/
JSM.Coord.prototype.AngleTo = function (coord)
{
	var aDirection = this.Clone ().Normalize ();
	var bDirection = coord.Clone ().Normalize ();
	if (aDirection.IsEqual (bDirection)) {
		return 0.0;
	}
	var product = JSM.VectorDot (aDirection, bDirection);
	return JSM.ArcCos (product);
};

/**
* Function: Coord.IsCollinearWith
* Description: Calculates the coordinate vector is collinear with the given one.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{boolean} the result
*/
JSM.Coord.prototype.IsCollinearWith = function (coord)
{
	var angle = this.AngleTo (coord);
	return JSM.IsEqual (angle, 0.0) || JSM.IsEqual (angle, Math.PI);
};

/**
* Function: Coord.Length
* Description: Calculates the length of the coordinate vector.
* Returns:
*	{number} the result
*/
JSM.Coord.prototype.Length = function ()
{
	return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
};

/**
* Function: Coord.MultiplyScalar
* Description: Multiplies the vector with a scalar.
* Parameters:
*	scalar {number} the scalar
* Returns:
*	{Coord} this pointer
*/
JSM.Coord.prototype.MultiplyScalar = function (scalar)
{
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
	return this;
};


/**
* Function: Coord.Normalize
* Description: Normalizes the coordinate vector.
* Returns:
*	{Coord} this pointer
*/
JSM.Coord.prototype.Normalize = function ()
{
	var length = this.Length ();
	if (JSM.IsPositive (length)) {
		this.MultiplyScalar (1.0 / length);
	}
	return this;
};

/**
* Function: Coord.SetLength
* Description: Sets the length of the coordinate vector.
* Parameters:
*	length {number} the length
* Returns:
*	{Coord} this pointer
*/
JSM.Coord.prototype.SetLength = function (length)
{
	var thisLength = this.Length ();
	if (JSM.IsPositive (thisLength)) {
		this.MultiplyScalar (length / thisLength);
	}
	return this;
};

/**
* Function: Coord.Offset
* Description: Offsets the coordinate.
* Parameters:
*	direction {Vector} the direction of the offset
*	distance {number} the distance of the offset
* Returns:
*	{Coord} this pointer
*/
JSM.Coord.prototype.Offset = function (direction, distance)
{
	var normal = direction.Clone ().Normalize ();
	this.x += normal.x * distance;
	this.y += normal.y * distance;
	this.z += normal.z * distance;
	return this;
};

/**
* Function: Coord.Rotate
* Description: Rotates the coordinate.
* Parameters:
*	axis {Vector} the axis of the rotation
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Coord} this pointer
*/

JSM.Coord.prototype.Rotate = function (axis, angle, origo)
{
	var normal = axis.Clone ().Normalize ();

	var u = normal.x;
	var v = normal.y;
	var w = normal.z;

	var x = this.x - origo.x;
	var y = this.y - origo.y;
	var z = this.z - origo.z;

	var si = Math.sin (angle);
	var co = Math.cos (angle);
	this.x = - u * (- u * x - v * y - w * z) * (1.0 - co) + x * co + (- w * y + v * z) * si;
	this.y = - v * (- u * x - v * y - w * z) * (1.0 - co) + y * co + (w * x - u * z) * si;
	this.z = - w * (- u * x - v * y - w * z) * (1.0 - co) + z * co + (- v * x + u * y) * si;
	
	this.x += origo.x;
	this.y += origo.y;
	this.z += origo.z;
	return this;
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
* Function: Coord.ToCoord2D
* Description: Converts the coordinate to a 2D coordinate.
* Parameters:
*	normal {Vector} the normal vector for conversion
* Returns:
*	{Coord2D} the result
*/
JSM.Coord.prototype.ToCoord2D = function (normal)
{
	var origo = new JSM.Coord (0.0, 0.0, 0.0);
	var zNormal = new JSM.Vector (0.0, 0.0, 1.0);
	var axis = JSM.VectorCross (normal, zNormal);
	var angle = normal.AngleTo (zNormal);
	var rotated = this.Clone ().Rotate (axis, angle, origo);
	return new JSM.Coord2D (rotated.x, rotated.y);
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
* Function: CoordFromArray
* Description: Returns a coordinate from an array of components.
* Parameters:
*	array {number[3]} the array of components
* Returns:
*	{Coord} the result
*/
JSM.CoordFromArray = function (array)
{
	return new JSM.Coord (array[0], array[1], array[2]);
};

/**
* Function: CoordToArray
* Description: Returns array of components from a coordinate.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	array {number[3]} the result
*/
JSM.CoordToArray = function (coord)
{
	return [coord.x, coord.y, coord.z];
};

/**
* Function: CoordAdd
* Description: Adds two coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
* Returns:
*	{Coord} the result
*/
JSM.CoordAdd = function (a, b)
{
	return new JSM.Coord (a.x + b.x, a.y + b.y, a.z + b.z);
};

/**
* Function: CoordSub
* Description: Subs two coordinates.
* Parameters:
*	a {Coord} the first coordinate
*	b {Coord} the second coordinate
* Returns:
*	{Coord} the result
*/
JSM.CoordSub = function (a, b)
{
	return new JSM.Coord (a.x - b.x, a.y - b.y, a.z - b.z);
};

/**
* Function: VectorDot
* Description: Calculates the dot product of two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
* Returns:
*	{number} the result
*/
JSM.VectorDot = function (a, b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

/**
* Function: VectorCross
* Description: Calculates the cross product of two vectors.
* Parameters:
*	a {Vector} the first vector
*	b {Vector} the second vector
* Returns:
*	{Vector} the result
*/
JSM.VectorCross = function (a, b)
{
	var result = new JSM.Vector (0.0, 0.0, 0.0);
	result.x = a.y * b.z - a.z * b.y;
	result.y = a.z * b.x - a.x * b.z;
	result.z = a.x * b.y - a.y * b.x;
	return result;
};
