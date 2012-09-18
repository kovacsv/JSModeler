JSM.Polygon2D = function (source)
{
	if (source === undefined) {
		this.vertices = [];
	} else {
		if (source instanceof JSM.Polygon2D) {
			this.vertices = source.vertices;
		} else if (source instanceof Array) {
			this.vertices = source;
		}
	}
};

JSM.Polygon2D.prototype =
{
	AddVertex : function (x, y)
	{
		this.vertices.push (new JSM.Coord2D (x, y));
	},
	
	GetVertex : function (index)
	{
		return this.vertices[index];
	},
	
	SetVertex : function (index, x, y)
	{
		this.vertices[index].Set (x, y);
	},
	
	Count : function ()
	{
		return this.vertices.length;
	},

	Clone : function (source)
	{
		if (source instanceof JSM.Polygon2D) {
			this.vertices = source.vertices.slice (0);
		} else if (source instanceof Array) {
			this.vertices = source.slice (0);
		}
	},
	
	Clear : function ()
	{
		this.vertices = [];
	}
};


JSM.Polygon = function (source)
{
	if (source === undefined) {
		this.vertices = [];
	} else {
		if (source instanceof JSM.Polygon) {
			this.vertices = source.vertices;
		} else if (source instanceof Array) {
			this.vertices = source;
		}
	}
};

JSM.Polygon.prototype =
{
	AddVertex : function (x, y, z)
	{
		this.vertices.push (new JSM.Coord (x, y, z));
	},
	
	GetVertex : function (index)
	{
		return this.vertices[index];
	},
	
	SetVertex : function (index, x, y, z)
	{
		this.vertices[index].Set (x, y, z);
	},
	
	Count : function ()
	{
		return this.vertices.length;
	},

	Clone : function (source)
	{
		if (source instanceof JSM.Polygon) {
			this.vertices = source.vertices.slice (0);
		} else if (source instanceof Array) {
			this.vertices = source.slice (0);
		}
	},
	
	Clear : function ()
	{
		this.vertices = [];
	}
};
