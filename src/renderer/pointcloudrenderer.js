JSM.PointCloudRenderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	
	this.camera = null;
	this.points = null;
	this.pointSize = null;
};

JSM.PointCloudRenderer.prototype.Init = function (canvasName, camera)
{
	if (!this.InitContext (canvasName)) {
		return false;
	}

	if (!this.InitShaders ()) {
		return false;
	}

	if (!this.InitBuffers ()) {
		return false;
	}

	if (!this.InitView (camera)) {
		return false;
	}

	return true;
};

JSM.PointCloudRenderer.prototype.InitContext = function (canvasName)
{
	if (!window.WebGLRenderingContext) {
		return false;
	}

	this.canvas = document.getElementById (canvasName);
	if (this.canvas === null) {
		return false;
	}
	
	if (this.canvas.getContext === undefined) {
		return false;
	}

	this.context = this.canvas.getContext ('webgl');
	if (this.context === null) {
		return false;
	}

	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;

	this.context.clearColor (1.0, 1.0, 1.0, 1.0);
	this.context.enable (this.context.DEPTH_TEST);

	return true;
};

JSM.PointCloudRenderer.prototype.InitShaders = function ()
{
	function CreateShaderFromScript (context, script, type)
	{
		var shader = context.createShader (type);
		context.shaderSource (shader, script);
		context.compileShader (shader);
		if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
			return null;
		}
		return shader;
	}

	var fragmentShaderScript = [
		'varying highp vec3 vColor;',
		'void main (void) {',
		'	gl_FragColor = vec4 (vColor, 1.0);',
		'}'
		].join('\n');
	
	var vertexShaderScript = [
		'attribute highp vec3 aVertexPosition;',
		'attribute highp vec3 aVertexColor;',

		'uniform highp mat4 uViewMatrix;',
		'uniform highp mat4 uProjectionMatrix;',

		'uniform highp float uPointSize;',
		
		'varying highp vec3 vColor;',
		
		'void main (void) {',
		'	vColor = aVertexColor;',
		'	gl_PointSize = uPointSize;',
		'	gl_Position = uProjectionMatrix * uViewMatrix * vec4 (aVertexPosition, 1.0);',
		'}'
		].join('\n');
	
	var fragmentShader = CreateShaderFromScript (this.context, fragmentShaderScript, this.context.FRAGMENT_SHADER);
	var vertexShader = CreateShaderFromScript (this.context, vertexShaderScript, this.context.VERTEX_SHADER);
	if (fragmentShader === null || vertexShader === null) {
		return false;
	}

	this.shader = this.context.createProgram ();
	this.context.attachShader (this.shader, vertexShader);
	this.context.attachShader (this.shader, fragmentShader);
	this.context.linkProgram (this.shader);
	if (!this.context.getProgramParameter (this.shader, this.context.LINK_STATUS)) {
		return false;
	}
	this.context.useProgram (this.shader);

	this.shader.vertexPositionAttribute = this.context.getAttribLocation (this.shader, 'aVertexPosition');
	this.context.enableVertexAttribArray (this.shader.vertexPositionAttribute);

	this.shader.vertexColorAttribute = this.context.getAttribLocation (this.shader, 'aVertexColor');
	this.context.enableVertexAttribArray (this.shader.vertexColorAttribute);

	this.shader.pMatrixUniform = this.context.getUniformLocation (this.shader, 'uProjectionMatrix');
	this.shader.vMatrixUniform = this.context.getUniformLocation (this.shader, 'uViewMatrix');
	
	this.shader.pointSizeUniform = this.context.getUniformLocation (this.shader, 'uPointSize');

	return true;
};

JSM.PointCloudRenderer.prototype.InitBuffers = function ()
{
	this.points = [];
	this.pointSize = 1.0;
	return true;
};

JSM.PointCloudRenderer.prototype.InitView = function (camera)
{
	this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
	if (!this.camera) {
		return false;
	}

	return true;
};

JSM.PointCloudRenderer.prototype.SetClearColor = function (red, green, blue)
{
	this.context.clearColor (red, green, blue, 1.0);
};

JSM.PointCloudRenderer.prototype.SetPointSize = function (pointSize)
{
	this.pointSize = pointSize;
};

JSM.PointCloudRenderer.prototype.AddPoints = function (points, colors)
{
	var pointBuffer = this.context.createBuffer ();
	var pointArray = new Float32Array (points);

	this.context.bindBuffer (this.context.ARRAY_BUFFER, pointBuffer);
	this.context.bufferData (this.context.ARRAY_BUFFER, pointArray, this.context.STATIC_DRAW);
	pointBuffer.itemSize = 3;
	pointBuffer.numItems = parseInt (pointArray.length / 3, 10);
	
	var colorBuffer = this.context.createBuffer ();
	var colorArray = new Float32Array (colors);

	this.context.bindBuffer (this.context.ARRAY_BUFFER, colorBuffer);
	this.context.bufferData (this.context.ARRAY_BUFFER, colorArray, this.context.STATIC_DRAW);
	colorBuffer.itemSize = 3;
	colorBuffer.numItems = parseInt (colorArray.length / 3, 10);

	this.points.push ({pointArray : pointArray, pointBuffer : pointBuffer, colorBuffer : colorBuffer});
};

JSM.PointCloudRenderer.prototype.RemovePoints = function ()
{
	this.points = [];
};

JSM.PointCloudRenderer.prototype.Resize = function ()
{
	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
};

JSM.PointCloudRenderer.prototype.Render = function ()
{
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var projectionMatrix = JSM.MatrixPerspective (this.camera.fieldOfView * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, this.camera.nearClippingPlane, this.camera.farClippingPlane);
	this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, projectionMatrix);

	var viewMatrix = JSM.MatrixView (this.camera.eye, this.camera.center, this.camera.up);
	this.context.uniformMatrix4fv (this.shader.vMatrixUniform, false, viewMatrix);

	this.context.uniform1f (this.shader.pointSizeUniform, this.pointSize);
	
	var i, pointBuffer, colorBuffer;
	for (i = 0; i < this.points.length; i++) {
		pointBuffer = this.points[i].pointBuffer;
		colorBuffer = this.points[i].colorBuffer;
		this.context.bindBuffer (this.context.ARRAY_BUFFER, pointBuffer);
		this.context.vertexAttribPointer (this.shader.vertexPositionAttribute, pointBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		this.context.bindBuffer (this.context.ARRAY_BUFFER, colorBuffer);
		this.context.vertexAttribPointer (this.shader.vertexColorAttribute, colorBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		this.context.drawArrays (this.context.POINTS, 0, pointBuffer.numItems);
	}
};
