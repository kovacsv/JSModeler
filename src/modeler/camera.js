/**
* Class: Camera
* Description: Represents a camera.
* Parameters:
*	eye {Coord} the eye position
*	center {Coord} the center position
*	up {Vector} the up vector
*	fieldOfView {number} field of view in degree
*	nearClippingPlane {number} near clipping plane distance
*	farClippingPlane {number} far clipping plane distance
*/
JSM.Camera = function (eye, center, up, fieldOfView, nearClippingPlane, farClippingPlane)
{
	this.eye = JSM.ValueOrDefault (eye, new JSM.Coord (1.0, 1.0, 1.0));
	this.center = JSM.ValueOrDefault (center, new JSM.Coord (0.0, 0.0, 0.0));
	this.up = JSM.ValueOrDefault (up, new JSM.Vector (0.0, 0.0, 1.0));
	this.fieldOfView = JSM.ValueOrDefault (fieldOfView, 45.0);
	this.nearClippingPlane = JSM.ValueOrDefault (nearClippingPlane, 0.1);
	this.farClippingPlane = JSM.ValueOrDefault (farClippingPlane, 1000.0);
};

/**
* Function: Camera.Set
* Description: Sets the camera.
* Parameters:
*	eye {Coord} the eye position
*	center {Coord} the center position
*	up {Vector} the up vector
*	fieldOfView {number} field of view in degree
*	nearClippingPlane {number} near clipping plane distance
*	farClippingPlane {number} far clipping plane distance
*/
JSM.Camera.prototype.Set = function (eye, center, up, fieldOfView, nearClippingPlane, farClippingPlane)
{
	this.eye = eye;
	this.center = center;
	this.up = up;
	this.fieldOfView = JSM.ValueOrDefault (fieldOfView, 45.0);
	this.nearClippingPlane = JSM.ValueOrDefault (nearClippingPlane, 0.1);
	this.farClippingPlane = JSM.ValueOrDefault (farClippingPlane, 1000.0);
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
	result.fieldOfView = this.fieldOfView;
	result.nearClippingPlane = this.nearClippingPlane;
	result.farClippingPlane = this.farClippingPlane;
	return result;
};
