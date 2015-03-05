JSM.TriangleBody = function (name)
{
	this.name = name;
	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.triangles = [];
	this.defaultUVIndex = -1;
};

JSM.TriangleBody.prototype.SetName = function (name)
{
	this.name = name;
};

JSM.TriangleBody.prototype.GetName = function ()
{
	return this.name;
};

JSM.TriangleBody.prototype.AddVertex = function (x, y, z)
{
	this.vertices.push (new JSM.Coord (x, y, z));
	return this.vertices.length - 1;
};

JSM.TriangleBody.prototype.GetVertex = function (index)
{
	return this.vertices[index];
};

JSM.TriangleBody.prototype.SetVertex = function (index, x, y, z)
{
	this.vertices[index] = new JSM.Coord (x, y, z);
};

JSM.TriangleBody.prototype.VertexCount = function ()
{
	return this.vertices.length;
};

JSM.TriangleBody.prototype.AddNormal = function (x, y, z)
{
	this.normals.push (new JSM.Coord (x, y, z));
	return this.normals.length - 1;
};

JSM.TriangleBody.prototype.GetNormal = function (index)
{
	return this.normals[index];
};

JSM.TriangleBody.prototype.NormalCount = function ()
{
	return this.normals.length;
};

JSM.TriangleBody.prototype.AddUV = function (x, y)
{
	this.uvs.push (new JSM.Coord2D (x, y));
	return this.uvs.length - 1;
};

JSM.TriangleBody.prototype.AddDefaultUV = function ()
{
	if (this.defaultUVIndex != -1) {
		return this.defaultUVIndex;
	}
	
	this.defaultUVIndex = this.AddUV (0.0, 0.0);
	return this.defaultUVIndex;
};

JSM.TriangleBody.prototype.GetUV = function (index)
{
	return this.uvs[index];
};

JSM.TriangleBody.prototype.UVCount = function ()
{
	return this.uvs.length;
};

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

JSM.TriangleBody.prototype.GetTriangle = function (index)
{
	return this.triangles[index];
};

JSM.TriangleBody.prototype.TriangleCount = function ()
{
	return this.triangles.length;
};

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
			
			averageNormal = JSM.VectorMultiply (averageNormal, 1.0 / averageCount);
			averageNormal = JSM.VectorNormalize (averageNormal);
			return body.AddNormal (averageNormal.x, averageNormal.y, averageNormal.z);
		}
	
		var triangle = body.triangles[i];
		if (triangle.mat === undefined) {
			triangle.mat = model.GetDefaultMaterialIndex ();
		}
		
		var normal, normalIndex;
		if (triangle.n0 === undefined || triangle.n1 === undefined || triangle.n2 === undefined) {
			if (triangle.curve === undefined || triangle.curve === 0) {
				normal = triangleNormals[i];
				normalIndex = body.AddNormal (normal.x, normal.y, normal.z);
				triangle.n0 = normalIndex;
				triangle.n1 = normalIndex;
				triangle.n2 = normalIndex;
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
