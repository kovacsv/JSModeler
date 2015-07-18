module.exports = function (unitTest)
{

function CheckCalculatedTriangulation_Exists (polygon, triangles)
{
	if (polygon === null || triangles === null) {
		return false;
	}
	return true;
}

function CheckCalculatedTriangulation_TriangleCount (polygon, triangles)
{
	if (triangles.length != polygon.VertexCount () - 2) {
		return false;
	}
	return true;
}

function CheckCalculatedTriangulation_Area (polygon, triangles)
{
	var originalArea = polygon.GetArea ();
	var resultArea = 0.0;

	var i, triangle, trianglePoly;
	for (i = 0; i < triangles.length; i++) {
		triangle = triangles[i];
		trianglePoly = new JSM.Polygon2D ();
		trianglePoly.AddVertexCoord (polygon.GetVertex (triangle[0]));
		trianglePoly.AddVertexCoord (polygon.GetVertex (triangle[1]));
		trianglePoly.AddVertexCoord (polygon.GetVertex (triangle[2]));
		resultArea += trianglePoly.GetArea ();
	}
	if (!JSM.IsEqual (originalArea, resultArea)) {
		return false;
	}
	return true;
}

function CheckCalculatedTriangulation_Orientation (polygon, triangles)
{
	var originalOrientation = polygon.GetOrientation ();
	var i, triangle, trianglePoly;
	for (i = 0; i < triangles.length; i++) {
		triangle = triangles[i];
		trianglePoly = new JSM.Polygon2D ();
		trianglePoly.AddVertexCoord (polygon.GetVertex (triangle[0]));
		trianglePoly.AddVertexCoord (polygon.GetVertex (triangle[1]));
		trianglePoly.AddVertexCoord (polygon.GetVertex (triangle[2]));
		if (trianglePoly.GetOrientation () != originalOrientation) {
			return false;
		}
	}
	return true;
}

function CheckCalculatedTriangulation (polygon, triangles)
{
	if (!CheckCalculatedTriangulation_Exists (polygon, triangles)) {
		return false;
	}
	if (!CheckCalculatedTriangulation_TriangleCount (polygon, triangles)) {
		return false;
	}
	if (!CheckCalculatedTriangulation_Area (polygon, triangles)) {
		return false;
	}
	if (!CheckCalculatedTriangulation_Orientation (polygon, triangles)) {
		return false;
	}
	return true;
}

function CheckSimpleTriangulation (polygon, triangles)
{
	var triangles = JSM.TriangulateSimplePolygon (polygon);
	return CheckCalculatedTriangulation (polygon, triangles);
}

var simplePolygonSuite = unitTest.AddTestSuite ('SimplePolygonTriangulationTest');

simplePolygonSuite.AddTest ('InvalidPolygonTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	var triangles = JSM.TriangulateSimplePolygon (polygon);
	test.AssertEqual (triangles, null);
	
	polygon.AddVertex (0.0, 0.0);
	triangles = JSM.TriangulateSimplePolygon (polygon);
	test.AssertEqual (triangles, null);

	polygon.AddVertex (1.0, 0.0);
	triangles = JSM.TriangulateSimplePolygon (polygon);
	test.AssertEqual (triangles, null);
});

simplePolygonSuite.AddTest ('TriangleTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	test.Assert (CheckSimpleTriangulation (polygon));
	
	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 0.0);
	test.Assert (CheckSimpleTriangulation (polygon2));	
});

simplePolygonSuite.AddTest ('ConvexTriangulationTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (CheckSimpleTriangulation (polygon));

	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (0.0, 1.0);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 0.0);
	test.Assert (CheckSimpleTriangulation (polygon2));
});

simplePolygonSuite.AddTest ('ConcaveTriangulationTest01', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.2, 0.2);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (CheckSimpleTriangulation (polygon));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (0.0, 1.0);
	polygon.AddVertex (0.2, 0.2);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 0.0);
	test.Assert (CheckSimpleTriangulation (polygon));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (0.5, 0.2);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.5, 0.8);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (CheckSimpleTriangulation (polygon));
    
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (0.0, 1.0);
	polygon.AddVertex (0.5, 0.8);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (0.5, 0.2);
	test.Assert (CheckSimpleTriangulation (polygon));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 0.1);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (CheckSimpleTriangulation (polygon));
});

simplePolygonSuite.AddTest ('ConcaveTriangulationTest02', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 5.0);
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (3.0, 1.0);
	test.Assert (CheckSimpleTriangulation (polygon));
});

var convertToSimplePolygonSuite = unitTest.AddTestSuite ('ConvertPolygonToSimplePolygonTest');

convertToSimplePolygonSuite.AddTest ('SimplePolygonTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount (), simple.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Convex);	
	
	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.AddContour ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (0.0, 4.0);
	polygon2.AddVertex (5.0, 4.0);
	polygon2.AddVertex (5.0, 0.0);
	
	var simple2 = JSM.ConvertPolygonToSimplePolygon (polygon2);
	test.AssertEqual (polygon2.VertexCount (), simple2.VertexCount ());
	test.AssertEqual (polygon2.GetSignedArea (), simple2.GetSignedArea ());
	test.AssertEqual (polygon2.GetArea (), simple2.GetArea ());
	test.AssertEqual (polygon2.GetOrientation (), simple2.GetOrientation ());
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);	
	test.AssertEqual (simple2.GetComplexity (), JSM.Complexity.Convex);		
});

convertToSimplePolygonSuite.AddTest ('OneHoleTest01', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
    
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 2, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
});

convertToSimplePolygonSuite.AddTest ('OneHoleTest02', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
    
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 2, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);
});

convertToSimplePolygonSuite.AddTest ('OneHoleTest03', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (4.0, 0.0);
	polygon.AddVertex (4.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 3.0);
	polygon.AddVertex (2.0, 1.0);
    
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 2, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);
});

convertToSimplePolygonSuite.AddTest ('TwoHolesTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
    
	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (4.0, 1.0);

	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 4, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
});

var polygonSuite = unitTest.AddTestSuite ('PolygonTriangulationTest');

polygonSuite.AddTest ('OneHoleTriangulationTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
    
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));

	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.AddContour ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (5.0, 0.0);
	polygon2.AddVertex (0.0, 5.0);
	polygon2.AddContour ();
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 2.0);
	polygon2.AddVertex (2.0, 2.0);
	polygon2.AddVertex (2.0, 1.0);
    
	var simple2 = JSM.ConvertPolygonToSimplePolygon (polygon2);
	test.Assert (CheckSimpleTriangulation (simple2));
	
	var polygon3 = new JSM.ContourPolygon2D ();
	polygon3.AddContour ();
	polygon3.AddVertex (0, 0);
	polygon3.AddVertex (100, 0);
	polygon3.AddVertex (100, 100);
	polygon3.AddVertex (0, 100);
	polygon3.AddContour ();
	polygon3.AddVertex (10, 10);
	polygon3.AddVertex (10, 90);
	polygon3.AddVertex (90, 90);
	polygon3.AddVertex (90, 10);
	
	var simple3 = JSM.ConvertPolygonToSimplePolygon (polygon3);
	test.Assert (CheckSimpleTriangulation (simple3));
});

polygonSuite.AddTest ('TwoHolesTriangulationTest01', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
    
	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (4.0, 1.0);

	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 4, simple.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);		
	
	test.Assert (CheckSimpleTriangulation (simple));
});

polygonSuite.AddTest ('TwoHolesTriangulationTest02', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (4.0, 1.0);

	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
    
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 4, simple.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);		
	
	test.Assert (CheckSimpleTriangulation (simple));
});

polygonSuite.AddTest ('TwoHolesTriangulationTest03', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);

	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
    
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.AssertEqual (polygon.VertexCount () + 4, simple.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);		
	
	test.Assert (CheckSimpleTriangulation (simple));
});

polygonSuite.AddTest ('TwoHolesTriangulationTest04', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
    
	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);

	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	var triangles = JSM.TriangulateSimplePolygon (simple);
	test.Assert (CheckCalculatedTriangulation_Exists (simple, triangles));
	test.Assert (CheckCalculatedTriangulation_TriangleCount (simple, triangles));
	test.Assert (CheckCalculatedTriangulation_Area (simple, triangles));
	test.Assert (CheckCalculatedTriangulation_Orientation (simple, triangles));
});

var generatedSuite = unitTest.AddTestSuite ('GeneratedTriangulationTest');

generatedSuite.AddTest ('Test01', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (238, 542);
	polygon.AddVertex (117, 162);
	polygon.AddVertex (431, 88);
	polygon.AddVertex (642, 232);
	polygon.AddVertex (434, 469);
	test.AssertEqualNum (polygon.GetArea (), 141564, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test02', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (242, 69);
	polygon.AddVertex (123, 386);
	polygon.AddVertex (331, 533);
	polygon.AddVertex (539, 523);
	polygon.AddVertex (609, 373);
	polygon.AddVertex (602, 182);
	polygon.AddVertex (393, 87);
	test.AssertEqualNum (polygon.GetArea (), 167856.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test03', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (216, 132);
	polygon.AddVertex (157, 435);
	polygon.AddVertex (204, 246);
	polygon.AddVertex (215, 479);
	polygon.AddVertex (780, 397);
	polygon.AddVertex (233, 461);
	polygon.AddVertex (266, 372);
	polygon.AddVertex (718, 371);
	polygon.AddVertex (527, 406);
	polygon.AddVertex (755, 383);
	polygon.AddVertex (763, 302);
	polygon.AddVertex (362, 361);
	polygon.AddVertex (383, 145);
	polygon.AddVertex (390, 341);
	polygon.AddVertex (435, 335);
	polygon.AddVertex (422, 221);
	polygon.AddVertex (490, 322);
	polygon.AddVertex (474, 202);
	polygon.AddVertex (538, 311);
	polygon.AddVertex (498, 144);
	polygon.AddVertex (589, 312);
	polygon.AddVertex (559, 155);
	polygon.AddVertex (624, 272);
	polygon.AddVertex (642, 182);
	polygon.AddVertex (671, 259);
	polygon.AddVertex (706, 140);
	polygon.AddVertex (776, 211);
	polygon.AddVertex (712, 58);
	polygon.AddVertex (669, 190);
	polygon.AddVertex (579, 52);
	polygon.AddVertex (608, 182);
	polygon.AddVertex (475, 46);
	polygon.AddVertex (440, 178);
	polygon.AddVertex (403, 55);
	polygon.AddVertex (316, 56);
	polygon.AddVertex (335, 336);
	polygon.AddVertex (276, 338);
	polygon.AddVertex (274, 178);
	test.AssertEqualNum (polygon.GetArea (), 105526.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test04', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (58, 69);
	polygon.AddVertex (175, 223);
	polygon.AddVertex (90, 333);
	polygon.AddVertex (242, 546);
	polygon.AddVertex (154, 308);
	polygon.AddVertex (317, 301);
	polygon.AddVertex (219, 389);
	polygon.AddVertex (320, 524);
	polygon.AddVertex (746, 372);
	polygon.AddVertex (390, 424);
	polygon.AddVertex (474, 215);
	polygon.AddVertex (313, 374);
	polygon.AddVertex (453, 100);
	polygon.AddVertex (284, 212);
	polygon.AddVertex (302, 79);
	polygon.AddVertex (195, 129);
	test.AssertEqualNum (polygon.GetArea (), 97937.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test05', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (104, 71);
	polygon.AddVertex (107, 213);
	polygon.AddVertex (141, 59);
	polygon.AddVertex (176, 228);
	polygon.AddVertex (224, 49);
	polygon.AddVertex (287, 272);
	polygon.AddVertex (340, 104);
	polygon.AddVertex (382, 318);
	polygon.AddVertex (408, 55);
	polygon.AddVertex (452, 435);
	polygon.AddVertex (545, 51);
	polygon.AddVertex (540, 532);
	polygon.AddVertex (600, 182);
	polygon.AddVertex (604, 485);
	polygon.AddVertex (680, 219);
	polygon.AddVertex (696, 470);
	polygon.AddVertex (732, 21);
	polygon.AddVertex (760, 579);
	polygon.AddVertex (417, 587);
	polygon.AddVertex (410, 382);
	polygon.AddVertex (48, 381);
	test.AssertEqualNum (polygon.GetArea (), 174123, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test06', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (136, 128);
	polygon.AddVertex (722, 110);
	polygon.AddVertex (142, 315);
	polygon.AddVertex (482, 158);
	polygon.AddVertex (79, 182);
	polygon.AddVertex (56, 478);
	polygon.AddVertex (717, 261);
	polygon.AddVertex (765, 531);
	polygon.AddVertex (21, 551);
	polygon.AddVertex (54, 21);
	polygon.AddVertex (394, 21);
	polygon.AddVertex (393, 67);
	test.AssertEqualNum (polygon.GetArea (), 196986, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test07', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (269, 176);
	polygon.AddVertex (429, 98);
	polygon.AddVertex (285, 326);
	polygon.AddVertex (502, 320);
	polygon.AddVertex (479, 59);
	polygon.AddVertex (648, 57);
	polygon.AddVertex (599, 499);
	polygon.AddVertex (209, 540);
	polygon.AddVertex (208, 501);
	polygon.AddVertex (568, 473);
	polygon.AddVertex (609, 82);
	polygon.AddVertex (505, 89);
	polygon.AddVertex (529, 363);
	polygon.AddVertex (262, 359);
	polygon.AddVertex (259, 390);
	polygon.AddVertex (553, 393);
	polygon.AddVertex (543, 454);
	polygon.AddVertex (208, 465);
	polygon.AddVertex (93, 128);
	polygon.AddVertex (266, 288);
	polygon.AddVertex (335, 172);
	test.AssertEqualNum (polygon.GetArea (), 100896, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test08', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (248, 295);
	polygon.AddVertex (229, 125);
	polygon.AddVertex (374, 320);
	polygon.AddVertex (404, 168);
	polygon.AddVertex (418, 483);
	polygon.AddVertex (278, 242);
	test.AssertEqualNum (polygon.GetArea (), 18655.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test09', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (197, 332);
	polygon.AddVertex (271, 136);
	polygon.AddVertex (319, 394);
	polygon.AddVertex (259, 261);
	test.AssertEqualNum (polygon.GetArea (), 7997, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test10', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (249, 323);
	polygon.AddVertex (304, 253);
	polygon.AddVertex (257, 231);
	polygon.AddVertex (239, 126);
	polygon.AddVertex (152, 138);
	polygon.AddVertex (177, 237);
	polygon.AddVertex (213, 198);
	polygon.AddVertex (234, 225);
	polygon.AddVertex (202, 261);
	polygon.AddVertex (231, 269);
	polygon.AddVertex (223, 308);
	polygon.AddVertex (131, 321);
	polygon.AddVertex (139, 411);
	polygon.AddVertex (242, 431);
	polygon.AddVertex (209, 356);
	polygon.AddVertex (344, 392);
	polygon.AddVertex (343, 302);
	polygon.AddVertex (422, 312);
	polygon.AddVertex (414, 221);
	polygon.AddVertex (343, 274);
	polygon.AddVertex (350, 228);
	test.AssertEqualNum (polygon.GetArea (), 37323.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test11', function (test) {
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (128, 294);
	polygon.AddVertex (128, 306);
	polygon.AddVertex (139, 315);
	polygon.AddVertex (152, 317);
	polygon.AddVertex (161, 314);
	polygon.AddVertex (176, 307);
	polygon.AddVertex (177, 291);
	polygon.AddVertex (168, 277);
	polygon.AddVertex (153, 275);
	polygon.AddVertex (154, 104);
	polygon.AddVertex (166, 95);
	polygon.AddVertex (179, 99);
	polygon.AddVertex (186, 112);
	polygon.AddVertex (175, 123);
	polygon.AddVertex (172, 141);
	polygon.AddVertex (178, 147);
	polygon.AddVertex (191, 150);
	polygon.AddVertex (204, 142);
	polygon.AddVertex (205, 125);
	polygon.AddVertex (205, 115);
	polygon.AddVertex (219, 107);
	polygon.AddVertex (232, 116);
	polygon.AddVertex (232, 132);
	polygon.AddVertex (228, 144);
	polygon.AddVertex (220, 156);
	polygon.AddVertex (198, 162);
	polygon.AddVertex (184, 162);
	polygon.AddVertex (174, 167);
	polygon.AddVertex (178, 183);
	polygon.AddVertex (199, 193);
	polygon.AddVertex (223, 182);
	polygon.AddVertex (241, 172);
	polygon.AddVertex (254, 159);
	polygon.AddVertex (275, 157);
	polygon.AddVertex (275, 172);
	polygon.AddVertex (275, 179);
	polygon.AddVertex (274, 186);
	polygon.AddVertex (267, 192);
	polygon.AddVertex (246, 195);
	polygon.AddVertex (253, 184);
	polygon.AddVertex (251, 177);
	polygon.AddVertex (239, 183);
	polygon.AddVertex (234, 197);
	polygon.AddVertex (234, 207);
	polygon.AddVertex (250, 208);
	polygon.AddVertex (261, 208);
	polygon.AddVertex (268, 220);
	polygon.AddVertex (266, 232);
	polygon.AddVertex (247, 239);
	polygon.AddVertex (232, 240);
	polygon.AddVertex (228, 227);
	polygon.AddVertex (228, 217);
	polygon.AddVertex (222, 210);
	polygon.AddVertex (214, 211);
	polygon.AddVertex (206, 222);
	polygon.AddVertex (215, 238);
	polygon.AddVertex (229, 259);
	polygon.AddVertex (217, 271);
	polygon.AddVertex (221, 284);
	polygon.AddVertex (234, 285);
	polygon.AddVertex (249, 282);
	polygon.AddVertex (256, 303);
	polygon.AddVertex (233, 315);
	polygon.AddVertex (205, 328);
	polygon.AddVertex (208, 340);
	polygon.AddVertex (235, 349);
	polygon.AddVertex (255, 337);
	polygon.AddVertex (279, 339);
	polygon.AddVertex (270, 363);
	polygon.AddVertex (252, 369);
	polygon.AddVertex (217, 376);
	polygon.AddVertex (209, 360);
	polygon.AddVertex (191, 360);
	polygon.AddVertex (191, 390);
	polygon.AddVertex (223, 399);
	polygon.AddVertex (303, 407);
	polygon.AddVertex (312, 366);
	polygon.AddVertex (323, 338);
	polygon.AddVertex (312, 318);
	polygon.AddVertex (310, 304);
	polygon.AddVertex (321, 298);
	polygon.AddVertex (321, 278);
	polygon.AddVertex (295, 270);
	polygon.AddVertex (298, 263);
	polygon.AddVertex (303, 255);
	polygon.AddVertex (307, 237);
	polygon.AddVertex (302, 230);
	polygon.AddVertex (316, 204);
	polygon.AddVertex (313, 180);
	polygon.AddVertex (318, 171);
	polygon.AddVertex (329, 165);
	polygon.AddVertex (348, 170);
	polygon.AddVertex (357, 188);
	polygon.AddVertex (365, 188);
	polygon.AddVertex (374, 178);
	polygon.AddVertex (379, 162);
	polygon.AddVertex (364, 140);
	polygon.AddVertex (343, 132);
	polygon.AddVertex (302, 132);
	polygon.AddVertex (293, 122);
	polygon.AddVertex (295, 105);
	polygon.AddVertex (293, 87);
	polygon.AddVertex (278, 80);
	polygon.AddVertex (259, 75);
	polygon.AddVertex (257, 69);
	polygon.AddVertex (246, 60);
	polygon.AddVertex (230, 63);
	polygon.AddVertex (224, 81);
	polygon.AddVertex (224, 87);
	polygon.AddVertex (209, 91);
	polygon.AddVertex (201, 88);
	polygon.AddVertex (204, 64);
	polygon.AddVertex (200, 45);
	polygon.AddVertex (168, 43);
	polygon.AddVertex (121, 44);
	polygon.AddVertex (109, 69);
	polygon.AddVertex (134, 86);
	polygon.AddVertex (114, 97);
	polygon.AddVertex (132, 119);
	polygon.AddVertex (120, 129);
	polygon.AddVertex (142, 148);
	polygon.AddVertex (100, 179);
	polygon.AddVertex (136, 190);
	polygon.AddVertex (93, 220);
	polygon.AddVertex (131, 221);
	polygon.AddVertex (104, 246);
	polygon.AddVertex (136, 248);
	polygon.AddVertex (98, 280);
	test.AssertEqualNum (polygon.GetArea (), 42850.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	test.Assert (CheckSimpleTriangulation (polygon));
});

generatedSuite.AddTest ('Test12', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (375, 474);
	polygon.AddVertex (228, 240);
	polygon.AddVertex (497, 212);
	polygon.AddContour ();
	polygon.AddVertex (403, 269);
	polygon.AddVertex (311, 275);
	polygon.AddVertex (373, 387);
	test.AssertEqualNum (polygon.GetArea (), 28193, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test13', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (146, 387);
	polygon.AddVertex (167, 453);
	polygon.AddVertex (304, 491);
	polygon.AddVertex (249, 551);
	polygon.AddVertex (385, 561);
	polygon.AddVertex (362, 429);
	polygon.AddVertex (273, 441);
	polygon.AddVertex (277, 367);
	polygon.AddVertex (443, 367);
	polygon.AddVertex (413, 473);
	polygon.AddVertex (476, 517);
	polygon.AddVertex (654, 544);
	polygon.AddVertex (499, 479);
	polygon.AddVertex (522, 441);
	polygon.AddVertex (604, 473);
	polygon.AddVertex (601, 508);
	polygon.AddVertex (631, 508);
	polygon.AddVertex (637, 460);
	polygon.AddVertex (712, 465);
	polygon.AddVertex (696, 370);
	polygon.AddVertex (571, 406);
	polygon.AddVertex (583, 431);
	polygon.AddVertex (625, 419);
	polygon.AddVertex (637, 445);
	polygon.AddVertex (574, 444);
	polygon.AddVertex (511, 377);
	polygon.AddVertex (492, 437);
	polygon.AddVertex (473, 426);
	polygon.AddVertex (511, 355);
	polygon.AddVertex (406, 317);
	polygon.AddVertex (419, 293);
	polygon.AddVertex (573, 293);
	polygon.AddVertex (565, 349);
	polygon.AddVertex (673, 349);
	polygon.AddVertex (695, 282);
	polygon.AddVertex (582, 237);
	polygon.AddVertex (602, 181);
	polygon.AddVertex (658, 195);
	polygon.AddVertex (664, 243);
	polygon.AddVertex (696, 243);
	polygon.AddVertex (706, 202);
	polygon.AddVertex (735, 205);
	polygon.AddVertex (737, 181);
	polygon.AddVertex (657, 146);
	polygon.AddVertex (658, 99);
	polygon.AddVertex (602, 77);
	polygon.AddVertex (590, 128);
	polygon.AddVertex (535, 102);
	polygon.AddVertex (517, 44);
	polygon.AddVertex (405, 64);
	polygon.AddVertex (488, 117);
	polygon.AddVertex (483, 178);
	polygon.AddVertex (439, 177);
	polygon.AddVertex (400, 103);
	polygon.AddVertex (302, 103);
	polygon.AddVertex (322, 139);
	polygon.AddVertex (363, 157);
	polygon.AddVertex (369, 215);
	polygon.AddVertex (339, 220);
	polygon.AddVertex (283, 178);
	polygon.AddVertex (153, 178);
	polygon.AddVertex (64, 178);
	polygon.AddVertex (54, 268);
	polygon.AddVertex (128, 263);
	polygon.AddVertex (116, 224);
	polygon.AddVertex (199, 223);
	polygon.AddVertex (192, 279);
	polygon.AddVertex (234, 289);
	polygon.AddVertex (258, 244);
	polygon.AddVertex (366, 263);
	polygon.AddVertex (340, 324);
	polygon.AddVertex (192, 328);
	test.AssertEqualNum (polygon.GetArea (), 151033, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test14', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (131, 357);
	polygon.AddVertex (214, 511);
	polygon.AddVertex (290, 445);
	polygon.AddVertex (311, 507);
	polygon.AddVertex (354, 508);
	polygon.AddVertex (324, 438);
	polygon.AddVertex (405, 461);
	polygon.AddVertex (370, 508);
	polygon.AddVertex (427, 524);
	polygon.AddVertex (441, 477);
	polygon.AddVertex (453, 539);
	polygon.AddVertex (499, 524);
	polygon.AddVertex (486, 564);
	polygon.AddVertex (545, 556);
	polygon.AddVertex (518, 575);
	polygon.AddVertex (543, 574);
	polygon.AddVertex (608, 550);
	polygon.AddVertex (616, 580);
	polygon.AddVertex (677, 558);
	polygon.AddVertex (624, 490);
	polygon.AddVertex (681, 492);
	polygon.AddVertex (660, 394);
	polygon.AddVertex (718, 413);
	polygon.AddVertex (726, 315);
	polygon.AddVertex (718, 302);
	polygon.AddVertex (694, 283);
	polygon.AddVertex (652, 275);
	polygon.AddVertex (594, 281);
	polygon.AddVertex (576, 298);
	polygon.AddVertex (564, 319);
	polygon.AddVertex (557, 351);
	polygon.AddVertex (570, 387);
	polygon.AddVertex (589, 403);
	polygon.AddVertex (609, 423);
	polygon.AddVertex (596, 442);
	polygon.AddVertex (495, 420);
	polygon.AddVertex (486, 385);
	polygon.AddVertex (496, 344);
	polygon.AddVertex (511, 311);
	polygon.AddVertex (530, 291);
	polygon.AddVertex (558, 269);
	polygon.AddVertex (595, 261);
	polygon.AddVertex (639, 254);
	polygon.AddVertex (683, 259);
	polygon.AddVertex (707, 271);
	polygon.AddVertex (724, 279);
	polygon.AddVertex (739, 276);
	polygon.AddVertex (754, 262);
	polygon.AddVertex (760, 242);
	polygon.AddVertex (756, 226);
	polygon.AddVertex (734, 208);
	polygon.AddVertex (682, 199);
	polygon.AddVertex (661, 149);
	polygon.AddVertex (630, 96);
	polygon.AddVertex (476, 69);
	polygon.AddVertex (513, 134);
	polygon.AddVertex (543, 181);
	polygon.AddVertex (507, 221);
	polygon.AddVertex (491, 210);
	polygon.AddVertex (475, 199);
	polygon.AddVertex (449, 190);
	polygon.AddVertex (410, 190);
	polygon.AddVertex (394, 195);
	polygon.AddVertex (379, 202);
	polygon.AddVertex (357, 224);
	polygon.AddVertex (355, 243);
	polygon.AddVertex (359, 261);
	polygon.AddVertex (375, 276);
	polygon.AddVertex (388, 284);
	polygon.AddVertex (405, 282);
	polygon.AddVertex (420, 278);
	polygon.AddVertex (427, 268);
	polygon.AddVertex (429, 260);
	polygon.AddVertex (429, 252);
	polygon.AddVertex (426, 238);
	polygon.AddVertex (439, 230);
	polygon.AddVertex (451, 230);
	polygon.AddVertex (469, 246);
	polygon.AddVertex (470, 261);
	polygon.AddVertex (470, 284);
	polygon.AddVertex (453, 305);
	polygon.AddVertex (403, 313);
	polygon.AddVertex (350, 301);
	polygon.AddVertex (323, 266);
	polygon.AddVertex (317, 198);
	polygon.AddVertex (322, 143);
	polygon.AddVertex (241, 114);
	polygon.AddVertex (236, 238);
	polygon.AddVertex (159, 213);
	polygon.AddVertex (312, 356);
	polygon.AddVertex (179, 303);
	test.AssertEqualNum (polygon.GetArea (), 163611, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test15', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (110, 319);
	polygon.AddVertex (113, 477);
	polygon.AddVertex (202, 496);
	polygon.AddVertex (172, 532);
	polygon.AddVertex (236, 545);
	polygon.AddVertex (254, 461);
	polygon.AddVertex (144, 448);
	polygon.AddVertex (184, 381);
	polygon.AddVertex (365, 388);
	polygon.AddVertex (325, 498);
	polygon.AddVertex (375, 516);
	polygon.AddVertex (355, 551);
	polygon.AddVertex (404, 555);
	polygon.AddVertex (409, 500);
	polygon.AddVertex (472, 531);
	polygon.AddVertex (515, 493);
	polygon.AddVertex (457, 439);
	polygon.AddVertex (557, 409);
	polygon.AddVertex (552, 346);
	polygon.AddVertex (582, 359);
	polygon.AddVertex (587, 432);
	polygon.AddVertex (627, 437);
	polygon.AddVertex (625, 413);
	polygon.AddVertex (658, 415);
	polygon.AddVertex (661, 385);
	polygon.AddVertex (681, 392);
	polygon.AddVertex (696, 362);
	polygon.AddVertex (602, 326);
	polygon.AddVertex (635, 279);
	polygon.AddVertex (686, 302);
	polygon.AddVertex (692, 241);
	polygon.AddVertex (631, 180);
	polygon.AddVertex (566, 284);
	polygon.AddVertex (575, 314);
	polygon.AddVertex (472, 311);
	polygon.AddVertex (492, 362);
	polygon.AddVertex (422, 388);
	polygon.AddVertex (387, 338);
	polygon.AddVertex (284, 363);
	polygon.AddVertex (251, 315);
	polygon.AddVertex (279, 258);
	polygon.AddVertex (373, 291);
	polygon.AddVertex (377, 237);
	polygon.AddVertex (423, 250);
	polygon.AddVertex (412, 285);
	polygon.AddVertex (433, 286);
	polygon.AddVertex (444, 254);
	polygon.AddVertex (473, 262);
	polygon.AddVertex (469, 282);
	polygon.AddVertex (486, 283);
	polygon.AddVertex (487, 268);
	polygon.AddVertex (501, 270);
	polygon.AddVertex (502, 282);
	polygon.AddVertex (523, 282);
	polygon.AddVertex (528, 260);
	polygon.AddVertex (559, 229);
	polygon.AddVertex (518, 187);
	polygon.AddVertex (534, 135);
	polygon.AddVertex (586, 135);
	polygon.AddVertex (610, 84);
	polygon.AddVertex (658, 83);
	polygon.AddVertex (662, 47);
	polygon.AddVertex (552, 53);
	polygon.AddVertex (548, 92);
	polygon.AddVertex (484, 80);
	polygon.AddVertex (423, 54);
	polygon.AddVertex (441, 129);
	polygon.AddVertex (469, 153);
	polygon.AddVertex (461, 190);
	polygon.AddVertex (383, 188);
	polygon.AddVertex (386, 146);
	polygon.AddVertex (278, 142);
	polygon.AddVertex (341, 197);
	polygon.AddVertex (311, 218);
	polygon.AddVertex (237, 183);
	polygon.AddVertex (235, 111);
	polygon.AddVertex (139, 93);
	polygon.AddVertex (157, 181);
	polygon.AddVertex (221, 233);
	polygon.AddVertex (211, 283);
	polygon.AddVertex (153, 255);
	test.AssertEqualNum (polygon.GetArea (), 132181.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test16', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (208, 387);
	polygon.AddVertex (240, 204);
	polygon.AddVertex (442, 224);
	polygon.AddVertex (423, 406);
	polygon.AddContour ();
	polygon.AddVertex (262, 340);
	polygon.AddVertex (324, 345);
	polygon.AddVertex (340, 285);
	polygon.AddVertex (284, 270);
	polygon.AddContour ();
	polygon.AddVertex (362, 339);
	polygon.AddVertex (395, 348);
	polygon.AddVertex (397, 314);
	polygon.AddContour ();
	polygon.AddVertex (328, 361);
	polygon.AddVertex (352, 361);
	polygon.AddVertex (347, 341);
	polygon.AddContour ();
	polygon.AddVertex (330, 244);
	polygon.AddVertex (389, 259);
	polygon.AddVertex (380, 235);
	test.AssertEqualNum (polygon.GetArea (), 33073, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test17', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (180, 420);
	polygon.AddVertex (572, 461);
	polygon.AddVertex (601, 162);
	polygon.AddVertex (150, 102);
	polygon.AddContour ();
	polygon.AddVertex (262, 352);
	polygon.AddVertex (219, 196);
	polygon.AddVertex (290, 197);
	polygon.AddContour ();
	polygon.AddVertex (376, 359);
	polygon.AddVertex (304, 248);
	polygon.AddVertex (430, 236);
	polygon.AddVertex (458, 319);
	polygon.AddContour ();
	polygon.AddVertex (521, 397);
	polygon.AddVertex (475, 245);
	polygon.AddVertex (543, 242);
	polygon.AddVertex (536, 337);
	polygon.AddContour ();
	polygon.AddVertex (345, 405);
	polygon.AddVertex (309, 380);
	polygon.AddVertex (324, 342);
	polygon.AddVertex (340, 352);
	polygon.AddContour ();
	polygon.AddVertex (469, 396);
	polygon.AddVertex (422, 361);
	polygon.AddVertex (476, 349);
	polygon.AddVertex (491, 375);
	polygon.AddContour ();
	polygon.AddVertex (483, 199);
	polygon.AddVertex (313, 201);
	polygon.AddVertex (452, 152);
	polygon.AddVertex (519, 185);
	polygon.AddContour ();
	polygon.AddVertex (258, 173);
	polygon.AddVertex (192, 165);
	polygon.AddVertex (192, 132);
	polygon.AddVertex (263, 140);
	polygon.AddVertex (333, 149);
	polygon.AddVertex (308, 174);
	polygon.AddVertex (291, 163);
	polygon.AddVertex (257, 151);
	polygon.AddVertex (214, 151);
	polygon.AddVertex (260, 160);
	polygon.AddVertex (285, 176);
	polygon.AddContour ();
	polygon.AddVertex (564, 206);
	polygon.AddVertex (510, 227);
	polygon.AddVertex (507, 204);
	polygon.AddVertex (533, 198);
	polygon.AddContour ();
	polygon.AddVertex (255, 398);
	polygon.AddVertex (225, 381);
	polygon.AddVertex (203, 273);
	polygon.AddVertex (227, 285);
	polygon.AddVertex (242, 363);
	polygon.AddVertex (273, 384);
	polygon.AddVertex (290, 332);
	polygon.AddVertex (318, 342);
	polygon.AddVertex (293, 398);
	polygon.AddContour ();
	polygon.AddVertex (451, 429);
	polygon.AddVertex (383, 416);
	polygon.AddVertex (393, 371);
	polygon.AddContour ();
	polygon.AddVertex (560, 424);
	polygon.AddVertex (491, 445);
	polygon.AddVertex (492, 415);
	polygon.AddVertex (525, 411);
	test.AssertEqualNum (polygon.GetArea (), 87509, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test18', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (180, 420);
	polygon.AddVertex (572, 461);
	polygon.AddVertex (601, 162);
	polygon.AddVertex (150, 102);
	polygon.AddContour ();
	polygon.AddVertex (262, 352);
	polygon.AddVertex (219, 196);
	polygon.AddVertex (290, 197);
	polygon.AddContour ();
	polygon.AddVertex (376, 359);
	polygon.AddVertex (304, 248);
	polygon.AddVertex (430, 236);
	polygon.AddVertex (458, 319);
	polygon.AddContour ();
	polygon.AddVertex (521, 397);
	polygon.AddVertex (475, 245);
	polygon.AddVertex (543, 242);
	polygon.AddVertex (536, 337);
	polygon.AddContour ();
	polygon.AddVertex (345, 405);
	polygon.AddVertex (309, 380);
	polygon.AddVertex (324, 342);
	polygon.AddVertex (340, 352);
	polygon.AddContour ();
	polygon.AddVertex (469, 396);
	polygon.AddVertex (422, 361);
	polygon.AddVertex (476, 349);
	polygon.AddVertex (491, 375);
	polygon.AddContour ();
	polygon.AddVertex (483, 199);
	polygon.AddVertex (313, 201);
	polygon.AddVertex (452, 152);
	polygon.AddVertex (519, 185);
	polygon.AddContour ();
	polygon.AddVertex (258, 173);
	polygon.AddVertex (192, 165);
	polygon.AddVertex (192, 132);
	polygon.AddVertex (263, 140);
	polygon.AddVertex (333, 149);
	polygon.AddVertex (308, 174);
	polygon.AddVertex (291, 163);
	polygon.AddVertex (257, 151);
	polygon.AddVertex (214, 151);
	polygon.AddVertex (260, 160);
	polygon.AddVertex (285, 176);
	polygon.AddContour ();
	polygon.AddVertex (564, 206);
	polygon.AddVertex (510, 227);
	polygon.AddVertex (507, 204);
	polygon.AddVertex (533, 198);
	polygon.AddContour ();
	polygon.AddVertex (255, 398);
	polygon.AddVertex (225, 381);
	polygon.AddVertex (203, 273);
	polygon.AddVertex (227, 285);
	polygon.AddVertex (242, 363);
	polygon.AddVertex (273, 384);
	polygon.AddVertex (290, 332);
	polygon.AddVertex (318, 342);
	polygon.AddVertex (293, 398);
	polygon.AddContour ();
	polygon.AddVertex (451, 429);
	polygon.AddVertex (383, 416);
	polygon.AddVertex (393, 371);
	polygon.AddContour ();
	polygon.AddVertex (560, 424);
	polygon.AddVertex (491, 445);
	polygon.AddVertex (492, 415);
	polygon.AddVertex (525, 411);
	polygon.AddContour ();
	polygon.AddVertex (569, 314);
	polygon.AddVertex (567, 396);
	polygon.AddVertex (536, 397);
	polygon.AddVertex (557, 255);
	polygon.AddVertex (581, 257);
	test.AssertEqualNum (polygon.GetArea (), 84071.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test19', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (94, 553);
	polygon.AddVertex (709, 549);
	polygon.AddVertex (713, 43);
	polygon.AddVertex (85, 44);
	polygon.AddContour ();
	polygon.AddVertex (217, 401);
	polygon.AddVertex (223, 202);
	polygon.AddVertex (538, 207);
	polygon.AddVertex (543, 392);
	polygon.AddContour ();
	polygon.AddVertex (176, 128);
	polygon.AddVertex (629, 136);
	polygon.AddVertex (637, 368);
	polygon.AddVertex (594, 364);
	polygon.AddVertex (597, 175);
	polygon.AddVertex (181, 177);
	polygon.AddVertex (186, 447);
	polygon.AddVertex (592, 437);
	polygon.AddVertex (593, 377);
	polygon.AddVertex (639, 381);
	polygon.AddVertex (627, 477);
	polygon.AddVertex (142, 492);
	polygon.AddVertex (136, 167);
	test.AssertEqualNum (polygon.GetArea (), 190194.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test20', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (64, 547);
	polygon.AddVertex (691, 539);
	polygon.AddVertex (696, 31);
	polygon.AddContour ();
	polygon.AddVertex (676, 127);
	polygon.AddVertex (615, 124);
	polygon.AddVertex (654, 85);
	polygon.AddVertex (680, 55);
	polygon.AddVertex (684, 92);
	polygon.AddContour ();
	polygon.AddVertex (675, 186);
	polygon.AddVertex (538, 185);
	polygon.AddVertex (604, 142);
	polygon.AddVertex (665, 146);
	polygon.AddContour ();
	polygon.AddVertex (669, 268);
	polygon.AddVertex (437, 272);
	polygon.AddVertex (521, 201);
	polygon.AddVertex (660, 206);
	polygon.AddContour ();
	polygon.AddVertex (667, 308);
	polygon.AddVertex (385, 309);
	polygon.AddVertex (415, 291);
	polygon.AddVertex (653, 285);
	polygon.AddContour ();
	polygon.AddVertex (676, 364);
	polygon.AddVertex (312, 365);
	polygon.AddVertex (371, 327);
	polygon.AddVertex (663, 325);
	polygon.AddContour ();
	polygon.AddVertex (678, 432);
	polygon.AddVertex (232, 437);
	polygon.AddVertex (288, 387);
	polygon.AddVertex (668, 387);
	polygon.AddContour ();
	polygon.AddVertex (669, 485);
	polygon.AddVertex (175, 488);
	polygon.AddVertex (208, 457);
	polygon.AddVertex (673, 453);
	polygon.AddContour ();
	polygon.AddVertex (674, 529);
	polygon.AddVertex (108, 531);
	polygon.AddVertex (138, 511);
	polygon.AddVertex (647, 505);
	test.AssertEqualNum (polygon.GetArea (), 76049, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test21', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (66, 559);
	polygon.AddVertex (743, 588);
	polygon.AddVertex (750, 59);
	polygon.AddVertex (705, 58);
	polygon.AddVertex (691, 535);
	polygon.AddVertex (604, 530);
	polygon.AddVertex (646, 126);
	polygon.AddVertex (603, 126);
	polygon.AddVertex (557, 531);
	polygon.AddVertex (463, 530);
	polygon.AddVertex (517, 184);
	polygon.AddVertex (459, 181);
	polygon.AddVertex (407, 523);
	polygon.AddVertex (340, 524);
	polygon.AddVertex (393, 264);
	polygon.AddVertex (325, 263);
	polygon.AddVertex (293, 513);
	polygon.AddVertex (250, 514);
	polygon.AddVertex (250, 325);
	polygon.AddVertex (201, 318);
	polygon.AddVertex (190, 511);
	polygon.AddVertex (129, 511);
	polygon.AddVertex (137, 322);
	polygon.AddVertex (82, 328);
	polygon.AddContour ();
	polygon.AddVertex (714, 123);
	polygon.AddVertex (716, 84);
	polygon.AddVertex (736, 86);
	polygon.AddVertex (734, 115);
	polygon.AddContour ();
	polygon.AddVertex (606, 183);
	polygon.AddVertex (612, 143);
	polygon.AddVertex (637, 144);
	polygon.AddVertex (628, 179);
	polygon.AddContour ();
	polygon.AddVertex (463, 259);
	polygon.AddVertex (461, 209);
	polygon.AddVertex (493, 211);
	polygon.AddVertex (495, 265);
	polygon.AddContour ();
	polygon.AddVertex (312, 469);
	polygon.AddVertex (336, 299);
	polygon.AddVertex (361, 298);
	polygon.AddVertex (333, 483);
	polygon.AddContour ();
	polygon.AddVertex (217, 490);
	polygon.AddVertex (209, 379);
	polygon.AddVertex (228, 373);
	polygon.AddVertex (234, 430);
	polygon.AddContour ();
	polygon.AddVertex (90, 488);
	polygon.AddVertex (98, 371);
	polygon.AddVertex (115, 371);
	polygon.AddVertex (119, 468);
	polygon.AddContour ();
	polygon.AddVertex (96, 553);
	polygon.AddVertex (108, 536);
	polygon.AddVertex (697, 556);
	polygon.AddVertex (703, 571);
	polygon.AddVertex (357, 564);
	test.AssertEqualNum (polygon.GetArea (), 109202, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test22', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (84, 449);
	polygon.AddVertex (139, 503);
	polygon.AddVertex (165, 413);
	polygon.AddVertex (181, 510);
	polygon.AddVertex (194, 449);
	polygon.AddVertex (207, 492);
	polygon.AddVertex (231, 446);
	polygon.AddVertex (231, 496);
	polygon.AddVertex (250, 466);
	polygon.AddVertex (256, 488);
	polygon.AddVertex (271, 446);
	polygon.AddVertex (292, 477);
	polygon.AddVertex (306, 419);
	polygon.AddVertex (332, 522);
	polygon.AddVertex (352, 422);
	polygon.AddVertex (373, 525);
	polygon.AddVertex (394, 412);
	polygon.AddVertex (411, 505);
	polygon.AddVertex (447, 410);
	polygon.AddVertex (476, 469);
	polygon.AddVertex (481, 426);
	polygon.AddVertex (499, 487);
	polygon.AddVertex (511, 439);
	polygon.AddVertex (536, 500);
	polygon.AddVertex (548, 437);
	polygon.AddVertex (586, 519);
	polygon.AddVertex (598, 428);
	polygon.AddVertex (667, 537);
	polygon.AddVertex (667, 449);
	polygon.AddVertex (711, 500);
	polygon.AddVertex (696, 434);
	polygon.AddVertex (272, 271);
	polygon.AddContour ();
	polygon.AddVertex (266, 397);
	polygon.AddVertex (217, 364);
	polygon.AddVertex (405, 354);
	polygon.AddContour ();
	polygon.AddVertex (526, 407);
	polygon.AddVertex (442, 381);
	polygon.AddVertex (468, 375);
	polygon.AddVertex (510, 378);
	polygon.AddVertex (554, 394);
	polygon.AddVertex (581, 411);
	polygon.AddContour ();
	polygon.AddVertex (374, 398);
	polygon.AddVertex (385, 373);
	polygon.AddVertex (402, 390);
	polygon.AddVertex (411, 375);
	polygon.AddVertex (420, 397);
	polygon.AddVertex (429, 380);
	polygon.AddVertex (441, 403);
	polygon.AddVertex (416, 470);
	polygon.AddVertex (406, 401);
	polygon.AddContour ();
	polygon.AddVertex (126, 465);
	polygon.AddVertex (107, 447);
	polygon.AddVertex (184, 368);
	polygon.AddVertex (255, 406);
	polygon.AddVertex (250, 418);
	polygon.AddVertex (178, 389);
	polygon.AddVertex (144, 420);
	polygon.AddVertex (151, 432);
	polygon.AddVertex (142, 455);
	polygon.AddContour ();
	polygon.AddVertex (238, 339);
	polygon.AddVertex (264, 304);
	polygon.AddVertex (276, 342);
	polygon.AddVertex (298, 317);
	polygon.AddVertex (312, 327);
	polygon.AddVertex (323, 318);
	polygon.AddVertex (352, 345);
	polygon.AddVertex (369, 326);
	polygon.AddVertex (373, 349);
	polygon.AddVertex (314, 353);
	polygon.AddVertex (312, 339);
	polygon.AddVertex (275, 355);
	test.AssertEqualNum (polygon.GetArea (), 56177.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test23', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (84, 534);
	polygon.AddVertex (98, 167);
	polygon.AddVertex (663, 156);
	polygon.AddVertex (145, 215);
	polygon.AddContour ();
	polygon.AddVertex (99, 413);
	polygon.AddVertex (130, 203);
	polygon.AddVertex (458, 173);
	polygon.AddVertex (109, 179);
	test.AssertEqualNum (polygon.GetArea (), 15951, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test24', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (73, 538);
	polygon.AddVertex (724, 555);
	polygon.AddVertex (732, 74);
	polygon.AddVertex (56, 58);
	polygon.AddContour ();
	polygon.AddVertex (93, 520);
	polygon.AddVertex (97, 443);
	polygon.AddVertex (150, 452);
	polygon.AddVertex (148, 518);
	polygon.AddContour ();
	polygon.AddVertex (208, 512);
	polygon.AddVertex (188, 462);
	polygon.AddVertex (251, 451);
	polygon.AddVertex (262, 497);
	polygon.AddContour ();
	polygon.AddVertex (312, 515);
	polygon.AddVertex (284, 450);
	polygon.AddVertex (441, 456);
	polygon.AddVertex (406, 515);
	polygon.AddContour ();
	polygon.AddVertex (535, 530);
	polygon.AddVertex (495, 448);
	polygon.AddVertex (624, 446);
	polygon.AddVertex (625, 502);
	polygon.AddContour ();
	polygon.AddVertex (676, 422);
	polygon.AddVertex (597, 375);
	polygon.AddVertex (646, 307);
	polygon.AddVertex (708, 342);
	polygon.AddContour ();
	polygon.AddVertex (463, 413);
	polygon.AddVertex (515, 323);
	polygon.AddVertex (573, 341);
	polygon.AddVertex (590, 428);
	polygon.AddContour ();
	polygon.AddVertex (386, 403);
	polygon.AddVertex (291, 353);
	polygon.AddVertex (354, 305);
	polygon.AddVertex (451, 345);
	polygon.AddContour ();
	polygon.AddVertex (243, 406);
	polygon.AddVertex (174, 373);
	polygon.AddVertex (243, 300);
	polygon.AddVertex (290, 378);
	polygon.AddContour ();
	polygon.AddVertex (178, 421);
	polygon.AddVertex (110, 422);
	polygon.AddVertex (102, 296);
	polygon.AddVertex (160, 295);
	polygon.AddVertex (129, 364);
	polygon.AddContour ();
	polygon.AddVertex (106, 270);
	polygon.AddVertex (93, 206);
	polygon.AddVertex (198, 208);
	polygon.AddVertex (195, 262);
	polygon.AddContour ();
	polygon.AddVertex (219, 287);
	polygon.AddVertex (252, 200);
	polygon.AddVertex (335, 224);
	polygon.AddVertex (317, 271);
	polygon.AddContour ();
	polygon.AddVertex (387, 288);
	polygon.AddVertex (356, 261);
	polygon.AddVertex (394, 194);
	polygon.AddVertex (456, 198);
	polygon.AddContour ();
	polygon.AddVertex (464, 301);
	polygon.AddVertex (497, 223);
	polygon.AddVertex (565, 229);
	polygon.AddVertex (562, 285);
	polygon.AddContour ();
	polygon.AddVertex (629, 279);
	polygon.AddVertex (601, 265);
	polygon.AddVertex (596, 202);
	polygon.AddVertex (683, 192);
	polygon.AddContour ();
	polygon.AddVertex (545, 204);
	polygon.AddVertex (482, 194);
	polygon.AddVertex (491, 119);
	polygon.AddVertex (576, 108);
	polygon.AddContour ();
	polygon.AddVertex (700, 143);
	polygon.AddVertex (640, 167);
	polygon.AddVertex (616, 109);
	polygon.AddVertex (675, 102);
	polygon.AddContour ();
	polygon.AddVertex (440, 112);
	polygon.AddVertex (372, 153);
	polygon.AddVertex (305, 129);
	polygon.AddVertex (311, 97);
	polygon.AddVertex (426, 87);
	polygon.AddContour ();
	polygon.AddVertex (321, 178);
	polygon.AddVertex (285, 195);
	polygon.AddVertex (157, 161);
	polygon.AddVertex (175, 126);
	polygon.AddVertex (265, 96);
	polygon.AddContour ();
	polygon.AddVertex (95, 172);
	polygon.AddVertex (68, 84);
	polygon.AddVertex (194, 71);
	polygon.AddVertex (106, 107);
	test.AssertEqualNum (polygon.GetArea (), 207382.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

generatedSuite.AddTest ('Test25', function (test) {
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (81, 542);
	polygon.AddVertex (225, 542);
	polygon.AddVertex (544, 542);
	polygon.AddVertex (741, 386);
	polygon.AddVertex (689, 133);
	polygon.AddVertex (385, 33);
	polygon.AddVertex (86, 47);
	polygon.AddVertex (32, 244);
	polygon.AddVertex (116, 95);
	polygon.AddVertex (335, 73);
	polygon.AddVertex (488, 106);
	polygon.AddVertex (656, 152);
	polygon.AddVertex (684, 358);
	polygon.AddVertex (536, 491);
	polygon.AddVertex (591, 180);
	polygon.AddVertex (125, 137);
	polygon.AddVertex (32, 378);
	polygon.AddContour ();
	polygon.AddVertex (107, 500);
	polygon.AddVertex (66, 376);
	polygon.AddVertex (144, 160);
	polygon.AddVertex (568, 198);
	polygon.AddVertex (505, 512);
	test.AssertEqualNum (polygon.GetArea (), 94397.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise, JSM.Eps);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex, JSM.Eps);
	var simple = JSM.ConvertPolygonToSimplePolygon (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

}
