JSM.ShaderType = {
	Normal : 0,
	Textured : 1,
	Line : 2
};

JSM.ShaderProgram = function (context)
{
	this.context = context;
	this.shaders = null;
	this.current = null;
	this.currentType = null;
};

JSM.ShaderProgram.prototype.Init = function ()
{
	function GetFragmentShaderScript (shaderType)
	{
		var script = null;
		if (shaderType == JSM.ShaderType.Normal || shaderType == JSM.ShaderType.Textured) {
			script = [
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
			].join ('\n');
		} else if (shaderType == JSM.ShaderType.Line) {
			script = [
				'#define ' + (shaderType == JSM.ShaderType.Normal ? 'NOTEXTURE' : 'USETEXTURE'),
				'uniform mediump vec3 uLineColor;',
				'void main (void) {',
				'	gl_FragColor = vec4 (uLineColor, 1);',
				'}'
			].join ('\n');
		}
		return script;
	}
	
	function GetVertexShaderScript (shaderType)
	{
		var script = null;
		if (shaderType == JSM.ShaderType.Normal || shaderType == JSM.ShaderType.Textured) {
			script = [
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
		if (shaderType == JSM.ShaderType.Normal || shaderType == JSM.ShaderType.Textured) {
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
		} else if (shaderType == JSM.ShaderType.Line) {
			shader.vertexPositionAttribute = context.getAttribLocation (shader, 'aVertexPosition');
			shader.vMatrixUniform = context.getUniformLocation (shader, 'uViewMatrix');
			shader.pMatrixUniform = context.getUniformLocation (shader, 'uProjectionMatrix');
			shader.tMatrixUniform = context.getUniformLocation (shader, 'uTransformationMatrix');
			shader.lineColorUniform = context.getUniformLocation (shader, 'uLineColor');
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
	
	if (!InitShader (this.context, this.shaders, JSM.ShaderType.Normal)) {
		return false;
	}
	
	if (!InitShader (this.context, this.shaders, JSM.ShaderType.Textured)) {
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
	this.current = this.GetShader (shaderType);
	this.currentType = shaderType;
	this.context.useProgram (this.current);
};

JSM.ShaderProgram.prototype.SetParameters = function (light, viewMatrix, projectionMatrix)
{
	var context = this.context;
	var shader = this.current;
	
	if (this.currentType == JSM.ShaderType.Normal || this.currentType == JSM.ShaderType.Textured) {
		context.uniform3f (shader.lightDirectionUniform, light.direction.x, light.direction.y, light.direction.z);
		context.uniform3f (shader.lightAmbientColorUniform, light.ambient[0], light.ambient[1], light.ambient[2]);
		context.uniform3f (shader.lightDiffuseColorUniform, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
		context.uniform3f (shader.lightSpecularColorUniform, light.specular[0], light.specular[1], light.specular[2]);
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
	} else if (this.currentType == JSM.ShaderType.Line) {
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);
	}
};

JSM.ShaderProgram.prototype.DrawArrays = function (material, matrix, vertexBuffer, normalBuffer, uvBuffer)
{
	var context = this.context;
	var shader = this.current;
	
	if (this.currentType == JSM.ShaderType.Normal || this.currentType == JSM.ShaderType.Textured) {
		context.uniform3f (shader.polygonAmbientColorUniform, material.ambient[0], material.ambient[1], material.ambient[2]);
		context.uniform3f (shader.polygonDiffuseColorUniform, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		context.uniform3f (shader.polygonSpecularColorUniform, material.specular[0], material.specular[1], material.specular[2]);
		context.uniform1f (shader.polygonShininessUniform, material.shininess);
		context.uniform1f (shader.polygonOpacityUniform, material.opacity);

		context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);

		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.enableVertexAttribArray (shader.vertexPositionAttribute);
		context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
		
		context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
		context.enableVertexAttribArray (shader.vertexNormalAttribute);
		context.vertexAttribPointer (shader.vertexNormalAttribute, normalBuffer.itemSize, context.FLOAT, false, 0, 0);

		if (this.currentType == JSM.ShaderType.Textured) {
			context.activeTexture (context.TEXTURE0);
			context.bindTexture (context.TEXTURE_2D, material.textureBuffer);
			context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
			context.vertexAttribPointer (shader.vertexUVAttribute, uvBuffer.itemSize, context.FLOAT, false, 0, 0);
			context.enableVertexAttribArray (shader.vertexUVAttribute);
			context.uniform1i (shader.samplerUniform, 0);
		}
		
		context.drawArrays (context.TRIANGLES, 0, vertexBuffer.numItems);
	} else if (this.currentType == JSM.ShaderType.Line) {
		context.uniform3f (shader.lineColorUniform, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		
		context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);
		
		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.enableVertexAttribArray (shader.vertexPositionAttribute);
		context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
		
		context.drawArrays (context.LINES, 0, vertexBuffer.numItems);
	}
};
