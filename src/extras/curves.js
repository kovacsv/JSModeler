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

/**
* Function: GenerateSurface
* Description: Generates a parametric surface.
* Parameters:
*	xRange {number[2]} the from-to range on x axis
*	yRange {number[2]} the from-to range on y axis
*	xSegmentation {integer} the segmentation along the x axis
*	ySegmentation {integer} the segmentation along the y axis
*	useTriangles {boolean} generate triangles instead of quadrangles
*	isCurved {boolean} create smooth surfaces
*	getPointCallback {function} callback function which returns the point for a position
*	userData {anything} user data which will be passed to getPointCallback
* Returns:
*	{Body} the result
*/
JSM.GenerateSurface = function (xRange, yRange, xSegmentation, ySegmentation, useTriangles, isCurved, getPointCallback, userData)
{
	function AddVertices ()
	{
		var i, j, u, v, coord;
		for (i = 0; i <= ySegmentation; i++) {
			for (j = 0; j <= xSegmentation; j++) {
				u = xStart + j * xSegment;
				v = yStart + i * ySegment;
				coord = getPointCallback (i, j, u, v, userData);
				result.AddVertex (new JSM.BodyVertex (coord));
			}
		}
	}

	function AddPolygons ()
	{
		var i, j;
		var current, next, top, ntop;
		var polygon;
		
		for (j = 0; j < ySegmentation; j++) {
			for (i = 0; i < xSegmentation; i++) {
				current = j * (xSegmentation + 1) + i;
				next = current + 1;
				top = current + xSegmentation + 1;
				ntop = top + 1;
				
				if (useTriangles) {
					polygon = new JSM.BodyPolygon ([current, next, ntop]);
					if (isCurved) {
						polygon.SetCurveGroup (0);
					}
					result.AddPolygon (polygon);
					polygon = new JSM.BodyPolygon ([current, ntop, top]);
					if (isCurved) {
						polygon.SetCurveGroup (0);
					}
					result.AddPolygon (polygon);
				} else {
					polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
					if (isCurved) {
						polygon.SetCurveGroup (0);
					}
					result.AddPolygon (polygon);
				}
			}
		}
	}

	var result = new JSM.Body ();
	
	var xStart = xRange[0];
	var yStart = yRange[0];
	var xDiff = xRange[1] - xRange[0];
	var yDiff = yRange[1] - yRange[0];
	var xSegment = xDiff / xSegmentation;
	var ySegment = yDiff / ySegmentation;
	
	AddVertices ();
	AddPolygons ();

	return result;
};

/**
* Class: SurfaceControlPoints
* Description: Represents control points for surface generation.
* Parameters:
*	n {integer} the first dimension
*	m {integer} the second dimension
*/
JSM.SurfaceControlPoints = function (n, m)
{
	this.n = n;
	this.m = m;
	this.points = [];
	
	var i, j;
	for (i = 0; i <= this.n; i++) {
		this.points.push ([]);
		for (j = 0; j <= this.m; j++) {
			this.points[i].push (new JSM.Coord (0.0, 0.0, 0.0));
		}
	}
};

/**
* Function: SurfaceControlPoints.GetNValue
* Description: Returns the n value.
* Returns:
*	{integer} the result
*/
JSM.SurfaceControlPoints.prototype.GetNValue = function ()
{
	return this.n;
};

/**
* Function: SurfaceControlPoints.GetMValue
* Description: Returns the m value.
* Returns:
*	{integer} the result
*/
JSM.SurfaceControlPoints.prototype.GetMValue = function ()
{
	return this.m;
};

/**
* Function: SurfaceControlPoints.GetControlPoint
* Description: Returns a control point.
* Parameters:
*	i {integer} the first dimension
*	j {integer} the second dimension
* Returns:
*	{Coord} the result
*/
JSM.SurfaceControlPoints.prototype.GetControlPoint = function (i, j)
{
	return this.points[i][j];
};

/**
* Function: SurfaceControlPoints.InitPlanar
* Description: Inits planar control points.
* Parameters:
*	xSize {number} the x size
*	xSize {number} the y size
*/
JSM.SurfaceControlPoints.prototype.InitPlanar = function (xSize, ySize)
{
	var iStep = xSize / this.n;
	var jStep = ySize / this.m;

	var i, j, point;
	for (i = 0; i <= this.n; i++) {
		for (j = 0; j <= this.m; j++) {
			point = this.points[i][j];
			point.x = i * iStep;
			point.y = j * jStep;
		}
	}
};

/**
* Function: GenerateBezierSurface
* Description: Generates a bezier surface base on the given control points.
* Parameters:
*	surfaceControlPoints {SurfaceControlPoints} the control points
*	xSegmentation {integer} the segmentation along the x axis
*	ySegmentation {integer} the segmentation along the y axis
*	isCurved {boolean} create smooth surfaces
* Returns:
*	{Body} the result
*/
JSM.GenerateBezierSurface = function (surfaceControlPoints, xSegmentation, ySegmentation, isCurved)
{
	function GetBezierSurfacePoint (uIndex, vIndex, u, v, surfaceControlPoints)
	{
		var i, j, result, tmp1, tmp2, scalar;
		var n = surfaceControlPoints.GetNValue ();
		var m = surfaceControlPoints.GetMValue ();
		
		result = new JSM.Coord (0.0, 0.0, 0.0);
		for (i = 0; i <= n; i++) {
			tmp1 = new JSM.Coord (0.0, 0.0, 0.0);
			for (j = 0; j <= m; j++) {
				scalar = JSM.BernsteinPolynomial (i, n, u) * JSM.BernsteinPolynomial (j, m, v);
				tmp2 = surfaceControlPoints.GetControlPoint (i, j).Clone ().MultiplyScalar (scalar);
				tmp1 = JSM.CoordAdd (tmp1, tmp2);
			}
			result = JSM.CoordAdd (result, tmp1);
		}
		return result;
	}

	var body = JSM.GenerateSurface ([0, 1], [0, 1], xSegmentation, ySegmentation, false, isCurved, GetBezierSurfacePoint, surfaceControlPoints);
	return body;
};
