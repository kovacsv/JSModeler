PointCloudGenerator = function ()
{
	this.pointNum = 100000;
	this.colorScheme = 1;
};

PointCloudGenerator.prototype.SetPointNum = function (pointNum)
{
	this.pointNum = pointNum;
}

PointCloudGenerator.prototype.SetColorScheme = function (colorScheme)
{
	this.colorScheme = colorScheme;
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
	
	function AddColor (colors, point, xRange, yRange, colorScheme)
	{
		function NormalizeNumber (number, range)
		{
			return (number - range[0]) / (range[1] - range[0]);
		}
		
		function GetColorComponent (number, fromColor, toColor, component)
		{
			return fromColor[component] + number * (toColor[component] - fromColor[component])
		}
		
		var normalizedX = NormalizeNumber (point.x, xRange);
		var normalizedY = NormalizeNumber (point.y, yRange);
		
		var fromColor = [0.8, 0.2];
		var toColor = [0.2, 0.8];

		var xComponent = GetColorComponent (normalizedX, fromColor, toColor, 0);
		var yComponent = GetColorComponent (normalizedY, fromColor, toColor, 1);
		
		var x, y, z;
		if (colorScheme == 1) {
			x = xComponent;
			y = yComponent;
			z = 0.0;
		} else if (colorScheme == 2) {
			x = xComponent;
			y = 0.0;
			z = yComponent;
		} else if (colorScheme == 3) {
			x = 0.0;
			y = xComponent;
			z = yComponent;
		}
		
		colors.push (x, y, z);
	}

	var points = [];
	var colors = [];
	var i, point, surfacePoint;
	for (i = 0; i < this.pointNum; i++) {
		point = AddPoint (points, xRange, yRange);
		AddColor (colors, point, xRange, yRange, this.colorScheme);
	}
	
	return [points, colors];
};

PointCloudGenerator.prototype.GenerateSeaShell = function ()
{
	function GetSurfacePoint (u, v)
	{
		var result = new JSM.Coord (
			2.0 * (1.0 - Math.exp (u / (6.0 * Math.PI))) * Math.cos (u) * Math.pow (Math.cos (v / 2.0), 2),
			2.0 * (-1.0 + Math.exp (u / (6.0 * Math.PI))) * Math.sin (u) * Math.pow (Math.cos (v / 2.0), 2),
			1.0 - Math.exp (u / (3.0 * Math.PI)) - Math.sin (v) + Math.exp (u / (6.0 * Math.PI)) * Math.sin (v)
		);

		return result;
	}
	
	return this.Generate ([0.0, 6.0 * Math.PI], [0.0, 2.0 * Math.PI], GetSurfacePoint);
};

PointCloudGenerator.prototype.GenerateMobiusStrip = function ()
{
	function GetSurfacePoint (u, v)
	{
		var result = new JSM.Coord (
			(1.0 + v / 2.0 * Math.cos (u / 2.0)) * Math.cos (u),
			(1.0 + v / 2.0 * Math.cos (u / 2.0)) * Math.sin (u),
			v / 2.0 * Math.sin (u / 2.0)
		);
		return result;
	}

	return this.Generate ([0.0, 2.0 * Math.PI], [-1.0, 1.0], GetSurfacePoint);
};

PointCloudGenerator.prototype.GenerateKleinBottle = function ()
{
	function GetSurfacePoint (u, v)
	{
		var r = 1.0;
		var result = new JSM.Coord (
			(r + Math.cos (u / 2.0) * Math.sin (v) - Math.sin (u / 2.0) * Math.sin (2.0 * v)) * Math.cos (u),
			(r + Math.cos (u / 2.0) * Math.sin (v) - Math.sin (u / 2.0) * Math.sin (2.0 * v)) * Math.sin (u),
			Math.sin (u / 2.0) * Math.sin (v) + Math.cos (u / 2.0) * Math.sin (2.0 * v)
		);
		return result;
	}
	return this.Generate ([0.0, 2 * Math.PI], [0.0 + JSM.Eps, 2.0 * Math.PI], GetSurfacePoint);
};

PointCloudGenerator.prototype.GenerateSteinerSurface = function ()
{
	function GetSurfacePoint (u, v)
	{
		var result = new JSM.Coord (
			Math.sin (2.0 * u) * Math.pow (Math.cos (v), 2.0),
			Math.sin (u) * Math.sin (2.0 * v),
			Math.cos (u) * Math.sin (2.0 * v)
		);
		return result;
	}
	return this.Generate ([0.0, Math.PI], [-Math.PI / 2.0, Math.PI / 2.0], GetSurfacePoint);
};

PointCloudGenerator.prototype.GenerateDinisSurface = function ()
{
	function GetSurfacePoint (u, v)
	{
		var a = 0.5;
		var b = 0.2;
		var result = new JSM.Coord (
			a * Math.cos (u) * Math.sin (v),
			a * Math.sin (u) * Math.sin (v),
			a * (Math.cos (v) + Math.log (Math.tan (v / 2.0))) + b * u
		);
		return result;
	}
	return this.Generate ([0.0, 4.0 * Math.PI], [0.01, 2.0], GetSurfacePoint);
};

PointCloudGenerator.prototype.GenerateSphere = function ()
{
	function GetSurfacePoint (u, v)
	{
		var result = new JSM.Coord (
			Math.sin (u) * Math.cos (v),
			Math.sin (u) * Math.sin (v),
			Math.cos (u)
		);
		return result;
	}

	return this.Generate ([0, 2 * Math.PI], [0.0, Math.PI], GetSurfacePoint);
};

