/**
* Class: TriangleModel
* Description: Represents a 3D model which contains only triangles.
*/
JSM.TriangleModel = function ()
{
	this.materials = [];
	this.bodies = [];
	this.defaultMaterial = -1;
};

/**
* Function: TriangleModel.AddMaterial
* Description: Adds a material to the model.
* Parameters:
*	material {material} the parameters of the material
* Returns:
*	{integer} the index of the added material
*/
JSM.TriangleModel.prototype.AddMaterial = function (material)
{
	this.materials.push (material);
	return this.materials.length - 1;
};

/**
* Function: TriangleModel.GetMaterial
* Description: Returns the material at the given index.
* Parameters:
*	index {integer} the material index
* Returns:
*	{object} the result
*/
JSM.TriangleModel.prototype.GetMaterial = function (index)
{
	return this.materials[index];
};

/**
* Function: TriangleModel.AddDefaultMaterial
* Description: Adds a default material to the model. The default material is stored only once.
* Returns:
*	{integer} the index of the default material
*/
JSM.TriangleModel.prototype.AddDefaultMaterial = function ()
{
	if (this.defaultMaterial == -1) {
		this.defaultMaterial = this.AddMaterial ({});
	}
	return this.defaultMaterial;
};

/**
* Function: TriangleModel.GetDefaultMaterialIndex
* Description: Adds a default material, and returns the index of it.
* Returns:
*	{integer} the result
*/
JSM.TriangleModel.prototype.GetDefaultMaterialIndex = function ()
{
	return this.AddDefaultMaterial ();
};

/**
* Function: TriangleModel.MaterialCount
* Description: Returns the material count of the model.
* Returns:
*	{integer} the result
*/
JSM.TriangleModel.prototype.MaterialCount = function ()
{
	return this.materials.length;
};

/**
* Function: TriangleModel.AddBody
* Description: Adds a body to the model.
* Parameters:
*	body {TriangleBody} the body
* Returns:
*	{integer} the index of the added body
*/
JSM.TriangleModel.prototype.AddBody = function (body)
{
	this.bodies.push (body);
	return this.bodies.length - 1;
};

/**
* Function: TriangleModel.AddBodyToIndex
* Description: Adds a body to the model to the given index.
* Parameters:
*	body {TriangleBody} the body
*	index {integer} the index
* Returns:
*	{integer} the index of the added body
*/
JSM.TriangleModel.prototype.AddBodyToIndex = function (body, index)
{
	this.bodies.splice (index, 0, body);
	return index;
};

/**
* Function: TriangleModel.GetBody
* Description: Returns the body at the given index.
* Parameters:
*	index {integer} the body index
* Returns:
*	{TriangleBody} the result
*/
JSM.TriangleModel.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

/**
* Function: TriangleModel.VertexCount
* Description: Returns the vertex count of the model.
* Returns:
*	{integer} the result
*/
JSM.TriangleModel.prototype.VertexCount = function ()
{
	var result = 0;
	var i, body;
	for (i = 0; i < this.bodies.length; i++) {
		body = this.bodies[i];
		result += body.VertexCount ();
	}
	return result;
};

/**
* Function: TriangleModel.TriangleCount
* Description: Returns the triangle count of the model.
* Returns:
*	{integer} the result
*/
JSM.TriangleModel.prototype.TriangleCount = function ()
{
	var result = 0;
	var i, body;
	for (i = 0; i < this.bodies.length; i++) {
		body = this.bodies[i];
		result += body.TriangleCount ();
	}
	return result;
};

/**
* Function: TriangleModel.BodyCount
* Description: Returns the body count of the model.
* Returns:
*	{integer} the result
*/
JSM.TriangleModel.prototype.BodyCount = function ()
{
	return this.bodies.length;
};

/**
* Function: TriangleModel.FinalizeMaterials
* Description:
*	Finalizes the materials in the model. This fill every not
*	specified material parameter with default values.
*/
JSM.TriangleModel.prototype.FinalizeMaterials = function ()
{
	if(this.defaultMaterial !== -1) {
		var defaultMaterialData = this.materials[this.defaultMaterial];
		this.materials.splice(this.defaultMaterial, 1);
	} else {
		var defaultMaterialData = {
			name : 'Default',
			ambient : [0.5, 0.5, 0.5],
			diffuse : [0.5, 0.5, 0.5],
			specular : [0.1, 0.1, 0.1],
			shininess : 0.0,
			opacity : 1.0,
			reflection : 0.0,
			texture : null,
			offset : null,
			scale : null,
			rotation : null
		};
	}

	var i, material;
	for (i = 0; i < this.materials.length; i++) {
		material = this.materials[i];
		JSM.CopyObjectProperties (defaultMaterialData, material, false);
	}
};

/**
* Function: TriangleModel.FinalizeBodies
* Description: Finalizes all body in the model.
*/
JSM.TriangleModel.prototype.FinalizeBodies = function ()
{
	var i, body;
	for (i = 0; i < this.bodies.length; i++) {
		body = this.bodies[i];
		body.Finalize (this);
	}
};

/**
* Function: TriangleModel.Finalize
* Description: Finalizes the model. It finalizes materials and bodies.
*/
JSM.TriangleModel.prototype.Finalize = function ()
{
	this.FinalizeBodies ();
	this.FinalizeMaterials ();
};
