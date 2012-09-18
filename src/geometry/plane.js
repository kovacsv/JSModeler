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
	
	SetFromCoordAndDirection : function (coord, direction)
	{
		var normal = JSM.VectorNormalize (direction);
		this.a = normal.x;
		this.b = normal.y;
		this.c = normal.z;
		this.d = -(this.a * coord.x + this.b * coord.y + this.c * coord.z);
	}
};
