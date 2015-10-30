JSM.ShaderType = {
	Normal : 0,
	Textured : 1
};

JSM.ShaderStore = function (context)
{
	this.context = context;
	this.shaders = null;
	this.lastShaderType = null;
};

JSM.ShaderStore.prototype.Init = function ()
{
	function GetFragmentShaderScript (shaderType)
	{
		var script = [
			'#define ' + (shaderType == JSM.ShaderType.Normal ? 'NOTEXTURE' : 'USETEXTURE'),
			'uniform mediump vec3 uPolygonAmbientColor;',
			'uniform mediump vec3 uPolygonDiffuseColor;',
			'uniform mediump vec3 uPolygonSpecularColor;',
			'uniform mediump float uPolygonShininess;',
			'uniform mediump float uPolygonOpacity;',
			
			'uniform mediump vec3 uLightAmbientColor;',
			'uniform mediump vec3 uLightDiffuseColor;',
			'uniform mediump vec3 uLightSpecularColor;',

			'varying mediump vec3 vVertex;',
			'varying mediump vec3 vNormal;',
			'varying mediump vec3 vLight;',
			
			'#ifdef USETEXTURE',
			'varying mediump vec2 vUV;',
			'uniform sampler2D uSampler;',
			'#endif',
			
			'void main (void) {',
			'	mediump vec3 N = normalize (vNormal);',
			'	if (!gl_FrontFacing) {',
			'		N = -N;',
			'	}',
			'	mediump vec3 L = normalize (-vLight);',
			'	mediump vec3 E = normalize (-vVertex);',
			'	mediump vec3 R = normalize (-reflect (L, N));',
			'	mediump vec3 ambientComponent = uPolygonAmbientColor * uLightAmbientColor;',
			'	mediump vec3 diffuseComponent = uPolygonDiffuseColor * uLightDiffuseColor * max (dot (N, L), 0.0);',
			'	mediump vec3 specularComponent = uPolygonSpecularColor * uLightSpecularColor * pow (max (dot (R, E), 0.0), uPolygonShininess);',
			'#ifdef USETEXTURE',
			'	mediump vec3 textureColor = texture2D (uSampler, vec2 (vUV.s, vUV.t)).xyz;',
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
	
	function GetVertexShaderScript (shaderType)
	{
		var script = [
			'#define ' + (shaderType == JSM.ShaderType.Normal ? 'NOTEXTURE' : 'USETEXTURE'),
			'attribute mediump vec3 aVertexPosition;',
			'attribute mediump vec3 aVertexNormal;',

			'uniform mediump mat4 uViewMatrix;',
			'uniform mediump mat4 uProjectionMatrix;',
			'uniform mediump mat4 uTransformationMatrix;',
			'uniform mediump vec3 uLightDirection;',

			'varying mediump vec3 vVertex;',
			'varying mediump vec3 vNormal;',
			'varying mediump vec3 vLight;',

			'#ifdef USETEXTURE',
			'attribute mediump vec2 aVertexUV;',
			'varying mediump vec2 vUV;',
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

	function InitShaderParameters (context, shader, shaderType)
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
		
		if (shaderType == JSM.ShaderType.Textured) {
			shader.vertexUVAttribute = context.getAttribLocation (shader, 'aVertexUV');
			shader.samplerUniform = context.getUniformLocation (shader, 'uSampler');
		}		
	}
	
	function InitShader (context, shaders, shaderType)
	{
		var vertexShaderScript = GetVertexShaderScript (shaderType);
		var fragmentShaderScript = GetFragmentShaderScript (shaderType);
		var shader = JSM.WebGLInitShaderProgram (context, vertexShaderScript, fragmentShaderScript, null);
		if (shader === null) {
			return false;
		}
		
		context.useProgram (shader);
		InitShaderParameters (context, shader, shaderType);
		shaders[shaderType] = shader;
		return true;
	}
	
	this.shaders = {};
	
	if (!InitShader (this.context, this.shaders, JSM.ShaderType.Normal)) {
		return false;
	}
	
	if (!InitShader (this.context, this.shaders, JSM.ShaderType.Textured)) {
		return false;
	}

	return true;
};

JSM.ShaderStore.prototype.GetShader = function (shaderType)
{
	return this.shaders[shaderType];
};

JSM.ShaderStore.prototype.UseShader = function (shaderType)
{
	if (shaderType !== this.lastShaderType) {
		var shader = this.GetShader (shaderType);
		this.context.useProgram (shader);
		this.lastShaderType = shaderType;
		return true;
	}
	return false;
};
