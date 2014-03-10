JSM.RenderMatrix = function ()
{
	this.matrix = new Float32Array (16);
};

JSM.RenderMatrix.prototype.Get = function ()
{
	return this.matrix;
};

JSM.RenderMatrix.prototype.Identity = function ()
{
	this.matrix[0] = 1.0;
	this.matrix[1] = 0.0;
	this.matrix[2] = 0.0;
	this.matrix[3] = 0.0;
	this.matrix[4] = 0.0;
	this.matrix[5] = 1.0;
	this.matrix[6] = 0.0;
	this.matrix[7] = 0.0;
	this.matrix[8] = 0.0;
	this.matrix[9] = 0.0;
	this.matrix[10] = 1.0;
	this.matrix[11] = 0.0;
	this.matrix[12] = 0.0;
	this.matrix[13] = 0.0;
	this.matrix[14] = 0.0;
	this.matrix[15] = 1.0;
};

JSM.RenderMatrix.prototype.Perspective = function (fieldOfView, aspectRatio, nearPlane, farPlane)
{
	var f = 1.0 / Math.tan (fieldOfView / 2);
	var nf = 1.0 / (nearPlane - farPlane);
	this.matrix[0] = f / aspectRatio;
	this.matrix[1] = 0.0;
	this.matrix[2] = 0.0;
	this.matrix[3] = 0.0;
	this.matrix[4] = 0.0;
	this.matrix[5] = f;
	this.matrix[6] = 0.0;
	this.matrix[7] = 0.0;
	this.matrix[8] = 0.0;
	this.matrix[9] = 0.0;
	this.matrix[10] = (farPlane + nearPlane) * nf;
	this.matrix[11] = -1.0;
	this.matrix[12] = 0.0;
	this.matrix[13] = 0.0;
	this.matrix[14] = (2.0 * farPlane * nearPlane) * nf;
	this.matrix[15] = 0.0;
};

JSM.RenderMatrix.prototype.ModelView = function (eye, center, up)
{
	if (JSM.CoordIsEqual (eye, center)) {
		this.Identity ();
		return;
	}
	
	var d = JSM.VectorNormalize (JSM.CoordSub (eye, center));
	var v = JSM.VectorNormalize (JSM.VectorCross (up, d));
	var u = JSM.VectorNormalize (JSM.VectorCross (d, v));

    this.matrix[0] = v.x;
    this.matrix[1] = u.x;
    this.matrix[2] = d.x;
    this.matrix[3] = 0;
    this.matrix[4] = v.y;
    this.matrix[5] = u.y;
    this.matrix[6] = d.y;
    this.matrix[7] = 0;
    this.matrix[8] = v.z;
    this.matrix[9] = u.z;
    this.matrix[10] = d.z;
    this.matrix[11] = 0;
    this.matrix[12] = -JSM.VectorDot (v, eye);
    this.matrix[13] = -JSM.VectorDot (u, eye);
    this.matrix[14] = -JSM.VectorDot (d, eye);
    this.matrix[15] = 1;
};

JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	
	this.projectionMatrix = null;
	this.modelViewMatrix = null;
	
	this.triangleVertexBuffer = null;
	this.triangleNormalBuffer = null;
};

JSM.Renderer.prototype.Init = function (canvasName)
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

	return true;
};

JSM.Renderer.prototype.InitContext = function (canvasName)
{
	if (!window.WebGLRenderingContext) {
		return false;
	}

	this.canvas = document.getElementById (canvasName);
	if (!this.canvas) {
		return false;
	}
	
	if (!this.canvas.getContext) {
		return false;
	}

	this.context = this.canvas.getContext ('experimental-webgl');
	if (!this.context) {
		return false;
	}

	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;

	this.context.clearColor (0.0, 0.0, 0.0, 1.0);
	this.context.enable (this.context.DEPTH_TEST);

	return true;
};

JSM.Renderer.prototype.InitShaders = function ()
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
	    'precision mediump float;',
		'varying highp vec3 vLighting;',
		'void main (void) {',
		'	gl_FragColor = vec4 (vec3 (1, 0, 0) * vLighting, 1.0);',
		'}'
		].join('\n');
	var vertexShaderScript = [
		'attribute vec3 aVertexPosition;',
		'attribute vec3 aVertexNormal;',
		'uniform mat4 uMVMatrix;',
		'uniform mat4 uPMatrix;',
		'uniform mat4 uNMatrix;',
		'varying highp vec3 vLighting;',
		'void main (void) {',
		'	highp vec3 ambientLight = vec3 (0.5, 0.5, 0.5);',
		'	highp vec3 directionalLightColor = vec3 (0.5, 0.5, 0.5);',
		'	highp vec3 directionalVector = vec3 (-1, -3, -2);',
		'	highp vec4 transformedNormal = uNMatrix * vec4 (aVertexNormal, 1.0);',
		'	highp float directional = max (dot (transformedNormal.xyz, directionalVector), 0.0);',
		'	vLighting = ambientLight + (directionalLightColor * directional);',
		'	gl_Position = uPMatrix * uMVMatrix * vec4 (aVertexPosition, 1.0);',
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

	this.shader.vertexPositionAttribute = this.context.getAttribLocation (this.shader, "aVertexPosition");
	this.context.enableVertexAttribArray (this.shader.vertexPositionAttribute);

	this.shader.vertexNormalAttribute = this.context.getAttribLocation (this.shader, "aVertexNormal");
	this.context.enableVertexAttribArray (this.shader.vertexNormalAttribute);

	this.shader.pMatrixUniform = this.context.getUniformLocation (this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = this.context.getUniformLocation (this.shader, "uMVMatrix");
	this.shader.nMatrixUniform = this.context.getUniformLocation (this.shader, "uNMatrix");
	return true;
};

JSM.Renderer.prototype.InitBuffers = function ()
{
	this.projectionMatrix = new JSM.RenderMatrix ();
	this.modelViewMatrix = new JSM.RenderMatrix ();
	this.normalMatrix = new JSM.RenderMatrix ();

	this.triangleVertexBuffer = this.context.createBuffer ();
	this.triangleNormalBuffer = this.context.createBuffer ();
	return true;
};

JSM.Renderer.prototype.SetGeometry = function (vertices, normals)
{
	this.context.bindBuffer (this.context.ARRAY_BUFFER, this.triangleVertexBuffer);
	this.context.bufferData (this.context.ARRAY_BUFFER, new Float32Array (vertices), this.context.STATIC_DRAW);
	this.triangleVertexBuffer.itemSize = 3;
	this.triangleVertexBuffer.numItems = parseInt (vertices.length / 3, 10);

	this.context.bindBuffer (this.context.ARRAY_BUFFER, this.triangleNormalBuffer);
	this.context.bufferData (this.context.ARRAY_BUFFER, new Float32Array (normals), this.context.STATIC_DRAW);
	this.triangleNormalBuffer.itemSize = 3;
	this.triangleNormalBuffer.numItems = parseInt (normals.length / 3, 10);
};

JSM.Renderer.prototype.Draw = function ()
{
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	this.projectionMatrix.Perspective (45.0, this.context.viewportWidth / this.context.viewportHeight, 0.1, 100.0);
	this.modelViewMatrix.ModelView (new JSM.Coord (1, 3, 2), new JSM.Coord (0, 0, 0), new JSM.Coord (0, 0, 1));
	this.normalMatrix = this.modelViewMatrix;
	
	this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, this.projectionMatrix.Get ());
	this.context.uniformMatrix4fv (this.shader.mvMatrixUniform, false, this.modelViewMatrix.Get ());
	this.context.uniformMatrix4fv (this.shader.nMatrixUniform, false, this.normalMatrix.Get ());

	this.context.bindBuffer (this.context.ARRAY_BUFFER, this.triangleVertexBuffer);
	this.context.vertexAttribPointer (this.shader.vertexPositionAttribute, this.triangleVertexBuffer.itemSize, this.context.FLOAT, false, 0, 0);

	this.context.bindBuffer (this.context.ARRAY_BUFFER, this.triangleNormalBuffer);
	this.context.vertexAttribPointer (this.shader.vertexNormalAttribute, this.triangleNormalBuffer.itemSize, this.context.FLOAT, false, 0, 0);

	this.context.drawArrays (this.context.TRIANGLES, 0, this.triangleVertexBuffer.numItems);
};
