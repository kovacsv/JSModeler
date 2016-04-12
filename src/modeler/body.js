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
	this.position = position;
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
*	{BodyVertex} the cloned instance
*/
JSM.BodyVertex.prototype.Clone = function ()
{
	return new JSM.BodyVertex (this.position.Clone ());
};

/**
* Class: BodyPoint
* Description:
*	Represents a point in a 3D body. The point contains the vertex index stored in its 3D body,
*	and a material index of a material defined outside of the body.
* Parameters:
*	index {integer} the vertex index stored in the body
*/
JSM.BodyPoint = function (index)
{
	this.vertex = index;
	this.material = -1;
};

/**
* Function: BodyPoint.GetVertexIndex
* Description: Returns the body vertex index of the point.
* Returns:
*	{integer} the stored vertex index
*/
JSM.BodyPoint.prototype.GetVertexIndex = function ()
{
	return this.vertex;
};

/**
* Function: BodyPoint.SetVertexIndex
* Description: Sets the vertex index of the point.
* Parameters:
*	index {integer} the vertex index
*/
JSM.BodyPoint.prototype.SetVertexIndex = function (index)
{
	this.vertex = index;
};

/**
* Function: BodyPoint.HasMaterialIndex
* Description: Returns if the point has a material index.
* Returns:
*	{boolean} the result
*/
JSM.BodyPoint.prototype.HasMaterialIndex = function ()
{
	return this.material !== -1;
};

/**
* Function: BodyPoint.GetMaterialIndex
* Description: Returns the point material index.
* Returns:
*	{integer} the result
*/
JSM.BodyPoint.prototype.GetMaterialIndex = function ()
{
	return this.material;
};

/**
* Function: BodyPoint.SetMaterialIndex
* Description: Sets the point material index.
* Parameters:
*	material {integer} the material index
*/
JSM.BodyPoint.prototype.SetMaterialIndex = function (material)
{
	this.material = material;
};

/**
* Function: BodyPoint.InheritAttributes
* Description: Inherits attributes (material) from an another point.
* Parameters:
*	source {BodyPoint} the source point
*/
JSM.BodyPoint.prototype.InheritAttributes = function (source)
{
	this.material = source.material;
};

/**
* Function: BodyPoint.Clone
* Description: Clones the point.
* Returns:
*	{BodyPoint} the cloned instance
*/
JSM.BodyPoint.prototype.Clone = function ()
{
	var result = new JSM.BodyPoint (this.vertex);
	result.material = this.material;
	return result;
};

/**
* Class: BodyLine
* Description:
*	Represents a line in a 3D body. The line contains begin and end indices of vertices
*	stored in its 3D body, and a material index of a material defined outside of the body.
* Parameters:
*	beg {integer} begin vertex index stored in the body
*	end {integer} end vertex index stored in the body
*/
JSM.BodyLine = function (beg, end)
{
	this.beg = beg;
	this.end = end;
	this.material = -1;
};

/**
* Function: BodyLine.GetBegVertexIndex
* Description: Returns the body vertex index at the beginning of the line.
* Returns:
*	{integer} the stored vertex index
*/
JSM.BodyLine.prototype.GetBegVertexIndex = function ()
{
	return this.beg;
};

/**
* Function: BodyLine.SetBegVertexIndex
* Description: Sets the begin vertex index of the line.
* Parameters:
*	index {integer} the vertex index
*/
JSM.BodyLine.prototype.SetBegVertexIndex = function (index)
{
	this.beg = index;
};

/**
* Function: BodyLine.GetEndVertexIndex
* Description: Returns the body vertex index at the end of the line.
* Returns:
*	{integer} the stored vertex index
*/
JSM.BodyLine.prototype.GetEndVertexIndex = function ()
{
	return this.end;
};

/**
* Function: BodyLine.SetEndVertexIndex
* Description: Sets the end vertex index of the line.
* Parameters:
*	index {integer} the vertex index
*/
JSM.BodyLine.prototype.SetEndVertexIndex = function (index)
{
	this.end = index;
};

/**
* Function: BodyLine.HasMaterialIndex
* Description: Returns if the line has a material index.
* Returns:
*	{boolean} the result
*/
JSM.BodyLine.prototype.HasMaterialIndex = function ()
{
	return this.material !== -1;
};

/**
* Function: BodyLine.GetMaterialIndex
* Description: Returns the line material index.
* Returns:
*	{integer} the result
*/
JSM.BodyLine.prototype.GetMaterialIndex = function ()
{
	return this.material;
};

/**
* Function: BodyLine.SetMaterialIndex
* Description: Sets the line material index.
* Parameters:
*	material {integer} the material index
*/
JSM.BodyLine.prototype.SetMaterialIndex = function (material)
{
	this.material = material;
};

/**
* Function: BodyLine.InheritAttributes
* Description: Inherits attributes (material) from an another line.
* Parameters:
*	source {BodyLine} the source line
*/
JSM.BodyLine.prototype.InheritAttributes = function (source)
{
	this.material = source.material;
};

/**
* Function: BodyLine.Clone
* Description: Clones the line.
* Returns:
*	{BodyLine} the cloned instance
*/
JSM.BodyLine.prototype.Clone = function ()
{
	var result = new JSM.BodyLine (this.beg, this.end);
	result.material = this.material;
	return result;
};

/**
* Class: BodyPolygon
* Description:
*	Represents a polygon in a 3D body. The polygon contains indices of vertices stored in its body.
*	It also contains a material index of a material defined outside of the body, and a curve
*	group index which defines its normal vector calculation in case of smooth surfaces.
* Parameters:
*	vertices {integer[*]} array of vertex indices stored in the body
*/
JSM.BodyPolygon = function (vertices)
{
	this.vertices = vertices;
	this.material = -1;
	this.curved = -1;
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
* Function: BodyPolygon.InsertVertexIndex
* Description: Inserts a vertex index to given index in the polygon.
* Parameters:
*	vertexIndex {integer} the vertex index
*	polygonIndex {integer} the index in the polygon
*/
JSM.BodyPolygon.prototype.InsertVertexIndex = function (vertexIndex, polygonIndex)
{
	this.vertices.splice (polygonIndex, 0, vertexIndex);
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
* Function: BodyPolygon.SetVertexIndex
* Description: Sets the body vertex index at the given polygon vertex index.
* Parameters:
*	index {integer} the polygon vertex index
*	vertIndex {integer} the body vertex index
*/
JSM.BodyPolygon.prototype.SetVertexIndex = function (index, vertIndex)
{
	this.vertices[index] = vertIndex;
};

/**
* Function: BodyPolygon.GetVertexIndices
* Description: Returns an array of the body vertex indices in the polygon.
* Returns:
*	{integer[]} the stored vertex indices
*/
JSM.BodyPolygon.prototype.GetVertexIndices = function ()
{
	return this.vertices;
};

/**
* Function: BodyPolygon.SetVertexIndices
* Description: Sets the vertex indices in the polygon.
* Parameters:
*	vertices {integer[]} the new vertex indices
*/
JSM.BodyPolygon.prototype.SetVertexIndices = function (vertices)
{
	this.vertices = vertices;
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
* Function: BodyPolygon.ReverseVertexIndices
* Description: Reverses the order of vertex indices in the polygon.
*/
JSM.BodyPolygon.prototype.ReverseVertexIndices = function ()
{
	this.vertices.reverse ();
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
*	{BodyPolygon} the cloned instance
*/
JSM.BodyPolygon.prototype.Clone = function ()
{
	var result = new JSM.BodyPolygon ([]);
	var i;
	for (i = 0; i < this.vertices.length; i++) {
		result.vertices.push (this.vertices[i]);
	}
	result.material = this.material;
	result.curved = this.curved;
	return result;
};

/**
* Enum: TextureProjectionType
* Description: Texture projection type.
* Values:
*	{Planar} planar projection
*	{Cubic} cubic projection
*	{Cylindrical} cylindrical projection
*/
JSM.TextureProjectionType = {
	Planar : 0,
	Cubic : 1,
	Cylindrical : 2
};

/**
* Class: BodyTextureProjection
* Description:
*	Represents the texture projection of the body. It contains a projection type,
*	and a coordinate system for projection.
*/
JSM.BodyTextureProjection = function ()
{
	this.type = null;
	this.coords = null;
	this.SetCubic (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
};

/**
* Function: BodyTextureProjection.GetType
* Description: Returns the texture projection type.
* Returns:
*	{TextureProjectionType} the result
*/
JSM.BodyTextureProjection.prototype.GetType = function ()
{
	return this.type;
};

/**
* Function: BodyTextureProjection.GetCoords
* Description: Returns the texture projection coordinate system.
* Returns:
*	{CoordSystem} the result
*/
JSM.BodyTextureProjection.prototype.GetCoords = function ()
{
	return this.coords;
};

/**
* Function: BodyTextureProjection.SetType
* Description: Sets the texture projection type.
* Parameters:
*	type {TextureProjectionType} the type
*/
JSM.BodyTextureProjection.prototype.SetType = function (type)
{
	this.type = type;
};

/**
* Function: BodyTextureProjection.SetCoords
* Description: Sets the texture projection coordinates.
* Parameters:
*	coords {CoordSystem} the coordinates
*/
JSM.BodyTextureProjection.prototype.SetCoords = function (coords)
{
	this.coords = coords;
};

/**
* Function: BodyTextureProjection.SetPlanar
* Description: Sets the texture projection to planar with the given parameters.
* Parameters:
*	origo {Coord} origo of the projection
*	xDirection {Vector} x direction of the projection plane
*	yDirection {Vector} y direction of the projection plane
*/
JSM.BodyTextureProjection.prototype.SetPlanar = function (origo, xDirection, yDirection)
{
	this.type = JSM.TextureProjectionType.Planar;
	this.coords = new JSM.CoordSystem (
		origo,
		xDirection,
		yDirection,
		new JSM.Coord (0.0, 0.0, 0.0)
	);
};

/**
* Function: BodyTextureProjection.SetCubic
* Description: Sets the texture projection to cubic with the given parameters.
* Parameters:
*	origo {Coord} origo of the projection
*	xDirection {Vector} x direction (edge of the cube) of the projection
*	yDirection {Vector} y direction (edge of the cube) of the projection
*	zDirection {Vector} z direction (edge of the cube) of the projection
*/
JSM.BodyTextureProjection.prototype.SetCubic = function (origo, xDirection, yDirection, zDirection)
{
	this.type = JSM.TextureProjectionType.Cubic;
	this.coords = new JSM.CoordSystem (
		origo,
		xDirection,
		yDirection,
		zDirection
	);
};

/**
* Function: BodyTextureProjection.SetCylindrical
* Description: Sets the texture projection to cylindrical with the given parameters.
* Parameters:
*	origo {Coord} origo of the projection
*	radius {number} radius of the cylinder
*	xDirection {Vector} x direction (start point along perimeter) of the projection
*	zDirection {Vector} z direction (normal vector) of the projection
*/
JSM.BodyTextureProjection.prototype.SetCylindrical = function (origo, radius, xDirection, zDirection)
{
	this.type = JSM.TextureProjectionType.Cylindrical;
	this.coords = new JSM.CoordSystem (
		origo,
		xDirection.Clone ().SetLength (radius),
		JSM.VectorCross (zDirection, xDirection).SetLength (radius),
		zDirection
	);
};

/**
* Function: BodyTextureProjection.Transform
* Description: Transforms the texture projection coordinate system.
* Parameters:
*	transformation {Transformation} the transformation
*/
JSM.BodyTextureProjection.prototype.Transform = function (transformation)
{
	this.coords.ToAbsoluteCoords ();
	this.coords.origo = transformation.Apply (this.coords.origo);
	this.coords.e1 = transformation.Apply (this.coords.e1);
	this.coords.e2 = transformation.Apply (this.coords.e2);
	this.coords.e3 = transformation.Apply (this.coords.e3);
	this.coords.ToDirectionVectors ();
};

/**
* Function: BodyTextureProjection.Clone
* Description: Clones the texture projection.
* Returns:
*	{BodyTextureProjection} the cloned instance
*/
JSM.BodyTextureProjection.prototype.Clone = function ()
{
	var result = new JSM.BodyTextureProjection ();
	result.SetType (this.type);
	result.SetCoords (this.coords.Clone ());
	return result;
};

/**
* Class: Body
* Description:
*	Represents a 3D body. The body contains vertices, polygons,
*	and a texture coordinate system.
*/
JSM.Body = function ()
{
	this.Clear ();
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
* Function: Body.AddPoint
* Description: Adds a point to the body.
* Parameters:
*	point {BodyPoint} the point
* Returns:
*	{integer} the index of the newly added point
*/
JSM.Body.prototype.AddPoint = function (point)
{
	this.points.push (point);
	return this.points.length - 1;
};

/**
* Function: Body.AddLine
* Description: Adds a line to the body.
* Parameters:
*	line {BodyLine} the line
* Returns:
*	{integer} the index of the newly added line
*/
JSM.Body.prototype.AddLine = function (line)
{
	this.lines.push (line);
	return this.lines.length - 1;
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
* Function: Body.GetPoint
* Description: Returns the point at the given index.
* Parameters:
*	index {integer} the point index
* Returns:
*	{BodyPoint} the result
*/
JSM.Body.prototype.GetPoint = function (index)
{
	return this.points[index];
};

/**
* Function: Body.GetLine
* Description: Returns the line at the given index.
* Parameters:
*	index {integer} the line index
* Returns:
*	{BodyLine} the result
*/
JSM.Body.prototype.GetLine = function (index)
{
	return this.lines[index];
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
* Function: Body.SetPointsMaterialIndex
* Description: Sets the material index for all points in the body.
* Parameters:
*	material {integer} the material index
*/
JSM.Body.prototype.SetPointsMaterialIndex = function (material)
{
	var i;
	for (i = 0; i < this.points.length; i++) {
		this.points[i].SetMaterialIndex (material);
	}
};

/**
* Function: Body.SetLinesMaterialIndex
* Description: Sets the material index for all lines in the body.
* Parameters:
*	material {integer} the material index
*/
JSM.Body.prototype.SetLinesMaterialIndex = function (material)
{
	var i;
	for (i = 0; i < this.lines.length; i++) {
		this.lines[i].SetMaterialIndex (material);
	}
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
* Function: Body.RemoveVertex
* Description: Removes a vertex from the body. It also removes connected polygons.
* Parameters:
*	index {integer} the index of the vertex
*/
JSM.Body.prototype.RemoveVertex = function (index)
{
	var pointsToDelete = [];
	var linesToDelete = [];
	var polygonsToDelete = [];
	var i, j, point, line, polygon, bodyVertIndex;
	for (i = 0; i < this.points.length; i++) {
		point = this.points[i];
		if (point.GetVertexIndex () == index) {
			pointsToDelete.push (i);
		} else if (point.GetVertexIndex () >= index) {
			point.SetVertexIndex (point.GetVertexIndex () - 1);
		}
	}
	for (i = 0; i < this.lines.length; i++) {
		line = this.lines[i];
		if (line.GetBegVertexIndex () == index || line.GetEndVertexIndex () == index) {
			linesToDelete.push (i);
		} else {
			if (line.GetBegVertexIndex () >= index) {
				line.SetBegVertexIndex (line.GetBegVertexIndex () - 1);
			}
			if (line.GetEndVertexIndex () >= index) {
				line.SetEndVertexIndex (line.GetEndVertexIndex () - 1);
			}
		}
	}
	for (i = 0; i < this.polygons.length; i++) {
		polygon = this.polygons[i];
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			bodyVertIndex = polygon.GetVertexIndex (j);
			if (polygon.GetVertexIndex (j) == index) {
				polygonsToDelete.push (i);
				break;
			} else if (bodyVertIndex >= index) {
				polygon.SetVertexIndex (j, bodyVertIndex - 1);
			}
		}
	}
	for (i = 0; i < pointsToDelete.length; i++) {
		this.RemovePoint (pointsToDelete[i] - i);
	}
	for (i = 0; i < linesToDelete.length; i++) {
		this.RemoveLine (linesToDelete[i] - i);
	}
	for (i = 0; i < polygonsToDelete.length; i++) {
		this.RemovePolygon (polygonsToDelete[i] - i);
	}
	this.vertices.splice (index, 1);
};

/**
* Function: Body.RemovePoint
* Description: Removes a point from the body.
* Parameters:
*	index {integer} the index of the point
*/
JSM.Body.prototype.RemovePoint = function (index)
{
	this.points.splice (index, 1);
};

/**
* Function: Body.RemoveLine
* Description: Removes a line from the body.
* Parameters:
*	index {integer} the index of the line
*/
JSM.Body.prototype.RemoveLine = function (index)
{
	this.lines.splice (index, 1);
};

/**
* Function: Body.RemovePolygon
* Description: Removes a polygon from the body.
* Parameters:
*	index {integer} the index of the polygon
*/
JSM.Body.prototype.RemovePolygon = function (index)
{
	this.polygons.splice (index, 1);
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
* Function: Body.PointCount
* Description: Returns the point count of the body.
* Returns:
*	{integer} the result
*/
JSM.Body.prototype.PointCount = function ()
{
	return this.points.length;
};

/**
* Function: Body.LineCount
* Description: Returns the line count of the body.
* Returns:
*	{integer} the result
*/
JSM.Body.prototype.LineCount = function ()
{
	return this.lines.length;
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
* Function: Body.GetTextureProjection
* Description: Returns the texture projection of the body.
* Returns:
*	{BodyTextureProjection} the result
*/
JSM.Body.prototype.GetTextureProjection = function ()
{
	return this.projection;
};

/**
* Function: Body.SetTextureProjection
* Description: Sets the texture projection of the body.
* Parameters:
*	projection {BodyTextureProjection} the new texture projection
*/
JSM.Body.prototype.SetTextureProjection = function (projection)
{
	this.projection = projection;
};

/**
* Function: Body.SetPlanarTextureProjection
* Description: Sets the texture projection to planar with the given parameters.
* Parameters:
*	origo {Coord} origo of the projection
*	xDirection {Vector} x direction of the projection plane
*	yDirection {Vector} y direction of the projection plane
*/
JSM.Body.prototype.SetPlanarTextureProjection = function (origo, xDirection, yDirection)
{
	this.projection.SetPlanar (origo, xDirection, yDirection);
};

/**
* Function: Body.SetCubicTextureProjection
* Description: Sets the texture projection to cubic with the given parameters.
* Parameters:
*	origo {Coord} origo of the projection
*	xDirection {Vector} x direction (edge of the cube) of the projection
*	yDirection {Vector} y direction (edge of the cube) of the projection
*	zDirection {Vector} z direction (edge of the cube) of the projection
*/
JSM.Body.prototype.SetCubicTextureProjection = function (origo, xDirection, yDirection, zDirection)
{
	this.projection.SetCubic (origo, xDirection, yDirection, zDirection);
};

/**
* Function: Body.SetCylindricalTextureProjection
* Description: Sets the texture projection to cylindrical with the given parameters.
* Parameters:
*	origo {Coord} origo of the projection
*	radius {number} radius of the cylinder
*	xDirection {Vector} x direction (start point along perimeter) of the projection
*	zDirection {Vector} z direction (normal vector) of the projection
*/
JSM.Body.prototype.SetCylindricalTextureProjection = function (origo, radius, xDirection, zDirection)
{
	this.projection.SetCylindrical (origo, radius, xDirection, zDirection);
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
	this.projection.Transform (transformation);
};

/**
* Function: Body.GetBoundingBox
* Description: Returns the bounding box of the body.
* Returns:
*	{Box} the result
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
	
	return new JSM.Box (min, max);
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
	return boundingBox.GetCenter ();
};

/**
* Function: Body.GetBoundingSphere
* Description: Returns the bounding sphere of the body.
* Returns:
*	{Sphere} the result
*/
JSM.Body.prototype.GetBoundingSphere = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;
	
	var i, current;
	for (i = 0; i < this.vertices.length; i++) {
		current = center.DistanceTo (this.vertices[i].position);
		if (JSM.IsGreater (current, radius)) {
			radius = current;
		}
	}
	
	var result = new JSM.Sphere (center, radius);
	return result;
};

/**
* Function: Body.OffsetToOrigo
* Description: Offsets the body to the origo.
*/
JSM.Body.prototype.OffsetToOrigo = function ()
{
	var center = this.GetCenter ().Clone ();
	center.MultiplyScalar (-1.0);

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
	
	var newPoint;
	for (i = 0; i < body.PointCount (); i++) {
		newPoint = body.GetPoint (i).Clone ();
		newPoint.SetVertexIndex (newPoint.GetVertexIndex () + oldVertexCount);
		this.points.push (newPoint);
	}	
	
	var newLine;
	for (i = 0; i < body.LineCount (); i++) {
		newLine = body.GetLine (i).Clone ();
		newLine.SetBegVertexIndex (newLine.GetBegVertexIndex () + oldVertexCount);
		newLine.SetEndVertexIndex (newLine.GetEndVertexIndex () + oldVertexCount);
		this.lines.push (newLine);
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
	this.points = [];
	this.lines = [];
	this.polygons = [];
	this.projection = new JSM.BodyTextureProjection ();
};

/**
* Function: Body.Clone
* Description: Clones the body.
* Returns:
*	{Body} the cloned instance
*/
JSM.Body.prototype.Clone = function ()
{
	var result = new JSM.Body ();
	
	var i;
	for (i = 0; i < this.vertices.length; i++) {
		result.AddVertex (this.vertices[i].Clone ());
	}
	
	for (i = 0; i < this.points.length; i++) {
		result.AddPoint (this.points[i].Clone ());
	}

	for (i = 0; i < this.lines.length; i++) {
		result.AddLine (this.lines[i].Clone ());
	}

	for (i = 0; i < this.polygons.length; i++) {
		result.AddPolygon (this.polygons[i].Clone ());
	}

	result.SetTextureProjection (this.projection.Clone ());
	return result;
};
