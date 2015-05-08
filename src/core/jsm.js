var JSM = function () {
	this.mainVersion = 0;
	this.subVersion = 36;
};

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
* Function: RandomNumber
* Description: Generates a random number between two numbers.
* Parameters:
*	from {number} lowest random result
*	to {number} highest random result
* Returns:
*	{number} the result
*/
JSM.RandomNumber = function (from, to)
{
	return Math.random () * (to - from) + from;
};

/**
* Function: RandomInt
* Description: Generates a random integer between two integers.
* Parameters:
*	from {integer} lowest random result
*	to {integer} highest random result
* Returns:
*	{integer} the result
*/
JSM.RandomInt = function (from, to)
{
	return Math.floor ((Math.random () * (to - from + 1)) + from);
};

/**
* Function: SeededRandomInt
* Description: Generates a random integer between two integers. A seed number can be specified.
* Parameters:
*	from {integer} lowest random result
*	to {integer} highest random result
*	seed {integer} seed value
* Returns:
*	{integer} the result
*/
JSM.SeededRandomInt = function (from, to, seed)
{
    var random = ((seed * 9301 + 49297) % 233280) / 233280;
	return Math.floor ((random * (to - from + 1)) + from);
};

/**
* Function: ValueOrDefault
* Description: Returns the given value, or a default if it is undefined.
* Parameters:
*	val {anything} new value
*	def {anything} default value
* Returns:
*	{anything} the result
*/
JSM.ValueOrDefault = function (val, def)
{
	if (val === undefined || val === null) {
		return def;
	}
	return val;
};

/**
* Function: CopyObjectProperties
* Description: Copies one object properties to another object.
* Parameters:
*	source {anything} source object
*	target {anything} target object
*	overwrite {boolean} overwrite existing properties
*/
JSM.CopyObjectProperties = function (source, target, overwrite)
{
	if (source === undefined || source === null ||
		target === undefined || target === null)
	{
		return;
	}

	var property;
	for (property in source) {
		if (source.hasOwnProperty (property)) {
			if (overwrite || target[property] === undefined || target[property] === null) {
				target[property] = source[property];
			}
		}
	}
};

/**
* Function: Assert
* Description: Shows up an alert with the given message if the condition is false.
* Parameters:
*	condition {boolean} the condition to check
*	message {string} error message
*/
JSM.Assert = function (condition, message)
{
	if (!condition) {
		var alertText = 'Assertion failed.';
		if (message !== undefined && message !== null) {
			alertText += ' ' + message;
		}
		alert (alertText);
	}
};
