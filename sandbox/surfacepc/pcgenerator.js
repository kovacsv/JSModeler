PointCloudGenerator = function ()
{
	this.pointNum = 100000;
};

PointCloudGenerator.prototype.SetPointNum = function (pointNum)
{
	this.pointNum = pointNum;
}

PointCloudGenerator.prototype.Generate = function (xRange, yRange, callbackFunction)
{
	function GetRandomCoord2D (xRange, yRange)
	{
		var result = new JSM.Coord2D ();
		result.x = JSM.RandomNumber (xRange[0], xRange[1]);
		result.y = JSM.RandomNumber (yRange[0], yRange[1]);
		return result;
	}

	function AddPoint (points, xRange, yRange)
	{
		var point = GetRandomCoord2D (xRange, yRange);
		var surfacePoint = callbackFunction (point.x, point.y);
		points.push (surfacePoint.x, surfacePoint.y, surfacePoint.z);
		return point;
	}
	
	function AddColor (colors, point, xRange, yRange)
	{
		function NormalizeNumber (number, range)
		{
			return (number - range[0]) / (range[1] - range[0]);
		}
		
		function GetColor (number, fromColor, toColor, component)
		{
			return fromColor[component] + number * (toColor[component] - fromColor[component])
		}
		
		var normalizedX = NormalizeNumber (point.x, xRange);
		var normalizedY = NormalizeNumber (point.y, yRange);
		
		var fromColor = [0.8, 0.2, 0.0];
		var toColor = [0.2, 0.8, 0.0];

		colors.push (
			GetColor (normalizedX, fromColor, toColor, 0),
			GetColor (normalizedY, fromColor, toColor, 1),
			0.0);
	}

	var points = [];
	var colors = [];
	var i, point, surfacePoint;
	for (i = 0; i < this.pointNum; i++) {
		point = AddPoint (points, xRange, yRange);
		AddColor (colors, point, xRange, yRange);
	}
	
	return [points, colors];
};

PointCloudGenerator.prototype.GenerateConicSpiral = function ()
{
	function GetSurfacePoint (u, v)
	{
		var a = 0.2, b = 1.0, c = 0.1, n = 2;
		var result = new JSM.Coord (
			a * (1.0 - (v / (2.0 * Math.PI))) * Math.cos (n * v) * (1.0 + Math.cos (u)) + c * Math.cos (n * v),
			a * (1.0 - (v / (2.0 * Math.PI))) * Math.sin (n * v) * (1.0 + Math.cos (u)) + c * Math.sin (n * v),
			(b * v + (a * (1.0 - (v / (2.0 * Math.PI))) * Math.sin (u))) / (2.0 * Math.PI)
		);
		
		return result;
	}
	
	return this.Generate ([0, 2 * Math.PI], [0, 2 * Math.PI], GetSurfacePoint);
};

PointCloudGenerator.prototype.GenerateMobiusStrip = function ()
{
	function GetSurfacePoint (u, v)
	{
		var a = 3.0;
	
		var result = new JSM.Coord (
			(a - v * Math.sin (u / 2.0)) * Math.sin (u),
			(a - v * Math.sin (u / 2.0)) * Math.cos (u),
			v * Math.cos (u / 2.0)
		);
		return result;
	}

	return this.Generate ([0, 2 * Math.PI], [-1.0, 1.0], GetSurfacePoint);
};
