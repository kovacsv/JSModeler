JSM.SurfaceControlPoints = function (n, m)
{
	this.n = n;
	this.m = m;
	this.points = [];
	
	var i, j;
	for (i = 0; i <= this.n; i++) {
		this.points.push ([]);
		for (j = 0; j <= this.m; j++) {
			this.points[i].push (new JSM.Coord ());
		}
	}
};

JSM.SurfaceControlPoints.prototype.GetNValue = function ()
{
	return this.n;
};

JSM.SurfaceControlPoints.prototype.GetMValue = function ()
{
	return this.m;
};

JSM.SurfaceControlPoints.prototype.GetControlPoint = function (i, j)
{
	return this.points[i][j];
};

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

JSM.GenerateBezierSurface = function (surfaceControlPoints, xSegmentation, ySegmentation, isCurved)
{
	function GetBezierSurfacePoint (uIndex, vIndex, u, v, surfaceControlPoints)
	{
		function BernsteinPolynomial (i, n, u)
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

			var bc = BinomialCoefficient (n, i);
			return bc * Math.pow (u, i) * Math.pow (1.0 - u, n - i);
		}
		
		var i, j, result, tmp1, tmp2, scalar;
		var n = surfaceControlPoints.GetNValue ();
		var m = surfaceControlPoints.GetMValue ();
		
		result = new JSM.Coord ();
		for (i = 0; i <= n; i++) {
			tmp1 = new JSM.Coord ();
			for (j = 0; j <= m; j++) {
				scalar = BernsteinPolynomial (i, n, u) * BernsteinPolynomial (j, m, v);
				tmp2 = JSM.VectorMultiply (surfaceControlPoints.GetControlPoint (i, j), scalar);
				tmp1 = JSM.CoordAdd (tmp1, tmp2);
			}
			result = JSM.CoordAdd (result, tmp1);
		}
		return result;
	}

	var body = JSM.GenerateSurface ([0, 1], [0, 1], xSegmentation, ySegmentation, false, isCurved, GetBezierSurfacePoint, surfaceControlPoints);
	return body;
};

JSM.GenerateMobiusStrip = function (aParameter, xSegmentation, ySegmentation, isCurved)
{
	function GetSurfacePoint (uIndex, vIndex, u, v, userData)
	{
		var result = new JSM.Coord (
			(aParameter - v * Math.sin (u / 2.0)) * Math.sin (u),
			(aParameter - v * Math.sin (u / 2.0)) * Math.cos (u),
			v * Math.cos (u / 2.0)
		);
		return result;
	}

	var body = JSM.GenerateSurface ([0, 2 * Math.PI], [-1.0, 1.0], xSegmentation, ySegmentation, false, isCurved, GetSurfacePoint, null);
	return body;
};
