/**
* Class: Material
* Description:
*	Defines a material. The parameter structure can contain the following values:
*	ambient, diffuse, specular, shininess, opacity, texture, textureWidth, textureHeight.
* Parameters:
*	parameters {object} parameters of the material
*/
JSM.Material = function (parameters)
{
	this.ambient = 0x00cc00;
	this.diffuse = 0x00cc00;
	this.specular = 0x000000;
	this.shininess = 0.0;
	this.opacity = 1.0;
	this.reflection = 0.0;
	this.singleSided = false;
	this.pointSize = 0.1;
	this.texture = null;
	this.textureWidth = 1.0;
	this.textureHeight = 1.0;
	JSM.CopyObjectProperties (parameters, this, true);
};
