/**
* Function: MatrixView
* Description: Creates a view matrix.
* Parameters:
*	eye {Coord} eye position
*	center {Coord} center position
*	up {Vector} up vector
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixView = function (eye, center, up)
{
	if (eye.IsEqual (center)) {
		return JSM.MatrixIdentity ();
	}
	
	var result = [];

	var d = JSM.CoordSub (eye, center).Normalize ();
	var v = JSM.VectorCross (up, d).Normalize ();
	var u = JSM.VectorCross (d, v).Normalize ();

	result[0] = v.x;
	result[1] = u.x;
	result[2] = d.x;
	result[3] = 0.0;
	result[4] = v.y;
	result[5] = u.y;
	result[6] = d.y;
	result[7] = 0.0;
	result[8] = v.z;
	result[9] = u.z;
	result[10] = d.z;
	result[11] = 0.0;
	result[12] = -JSM.VectorDot (v, eye);
	result[13] = -JSM.VectorDot (u, eye);
	result[14] = -JSM.VectorDot (d, eye);
	result[15] = 1.0;
	
	return result;
};

/**
* Function: MatrixPerspective
* Description: Creates a perspective matrix.
* Parameters:
*	fieldOfView {number} field of view
*	aspectRatio {number} aspect ratio
*	nearPlane {number} near clipping plane
*	farPlane {number} far clipping plane
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixPerspective = function (fieldOfView, aspectRatio, nearPlane, farPlane)
{
	var result = [];
	
	var f = 1.0 / Math.tan (fieldOfView / 2.0);
	var nf = 1.0 / (nearPlane - farPlane);
	
	result[0] = f / aspectRatio;
	result[1] = 0.0;
	result[2] = 0.0;
	result[3] = 0.0;
	result[4] = 0.0;
	result[5] = f;
	result[6] = 0.0;
	result[7] = 0.0;
	result[8] = 0.0;
	result[9] = 0.0;
	result[10] = (farPlane + nearPlane) * nf;
	result[11] = -1.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = (2.0 * farPlane * nearPlane) * nf;
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
	function ProjectWithMatrices (coord, viewMatrix, perspectiveMatrix, viewPort)
	{
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		
		var input = [];
		var output = [];

		input[0] = coord.x;
		input[1] = coord.y;
		input[2] = coord.z;
		input[3] = 1.0;

		var projectionMatrix = JSM.MatrixMultiply (viewMatrix, perspectiveMatrix);
		output = JSM.MatrixVectorMultiply (projectionMatrix, input);
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
	
	var viewMatrix = JSM.MatrixView (eye, center, up);
	var perspectiveMatrix = JSM.MatrixPerspective (fieldOfView, aspectRatio, nearPlane, farPlane);
	return ProjectWithMatrices (coord, viewMatrix, perspectiveMatrix, viewPort);
};
