/**
* Function: MatrixDeterminant2x2
* Description: Calculates the determinant of a 2x2 matrix.
* Parameters:
*	m00..m11 {4 numbers} the matrix values
* Returns:
*	{number} the result
*/
JSM.MatrixDeterminant2x2 = function (m00, m01,
									m10, m11)
{
	return m00 * m11 - m01 * m10;
};

/**
* Function: MatrixDeterminant3x3
* Description: Calculates the determinant of a 3x3 matrix.
* Parameters:
*	m00..m22 {9 numbers} the matrix values
* Returns:
*	{number} the result
*/
JSM.MatrixDeterminant3x3 = function (m00, m01, m02,
									m10, m11, m12,
									m20, m21, m22)
{
	var subDet1 = JSM.MatrixDeterminant2x2 (m11, m12, m21, m22);
	var subDet2 = JSM.MatrixDeterminant2x2 (m10, m12, m20, m22);
	var subDet3 = JSM.MatrixDeterminant2x2 (m10, m11, m20, m21);
	return m00 * subDet1 - m01 * subDet2 + m02 * subDet3;
};

/**
* Function: MatrixDeterminant4x4
* Description: Calculates the determinant of a 4x4 matrix.
* Parameters:
*	m00..m33 {16 numbers} the matrix values
* Returns:
*	{number} the result
*/
JSM.MatrixDeterminant4x4 = function (m00, m01, m02, m03,
									m10, m11, m12, m13,
									m20, m21, m22, m23,
									m30, m31, m32, m33)
{
	var subDet1 = JSM.MatrixDeterminant3x3 (m11, m12, m13, m21, m22, m23, m31, m32, m33);
	var subDet2 = JSM.MatrixDeterminant3x3 (m10, m12, m13, m20, m22, m23, m30, m32, m33);
	var subDet3 = JSM.MatrixDeterminant3x3 (m10, m11, m13, m20, m21, m23, m30, m31, m33);
	var subDet4 = JSM.MatrixDeterminant3x3 (m10, m11, m12, m20, m21, m22, m30, m31, m32);
	return subDet1 * m00 - subDet2 * m01 + subDet3 * m02 - subDet4 * m03;
};
