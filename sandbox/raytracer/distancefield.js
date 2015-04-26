DistanceField = function ()
{
	this.gpuTracer = null;
};

DistanceField.prototype.Init = function ()
{
	var fragmentShaderTag = document.getElementById ('fragmentshader');
	var fragmentShader = fragmentShaderTag.childNodes[0].nodeValue;

	this.gpuTracer = new GPUTracer ();
	var canvas = document.getElementById ('example');
	
	var camera = new JSM.Camera (
		new JSM.Coord (4, -1, 2),
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (0, 0, 1)
	);
	
	var maxIteration = 256;

	this.gpuTracer.Init (canvas, camera, maxIteration);
	this.gpuTracer.Compile (fragmentShader, function (error) {
		console.log (error);
	});

	this.gpuTracer.SetUniformVector ('uLightPosition', [4.0, 2.0, 3.0]);
	this.gpuTracer.SetUniformFloat ('uLightRadius', 0.5);
	
	this.gpuTracer.SetUniformVector ('uShapeData1', [1.0, 0.0, 0.0, 0.0]);
	
	this.gpuTracer.Start ();
};
