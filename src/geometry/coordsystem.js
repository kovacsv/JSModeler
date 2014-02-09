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
	this.origo = JSM.ValueOrDefault (origo, new JSM.Coord ());
	this.e1 = JSM.ValueOrDefault (e1, new JSM.Coord ());
	this.e2 = JSM.ValueOrDefault (e2, new JSM.Coord ());
	this.e3 = JSM.ValueOrDefault (e3, new JSM.Coord ());
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
	this.origo = JSM.ValueOrDefault (origo, new JSM.Coord ());
	this.e1 = JSM.ValueOrDefault (e1, new JSM.Coord ());
	this.e2 = JSM.ValueOrDefault (e2, new JSM.Coord ());
	this.e3 = JSM.ValueOrDefault (e3, new JSM.Coord ());
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
