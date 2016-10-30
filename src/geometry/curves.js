/**
* Function: GenerateCubicBezierCurve
* Description: Generates a bezier curve from the given points.
* Parameters:
*	p0 {Coord2D} point 1
*	p1 {Coord2D} point 2
*	p2 {Coord2D} point 3
*	p3 {Coord2D} point 4
*	segmentation {integer} the segmentation of the result curve
* Returns:
*	{Coord2D[]} the result
*/
JSM.GenerateCubicBezierCurve = function (p0, p1, p2, p3, segmentation)
{
	function GetCubicBezierPoint (p0, p1, p2, p3, t)
	{
		var t2 = t * t;
		var t3 = t2 * t;
		var invT = 1.0 - t;
		var invT2 = invT * invT;
		var invT3 = invT2 * invT;
		var x = invT3 * p0.x + 3.0 * invT2 * t * p1.x  + 3.0 * invT * t2 * p2.x + t3 * p3.x;
		var y = invT3 * p0.y + 3.0 * invT2 * t * p1.y  + 3.0 * invT * t2 * p2.y + t3 * p3.y;
		return new JSM.Coord2D (x, y);
	}
	
	var result = [];
	var s = 1.0 / segmentation;
	var i, coord;
	for (i = 0; i <= segmentation; i++) {
		coord = GetCubicBezierPoint (p0, p1, p2, p3, i * s);
		result.push (coord);
	}
	return result;
};

/**
* Function: BernsteinPolynomial
* Description: Calculates the value of the Bernstein polynomial.
* Parameters:
*	k {integer} the start index
*	n {integer} the end index
*	x {number} the value
* Returns:
*	{number} the result
*/
JSM.BernsteinPolynomial = function (k, n, x)
{
	function BinomialCoefficient (n, k)
	{
		var result = 1.0;
		var min = JSM.Minimum (k, n - k);
		var i;
		for (i = 0; i < min; i++) {
			result = result * (n - i);
			result = result / (i + 1);
		}
		return result;
	}

	var coefficient = BinomialCoefficient (n, k);
	return coefficient * Math.pow (x, k) * Math.pow (1.0 - x, n - k);
};

/**
* Function: GenerateBezierCurve
* Description: Generates a bezier curve from the given points.
* Parameters:
*	points {Coord2D[]} the points
*	segmentation {integer} the segmentation of the result curve
* Returns:
*	{Coord2D[]} the result
*/
JSM.GenerateBezierCurve = function (points, segmentation)
{
	var result = [];
	var n = points.length - 1;
	var s = 1.0 / segmentation;
	
	var i, j, t, point, bernstein, coord;
	for (i = 0; i <= segmentation; i++) {
		t = i * s;
		coord = new JSM.Coord2D (0.0, 0.0);
		for (j = 0; j <= n; j++) {
			point = points[j];
			bernstein = JSM.BernsteinPolynomial (j, n, t);
			coord.x += point.x * bernstein;
			coord.y += point.y * bernstein;
		}
		result.push (coord);
	}
	return result;
};
