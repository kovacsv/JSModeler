function AddGeneratorTests (canvasTester, viewer)
{
	var generatorSuite = canvasTester.AddTestSuite ('Generator');
	
	canvasTester.AddTest (generatorSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/generator/cube.png');

}
