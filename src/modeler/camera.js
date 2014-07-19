/**
* Class: Camera
* Description: Represents a camera.
* Parameters:
*	eye {Coord} the eye position
*	center {Coord} the center position
*	up {Vector} the up vector
*/
JSM.Camera = function (eye, center, up)
{
	this.eye = eye;
	this.center = center;
	this.up = up;
};

/**
* Function: Camera.Set
* Description: Sets the camera.
* Parameters:
*	eye {Coord} the eye position
*	center {Coord} the center position
*	up {Vector} the up vector
*/
JSM.Camera.prototype.Set = function (eye, center, up)
{
	this.eye = eye;
	this.center = center;
	this.up = up;
};

/**
* Function: Camera.Clone
* Description: Clones the camera.
* Returns:
*	{Camera} a cloned instance
*/
JSM.Camera.prototype.Clone = function ()
{
	var result = new JSM.Camera ();
	result.eye = this.eye;
	result.center = this.center;
	result.up = this.up;
	return result;
};
