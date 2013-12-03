JSM.Polygon2D = function ()
{
	this.vertices = [];
};

JSM.Polygon2D.prototype.AddVertex = function (x, y)
{
	this.vertices.push (new JSM.Coord2D (x, y));
};

JSM.Polygon2D.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

JSM.Polygon2D.prototype.SetVertex = function (index, x, y)
{
	this.vertices[index].Set (x, y);
};

JSM.Polygon2D.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

JSM.Polygon2D.prototype.Clear = function ()
{
	this.vertices = [];
};

JSM.Polygon2D.prototype.Clone = function (source)
{
	var result = new JSM.Polygon2D ();
	var i;
	for (i = 0; i < this.vertices.length; i++) {
		result.vertices.push (this.vertices[i].Clone ());
	}
	return result;
};

JSM.ContourPolygon2D = function ()
{
	this.polygons = [];
};

JSM.ContourPolygon2D.prototype.AddVertex = function (contour, x, y)
{
	if (this.polygons[contour] === undefined) {
		this.polygons[contour] = new JSM.Polygon2D ();
	}
	this.polygons[contour].AddVertex (x, y);
};

JSM.ContourPolygon2D.prototype.VertexCount = function (contour)
{
	if (this.polygons[contour] === undefined) {
		return 0;
	}
	return this.polygons[contour].VertexCount ();
};

JSM.ContourPolygon2D.prototype.GetVertex = function (contour, index)
{
	return this.polygons[contour].GetVertex (index);
};

JSM.ContourPolygon2D.prototype.SetVertex = function (contour, index, x, y)
{
	this.polygons[contour].SetVertex (index, x, y);
};

JSM.ContourPolygon2D.prototype.AddContour = function ()
{
	this.polygons.push (new JSM.Polygon2D ());
};

JSM.ContourPolygon2D.prototype.ContourCount = function ()
{
	return this.polygons.length;
};

JSM.ContourPolygon2D.prototype.GetContour = function (contour)
{
	return this.polygons[contour];
};

JSM.ContourPolygon2D.prototype.Clear = function ()
{
	this.polygons = [];
};

JSM.ContourPolygon2D.prototype.Clone = function (source)
{
	var result = new JSM.ContourPolygon2D ();
	var i;
	for (i = 0; i < this.polygons.length; i++) {
		result.polygons.push (this.polygons[i].Clone ());
	}
	return result;
};

JSM.Polygon = function ()
{
	this.vertices = [];
};

JSM.Polygon.prototype.AddVertex = function (x, y, z)
{
	this.vertices.push (new JSM.Coord (x, y, z));
};

JSM.Polygon.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

JSM.Polygon.prototype.SetVertex = function (index, x, y, z)
{
	this.vertices[index].Set (x, y, z);
};

JSM.Polygon.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

JSM.Polygon.prototype.Clear = function ()
{
	this.vertices = [];
};

JSM.Polygon.prototype.Clone = function (source)
{
	var result = new JSM.Polygon ();
	var i;
	for (i = 0; i < this.vertices.length; i++) {
		result.vertices.push (this.vertices[i].Clone ());
	}
	return result;
};
