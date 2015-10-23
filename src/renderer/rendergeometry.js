JSM.RenderLight = function (ambient, diffuse, specular, direction)
{
	this.ambient = JSM.HexColorToNormalizedRGBComponents (ambient);
	this.diffuse = JSM.HexColorToNormalizedRGBComponents (diffuse);
	this.specular = JSM.HexColorToNormalizedRGBComponents (specular);
	this.direction = direction.Clone ();
};

JSM.RenderMaterial = function (ambient, diffuse, specular, shininess, texture, textureWidth, textureHeight)
{
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
	this.texture = texture;
	this.textureWidth = textureWidth;
	this.textureHeight = textureHeight;
	
	this.textureBuffer = null;
	this.textureImage = null;
	this.textureLoaded = false;
};

JSM.RenderMaterial.prototype.HasTexture = function ()
{
	return this.texture !== null && this.textureLoaded;
};

JSM.RenderGeometry = function ()
{
	this.transformation = new JSM.Transformation ();

	this.material = null;
	
	this.vertexArray = null;
	this.normalArray = null;
	this.uvArray = null;
	
	this.vertexBuffer = null;
	this.normalBuffer = null;
	this.uvBuffer = null;
};

JSM.RenderGeometry.prototype.SetMaterial = function (material)
{
	this.material = material;
};

JSM.RenderGeometry.prototype.GetMaterial = function ()
{
	return this.material;
};

JSM.RenderGeometry.prototype.SetVertexArray = function (vertices)
{
	this.vertexArray = new Float32Array (vertices);
};

JSM.RenderGeometry.prototype.SetNormalArray = function (normals)
{
	this.normalArray = new Float32Array (normals);
};

JSM.RenderGeometry.prototype.SetUVArray = function (uvs)
{
	this.uvArray = new Float32Array (uvs);
};

JSM.RenderGeometry.prototype.GetTransformation = function ()
{
	return this.transformation;
};

JSM.RenderGeometry.prototype.GetTransformationMatrix = function ()
{
	return this.transformation.matrix;
};

JSM.RenderGeometry.prototype.SetTransformation = function (transformation)
{
	this.transformation = transformation;
};

JSM.RenderGeometry.prototype.GetVertexBuffer = function ()
{
	return this.vertexBuffer;
};

JSM.RenderGeometry.prototype.GetNormalBuffer = function ()
{
	return this.normalBuffer;
};

JSM.RenderGeometry.prototype.GetUVBuffer = function ()
{
	return this.uvBuffer;
};

JSM.RenderGeometry.prototype.VertexCount = function ()
{
	return parseInt (this.vertexArray.length / 3, 10);
};

JSM.RenderGeometry.prototype.GetVertex = function (index)
{
	return new JSM.Coord (this.vertexArray[3 * index], this.vertexArray[3 * index + 1], this.vertexArray[3 * index + 2]);
};

JSM.RenderGeometry.prototype.GetTransformedVertex = function (index)
{
	var vertex = this.GetVertex (index);
	return this.transformation.Apply (vertex);
};
