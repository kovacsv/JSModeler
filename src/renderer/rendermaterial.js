JSM.RenderMaterialFlags = {
	Point : 1,
	Line : 2,
	Polygon : 4,
	Textured : 8,
	Transparent : 16
};

JSM.RenderMaterial = function (type, ambient, diffuse, specular, shininess, opacity, singleSided, pointSize, texture, textureWidth, textureHeight)
{
	this.type = type;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
	this.opacity = opacity;
	this.singleSided = singleSided;
	this.pointSize = pointSize;
	this.texture = texture;
	this.textureWidth = textureWidth;
	this.textureHeight = textureHeight;
	
	this.textureBuffer = null;
	this.textureImage = null;
};

JSM.RenderMaterial.prototype.SetBuffers = function (textureBuffer, textureImage)
{
	this.textureBuffer = textureBuffer;
	this.textureImage = textureImage;
};
