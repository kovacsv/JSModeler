JSM.Line2D = function (start, direction)
{
	this.start = JSM.ValueOrDefault (start, new JSM.Coord2D ());
	this.direction = JSM.ValueOrDefault (direction, new JSM.Vector2D ());
};

JSM.Line2D.prototype.Set = function (start, direction)
{
	this.start = JSM.ValueOrDefault (start, new JSM.Coord2D ());
	this.direction = JSM.ValueOrDefault (direction, new JSM.Vector2D ());
};

JSM.Line2D.prototype.Clone = function ()
{
	return new JSM.Line2D (this.start.Clone (), this.direction.Clone ());
};

JSM.Line = function (start, direction)
{
	this.start = JSM.ValueOrDefault (start, new JSM.Coord ());
	this.direction = JSM.ValueOrDefault (direction, new JSM.Vector ());
};

JSM.Line.prototype.Set = function (start, direction)
{
	this.start = JSM.ValueOrDefault (start, new JSM.Coord ());
	this.direction = JSM.ValueOrDefault (direction, new JSM.Vector ());
};

JSM.Line.prototype.Clone = function ()
{
	return new JSM.Line (this.start.Clone (), this.direction.Clone ());
};
