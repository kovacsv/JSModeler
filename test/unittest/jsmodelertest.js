var currentDir = require ('path').dirname (require.main.filename);

var UnitTest = require ('./framework/unittest.js');
var unitTest = new UnitTest (currentDir, process.argv);

// JSModeler includes start
unitTest.IncludeSourceFile ('../../src/core/jsm.js');
unitTest.IncludeSourceFile ('../../src/core/timer.js');
unitTest.IncludeSourceFile ('../../src/core/algorithm.js');
unitTest.IncludeSourceFile ('../../src/core/async.js');
unitTest.IncludeSourceFile ('../../src/core/check.js');
unitTest.IncludeSourceFile ('../../src/geometry/coord.js');
unitTest.IncludeSourceFile ('../../src/geometry/determinant.js');
unitTest.IncludeSourceFile ('../../src/geometry/coordutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/matrix.js');
unitTest.IncludeSourceFile ('../../src/geometry/coordsystem.js');
unitTest.IncludeSourceFile ('../../src/geometry/coordsystemutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/sector.js');
unitTest.IncludeSourceFile ('../../src/geometry/sectorutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/line.js');
unitTest.IncludeSourceFile ('../../src/geometry/lineutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/box.js');
unitTest.IncludeSourceFile ('../../src/geometry/boxutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/transformation.js');
unitTest.IncludeSourceFile ('../../src/geometry/transformationutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/plane.js');
unitTest.IncludeSourceFile ('../../src/geometry/planeutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/projection.js');
unitTest.IncludeSourceFile ('../../src/geometry/convexhull.js');
unitTest.IncludeSourceFile ('../../src/geometry/polygon.js');
unitTest.IncludeSourceFile ('../../src/geometry/polygonutils.js');
unitTest.IncludeSourceFile ('../../src/geometry/octree.js');
unitTest.IncludeSourceFile ('../../src/geometry/bsptree.js');
unitTest.IncludeSourceFile ('../../src/geometry/utilities.js');
unitTest.IncludeSourceFile ('../../src/modeler/body.js');
unitTest.IncludeSourceFile ('../../src/modeler/model.js');
unitTest.IncludeSourceFile ('../../src/modeler/color.js');
unitTest.IncludeSourceFile ('../../src/modeler/light.js');
unitTest.IncludeSourceFile ('../../src/modeler/material.js');
unitTest.IncludeSourceFile ('../../src/modeler/adjacencylist.js');
unitTest.IncludeSourceFile ('../../src/modeler/bodyutils.js');
unitTest.IncludeSourceFile ('../../src/modeler/textureutils.js');
unitTest.IncludeSourceFile ('../../src/modeler/cututils.js');
unitTest.IncludeSourceFile ('../../src/modeler/generator.js');
unitTest.IncludeSourceFile ('../../src/modeler/camera.js');
unitTest.IncludeSourceFile ('../../src/modeler/explode.js');
unitTest.IncludeSourceFile ('../../src/modeler/exporter.js');
unitTest.IncludeSourceFile ('../../src/import/trianglemodel.js');
unitTest.IncludeSourceFile ('../../src/import/binaryreader.js');
unitTest.IncludeSourceFile ('../../src/import/importer.js');
unitTest.IncludeSourceFile ('../../src/import/importer3ds.js');
unitTest.IncludeSourceFile ('../../src/import/importerobj.js');
unitTest.IncludeSourceFile ('../../src/import/importerstl.js');
unitTest.IncludeSourceFile ('../../src/import/importercommon.js');
unitTest.IncludeSourceFile ('../../src/extras/solidgenerator.js');
unitTest.IncludeSourceFile ('../../src/extras/extgenerator.js');
unitTest.IncludeSourceFile ('../../src/extras/painter.js');
unitTest.IncludeSourceFile ('../../src/extras/drawing.js');
unitTest.IncludeSourceFile ('../../src/extras/subdivision.js');
unitTest.IncludeSourceFile ('../../src/extras/svgtomodel.js');
unitTest.IncludeSourceFile ('../../src/extras/csg.js');
unitTest.IncludeSourceFile ('../../src/extras/surfaces.js');
unitTest.IncludeSourceFile ('../../src/renderer/renderer.js');
unitTest.IncludeSourceFile ('../../src/renderer/pointcloudrenderer.js');
unitTest.IncludeSourceFile ('../../src/renderer/converter.js');
unitTest.IncludeSourceFile ('../../src/viewer/jsonfileloader.js');
unitTest.IncludeSourceFile ('../../src/viewer/mouse.js');
unitTest.IncludeSourceFile ('../../src/viewer/touch.js');
unitTest.IncludeSourceFile ('../../src/viewer/navigation.js');
unitTest.IncludeSourceFile ('../../src/viewer/softwareviewer.js');
unitTest.IncludeSourceFile ('../../src/viewer/spriteviewer.js');
unitTest.IncludeSourceFile ('../../src/viewer/viewer.js');
unitTest.IncludeSourceFile ('../../src/viewer/pointcloudviewer.js');
unitTest.IncludeSourceFile ('../../src/three/threeconverter.js');
unitTest.IncludeSourceFile ('../../src/three/threeviewer.js');
// JSModeler includes end

unitTest.AddTestFile ('tests/core.js');
unitTest.AddTestFile ('tests/geometry.js');
unitTest.AddTestFile ('tests/modeler.js');
unitTest.AddTestFile ('tests/import.js');

var succeeded = unitTest.Run ();
var resultNum = 0;
if (!succeeded) {
	resultNum = 1;
}
process.exit (resultNum);
