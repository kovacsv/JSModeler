JSM.Sector2D = function (beg, end)
{
	this.beg = JSM.ValueOrDefault (beg, new JSM.Coord2D ());
	this.end = JSM.ValueOrDefault (end, new JSM.Coord2D ());
};

JSM.Sector2D.prototype =
{
	Set : function (beg, end)
	{
		this.beg = JSM.ValueOrDefault (beg, new JSM.Coord2D ());
		this.end = JSM.ValueOrDefault (end, new JSM.Coord2D ());
	},
	
	Clone : function ()
	{
		return new JSM.Sector2D (this.beg.Clone (), this.end.Clone ());
	}
};

JSM.Sector = function (beg, end)
{
	this.beg = JSM.ValueOrDefault (beg, new JSM.Coord ());
	this.end = JSM.ValueOrDefault (end, new JSM.Coord ());
};

JSM.Sector.prototype =
{
	Set : function (beg, end)
	{
		this.beg = JSM.ValueOrDefault (beg, new JSM.Coord ());
		this.end = JSM.ValueOrDefault (end, new JSM.Coord ());
	},
	
	Clone : function ()
	{
		return new JSM.Sector (this.beg.Clone (), this.end.Clone ());
	}
};
