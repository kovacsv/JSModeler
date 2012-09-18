JSM.Sector2D = function (beg, end)
{
	this.beg = beg || new JSM.Coord2D ();
	this.end = end || new JSM.Coord2D ();
};

JSM.Sector2D.prototype =
{
	Set : function (beg, end)
	{
		this.beg = beg || new JSM.Coord2D ();
		this.end = end || new JSM.Coord2D ();
	}
};

JSM.Sector = function (beg, end)
{
	this.beg = beg || new JSM.Coord ();
	this.end = end || new JSM.Coord ();
};

JSM.Sector.prototype =
{
	Set : function (beg, end)
	{
		this.beg = beg || 0.0;
		this.end = end || 0.0;
	}
};
