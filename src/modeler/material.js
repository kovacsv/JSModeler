/**
* Class: Material
* Description: Defines a material.
* Parameters:
*	ambient {number} the ambient component
*	diffuse {number} the diffuse component
*	opacity {number} the opacity component
*	texture {string} the name of the texture file
*	textureWidth {number} the width of the texture
*	textureHeight {number} the height of the texture
*/
JSM.Material = function (ambient, diffuse, opacity, texture, textureWidth, textureHeight)
{
	this.ambient = JSM.ValueOrDefault (ambient, 0x00cc00);
	this.diffuse = JSM.ValueOrDefault (diffuse, 0x00cc00);
	this.opacity = JSM.ValueOrDefault (opacity, 1.0);
	this.texture = JSM.ValueOrDefault (texture, null);
	this.textureWidth = JSM.ValueOrDefault (textureWidth, 1.0);
	this.textureHeight = JSM.ValueOrDefault (textureHeight, 1.0);
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
*/
JSM.Materials.prototype.AddMaterial = function (material)
{
	this.materials.push (material);
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
