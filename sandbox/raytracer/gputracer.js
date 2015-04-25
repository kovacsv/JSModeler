GPUTracer = function ()
{
	this.canvas = null;
	this.context = null;
	this.size = null;
	this.traceShader = null;
	this.renderShader = null;
	this.texturePingPong = null;
	this.camera = null;
	this.iteration = null;
	this.maxIteration = null;
	this.previewMode = null;
	this.previewTimeout = null;
};

GPUTracer.prototype.Init = function (canvas, fragmentShader, onError)
{
	if (!this.InitContext (canvas)) {
		return false;
	}

	if (!this.InitShaders (fragmentShader, onError)) {
		return false;
	}	
	
	if (!this.InitBuffers ()) {
		return false;
	}

	if (!this.InitNavigation ()) {
		return false;
	}

	return true;
};

GPUTracer.prototype.Start = function ()
{
	this.maxIteration = 32;
	this.StartInPreviewMode ();
};

GPUTracer.prototype.StartInPreviewMode = function ()
{
	this.iteration = 0;
	this.previewMode = true;
	if (this.previewTimeout !== null) {
		window.clearTimeout (this.previewTimeout);
	}
	this.RenderFrame ();
};

GPUTracer.prototype.StartInNormalMode = function ()
{
	this.iteration = 0;
	this.previewMode = false;
	if (this.previewTimeout !== null) {
		window.clearTimeout (this.previewTimeout);
	}
	this.RenderFrame ();
};

GPUTracer.prototype.AddTextureBuffer = function (data, name)
{
	this.context.useProgram (this.traceShader);
	var index = this.textureBuffers.length + 1;
	var textureSize = JSM.WebGLGetFloatTextureBufferSize (data);
	var textureBuffer = JSM.WebGLCreateFloatTextureBuffer (this.context, data, textureSize);
	this.context.uniform1i (this.context.getUniformLocation (this.traceShader, 'u' + name + 'Sampler'), index);
	this.context.uniform1f (this.context.getUniformLocation (this.traceShader, 'u' + name + 'Size'), textureSize);
	this.textureBuffers.push (textureBuffer);
};

GPUTracer.prototype.SetUniformFloat = function (name, value)
{
	this.context.useProgram (this.traceShader);
	var location = this.context.getUniformLocation (this.traceShader, name);
	this.context.uniform1f (location, value);
};

GPUTracer.prototype.SetUniformVector = function (name, value)
{
	this.context.useProgram (this.traceShader);
	var location = this.context.getUniformLocation (this.traceShader, name);
	var floatArray = new Float32Array ([value.x, value.y, value.z])
	this.context.uniform3fv (location, floatArray);
};

GPUTracer.prototype.ClearRender = function ()
{
	this.StartInPreviewMode ();
};

GPUTracer.prototype.RenderFrame = function ()
{
	this.context.useProgram (this.traceShader);
	
	this.context.uniform3fv (this.traceShader.cameraUniform, new Float32Array ([
		this.camera.eye.x, this.camera.eye.y, this.camera.eye.z,
		this.camera.center.x, this.camera.center.y, this.camera.center.z,
		this.camera.up.x, this.camera.up.y, this.camera.up.z
	]));

	this.context.uniform1f (this.traceShader.iterationUniform, this.previewMode ? 0 : this.iteration);
	this.context.uniform1i (this.traceShader.previewUniform, this.previewMode);
	this.context.activeTexture (this.context.TEXTURE0);
	this.context.bindTexture (this.context.TEXTURE_2D, this.texturePingPong[0]);
	
	var i;
	for (i = 0; i < this.textureBuffers.length; i++) {
		this.context.activeTexture (this.context['TEXTURE' + (i + 1)]);
		this.context.bindTexture (this.context.TEXTURE_2D, this.textureBuffers[i]);
	}

	this.context.bindFramebuffer (this.context.FRAMEBUFFER, this.traceShader.frameBuffer);
	this.context.framebufferTexture2D (this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texturePingPong[1], 0);
	
	this.context.bindBuffer (this.context.ARRAY_BUFFER, this.traceShader.vertexBuffer);
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	this.context.drawArrays (this.context.TRIANGLE_FAN, 0, 4);
	
	this.context.bindFramebuffer (this.context.FRAMEBUFFER, null);
	
	this.context.useProgram (this.renderShader);

	this.context.activeTexture (this.context.TEXTURE0);
	this.context.bindTexture (this.context.TEXTURE_2D, this.texturePingPong[1]);
    
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	this.context.drawArrays (this.context.TRIANGLE_FAN, 0, 4);

	this.texturePingPong.reverse ();
	if (this.previewMode) {
		this.previewTimeout = window.setTimeout (this.StartInNormalMode.bind (this), 2000);
	} else if (this.iteration < this.maxIteration) {
		this.iteration += 1;
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

GPUTracer.prototype.InitShaders = function (fragmentShader, onError)
{
	var vertexShader = this.GetVertexShader ();
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

GPUTracer.prototype.InitBuffers = function ()
{
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
		
		shader.frameBuffer = context.createFramebuffer ();
		context.bindFramebuffer (context.FRAMEBUFFER, shader.frameBuffer);
		context.bindFramebuffer (context.FRAMEBUFFER, null);
		
		shader.cameraUniform = context.getUniformLocation (shader, 'uCameraData');
		shader.iterationUniform = context.getUniformLocation (shader, 'uIteration');
		shader.previewUniform = context.getUniformLocation (shader, 'uPreview');
	}

	function InitRenderBuffers (vertices, context, shader)
	{
		context.useProgram (shader);
		InitVertexBuffer (vertices, context, shader);
		
		context.uniform1i (context.getUniformLocation (shader, 'uOriginalTextureSampler'), 0);
	}

	var vertices = new Float32Array ([-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);
	InitTraceBuffers (vertices, this.context, this.traceShader, this.size);
	InitRenderBuffers (vertices, this.context, this.renderShader, this.size);
	
	this.textureBuffers = [];
	this.texturePingPong = [
		JSM.WebGLCreateFloatTextureBuffer (this.context, null, this.size),
		JSM.WebGLCreateFloatTextureBuffer (this.context, null, this.size)
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
		'varying vec2 vVertexPosition;',
		'void main (void)',
		'{',
		'	vec2 position = (vVertexPosition + vec2 (1.0, 1.0)) / 2.0;',
		'	gl_FragColor = texture2D (uOriginalTextureSampler, position);',
		'}'
	].join('\n');	
	return vertexShader;
};
