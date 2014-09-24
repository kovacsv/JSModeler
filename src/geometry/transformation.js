/**
* Class: Transformation
* Description: Represents a transformation matrix.
*/
JSM.Transformation = function ()
{
	this.matrix = JSM.MatrixIdentity ();
};

/**
* Function: Transformation.GetMatrix
* Description: Returns the matrix of the transformation.
* Returns:
*	{number[16]} the matrix
*/
JSM.Transformation.prototype.GetMatrix = function ()
{
	return this.matrix;
};

/**
* Function: Transformation.SetMatrix
* Description: Sets matrix of the transformation.
* Parameters:
*	matrix {number[16]} the matrix
*/
JSM.Transformation.prototype.SetMatrix = function (matrix)
{
	this.matrix = matrix;
};

/**
* Function: Transformation.Append
* Description: Adds a transformation to the matrix.
* Parameters:
*	source {Transformation} the another transformation
*/
JSM.Transformation.prototype.Append = function (source)
{
	this.matrix = JSM.MatrixMultiply (this.matrix, source.matrix);
};

/**
* Function: Transformation.Apply
* Description: Apply transformation to a coordinate.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{Coord} the result
*/
JSM.Transformation.prototype.Apply = function (coord)
{
	return JSM.ApplyTransformation (this.matrix, coord);
};

/**
* Function: Transformation.Clone
* Description: Clones the transformation.
* Returns:
*	{Transformation} a cloned instance
*/
JSM.Transformation.prototype.Clone = function ()
{
	var result = new JSM.Transformation ();
	result.matrix = JSM.MatrixClone (this.matrix);
	return result;
};
