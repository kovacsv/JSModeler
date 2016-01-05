JSM.ShaderType = {
	Triangle : 0,
	TexturedTriangle : 1,
	Line : 2
};

JSM.ShaderProgram = function (context)
{
	this.context = context;
	this.shaders = null;
	this.currentShader = null;
	this.currentType = null;
};

JSM.ShaderProgram.prototype.Init = function ()
{
	function GetFragmentShaderScript (shaderType)
	{
		var script = null;
		if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
			script = [
				'#define ' + (shaderType == JSM.ShaderType.Triangle ? 'NOTEXTURE' : 'USETEXTURE'),
				'#define MAX_LIGHTS 10',
				
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
				
				'uniform Light uLight;',
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
				'	mediump vec3 L = normalize (-uLight.direction);',
				'	mediump vec3 E = normalize (-vVertex);',
				'	mediump vec3 R = normalize (-reflect (L, N));',
				'	mediump vec3 ambientComponent = uMaterial.ambientColor * uLight.ambientColor;',
				'	mediump vec3 diffuseComponent = uMaterial.diffuseColor * uLight.diffuseColor * max (dot (N, L), 0.0);',
				'	mediump vec3 specularComponent = uMaterial.specularColor * uLight.specularColor * pow (max (dot (R, E), 0.0), uMaterial.shininess);',
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
				
				'uniform Light uLight;',
				'uniform Material uMaterial;',
				
				'void main (void) {',
				'	mediump vec3 ambientComponent = uMaterial.ambientColor * uLight.ambientColor;',
				'	mediump vec3 diffuseComponent = uMaterial.diffuseColor * uLight.diffuseColor;',
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

	function InitShaderParameters (context, shader, shaderType)
	{
		if (shaderType == JSM.ShaderType.Triangle || shaderType == JSM.ShaderType.TexturedTriangle) {
			shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');
			shader.vertexNormalAttribute = context.getAttribLocation (shader, 'aVertexNormal');

			shader.lightUniforms = {
				ambientColor : context.getUniformLocation (shader, 'uLight.ambientColor'),
				diffuseColor : context.getUniformLocation (shader, 'uLight.diffuseColor'),
				specularColor : context.getUniformLocation (shader, 'uLight.specularColor'),
				direction : context.getUniformLocation (shader, 'uLight.direction')
			};
			
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

			shader.lightUniforms = {
				ambientColor : context.getUniformLocation (shader, 'uLight.ambientColor'),
				diffuseColor : context.getUniformLocation (shader, 'uLight.diffuseColor')
			};

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
	
	function InitShader (context, shaders, shaderType)
	{
		var vertexShaderScript = GetVertexShaderScript (shaderType);
		var fragmentShaderScript = GetFragmentShaderScript (shaderType);
		if (vertexShaderScript === null || fragmentShaderScript === null) {
			return false;
		}
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
	
	if (!InitShader (this.context, this.shaders, JSM.ShaderType.Triangle)) {
		return false;
	}
	
	if (!InitShader (this.context, this.shaders, JSM.ShaderType.TexturedTriangle)) {
		return false;
	}

	if (!InitShader (this.context, this.shaders, JSM.ShaderType.Line)) {
		return false;
	}

	return true;
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

JSM.ShaderProgram.prototype.SetParameters = function (light, viewMatrix, projectionMatrix)
{
	var context = this.context;
	var shader = this.currentShader;
	
	if (this.currentType == JSM.ShaderType.Triangle || this.currentType == JSM.ShaderType.TexturedTriangle) {
		var lightDirection = JSM.ApplyRotation (viewMatrix, light.direction);
		context.uniform3f (shader.lightUniforms.ambientColor, light.ambient[0], light.ambient[1], light.ambient[2]);
		context.uniform3f (shader.lightUniforms.diffuseColor, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
		context.uniform3f (shader.lightUniforms.specularColor, light.specular[0], light.specular[1], light.specular[2]);
		context.uniform3f (shader.lightUniforms.direction, lightDirection.x, lightDirection.y, lightDirection.z);
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
	} else if (this.currentType == JSM.ShaderType.Line) {
		context.uniform3f (shader.lightUniforms.ambientColor, light.ambient[0], light.ambient[1], light.ambient[2]);
		context.uniform3f (shader.lightUniforms.diffuseColor, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
	}
};

JSM.ShaderProgram.prototype.DrawArrays = function (material, matrix, vertexBuffer, normalBuffer, uvBuffer)
{
	var context = this.context;
	var shader = this.currentShader;
	
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
			context.vertexAttribPointer (shader.vertexUVAttribute, uvBuffer.itemSize, context.FLOAT, false, 0, 0);
			context.enableVertexAttribArray (shader.vertexUVAttribute);
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
