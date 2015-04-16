GPUTracer = function ()
{
	this.camera = null;
	this.canvas = null;
	this.context = null;
	this.size = null;
	this.traceShader = null;
	this.renderShader = null;
	this.texturePingPong = null;
	this.iteration = null;
	this.maxIteration = null;
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

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

GPUTracer.prototype.Start = function ()
{
	this.iteration = 0;
	this.maxIteration = 32;
	this.RenderFrame ();
};

GPUTracer.prototype.ClearRender = function ()
{
	if (this.iteration < this.maxIteration) {
		this.iteration = 0;
	} else {
		this.Start ();
	}
};

GPUTracer.prototype.RenderFrame = function ()
{
	this.context.useProgram (this.traceShader);
	
	this.context.uniform3fv (this.traceShader.cameraUniform, new Float32Array ([
		this.camera.eye.x, this.camera.eye.y, this.camera.eye.z,
		this.camera.center.x, this.camera.center.y, this.camera.center.z,
		this.camera.up.x, this.camera.up.y, this.camera.up.z
	]));

	this.context.uniform3fv (this.traceShader.lightUniform, new Float32Array ([
		4.0, 2.0, 4.0
	]));

	this.context.uniform1f (this.traceShader.iterationUniform, this.iteration);

	this.context.activeTexture (this.context.TEXTURE0);
	this.context.bindTexture (this.context.TEXTURE_2D, this.texturePingPong[0]);
	
	this.context.activeTexture (this.context.TEXTURE1);
	this.context.bindTexture (this.context.TEXTURE_2D, this.traceShader.triangleBuffer);
	
	this.context.activeTexture (this.context.TEXTURE2);
	this.context.bindTexture (this.context.TEXTURE_2D, this.traceShader.materialBuffer);				

	this.context.bindFramebuffer (this.context.FRAMEBUFFER, this.traceShader.frameBuffer);
	this.context.framebufferTexture2D (this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texturePingPong[1], 0);
	
	this.context.bindBuffer (this.context.ARRAY_BUFFER, this.traceShader.vertexBuffer);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	this.context.drawArrays (this.context.TRIANGLE_FAN, 0, 4);
	
	this.context.bindFramebuffer (this.context.FRAMEBUFFER, null);
	
	this.context.useProgram (this.renderShader);

	this.context.uniform1f (this.renderShader.iterationUniform, this.iteration);
    
	this.context.activeTexture (this.context.TEXTURE0);
	this.context.bindTexture (this.context.TEXTURE_2D, this.texturePingPong[1]);
    
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	this.context.drawArrays (this.context.TRIANGLE_FAN, 0, 4);

	this.texturePingPong.reverse ();
	this.iteration += 1;
	
	if (this.iteration < this.maxIteration) {
		requestAnimationFrame (this.RenderFrame.bind (this));
	}
};

GPUTracer.prototype.Resize = function ()
{

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
	
	this.size = this.canvas.width;
	return true;
};

GPUTracer.prototype.InitShaders = function (fragmentShader, model, onError)
{
	var vertexShader = this.GetVertexShader ();
	fragmentShader = fragmentShader.replace ('[TRIANGLE_COUNT]', model.TriangleCount ());
	this.traceShader = JSM.WebGLInitShaderProgram (this.context, vertexShader, fragmentShader, onError);
	if (this.traceShader === null) {
		return false;
	}
	
	var renderFragmentShader = this.GetRenderFragmentShader ();
	this.renderShader = JSM.WebGLInitShaderProgram (this.context, vertexShader, renderFragmentShader, onError);
	if (this.renderShader === null) {
		return false;
	}

	return true;
};

GPUTracer.prototype.InitBuffers = function (model)
{
	function GenerateTriangleData (model)
	{
		var result = [];
		var i, j, body, triangle, v0, v1, v2, n0, n1, n2;
		for (i = 0; i < model.BodyCount (); i++) {
			body = model.GetBody (i);
			for (j = 0; j < body.TriangleCount (); j++) {
				triangle = body.GetTriangle (j);
				v0 = body.GetVertex (triangle.v0);
				v1 = body.GetVertex (triangle.v1);
				v2 = body.GetVertex (triangle.v2);
				n0 = body.GetNormal (triangle.n0);
				n1 = body.GetNormal (triangle.n1);
				n2 = body.GetNormal (triangle.n2);
				result.push (v0.x, v0.y, v0.z);
				result.push (v1.x, v1.y, v1.z);
				result.push (v2.x, v2.y, v2.z);
				result.push (n0.x, n0.y, n0.z);
				result.push (n1.x, n1.y, n1.z);
				result.push (n2.x, n2.y, n2.z);
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
			result.push (material.reflection, 0.0, 0.0);
		}
		return result;
	}

	function CreateFloatTextureBufferFromArray (context, array, size)
	{
		var floatArray = null;
		if (array != null) {
			floatArray = new Float32Array (array)
		}
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

	function InitVertexBuffer (vertices, context, shader)
	{
		var vertexAttribLocation = context.getAttribLocation (shader, 'aVertexPosition');
		shader.vertexBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, shader.vertexBuffer);
		context.bufferData (context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);
		context.vertexAttribPointer (vertexAttribLocation, 2, context.FLOAT, false, 0, 0);
		context.enableVertexAttribArray (vertexAttribLocation);
		context.bindBuffer (context.ARRAY_BUFFER, null);		
	}

	function InitTraceBuffers (vertices, context, shader, size)
	{
		context.useProgram (shader);
		InitVertexBuffer (vertices, context, shader);
		
		context.uniform1f (context.getUniformLocation (shader, 'uSize'), size);
		context.uniform1i (context.getUniformLocation (shader, 'uOriginalTextureSampler'), 0);

		var triangleData = GenerateTriangleData (model);
		shader.triangleBuffer = CreateFloatTextureBuffer (context, triangleData);
		context.uniform1i (context.getUniformLocation (shader, 'uTiangleTextureSampler'), 1);
		context.uniform1f (context.getUniformLocation (shader, 'uTriangleTextureSize'), shader.triangleBuffer.textureSize);
		
		var materialData = GenerateMaterialData (model);
		shader.materialBuffer = CreateFloatTextureBuffer (context, materialData);
		context.uniform1i (context.getUniformLocation (shader, 'uMaterialTextureSampler'), 2);
		context.uniform1f (context.getUniformLocation (shader, 'uMaterialTextureSize'), shader.materialBuffer.textureSize);
		
		shader.frameBuffer = context.createFramebuffer ();
		context.bindFramebuffer (context.FRAMEBUFFER, shader.frameBuffer);
		context.bindFramebuffer (context.FRAMEBUFFER, null);
		
		shader.cameraUniform = context.getUniformLocation (shader, 'uCameraData');
		shader.lightUniform = context.getUniformLocation (shader, 'uLightPosition');
		shader.iterationUniform = context.getUniformLocation (shader, 'uIteration');
	}

	function InitRenderBuffers (vertices, context, shader)
	{
		context.useProgram (shader);
		InitVertexBuffer (vertices, context, shader);
		
		context.uniform1i (context.getUniformLocation (shader, 'uOriginalTextureSampler'), 0);
		shader.iterationUniform = context.getUniformLocation (shader, 'uIteration');
	}

	var vertices = new Float32Array ([-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);
	InitTraceBuffers (vertices, this.context, this.traceShader, this.size);
	InitRenderBuffers (vertices, this.context, this.renderShader, this.size);
	this.texturePingPong = [
		CreateFloatTextureBufferFromArray (this.context, null, this.size),
		CreateFloatTextureBufferFromArray (this.context, null, this.size)
	];
	return true;
};

GPUTracer.prototype.InitNavigation = function ()
{
	this.camera = new JSM.Camera (
		new JSM.Coord (4, 1, 2),
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (0, 0, 1)
	);
	
	this.navigation = new JSM.Navigation ();
	if (!this.navigation.Init (this.canvas, this.camera, this.ClearRender.bind (this), this.Resize.bind (this))) {
		return false;
	}

	return true;
};

GPUTracer.prototype.GetVertexShader = function ()
{
	var vertexShader = [
		'precision highp float;',
		'attribute vec2 aVertexPosition;',
		'varying vec2 vVertexPosition;',
		'void main (void)',
		'{',
		'	vVertexPosition = aVertexPosition;',
		'	gl_Position = vec4 (aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);',
		'}'
	].join('\n');	
	return vertexShader;
};

GPUTracer.prototype.GetRenderFragmentShader = function ()
{
	var vertexShader = [
		'precision highp float;',
		'uniform sampler2D uOriginalTextureSampler;',
		'uniform float uIteration;',
		'varying vec2 vVertexPosition;',
		'void main (void)',
		'{',
		'	vec2 position = (vVertexPosition + vec2 (1.0, 1.0)) / 2.0;',
		'	gl_FragColor = texture2D (uOriginalTextureSampler, position);',
		'}'
	].join('\n');	
	return vertexShader;
};
