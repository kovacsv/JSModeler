JSM.RenderGeometry = function ()
{
	this.material = {};

	this.transformation = JSM.MatrixIdentity ();

	this.vertexArray = null;
	this.normalArray = null;
	this.vertexBuffer = null;
	this.normalBuffer = null;
};

JSM.RenderGeometry.prototype.SetMaterial = function (ambient, diffuse)
{
	this.material.ambient = ambient;
	this.material.diffuse = diffuse;
};

JSM.RenderGeometry.prototype.SetVertexArray = function (vertices)
{
	this.vertexArray = new Float32Array (vertices);
};

JSM.RenderGeometry.prototype.SetNormalArray = function (normals)
{
	this.normalArray = new Float32Array (normals);
};

JSM.RenderGeometry.prototype.GetTransformation = function ()
{
	return this.transformation;
};

JSM.RenderGeometry.prototype.GetVertexBuffer = function ()
{
	return this.vertexBuffer;
};

JSM.RenderGeometry.prototype.GetNormalBuffer = function ()
{
	return this.normalBuffer;
};

JSM.RenderGeometry.prototype.Compile = function (context)
{
	this.vertexBuffer = context.createBuffer ();
	this.normalBuffer = context.createBuffer ();
	
	context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.vertexArray, context.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = parseInt (this.vertexArray.length / 3, 10);

	context.bindBuffer (context.ARRAY_BUFFER, this.normalBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.normalArray, context.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = parseInt (this.normalArray.length / 3, 10);
};
