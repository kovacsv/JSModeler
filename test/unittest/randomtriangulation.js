module.exports = function (unitTest)
{

// JSModeler includes start
unitTest.AddSourceFile ('../../src/core/jsm.js');
unitTest.AddSourceFile ('../../src/core/timer.js');
unitTest.AddSourceFile ('../../src/core/algorithm.js');
unitTest.AddSourceFile ('../../src/core/async.js');
unitTest.AddSourceFile ('../../src/core/check.js');
unitTest.AddSourceFile ('../../src/core/jsonloader.js');
unitTest.AddSourceFile ('../../src/geometry/definitions.js');
unitTest.AddSourceFile ('../../src/geometry/coord2d.js');
unitTest.AddSourceFile ('../../src/geometry/coord.js');
unitTest.AddSourceFile ('../../src/geometry/determinant.js');
unitTest.AddSourceFile ('../../src/geometry/coordutils.js');
unitTest.AddSourceFile ('../../src/geometry/matrix.js');
unitTest.AddSourceFile ('../../src/geometry/coordsystem.js');
unitTest.AddSourceFile ('../../src/geometry/sector.js');
unitTest.AddSourceFile ('../../src/geometry/line.js');
unitTest.AddSourceFile ('../../src/geometry/box.js');
unitTest.AddSourceFile ('../../src/geometry/sphere.js');
unitTest.AddSourceFile ('../../src/geometry/transformation.js');
unitTest.AddSourceFile ('../../src/geometry/plane.js');
unitTest.AddSourceFile ('../../src/geometry/projection.js');
unitTest.AddSourceFile ('../../src/geometry/convexhull.js');
unitTest.AddSourceFile ('../../src/geometry/polygon2d.js');
unitTest.AddSourceFile ('../../src/geometry/polygon.js');
unitTest.AddSourceFile ('../../src/geometry/triangulation.js');
unitTest.AddSourceFile ('../../src/geometry/octree.js');
unitTest.AddSourceFile ('../../src/geometry/bsptree.js');
unitTest.AddSourceFile ('../../src/geometry/utilities.js');
unitTest.AddSourceFile ('../../src/geometry/ray.js');
unitTest.AddSourceFile ('../../src/modeler/body.js');
unitTest.AddSourceFile ('../../src/modeler/model.js');
unitTest.AddSourceFile ('../../src/modeler/color.js');
unitTest.AddSourceFile ('../../src/modeler/material.js');
unitTest.AddSourceFile ('../../src/modeler/adjacencyinfo.js');
unitTest.AddSourceFile ('../../src/modeler/bodyutils.js');
unitTest.AddSourceFile ('../../src/modeler/textureutils.js');
unitTest.AddSourceFile ('../../src/modeler/cututils.js');
unitTest.AddSourceFile ('../../src/modeler/generator.js');
unitTest.AddSourceFile ('../../src/modeler/camera.js');
unitTest.AddSourceFile ('../../src/modeler/explode.js');
unitTest.AddSourceFile ('../../src/modeler/exporter.js');
unitTest.AddSourceFile ('../../src/modeler/trianglebody.js');
unitTest.AddSourceFile ('../../src/modeler/trianglemodel.js');
unitTest.AddSourceFile ('../../src/modeler/converter.js');
unitTest.AddSourceFile ('../../src/modeler/rayutils.js');
unitTest.AddSourceFile ('../../src/import/binaryreader.js');
unitTest.AddSourceFile ('../../src/import/importer.js');
unitTest.AddSourceFile ('../../src/import/importer3ds.js');
unitTest.AddSourceFile ('../../src/import/importerobj.js');
unitTest.AddSourceFile ('../../src/import/importerstl.js');
unitTest.AddSourceFile ('../../src/import/importercommon.js');
unitTest.AddSourceFile ('../../src/renderer/webglutils.js');
unitTest.AddSourceFile ('../../src/renderer/renderlight.js');
unitTest.AddSourceFile ('../../src/renderer/rendermaterial.js');
unitTest.AddSourceFile ('../../src/renderer/rendermesh.js');
unitTest.AddSourceFile ('../../src/renderer/renderbody.js');
unitTest.AddSourceFile ('../../src/renderer/shaderprogram.js');
unitTest.AddSourceFile ('../../src/renderer/renderer.js');
unitTest.AddSourceFile ('../../src/renderer/pointcloudrenderer.js');
unitTest.AddSourceFile ('../../src/renderer/renderconverter.js');
unitTest.AddSourceFile ('../../src/viewer/jsonfileloader.js');
unitTest.AddSourceFile ('../../src/viewer/mouse.js');
unitTest.AddSourceFile ('../../src/viewer/touch.js');
unitTest.AddSourceFile ('../../src/viewer/painter.js');
unitTest.AddSourceFile ('../../src/viewer/drawing.js');
unitTest.AddSourceFile ('../../src/viewer/navigation.js');
unitTest.AddSourceFile ('../../src/viewer/softwareviewer.js');
unitTest.AddSourceFile ('../../src/viewer/spriteviewer.js');
unitTest.AddSourceFile ('../../src/viewer/viewer.js');
unitTest.AddSourceFile ('../../src/viewer/pointcloudviewer.js');
unitTest.AddSourceFile ('../../src/extras/solidgenerator.js');
unitTest.AddSourceFile ('../../src/extras/extgenerator.js');
unitTest.AddSourceFile ('../../src/extras/subdivision.js');
unitTest.AddSourceFile ('../../src/extras/svgtomodel.js');
unitTest.AddSourceFile ('../../src/extras/csg.js');
unitTest.AddSourceFile ('../../src/extras/curves.js');
unitTest.AddSourceFile ('../../src/extensions/three/threeconverter.js');
unitTest.AddSourceFile ('../../src/extensions/three/threeviewer.js');
// JSModeler includes end

unitTest.AddSourceFile ('utils/triangulationcheck.js');

var fs = require('fs');

var suite = unitTest.AddTestSuite ('RandomTest');

suite.AddTest ('SimplePolygonTest', function (test)
{
	var counter = 1;
	var polygon, result;
	while (counter <= 1000) {
		polygon = GenerateRandomSimplePolygon ();
		if (polygon === null) {
			continue;
		}
		
		console.log ('polygon ' + counter);
		var triangles = JSM.TriangulatePolygon2D (polygon);
		result = CheckCalculatedTriangulation (polygon, triangles);		
		if (!result) {
			console.log (polygon.ToArray ());
			test.Assert (false);
			break;
		}

		counter++;
	}
});

};
