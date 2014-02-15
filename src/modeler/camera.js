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
	this.eye = new JSM.Coord (eye[0], eye[1], eye[2]);
	this.center = new JSM.Coord (center[0], center[1], center[2]);
	this.up = new JSM.Vector (up[0], up[1], up[2]);
	this.fixUp = true;
	this.orbit = true;
	this.zoom = true;
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
	this.eye = new JSM.Coord (eye[0], eye[1], eye[2]);
	this.center = new JSM.Coord (center[0], center[1], center[2]);
	this.up = new JSM.Coord (up[0], up[1], up[2]);
};

/**
* Function: Camera.SetFixUp
* Description: Sets if the camera has fix up when orbiting.
* Parameters:
*	fixUp {boolean} the value
*/
JSM.Camera.prototype.SetFixUp = function (fixUp)
{
	this.fixUp = fixUp;
};

/**
* Function: Camera.SetOrbitEnabled
* Description: Sets if the orbit is enabled.
* Parameters:
*	orbit {boolean} the value
*/
JSM.Camera.prototype.SetOrbitEnabled = function (orbit)
{
	this.orbit = orbit;
};

/**
* Function: Camera.SetZoomEnabled
* Description: Sets if the zoom is enabled.
* Parameters:
*	zoom {boolean} the value
*/
JSM.Camera.prototype.SetZoomEnabled = function (zoom)
{
	this.zoom = zoom;
};

/**
* Function: Camera.Zoom
* Description: Moves the camera along the eye-center direction with 10% of the distance.
* Parameters:
*	zoomIn {boolean} zoom in or out
*/
JSM.Camera.prototype.Zoom = function (zoomIn)
{
	if (!this.zoom) {
		return;
	}

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
*	angleX {number} x angle of orbit
*	angleY {number} y angle of orbit
*/
JSM.Camera.prototype.Orbit = function (angleX, angleY)
{
	if (!this.orbit) {
		return;
	}

	var radAngleX = angleX * JSM.DegRad;
	var radAngleY = angleY * JSM.DegRad;
	
	var viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
	var horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, this.up));

	if (this.fixUp) {
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
	result.orbit = this.orbit;
	result.zoom = this.zoom;
	return result;
};
