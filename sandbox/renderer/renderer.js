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
	this.projectionMatrix = JSM.MatrixIdentity ();
	this.viewMatrix = JSM.MatrixIdentity ();

	this.geometries = [];
	return true;
};

JSM.Renderer.prototype.InitView = function ()
{
	this.eye = new JSM.Coord (1, 3, 2);
	this.center = new JSM.Coord (0, 0, 0);
	this.up = new JSM.Coord (0, 0, 1);

	this.projectionMatrix = JSM.MatrixPerspective (45.0 * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, 0.1, 1000.0);
	this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, this.projectionMatrix);

	this.context.uniform3f (this.shader.ambientLightColorUniform, 0.5, 0.5, 0.5);
	this.context.uniform3f (this.shader.directionalLightColorUniform, 0.5, 0.5, 0.5);
	
	return true;
};

JSM.Renderer.prototype.AddGeometries = function (geometries)
{
	var i, currentGeometry;
	for (i = 0; i < geometries.length; i++) {
		currentGeometry = geometries[i];
		currentGeometry.Compile (this.context);
		this.geometries.push (currentGeometry);
	}
};

JSM.Renderer.prototype.Render = function ()
{
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var lightDirection = JSM.CoordSub (this.eye, this.center);
	this.context.uniform3f (this.shader.lightDirectionUniform, lightDirection.x, lightDirection.y, lightDirection.z);
	
	this.viewMatrix = JSM.MatrixView (this.eye, this.center, this.up);
	var modelViewMatrix = JSM.MatrixIdentity ();
	
	var i, polygonColor, currentGeometry, currentVertexBuffer, currentNormalBuffer;
	for (i = 0; i < this.geometries.length; i++) {
		currentGeometry = this.geometries[i];
	
		modelViewMatrix = JSM.MatrixMultiply (currentGeometry.GetTransformation (), this.viewMatrix);
		this.context.uniformMatrix4fv (this.shader.vMatrixUniform, false, this.viewMatrix);
		this.context.uniformMatrix4fv (this.shader.mvMatrixUniform, false, modelViewMatrix);

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
