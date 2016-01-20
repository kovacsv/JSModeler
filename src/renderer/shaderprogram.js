JSM.ShaderType = {
	Triangle : 0,
	TexturedTriangle : 1,
	Line : 2
};

JSM.ShaderProgram = function (context)
{
	this.context = context;
	this.globalParams = null;
	this.shaders = null;
	this.currentShader = null;
	this.currentType = null;
	this.cullEnabled = null;
};

JSM.ShaderProgram.prototype.Init = function ()
{
	if (!this.InitGlobalParams ()) {
		return false;
	}
	
	if (!this.InitShaders ()) {
		return false;
	}
	
	return true;	
};

JSM.ShaderProgram.prototype.GetMaxLightCount = function ()
{
	return this.globalParams.maxLightCount;
};

JSM.ShaderProgram.prototype.InitGlobalParams = function ()
{
	var defaultLight = new JSM.RenderLight (0x000000, 0x000000, 0x000000, new JSM.Vector (0.0, 0.0, 0.0));
	this.globalParams = {
		defaultLight : defaultLight,
		maxLightCount : 4
	};
	return true;
};

JSM.ShaderProgram.prototype.InitShaders = function ()
{
	function GetFragmentShaderScript (shaderType, globalParams)
	{
		var script = null;
		if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
			script = [
				'#define ' + (shaderType == JSM.ShaderType.Triangle ? 'NOTEXTURE' : 'USETEXTURE'),
				'#define MAX_LIGHTS ' + globalParams.maxLightCount,
				
				'struct Light',
				'{',
				'	mediump vec3 ambientColor;',
				'	mediump vec3 diffuseColor;',
				'	mediump vec3 specularColor;',
				'	mediump vec3 direction;',
				'};',

				'struct Material',
				'{',
				'	mediump vec3 ambientColor;',
				'	mediump vec3 diffuseColor;',
				'	mediump vec3 specularColor;',
				'	mediump float shininess;',
				'	mediump float opacity;',
				'};',
				
				'uniform Light uLights[MAX_LIGHTS];',
				'uniform Material uMaterial;',

				'varying mediump vec3 vVertex;',
				'varying mediump vec3 vNormal;',
				
				'#ifdef USETEXTURE',
				'varying mediump vec2 vUV;',
				'uniform sampler2D uSampler;',
				'#endif',
				
				'void main (void) {',
				'	mediump vec3 N = normalize (vNormal);',
				'	if (!gl_FrontFacing) {',
				'		N = -N;',
				'	}',
				'	mediump vec3 ambientComponent;',
				'	mediump vec3 diffuseComponent;',
				'	mediump vec3 specularComponent;',
				'	mediump vec3 E = normalize (-vVertex);',

				'	for (int i = 0; i < MAX_LIGHTS; i++) {',
				'		mediump vec3 L = normalize (-uLights[i].direction);',
				'		mediump vec3 R = normalize (-reflect (L, N));',
				'		ambientComponent += uMaterial.ambientColor * uLights[i].ambientColor;',
				'		diffuseComponent += uMaterial.diffuseColor * uLights[i].diffuseColor * max (dot (N, L), 0.0);',
				'		specularComponent += uMaterial.specularColor * uLights[i].specularColor * pow (max (dot (R, E), 0.0), uMaterial.shininess);',
				'	}',
				
				'#ifdef USETEXTURE',
				'	mediump vec3 textureColor = texture2D (uSampler, vec2 (vUV.s, vUV.t)).xyz;',
				'	ambientComponent = ambientComponent * textureColor;',
				'	diffuseComponent = diffuseComponent * textureColor;',
				'	specularComponent = specularComponent * textureColor;',
				'#endif',
				
				'	ambientComponent = clamp (ambientComponent, 0.0, 1.0);',
				'	diffuseComponent = clamp (diffuseComponent, 0.0, 1.0);',
				'	specularComponent = clamp (specularComponent, 0.0, 1.0);',
				'	gl_FragColor = vec4 (ambientComponent + diffuseComponent + specularComponent, uMaterial.opacity);',
				'}'
			].join ('\n');
		} else if (shaderType == JSM.ShaderType.Line) {
			script = [
				'#define MAX_LIGHTS ' + globalParams.maxLightCount,

				'struct Light',
				'{',
				'	mediump vec3 ambientColor;',
				'	mediump vec3 diffuseColor;',
				'	mediump vec3 specularColor;',
				'};',

				'struct Material',
				'{',
				'	mediump vec3 ambientColor;',
				'	mediump vec3 diffuseColor;',
				'	mediump float opacity;',
				'};',				
				
				'uniform Light uLights[MAX_LIGHTS];',
				'uniform Material uMaterial;',
				
				'void main (void) {',
				'	mediump vec3 ambientComponent;',
				'	mediump vec3 diffuseComponent;',
				'	for (int i = 0; i < MAX_LIGHTS; i++) {',
				'		ambientComponent += uMaterial.ambientColor * uLights[i].ambientColor;',
				'		diffuseComponent += uMaterial.diffuseColor * uLights[i].diffuseColor;',
				'	}',
				'	gl_FragColor = vec4 (ambientComponent + diffuseComponent, uMaterial.opacity);',
				'}'
			].join ('\n');
		}
		return script;
	}
	
	function GetVertexShaderScript (shaderType)
	{
		var script = null;
		if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
			script = [
				'#define ' + (shaderType == JSM.ShaderType.Triangle ? 'NOTEXTURE' : 'USETEXTURE'),
				'attribute mediump vec3 aVertexPosition;',
				'attribute mediump vec3 aVertexNormal;',

				'uniform mediump mat4 uViewMatrix;',
				'uniform mediump mat4 uProjectionMatrix;',
				'uniform mediump mat4 uTransformationMatrix;',

				'varying mediump vec3 vVertex;',
				'varying mediump vec3 vNormal;',

				'#ifdef USETEXTURE',
				'attribute mediump vec2 aVertexUV;',
				'varying mediump vec2 vUV;',
				'#endif',

				'void main (void) {',
				'	mat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;',
				'	vVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));',
				'	vNormal = normalize (vec3 (modelViewMatrix * vec4 (aVertexNormal, 0.0)));',
				'#ifdef USETEXTURE',
				'	vUV = aVertexUV;',
				'#endif',
				'	gl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);',
				'}'
			].join ('\n');
		} else if (shaderType == JSM.ShaderType.Line) {
			script = [
				'attribute mediump vec3 aVertexPosition;',
				'uniform mediump mat4 uViewMatrix;',
				'uniform mediump mat4 uProjectionMatrix;',
				'uniform mediump mat4 uTransformationMatrix;',

				'varying mediump vec3 vVertex;',

				'void main (void) {',
				'	mat4 modelViewMatrix = uViewMatrix * uTransformationMatrix;',
				'	vVertex = vec3 (modelViewMatrix * vec4 (aVertexPosition, 1.0));',
				'	gl_Position = uProjectionMatrix * vec4 (vVertex, 1.0);',
				'}'
			].join ('\n');
		}
		return script;
	}

	function InitShaderParameters (context, shader, globalParams, shaderType)
	{
		if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
			shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');
			shader.vertexNormalAttribute = context.getAttribLocation (shader, 'aVertexNormal');

			shader.lightUniforms = [];
			var i;
			for (i = 0; i < globalParams.maxLightCount; i++) {
				shader.lightUniforms.push ({
					ambientColor : context.getUniformLocation (shader, 'uLights[' + i + '].ambientColor'),
					diffuseColor : context.getUniformLocation (shader, 'uLights[' + i + '].diffuseColor'),
					specularColor : context.getUniformLocation (shader, 'uLights[' + i + '].specularColor'),
					direction : context.getUniformLocation (shader, 'uLights[' + i + '].direction')
				});
			}
			
			shader.materialUniforms = {
				ambientColor : context.getUniformLocation (shader, 'uMaterial.ambientColor'),
				diffuseColor : context.getUniformLocation (shader, 'uMaterial.diffuseColor'),
				specularColor : context.getUniformLocation (shader, 'uMaterial.specularColor'),
				shininess : context.getUniformLocation (shader, 'uMaterial.shininess'),
				opacity : context.getUniformLocation (shader, 'uMaterial.opacity')
			};
			
			shader.vMatrixUniform = context.getUniformLocation (shader, 'uViewMatrix');
			shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');
			shader.tMatrixUniform = context.getUniformLocation (shader, 'uTransformationMatrix');

			if (shaderType == JSM.ShaderType.TexturedTriangle) {
				shader.vertexUVAttribute = context.getAttribLocation (shader, 'aVertexUV');
				shader.samplerUniform = context.getUniformLocation (shader, 'uSampler');
			}
		} else if (shaderType == JSM.ShaderType.Line) {
			shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');

			shader.lightUniforms = [];
			for (i = 0; i < globalParams.maxLightCount; i++) {
				shader.lightUniforms.push ({
					ambientColor : context.getUniformLocation (shader, 'uLights[' + i + '].ambientColor'),
					diffuseColor : context.getUniformLocation (shader, 'uLights[' + i + '].diffuseColor')
				});
			}

			shader.materialUniforms = {
				ambientColor : context.getUniformLocation (shader, 'uMaterial.ambientColor'),
				diffuseColor : context.getUniformLocation (shader, 'uMaterial.diffuseColor'),
				opacity : context.getUniformLocation (shader, 'uMaterial.opacity')
			};

			shader.vMatrixUniform = context.getUniformLocation (shader, 'uViewMatrix');
			shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');
			shader.tMatrixUniform = context.getUniformLocation (shader, 'uTransformationMatrix');
		}
	}
	
	function InitShader (context, shaders, globalParams, shaderType)
	{
		var vertexShaderScript = GetVertexShaderScript (shaderType);
		var fragmentShaderScript = GetFragmentShaderScript (shaderType, globalParams);
		if (vertexShaderScript === null || fragmentShaderScript === null) {
			return false;
		}
		var shader = JSM.WebGLInitShaderProgram (context, vertexShaderScript, fragmentShaderScript, null);
		if (shader === null) {
			return false;
		}
		
		context.useProgram (shader);
		InitShaderParameters (context, shader, globalParams, shaderType);
		shaders[shaderType] = shader;
		return true;
	}
	
	this.shaders = {};
	
	if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.Triangle)) {
		return false;
	}
	
	if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.TexturedTriangle)) {
		return false;
	}

	if (!InitShader (this.context, this.shaders, this.globalParams, JSM.ShaderType.Line)) {
		return false;
	}

	this.context.enable (this.context.DEPTH_TEST);
	this.context.depthFunc (this.context.LEQUAL);
	
	this.context.enable (this.context.BLEND);
	this.context.blendEquation (this.context.FUNC_ADD);
	this.context.blendFunc (this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);

	this.context.disable (this.context.CULL_FACE);
	this.cullEnabled = false;

	return true;
};

JSM.ShaderProgram.prototype.CompileMaterial = function (material, textureLoaded)
{
	if (material.texture !== null) {
		var context = this.context;
		var textureBuffer = context.createTexture ();
		var textureImage = new Image ();
		textureImage.src = material.texture;
		textureImage.onload = function () {
			var resizedImage = JSM.ResizeImageToPowerOfTwoSides (textureImage);
			context.bindTexture (context.TEXTURE_2D, textureBuffer);
			context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
			context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
			context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, resizedImage);
			context.generateMipmap (context.TEXTURE_2D);
			context.bindTexture (context.TEXTURE_2D, null);
			if (textureLoaded !== undefined && textureLoaded !== null) {
				textureLoaded ();
			}
		};
		material.SetBuffers (textureBuffer, textureImage);
	}
};

JSM.ShaderProgram.prototype.CompileMesh = function (mesh)
{
	var context = this.context;
	var vertexBuffer = context.createBuffer ();
	context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
	context.bufferData (context.ARRAY_BUFFER, mesh.GetVertexArray (), context.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = mesh.VertexCount ();

	var normalBuffer = null;
	if (mesh.HasNormalArray ()) {
		normalBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
		context.bufferData (context.ARRAY_BUFFER, mesh.GetNormalArray (), context.STATIC_DRAW);
		normalBuffer.itemSize = 3;
		normalBuffer.numItems = mesh.NormalCount ();
	}

	var uvBuffer = null;
	if (mesh.HasUVArray ()) {
		uvBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
		context.bufferData (context.ARRAY_BUFFER, mesh.GetUVArray (), context.STATIC_DRAW);
		uvBuffer.itemSize = 2;
		uvBuffer.numItems = mesh.UVCount ();
	}
	
	mesh.SetBuffers (vertexBuffer, normalBuffer, uvBuffer);
};

JSM.ShaderProgram.prototype.GetShader = function (shaderType)
{
	return this.shaders[shaderType];
};

JSM.ShaderProgram.prototype.UseShader = function (shaderType)
{
	this.currentShader = this.GetShader (shaderType);
	this.currentType = shaderType;
	this.context.useProgram (this.currentShader);
};

JSM.ShaderProgram.prototype.SetParameters = function (lights, viewMatrix, projectionMatrix)
{
	function GetLight (lights, index, defaultLight)
	{
		if (index < lights.length) {
			return lights[index];
		}

		return defaultLight;
	}
	
	var context = this.context;
	var shader = this.currentShader;
	
	var i, light, lightDirection;
	if (this.currentType == JSM.ShaderType.Triangle || this.currentType == JSM.ShaderType.TexturedTriangle) {
		for (i = 0; i < this.globalParams.maxLightCount; i++) {
			light = GetLight (lights, i, this.globalParams.defaultLight);
			lightDirection = JSM.ApplyRotation (viewMatrix, light.direction);
			context.uniform3f (shader.lightUniforms[i].ambientColor, light.ambient[0], light.ambient[1], light.ambient[2]);
			context.uniform3f (shader.lightUniforms[i].diffuseColor, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
			context.uniform3f (shader.lightUniforms[i].specularColor, light.specular[0], light.specular[1], light.specular[2]);
			context.uniform3f (shader.lightUniforms[i].direction, lightDirection.x, lightDirection.y, lightDirection.z);
		}
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
	} else if (this.currentType == JSM.ShaderType.Line) {
		for (i = 0; i < this.globalParams.maxLightCount; i++) {
			light = GetLight (lights, i, this.globalParams.defaultLight);
			context.uniform3f (shader.lightUniforms[i].ambientColor, light.ambient[0], light.ambient[1], light.ambient[2]);
			context.uniform3f (shader.lightUniforms[i].diffuseColor, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
		}
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
	}
};

JSM.ShaderProgram.prototype.SetCullEnabled = function (enable)
{
	if (enable && !this.cullEnabled) {
		this.context.enable (this.context.CULL_FACE);
		this.cullEnabled = true;
	} else if (!enable && this.cullEnabled) {
		this.context.disable (this.context.CULL_FACE);
		this.cullEnabled = false;
	}
};

JSM.ShaderProgram.prototype.DrawArrays = function (material, matrix, vertexBuffer, normalBuffer, uvBuffer)
{
	var context = this.context;
	var shader = this.currentShader;
	this.SetCullEnabled (material.singleSided);
	
	if (this.currentType == JSM.ShaderType.Triangle || this.currentType == JSM.ShaderType.TexturedTriangle) {
		context.uniform3f (shader.materialUniforms.ambientColor, material.ambient[0], material.ambient[1], material.ambient[2]);
		context.uniform3f (shader.materialUniforms.diffuseColor, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		context.uniform3f (shader.materialUniforms.specularColor, material.specular[0], material.specular[1], material.specular[2]);
		context.uniform1f (shader.materialUniforms.shininess, material.shininess);
		context.uniform1f (shader.materialUniforms.opacity, material.opacity);

		context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);

		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.enableVertexAttribArray (shader.vertexPositionAttribute);
		context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
		
		context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
		context.enableVertexAttribArray (shader.vertexNormalAttribute);
		context.vertexAttribPointer (shader.vertexNormalAttribute, normalBuffer.itemSize, context.FLOAT, false, 0, 0);

		if (this.currentType == JSM.ShaderType.TexturedTriangle) {
			context.activeTexture (context.TEXTURE0);
			context.bindTexture (context.TEXTURE_2D, material.textureBuffer);
			context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
			context.enableVertexAttribArray (shader.vertexUVAttribute);
			context.vertexAttribPointer (shader.vertexUVAttribute, uvBuffer.itemSize, context.FLOAT, false, 0, 0);
			context.uniform1i (shader.samplerUniform, 0);
		}
		
		context.drawArrays (context.TRIANGLES, 0, vertexBuffer.numItems);
	} else if (this.currentType == JSM.ShaderType.Line) {
		context.uniform3f (shader.materialUniforms.ambientColor, material.ambient[0], material.ambient[1], material.ambient[2]);
		context.uniform3f (shader.materialUniforms.diffuseColor, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		context.uniform1f (shader.materialUniforms.opacity, material.opacity);
		
		context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);
		
		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.enableVertexAttribArray (shader.vertexPositionAttribute);
		context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
		
		context.drawArrays (context.LINES, 0, vertexBuffer.numItems);
	}
};
