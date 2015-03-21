JSM.RayTracerRect = function (x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.colors = [];
	var i;
	for (i = 0; i < this.width * this.height; i++) {
		this.colors.push (new JSM.Coord (0.0, 0.0, 0.0));
	}
};

JSM.RayTracerRect.prototype.AddColor = function (row, column, color)
{
	var index = row * this.width + column;
	this.colors[index] = JSM.CoordAdd (this.colors[index], color);
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

JSM.RayTracerImage.prototype.GetFieldRandomSample = function (x, y)
{
    var result = this.bottomLeft.Clone ();
	result = JSM.CoordOffset (result, this.xDirection, x * this.fieldWidth + Math.random () * this.fieldWidth);
	result = JSM.CoordOffset (result, this.yDirection, y * this.fieldHeight + Math.random () * this.fieldHeight);
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

JSM.RayTracer.prototype.Render = function (mode, model, camera, lights, sampleCount, rectSize, onFinish)
{
	function InitRects (rectSize, canvasWidth, canvasHeight)
	{
		function RectCount (rectSize, canvasWidth, canvasHeight)
		{
			var rowCount = Math.ceil (canvasHeight / rectSize);
			var columnCount = Math.ceil (canvasWidth / rectSize);
			return rowCount * columnCount;
		}
		
		function CreateRect (row, column, rectSize, canvasWidth, canvasHeight)
		{
			var x = column * rectSize;
			var y = row * rectSize;
			var width = rectSize;
			if (x + width >= canvasWidth) {
				width = canvasWidth - x;
			}
			var height = rectSize;
			if (y + height >= canvasHeight) {
				height = canvasHeight - y;
			}
			var result = new JSM.RayTracerRect (x, y, width, height);
			return result;
		}
		
		var result = [];
		var rowCount = Math.ceil (canvasHeight / rectSize);
		var columnCount = Math.ceil (canvasWidth / rectSize);
		var i, j, rect;
		for (i = 0; i < rowCount; i++) {
			for (j = 0; j < columnCount; j++) {
				rect = CreateRect (i, j, rectSize, canvasWidth, canvasHeight);
				result.push (rect);
			}
		}
		return result;
	}

	function RenderCurrentRect ()
	{
		var currentRect = renderRects[currentRectIndex];

		var i, j, color;
		for (i = currentRect.y; i < currentRect.y + currentRect.height; i++) {
			for (j = currentRect.x; j < currentRect.x + currentRect.width; j++) {
				color = renderCallback (j, this.canvas.height - i - 1, currentSample, maxSampleCount);
				currentRect.AddColor (i - currentRect.y, j - currentRect.x, color);
			}
		}
		this.PutPixelRect (currentRect, currentSample);

		if (currentRectIndex < renderRects.length - 1) {
			currentRectIndex += 1;
		} else {
			currentRectIndex = 0;
			currentSample += 1;
		}

		return true;
	}
	
	this.renderData = {};
	this.renderData.model = model;
	this.renderData.camera = camera;
	this.renderData.lights = lights;
	this.renderData.image = new JSM.RayTracerImage (camera, this.canvas.width, this.canvas.height, 1.0);
	
	var currentRectIndex = 0;
	var currentSample = 1;
	var maxSampleCount = sampleCount;
	var renderRects = InitRects (rectSize, this.canvas.width, this.canvas.height);
	var runCount = renderRects.length * maxSampleCount;
	var renderCallback = null;
	if (mode == 'RayTrace') {
		renderCallback = this.RayTraceGetPixelColor.bind (this);
	} else if (mode == 'PathTrace') {
		renderCallback = this.PathTraceGetPixelColor.bind (this);
	}

	var asyncEnv = new JSM.AsyncEnvironment ({
		onFinish : function () {
			if (onFinish !== undefined && onFinish !== null) {
				onFinish ();
			}
		}
	});
	JSM.AsyncRunTask (RenderCurrentRect.bind (this), asyncEnv, runCount, 0, null);
};

JSM.RayTracer.prototype.RayTraceGetPixelColor = function (x, y, currentSample, maxSampleCount)
{
	var sample = this.renderData.image.GetFieldFixSample (x, y, currentSample, maxSampleCount);
	var ray = new JSM.Ray (this.renderData.camera.eye, JSM.CoordSub (sample, this.renderData.camera.eye));
	return this.TraceRay (ray, 0);
};

JSM.RayTracer.prototype.TraceRay = function (ray, iteration)
{
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
		return JSM.RayTriangleModelIntersectionWithOctree (shadowRay, renderData.model, null);
	}
	
	var color = new JSM.Coord (0.0, 0.0, 0.0);
	if (iteration > 5) {
		return color;
	}
	
	var intersection = {};
	if (!JSM.RayTriangleModelIntersectionWithOctree (ray, this.renderData.model, intersection)) {
		return color;
	}
	
	var body = this.renderData.model.GetBody (intersection.bodyIndex);
	var triangle = body.GetTriangle (intersection.triangleIndex);
	var material = this.renderData.model.GetMaterial (triangle.mat);
	var intersectionPosition = intersection.position;
	var intersectionNormal = body.GetTriangleNormal (intersection.triangleIndex, intersectionPosition);
	
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
		var reflectedColor = this.TraceRay (reflectedRay, iteration + 1);
		color = JSM.CoordAdd (color, JSM.VectorMultiply (reflectedColor, material.reflection));
	}
	
	this.ClampColor (color);
	return color;
};

JSM.RayTracer.prototype.PathTraceGetPixelColor = function (x, y, currentSample, maxSampleCount)
{
	var sample = this.renderData.image.GetFieldRandomSample (x, y, currentSample, maxSampleCount);
	var ray = new JSM.Ray (this.renderData.camera.eye, JSM.CoordSub (sample, this.renderData.camera.eye));
	return this.TracePath (ray, 0);
};

JSM.RayTracer.prototype.TracePath = function (ray, iteration)
{
	function RandomDirectionOnHemisphere (normal)
	{
		var theta = Math.acos (Math.sqrt (1.0 - Math.random ()));
		var phi = 2.0 * Math.PI * Math.random ();
		var xs = Math.sin (theta) * Math.cos (phi);
		var ys = Math.cos (theta);
		var zs = Math.sin (theta) * Math.sin (phi);
		
		var yVector = new JSM.Vector (normal.x, normal.y, normal.z);
		var h = yVector.Clone ();
		if (JSM.IsLowerOrEqual (Math.abs (h.x), Math.abs (h.y)) && JSM.IsLowerOrEqual (Math.abs (h.x), Math.abs (h.z))) {
			h.x = 1.0;
		} else if (JSM.IsLowerOrEqual (Math.abs (h.y), Math.abs (h.x)) && JSM.IsLowerOrEqual (Math.abs (h.y), Math.abs (h.z))) {
			h.y = 1.0;
		} else {
			h.z = 1.0;
		}

		var xVector = JSM.VectorNormalize (JSM.VectorCross (h, yVector));
		var zVector = JSM.VectorNormalize (JSM.VectorCross (xVector, yVector));
		var direction = new JSM.Vector (0.0, 0.0, 0.0);
		direction = JSM.CoordAdd (direction, JSM.VectorMultiply (xVector, xs));
		direction = JSM.CoordAdd (direction, JSM.VectorMultiply (yVector, ys));
		direction = JSM.CoordAdd (direction, JSM.VectorMultiply (zVector, zs));
		return JSM.VectorNormalize (direction);
	}

	function GetReflectedDirection (direction, normal)
	{
		var dotProduct = JSM.VectorDot (normal, direction);
		return JSM.CoordSub (direction, JSM.VectorMultiply (normal, 2.0 * dotProduct));
	}
	
	function TraceLights (renderer, intersectionPosition, intersectionNormal)
	{
		function GetRandomLightPoint (light)
		{
			var direction = new JSM.Vector (Math.random (), Math.random (), Math.random ());
			var result = JSM.CoordOffset (light.position, direction, Math.random () * light.radius);
			return result;
		}	
	
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		var i, light, lightDistance, lightDirection, lightRay, color;
		for (i = 0; i < renderer.renderData.lights.length; i++) {
			light = renderer.renderData.lights[i];
			lightPoint = GetRandomLightPoint (light);
			lightDistance = JSM.CoordDistance (lightPoint, intersectionPosition);
			lightDirection = JSM.CoordSub (lightPoint, intersectionPosition);
			lightRay = new JSM.Ray (intersectionPosition, lightDirection, lightDistance);
			if (!JSM.RayTriangleModelIntersectionWithOctree (lightRay, renderer.renderData.model, null)) {
				color = renderer.PhongShading (material, light, intersectionPosition, intersectionNormal);
				result = JSM.CoordAdd (result, color);
			}
		}
		return result;
	}
	
	function TraceModel (renderer, intersectionPosition, intersectionNormal, iteration)
	{
		var result = new JSM.Coord (0.0, 0.0, 0.0);
		var randomRayDir = RandomDirectionOnHemisphere (intersectionNormal);
		var ray = new JSM.Ray (intersectionPosition, randomRayDir);
		return renderer.TracePath (ray, iteration + 1)
	}	
	
	var color = new JSM.Coord (0.0, 0.0, 0.0);
	if (iteration > 5) {
		return color;
	}
	
	var intersection = {};
	if (!JSM.RayTriangleModelIntersectionWithOctree (ray, this.renderData.model, intersection)) {
		return color;
	}
	
	var body = this.renderData.model.GetBody (intersection.bodyIndex);
	var triangle = body.GetTriangle (intersection.triangleIndex);
	var material = this.renderData.model.GetMaterial (triangle.mat);
	var intersectionPosition = intersection.position;
	var intersectionNormal = body.GetTriangleNormal (intersection.triangleIndex, intersectionPosition);
	
	var colorFromLight = TraceLights (this, intersectionPosition, intersectionNormal);
	var colorFromModel = TraceModel (this, intersectionPosition, intersectionNormal, iteration);
	var lightModelRatio = 0.75;
	color = JSM.CoordAdd (JSM.VectorMultiply (colorFromLight, lightModelRatio), JSM.VectorMultiply (colorFromModel, 1.0 - lightModelRatio));
	
	if (material.reflection > 0.0) {
		var reflectedDirection = GetReflectedDirection (ray.GetDirection (), intersectionNormal);
		var reflectedRay = new JSM.Ray (intersection.position, reflectedDirection);
		var reflectedColor = this.TracePath (reflectedRay, iteration + 1);
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

JSM.RayTracer.prototype.PutPixelRect = function (rect, sampleCount)
{
	var imageData = this.context.createImageData (rect.width, rect.height);
	var i, color;
	for (i = 0; i < imageData.data.length / 4; i++) {
		color = rect.colors[i];
		imageData.data[4 * i + 0] = (color.x / sampleCount) * 255.0;
		imageData.data[4 * i + 1] = (color.y / sampleCount) * 255.0;
		imageData.data[4 * i + 2] = (color.z / sampleCount) * 255.0;
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
