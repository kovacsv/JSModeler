JSM.RenderMatrix = function ()
{
	this.matrix = new Float32Array (16);
};

JSM.RenderMatrix.prototype.Get = function ()
{
	return this.matrix;
};

JSM.RenderMatrix.prototype.Set = function (matrix)
{
	this.matrix[0] = matrix[0];
	this.matrix[1] = matrix[1];
	this.matrix[2] = matrix[2];
	this.matrix[3] = matrix[3];
	this.matrix[4] = matrix[4];
	this.matrix[5] = matrix[5];
	this.matrix[6] = matrix[6];
	this.matrix[7] = matrix[7];
	this.matrix[8] = matrix[8];
	this.matrix[9] = matrix[9];
	this.matrix[10] = matrix[10];
	this.matrix[11] = matrix[11];
	this.matrix[12] = matrix[12];
	this.matrix[13] = matrix[13];
	this.matrix[14] = matrix[14];
	this.matrix[15] = matrix[15];
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

JSM.RenderMatrix.prototype.Clone = function ()
{
	var result = new JSM.RenderMatrix ();
	result.Set (this.matrix);
	return result;
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

JSM.RenderMatrix.prototype.RotationX = function (angle)
{
	var si = Math.sin (angle);
	var co = Math.cos (angle);

    this.matrix[0] = co;
    this.matrix[1] = 0.0;
    this.matrix[2] = si;
    this.matrix[3] = 0.0;
    this.matrix[4] = 0.0;
    this.matrix[5] = 1.0;
    this.matrix[6] = 0.0;
    this.matrix[7] = 0.0;
    this.matrix[8] = -si;
    this.matrix[9] = 0.0;
    this.matrix[10] = co;
    this.matrix[11] = 0.0;
    this.matrix[12] = 0.0;
    this.matrix[13] = 0.0;
    this.matrix[14] = 0.0;
    this.matrix[15] = 1.0;
};

JSM.RenderMatrixMultiply = function (a, b, result)
{
	var aMatrix = a.Get ();
	var bMatrix = b.Get ();
	var resultMatrix = result.Get ();
	
    var a00 = aMatrix[0];
	var a01 = aMatrix[1];
	var a02 = aMatrix[2];
	var a03 = aMatrix[3];
	var a10 = aMatrix[4];
	var a11 = aMatrix[5];
	var a12 = aMatrix[6];
	var a13 = aMatrix[7];
	var a20 = aMatrix[8];
	var a21 = aMatrix[9];
	var a22 = aMatrix[10];
	var a23 = aMatrix[11];
	var a30 = aMatrix[12];
	var a31 = aMatrix[13];
	var a32 = aMatrix[14];
	var a33 = aMatrix[15];

    var b00 = bMatrix[0];
	var b01 = bMatrix[1];
	var b02 = bMatrix[2];
	var b03 = bMatrix[3];
	var b10 = bMatrix[4];
	var b11 = bMatrix[5];
	var b12 = bMatrix[6];
	var b13 = bMatrix[7];
	var b20 = bMatrix[8];
	var b21 = bMatrix[9];
	var b22 = bMatrix[10];
	var b23 = bMatrix[11];
	var b30 = bMatrix[12];
	var b31 = bMatrix[13];
	var b32 = bMatrix[14];
	var b33 = bMatrix[15];

    resultMatrix[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    resultMatrix[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    resultMatrix[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    resultMatrix[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    resultMatrix[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    resultMatrix[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    resultMatrix[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    resultMatrix[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    resultMatrix[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    resultMatrix[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    resultMatrix[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    resultMatrix[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    resultMatrix[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    resultMatrix[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    resultMatrix[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    resultMatrix[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
};

JSM.RenderGeometry = function ()
{
	this.material = {};
	this.vertices = [];
	this.normals = [];

	this.transformation = new JSM.RenderMatrix ();
	this.transformation.Identity ();

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

JSM.RenderGeometry.prototype.GetTransformation = function ()
{
	return this.transformation;
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
	this.viewMatrix = null;
	
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
		'uniform highp mat4 uViewMatrix;',
		'uniform highp mat4 uModelViewMatrix;',
		'uniform highp mat4 uProjectionMatrix;',
		'varying highp vec3 vLighting;',
		'void main (void) {',
		'	highp vec3 directionalVector = normalize (vec3 (uViewMatrix * vec4 (uLightDirection, 0.0)));',
		'	highp vec3 transformedNormal = normalize (vec3 (uModelViewMatrix * vec4 (aVertexNormal, 0.0)));',
		'	highp float directional = max (dot (transformedNormal, directionalVector), 0.0);',
		'	vLighting = uAmbientLightColor + (uDirectionalLightColor * directional);',
		'	gl_Position = uProjectionMatrix * uModelViewMatrix * vec4 (aVertexPosition, 1.0);',
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

	this.shader.pMatrixUniform = this.context.getUniformLocation (this.shader, 'uProjectionMatrix');
	this.shader.vMatrixUniform = this.context.getUniformLocation (this.shader, 'uViewMatrix');
	this.shader.mvMatrixUniform = this.context.getUniformLocation (this.shader, 'uModelViewMatrix');

	return true;
};

JSM.Renderer.prototype.InitBuffers = function ()
{
	this.projectionMatrix = new JSM.RenderMatrix ();
	this.viewMatrix = new JSM.RenderMatrix ();

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
	
	this.viewMatrix.ModelView (this.eye, this.center, this.up);
	var modelViewMatrix = new JSM.RenderMatrix ();
	
	var i, polygonColor, currentGeometry, currentVertexBuffer, currentNormalBuffer;
	for (i = 0; i < this.geometries.length; i++) {
		currentGeometry = this.geometries[i];
		currentGeometry.Compile (this.context);
		
		JSM.RenderMatrixMultiply (this.viewMatrix, currentGeometry.GetTransformation (), modelViewMatrix);
		this.context.uniformMatrix4fv (this.shader.vMatrixUniform, false, this.viewMatrix.Get ());
		this.context.uniformMatrix4fv (this.shader.mvMatrixUniform, false, modelViewMatrix.Get ());

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
