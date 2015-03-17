JSM.RayTracerRect = function (size, canvasWidth, canvasHeight)
{
	this.valid = true;
	this.size = size;
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.Reset ();
};

JSM.RayTracerRect.prototype.IsValid = function ()
{
	return this.valid;
};

JSM.RayTracerRect.prototype.RectCount = function ()
{
	var rowCount = Math.ceil (this.canvasHeight / this.size);
	var columnCount = Math.ceil (this.canvasHeight / this.size);
	return rowCount * columnCount;
};

JSM.RayTracerRect.prototype.Step = function ()
{
	if (!this.valid) {
		return;
	}
	
	this.width = this.size;
	this.height = this.size;

	this.x += this.size;
	if (this.x >= this.canvasWidth) {
		this.x = 0;
		this.y += this.size;
	}
	this.AdjustWidth ();
	
	if (this.y >= this.canvasHeight) {
		this.y += this.size;
	}
	this.AdjustHeight ();
	
	if (this.y >= this.canvasHeight) {
		this.Reset ();
		this.valid = false;
	}
};

JSM.RayTracerRect.prototype.Reset = function ()
{
	this.x = 0;
	this.y = 0;
	this.width = this.size;
	this.height = this.size;
	this.AdjustWidth ();
	this.AdjustHeight ();
};

JSM.RayTracerRect.prototype.AdjustWidth = function ()
{
	if (this.x + this.width >= this.canvasWidth) {
		this.width = this.canvasWidth - this.x;
	}
};

JSM.RayTracerRect.prototype.AdjustHeight = function ()
{
	if (this.y + this.height >= this.canvasHeight) {
		this.height = this.canvasHeight - this.y;
	}
};

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

JSM.RayTracerImage.prototype.GetFieldFixSample = function (x, y, currentSample, sampleCount)
{
    var sampleResolution = Math.sqrt (sampleCount);
	var sampleWidth = this.fieldWidth / sampleResolution;
	var sampleHeight = this.fieldHeight / sampleResolution;
    
    var xSample = parseInt (currentSample / sampleResolution);
    var ySample = parseInt (currentSample % sampleResolution);
	
	var result = this.bottomLeft.Clone ();
	result = JSM.CoordOffset (result, this.xDirection, x * this.fieldWidth + xSample * sampleWidth);
	result = JSM.CoordOffset (result, this.yDirection, y * this.fieldHeight + ySample * sampleHeight);
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

JSM.RayTracer.prototype.Render = function (model, camera, lights, sampleCount, rectSize, onFinish)
{
	function RenderRect ()
	{
		var colors = [];
		var i, j, color;
		for (i = currentRect.y; i < currentRect.y + currentRect.height; i++) {
			for (j = currentRect.x; j < currentRect.x + currentRect.width; j++) {
				color = this.GetPixelColor (j, this.canvas.height - i - 1);
				colors.push (color);
			}
		}
		this.PutPixelRect (currentRect, colors);
		currentRect.Step ();
		return true;
	}
	
	this.renderData = {};
	this.renderData.model = model;
	this.renderData.camera = camera;
	this.renderData.lights = lights;
	this.renderData.sampleCount = sampleCount;
	this.renderData.image = new JSM.RayTracerImage (camera, this.canvas.width, this.canvas.height, 1.0);
	
	var currentRect = new JSM.RayTracerRect (rectSize, this.canvas.width, this.canvas.height);
	var asyncEnv = new JSM.AsyncEnvironment ({
		onFinish : function () {
			if (onFinish !== undefined && onFinish !== null) {
				onFinish ();
			}
		}
	});
	var runCount = currentRect.RectCount ();
	JSM.AsyncRunTask (RenderRect.bind (this), asyncEnv, runCount, 0, null);
};

JSM.RayTracer.prototype.GetPixelColor = function (x, y)
{
	var color = new JSM.Coord (0.0, 0.0, 0.0);
	var i, sample, ray;
	for (i = 0; i < this.renderData.sampleCount; i++) {
		sample = this.renderData.image.GetFieldFixSample (x, y, i, this.renderData.sampleCount);
		ray = new JSM.Ray (this.renderData.camera.eye, JSM.CoordSub (sample, this.renderData.camera.eye));
		color = JSM.CoordAdd (color, this.Trace (ray, 0));
	}
	color = JSM.VectorMultiply (color, 1.0 / this.renderData.sampleCount);
	return color;
};

JSM.RayTracer.prototype.Trace = function (ray, iteration)
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
			normal = JSM.BarycentricInterpolation (v0, v1, v2, n0, n1, n2, intersection);
		}
		return normal;
	}

	function GetReflectedDirection (direction, normal)
	{
		var dotProduct = JSM.VectorDot (normal, direction);
		return JSM.CoordSub (direction, JSM.VectorMultiply (normal, 2.0 * dotProduct));
	}
	
	function IsInShadow (renderData, intersectionPosition, light)
	{
		var lightDistance = JSM.CoordDistance (light.position, intersectionPosition);
		var lightDirection = JSM.CoordSub (light.position, intersectionPosition);
		var shadowRay = new JSM.Ray (intersectionPosition, lightDirection, lightDistance);
		return JSM.RayTriangleModelIntersection (shadowRay, renderData.model, null, true);
	}
	
	var color = new JSM.Coord (0.0, 0.0, 0.0);
	if (iteration > 5) {
		return color;
	}
	
	var intersection = {};
	if (!JSM.RayTriangleModelIntersection (ray, this.renderData.model, intersection, true)) {
		return color;
	}
	
	var body = this.renderData.model.GetBody (intersection.bodyIndex);
	var triangle = body.GetTriangle (intersection.triangleIndex);
	var material = this.renderData.model.GetMaterial (triangle.mat);
	var intersectionPosition = intersection.position;
	var intersectionNormal = GetNormal (body, triangle, intersectionPosition);
	
	var i, light, currentColor;
	for (i = 0; i < this.renderData.lights.length; i++) {
		light = this.renderData.lights[i];
		if (!IsInShadow (this.renderData, intersectionPosition, light)) {
			currentColor = this.PhongShading (material, light, intersectionPosition, intersectionNormal);
			color = JSM.CoordAdd (color, currentColor);
		}
	}

	if (material.reflection > 0.0) {
		var reflectedDirection = GetReflectedDirection (ray.GetDirection (), intersectionNormal);
		var reflectedRay = new JSM.Ray (intersection.position, reflectedDirection);
		var reflectedColor = this.Trace (reflectedRay, iteration + 1);
		color = JSM.CoordAdd (color, JSM.VectorMultiply (reflectedColor, material.reflection));
	}
	
	this.ClampColor (color);
	return color;
};

JSM.RayTracer.prototype.PhongShading = function (material, light, shadedPoint, shadedPointNormal)
{
	var materialAmbientColor = new JSM.Coord (material.ambient[0], material.ambient[1], material.ambient[2]);
	var materialDiffuseColor = new JSM.Coord (material.diffuse[0], material.diffuse[1], material.diffuse[2]);
	
	var ambientColor = JSM.VectorMultiply (materialAmbientColor, light.ambientIntensity);
	this.ClampColor (ambientColor);
	
	var lightDirection = JSM.VectorNormalize (JSM.CoordSub (light.position, shadedPoint));
	var diffuseCoeff = JSM.Maximum (JSM.VectorDot (lightDirection, shadedPointNormal), 0.0);
	var diffuseColor = JSM.VectorMultiply (materialDiffuseColor, light.diffuseIntensity);
	this.ClampColor (diffuseColor)
	
	var color = JSM.CoordAdd (ambientColor, JSM.VectorMultiply (diffuseColor, diffuseCoeff));
	this.ClampColor (color);
	return color;
};

JSM.RayTracer.prototype.PutPixelRect = function (rect, colors)
{
	var imageData = this.context.createImageData (rect.width, rect.height);
	var i, color;
	for (i = 0; i < imageData.data.length / 4; i++) {
		color = colors[i];
		imageData.data[4 * i + 0] = color.x * 255.0;
		imageData.data[4 * i + 1] = color.y * 255.0;
		imageData.data[4 * i + 2] = color.z * 255.0;
		imageData.data[4 * i + 3] = 255.0;
	}
	this.context.putImageData (imageData, rect.x, rect.y);
};	

JSM.RayTracer.prototype.ClampColor = function (value)
{
	if (value.x < 0.0) { value.x = 0.0; }
	if (value.y < 0.0) { value.y = 0.0; }
	if (value.z < 0.0) { value.z = 0.0; }
	if (value.x > 1.0) { value.x = 1.0; }
	if (value.y > 1.0) { value.y = 1.0; }
	if (value.z > 1.0) { value.z = 1.0; }
}
