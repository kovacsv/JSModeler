JSM.RenderMaterialFlags = {
	Point : 1,
	Line : 2,
	Triangle : 4,
	Textured : 8,
	Transparent : 16
};

JSM.RenderMaterial = function (type, parameters)
{
	var defaultParameters = {
		ambient : [0.0, 0.8, 0.0],
		diffuse : [0.0, 0.8, 0.0],
		specular : [0.0, 0.0, 0.0],
		shininess : 0.0,
		opacity : 1.0,
		reflection : 0.0,
		singleSided : false,
		pointSize : 0.1,
		texture : null,
		textureWidth : 1.0,
		textureHeight : 1.0
	};

	this.type = type;
	JSM.CopyObjectProperties (parameters, this, true);
	JSM.CopyObjectProperties (defaultParameters, this, false);	
};

JSM.RenderMaterial.prototype.SetBuffers = function (textureBuffer, textureImage)
{
	this.textureBuffer = textureBuffer;
	this.textureImage = textureImage;
};
