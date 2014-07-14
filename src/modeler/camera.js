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
* Function: Camera.Zoom
* Description: Moves the camera along the eye-center direction with 10% of the distance.
* Parameters:
*	zoomIn {boolean} zoom in or out
*/
JSM.Camera.prototype.Zoom = function (zoomIn)
{
	var direction = JSM.CoordSub (this.center, this.eye);
	var distance = JSM.VectorLength (direction);
	if (zoomIn && distance < 0.1) {
		return 0;
	}

	var move = distance * 0.1;
	if (!zoomIn) {
		move = move * -1.0;
	}

	this.eye = JSM.CoordOffset (this.eye, direction, move);
};

/**
* Function: Camera.Orbit
* Description: Orbits the camera with given angles.
* Parameters:
*	fixUp {boolean} do orbit with fixed up vector
*	angleX {number} x angle of orbit
*	angleY {number} y angle of orbit
*/
JSM.Camera.prototype.Orbit = function (fixUp, angleX, angleY)
{
	var radAngleX = angleX * JSM.DegRad;
	var radAngleY = angleY * JSM.DegRad;
	
	var viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
	var horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, this.up));

	if (fixUp) {
		var originalAngle = JSM.GetVectorsAngle (viewDirection, this.up);
		var angleLimit = 5.0 * JSM.DegRad;
		var skipVertical = (radAngleY < 0 && originalAngle > Math.PI - angleLimit) || (radAngleY > 0 && originalAngle < angleLimit);
		if (!skipVertical) {
			this.eye = JSM.CoordRotate (this.eye, horizontalDirection, radAngleY, this.center);
		}
		this.eye = JSM.CoordRotate (this.eye, this.up, radAngleX, this.center);
	} else {
		var verticalDirection = JSM.VectorNormalize (JSM.VectorCross (horizontalDirection, viewDirection));
		this.eye = JSM.CoordRotate (this.eye, horizontalDirection, radAngleY, this.center);
		this.eye = JSM.CoordRotate (this.eye, verticalDirection, radAngleX, this.center);
		this.up = verticalDirection;
	}
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
