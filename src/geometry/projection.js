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
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		
		var input = [];
		var output = [];

		input[0] = coord.x;
		input[1] = coord.y;
		input[2] = coord.z;
		input[3] = 1.0;

		output = JSM.MatrixVectorMultiply (projection, JSM.MatrixVectorMultiply (modelView, input));
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
	
	var modelView = JSM.MatrixView (eye, center, up);
	var projection = JSM.MatrixPerspective (fieldOfView, aspectRatio, nearPlane, farPlane);
	return ProjectWithMatrices (coord, modelView, projection, viewPort);
};
