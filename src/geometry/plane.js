JSM.Plane = function (a, b, c, d)
{
	this.a = JSM.ValueOrDefault (a, 0.0);
	this.b = JSM.ValueOrDefault (b, 0.0);
	this.c = JSM.ValueOrDefault (c, 0.0);
	this.d = JSM.ValueOrDefault (d, 0.0);
};

JSM.Plane.prototype.Set = function (a, b, c, d)
{
	this.a = JSM.ValueOrDefault (a, 0.0);
	this.b = JSM.ValueOrDefault (b, 0.0);
	this.c = JSM.ValueOrDefault (c, 0.0);
	this.d = JSM.ValueOrDefault (d, 0.0);
};

JSM.Plane.prototype.GetNormal = function ()
{
	return new JSM.Vector (this.a, this.b, this.c);
};

JSM.Plane.prototype.Clone = function ()
{
	return new JSM.Plane (this.a, this.b, this.c, this.d);
};
