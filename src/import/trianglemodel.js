JSM.TriangleBody = function (name)
{
	this.name = name;
	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.triangles = [];
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
	return this.vertices.length - 1;
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
		n0 : JSM.ValueOrDefault (n0, -1),
		n1 : JSM.ValueOrDefault (n1, -1),
		n2 : JSM.ValueOrDefault (n2, -1),
		u0 : JSM.ValueOrDefault (u0, -1),
		u1 : JSM.ValueOrDefault (u1, -1),
		u2 : JSM.ValueOrDefault (u2, -1),
		mat : JSM.ValueOrDefault (mat, -1),
		curve : JSM.ValueOrDefault (curve, -1)
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

JSM.TriangleBody.prototype.Finalize = function ()
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
	
		var normal, normalIndex;
		if (triangle.n0 == -1 || triangle.n1 == -1 || triangle.n2 == -1) {
			if (triangle.curve === -1 || triangle.curve === 0) {
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
		
		var uvIndex;
		if (triangle.u0 == -1 || triangle.u1 == -1 || triangle.u2 == -1) {
			uvIndex = body.AddUV (0.0, 0.0);
			triangle.u0 = uvIndex;
			triangle.u1 = uvIndex;
			triangle.u2 = uvIndex;
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

JSM.TriangleModel = function ()
{
	this.materials = [];
	this.bodies = [];
};

JSM.TriangleModel.prototype.AddMaterial = function (name, ambient, diffuse, specular, opacity)
{
	this.materials.push ({
		name : name,
		ambient : ambient,
		diffuse : diffuse,
		specular : specular,
		opacity : opacity
	});
	return this.materials.length - 1;
};

JSM.TriangleModel.prototype.GetMaterial = function (index)
{
	return this.materials[index];
};

JSM.TriangleModel.prototype.MaterialCount = function ()
{
	return this.materials.length;
};

JSM.TriangleModel.prototype.AddBody = function (body)
{
	this.bodies.push (body);
	return this.bodies.length - 1;
};

JSM.TriangleModel.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

JSM.TriangleModel.prototype.BodyCount = function ()
{
	return this.bodies.length;
};

JSM.TriangleModel.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

JSM.TriangleModel.prototype.Finalize = function ()
{
	var i, body;
	for (i = 0; i < this.bodies.length; i++) {
		body = this.bodies[i];
		body.Finalize ();
	}
};
