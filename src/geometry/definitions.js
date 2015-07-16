
JSM.Eps = 0.00000001;
JSM.Inf = 9999999999;
JSM.RadDeg = 57.29577951308232;
JSM.DegRad = 0.017453292519943;

/**
* Function: IsZero
* Description: Determines if the given value is near zero. Uses epsilon for comparison.
* Parameters:
*	a {number} the value
* Returns:
*	{boolean} the result
*/
JSM.IsZero = function (a)
{
	return Math.abs (a) < JSM.Eps;
};

/**
* Function: IsPositive
* Description: Determines if the given value is positive. Uses epsilon for comparison.
* Parameters:
*	a {number} the value
* Returns:
*	{boolean} the result
*/
JSM.IsPositive = function (a)
{
	return a > JSM.Eps;
};

/**
* Function: IsNegative
* Description: Determines if the given value is negative. Uses epsilon for comparison.
* Parameters:
*	a {number} the value
* Returns:
*	{boolean} the result
*/
JSM.IsNegative = function (a)
{
	return a < -JSM.Eps;
};

/**
* Function: IsLower
* Description: Determines if a value is lower than an other. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{boolean} the result
*/
JSM.IsLower = function (a, b)
{
	return b - a > JSM.Eps;
};

/**
* Function: IsGreater
* Description: Determines if a value is greater than an other. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{boolean} the result
*/
JSM.IsGreater = function (a, b)
{
	return a - b > JSM.Eps;
};

/**
* Function: IsEqual
* Description: Determines if two values are equal. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{boolean} the result
*/
JSM.IsEqual = function (a, b)
{
	return Math.abs (b - a) < JSM.Eps;
};

/**
* Function: IsEqualWithEps
* Description: Determines if two values are equal. Uses the given epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
*	eps {number} epsilon value
* Returns:
*	{boolean} the result
*/
JSM.IsEqualWithEps = function (a, b, eps)
{
	return Math.abs (b - a) < eps;
};

/**
* Function: IsLowerOrEqual
* Description: Determines if a value is lower or equal to an other. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{boolean} the result
*/
JSM.IsLowerOrEqual = function (a, b)
{
	return JSM.IsLower (a, b) || JSM.IsEqual (a, b);
};

/**
* Function: IsGreaterOrEqual
* Description: Determines if a value is greater or equal to an other. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{boolean} the result
*/
JSM.IsGreaterOrEqual = function (a, b)
{
	return JSM.IsGreater (a, b) || JSM.IsEqual (a, b);
};

/**
* Function: Minimum
* Description: Returns the minimum of two values. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{number} the result
*/
JSM.Minimum = function (a, b)
{
	return JSM.IsLower (a, b) ? a : b;
};

/**
* Function: Maximum
* Description: Returns the maximum of two values. Uses epsilon for comparison.
* Parameters:
*	a {number} first value
*	b {number} second value
* Returns:
*	{number} the result
*/
JSM.Maximum = function (a, b)
{
	return JSM.IsGreater (a, b) ? a : b;
};

/**
* Function: ArcSin
* Description: Calculates the arcus sinus value.
* Parameters:
*	value {number} the value
* Returns:
*	{number} the result
*/
JSM.ArcSin = function (value)
{
	if (JSM.IsGreaterOrEqual (value, 1.0)) {
		return Math.PI / 2.0;
	} else if (JSM.IsLowerOrEqual (value, -1.0)) {
		return - Math.PI / 2.0;
	}
	
	return Math.asin (value);
};

/**
* Function: ArcCos
* Description: Calculates the arcus cosinus value.
* Parameters:
*	value {number} the value
* Returns:
*	{number} the result
*/
JSM.ArcCos = function (value)
{
	if (JSM.IsGreaterOrEqual (value, 1.0)) {
		return 0.0;
	} else if (JSM.IsLowerOrEqual (value, -1.0)) {
		return Math.PI;
	}
	
	return Math.acos (value);
};

/**
* Enum: Orientation
* Description: Orientation of coordinates.
* Values:
*	{Invalid} invalid orientation or collinear
*	{CounterClockwise} counter clockwise orientation
*	{Clockwise} clockwise orientation
*/
JSM.Orientation = {
	Invalid : 0,
	CounterClockwise : 1,
	Clockwise : 2
};

/**
* Enum: Complexity
* Description: Complexity of polygon.
* Values:
*	{Invalid} invalid polygon
*	{Convex} convex polygon
*	{Concave} concave polygon
*/
JSM.Complexity = {
	Invalid : 0,
	Convex : 1,
	Concave : 2
};
