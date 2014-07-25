JSM.RenderGeometry = function ()
{
	this.material = {};

	this.transformation = new JSM.Transformation ();

	this.vertexArray = null;
	this.normalArray = null;
	this.vertexBuffer = null;
	this.normalBuffer = null;
};

JSM.RenderGeometry.prototype.SetMaterial = function (ambient, diffuse)
{
	this.material.ambient = ambient;
	this.material.diffuse = diffuse;
};

JSM.RenderGeometry.prototype.SetVertexArray = function (vertices)
{
	this.vertexArray = new Float32Array (vertices);
};

JSM.RenderGeometry.prototype.SetNormalArray = function (normals)
{
	this.normalArray = new Float32Array (normals);
};

JSM.RenderGeometry.prototype.GetTransformation = function ()
{
	return this.transformation;
};

JSM.RenderGeometry.prototype.GetTransformationMatrix = function ()
{
	return this.transformation.matrix;
};

JSM.RenderGeometry.prototype.SetTransformation = function (transformation)
{
	this.transformation = transformation;
};

JSM.RenderGeometry.prototype.GetVertexBuffer = function ()
{
	return this.vertexBuffer;
};

JSM.RenderGeometry.prototype.GetNormalBuffer = function ()
{
	return this.normalBuffer;
};

JSM.RenderGeometry.prototype.Compile = function (context)
{
	this.vertexBuffer = context.createBuffer ();
	this.normalBuffer = context.createBuffer ();
	
	context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.vertexArray, context.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = parseInt (this.vertexArray.length / 3, 10);

	context.bindBuffer (context.ARRAY_BUFFER, this.normalBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.normalArray, context.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = parseInt (this.normalArray.length / 3, 10);
};

JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	
	this.camera = null;
	this.light = null;
	
	this.geometries = null;
};

JSM.Renderer.prototype.Init = function (canvasName, camera, light)
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

	if (!this.InitView (camera, light)) {
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
		'uniform highp vec3 uAmbientLightColor;',
		'uniform highp vec3 uDirectionalLightColor;',
		'uniform highp vec3 uLightDirection;',

		'uniform highp mat4 uViewMatrix;',
		'uniform highp mat4 uModelViewMatrix;',

		'uniform highp vec3 uPolygonAmbientColor;',
		'uniform highp vec3 uPolygonDiffuseColor;',

		'varying highp vec3 vNormal;',
		
		'void main (void) {',
		'	highp vec3 transformedNormal = normalize (vec3 (uModelViewMatrix * vec4 (vNormal, 0.0)));',
		'	highp vec3 directionalVector = normalize (vec3 (uViewMatrix * vec4 (uLightDirection, 0.0)));',
		'	highp vec3 ambientComponent = uPolygonAmbientColor * uAmbientLightColor;',
		'	highp vec3 diffuseComponent = uPolygonDiffuseColor * uDirectionalLightColor * max (dot (transformedNormal, directionalVector), 0.0);',
		'	gl_FragColor = vec4 ((ambientComponent + diffuseComponent), 1.0);',
		'}'
		].join('\n');
	
	var vertexShaderScript = [
		'attribute highp vec3 aVertexPosition;',
		'attribute highp vec3 aVertexNormal;',

		'uniform highp mat4 uModelViewMatrix;',
		'uniform highp mat4 uProjectionMatrix;',

		'varying highp vec3 vNormal;',

		'void main (void) {',
		'	vNormal = aVertexNormal;',
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

	this.shader.pMatrixUniform = this.context.getUniformLocation (this.shader, 'uProjectionMatrix');
	this.shader.vMatrixUniform = this.context.getUniformLocation (this.shader, 'uViewMatrix');
	this.shader.mvMatrixUniform = this.context.getUniformLocation (this.shader, 'uModelViewMatrix');

	this.shader.polygonAmbientColorUniform = this.context.getUniformLocation (this.shader, 'uPolygonAmbientColor');
	this.shader.polygonDiffuseColorUniform = this.context.getUniformLocation (this.shader, 'uPolygonDiffuseColor');
	
	return true;
};

JSM.Renderer.prototype.InitBuffers = function ()
{
	this.geometries = [];
	return true;
};

JSM.Renderer.prototype.InitView = function (camera, light)
{
	this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
	if (!this.camera) {
		return false;
	}

	this.light = JSM.ValueOrDefault (light, new JSM.Light ());
	if (!this.light) {
		return false;
	}
	
	var lightAmbient = JSM.HexColorToNormalizedRGBComponents (this.light.ambient);
	var lightDiffuse = JSM.HexColorToNormalizedRGBComponents (this.light.diffuse);
	this.context.uniform3f (this.shader.ambientLightColorUniform, lightAmbient[0], lightAmbient[1], lightAmbient[2]);
	this.context.uniform3f (this.shader.directionalLightColorUniform, lightDiffuse[0], lightDiffuse[1], lightDiffuse[2]);
	
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

JSM.Renderer.prototype.Resize = function ()
{
	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
};

JSM.Renderer.prototype.Render = function ()
{
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	this.light.direction = JSM.CoordSub (this.camera.eye, this.camera.center);
	this.context.uniform3f (this.shader.lightDirectionUniform, this.light.direction.x, this.light.direction.y, this.light.direction.z);
	
	var projectionMatrix = JSM.MatrixPerspective (this.camera.fieldOfView * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, this.camera.nearClippingPlane, this.camera.farClippingPlane);
	this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, projectionMatrix);

	var viewMatrix = JSM.MatrixView (this.camera.eye, this.camera.center, this.camera.up);
	var modelViewMatrix = JSM.MatrixIdentity ();
	
	var i, ambientColor, diffuseColor, currentGeometry, currentVertexBuffer, currentNormalBuffer;
	for (i = 0; i < this.geometries.length; i++) {
		currentGeometry = this.geometries[i];
		
		modelViewMatrix = JSM.MatrixMultiply (currentGeometry.GetTransformationMatrix (), viewMatrix);
		this.context.uniformMatrix4fv (this.shader.vMatrixUniform, false, viewMatrix);
		this.context.uniformMatrix4fv (this.shader.mvMatrixUniform, false, modelViewMatrix);

		ambientColor = currentGeometry.material.ambient;
		diffuseColor = currentGeometry.material.diffuse;
		this.context.uniform3f (this.shader.polygonAmbientColorUniform, ambientColor[0], ambientColor[1], ambientColor[2]);
		this.context.uniform3f (this.shader.polygonDiffuseColorUniform, diffuseColor[0], diffuseColor[1], diffuseColor[2]);
		
		currentVertexBuffer = currentGeometry.GetVertexBuffer ();
		currentNormalBuffer = currentGeometry.GetNormalBuffer ();
		
		this.context.bindBuffer (this.context.ARRAY_BUFFER, currentVertexBuffer);
		this.context.vertexAttribPointer (this.shader.vertexPositionAttribute, currentVertexBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		
		this.context.bindBuffer (this.context.ARRAY_BUFFER, currentNormalBuffer);
		this.context.vertexAttribPointer (this.shader.vertexNormalAttribute, currentNormalBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		
		this.context.drawArrays (this.context.TRIANGLES, 0, currentVertexBuffer.numItems);
	}
};
