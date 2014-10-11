/**
* Class: Line2D
* Description: Represents a 2D infinite line.
* Parameters:
*	start {Coord2D} the start point of the line
*	direction {Vector2D} the direction of the line
*/
JSM.Line2D = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line2D.Set
* Description: Sets the line.
* Parameters:
*	start {Coord2D} the start point of the line
*	direction {Vector2D} the direction of the line
*/
JSM.Line2D.prototype.Set = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line2D.Clone
* Description: Clones the line.
* Returns:
*	{Line2D} a cloned instance
*/
JSM.Line2D.prototype.Clone = function ()
{
	return new JSM.Line2D (this.start.Clone (), this.direction.Clone ());
};

/**
* Class: Line
* Description: Represents a 3D infinite line.
* Parameters:
*	start {Coord} the start point of the line
*	direction {Vector} the direction of the line
*/
JSM.Line = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line.Set
* Description: Sets the line.
* Parameters:
*	start {Coord} the start point of the line
*	direction {Vector} the direction of the line
*/
JSM.Line.prototype.Set = function (start, direction)
{
	this.start = start;
	this.direction = direction;
};

/**
* Function: Line.Clone
* Description: Clones the line.
* Returns:
*	{Line} a cloned instance
*/
JSM.Line.prototype.Clone = function ()
{
	return new JSM.Line (this.start.Clone (), this.direction.Clone ());
};
