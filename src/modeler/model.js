/**
* Class: Model
* Description: Represents a 3D model. The model contains bodies.
*/
JSM.Model = function ()
{
	this.bodies = [];
	this.materials = new JSM.MaterialSet ();
};

/**
* Function: Model.AddBody
* Description: Adds a body to the model.
* Parameters:
*	body {Body} the body
* Returns:
*	{integer} the index of the newly added body
*/
JSM.Model.prototype.AddBody = function (body)
{
	this.bodies.push (body);
	return this.bodies.length - 1;
};

/**
* Function: Model.AddBodies
* Description: Adds bodies to the model.
* Parameters:
*	bodies {Body[*]} the body
*/
JSM.Model.prototype.AddBodies = function (bodies)
{
	var i, body;
	for (i = 0; i < bodies.length; i++) {
		body = bodies[i];
		this.AddBody (body);
	}
};

/**
* Function: Model.GetBody
* Description: Returns the stored body with the given index.
* Parameters:
*	index {integer} the index of the body
* Returns:
*	{Body} the result
*/
JSM.Model.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

/**
* Function: Model.BodyCount
* Description: Returns the body count of the model.
* Returns:
*	{integer} the result
*/
JSM.Model.prototype.BodyCount = function ()
{
	return this.bodies.length;
};

/**
* Function: Model.AddMaterial
* Description: Adds a material to the mode.
* Parameters:
*	material {Material} the material
* Returns:
*	{integer} the index of the newly added material
*/
JSM.Model.prototype.AddMaterial = function (material)
{
	return this.materials.AddMaterial (material);
};

/**
* Function: Model.GetMaterial
* Description: Returns a material from the model.
* Parameters:
*	index {integer} the index
* Returns:
*	{Material} the result
*/
JSM.Model.prototype.GetMaterial = function (index)
{
	return this.materials.GetMaterial (index);
};

/**
* Function: Model.GetDefaultMaterial
* Description: Returns the default material from the model. It is always exists.
* Returns:
*	{Material} the result
*/
JSM.Model.prototype.GetDefaultMaterial = function ()
{
	return this.materials.GetDefaultMaterial ();
};

/**
* Function: Model.GetMaterialSet
* Description: Returns the material set of the model.
* Returns:
*	{MaterialSet} the result
*/
JSM.Model.prototype.GetMaterialSet = function ()
{
	return this.materials;
};

/**
* Function: Model.Count
* Description: Returns the material count of the model.
* Returns:
*	{integer} the result
*/
JSM.Model.prototype.MaterialCount = function ()
{
	return this.materials.Count ();
};

/**
* Function: Model.VertexCount
* Description: Returns the vertex count of the model.
* Returns:
*	{integer} the result
*/
JSM.Model.prototype.VertexCount = function ()
{
	var count = 0;
	var i;
	for (i = 0; i < this.bodies.length; i++) {
		count += this.bodies[i].VertexCount ();
	}
	return count;
};

/**
* Function: Model.PolygonCount
* Description: Returns the polygon count of the model.
* Returns:
*	{integer} the result
*/
JSM.Model.prototype.PolygonCount = function ()
{
	var count = 0;
	var i;
	for (i = 0; i < this.bodies.length; i++) {
		count += this.bodies[i].PolygonCount ();
	}
	return count;
};
