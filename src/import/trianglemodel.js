JSM.TriangleBody = function (name)
{
	this.name = name;
	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.triangles = [];
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
	return this.AddUV (0.0, 0.0);
};

JSM.TriangleBody.prototype.GetDefaultUVIndex = function ()
{
	return this.AddDefaultUV ();
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
			triangle.mat = model.AddDefaultMaterial ();
		}
		
		var normal, normalIndex, uvIndex;
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
			uvIndex = body.GetDefaultUVIndex ();
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

JSM.TriangleModel = function ()
{
	this.materials = [];
	this.bodies = [];
	this.defaultMaterial = -1;
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

JSM.TriangleModel.prototype.AddDefaultMaterial = function ()
{
	if (this.defaultMaterial == -1) {
		this.materials.push ({
			name : 'Default',
			ambient : {r : 0.5, g : 0.5, b : 0.5},
			diffuse : {r : 0.5, g : 0.5, b : 0.5},
			specular : {r : 0.1, g : 0.1, b : 0.1},
			opacity : 1.0
		});
		this.defaultMaterial = this.materials.length - 1;
	}
	return this.defaultMaterial;
};

JSM.TriangleModel.prototype.GetDefaultMaterialIndex = function ()
{
	return this.AddDefaultMaterial ();
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

JSM.TriangleModel.prototype.AddBodyToIndex = function (body, index)
{
	this.bodies.splice (index, 0, body);
	return index;
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
		body.Finalize (this);
	}
};
