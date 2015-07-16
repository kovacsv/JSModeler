/**
* Class: TriangleBody
* Description: Represents a 3D body which contains only triangles.
*/
JSM.TriangleBody = function (name)
{
	this.name = name;
	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.triangles = [];
	this.defaultUVIndex = -1;
};

/**
* Function: TriangleBody.SetName
* Description: Sets the name of the body.
* Parameters:
*	name {string} the name
*/
JSM.TriangleBody.prototype.SetName = function (name)
{
	this.name = name;
};

/**
* Function: TriangleBody.GetName
* Description: Returns the name of the body.
* Returns:
*	{string} the result
*/
JSM.TriangleBody.prototype.GetName = function ()
{
	return this.name;
};

/**
* Function: TriangleBody.AddVertex
* Description: Adds a vertex to the body.
* Parameters:
*	x, y, z {number} the coordinates of the vertex
* Returns:
*	{integer} the index of the added vertex
*/
JSM.TriangleBody.prototype.AddVertex = function (x, y, z)
{
	this.vertices.push (new JSM.Coord (x, y, z));
	return this.vertices.length - 1;
};

/**
* Function: TriangleBody.GetVertex
* Description: Returns the vertex at the given index.
* Parameters:
*	index {integer} the vertex index
* Returns:
*	{Coord} the result
*/
JSM.TriangleBody.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

/**
* Function: TriangleBody.SetVertex
* Description: Sets the position of the vertex at the given index.
* Parameters:
*	index {integer} the vertex index
*	x, y, z {number} the new coordinates of the vertex
*/
JSM.TriangleBody.prototype.SetVertex = function (index, x, y, z)
{
	this.vertices[index] = new JSM.Coord (x, y, z);
};

/**
* Function: TriangleBody.VertexCount
* Description: Returns the vertex count of the body.
* Returns:
*	{integer} the result
*/
JSM.TriangleBody.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

/**
* Function: TriangleBody.AddNormal
* Description: Adds a normal vector to the body.
* Parameters:
*	x, y, z {number} the coordinates of the normal vector
* Returns:
*	{integer} the index of the added normal vector
*/
JSM.TriangleBody.prototype.AddNormal = function (x, y, z)
{
	this.normals.push (new JSM.Vector (x, y, z));
	return this.normals.length - 1;
};

/**
* Function: TriangleBody.GetNormal
* Description: Returns the normal vector at the given index.
* Parameters:
*	index {integer} the normal vector index
* Returns:
*	{Vector} the result
*/
JSM.TriangleBody.prototype.GetNormal = function (index)
{
	return this.normals[index];
};


/**
* Function: TriangleBody.GetTriangleNormal
* Description: Returns the normal vector of a triangle at the given position.
* Parameters:
*	triangleIndex {integer} the triangle index
*	normalPosition {Coord} the position of the normal inside the triangle
* Returns:
*	{Vector} the result
*/
JSM.TriangleBody.prototype.GetTriangleNormal = function (triangleIndex, normalPosition)
{
	var normal = null;
	var triangle = this.triangles[triangleIndex];
	if (triangle.curve == -1) {
		normal = this.GetNormal (triangle.n0);
	} else {
		var v0 = this.GetVertex (triangle.v0);
		var v1 = this.GetVertex (triangle.v1);
		var v2 = this.GetVertex (triangle.v2);
		var n0 = this.GetNormal (triangle.n0);
		var n1 = this.GetNormal (triangle.n1);
		var n2 = this.GetNormal (triangle.n2);
		normal = JSM.BarycentricInterpolation (v0, v1, v2, n0, n1, n2, normalPosition);
	}
	return normal;
};

/**
* Function: TriangleBody.NormalCount
* Description: Returns the normal vector count of the body.
* Returns:
*	{integer} the result
*/
JSM.TriangleBody.prototype.NormalCount = function ()
{
	return this.normals.length;
};

/**
* Function: TriangleBody.AddUV
* Description: Adds a texture coordinate to the body.
* Parameters:
*	x, y {number} the coordinates of the texture coordinate
* Returns:
*	{integer} the index of the added texture coordinate
*/
JSM.TriangleBody.prototype.AddUV = function (x, y)
{
	this.uvs.push (new JSM.Coord2D (x, y));
	return this.uvs.length - 1;
};

/**
* Function: TriangleBody.AddDefaultUV
* Description:
*	Adds a default texture coordinate to the body.
*	The default texture coordinate is stored only once.
* Returns:
*	{integer} the index of the default texture coordinate
*/
JSM.TriangleBody.prototype.AddDefaultUV = function ()
{
	if (this.defaultUVIndex != -1) {
		return this.defaultUVIndex;
	}
	
	this.defaultUVIndex = this.AddUV (0.0, 0.0);
	return this.defaultUVIndex;
};

/**
* Function: TriangleBody.GetUV
* Description: Returns the texture coordinate at the given index.
* Parameters:
*	index {integer} the texture coordinate index
* Returns:
*	{Coord2D} the result
*/
JSM.TriangleBody.prototype.GetUV = function (index)
{
	return this.uvs[index];
};

/**
* Function: TriangleBody.UVCount
* Description: Returns the texture coordinate count of the body.
* Returns:
*	{integer} the result
*/
JSM.TriangleBody.prototype.UVCount = function ()
{
	return this.uvs.length;
};

/**
* Function: TriangleBody.AddTriangle
* Description: Adds a triangle to the body.
* Parameters:
*	v0, v1, v2 {integer} the vertex indices of the triangle
*	n0, n1, n2 {integer} the normal vector indices of the triangle
*	u0, u1, u2 {integer} the texture coordinate indices of the triangle
*	mat {integer} the material index of the triangle
*	curve {integer} the curve group index of the triangle
* Returns:
*	{integer} the index of the added triangle
*/
JSM.TriangleBody.prototype.AddTriangle = function (v0, v1, v2, n0, n1, n2, u0, u1, u2, mat, curve)
{
	this.triangles.push ({
		v0 : v0,
		v1 : v1,
		v2 : v2,
		n0 : n0,
		n1 : n1,
		n2 : n2,
		u0 : u0,
		u1 : u1,
		u2 : u2,
		mat : mat,
		curve : curve
	});
	return this.triangles.length - 1;
};

/**
* Function: TriangleBody.GetTriangle
* Description: Returns the triangle at the given index.
* Parameters:
*	index {integer} the triangle index
* Returns:
*	{object} the result
*/
JSM.TriangleBody.prototype.GetTriangle = function (index)
{
	return this.triangles[index];
};

/**
* Function: TriangleBody.TriangleCount
* Description: Returns the triangle count of the body.
* Returns:
*	{integer} the result
*/
JSM.TriangleBody.prototype.TriangleCount = function ()
{
	return this.triangles.length;
};

/**
* Function: TriangleBody.GetBoundingBox
* Description: Returns the bounding box of the body.
* Returns:
*	{Box} the result
*/
JSM.TriangleBody.prototype.GetBoundingBox = function ()
{
	var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
	var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);

	var i, coord;
	for (i = 0; i < this.vertices.length; i++) {
		coord = this.vertices[i];
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
* Function: TriangleBody.GetCenter
* Description: Returns the center of the bounding box of the body.
* Returns:
*	{Coord} the result
*/
JSM.TriangleBody.prototype.GetCenter = function ()
{
	var boundingBox = this.GetBoundingBox ();
	return boundingBox.GetCenter ();
};

/**
* Function: TriangleBody.GetBoundingSphere
* Description: Returns the bounding sphere of the body.
* Returns:
*	{Sphere} the result
*/
JSM.TriangleBody.prototype.GetBoundingSphere = function ()
{
	var center = this.GetCenter ();
	var radius = 0.0;
	
	var i, current;
	for (i = 0; i < this.vertices.length; i++) {
		current = center.DistanceTo (this.vertices[i]);
		if (JSM.IsGreater (current, radius)) {
			radius = current;
		}
	}
	
	var result = new JSM.Sphere (center, radius);
	return result;
};

/**
* Function: TriangleBody.Finalize
* Description:
*	Finalizes the body. This operation calculates normal vectors
*	and fixes the body if some data is missing from it.
* Parameters:
*	model {TriangleModel} the triangle index
*/
JSM.TriangleBody.prototype.Finalize = function (model)
{
	function FinalizeTriangle (body, triangleIndex, triangleNormals, vertexToTriangles)
	{
		function AddAverageNormal (body, vertexIndex, triangleIndex, triangleNormals, vertexToTriangles)
		{
			var averageNormal = new JSM.Vector (0.0, 0.0, 0.0);
			var averageCount = 0;
			
			var triangle = body.GetTriangle (triangleIndex);
			var neighbourTriangles = vertexToTriangles[vertexIndex];
			var i, neighbourTriangleIndex, neighbourTriangle;
			for (i = 0; i < neighbourTriangles.length; i++) {
				neighbourTriangleIndex = neighbourTriangles[i];
				neighbourTriangle = body.GetTriangle (neighbourTriangleIndex);
				if (triangle.curve == neighbourTriangle.curve) {
					averageNormal = JSM.CoordAdd (averageNormal, triangleNormals[neighbourTriangleIndex]);
					averageCount = averageCount + 1;
				}
			}
			
			averageNormal.MultiplyScalar (1.0 / averageCount);
			averageNormal.Normalize ();
			return body.AddNormal (averageNormal.x, averageNormal.y, averageNormal.z);
		}
	
		var triangle = body.triangles[i];
		if (triangle.mat === undefined || triangle.mat < 0) {
			triangle.mat = model.GetDefaultMaterialIndex ();
		}
		
		var normal, normalIndex;
		if (triangle.n0 === undefined || triangle.n1 === undefined || triangle.n2 === undefined) {
			if (triangle.curve === undefined || triangle.curve < 0) {
				normal = triangleNormals[i];
				normalIndex = body.AddNormal (normal.x, normal.y, normal.z);
				triangle.n0 = normalIndex;
				triangle.n1 = normalIndex;
				triangle.n2 = normalIndex;
				triangle.curve = -1;
			} else {
				triangle.n0 = AddAverageNormal (body, triangle.v0, triangleIndex, triangleNormals, vertexToTriangles);
				triangle.n1 = AddAverageNormal (body, triangle.v1, triangleIndex, triangleNormals, vertexToTriangles);
				triangle.n2 = AddAverageNormal (body, triangle.v2, triangleIndex, triangleNormals, vertexToTriangles);
			}
		}
		
		if (triangle.u0 === undefined || triangle.u1 === undefined || triangle.u2 === undefined) {
			triangle.u0 = body.AddDefaultUV ();
			triangle.u1 = body.AddDefaultUV ();
			triangle.u2 = body.AddDefaultUV ();
		}
	}

	var triangleNormals = [];
	var vertexToTriangles = {};

	var i;
	for (i = 0; i < this.vertices.length; i++) {
		vertexToTriangles[i] = [];
	}
	
	var triangle, normal;
	for (i = 0; i < this.triangles.length; i++) {
		triangle = this.triangles[i];
		normal = JSM.CalculateTriangleNormal (this.vertices[triangle.v0], this.vertices[triangle.v1], this.vertices[triangle.v2]);
		triangleNormals.push (normal);
		vertexToTriangles[triangle.v0].push (i);
		vertexToTriangles[triangle.v1].push (i);
		vertexToTriangles[triangle.v2].push (i);
	}

	for (i = 0; i < this.triangles.length; i++) {
		FinalizeTriangle (this, i, triangleNormals, vertexToTriangles);
	}
};

/**
* Function: TriangleBody.Clone
* Description: Clones the body.
* Returns:
*	{TriangleBody} a cloned instance
*/
JSM.TriangleBody.prototype.Clone = function ()
{
	var result = new JSM.TriangleBody (this.name);
	
	var i, triangle;
	
	for (i = 0; i < this.vertices.length; i++) {
		result.vertices.push (this.vertices[i].Clone ());
	}
	
	for (i = 0; i < this.normals.length; i++) {
		result.normals.push (this.normals[i].Clone ());
	}
	
	for (i = 0; i < this.uvs.length; i++) {
		result.uvs.push (this.uvs[i].Clone ());
	}
	
	for (i = 0; i < this.triangles.length; i++) {
		triangle = this.triangles[i];
		result.triangles.push ({
			v0 : triangle.v0,
			v1 : triangle.v1,
			v2 : triangle.v2,
			n0 : triangle.n0,
			n1 : triangle.n1,
			n2 : triangle.n2,
			u0 : triangle.u0,
			u1 : triangle.u1,
			u2 : triangle.u2,
			mat : triangle.mat,
			curve : triangle.curve
		});
	}
	
	return result;
};
