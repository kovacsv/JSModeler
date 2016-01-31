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

/**
* Class: Materials
* Description: Defines a material container.
*/
JSM.Materials = function ()
{
	this.materials = [];
	this.defaultMaterial = new JSM.Material ();
};

/**
* Function: Materials.GetMaterial
* Description: Returns a material from the container.
* Parameters:
*	index {integer} the index
* Returns:
*	{Material} the result
*/
JSM.Materials.prototype.GetMaterial = function (index)
{
	if (index < 0 || index >= this.materials.length) {
		return this.defaultMaterial;
	}
	return this.materials[index];
};

/**
* Function: Materials.AddMaterial
* Description: Adds a material to the container.
* Parameters:
*	material {Material} the material
* Returns:
*	{integer} the index of the newly added material
*/
JSM.Materials.prototype.AddMaterial = function (material)
{
	this.materials.push (material);
	return this.materials.length - 1;
};

/**
* Function: Materials.GetDefaultMaterial
* Description: Returns the default material from the container. It is always exists.
* Returns:
*	{Material} the result
*/
JSM.Materials.prototype.GetDefaultMaterial = function ()
{
	return this.defaultMaterial;
};

/**
* Function: Materials.Count
* Description: Returns the material count of the container.
* Returns:
*	{integer} the result
*/
JSM.Materials.prototype.Count = function ()
{
	return this.materials.length;
};
