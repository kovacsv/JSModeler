JSM.RenderMaterialFlags = {
	Point : 1,
	Line : 2,
	Triangle : 4,
	Textured : 8,
	Transparent : 16
};

JSM.RenderMaterial = function (type, parameters)
{
	this.type = type;
	this.ambient = [0.0, 0.8, 0.0];
	this.diffuse = [0.0, 0.8, 0.0];
	this.specular = [0.0, 0.0, 0.0];
	this.shininess = 0.0;
	this.opacity = 1.0;
	this.reflection = 0.0;
	this.singleSided = false;
	this.pointSize = 0.1;
	this.texture = null;
	JSM.CopyObjectProperties (parameters, this, true);
};

JSM.RenderMaterial.prototype.SetType = function (type)
{
	this.type = type;
};

JSM.RenderMaterial.prototype.SetBuffers = function (textureBuffer, textureImage)
{
	this.textureBuffer = textureBuffer;
	this.textureImage = textureImage;
};
