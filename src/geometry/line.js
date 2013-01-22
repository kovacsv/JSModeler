JSM.Line2D = function (start, direction)
{
	this.start = start || new JSM.Coord2D ();
	this.direction = direction || new JSM.Vector2D ();
};

JSM.Line2D.prototype =
{
	Set : function (start, direction)
	{
		this.start = beg || new JSM.Coord2D ();
		this.direction = end || new JSM.Vector2D ()
	},
	
	Clone : function ()
	{
		return new JSM.Line2D (this.start.Clone (), this.direction.Clone ());
	}
};

JSM.Line = function (start, direction)
{
	this.start = start || new JSM.Coord ();
	this.direction = direction || new JSM.Vector ();
};

JSM.Line.prototype =
{
	Set : function (start, direction)
	{
		this.start = beg || new JSM.Coord ();
		this.direction = end || new JSM.Vector ()
	},
	
	Clone : function ()
	{
		return new JSM.Line (this.start.Clone (), this.direction.Clone ());
	}
};
