module.exports = function (unitTest)
{

function DrawAndCheck (body, drawMode, referenceFile)
{
	DummyDrawer = function ()
	{
		this.width = 640;
		this.height = 480;
		this.svgContent = '';
	};

	DummyDrawer.prototype.GetWidth = function ()
	{
		return this.width;
	};

	DummyDrawer.prototype.GetHeight = function ()
	{
		return this.height;
	};

	DummyDrawer.prototype.Clear = function ()
	{

	};

	DummyDrawer.prototype.DrawLine = function (from, to)
	{
		this.svgContent += '<line stroke="black" x1="' + from.x + '" y1="' + (this.height - from.y) + '" x2="' + to.x + '" y2="' + (this.height - to.y) + '"/>\r\n';
	};

	DummyDrawer.prototype.DrawPolygon = function (polygon, color)
	{
		this.svgContent += '<polygon points="';
		var i, vertex;
		for (i = 0; i < polygon.VertexCount (); i++) {
			vertex = polygon.GetVertex (i);
			this.svgContent += vertex.x + ' ' + (this.height - vertex.y) + ' ';
		}
		this.svgContent += '" style="fill:#ffffff;stroke:#000000;stroke-width:1"/>\r\n';
	};

	DummyDrawer.prototype.GetSvgContent = function (fileName)
	{
		var svgBegin = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="svgcontent" width="' + this.width + '" height="' + this.height + '">\r\n';
		var svgEnd = '</svg>\r\n';
		return (svgBegin + this.svgContent + svgEnd);
	};	

	var camera = new JSM.Camera (new JSM.Coord (4.0, 2.0, 2.0), new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	var drawer = new DummyDrawer ();
	JSM.DrawProjectedBody (body, null, camera, drawMode, true, drawer);
	
	var fs = require ('fs');
	var path = require ('path');
	var fullReferencePath = path.join (__dirname, '../references/' + referenceFile);
	var succeeded = false;
	if (fs.existsSync (fullReferencePath)) {
		refFileContent = fs.readFileSync (fullReferencePath);
		if (refFileContent == drawer.GetSvgContent ()) {
			succeeded = true;
		}
	}
	if (!succeeded) {
		fs.writeFileSync (referenceFile, drawer.GetSvgContent ());
	}
	return succeeded;
}

var visualSuite = unitTest.AddTestSuite ('Visual');

visualSuite.AddTest ('CubeTest', function (test)
{
	var body = JSM.GenerateCuboid (1.0, 1.0, 1.0);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'cube.svg'));
});

visualSuite.AddTest ('DrawingTest', function (test)
{
	var basePoints = [
		new JSM.Coord (0.0, 0.0, -0.5),
		new JSM.Coord (0.0, 1.0, -0.5),
		new JSM.Coord (-1.0, 1.0, -0.5),
		new JSM.Coord (-1.0, -1.0, -0.5),
		new JSM.Coord (1.0, -1.0, -0.5),
		new JSM.Coord (1.0, 0.0, -0.5)
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var body = JSM.GeneratePrism (basePoints, direction, 1.0, true, null);

	test.Assert (DrawAndCheck (body, 'Wireframe', 'drawing_wireframe.svg'));
	test.Assert (DrawAndCheck (body, 'HiddenLinePainter', 'drawing_hiddenlinepainter.svg'));
	test.Assert (DrawAndCheck (body, 'HiddenLineBSPTree', 'drawing_hiddenlinebsptree.svg'));
	test.Assert (DrawAndCheck (body, 'HiddenLineFrontFacing', 'drawing_hiddenlinefrontfacing.svg'));
});

visualSuite.AddTest ('CutBodyByPlaneTest', function (test)
{
	var body = JSM.GenerateSphere (1.0, 15, false);
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.3), new JSM.Vector (0.0, 0.0, -1.0));
	body = JSM.CutBodyByPlane (body, plane);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'cutbodybyplane_01.svg'));

	var body = JSM.GenerateSphere (1.0, 15, false);
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.3), new JSM.Vector (0.0, -1.0, -1.0));
	body = JSM.CutBodyByPlane (body, plane);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'cutbodybyplane_02.svg'));
});

visualSuite.AddTest ('CatmullClarkSubdivisionTest', function (test)
{
	var basePoints = [
		new JSM.Coord (0.0, 0.0, -0.5),
		new JSM.Coord (0.0, 1.0, -0.5),
		new JSM.Coord (-1.0, 1.0, -0.5),
		new JSM.Coord (-1.0, -1.0, -0.5),
		new JSM.Coord (1.0, -1.0, -0.5),
		new JSM.Coord (1.0, 0.0, -0.5)
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var body = JSM.GeneratePrism (basePoints, direction, 1.0, true, null);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'subdivision_00.svg'));
	body = JSM.CatmullClarkSubdivisionOneIteration (body);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'subdivision_01.svg'));
	body = JSM.CatmullClarkSubdivisionOneIteration (body);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'subdivision_02.svg'));
});

visualSuite.AddTest ('BooleanOperationTest', function (test)
{
	var aBody = JSM.GenerateCuboid (1, 1, 1);
	var bBody = JSM.GenerateCuboid (1, 1, 1);
	bBody.Transform (JSM.TranslationTransformation (new JSM.Coord (0.5, -0.5, 0.5)));
	var body = JSM.BooleanOperation ('Difference', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_difference_01.svg'));
	var body = JSM.BooleanOperation ('Union', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_union_01.svg'));
	var body = JSM.BooleanOperation ('Intersection', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_intersection_01.svg'));

	bBody.Transform (JSM.RotationYTransformation (40 * JSM.DegRad));
	var body = JSM.BooleanOperation ('Difference', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_difference_02.svg'));
	var body = JSM.BooleanOperation ('Union', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_union_02.svg'));
	var body = JSM.BooleanOperation ('Intersection', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_intersection_02.svg'));

	var aBody = JSM.GenerateCuboid (1, 1, 1);
	var bBody = JSM.GenerateCylinder (0.6, 1.5, 30, true);
	bBody.Transform (JSM.TranslationTransformation (new JSM.Coord (0.5, -0.5, 0.0)));
	var body = JSM.BooleanOperation ('Difference', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_difference_03.svg'));
	var body = JSM.BooleanOperation ('Union', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_union_03.svg'));
	var body = JSM.BooleanOperation ('Intersection', aBody, bBody);
	test.Assert (DrawAndCheck (body, 'Wireframe', 'csg_intersection_03.svg'));
});

visualSuite.AddTest ('GeneratorFunctionTest', function (test)
{
	function Test (body, name)
	{
		return DrawAndCheck (body, 'Wireframe', 'generator_' + name + '.svg')
	}
	
	var exampleFunc = function (x, y)
	{
		return x * x + y * y;
	};

	var polyLine = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (1, 0, 0),
		new JSM.Coord (1, 1, 0)
	];

	var polyLine2 = [
		new JSM.Coord (0.5, 0, 0),
		new JSM.Coord (1, 0.5, 0),
		new JSM.Coord (1, 1, 0)
	];

	var polyLine2D = [
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (1, 0),
		new JSM.Coord2D (1, 1)
	];	
	
	var circlePoints1 = JSM.GenerateCirclePoints (1, 10);
	var circlePoints2 = JSM.GenerateCirclePoints (0.5, 10, new JSM.Coord (0, 0, 0.5));
	var circlePoints3 = JSM.GenerateCirclePoints (0.2, 10, new JSM.Coord (0, 0, 1));
	
	test.Assert (Test (JSM.GenerateCircle (1, 10), 'circle'));
	test.Assert (Test (JSM.GenerateCone (0.5, 1, 1, 10, true, false), 'cone1'));
	test.Assert (Test (JSM.GenerateCone (0, 1, 1, 10, true, false), 'cone2'));
	test.Assert (Test (JSM.GenerateCuboid (1, 1, 1), 'cuboid'));
	test.Assert (Test (JSM.GenerateCuboidSides (1, 1, 1, [1, 0, 0, 0, 0, 1]), 'cuboidsides'));
	test.Assert (Test (JSM.GenerateCylinder (0.5, 1, 10, true, false), 'cylinder'));
	test.Assert (Test (JSM.GenerateCylinderShell (0.5, 1, 0.1, 10, true, false), 'cylindershell'));
	test.Assert (Test (JSM.GenerateFunctionSurface (exampleFunc, new JSM.Coord2D (-0.5, -0.5), new JSM.Coord2D (0.5, 0.5), 10, false), 'function'));
	test.Assert (Test (JSM.GenerateFunctionSurfaceSolid (exampleFunc, new JSM.Coord2D (-0.5, -0.5), new JSM.Coord2D (0.5, 0.5), 10, false, 0.5), 'functionsolid'));
	test.Assert (Test (JSM.GenerateGrid (1, 1, 10, 10, false), 'grid'));
	test.Assert (Test (JSM.GenerateLineShell (polyLine, new JSM.Vector (0, 0, 1), 1, 0.1, true, true), 'lineshell'));
	test.Assert (Test (JSM.GeneratePie (0.5, 0.2, Math.PI * 3 / 2, 10, true, false), 'pie'));
	test.Assert (Test (JSM.GeneratePolyTorus (polyLine2D, 0.5, 10, false), 'polytorus'));
	test.Assert (Test (JSM.GeneratePrism (polyLine, new JSM.Vector (0, 0, 1), 1, true, null), 'prism'));
	test.Assert (Test (JSM.GeneratePrismShell (polyLine, new JSM.Vector (0, 0, 1), 1, 0.1, true), 'prismshell'));
	test.Assert (Test (JSM.GenerateRectangle (1, 1), 'rectangle'));
	test.Assert (Test (JSM.GenerateRevolved (polyLine2, new JSM.Sector (new JSM.Coord (0, 0, 0), new JSM.Coord (0, 1, 0)), Math.PI * 3 / 2, 10, true, 'None'), 'revolved1'));
	test.Assert (Test (JSM.GenerateRevolved (polyLine2, new JSM.Sector (new JSM.Coord (0, 0, 0), new JSM.Coord (0, 1, 0)), 2 * Math.PI, 10, true, 'None'), 'revolved2'));
	test.Assert (Test (JSM.GenerateRuledFromSectors (new JSM.Sector (new JSM.Coord (0, 0, 0), new JSM.Coord (1, 0, 0)), new JSM.Sector (new JSM.Coord (0, 1, 0), new JSM.Coord (0, 1, 1)), 10, 10, false), 'ruled'));
	test.Assert (Test (JSM.GenerateSegmentedCuboid (1, 1, 1, 5), 'segmentedcuboid'));
	test.Assert (Test (JSM.GenerateSegmentedRectangle (1, 1, 3, 5), 'segmentedrectangle'));
	test.Assert (Test (JSM.GenerateSphere (0.5, 10, false), 'sphere'));
	test.Assert (Test (JSM.GenerateSquareGrid (1, 5, false), 'squaregrid'));
	test.Assert (Test (JSM.GenerateTorus (0.5, 0.2, 10, 10, false), 'torus'));
	test.Assert (Test (JSM.GenerateTriangulatedSphere (0.5, 2, false), 'triangulatedsphere'));
	test.Assert (Test (JSM.GenerateTube ([circlePoints1, circlePoints2, circlePoints3], true), 'tube'));
});

}
