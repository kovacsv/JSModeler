JSM.RayTracerImage = function (camera, resolutionX, resolutionY, distance)
{
	var imageWidth = 2.0 * distance * Math.tan (camera.fieldOfView / 2.0);
	var imageHeight = 2.0 * distance * Math.tan (camera.fieldOfView / 2.0);
	this.fieldWidth = imageWidth / resolutionX;
	this.fieldHeight = imageHeight / resolutionY;
	
	var eyeToCenter = JSM.VectorNormalize (JSM.CoordSub (camera.center, camera.eye));
	this.xDirection = JSM.VectorNormalize (JSM.VectorCross (eyeToCenter, camera.up));
	this.yDirection = JSM.VectorNormalize (JSM.VectorCross (this.xDirection, eyeToCenter));
	
	var pyramidBottom = JSM.CoordOffset (camera.eye, eyeToCenter, distance);
	this.bottomLeft = pyramidBottom;
	this.bottomLeft = JSM.CoordOffset (this.bottomLeft, JSM.VectorMultiply (this.xDirection, -1.0), imageWidth / 2.0);
	this.bottomLeft = JSM.CoordOffset (this.bottomLeft, JSM.VectorMultiply (this.yDirection, -1.0), imageHeight / 2.0);
};

JSM.RayTracerImage.prototype.GetFieldCenter = function (x, y)
{
	var result = this.bottomLeft.Clone ();
	result = JSM.CoordOffset (result, this.xDirection, x * this.fieldWidth + this.fieldWidth / 2.0);
	result = JSM.CoordOffset (result, this.yDirection, y * this.fieldHeight + this.fieldHeight / 2.0);
	return result;
};

JSM.RayTracer = function ()
{
	this.canvas = null;
	this.context = null;
	this.renderData = null;
};

JSM.RayTracer.prototype.Init = function (canvas)
{
	this.canvas = canvas;
	this.context = this.canvas.getContext ('2d');
};

JSM.RayTracer.prototype.Render = function (model, materials, camera, light)
{
	function RenderRow ()
	{
		var colors = [];
		var currentColumn, color;
		for (currentColumn = 0; currentColumn < this.canvas.width; currentColumn++) {
			color = this.GetPixelColor (currentColumn, this.canvas.height - currentRow - 1);
			colors.push (color);
		}
		this.PutPixelRow (currentRow, colors);
		currentRow++;
		return true;
	}
	
	this.renderData = {};
	this.renderData.model = JSM.ConvertModelToTriangleModel (model, materials);
	this.renderData.camera = camera;
	this.renderData.light = light;
	this.renderData.image = new JSM.RayTracerImage (camera, this.canvas.width, this.canvas.height, 1.0);
	
	var currentRow = 0;
	var asyncEnv = new JSM.AsyncEnvironment ();
	JSM.AsyncRunTask (RenderRow.bind (this), asyncEnv, this.canvas.height, 0, null);
};

JSM.RayTracer.prototype.GetPixelColor = function (x, y)
{
	function GetNormal (body, triangle, intersection)
	{
		var normal = null;
		if (triangle.curve == -1) {
			normal = body.GetNormal (triangle.n0);
		} else {
			var v0 = body.GetVertex (triangle.v0);
			var v1 = body.GetVertex (triangle.v1);
			var v2 = body.GetVertex (triangle.v2);
			var n0 = body.GetNormal (triangle.n0);
			var n1 = body.GetNormal (triangle.n1);
			var n2 = body.GetNormal (triangle.n2);
			normal = JSM.BarycentricInterpolation (v0, v1, v2, n0, n1, n2, intersection.position);
		}
		return normal;
	}

	var fieldCenter = this.renderData.image.GetFieldCenter (x, y);
	var ray = new JSM.Ray (this.renderData.camera.eye, JSM.CoordSub (fieldCenter, this.renderData.camera.eye));
	var intersection = JSM.RayTriangleModelIntersection (ray, this.renderData.model);
	if (intersection == null) {
		return {r : 0, g : 0, b : 0};
	}
	
	var body = this.renderData.model.GetBody (intersection.bodyIndex);
	var triangle = body.GetTriangle (intersection.triangleIndex);
	var material = this.renderData.model.GetMaterial (triangle.mat);
	var intersectionPosition = intersection.position;
	var intersectionNormal = GetNormal (body, triangle, intersectionPosition);
	var color = this.PhongShading (material, this.renderData.light, intersectionPosition, intersectionNormal);
	return color;
};

JSM.RayTracer.prototype.PhongShading = function (material, light, shadedPoint, shadedPointNormal)
{
	function Clamp (value)
	{
		if (value.x < 0.0) { value.x = 0.0; }
		if (value.y < 0.0) { value.y = 0.0; }
		if (value.z < 0.0) { value.z = 0.0; }
		if (value.x > 1.0) { value.x = 1.0; }
		if (value.y > 1.0) { value.y = 1.0; }
		if (value.z > 1.0) { value.z = 1.0; }
	}

	var lightDiffuseColor = new JSM.Coord (light.diffuse[0], light.diffuse[1], light.diffuse[2]);
	var materialDiffuseColor = new JSM.Coord (material.diffuse[0], material.diffuse[1], material.diffuse[2]);
	var lightDirection = JSM.VectorNormalize (JSM.CoordSub (light.position, shadedPoint));

	var lightNormalProduct = JSM.VectorDot (lightDirection, shadedPointNormal);
	var diffuseCoeff = Math.max (lightNormalProduct, 0.0);
	
	var diffuseColor = JSM.CoordAdd (lightDiffuseColor, materialDiffuseColor);
	var color = JSM.VectorMultiply (diffuseColor, diffuseCoeff);
	Clamp (color);
	return {r : color.x * 255, g : color.y * 255, b : color.z * 255};
};

JSM.RayTracer.prototype.PutPixelRow = function (rowIndex, colors)
{
	var imageData = this.context.createImageData (colors.length, 1);
	var i, color;
	for (i = 0; i < colors.length; i++) {
		color = colors[i];
		imageData.data[4 * i + 0] = color.r;
		imageData.data[4 * i + 1] = color.g;
		imageData.data[4 * i + 2] = color.b;
		imageData.data[4 * i + 3] = 255;
	}
	this.context.putImageData (imageData, 0, rowIndex);
};	
