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
	var body = JSM.GeneratePrism (basePoints, direction, 1.0, true);

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
	var body = JSM.GeneratePrism (basePoints, direction, 1.0, true);
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

}
