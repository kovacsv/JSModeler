JSM.Polygon2D = function ()
{
	this.vertices = [];
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
	
	VertexCount : function ()
	{
		return this.vertices.length;
	},

	Clear : function ()
	{
		this.vertices = [];
	},

	Clone : function (source)
	{
		var result = new JSM.Polygon2D ();
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			result.vertices.push (this.vertices[i].Clone ());
		}
		return result;
	}
};

JSM.ContourPolygon2D = function ()
{
	this.polygons = [];
};

JSM.ContourPolygon2D.prototype =
{
	AddVertex : function (contour, x, y)
	{
		if (this.polygons[contour] === undefined) {
			this.polygons[contour] = new JSM.Polygon2D ();
		}
		this.polygons[contour].AddVertex (x, y);
	},
	
	VertexCount : function (contour)
	{
		if (this.polygons[contour] === undefined) {
			return 0;
		}
		return this.polygons[contour].VertexCount ();
	},

	GetVertex : function (contour, index)
	{
		return this.polygons[contour].GetVertex (index);
	},

	SetVertex : function (contour, index, x, y)
	{
		this.polygons[contour].SetVertex (index, x, y);
	},

	AddContour : function ()
	{
		this.polygons.push (new JSM.Polygon2D ());
	},

	ContourCount : function ()
	{
		return this.polygons.length;
	},
	
	GetContour : function (contour)
	{
		return this.polygons[contour];
	},

	Clear : function ()
	{
		this.polygons = [];
	},

	Clone : function (source)
	{
		var result = new JSM.ContourPolygon2D ();
		var i;
		for (i = 0; i < this.polygons.length; i++) {
			result.polygons.push (this.polygons[i].Clone ());
		}
		return result;
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
	
	VertexCount : function ()
	{
		return this.vertices.length;
	},

	Clear : function ()
	{
		this.vertices = [];
	},

	Clone : function (source)
	{
		var result = new JSM.Polygon ();
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			result.vertices.push (this.vertices[i].Clone ());
		}
		return result;
	}
};
