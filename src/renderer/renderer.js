JSM.RenderMaterial = function (ambient, diffuse, specular, shininess, texture, textureWidth, textureHeight)
{
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
	this.texture = texture;
	this.textureWidth = textureWidth;
	this.textureHeight = textureHeight;
	
	this.textureBuffer = null;
	this.textureImage = null;
	this.textureLoaded = false;
};

JSM.RenderMaterial.prototype.HasTexture = function ()
{
	return this.texture !== null && this.textureLoaded;
};

JSM.RenderMaterial.prototype.Compile = function (context, textureLoaded)
{
	if (this.texture !== null) {
		var myThis = this;
		this.textureBuffer = context.createTexture ();
		this.textureImage = new Image ();
		this.textureImage.src = this.texture;
		this.textureImage.onload = function () {
			context.bindTexture (context.TEXTURE_2D, myThis.textureBuffer);
			context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, myThis.textureImage);
			context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
			context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
			context.generateMipmap (context.TEXTURE_2D);
			context.bindTexture (context.TEXTURE_2D, null);
			myThis.textureLoaded = true;
			if (textureLoaded !== undefined && textureLoaded !== null) {
				textureLoaded ();
			}
		};
	}
};

JSM.RenderGeometry = function ()
{
	this.transformation = new JSM.Transformation ();

	this.material = null;
	
	this.vertexArray = null;
	this.normalArray = null;
	this.uvArray = null;
	
	this.vertexBuffer = null;
	this.normalBuffer = null;
	this.uvBuffer = null;
};

JSM.RenderGeometry.prototype.SetMaterial = function (material)
{
	this.material = material;
};

JSM.RenderGeometry.prototype.GetMaterial = function ()
{
	return this.material;
};

JSM.RenderGeometry.prototype.SetVertexArray = function (vertices)
{
	this.vertexArray = new Float32Array (vertices);
};

JSM.RenderGeometry.prototype.SetNormalArray = function (normals)
{
	this.normalArray = new Float32Array (normals);
};

JSM.RenderGeometry.prototype.SetUVArray = function (uvs)
{
	this.uvArray = new Float32Array (uvs);
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

JSM.RenderGeometry.prototype.GetUVBuffer = function ()
{
	return this.uvBuffer;
};

JSM.RenderGeometry.prototype.VertexCount = function ()
{
	return parseInt (this.vertexArray.length / 3, 10);
};

JSM.RenderGeometry.prototype.GetVertex = function (index)
{
	return new JSM.Coord (this.vertexArray[3 * index], this.vertexArray[3 * index + 1], this.vertexArray[3 * index + 2]);
};

JSM.RenderGeometry.prototype.GetTransformedVertex = function (index)
{
	var vertex = this.GetVertex (index);
	return this.transformation.Apply (vertex);
};

JSM.RenderGeometry.prototype.Compile = function (context, textureLoaded)
{
	this.material.Compile (context, textureLoaded);

	this.vertexBuffer = context.createBuffer ();
	context.bindBuffer (context.ARRAY_BUFFER, this.vertexBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.vertexArray, context.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = parseInt (this.vertexArray.length / 3, 10);

	this.normalBuffer = context.createBuffer ();
	context.bindBuffer (context.ARRAY_BUFFER, this.normalBuffer);
	context.bufferData (context.ARRAY_BUFFER, this.normalArray, context.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = parseInt (this.normalArray.length / 3, 10);

	if (this.uvArray !== null) {
		this.uvBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, this.uvBuffer);
		context.bufferData (context.ARRAY_BUFFER, this.uvArray, context.STATIC_DRAW);
		this.uvBuffer.itemSize = 2;
		this.uvBuffer.numItems = parseInt (this.uvArray.length / 2, 10);
	}
};

JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	this.texShader = null;
	
	this.camera = null;
	this.light = null;
	
	this.geometries = null;
};

JSM.Renderer.prototype.Init = function (canvasName, camera, light)
{
	if (!this.InitContext (canvasName)) {
		return false;
	}

	if (!this.InitView (camera, light)) {
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
	if (this.canvas === null) {
		return false;
	}
	
	if (this.canvas.getContext === undefined) {
		return false;
	}

	this.context = this.canvas.getContext ('webgl') || this.canvas.getContext ('experimental-webgl');
	if (this.context === null) {
		return false;
	}

	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
	
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);

	this.context.clearColor (1.0, 1.0, 1.0, 1.0);
	
	this.context.enable (this.context.DEPTH_TEST);
	this.context.depthFunc (this.context.LEQUAL);
	
	this.context.enable (this.context.BLEND);
	this.context.blendEquation (this.context.FUNC_ADD);
	this.context.blendFunc (this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);
	
	return true;
};

JSM.Renderer.prototype.InitShaders = function ()
{
	function CompileShader (context, script, type)
	{
		var shader = context.createShader (type);
		context.shaderSource (shader, script);
		context.compileShader (shader);
		if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
			return null;
		}
		return shader;
	}
	
	function CreateShader (context, fragmentShaderScript, vertexShaderScript)
	{
		var fragmentShader = CompileShader (context, fragmentShaderScript, context.FRAGMENT_SHADER);
		var vertexShader = CompileShader (context, vertexShaderScript, context.VERTEX_SHADER);
		if (fragmentShader === null || vertexShader === null) {
			return null;
		}

		var shader = context.createProgram ();
		context.attachShader (shader, vertexShader);
		context.attachShader (shader, fragmentShader);
		context.linkProgram (shader);
		if (!context.getProgramParameter (shader, context.LINK_STATUS)) {
			return null;
		}
		
		return shader;
	}
	
	function GetFragmentShaderScript (isTextureShader)
	{
		var defineString = '';
		if (isTextureShader) {
			defineString = '#define USETEXTURE';
		}
		
		var script = [
			defineString,
			'uniform highp vec3 uPolygonAmbientColor;',
			'uniform highp vec3 uPolygonDiffuseColor;',
			'uniform highp vec3 uPolygonSpecularColor;',
			'uniform highp float uPolygonShininess;',
			
			'uniform highp vec3 uLightAmbientColor;',
			'uniform highp vec3 uLightDiffuseColor;',
			'uniform highp vec3 uLightSpecularColor;',

			'varying highp vec3 vVertex;',
			'varying highp vec3 vNormal;',
			'varying highp vec3 vLight;',
			
			'#ifdef USETEXTURE',
			'varying highp vec2 vUV;',
			'uniform sampler2D uSampler;',
			'#endif',
			
			'void main (void) {',
			'	highp vec3 N = normalize (vNormal);',
			'	if (!gl_FrontFacing) {',
			'		N = -N;',
			'	}',
			'	highp vec3 L = normalize (-vLight);',
			'	highp vec3 E = normalize (-vVertex);',
			'	highp vec3 R = normalize (-reflect (L, N));',
			'	highp vec3 ambientComponent = uPolygonAmbientColor * uLightAmbientColor;',
			'	highp vec3 diffuseComponent = uPolygonDiffuseColor * uLightDiffuseColor * max (dot (N, L), 0.0);',
			'	highp vec3 specularComponent = uPolygonSpecularColor * uLightSpecularColor * pow (max (dot (R, E), 0.0), uPolygonShininess);',
			'#ifdef USETEXTURE',
			'	highp vec3 textureColor = texture2D (uSampler, vec2 (vUV.s, vUV.t)).xyz;',
			'	ambientComponent = textureColor * ambientComponent;',
			'	diffuseComponent = textureColor * diffuseComponent;',
			'	specularComponent = textureColor * specularComponent;',
			'#endif',
			'	ambientComponent = clamp (ambientComponent, 0.0, 1.0);',
			'	diffuseComponent = clamp (diffuseComponent, 0.0, 1.0);',
			'	specularComponent = clamp (specularComponent, 0.0, 1.0);',
			'	gl_FragColor = vec4 (ambientComponent + diffuseComponent + specularComponent, 1.0);',
			'}'
		].join('\n');
		return script;
	}
	
	function GetVertexShaderScript (isTextureShader)
	{
		var defineString = '';
		if (isTextureShader) {
			defineString = '#define USETEXTURE';
		}
		
		var script = [
			defineString,
			'attribute highp vec3 aVertexPosition;',
			'attribute highp vec3 aVertexNormal;',

			'uniform highp mat4 uViewMatrix;',
			'uniform highp mat4 uModelViewMatrix;',
			'uniform highp mat4 uProjectionMatrix;',
			'uniform highp vec3 uLightDirection;',

			'varying highp vec3 vVertex;',
			'varying highp vec3 vNormal;',
			'varying highp vec3 vLight;',

			'#ifdef USETEXTURE',
			'attribute highp vec2 aVertexUV;',
			'varying highp vec2 vUV;',
			'#endif',

			'void main (void) {',
			'	vVertex = vec3 (uModelViewMatrix * vec4 (aVertexPosition, 1.0));',
			'	vNormal = normalize (vec3 (uModelViewMatrix * vec4 (aVertexNormal, 0.0)));',
			'	vLight = normalize (vec3 (uViewMatrix * vec4 (uLightDirection, 0.0)));',
			'#ifdef USETEXTURE',
			'	vUV = aVertexUV;',
			'#endif',
			'	gl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);',
			'}'
		].join('\n');
		return script;
	}

	function InitShaderCommon (context, shader)
	{
		shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');
		shader.vertexNormalAttribute = context.getAttribLocation (shader, 'aVertexNormal');

		shader.lightAmbientColorUniform = context.getUniformLocation (shader, 'uLightAmbientColor');
		shader.lightDiffuseColorUniform = context.getUniformLocation (shader, 'uLightDiffuseColor');
		shader.lightSpecularColorUniform = context.getUniformLocation (shader, 'uLightSpecularColor');
		shader.lightDirectionUniform = context.getUniformLocation (shader, 'uLightDirection');
		
		shader.vMatrixUniform = context.getUniformLocation (shader, 'uViewMatrix');
		shader.mvMatrixUniform = context.getUniformLocation (shader, 'uModelViewMatrix');
		shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');

		shader.polygonAmbientColorUniform = context.getUniformLocation (shader, 'uPolygonAmbientColor');
		shader.polygonDiffuseColorUniform = context.getUniformLocation (shader, 'uPolygonDiffuseColor');
		shader.polygonSpecularColorUniform = context.getUniformLocation (shader, 'uPolygonSpecularColor');
		shader.polygonShininessUniform = context.getUniformLocation (shader, 'uPolygonShininess');
	}
	
	function InitMainShader (context)
	{
		var fragmentShaderScript = GetFragmentShaderScript (false);
		var vertexShaderScript = GetVertexShaderScript (false);
		var shader = CreateShader (context, fragmentShaderScript, vertexShaderScript);
		if (shader === null) {
			return null;
		}
		
		context.useProgram (shader);
		InitShaderCommon (context, shader);

		return shader;
	}

	function InitTextureShader (context)
	{
		var fragmentShaderScript = GetFragmentShaderScript (true);
		var vertexShaderScript = GetVertexShaderScript (true);
		var shader = CreateShader (context, fragmentShaderScript, vertexShaderScript);
		if (shader === null) {
			return null;
		}
		
		context.useProgram (shader);
		InitShaderCommon (context, shader);

		shader.vertexUVAttribute = context.getAttribLocation (shader, 'aVertexUV');
		shader.samplerUniform = context.getUniformLocation (shader, 'uSampler');

		return shader;
	}

	this.shader = InitMainShader (this.context);
	if (this.shader === null) {
		return false;
	}
	
	this.texShader = InitTextureShader (this.context);
	if (this.texShader === null) {
		return false;
	}
	
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
	
	return true;
};

JSM.Renderer.prototype.SetClearColor = function (red, green, blue)
{
	this.context.clearColor (red, green, blue, 1.0);
};

JSM.Renderer.prototype.AddGeometries = function (geometries)
{
	var i, currentGeometry;
	for (i = 0; i < geometries.length; i++) {
		currentGeometry = geometries[i];
		currentGeometry.Compile (this.context, this.Render.bind (this));
		this.geometries.push (currentGeometry);
	}
};

JSM.Renderer.prototype.RemoveGeometries = function ()
{
	this.geometries = [];
};

JSM.Renderer.prototype.Resize = function ()
{
	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
};

JSM.Renderer.prototype.Render = function ()
{
	function GetShader (renderer, geometry)
	{
		if (geometry.GetMaterial ().HasTexture ()) {
			return renderer.texShader;
		}
		return renderer.shader;
	}

	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var projectionMatrix = JSM.MatrixPerspective (this.camera.fieldOfView * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, this.camera.nearClippingPlane, this.camera.farClippingPlane);
	var viewMatrix = JSM.MatrixView (this.camera.eye, this.camera.center, this.camera.up);
	var modelViewMatrix = JSM.MatrixIdentity ();

	var lightAmbient = JSM.HexColorToNormalizedRGBComponents (this.light.ambient);
	var lightDiffuse = JSM.HexColorToNormalizedRGBComponents (this.light.diffuse);
	var lightSpecular = JSM.HexColorToNormalizedRGBComponents (this.light.specular);
	this.light.direction = JSM.VectorNormalize (JSM.CoordSub (this.camera.center, this.camera.eye));

	var i, ambientColor, diffuseColor, specularColor, shininess;
	var currentGeometry, currentVertexBuffer, currentNormalBuffer, currentUVBuffer;
	var currentShader, newShader;
	for (i = 0; i < this.geometries.length; i++) {
		currentGeometry = this.geometries[i];
		newShader = GetShader (this, currentGeometry);
		
		if (currentShader != newShader) {
			currentShader = newShader;
			this.context.useProgram (currentShader);
			this.context.uniformMatrix4fv (currentShader.pMatrixUniform, false, projectionMatrix);
			this.context.uniformMatrix4fv (currentShader.vMatrixUniform, false, viewMatrix);

			this.context.uniform3f (currentShader.lightDirectionUniform, this.light.direction.x, this.light.direction.y, this.light.direction.z);
			this.context.uniform3f (currentShader.lightAmbientColorUniform, lightAmbient[0], lightAmbient[1], lightAmbient[2]);
			this.context.uniform3f (currentShader.lightDiffuseColorUniform, lightDiffuse[0], lightDiffuse[1], lightDiffuse[2]);
			this.context.uniform3f (currentShader.lightSpecularColorUniform, lightSpecular[0], lightSpecular[1], lightSpecular[2]);
		}
		
		ambientColor = currentGeometry.material.ambient;
		diffuseColor = currentGeometry.material.diffuse;
		specularColor = currentGeometry.material.specular;
		shininess = currentGeometry.material.shininess;
		this.context.uniform3f (currentShader.polygonAmbientColorUniform, ambientColor[0], ambientColor[1], ambientColor[2]);
		this.context.uniform3f (currentShader.polygonDiffuseColorUniform, diffuseColor[0], diffuseColor[1], diffuseColor[2]);
		this.context.uniform3f (currentShader.polygonSpecularColorUniform, specularColor[0], specularColor[1], specularColor[2]);
		this.context.uniform1f (currentShader.polygonShininessUniform, shininess);
		
		if (currentShader == this.texShader) {
			currentUVBuffer = currentGeometry.GetUVBuffer ();
			this.context.activeTexture (this.context.TEXTURE0);
			this.context.bindTexture (this.context.TEXTURE_2D, currentGeometry.material.textureBuffer);
			this.context.bindBuffer (this.context.ARRAY_BUFFER, currentUVBuffer);
			this.context.vertexAttribPointer (currentShader.vertexUVAttribute, currentUVBuffer.itemSize, this.context.FLOAT, false, 0, 0);
			this.context.enableVertexAttribArray (currentShader.vertexUVAttribute);
			this.context.uniform1i (currentShader.samplerUniform, 0);
		}

		modelViewMatrix = JSM.MatrixMultiply (currentGeometry.GetTransformationMatrix (), viewMatrix);
		this.context.uniformMatrix4fv (currentShader.mvMatrixUniform, false, modelViewMatrix);

		currentVertexBuffer = currentGeometry.GetVertexBuffer ();
		
		this.context.bindBuffer (this.context.ARRAY_BUFFER, currentVertexBuffer);
		this.context.enableVertexAttribArray (currentShader.vertexPositionAttribute);
		this.context.vertexAttribPointer (currentShader.vertexPositionAttribute, currentVertexBuffer.itemSize, this.context.FLOAT, false, 0, 0);
		
		currentNormalBuffer = currentGeometry.GetNormalBuffer ();
		this.context.bindBuffer (this.context.ARRAY_BUFFER, currentNormalBuffer);
		this.context.enableVertexAttribArray (currentShader.vertexNormalAttribute);
		this.context.vertexAttribPointer (currentShader.vertexNormalAttribute, currentNormalBuffer.itemSize, this.context.FLOAT, false, 0, 0);

		this.context.drawArrays (this.context.TRIANGLES, 0, currentVertexBuffer.numItems);
	}
};
