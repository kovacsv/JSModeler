var JSM = {
	mainVersion : 0,
	subVersion : 27
};

JSM.Eps = 0.00000001;
JSM.Inf = 9999999999;
JSM.RadDeg = 57.29577951308232;
JSM.DegRad = 0.017453292519943;

/**
* Function: IsZero
* Description: Determines if the given value is near zero. Uses epsilon for comparison.
*/
JSM.IsZero = function (a)
{
	return Math.abs (a) < JSM.Eps;
};

/**
* Function: IsPositive
* Description: Determines if the given value is positive. Uses epsilon for comparison.
*/
JSM.IsPositive = function (a)
{
	return a > JSM.Eps;
};

/**
* Function: IsNegative
* Description: Determines if the given value is negative. Uses epsilon for comparison.
*/
JSM.IsNegative = function (a)
{
	return a < -JSM.Eps;
};

/**
* Function: IsLower
* Description: Determines if a value is lower than an other. Uses epsilon for comparison.
*/
JSM.IsLower = function (a, b)
{
	return b - a > JSM.Eps;
};

/**
* Function: IsGreater
* Description: Determines if a value is greater than an other. Uses epsilon for comparison.
*/
JSM.IsGreater = function (a, b)
{
	return a - b > JSM.Eps;
};

/**
* Function: IsEqual
* Description: Determines if two values are equal. Uses epsilon for comparison.
*/
JSM.IsEqual = function (a, b)
{
	return Math.abs (b - a) < JSM.Eps;
};

/**
* Function: IsEqualWithEps
* Description: Determines if two values are equal. Uses the given epsilon for comparison.
*/
JSM.IsEqualWithEps = function (a, b, eps)
{
	return Math.abs (b - a) < eps;
};

/**
* Function: IsLowerOrEqual
* Description: Determines if a value is lower or equal to an other. Uses epsilon for comparison.
*/
JSM.IsLowerOrEqual = function (a, b)
{
	return JSM.IsLower (a, b) || JSM.IsEqual (a, b);
};

/**
* Function: IsGreaterOrEqual
* Description: Determines if a value is greater or equal to an other. Uses epsilon for comparison.
*/
JSM.IsGreaterOrEqual = function (a, b)
{
	return JSM.IsGreater (a, b) || JSM.IsEqual (a, b);
};

/**
* Function: Minimum
* Description: Returns the minimum of two values. Uses epsilon for comparison.
*/
JSM.Minimum = function (a, b)
{
	return JSM.IsLower (a, b) ? a : b;
};

/**
* Function: Maximum
* Description: Returns the maximum of two values. Uses epsilon for comparison.
*/
JSM.Maximum = function (a, b)
{
	return JSM.IsGreater (a, b) ? a : b;
};

/**
* Function: ArcSin
* Description: Calculates the arcus sinus value.
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
* Function: RandomInt
* Description: Generates a random integer between two integers.
*/
JSM.RandomInt = function (from, to)
{
	return Math.floor ((Math.random () * (to - from + 1)) + from); 
};

/**
* Function: SeededRandomInt
* Description: Generates a random integer between two integers. A seed number can be specified.
*/
JSM.SeededRandomInt = function (from, to, seed)
{
    var random = ((seed * 9301 + 49297) % 233280) / 233280;
	return Math.floor ((random * (to - from + 1)) + from); 
};

/**
* Function: ValueOrDefault
* Description: Returns the given value, or a default if it is undefined.
*/
JSM.ValueOrDefault = function (val, def)
{
	if (val === undefined || val === null) {
		return def;
	}
	return val;
};

/**
* Function: Assert
* Description: Shows up an alert with the given message is the condition is false.
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
