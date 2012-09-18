/*Matrix4<double> CalculateModelViewMatrix (const Coord& eye,
					  const Coord& center,
					  const Coord& up)
{
	Coord	d = CoordNormalize (center - eye);
	Coord	c = CoordNormalize (d ^ up);
	Coord	u = CoordNormalize (c ^ d);

	Matrix4<double> view;

	view.Fill (0.0);
	view (0, 0) = c.x;
	view (0, 1) = u.x;
	view (0, 2) = -d.x;
	view (1, 0) = c.y;
	view (1, 1) = u.y;
	view (1, 2) = -d.y;
	view (2, 0) = c.z;
	view (2, 1) = u.z;
	view (2, 2) = -d.z;
	view (3, 0) = -(c.x * eye.x + c.y * eye.y + c.z * eye.z);
	view (3, 1) = -(u.x * eye.x + u.y * eye.y + u.z * eye.z);
	view (3, 2) = (d.x * eye.x + d.y * eye.y + d.z * eye.z);
	view (3, 3) = 1.0;

	return view;
}

Matrix4<double> CalculateProjectionMatrix (double fieldOfView,
					   double aspectRatio,
					   double nearPlane,
					   double farPlane)
{
	double			e = 1.0 / tan (fieldOfView / 2);
	double			a = 1.0 / aspectRatio;
	double			n = nearPlane;
	double			f = farPlane;

	Matrix4<double>		proj;

	proj.Fill (0.0);
	proj (0, 0) = e;
	proj (1, 1) = e / a;
	proj (2, 2) = -((f + n) / (f - n));
	proj (2, 3) = -1.0;
	proj (3, 2) = -((2 * f * n) / (f - n));

	return proj;
}

bool Project (const Coord& coord,
	      const Matrix4<double>& modelView,
	      const Matrix4<double>& projection,
	      int viewPort[4],
	      Coord* result)
{
	Vector4<double>		input;
	Vector4<double>		output;

	input (0) = coord.x;
	input (1) = coord.y;
	input (2) = coord.z;
	input (3) = 1.0;

	output = input * modelView * projection;
	double denom = output (3);
	if (IsZero (denom)) {
		return false;
	}

	output (0) = output (0) / denom * 0.5 + 0.5;
	output (1) = output (1) / denom * 0.5 + 0.5;
	output (2) = output (2) / denom * 0.5 + 0.5;

	output (0) = output (0) * (double) viewPort[2] + (double) viewPort[0];
	output (1) = output (1) * (double) viewPort[3] + (double) viewPort[1];

	result->x = output (0);
	result->y = output (1);
	result->z = output (2);
	return true;
}
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

JSM.ProjectWithMatrices = function (coord, modelView, projection, viewPort)
{
	var result = new JSM.Coord ();
	
	var input = [];
	var output = [];

	input[0] = coord.x;
	input[1] = coord.y;
	input[2] = coord.z;
	input[3] = 1.0;

	output = JSM.VectorMatrixMultiply4x4 (JSM.VectorMatrixMultiply4x4 (input, modelView), projection);
	var denom = output[3];
	if (JSM.IsZero (denom)) {
		return result;
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
};

JSM.Project = function (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
{
	var modelView = JSM.CalculateModelViewMatrix (eye, center, up);
	var projection = JSM.CalculateProjectionMatrix (fieldOfView, aspectRatio, nearPlane, farPlane);
	return JSM.ProjectWithMatrices (coord, modelView, projection, viewPort);
};
