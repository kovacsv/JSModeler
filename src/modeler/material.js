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
	var defaultParameters = {
		ambient : 0x00cc00,
		diffuse : 0x00cc00,
		specular : 0x000000,
		shininess : 0.0,
		opacity : 1.0,
		reflection : 0.0,
		texture : null,
		textureWidth : 1.0,
		textureHeight : 1.0
	};

	JSM.CopyObjectProperties (parameters, this, true);
	JSM.CopyObjectProperties (defaultParameters, this, false);
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
