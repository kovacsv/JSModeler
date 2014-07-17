JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	
	this.camera = null;
	this.geometries = null;
};

JSM.Renderer.prototype.Init = function (canvasName, settings)
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

	if (!this.InitSettings (settings)) {
		return false;
	}

	if (!this.InitView ()) {
		return false;
	}

	return true;
};

JSM.Renderer.prototype.InitSettings = function (settings)
{
	this.settings = {
		cameraEyePosition : new JSM.Coord (1.0, 1.0, 1.0),
		cameraCenterPosition : new JSM.Coord (0.0, 0.0, 0.0),
		cameraUpVector : new JSM.Coord (0.0, 0.0, 1.0),
		fieldOfView : 45.0,
		nearClippingPlane : 0.1,
		farClippingPlane : 1000.0,
		lightAmbientColor : [0.5, 0.5, 0.5],
		lightDiffuseColor : [0.5, 0.5, 0.5]
	};

	if (settings !== undefined) {
		if (settings.cameraEyePosition !== undefined) { this.settings.cameraEyePosition = settings.cameraEyePosition; }
		if (settings.cameraCenterPosition !== undefined) { this.settings.cameraCenterPosition = settings.cameraCenterPosition; }
		if (settings.cameraUpVector !== undefined) { this.settings.cameraUpVector = settings.cameraUpVector; }
		if (settings.fieldOfView !== undefined) { this.settings.fieldOfView = settings.fieldOfView; }
		if (settings.nearClippingPlane !== undefined) { this.settings.nearClippingPlane = settings.nearClippingPlane; }
		if (settings.farClippingPlane !== undefined) { this.settings.farClippingPlane = settings.farClippingPlane; }
		if (settings.lightAmbientColor !== undefined) { this.settings.lightAmbientColor = settings.lightAmbientColor; }
		if (settings.lightDiffuseColor !== undefined) { this.settings.lightDiffuseColor = settings.lightDiffuseColor; }
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

JSM.Renderer.prototype.InitView = function ()
{
	this.camera = new JSM.Camera (this.settings.cameraEyePosition, this.settings.cameraCenterPosition, this.settings.cameraUpVector);

	this.context.uniform3f (this.shader.ambientLightColorUniform, this.settings.lightAmbientColor[0], this.settings.lightAmbientColor[1], this.settings.lightAmbientColor[2]);
	this.context.uniform3f (this.shader.directionalLightColorUniform, this.settings.lightDiffuseColor[0], this.settings.lightDiffuseColor[1], this.settings.lightDiffuseColor[2]);
	
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
	
	var lightDirection = JSM.CoordSub (this.camera.eye, this.camera.center);
	this.context.uniform3f (this.shader.lightDirectionUniform, lightDirection.x, lightDirection.y, lightDirection.z);
	
	var projectionMatrix = JSM.MatrixPerspective (this.settings.fieldOfView * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, this.settings.nearClippingPlane, this.settings.farClippingPlane);
	this.context.uniformMatrix4fv (this.shader.pMatrixUniform, false, projectionMatrix);

	var viewMatrix = JSM.MatrixView (this.camera.eye, this.camera.center, this.camera.up);
	var modelViewMatrix = JSM.MatrixIdentity ();
	
	var i, ambientColor, diffuseColor, currentGeometry, currentVertexBuffer, currentNormalBuffer;
	for (i = 0; i < this.geometries.length; i++) {
		currentGeometry = this.geometries[i];
	
		modelViewMatrix = JSM.MatrixMultiply (currentGeometry.GetTransformation (), viewMatrix);
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
