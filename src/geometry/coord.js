JSM.Coord2D = function (x, y)
{
	this.x = x || 0.0;
	this.y = y || 0.0;
};

JSM.Coord2D.prototype =
{
	Set : function (x, y)
	{
		this.x = x || 0.0;
		this.y = y || 0.0;
	}
};

JSM.Coord = function (x, y, z)
{
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
};

JSM.Coord.prototype =
{
	Set : function (x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
};

JSM.Vector2D = JSM.Coord2D;
JSM.Vector = JSM.Coord;
