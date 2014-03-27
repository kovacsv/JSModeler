/**
* Function: CalculateModelViewMatrix
* Description: Calculates a model view matrix.
* Parameters:
*	eye {Coord} the eye of the camera
*	center {Coord} the center of the camera
*	up {Vector} the up vector of the camera
* Returns:
*	{number[16]} the result matrix
*/
JSM.CalculateModelViewMatrix = function (eye, center, up)
{
	var d = JSM.VectorNormalize (JSM.CoordSub (center, eye));
	var c = JSM.VectorNormalize (JSM.VectorCross (d, up));
	var u = JSM.VectorNormalize (JSM.VectorCross (c, d));

	var result = [];

	result[0] = c.x;
	result[1] = u.x;
	result[2] = -d.x;
	result[3] = 0.0;

	result[4] = c.y;
	result[5] = u.y;
	result[6] = -d.y;
	result[7] = 0.0;
	
	result[8] = c.z;
	result[9] = u.z;
	result[10] = -d.z;
	result[11] = 0.0;

	result[12] = -(c.x * eye.x + c.y * eye.y + c.z * eye.z);
	result[13] = -(u.x * eye.x + u.y * eye.y + u.z * eye.z);
	result[14] = (d.x * eye.x + d.y * eye.y + d.z * eye.z);
	result[15] = 1.0;

	return result;
};

/**
* Function: CalculateProjectionMatrix
* Description: Calculates a projection matrix.
* Parameters:
*	fieldOfView {number} camera field of view
*	aspectRatio {number} aspect ratio of the desired image
*	nearPlane {number} near cutting plane distance
*	farPlane {number} far cutting plane distance
* Returns:
*	{number[16]} the result matrix
*/
JSM.CalculateProjectionMatrix = function (fieldOfView, aspectRatio, nearPlane, farPlane)
{
	var e = 1.0 / Math.tan (fieldOfView / 2.0);
	var a = 1.0 / aspectRatio;
	var n = nearPlane;
	var f = farPlane;

	var result = [];

	result[0] = e;
	result[1] = 0.0;
	result[2] = 0.0;
	result[3] = 0.0;
	result[4] = 0.0;
	result[5] = e / a;
	result[6] = 0.0;
	result[7] = 0.0;
	result[8] = 0.0;
	result[9] = 0.0;
	result[10] = -((f + n) / (f - n));
	result[11] = -1.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = -((2 * f * n) / (f - n));
	result[15] = 0.0;

	return result;
};

/**
* Function: Project
* Description: Projects a 3D coordinate to a 2D image.
* Parameters:
*	coord {Coord} the coordinate
*	eye {Coord} the eye of the camera
*	center {Coord} the center of the camera
*	up {Vector} the up vector of the camera
*	fieldOfView {number} camera field of view
*	aspectRatio {number} aspect ratio of the desired image
*	nearPlane {number} near cutting plane distance
*	farPlane {number} far cutting plane distance
*	viewPort {number[4]} view port coordinates in pixels
* Returns:
*	{Coord} the result
*/
JSM.Project = function (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
{
	function ProjectWithMatrices (coord, modelView, projection, viewPort)
	{
		var result = new JSM.Coord ();
		
		var input = [];
		var output = [];

		input[0] = coord.x;
		input[1] = coord.y;
		input[2] = coord.z;
		input[3] = 1.0;

		output = JSM.VectorMatrixMultiply (JSM.VectorMatrixMultiply (input, modelView), projection);
		var denom = output[3];
		if (JSM.IsZero (denom)) {
			return null;
		}

		output[0] = output[0] / denom * 0.5 + 0.5;
		output[1] = output[1] / denom * 0.5 + 0.5;
		output[2] = output[2] / denom * 0.5 + 0.5;

		output[0] = output[0] * viewPort[2] + viewPort[0];
		output[1] = output[1] * viewPort[3] + viewPort[1];

		result.x = output[0];
		result.y = output[1];
		result.z = output[2];
		return result;
	}
	
	var modelView = JSM.CalculateModelViewMatrix (eye, center, up);
	var projection = JSM.CalculateProjectionMatrix (fieldOfView, aspectRatio, nearPlane, farPlane);
	return ProjectWithMatrices (coord, modelView, projection, viewPort);
};
