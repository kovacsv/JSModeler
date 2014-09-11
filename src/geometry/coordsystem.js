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
* Function: CoordSystem.Clone
* Description: Clones the coordinate system.
* Returns:
*	{CoordSystem} a cloned instance
*/
JSM.CoordSystem.prototype.Clone = function ()
{
	return new JSM.CoordSystem (this.origo.Clone (), this.e1.Clone (), this.e2.Clone (), this.e3.Clone ());
};
