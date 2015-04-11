GPUTracer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	this.triangleBuffer = null;
	this.materialBuffer = null;
};

GPUTracer.prototype.Init = function (canvas, model, fragmentShader, onError)
{
	if (!this.InitContext (canvas)) {
		return false;
	}

	if (!this.InitShaders (fragmentShader, model, onError)) {
		return false;
	}	
	
	if (!this.InitBuffers (model)) {
		return false;
	}

	return true;
};

GPUTracer.prototype.Render = function ()
{
	this.context.activeTexture (this.context.TEXTURE0);
	this.context.bindTexture (this.context.TEXTURE_2D, this.triangleBuffer);
	
	this.context.activeTexture (this.context.TEXTURE1);
	this.context.bindTexture (this.context.TEXTURE_2D, this.materialBuffer);				

	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	this.context.drawArrays (this.context.TRIANGLE_FAN, 0, 4);	
};

GPUTracer.prototype.InitContext = function (canvas)
{
	this.canvas = canvas;
	this.context = JSM.WebGLInitContext (this.canvas);
	if (this.context === null) {
		return false;
	}
	
	var floatExtension = this.context.getExtension ('OES_texture_float');
	if (floatExtension === null) {
		return false;
	}
	
	return true;
};

GPUTracer.prototype.InitShaders = function (fragmentShader, model, onError)
{
	var vertexShader = this.GetVertexShader ();
	fragmentShader = fragmentShader.replace ('[TRIANGLE_COUNT]', model.TriangleCount ());
	this.shader = JSM.WebGLInitShaderProgram (this.context, vertexShader, fragmentShader, onError);
	if (this.shader === null) {
		return false;
	}
	
	return true;
};

GPUTracer.prototype.InitBuffers = function (model)
{
	function GenerateTriangleData (model)
	{
		var result = [];
		var i, j, body, triangle, v0, v1, v2;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			for (j = 0; j < body.TriangleCount (); j++) {
				triangle = body.GetTriangle (j);
				v0 = body.GetVertex (triangle.v0);
				v1 = body.GetVertex (triangle.v1);
				v2 = body.GetVertex (triangle.v2);
				result.push (v0.x, v0.y, v0.z);
				result.push (v1.x, v1.y, v1.z);
				result.push (v2.x, v2.y, v2.z);
				result.push (triangle.mat, 0.0, 0.0);
			}
		}
		return result;
	}
	
	function GenerateMaterialData (model)
	{
		var result = [];
		var i, material;
		for (i = 0; i < model.MaterialCount (); i++) {
			material = model.GetMaterial (i);
			result.push (material.ambient[0], material.ambient[1], material.ambient[2]);
			result.push (material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		}
		return result;
	}

	function CreateFloatTextureBufferFromArray (context, array, size)
	{
		var floatArray = new Float32Array (array);
		var textureBuffer = context.createTexture ();
		context.bindTexture (context.TEXTURE_2D, textureBuffer);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
		context.texParameteri (context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
		context.texImage2D (context.TEXTURE_2D, 0, context.RGB, size, size, 0, context.RGB, context.FLOAT, floatArray);
		context.bindTexture (context.TEXTURE_2D, null);
		return textureBuffer;
	}
	
	function CreateFloatTextureBuffer (context, array)
	{
		var textureSize = JSM.NextPowerOfTwo (Math.ceil (Math.sqrt (array.length / 3.0)));
		while (array.length < textureSize * textureSize * 3) {
			array.push (0.0);
		}
		var textureBuffer = CreateFloatTextureBufferFromArray (context, array, textureSize);
		textureBuffer.textureSize = textureSize;
		return textureBuffer;
	}

	var vertices = new Float32Array ([-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);
	var vertexAttribLocation = this.context.getAttribLocation (this.shader, 'aVertexPosition');
	var buffer = this.context.createBuffer ();
	this.context.bindBuffer (this.context.ARRAY_BUFFER, buffer);
	this.context.bufferData (this.context.ARRAY_BUFFER, vertices, this.context.STATIC_DRAW);
	this.context.vertexAttribPointer (vertexAttribLocation, 2, this.context.FLOAT, false, 0, 0);
	this.context.enableVertexAttribArray (vertexAttribLocation);
	this.context.bindBuffer (this.context.ARRAY_BUFFER, null);
	
	this.context.uniform1f (this.context.getUniformLocation (this.shader, 'uWidth'), this.canvas.width);
	this.context.uniform1f (this.context.getUniformLocation (this.shader, 'uHeight'), this.canvas.height);
	
	var triangleData = GenerateTriangleData (model);
	this.triangleBuffer = CreateFloatTextureBuffer (this.context, triangleData);
	this.context.uniform1i (this.context.getUniformLocation (this.shader, 'uTiangleTextureSampler'), 0);
	this.context.uniform1f (this.context.getUniformLocation (this.shader, 'uTriangleTextureSize'), this.triangleBuffer.textureSize);
	
	var materialData = GenerateMaterialData (model);
	this.materialBuffer = CreateFloatTextureBuffer (this.context, materialData);
	this.context.uniform1i (this.context.getUniformLocation (this.shader, 'uMaterialTextureSampler'), 1);
	this.context.uniform1f (this.context.getUniformLocation (this.shader, 'uMaterialTextureSize'), this.materialBuffer.textureSize);
	
	return true;
};

GPUTracer.prototype.GetVertexShader = function ()
{
	var vertexShader = [
		'precision highp float;',
		'attribute vec2 aVertexPosition;',
		'varying vec2 vVertexPosition;',
		'void main (void) {',
		'	vVertexPosition = aVertexPosition;',
		'	gl_Position = vec4 (aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);',
		'}'
	].join('\n');	
	return vertexShader;
};
