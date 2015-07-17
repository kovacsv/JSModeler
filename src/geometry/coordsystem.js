/**
* Class: CoordSystem
* Description: Represents coordinate system.
* Parameters:
*	origo {Coord} origo
*	e1 {Vector} first direction vector
*	e2 {Vector} second direction vector
*	e3 {Vector} third direction vector
*/
JSM.CoordSystem = function (origo, e1, e2, e3)
{
	this.origo = origo;
	this.e1 = e1;
	this.e2 = e2;
	this.e3 = e3;
};

/**
* Function: CoordSystem.Set
* Description: Sets the coordinate system.
* Parameters:
*	origo {Coord} origo
*	e1 {Vector} first direction vector
*	e2 {Vector} second direction vector
*	e3 {Vector} third direction vector
*/
JSM.CoordSystem.prototype.Set = function (origo, e1, e2, e3)
{
	this.origo = origo;
	this.e1 = e1;
	this.e2 = e2;
	this.e3 = e3;
};

/**
* Function: CoordSystem.CoordSystemToDirectionVectors
* Description: Converts coordinate system vectors to origo relative direction vectors.
* Returns:
*	{CoordSystem} this pointer
*/
JSM.CoordSystem.prototype.ToDirectionVectors = function ()
{
	this.e1 = JSM.CoordSub (this.e1, this.origo);
	this.e2 = JSM.CoordSub (this.e2, this.origo);
	this.e3 = JSM.CoordSub (this.e3, this.origo);
	return this;
};

/**
* Function: CoordSystem.CoordSystemToAbsoluteCoords
* Description: Converts the coordinate system vectors to absolute coordinates.
* Returns:
*	{CoordSystem} this pointer
*/
JSM.CoordSystem.prototype.ToAbsoluteCoords = function ()
{
	this.e1 = JSM.CoordAdd (this.e1, this.origo);
	this.e2 = JSM.CoordAdd (this.e2, this.origo);
	this.e3 = JSM.CoordAdd (this.e3, this.origo);
	return this;
};

/**
* Function: CoordSystem.Clone
* Description: Clones the coordinate system.
* Returns:
*	{CoordSystem} a cloned instance
*/
JSM.CoordSystem.prototype.Clone = function ()
{
	return new JSM.CoordSystem (this.origo.Clone (), this.e1.Clone (), this.e2.Clone (), this.e3.Clone ());
};
