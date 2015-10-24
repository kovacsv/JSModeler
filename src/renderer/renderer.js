JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	this.shaders = null;
	
	this.camera = null;
	this.light = null;
	
	this.geometries = null;
};

JSM.Renderer.prototype.Init = function (canvas, camera, light)
{
	if (!JSM.IsWebGLEnabled ()) {
		return false;
	}

	if (!this.InitContext (canvas)) {
		return false;
	}

	if (!this.InitView (camera, light)) {
		return false;
	}

	if (!this.InitShaders ()) {
		return false;
	}

	if (!this.InitGeometries ()) {
		return false;
	}

	return true;
};

JSM.Renderer.prototype.InitContext = function (canvas)
{
	this.canvas = canvas;
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

	this.context = JSM.WebGLInitContext (canvas);
	if (this.context === null) {
		return false;
	}

	this.context.enable (this.context.DEPTH_TEST);
	this.context.depthFunc (this.context.LEQUAL);
	
	this.context.enable (this.context.BLEND);
	this.context.blendEquation (this.context.FUNC_ADD);
	this.context.blendFunc (this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);
	
	return true;
};

JSM.Renderer.prototype.InitShaders = function ()
{
	function GetFragmentShaderScript (defineString)
	{
		var script = [
			'#define ' + defineString,
			'uniform highp vec3 uPolygonAmbientColor;',
			'uniform highp vec3 uPolygonDiffuseColor;',
			'uniform highp vec3 uPolygonSpecularColor;',
			'uniform highp float uPolygonShininess;',
			'uniform highp float uPolygonOpacity;',
			
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
			'	ambientComponent = ambientComponent * textureColor;',
			'	diffuseComponent = diffuseComponent * textureColor;',
			'	specularComponent = specularComponent * textureColor;',
			'#endif',
			'	ambientComponent = clamp (ambientComponent, 0.0, 1.0);',
			'	diffuseComponent = clamp (diffuseComponent, 0.0, 1.0);',
			'	specularComponent = clamp (specularComponent, 0.0, 1.0);',
			'	gl_FragColor = vec4 (ambientComponent + diffuseComponent + specularComponent, uPolygonOpacity);',
			'}'
		].join('\n');
		return script;
	}
	
	function GetVertexShaderScript (defineString)
	{
		var script = [
			'#define ' + defineString,
			'attribute highp vec3 aVertexPosition;',
			'attribute highp vec3 aVertexNormal;',

			'uniform highp mat4 uViewMatrix;',
			'uniform highp mat4 uProjectionMatrix;',
			'uniform highp mat4 uTransformationMatrix;',
			'uniform highp vec3 uLightDirection;',

			'varying highp vec3 vVertex;',
			'varying highp vec3 vNormal;',
			'varying highp vec3 vLight;',

			'#ifdef USETEXTURE',
			'attribute highp vec2 aVertexUV;',
			'varying highp vec2 vUV;',
			'#endif',

			'void main (void) {',
			'	mat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;',
			'	vVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));',
			'	vNormal = normalize (vec3 (modelViewMatrix * vec4 (aVertexNormal, 0.0)));',
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
		shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');
		shader.tMatrixUniform = context.getUniformLocation (shader, 'uTransformationMatrix');

		shader.polygonAmbientColorUniform = context.getUniformLocation (shader, 'uPolygonAmbientColor');
		shader.polygonDiffuseColorUniform = context.getUniformLocation (shader, 'uPolygonDiffuseColor');
		shader.polygonSpecularColorUniform = context.getUniformLocation (shader, 'uPolygonSpecularColor');
		shader.polygonShininessUniform = context.getUniformLocation (shader, 'uPolygonShininess');
		shader.polygonOpacityUniform = context.getUniformLocation (shader, 'uPolygonOpacity');
	}
	
	function InitMainShader (context)
	{
		var vertexShaderScript = GetVertexShaderScript ('NOTEXTURE');
		var fragmentShaderScript = GetFragmentShaderScript ('NOTEXTURE');
		var shader = JSM.WebGLInitShaderProgram (context, vertexShaderScript, fragmentShaderScript, null);
		if (shader === null) {
			return null;
		}
		
		context.useProgram (shader);
		InitShaderCommon (context, shader);

		return shader;
	}

	function InitTextureShader (context)
	{
		var vertexShaderScript = GetVertexShaderScript ('USETEXTURE');
		var fragmentShaderScript = GetFragmentShaderScript ('USETEXTURE');
		var shader = JSM.WebGLInitShaderProgram (context, vertexShaderScript, fragmentShaderScript, null);
		if (shader === null) {
			return null;
		}
		
		context.useProgram (shader);
		InitShaderCommon (context, shader);

		shader.vertexUVAttribute = context.getAttribLocation (shader, 'aVertexUV');
		shader.samplerUniform = context.getUniformLocation (shader, 'uSampler');

		return shader;
	}

	this.shaders = {
		normal : null,
		texture : null
	};
	
	this.shaders.normal = InitMainShader (this.context);
	if (this.shaders.normal === null) {
		return false;
	}
	
	this.shaders.texture = InitTextureShader (this.context);
	if (this.shaders.texture === null) {
		return false;
	}
	
	return true;
};

JSM.Renderer.prototype.InitGeometries = function ()
{
	this.geometries = {
		normal : {
			opaque : [],
			transparent : []
		},
		texture : {
			opaque : [],
			transparent : []
		}
	};
	return true;
};

JSM.Renderer.prototype.InitView = function (camera, light)
{
	this.camera = JSM.ValueOrDefault (camera, new JSM.Camera ());
	if (!this.camera) {
		return false;
	}

	var theLight = JSM.ValueOrDefault (light, new JSM.Light ());
	this.light = new JSM.RenderLight (theLight.ambient, theLight.diffuse, theLight.specular, theLight.direction);
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
	function CompileMaterial (material, context, textureLoaded)
	{
		if (material.texture !== null) {
			material.textureBuffer = context.createTexture ();
			material.textureImage = new Image ();
			material.textureImage.src = material.texture;
			material.textureImage.onload = function () {
				var textureImage = JSM.ResizeImageToPowerOfTwoSides (material.textureImage);
				context.bindTexture (context.TEXTURE_2D, material.textureBuffer);
				context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
				context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
				context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, textureImage);
				context.generateMipmap (context.TEXTURE_2D);
				context.bindTexture (context.TEXTURE_2D, null);
				material.textureLoaded = true;
				if (textureLoaded !== undefined && textureLoaded !== null) {
					textureLoaded ();
				}
			};
		}
	}
	
	function CompileGeometry (geometry, context)
	{
		geometry.vertexBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, geometry.vertexBuffer);
		context.bufferData (context.ARRAY_BUFFER, geometry.vertexArray, context.STATIC_DRAW);
		geometry.vertexBuffer.itemSize = 3;
		geometry.vertexBuffer.numItems = parseInt (geometry.vertexArray.length / 3, 10);

		geometry.normalBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, geometry.normalBuffer);
		context.bufferData (context.ARRAY_BUFFER, geometry.normalArray, context.STATIC_DRAW);
		geometry.normalBuffer.itemSize = 3;
		geometry.normalBuffer.numItems = parseInt (geometry.normalArray.length / 3, 10);

		if (geometry.uvArray !== null) {
			geometry.uvBuffer = context.createBuffer ();
			context.bindBuffer (context.ARRAY_BUFFER, geometry.uvBuffer);
			context.bufferData (context.ARRAY_BUFFER, geometry.uvArray, context.STATIC_DRAW);
			geometry.uvBuffer.itemSize = 2;
			geometry.uvBuffer.numItems = parseInt (geometry.uvArray.length / 2, 10);
		}
	}

	var i, geometry;
	for (i = 0; i < geometries.length; i++) {
		geometry = geometries[i];
		CompileMaterial (geometry.material, this.context, this.Render.bind (this));
		CompileGeometry (geometry, this.context);
		if (geometry.material.texture !== null) {
			if (geometry.material.opacity < 1.0) {
				this.geometries.texture.transparent.push (geometry);
			} else {
				this.geometries.texture.opaque.push (geometry);
			}
		} else {
			if (geometry.material.opacity < 1.0) {
				this.geometries.normal.transparent.push (geometry);
			} else {
				this.geometries.normal.opaque.push (geometry);
			}
		}
	}
};

JSM.Renderer.prototype.EnumerateGeometries = function (onGeometryFound)
{
	var i;
	for	(i = 0; i < this.geometries.normal.opaque.length; i++) {
		onGeometryFound (this.geometries.normal.opaque[i]);
	}
	for	(i = 0; i < this.geometries.normal.transparent.length; i++) {
		onGeometryFound (this.geometries.normal.transparent[i]);
	}
	for	(i = 0; i < this.geometries.texture.opaque.length; i++) {
		onGeometryFound (this.geometries.texture.opaque[i]);
	}
	for	(i = 0; i < this.geometries.texture.transparent.length; i++) {
		onGeometryFound (this.geometries.texture.transparent[i]);
	}
};

JSM.Renderer.prototype.RemoveGeometries = function ()
{
	this.InitGeometries ();
};

JSM.Renderer.prototype.Resize = function ()
{
	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
};

JSM.Renderer.prototype.Render = function ()
{
	function UseShader (context, shader, light, viewMatrix, projectionMatrix)
	{
		context.useProgram (shader);
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);

		context.uniform3f (shader.lightDirectionUniform, light.direction.x, light.direction.y, light.direction.z);
		context.uniform3f (shader.lightAmbientColorUniform, light.ambient[0], light.ambient[1], light.ambient[2]);
		context.uniform3f (shader.lightDiffuseColorUniform, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
		context.uniform3f (shader.lightSpecularColorUniform, light.specular[0], light.specular[1], light.specular[2]);
	}
	
	function DrawGeometry (context, shader, geometry)
	{
		var material = geometry.material;
		context.uniform3f (shader.polygonAmbientColorUniform, material.ambient[0], material.ambient[1], material.ambient[2]);
		context.uniform3f (shader.polygonDiffuseColorUniform, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		context.uniform3f (shader.polygonSpecularColorUniform, material.specular[0], material.specular[1], material.specular[2]);
		context.uniform1f (shader.polygonShininessUniform, material.shininess);
		context.uniform1f (shader.polygonOpacityUniform, material.opacity);
		
		var matrix = geometry.GetTransformationMatrix ();
		context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);

		var vertexBuffer = geometry.GetVertexBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.enableVertexAttribArray (shader.vertexPositionAttribute);
		context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
		
		var normalBuffer = geometry.GetNormalBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
		context.enableVertexAttribArray (shader.vertexNormalAttribute);
		context.vertexAttribPointer (shader.vertexNormalAttribute, normalBuffer.itemSize, context.FLOAT, false, 0, 0);

		var uvBuffer = geometry.GetUVBuffer ();
		if (uvBuffer !== null) {
			context.activeTexture (context.TEXTURE0);
			context.bindTexture (context.TEXTURE_2D, geometry.material.textureBuffer);
			context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
			context.vertexAttribPointer (shader.vertexUVAttribute, uvBuffer.itemSize, context.FLOAT, false, 0, 0);
			context.enableVertexAttribArray (shader.vertexUVAttribute);
			context.uniform1i (shader.samplerUniform, 0);
		}
		
		context.drawArrays (context.TRIANGLES, 0, vertexBuffer.numItems);
	}
	
	function DrawGeometries (geometries, context, shader, light, viewMatrix, projectionMatrix)
	{
		var i, geometry;
		if (geometries.length > 0) {
			UseShader (context, shader, light, viewMatrix, projectionMatrix);
			for (i = 0; i < geometries.length; i++) {
				geometry = geometries[i];
				DrawGeometry (context, shader, geometry);
			}
		}
	}
	
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var viewMatrix = JSM.MatrixView (this.camera.eye, this.camera.center, this.camera.up);
	var projectionMatrix = JSM.MatrixPerspective (this.camera.fieldOfView * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, this.camera.nearClippingPlane, this.camera.farClippingPlane);
	this.light.direction = JSM.CoordSub (this.camera.center, this.camera.eye).Normalize ();

	DrawGeometries (this.geometries.normal.opaque, this.context, this.shaders.normal, this.light, viewMatrix, projectionMatrix);
	DrawGeometries (this.geometries.texture.opaque, this.context, this.shaders.texture, this.light, viewMatrix, projectionMatrix);
	DrawGeometries (this.geometries.normal.transparent, this.context, this.shaders.normal, this.light, viewMatrix, projectionMatrix);
	DrawGeometries (this.geometries.texture.transparent, this.context, this.shaders.texture, this.light, viewMatrix, projectionMatrix);
};
