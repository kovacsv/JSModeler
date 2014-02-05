/**
* Class: Sector2D
* Description: Represents a 2D sector.
* Parameters:
*	beg {Coord2D} the beginning coordinate
*	end {Coord2D} the ending coordinate
*/
JSM.Sector2D = function (beg, end)
{
	this.beg = JSM.ValueOrDefault (beg, new JSM.Coord2D ());
	this.end = JSM.ValueOrDefault (end, new JSM.Coord2D ());
};

/**
* Function: Sector2D.Set
* Description: Sets the sector.
* Parameters:
*	beg {Coord2D} the beginning coordinate
*	end {Coord2D} the ending coordinate
*/
JSM.Sector2D.prototype.Set = function (beg, end)
{
	this.beg = JSM.ValueOrDefault (beg, new JSM.Coord2D ());
	this.end = JSM.ValueOrDefault (end, new JSM.Coord2D ());
};

/**
* Function: Sector2D.Clone
* Description: Clones the sector.
* Returns:
*	{Sector2D} a cloned instance
*/
JSM.Sector2D.prototype.Clone = function ()
{
	return new JSM.Sector2D (this.beg.Clone (), this.end.Clone ());
};

/**
* Class: Sector
* Description: Represents a 3D sector.
* Parameters:
*	beg {Coord} the beginning coordinate
*	end {Coord} the ending coordinate
*/
JSM.Sector = function (beg, end)
{
	this.beg = JSM.ValueOrDefault (beg, new JSM.Coord ());
	this.end = JSM.ValueOrDefault (end, new JSM.Coord ());
};


/**
* Function: Sector.Set
* Description: Sets the sector.
* Parameters:
*	beg {Coord} the beginning coordinate
*	end {Coord} the ending coordinate
*/
JSM.Sector.prototype.Set = function (beg, end)
{
	this.beg = JSM.ValueOrDefault (beg, new JSM.Coord ());
	this.end = JSM.ValueOrDefault (end, new JSM.Coord ());
};

/**
* Function: Sector.Clone
* Description: Clones the sector.
* Returns:
*	{Sector} a cloned instance
*/
JSM.Sector.prototype.Clone = function ()
{
	return new JSM.Sector (this.beg.Clone (), this.end.Clone ());
};
