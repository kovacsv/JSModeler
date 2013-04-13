JSM.Plane = function (a, b, c, d)
{
	this.a = a || 0.0;
	this.b = b || 0.0;
	this.c = c || 0.0;
	this.d = d || 0.0;
};

JSM.Plane.prototype =
{
	Set : function (a, b, c, d)
	{
		this.a = a || 0.0;
		this.b = b || 0.0;
		this.c = c || 0.0;
		this.d = d || 0.0;	
	},
	
	Clone : function ()
	{
		return new JSM.Plane (this.a, this.b, this.c, this.d);
	}
};
