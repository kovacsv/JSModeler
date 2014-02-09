/**
* Class: Transformation
* Description: Represents a transformation matrix.
*/
JSM.Transformation = function ()
{
	this.matrix = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0
	];
};

/**
* Function: Transformation.Append
* Description: Adds a transformation to the matrix.
* Parameters:
*	source {Transformation} the another transformation
*/
JSM.Transformation.prototype.Append = function (source)
{
	this.matrix = [
		source.matrix[0] * this.matrix[0] + source.matrix[1] * this.matrix[4] + source.matrix[2] * this.matrix[8],
		source.matrix[0] * this.matrix[1] + source.matrix[1] * this.matrix[5] + source.matrix[2] * this.matrix[9],
		source.matrix[0] * this.matrix[2] + source.matrix[1] * this.matrix[6] + source.matrix[2] * this.matrix[10],
		source.matrix[0] * this.matrix[3] + source.matrix[1] * this.matrix[7] + source.matrix[2] * this.matrix[11] + source.matrix[3],
		source.matrix[4] * this.matrix[0] + source.matrix[5] * this.matrix[4] + source.matrix[6] * this.matrix[8],
		source.matrix[4] * this.matrix[1] + source.matrix[5] * this.matrix[5] + source.matrix[6] * this.matrix[9],
		source.matrix[4] * this.matrix[2] + source.matrix[5] * this.matrix[6] + source.matrix[6] * this.matrix[10],
		source.matrix[4] * this.matrix[3] + source.matrix[5] * this.matrix[7] + source.matrix[6] * this.matrix[11] + source.matrix[7],
		source.matrix[8] * this.matrix[0] + source.matrix[9] * this.matrix[4] + source.matrix[10] * this.matrix[8],
		source.matrix[8] * this.matrix[1] + source.matrix[9] * this.matrix[5] + source.matrix[10] * this.matrix[9],
		source.matrix[8] * this.matrix[2] + source.matrix[9] * this.matrix[6] + source.matrix[10] * this.matrix[10],
		source.matrix[8] * this.matrix[3] + source.matrix[9] * this.matrix[7] + source.matrix[10] * this.matrix[11] + source.matrix[11]
	];
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
	var result = new JSM.Coord ();
	result.x = this.matrix[0] * coord.x + this.matrix[1] * coord.y + this.matrix[2] * coord.z + this.matrix[3];
	result.y = this.matrix[4] * coord.x + this.matrix[5] * coord.y + this.matrix[6] * coord.z + this.matrix[7];
	result.z = this.matrix[8] * coord.x + this.matrix[9] * coord.y + this.matrix[10] * coord.z + this.matrix[11];
	return result;
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
	result.matrix = [
		this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3],
		this.matrix[4], this.matrix[5], this.matrix[6], this.matrix[7],
		this.matrix[8], this.matrix[9], this.matrix[10], this.matrix[11]
	];
	return result;
};
