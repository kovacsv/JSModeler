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
* Description: Projects a 3D coordinate to 2D.
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
	var input = [
		coord.x,
		coord.y,
		coord.z,
		1.0
	];

	var viewMatrix = JSM.MatrixView (eye, center, up);
	var perspectiveMatrix = JSM.MatrixPerspective (fieldOfView, aspectRatio, nearPlane, farPlane);
	var projectionMatrix = JSM.MatrixMultiply (viewMatrix, perspectiveMatrix);
	var output = JSM.MatrixVectorMultiply (projectionMatrix, input);
	var denom = output[3];
	if (JSM.IsZero (denom)) {
		return null;
	}

	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = (output[0] / denom * 0.5 + 0.5) * viewPort[2] + viewPort[0];
	result.y = (output[1] / denom * 0.5 + 0.5) * viewPort[3] + viewPort[1];
	result.z = (output[2] / denom * 0.5 + 0.5);
	return result;	
};

/**
* Function: Unproject
* Description: Projects a 2D coordinate to 3D.
* Parameters:
*	coord {Coord} the coordinate (the z component can be zero)
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
JSM.Unproject = function (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
{
	var input = [
		(coord.x - viewPort[0]) / viewPort[2] * 2.0 - 1.0,
		(coord.y - viewPort[1]) / viewPort[3] * 2.0 - 1.0,
		2.0 * coord.z - 1,
		1.0
	];
	
	var viewMatrix = JSM.MatrixView (eye, center, up);
	var perspectiveMatrix = JSM.MatrixPerspective (fieldOfView, aspectRatio, nearPlane, farPlane);
	var projectionMatrix = JSM.MatrixMultiply (viewMatrix, perspectiveMatrix);
	var inverseMatrix = JSM.MatrixInvert (projectionMatrix);
	var output = JSM.MatrixVectorMultiply (inverseMatrix, input);
	var denom = output[3];
	if (JSM.IsZero (denom)) {
		return null;
	}

	var result = new JSM.Coord (0.0, 0.0, 0.0);
	result.x = (output[0] / output[3]);
	result.y = (output[1] / output[3]);
	result.z = (output[2] / output[3]);
	return result;
};
