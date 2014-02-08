/**
* Class: BodyVertex
* Description:
*	Represents a vertex of a 3D body. The vertex contains
*	only its position as a 3D coordinate.
* Parameters:
*	position {Coord} the position
*/
JSM.BodyVertex = function (position)
{
	this.position = JSM.ValueOrDefault (position, new JSM.Coord ());
};

/**
* Class: BodyPolygon
* Description:
*	Represents a polygon of a 3D body. The polygon contains vertex indices of vertices stored
*	in its 3D body, material indices of materials defined outside of the body, and a curve
*	group index which defines if its normal vector calculation in case of smooth surfaces.
* Parameters:
*	vertices {integer[*]} array of vertex indices stored in the body
*/
JSM.BodyPolygon = function (vertices)
{
	this.vertices = JSM.ValueOrDefault (vertices, []);
	this.material = -1;
	this.curved = -1;
};

/**
* Class: Body
* Description:
*	Represents a 3D body. The body contains vertices, polygons,
*	and a texture coordinate system.
*/
JSM.Body = function ()
{
	this.vertices = [];
	this.polygons = [];
	this.projection = 'Cubic';
	this.coords = new JSM.CoordSystem (
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0),
		new JSM.Coord (0.0, 0.0, 1.0)
	);
};

/**
* Function: BodyVertex.GetPosition
* Description: Returns the position of the vertex.
* Returns:
*	{Coord} the result
*/
JSM.BodyVertex.prototype.GetPosition = function ()
{
	return this.position;
};

/**
* Function: BodyVertex.SetPosition
* Description: Sets the position of the vertex.
* Parameters:
*	position {Coord} the position
*/
JSM.BodyVertex.prototype.SetPosition = function (position)
{
	this.position = position;
};

/**
* Function: BodyVertex.Clone
* Description: Clones the vertex.
* Returns:
*	{BodyVertex} a cloned instance
*/
JSM.BodyVertex.prototype.Clone = function ()
{
	return new JSM.BodyVertex (this.position.Clone ());
};

/**
* Function: BodyPolygon.AddVertexIndex
* Description: Adds a vertex index to the polygon.
* Parameters:
*	index {integer} the vertex index
*/
JSM.BodyPolygon.prototype.AddVertexIndex = function (index)
{
	this.vertices.push (index);
};

/**
* Function: BodyPolygon.GetVertexIndex
* Description: Returns the body vertex index at the given polygon vertex index.
* Parameters:
*	index {integer} the polygon vertex index
* Returns:
*	{integer} the stored vertex index
*/
JSM.BodyPolygon.prototype.GetVertexIndex = function (index)
{
	return this.vertices[index];
};

/**
* Function: BodyPolygon.VertexIndexCount
* Description: Returns the vertex count of the polygon.
* Returns:
*	{integer} the result
*/
JSM.BodyPolygon.prototype.VertexIndexCount = function ()
{
	return this.vertices.length;
};

/**
* Function: BodyPolygon.HasMaterialIndex
* Description: Returns if the polygon has a material index.
* Returns:
*	{boolean} the result
*/
JSM.BodyPolygon.prototype.HasMaterialIndex = function ()
{
	return this.material !== -1;
};

/**
* Function: BodyPolygon.GetMaterialIndex
* Description: Returns the polygons material index.
* Returns:
*	{integer} the result
*/
JSM.BodyPolygon.prototype.GetMaterialIndex = function ()
{
	return this.material;
};

/**
* Function: BodyPolygon.SetMaterialIndex
* Description: Sets the polygons material index.
* Parameters:
*	material {integer} the material index
*/
JSM.BodyPolygon.prototype.SetMaterialIndex = function (material)
{
	this.material = material;
};

/**
* Function: BodyPolygon.HasCurveGroup
* Description: Returns if the polygon has a curve group index.
* Returns:
*	{boolean} the result
*/
JSM.BodyPolygon.prototype.HasCurveGroup = function ()
{
	return this.curved !== -1;
};

/**
* Function: BodyPolygon.GetCurveGroup
* Description: Returns the polygons curve group index.
* Returns:
*	{integer} the result
*/
JSM.BodyPolygon.prototype.GetCurveGroup = function ()
{
	return this.curved;
};

/**
* Function: BodyPolygon.SetCurveGroup
* Description: Sets the polygons curve group index.
* Parameters:
*	group {integer} the curve group index
*/
JSM.BodyPolygon.prototype.SetCurveGroup = function (group)
{
	this.curved = group;
};

/**
* Function: BodyPolygon.InheritAttributes
* Description: Inherits attributes (material and curve group index) from an another polygon.
* Parameters:
*	source {BodyPolygon} the source polygon
*/
JSM.BodyPolygon.prototype.InheritAttributes = function (source)
{
	this.material = source.material;
	this.curved = source.curved;
};

/**
* Function: BodyPolygon.Clone
* Description: Clones the polygon.
* Returns:
*	{BodyPolygon} a cloned instance
*/
JSM.BodyPolygon.prototype.Clone = function ()
{
	var result = new JSM.BodyPolygon ();
	var i;
	for (i = 0; i < this.vertices.length; i++) {
		result.vertices.push (this.vertices[i]);
	}
	result.material = this.material;
	result.curved = this.curved;
	return result;
};

/**
* Function: Body.AddVertex
* Description: Adds a vertex to the body.
* Parameters:
*	vertex {BodyVertex} the vertex
* Returns:
*	{integer} the index of the newly added vertex
*/
JSM.Body.prototype.AddVertex = function (vertex)
{
	this.vertices.push (vertex);
	return this.vertices.length - 1;
};

/**
* Function: Body.AddPolygon
* Description: Adds a polygon to the body.
* Parameters:
*	polygon {BodyPolygon} the polygon
* Returns:
*	{integer} the index of the newly added polygon
*/
JSM.Body.prototype.AddPolygon = function (polygon)
{
	this.polygons.push (polygon);
	return this.polygons.length - 1;
};

/**
* Function: Body.GetVertex
* Description: Returns the vertex at the given index.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{BodyVertex} the result
*/
JSM.Body.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

/**
* Function: Body.GetVertexPosition
* Description: Returns the position of the vertex at the given index.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{Coord} the result
*/
JSM.Body.prototype.GetVertexPosition = function (index)
{
	return this.vertices[index].position;
};

/**
* Function: Body.SetVertexPosition
* Description: Sets the position of the vertex at the given index.
* Parameters:
*	index {integer} the vertex index
*	position {Coord} the new position
*/
JSM.Body.prototype.SetVertexPosition = function (index, position)
{
	this.vertices[index].position = position;
};

/**
* Function: Body.VertexCount
* Description: Returns the vertex count of the body.
* Returns:
*	{integer} the result
*/
JSM.Body.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

/**
* Function: Body.GetPolygon
* Description: Returns the polygon at the given index.
* Parameters:
*	index {integer} the polygon index
* Returns:
*	{BodyPolygon} the result
*/
JSM.Body.prototype.GetPolygon = function (index)
{
	return this.polygons[index];
};

/**
* Function: Body.PolygonCount
* Description: Returns the polygon count of the body.
* Returns:
*	{integer} the result
*/
JSM.Body.prototype.PolygonCount = function ()
{
	return this.polygons.length;
};

/**
* Function: Body.SetPolygonsMaterialIndex
* Description: Sets the material index for all polygons in the body.
* Parameters:
*	material {integer} the material index
*/
JSM.Body.prototype.SetPolygonsMaterialIndex = function (material)
{
	var i;
	for (i = 0; i < this.polygons.length; i++) {
		this.polygons[i].SetMaterialIndex (material);
	}
};

/**
* Function: Body.SetPolygonsCurveGroup
* Description: Sets the curve group index for all polygons in the body.
* Parameters:
*	group {integer} the curve group index
*/
JSM.Body.prototype.SetPolygonsCurveGroup = function (group)
{
	var i;
	for (i = 0; i < this.polygons.length; i++) {
		this.polygons[i].SetCurveGroup (group);
	}
};

/**
* Function: Body.GetTextureProjectionType
* Description: Returns the texture projection type of the body.
* Returns:
*	{string} the result
*/
JSM.Body.prototype.GetTextureProjectionType = function ()
{
	return this.projection;
};

/**
* Function: Body.SetTextureProjectionType
* Description: Sets the texture projection type of the body.
* Parameters:
*	projection {string} the new texture projection type
*/
JSM.Body.prototype.SetTextureProjectionType = function (projection)
{
	this.projection = projection;
};

/**
* Function: Body.GetTextureProjectionCoords
* Description: Returns the texture projection coordinate system of the body.
* Returns:
*	{CoordSystem} the result
*/
JSM.Body.prototype.GetTextureProjectionCoords = function ()
{
	return this.coords;
};

/**
* Function: Body.SetTextureProjectionCoords
* Description: Sets the texture projection coordinate system of the body.
* Parameters:
*	coords {CoordSystem} the new texture projection coordinate system
*/
JSM.Body.prototype.SetTextureProjectionCoords = function (coords)
{
	this.coords = coords;
};

/**
* Function: Body.Transform
* Description: Transforms the body.
* Parameters:
*	transformation {Transformation} the transformation
*/
JSM.Body.prototype.Transform = function (transformation)
{
	var i;
	for (i = 0; i < this.vertices.length; i++) {
		this.vertices[i].position = transformation.Apply (this.vertices[i].position);
	}
	
	if (this.coords !== null) {
		var absoluteSystem = JSM.CoordSystemToAbsoluteCoords (this.coords);
		absoluteSystem.origo = transformation.Apply (absoluteSystem.origo);
		absoluteSystem.e1 = transformation.Apply (absoluteSystem.e1);
		absoluteSystem.e2 = transformation.Apply (absoluteSystem.e2);
		absoluteSystem.e3 = transformation.Apply (absoluteSystem.e3);
		this.coords = JSM.CoordSystemToDirectionVectors (absoluteSystem);
	}
};

/**
* Function: Body.GetBoundingBox
* Description: Returns the bounding box of the body.
* Returns:
*	{Coord[2]} the minimum and maximum coordinate of the bounding box
*/
JSM.Body.prototype.GetBoundingBox = function ()
{
	var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
	var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);

	var i, coord;
	for (i = 0; i < this.vertices.length; i++) {
		coord = this.vertices[i].position;
		min.x = JSM.Minimum (min.x, coord.x);
		min.y = JSM.Minimum (min.y, coord.y);
		min.z = JSM.Minimum (min.z, coord.z);
		max.x = JSM.Maximum (max.x, coord.x);
		max.y = JSM.Maximum (max.y, coord.y);
		max.z = JSM.Maximum (max.z, coord.z);
	}
	
	return [min, max];
};

/**
* Function: Body.GetCenter
* Description: Returns the center of the bounding box of the body.
* Returns:
*	{Coord} the result
*/
JSM.Body.prototype.GetCenter = function ()
{
	var boundingBox = this.GetBoundingBox ();
	return JSM.MidCoord (boundingBox[0], boundingBox[1]);
};

/**
* Function: Body.GetBoundingSphereRadius
* Description: Returns the radius of the bounding sphere of the body.
* Returns:
*	{number} the result
*/
JSM.Body.prototype.GetBoundingSphereRadius = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;
	
	var i, current;
	for (i = 0; i < this.vertices.length; i++) {
		current = JSM.CoordDistance (center, this.vertices[i].position);
		if (JSM.IsGreater (current, radius)) {
			radius = current;
		}
	}
	
	return radius;
};

/**
* Function: Body.OffsetToOrigo
* Description: Offsets the body to the origo.
*/
JSM.Body.prototype.OffsetToOrigo = function ()
{
	var center = this.GetCenter ();
	center = JSM.VectorMultiply (center, -1.0);

	var i;
	for (i = 0; i < this.vertices.length; i++) {
		this.vertices[i].position = JSM.CoordAdd (this.vertices[i].position, center);
	}
};

/**
* Function: Body.Merge
* Description: Merges an existing body to the body.
* Parameters:
*	body {Body} the body to merge
*/
JSM.Body.prototype.Merge = function (body)
{
	var oldVertexCount = this.vertices.length;
	
	var i, j;
	for (i = 0; i < body.VertexCount (); i++) {
		this.vertices.push (body.GetVertex (i).Clone ());
	}
	
	var newPolygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		newPolygon = body.GetPolygon (i).Clone ();
		for (j = 0; j < newPolygon.VertexIndexCount (); j++) {
			newPolygon.vertices[j] += oldVertexCount;
		}
		this.polygons.push (newPolygon);
	}
};

/**
* Function: Body.Clear
* Description: Makes the body empty.
*/
JSM.Body.prototype.Clear = function ()
{
	this.vertices = [];
	this.polygons = [];
	this.projection = null;
	this.coords = null;
};
