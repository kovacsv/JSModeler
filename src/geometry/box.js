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
* Function: Box.Clone
* Description: Clones the box.
* Returns:
*	{Box} a cloned instance
*/
JSM.Box.prototype.Clone = function ()
{
	return new JSM.Box (this.min.Clone (), this.max.Clone ());
};
