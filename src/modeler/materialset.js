/**
* Class: MaterialSet
* Description: Defines a material container.
*/
JSM.MaterialSet = function ()
{
	this.materials = [];
	this.defaultMaterial = new JSM.Material ();
};

/**
* Function: MaterialSet.GetMaterial
* Description: Returns a material from the container.
* Parameters:
*	index {integer} the index
* Returns:
*	{Material} the result
*/
JSM.MaterialSet.prototype.GetMaterial = function (index)
{
	if (index < 0 || index >= this.materials.length) {
		return this.defaultMaterial;
	}
	return this.materials[index];
};

/**
* Function: MaterialSet.AddMaterial
* Description: Adds a material to the container.
* Parameters:
*	material {Material} the material
* Returns:
*	{integer} the index of the newly added material
*/
JSM.MaterialSet.prototype.AddMaterial = function (material)
{
	this.materials.push (material);
	return this.materials.length - 1;
};

/**
* Function: MaterialSet.GetDefaultMaterial
* Description: Returns the default material from the container. It is always exists.
* Returns:
*	{Material} the result
*/
JSM.MaterialSet.prototype.GetDefaultMaterial = function ()
{
	return this.defaultMaterial;
};

/**
* Function: MaterialSet.Count
* Description: Returns the material count of the container.
* Returns:
*	{integer} the result
*/
JSM.MaterialSet.prototype.Count = function ()
{
	return this.materials.length;
};
