/**
* Function: MatrixIdentity
* Description: Generates an identity matrix.
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixIdentity = function ()
{
	var result = [];
	result[0] = 1.0;
	result[1] = 0.0;
	result[2] = 0.0;
	result[3] = 0.0;
	result[4] = 0.0;
	result[5] = 1.0;
	result[6] = 0.0;
	result[7] = 0.0;
	result[8] = 0.0;
	result[9] = 0.0;
	result[10] = 1.0;
	result[11] = 0.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = 0.0;
	result[15] = 1.0;
	return result;
};

/**
* Function: MatrixClone
* Description: Clones a matrix.
* Parameters:
*	matrix {number[16]} the source matrix
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixClone = function (matrix)
{
	var result = [];
	result[0] = matrix[0];
	result[1] = matrix[1];
	result[2] = matrix[2];
	result[3] = matrix[3];
	result[4] = matrix[4];
	result[5] = matrix[5];
	result[6] = matrix[6];
	result[7] = matrix[7];
	result[8] = matrix[8];
	result[9] = matrix[9];
	result[10] = matrix[10];
	result[11] = matrix[11];
	result[12] = matrix[12];
	result[13] = matrix[13];
	result[14] = matrix[14];
	result[15] = matrix[15];
	return result;
};

/**
* Function: MatrixTranspose
* Description: Transposes a matrix.
* Parameters:
*	matrix {number[16]} the source matrix
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixTranspose = function (matrix)
{
	var result = [];
	result[0] = matrix[0];
	result[1] = matrix[4];
	result[2] = matrix[8];
	result[3] = matrix[12];
	result[4] = matrix[1];
	result[5] = matrix[5];
	result[6] = matrix[9];
	result[7] = matrix[13];
	result[8] = matrix[2];
	result[9] = matrix[6];
	result[10] = matrix[10];
	result[11] = matrix[14];
	result[12] = matrix[3];
	result[13] = matrix[7];
	result[14] = matrix[11];
	result[15] = matrix[15];
	return result;
};

/**
* Function: MatrixVectorMultiply
* Description: Multiplies a matrix with a vector.
* Parameters:
*	matrix {number[16]} the matrix
*	vector {number[4]} the vector
* Returns:
*	{number[4]} the result vector
*/
JSM.MatrixVectorMultiply = function (matrix, vector)
{
	var a00 = vector[0];
	var a01 = vector[1];
	var a02 = vector[2];
	var a03 = vector[3];
	var b00 = matrix[0];
	var b01 = matrix[1];
	var b02 = matrix[2];
	var b03 = matrix[3];
	var b10 = matrix[4];
	var b11 = matrix[5];
	var b12 = matrix[6];
	var b13 = matrix[7];
	var b20 = matrix[8];
	var b21 = matrix[9];
	var b22 = matrix[10];
	var b23 = matrix[11];
	var b30 = matrix[12];
	var b31 = matrix[13];
	var b32 = matrix[14];
	var b33 = matrix[15];

	var result = [];
	result[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
	result[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
	result[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
	result[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
	return result;
};

/**
* Function: MatrixMultiply
* Description: Multiplies a two matrices.
* Parameters:
*	matrix1 {number[16]} first matrix
*	matrix2 {number[16]} second matrix
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixMultiply = function (matrix1, matrix2)
{
	var a00 = matrix1[0];
	var a01 = matrix1[1];
	var a02 = matrix1[2];
	var a03 = matrix1[3];
	var a10 = matrix1[4];
	var a11 = matrix1[5];
	var a12 = matrix1[6];
	var a13 = matrix1[7];
	var a20 = matrix1[8];
	var a21 = matrix1[9];
	var a22 = matrix1[10];
	var a23 = matrix1[11];
	var a30 = matrix1[12];
	var a31 = matrix1[13];
	var a32 = matrix1[14];
	var a33 = matrix1[15];
	
	var b00 = matrix2[0];
	var b01 = matrix2[1];
	var b02 = matrix2[2];
	var b03 = matrix2[3];
	var b10 = matrix2[4];
	var b11 = matrix2[5];
	var b12 = matrix2[6];
	var b13 = matrix2[7];
	var b20 = matrix2[8];
	var b21 = matrix2[9];
	var b22 = matrix2[10];
	var b23 = matrix2[11];
	var b30 = matrix2[12];
	var b31 = matrix2[13];
	var b32 = matrix2[14];
	var b33 = matrix2[15];
		
	var result = [];
	result[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
	result[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
	result[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
	result[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
	result[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
	result[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
	result[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
	result[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
	result[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
	result[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
	result[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
	result[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
	result[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
	result[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
	result[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
	result[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
	return result;
};

/**
* Function: MatrixDeterminant
* Description: Calculates the determinant of a matrix.
* Parameters:
*	matrix {number[16]} the source matrix
* Returns:
*	{number} the determinant
*/
JSM.MatrixDeterminant = function (matrix)
{
	var a00 = matrix[0];
	var a01 = matrix[1];
	var a02 = matrix[2];
	var a03 = matrix[3];
	var a10 = matrix[4];
	var a11 = matrix[5];
	var a12 = matrix[6];
	var a13 = matrix[7];
	var a20 = matrix[8];
	var a21 = matrix[9];
	var a22 = matrix[10];
	var a23 = matrix[11];
	var a30 = matrix[12];
	var a31 = matrix[13];
	var a32 = matrix[14];
	var a33 = matrix[15];

	var b00 = a00 * a11 - a01 * a10;
	var b01 = a00 * a12 - a02 * a10;
	var b02 = a00 * a13 - a03 * a10;
	var b03 = a01 * a12 - a02 * a11;
	var b04 = a01 * a13 - a03 * a11;
	var b05 = a02 * a13 - a03 * a12;
	var b06 = a20 * a31 - a21 * a30;
	var b07 = a20 * a32 - a22 * a30;
	var b08 = a20 * a33 - a23 * a30;
	var b09 = a21 * a32 - a22 * a31;
	var b10 = a21 * a33 - a23 * a31;
	var b11 = a22 * a33 - a23 * a32;
	
	var determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	return determinant;
};

/**
* Function: MatrixInvert
* Description: Inverts a matrix.
* Parameters:
*	matrix {number[16]} the source matrix
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixInvert = function (matrix)
{
	var a00 = matrix[0];
	var a01 = matrix[1];
	var a02 = matrix[2];
	var a03 = matrix[3];
	var a10 = matrix[4];
	var a11 = matrix[5];
	var a12 = matrix[6];
	var a13 = matrix[7];
	var a20 = matrix[8];
	var a21 = matrix[9];
	var a22 = matrix[10];
	var a23 = matrix[11];
	var a30 = matrix[12];
	var a31 = matrix[13];
	var a32 = matrix[14];
	var a33 = matrix[15];

	var b00 = a00 * a11 - a01 * a10;
	var b01 = a00 * a12 - a02 * a10;
	var b02 = a00 * a13 - a03 * a10;
	var b03 = a01 * a12 - a02 * a11;
	var b04 = a01 * a13 - a03 * a11;
	var b05 = a02 * a13 - a03 * a12;
	var b06 = a20 * a31 - a21 * a30;
	var b07 = a20 * a32 - a22 * a30;
	var b08 = a20 * a33 - a23 * a30;
	var b09 = a21 * a32 - a22 * a31;
	var b10 = a21 * a33 - a23 * a31;
	var b11 = a22 * a33 - a23 * a32;
	
	var determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	if (JSM.IsZero (determinant)) {
		return null;
	}

	var result = [];
	
	result[0] = (a11 * b11 - a12 * b10 + a13 * b09) / determinant;
	result[1] = (a02 * b10 - a01 * b11 - a03 * b09) / determinant;
	result[2] = (a31 * b05 - a32 * b04 + a33 * b03) / determinant;
	result[3] = (a22 * b04 - a21 * b05 - a23 * b03) / determinant;
	result[4] = (a12 * b08 - a10 * b11 - a13 * b07) / determinant;
	result[5] = (a00 * b11 - a02 * b08 + a03 * b07) / determinant;
	result[6] = (a32 * b02 - a30 * b05 - a33 * b01) / determinant;
	result[7] = (a20 * b05 - a22 * b02 + a23 * b01) / determinant;
	result[8] = (a10 * b10 - a11 * b08 + a13 * b06) / determinant;
	result[9] = (a01 * b08 - a00 * b10 - a03 * b06) / determinant;
	result[10] = (a30 * b04 - a31 * b02 + a33 * b00) / determinant;
	result[11] = (a21 * b02 - a20 * b04 - a23 * b00) / determinant;
	result[12] = (a11 * b07 - a10 * b09 - a12 * b06) / determinant;
	result[13] = (a00 * b09 - a01 * b07 + a02 * b06) / determinant;
	result[14] = (a31 * b01 - a30 * b03 - a32 * b00) / determinant;
	result[15] = (a20 * b03 - a21 * b01 + a22 * b00) / determinant;

	return result;
};

/**
* Function: MatrixTranslation
* Description: Creates a translation matrix.
* Parameters:
*	x {number} x offset of the transformation
*	y {number} y offset of the transformation
*	z {number} z offset of the transformation
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixTranslation = function (x, y, z)
{
	var result = [];
	result[0] = 1.0;
	result[1] = 0.0;
	result[2] = 0.0;
	result[3] = 0.0;
	result[4] = 0.0;
	result[5] = 1.0;
	result[6] = 0.0;
	result[7] = 0.0;
	result[8] = 0.0;
	result[9] = 0.0;
	result[10] = 1.0;
	result[11] = 0.0;
	result[12] = x;
	result[13] = y;
	result[14] = z;
	result[15] = 1.0;
	return result;
};

/**
* Function: MatrixRotation
* Description: Creates a rotation matrix around the given axis.
* Parameters:
*	axis {Vector} the axis of the rotation
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixRotation = function (axis, angle, origo)
{
	var normal = axis.Clone ().Normalize ();

	var u = normal.x;
	var v = normal.y;
	var w = normal.z;

	var u2 = u * u;
	var v2 = v * v;
	var w2 = w * w;

	var si = Math.sin (angle);
	var co = Math.cos (angle);
	
	var result = [];
	if (origo === undefined || origo === null) {
		result[0] = u2 + (v2 + w2) * co;
		result[1] = u * v * (1.0 - co) + w * si;
		result[2] = u * w * (1.0 - co) - v * si;
		result[3] = 0.0;
		result[4] = u * v * (1.0 - co) - w * si;
		result[5] = v2 + (u2 + w2) * co;
		result[6] = v * w * (1.0 - co) + u * si;
		result[7] = 0.0;
		result[8] = u * w * (1.0 - co) + v * si;
		result[9] = v * w * (1.0 - co) - u * si;
		result[10] = w2 + (u2 + v2) * co;
		result[11] = 0.0;
		result[12] = 0.0;
		result[13] = 0.0;
		result[14] = 0.0;
		result[15] = 1.0;
	} else {
		var a = origo.x;
		var b = origo.y;
		var c = origo.z;
	
		result[0] = u2 + (v2 + w2) * co;
		result[1] = u * v * (1.0 - co) + w * si;
		result[2] = u * w * (1.0 - co) - v * si;
		result[3] = 0.0;
		result[4] = u * v * (1.0 - co) - w * si;
		result[5] = v2 + (u2 + w2) * co;
		result[6] = v * w * (1.0 - co) + u * si;
		result[7] = 0.0;
		result[8] = u * w * (1.0 - co) + v * si;
		result[9] = v * w * (1.0 - co) - u * si;
		result[10] = w2 + (u2 + v2) * co;
		result[11] = 0.0;
		result[12] = (a * (v2 + w2) - u * (b * v + c * w)) * (1.0 - co) + (b * w - c * v) * si;
		result[13] = (b * (u2 + w2) - v * (a * u + c * w)) * (1.0 - co) + (c * u - a * w) * si;
		result[14] = (c * (u2 + v2) - w * (a * u + b * v)) * (1.0 - co) + (a * v - b * u) * si;
		result[15] = 1.0;
	}

	return result;
};

/**
* Function: MatrixRotationQuaternion
* Description: Creates a rotation matrix from a given quaternion.
* Parameters:
*	quaternion {number[4]} the quaternion
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixRotationQuaternion = function (quaternion)
{
	var x = quaternion[0];
	var y = quaternion[1];
	var z = quaternion[2];
	var w = quaternion[3];

	var x2 = x + x;
	var y2 = y + y;
	var z2 = z + z;

	var xx = x * x2;
	var xy = x * y2;
	var xz = x * z2;
	var yy = y * y2;
	var yz = y * z2;
	var zz = z * z2;
	var wx = w * x2;
	var wy = w * y2;
	var wz = w * z2;

	var result = [];
	result[0] = 1.0 - (yy + zz);
	result[1] = xy + wz;
	result[2] = xz - wy;
	result[3] = 0.0;
	result[4] = xy - wz;
	result[5] = 1.0 - (xx + zz);
	result[6] = yz + wx;
	result[7] = 0.0;
	result[8] = xz + wy;
	result[9] = yz - wx;
	result[10] = 1.0 - (xx + yy);
	result[11] = 0.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = 0.0;
	result[15] = 1;
	return result;
};

/**
* Function: MatrixRotationX
* Description: Creates a rotation matrix around the x axis.
* Parameters:
*	angle {number} the angle of rotation
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixRotationX = function (angle)
{
	var si = Math.sin (angle);
	var co = Math.cos (angle);

	var result = [];
	result[0] = 1.0;
	result[1] = 0.0;
	result[2] = 0.0;
	result[3] = 0.0;
	result[4] = 0.0;
	result[5] = co;
	result[6] = si;
	result[7] = 0.0;
	result[8] = 0.0;
	result[9] = -si;
	result[10] = co;
	result[11] = 0.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = 0.0;
	result[15] = 1.0;
	return result;
};

/**
* Function: MatrixRotationY
* Description: Creates a rotation matrix around the y axis.
* Parameters:
*	angle {number} the angle of rotation
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixRotationY = function (angle)
{
	var si = Math.sin (angle);
	var co = Math.cos (angle);

	var result = [];
	result[0] = co;
	result[1] = 0.0;
	result[2] = -si;
	result[3] = 0.0;
	result[4] = 0.0;
	result[5] = 1.0;
	result[6] = 0.0;
	result[7] = 0.0;
	result[8] = si;
	result[9] = 0.0;
	result[10] = co;
	result[11] = 0.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = 0.0;
	result[15] = 1.0;
	return result;
};

/**
* Function: MatrixRotationZ
* Description: Creates a rotation matrix around the z axis.
* Parameters:
*	angle {number} the angle of rotation
* Returns:
*	{number[16]} the result matrix
*/
JSM.MatrixRotationZ = function (angle)
{
	var si = Math.sin (angle);
	var co = Math.cos (angle);

	var result = [];
	result[0] = co;
	result[1] = si;
	result[2] = 0.0;
	result[3] = 0.0;
	result[4] = -si;
	result[5] = co;
	result[6] = 0.0;
	result[7] = 0.0;
	result[8] = 0.0;
	result[9] = 0.0;
	result[10] = 1.0;
	result[11] = 0.0;
	result[12] = 0.0;
	result[13] = 0.0;
	result[14] = 0.0;
	result[15] = 1.0;
	return result;
};

/**
* Function: ApplyTransformation
* Description: Applies a matrix transformation to a coordinate.
* Parameters:
*	matrix {number[16]} the matrix
*	coord {Coord} the coordinate
* Returns:
*	{Coord} the result
*/
JSM.ApplyTransformation = function (matrix, coord)
{
	var vector = [];
	vector[0] = coord.x;
	vector[1] = coord.y;
	vector[2] = coord.z;
	vector[3] = 1.0;
	
	var resultVector = JSM.MatrixVectorMultiply (matrix, vector);
	var result = new JSM.Coord (resultVector[0], resultVector[1], resultVector[2]);
	return result;
};

/**
* Function: ApplyRotation
* Description: Applies the rotation part of a matrix transformation to a coordinate.
* Parameters:
*	matrix {number[16]} the matrix
*	coord {Coord} the coordinate
* Returns:
*	{Coord} the result
*/
JSM.ApplyRotation = function (matrix, coord)
{
	var vector = [];
	vector[0] = coord.x;
	vector[1] = coord.y;
	vector[2] = coord.z;
	vector[3] = 0.0;
	
	var resultVector = JSM.MatrixVectorMultiply (matrix, vector);
	var result = new JSM.Coord (resultVector[0], resultVector[1], resultVector[2]);
	return result;
};
