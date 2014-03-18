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
	var f = 1.0 / Math.tan (fieldOfView / 2.0);
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

JSM.RenderGeometry = function ()
{
	this.material = {};
	this.vertices = [];
	this.normals = [];
	this.compiled = false;
	
	this.vertexBuffer = null;
	this.normalBuffer = null;
	this.vertexArray = null;
	this.normalArray = null;
};

JSM.RenderGeometry.prototype.SetMaterial = function (diffuse)
{
	this.material.diffuse = diffuse;
};

JSM.RenderGeometry.prototype.AddVertex = function (x, y, z)
{
	this.vertices.push (x, y, z);
};

JSM.RenderGeometry.prototype.AddNormal = function (x, y, z)
{
	this.normals.push (x, y, z);
};

JSM.RenderGeometry.prototype.Compile = function (context)
{
	if (this.compiled) {
		return;
	}
	
	this.vertexBuffer = context.createBuffer ();
	this.normalBuffer = context.createBuffer ();

	this.vertexArray = new Float32Array (this.vertices);
	this.normalArray = new Float32Array (this.normals);
	
	context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.vertexArray, context.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = parseInt (this.vertices.length / 3, 10);

	context.bindBuffer (context.ARRAY_BUFFER, this.normalBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.normalArray, context.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = parseInt (this.normals.length / 3, 10);
	
	this.compiled = true;
};

JSM.RenderGeometry.prototype.GetVertexBuffer = function ()
{
	return this.vertexBuffer;
};

JSM.RenderGeometry.prototype.GetNormalBuffer = function ()
{
	return this.normalBuffer;
};

JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	
	this.projectionMatrix = null;
	this.modelViewMatrix = null;
	
	this.eye = null;
	this.center = null;
	this.up = null;
	
	this.geometries = null;
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

	if (!this.InitView ()) {
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
	if (this.canvas === null) {
		return false;
	}
	
	if (this.canvas.getContext === undefined) {
		return false;
	}

	this.context = this.canvas.getContext ('experimental-webgl');
	if (this.context === null) {
		return false;
	}

	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;

	this.context.clearColor (1.0, 1.0, 1.0, 1.0);
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
		'varying highp vec3 vLighting;',
		'uniform highp vec3 uPolygonColor;',
		'void main (void) {',
		'	gl_FragColor = vec4 (uPolygonColor * vLighting, 1.0);',
		'}'
		].join('\n');
	var vertexShaderScript = [
		'attribute highp vec3 aVertexPosition;',
		'attribute highp vec3 aVertexNormal;',
		'uniform highp vec3 uEyePosition;',
		'uniform highp vec3 uAmbientLightColor;',
		'uniform highp vec3 uDirectionalLightColor;',
		'uniform highp vec3 uLightDirection;',
		'uniform highp mat4 uMVMatrix;',
		'uniform highp mat4 uPMatrix;',
		'varying highp vec3 vLighting;',
		'void main (void) {',
		'	highp vec3 directionalVector = normalize (vec3 (uMVMatrix * vec4 (uLightDirection, 0.0)));',
		'	highp vec3 transformedNormal = normalize (vec3 (uMVMatrix * vec4 (aVertexNormal, 0.0)));',
		'	highp float directional = max (dot (transformedNormal, directionalVector), 0.0);',
		'	vLighting = uAmbientLightColor + (uDirectionalLightColor * directional);',
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

	this.shader.vertexPositionAttribute = this.context.getAttribLocation (this.shader, 'aVertexPosition');
	this.context.enableVertexAttribArray (this.shader.vertexPositionAttribute);
	this.shader.vertexNormalAttribute = this.context.getAttribLocation (this.shader, 'aVertexNormal');
	this.context.enableVertexAttribArray (this.shader.vertexNormalAttribute);

	this.shader.ambientLightColorUniform = this.context.getUniformLocation (this.shader, 'uAmbientLightColor');
	this.shader.directionalLightColorUniform = this.context.getUniformLocation (this.shader, 'uDirectionalLightColor');
	this.shader.lightDirectionUniform = this.context.getUniformLocation (this.shader, 'uLightDirection');
	this.shader.polygonColorUniform = this.context.getUniformLocation (this.shader, 'uPolygonColor');

	this.shader.pMatrixUniform = this.context.getUniformLocation (this.shader, 'uPMatrix');
	this.shader.mvMatrixUniform = this.context.getUniformLocation (this.shader, 'uMVMatrix');

	return true;
};

JSM.Renderer.prototype.InitBuffers = function ()
{
	this.projectionMatrix = new JSM.RenderMatrix ();
	this.modelViewMatrix = new JSM.RenderMatrix ();

	this.geometries = [];
	return true;
};

JSM.Renderer.prototype.InitView = function ()
{
	this.eye = new JSM.Coord (1, 3, 2);
	this.center = new JSM.Coord (0, 0, 0);
	this.up = new JSM.Coord (0, 0, 1);

	this.projectionMatrix.Perspective (45.0 * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, 0.1, 1000.0);
	this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, this.projectionMatrix.Get ());

	this.context.uniform3f (this.shader.ambientLightColorUniform, 0.5, 0.5, 0.5);
	this.context.uniform3f (this.shader.directionalLightColorUniform, 0.5, 0.5, 0.5);
	
	return true;
};

JSM.Renderer.prototype.AddGeometries = function (geometries)
{
	var i, currentVertices, currentNormals, currentGeometry;
	for (i = 0; i < geometries.length; i++) {
		this.geometries.push (geometries[i]);
	}
};

JSM.Renderer.prototype.Render = function ()
{
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var lightDirection = JSM.CoordSub (this.eye, this.center);
	this.context.uniform3f (this.shader.lightDirectionUniform, lightDirection.x, lightDirection.y, lightDirection.z);
	
	this.modelViewMatrix.ModelView (this.eye, this.center, this.up);
	this.context.uniformMatrix4fv (this.shader.mvMatrixUniform, false, this.modelViewMatrix.Get ());

	var i, polygonColor, currentGeometry, currentVertexBuffer, currentNormalBuffer;
	for (i = 0; i < this.geometries.length; i++) {
		currentGeometry = this.geometries[i];
		currentGeometry.Compile (this.context);
		
		polygonColor = currentGeometry.material.diffuse;
		this.context.uniform3f (this.shader.polygonColorUniform, polygonColor[0], polygonColor[1], polygonColor[2]);
		
		currentVertexBuffer = currentGeometry.GetVertexBuffer ();
		currentNormalBuffer = currentGeometry.GetNormalBuffer ();
		
		this.context.bindBuffer (this.context.ARRAY_BUFFER, currentVertexBuffer);
		this.context.vertexAttribPointer (this.shader.vertexPositionAttribute, currentVertexBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		
		this.context.bindBuffer (this.context.ARRAY_BUFFER, currentNormalBuffer);
		this.context.vertexAttribPointer (this.shader.vertexNormalAttribute, currentNormalBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		
		this.context.drawArrays (this.context.TRIANGLES, 0, currentVertexBuffer.numItems);
	}
};
