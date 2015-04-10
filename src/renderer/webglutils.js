JSM.WebGLInitContext = function (canvas)
{
	if (canvas === null) {
		return null;
	}
	
	if (canvas.getContext === undefined) {
		return null;
	}
	
	var context = canvas.getContext ('webgl') || canvas.getContext ('experimental-webgl');
	if (context === null) {
		return null;
	}
	
	context.viewportWidth = canvas.width;
	context.viewportHeight = canvas.height;
	context.viewport (0, 0, context.viewportWidth, context.viewportHeight);
	context.clearColor (1.0, 1.0, 1.0, 1.0);
	return context;
};

JSM.WebGLInitShaderProgram = function (context, vertexShader, fragmentShader, onError)
{
	function CompileShader (context, script, type, onError)
	{
		var shader = context.createShader (type);
		context.shaderSource (shader, script);
		context.compileShader (shader);
		if (!context.getShaderParameter (shader, context.COMPILE_STATUS)) {
			if (onError !== undefined && onError !== null) {
				onError (context.getShaderInfoLog (shader));
			}
			return null;
		}
		return shader;
	}
	
	function CreateShader (context, fragmentShaderScript, vertexShaderScript, onError)
	{
		var fragmentShader = CompileShader (context, fragmentShaderScript, context.FRAGMENT_SHADER, onError);
		var vertexShader = CompileShader (context, vertexShaderScript, context.VERTEX_SHADER, onError);
		if (fragmentShader === null || vertexShader === null) {
			return null;
		}

		var shaderProgram = context.createProgram ();
		context.attachShader (shaderProgram, vertexShader);
		context.attachShader (shaderProgram, fragmentShader);
		context.linkProgram (shaderProgram);
		if (!context.getProgramParameter (shaderProgram, context.LINK_STATUS)) {
			return null;
		}
		
		return shaderProgram;
	}
	
	var shader = CreateShader (context, fragmentShader, vertexShader, onError);
	if (shader === null) {
		return null;
	}
	
	context.useProgram (shader);
	return shader;
};
