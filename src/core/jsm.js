var JSM = {
	mainVersion : 0,
	subVersion : 19
};

JSM.Eps = 0.00000001;
JSM.Inf = 9999999999;
JSM.RadDeg = 57.29577951308232;
JSM.DegRad = 0.017453292519943;

JSM.IsZero = function (a)
{
	return Math.abs (a) < JSM.Eps;
};

JSM.IsPositive = function (a)
{
	return a > JSM.Eps;
};

JSM.IsNegative = function (a)
{
	return a < -JSM.Eps;
};

JSM.IsLower = function (a, b)
{
	return b - a > JSM.Eps;
};

JSM.IsGreater = function (a, b)
{
	return a - b > JSM.Eps;
};

JSM.IsEqual = function (a, b)
{
	return Math.abs (b - a) < JSM.Eps;
};

JSM.IsEqualWithEps = function (a, b, eps)
{
	return Math.abs (b - a) < eps;
};

JSM.IsLowerOrEqual = function (a, b)
{
	return JSM.IsLower (a, b) || JSM.IsEqual (a, b);
};

JSM.IsGreaterOrEqual = function (a, b)
{
	return JSM.IsGreater (a, b) || JSM.IsEqual (a, b);
};

JSM.Minimum = function (a, b)
{
	return JSM.IsLower (a, b) ? a : b;
};

JSM.Maximum = function (a, b)
{
	return JSM.IsGreater (a, b) ? a : b;
};

JSM.ArcSin = function (value)
{
	if (JSM.IsGreaterOrEqual (value, 1.0)) {
		return Math.PI / 2.0;
	} else if (JSM.IsLowerOrEqual (value, -1.0)) {
		return - Math.PI / 2.0;
	}
	
	return Math.asin (value);
};

JSM.ArcCos = function (value)
{
	if (JSM.IsGreaterOrEqual (value, 1.0)) {
		return 0.0;
	} else if (JSM.IsLowerOrEqual (value, -1.0)) {
		return Math.PI;
	}
	
	return Math.acos (value);
};

JSM.RandomInt = function (from, to)
{
	return Math.floor ((Math.random () * (to - from + 1)) + from); 
};

JSM.ValueOrDefault = function (val, def)
{
	if (val === undefined || val === null) {
		return def;
	}
	return val;
};
