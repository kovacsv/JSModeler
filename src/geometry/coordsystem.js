JSM.CoordSystem = function (origo, e1, e2, e3)
{
	this.origo = origo || new JSM.Coord ();
	this.e1 = e1 || new JSM.Coord ();
	this.e2 = e2 || new JSM.Coord ();
	this.e3 = e3 || new JSM.Coord ();
};

JSM.CoordSystem.prototype =
{
	Set : function (origo, e1, e2, e3)
	{
		this.origo = origo || new JSM.Coord ();
		this.e1 = e1 || new JSM.Coord ();
		this.e2 = e2 || new JSM.Coord ();
		this.e3 = e3 || new JSM.Coord ();
	}
};
