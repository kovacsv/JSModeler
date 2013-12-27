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

JSM.GenerateSurfaceFromControlPoints = function (surfaceControlPoints, xSegmentation, ySegmentation, isCurved, getPointCallback)
{
	function AddVertices ()
	{
		var i, j, u, v, coord;
		for (i = 0; i <= ySegmentation; i++) {	
			for (j = 0; j <= xSegmentation; j++) {
				u = j * xSegment;
				v = i * ySegment;
				coord = getPointCallback (surfaceControlPoints, u, v);
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
				
				polygon = new JSM.BodyPolygon ([current, next, ntop, top]);
				if (isCurved) {
					polygon.SetCurveGroup (0);
				}				
				result.AddPolygon (polygon);
			}
		}
	}

	var result = new JSM.Body ();
	
	var xSegment = 1.0 / xSegmentation;
	var ySegment = 1.0 / ySegmentation;
	
	AddVertices ();
	AddPolygons ();

	return result;
};

JSM.GenerateBezierSurface = function (surfaceControlPoints, xSegmentation, ySegmentation, isCurved)
{
	function GetBezierSurfacePoint (surfaceControlPoints, u, v)
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

	var body = JSM.GenerateSurfaceFromControlPoints (surfaceControlPoints, xSegmentation, ySegmentation, isCurved, GetBezierSurfacePoint);
	return body;
};
