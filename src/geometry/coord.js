JSM.Coord2D = function (x, y)
{
	this.x = JSM.ValueOrDefault (x, 0.0);
	this.y = JSM.ValueOrDefault (y, 0.0);
};

JSM.Coord2D.prototype =
{
	Set : function (x, y)
	{
		this.x = JSM.ValueOrDefault (x, 0.0);
		this.y = JSM.ValueOrDefault (y, 0.0);
	},
	
	ToString : function ()
	{
		return ('(' + this.x + ', ' + this.y + ')');
	},
	
	Clone : function ()
	{
		return new JSM.Coord2D (this.x, this.y);
	}
};

JSM.PolarCoord = function (radius, angle)
{
	this.radius = JSM.ValueOrDefault (radius, 1.0);
	this.angle = JSM.ValueOrDefault (angle, 0.0);
};

JSM.PolarCoord.prototype =
{
	Set : function (radius, angle)
	{
		this.radius = JSM.ValueOrDefault (radius, 1.0);
		this.angle = JSM.ValueOrDefault (angle, 0.0);
	},
	
	ToString : function ()
	{
		return ('(' + this.radius + ', ' + this.angle + ')');
	},
	
	Clone : function ()
	{
		return new JSM.PolarCoord (this.radius, this.angle);
	}
};

JSM.Coord = function (x, y, z)
{
	this.x = JSM.ValueOrDefault (x, 0.0);
	this.y = JSM.ValueOrDefault (y, 0.0);
	this.z = JSM.ValueOrDefault (z, 0.0);
};

JSM.Coord.prototype =
{
	Set : function (x, y, z)
	{
		this.x = JSM.ValueOrDefault (x, 0.0);
		this.y = JSM.ValueOrDefault (y, 0.0);
		this.z = JSM.ValueOrDefault (z, 0.0);
	},
	
	ToString : function ()
	{
		return ('(' + this.x + ', ' + this.y + ', ' + this.z + ')');
	},
	
	Clone : function ()
	{
		return new JSM.Coord (this.x, this.y, this.z);
	}
};

JSM.Vector2D = JSM.Coord2D;
JSM.Vector = JSM.Coord;
