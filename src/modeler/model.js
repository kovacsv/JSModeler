/**
* Class: Model
* Description: Represents a 3D model. The model contains bodies.
*/
JSM.Model = function ()
{
	this.bodies = [];
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
