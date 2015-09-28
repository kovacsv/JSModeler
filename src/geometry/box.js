/**
* Class: Box2D
* Description: Represents a 2D box.
* Parameters:
*	min {Coord2D} the minimum position of the box
*	min {Coord2D} the maximum position of the box
*/
JSM.Box2D = function (min, max)
{
	this.min = min;
	this.max = max;
};

/**
* Function: Box2D.Set
* Description: Sets the box.
* Parameters:
*	min {Coord2D} the minimum position of the box
*	min {Coord2D} the maximum position of the box
*/
JSM.Box2D.prototype.Set = function (min, max)
{
	this.min = min;
	this.max = max;
};

/**
* Function: Box2D.GetCenter
* Description: Returns the center point of the box.
* Returns:
*	{Coord2D} the result
*/
JSM.Box2D.prototype.GetCenter = function ()
{
	return JSM.MidCoord2D (this.min, this.max);
};

/**
* Function: Box2D.Clone
* Description: Clones the box.
* Returns:
*	{Box2D} a cloned instance
*/
JSM.Box2D.prototype.Clone = function ()
{
	return new JSM.Box2D (this.min.Clone (), this.max.Clone ());
};

/**
* Class: Box
* Description: Represents a 3D box.
* Parameters:
*	min {Coord} the minimum position of the box
*	min {Coord} the maximum position of the box
*/
JSM.Box = function (min, max)
{
	this.min = min;
	this.max = max;
};

/**
* Function: Box.Set
* Description: Sets the box.
* Parameters:
*	min {Coord} the minimum position of the box
*	min {Coord} the maximum position of the box
*/
JSM.Box.prototype.Set = function (min, max)
{
	this.min = min;
	this.max = max;
};

/**
* Function: Box.GetCenter
* Description: Returns the center point of the box.
* Returns:
*	{Coord} the result
*/
JSM.Box.prototype.GetCenter = function ()
{
	return JSM.MidCoord (this.min, this.max);
};

/**
* Function: Box.GetSize
* Description: Returns the size of the box.
* Returns:
*	{Coord} the result
*/
JSM.Box.prototype.GetSize = function ()
{
	return JSM.CoordSub (this.max, this.min);
};

/**
* Function: Box.IsCoordInside
* Description: Determines if the given coordinate is inside the box.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{boolean} the result
*/
JSM.Box.prototype.IsCoordInside = function (coord)
{
	if (JSM.IsLower (coord.x, this.min.x) || JSM.IsLower (coord.y, this.min.y) || JSM.IsLower (coord.z, this.min.z)) {
		return false;
	}
	if (JSM.IsGreater (coord.x, this.max.x) || JSM.IsGreater (coord.y, this.max.y) || JSM.IsGreater (coord.z, this.max.z)) {
		return false;
	}
	return true;
};

/**
* Function: Box.Clone
* Description: Clones the box.
* Returns:
*	{Box} a cloned instance
*/
JSM.Box.prototype.Clone = function ()
{
	return new JSM.Box (this.min.Clone (), this.max.Clone ());
};

/**
* Function: BoxUnion
* Description: Calculates the union of two 3D boxes.
* Parameters:
*	aBox {Box} the first box
*	bBox {Box} the second box
* Returns:
*	{Box} the result
*/
JSM.BoxUnion = function (aBox, bBox)
{
	var min = new JSM.Coord (JSM.Minimum (aBox.min.x, bBox.min.x), JSM.Minimum (aBox.min.y, bBox.min.y), JSM.Minimum (aBox.min.z, bBox.min.z));
	var max = new JSM.Coord (JSM.Maximum (aBox.max.x, bBox.max.x), JSM.Maximum (aBox.max.y, bBox.max.y), JSM.Maximum (aBox.max.z, bBox.max.z));
	return new JSM.Box (min, max);
};
