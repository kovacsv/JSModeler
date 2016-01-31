JSM.RenderMesh = function (material)
{
	this.material = material;
	
	this.vertexArray = null;
	this.normalArray = null;
	this.uvArray = null;
	
	this.vertexBuffer = null;
	this.normalBuffer = null;
	this.uvBuffer = null;
};

JSM.RenderMesh.prototype.SetMaterial = function (material)
{
	this.material = material;
};

JSM.RenderMesh.prototype.GetMaterial = function ()
{
	return this.material;
};

JSM.RenderMesh.prototype.SetVertexArray = function (vertices)
{
	this.vertexArray = new Float32Array (vertices);
};

JSM.RenderMesh.prototype.SetNormalArray = function (normals)
{
	this.normalArray = new Float32Array (normals);
};

JSM.RenderMesh.prototype.SetUVArray = function (uvs)
{
	this.uvArray = new Float32Array (uvs);
};

JSM.RenderMesh.prototype.HasVertexArray = function ()
{
	return this.vertexArray !== null;
};

JSM.RenderMesh.prototype.HasNormalArray = function ()
{
	return this.normalArray !== null;
};

JSM.RenderMesh.prototype.HasUVArray = function ()
{
	return this.uvArray !== null;
};

JSM.RenderMesh.prototype.GetVertexArray = function ()
{
	return this.vertexArray;
};

JSM.RenderMesh.prototype.GetNormalArray = function ()
{
	return this.normalArray;
};

JSM.RenderMesh.prototype.GetUVArray = function ()
{
	return this.uvArray;
};

JSM.RenderMesh.prototype.SetBuffers = function (vertexBuffer, normalBuffer, uvBuffer)
{
	this.vertexBuffer = vertexBuffer;
	this.normalBuffer = normalBuffer;
	this.uvBuffer = uvBuffer;
};

JSM.RenderMesh.prototype.GetVertexBuffer = function ()
{
	return this.vertexBuffer;
};

JSM.RenderMesh.prototype.GetNormalBuffer = function ()
{
	return this.normalBuffer;
};

JSM.RenderMesh.prototype.GetUVBuffer = function ()
{
	return this.uvBuffer;
};

JSM.RenderMesh.prototype.VertexCount = function ()
{
	return parseInt (this.vertexArray.length / 3, 10);
};

JSM.RenderMesh.prototype.NormalCount = function ()
{
	return parseInt (this.normalArray.length / 3, 10);
};

JSM.RenderMesh.prototype.UVCount = function ()
{
	return parseInt (this.uvArray.length / 2, 10);
};

JSM.RenderMesh.prototype.GetVertex = function (index)
{
	return new JSM.Coord (this.vertexArray[3 * index], this.vertexArray[3 * index + 1], this.vertexArray[3 * index + 2]);
};

JSM.RenderMesh.prototype.GetTransformedVertex = function (index, transformation)
{
	var vertex = this.GetVertex (index);
	return transformation.Apply (vertex);
};
