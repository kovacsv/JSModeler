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

function CheckSimpleTriangulation (polygon)
{
	var triangles = JSM.TriangulatePolygon2D (polygon);
	return CheckCalculatedTriangulation (polygon, triangles);
}

function CheckHoleVertexMapping (polygon)
{
	var mapping = [];
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon, mapping);
	if (mapping.length != simple.VertexCount ()) {
		return false;
	}
	var i, map, originalVertex, simpleVertex;
	for (i = 0; i < mapping.length; i++) {
		map = mapping[i];
		originalVertex = polygon.GetContourVertex (map[0], map[1]);
		simpleVertex = simple.GetVertex (i);
		if (!simpleVertex.IsEqual (originalVertex)) {
			return false;
		}
	}
	return true;
}

var simplePolygonSuite = unitTest.AddTestSuite ('SimplePolygonTriangulationTest');

simplePolygonSuite.AddTest ('InvalidPolygonTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	var triangles = JSM.TriangulatePolygon2D (polygon);
	test.AssertEqual (triangles, null);
	
	polygon.AddVertex (0.0, 0.0);
	triangles = JSM.TriangulatePolygon2D (polygon);
	test.AssertEqual (triangles, null);

	polygon.AddVertex (1.0, 0.0);
	triangles = JSM.TriangulatePolygon2D (polygon);
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

simplePolygonSuite.AddTest ('OldTriangulationTest01', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (3.0, 0.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (1.5, 3.0);
	polygon.AddVertex (0.0, 2.0);
	
	var triangles = JSM.TriangulatePolygon2D (polygon);
	test.Assert (CheckSimpleTriangulation (polygon, triangles));

	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (3.0, 0.0);
	polygon2.AddVertex (3.0, 2.0);
	polygon2.AddVertex (2.0, 2.0);
	polygon2.AddVertex (2.0, 1.0);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 2.0);
	polygon2.AddVertex (0.0, 2.0);
	
	var triangles = JSM.TriangulatePolygon2D (polygon2);
	test.Assert (CheckSimpleTriangulation (polygon2, triangles));
	
	var polygon2cw = new JSM.Polygon2D ();
	polygon2cw.AddVertex (0.0, 0.0);
	polygon2cw.AddVertex (0.0, 2.0);
	polygon2cw.AddVertex (1.0, 2.0);
	polygon2cw.AddVertex (1.0, 1.0);
	polygon2cw.AddVertex (2.0, 1.0);
	polygon2cw.AddVertex (2.0, 2.0);
	polygon2cw.AddVertex (3.0, 2.0);
	polygon2cw.AddVertex (3.0, 0.0);
	
	var triangles = JSM.TriangulatePolygon2D (polygon2cw);
	test.Assert (CheckSimpleTriangulation (polygon2cw, triangles));

	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (0.0, 0.0);
	polygon3.AddVertex (5.0, 0.0);
	polygon3.AddVertex (5.0, 1.0);
	polygon3.AddVertex (1.0, 1.0);
	polygon3.AddVertex (1.0, 5.0);
	polygon3.AddVertex (4.0, 5.0);
	polygon3.AddVertex (4.0, 3.0);
	polygon3.AddVertex (3.0, 3.0);
	polygon3.AddVertex (3.0, 4.0);
	polygon3.AddVertex (2.0, 4.0);
	polygon3.AddVertex (2.0, 2.0);
	polygon3.AddVertex (5.0, 2.0);
	polygon3.AddVertex (5.0, 6.0);
	polygon3.AddVertex (0.0, 6.0);

	var triangles = JSM.TriangulatePolygon2D (polygon3);
	test.Assert (CheckSimpleTriangulation (polygon3, triangles));

	var polygon4 = new JSM.Polygon2D ();
	polygon4.AddVertex (52, 221);
	polygon4.AddVertex (101, 89);
	polygon4.AddVertex (244, 89);
	polygon4.AddVertex (188, 222);
	polygon4.AddVertex (104, 219);
	polygon4.AddVertex (135, 139);
	polygon4.AddVertex (167, 140);
	polygon4.AddVertex (152, 189);
	polygon4.AddVertex (170, 189);
	polygon4.AddVertex (192, 118);
	polygon4.AddVertex (118, 121);
	polygon4.AddVertex (77, 223);
	
	var triangles = JSM.TriangulatePolygon2D (polygon4);
	test.Assert (CheckSimpleTriangulation (polygon4, triangles));

	var polygon5 = new JSM.Polygon2D ();
	polygon5.AddVertex (1, 0);
	polygon5.AddVertex (2, 0);
	polygon5.AddVertex (2, 1);
	polygon5.AddVertex (3, 1);
	polygon5.AddVertex (3, 2);
	polygon5.AddVertex (2, 2);
	polygon5.AddVertex (2, 3);
	polygon5.AddVertex (1, 3);
	polygon5.AddVertex (1, 2);
	polygon5.AddVertex (0, 2);
	polygon5.AddVertex (0, 1);
	polygon5.AddVertex (1, 1);	

	var triangles = JSM.TriangulatePolygon2D (polygon5);
	test.Assert (CheckSimpleTriangulation (polygon5, triangles));
});

simplePolygonSuite.AddTest ('OldTriangulationTest02', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (3, 0);
	polygon.AddVertex (3, 3);
	polygon.AddVertex (0, 3);
	polygon.AddVertex (0, 0);
	polygon.AddVertex (1, 1);
	polygon.AddVertex (1, 2);
	polygon.AddVertex (2, 2);
	polygon.AddVertex (2, 1);
	polygon.AddVertex (1, 1);

	test.Assert (JSM.IsEqual (polygon.GetSignedArea (), 8.0));

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.0, 0.0)) == JSM.CoordPolygonPosition.OnVertex);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.0, 1.0)) == JSM.CoordPolygonPosition.OnVertex);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (2.0, 2.0)) == JSM.CoordPolygonPosition.OnVertex);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (3.0, 3.0)) == JSM.CoordPolygonPosition.OnVertex);

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (-1.0, -1.0)) == JSM.CoordPolygonPosition.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (4.0, 4.0)) == JSM.CoordPolygonPosition.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (-1.0, 1.5)) == JSM.CoordPolygonPosition.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (4.0, 1.5)) == JSM.CoordPolygonPosition.Outside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 1.5)) == JSM.CoordPolygonPosition.Outside);

	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 0.5)) == JSM.CoordPolygonPosition.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (2.5, 1.5)) == JSM.CoordPolygonPosition.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (1.5, 2.5)) == JSM.CoordPolygonPosition.Inside);
	test.Assert (polygon.CoordPosition (new JSM.Coord2D (0.5, 1.5)) == JSM.CoordPolygonPosition.Inside);

	var triangles = JSM.TriangulatePolygon2D (polygon);
	test.Assert (CheckCalculatedTriangulation (polygon, triangles));

	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0, 0);
	polygon2.AddVertex (6, 0);
	polygon2.AddVertex (6, 3);
	polygon2.AddVertex (5, 2);
	polygon2.AddVertex (5, 1);
	polygon2.AddVertex (4, 1);
	polygon2.AddVertex (4, 2);
	polygon2.AddVertex (5, 2);
	polygon2.AddVertex (6, 3);
	polygon2.AddVertex (0, 3);
	polygon2.AddVertex (1, 2);
	polygon2.AddVertex (2, 2);
	polygon2.AddVertex (2, 1);
	polygon2.AddVertex (1, 1);
	polygon2.AddVertex (1, 2);
	polygon2.AddVertex (0, 3);

	test.Assert (JSM.IsEqual (polygon2.GetSignedArea (), 16.0));

	var triangles = JSM.TriangulatePolygon2D (polygon2);
	test.Assert (CheckCalculatedTriangulation (polygon2, triangles));

	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (0, 0);
	polygon3.AddVertex (5, 0);
	polygon3.AddVertex (2.5, 5);
	polygon3.AddVertex (2, 2);
	polygon3.AddVertex (3, 2);
	polygon3.AddVertex (3, 1);
	polygon3.AddVertex (2, 1);
	polygon3.AddVertex (2, 2);
	polygon3.AddVertex (2.5, 5);

	var triangles = JSM.TriangulatePolygon2D (polygon3);
	test.Assert (CheckCalculatedTriangulation (polygon3, triangles));
});

simplePolygonSuite.AddTest ('OldTriangulationTest03', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (7, 0);
	polygon.AddVertex (7, 3);
	polygon.AddVertex (0, 3);
	polygon.AddContour ();
	polygon.AddVertex (1, 1);
	polygon.AddVertex (1, 2);
	polygon.AddVertex (2, 2);
	polygon.AddVertex (2, 1);

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (7, 0);
	polygon.AddVertex (7, 3);
	polygon.AddVertex (0, 3);
	polygon.AddContour ();
	polygon.AddVertex (1, 1);
	polygon.AddVertex (1, 2);
	polygon.AddVertex (2, 2);
	polygon.AddVertex (2, 1);	
	polygon.AddContour ();
	polygon.AddVertex (3, 1);
	polygon.AddVertex (3, 2);
	polygon.AddVertex (4, 2);
	polygon.AddVertex (4, 1);	

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (7, 0);
	polygon.AddVertex (7, 3);
	polygon.AddVertex (0, 3);
	polygon.AddContour ();
	polygon.AddVertex (1, 1);
	polygon.AddVertex (1, 2);
	polygon.AddVertex (2, 2);
	polygon.AddVertex (2, 1);	
	polygon.AddContour ();
	polygon.AddVertex (3, 1);
	polygon.AddVertex (3, 2);
	polygon.AddVertex (4, 2);
	polygon.AddVertex (4, 1);	
	polygon.AddContour ();
	polygon.AddVertex (5, 1);
	polygon.AddVertex (5, 2);
	polygon.AddVertex (6, 2);
	polygon.AddVertex (6, 1);	

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (300.8485412597656, 319.4265441894531);
	polygon.AddVertex (338.24835205078125, 396.81103515625);
	polygon.AddVertex (421.9165954589844, 416.66839599609375);
	polygon.AddVertex (489.1433410644531, 362.9385986328125);
	polygon.AddVertex (489.543701171875, 276.95245361328125);
	polygon.AddVertex (422.18115234375, 223.48004150390625);
	polygon.AddVertex (337.93084716796875, 241.53892517089844);
	polygon.AddContour ();
	polygon.AddVertex (400.6557922363281, 231.74929809570312);
	polygon.AddVertex (468.43548583984375, 264.9992980957031);
	polygon.AddVertex (484.7142639160156, 338.9593505859375);
	polygon.AddVertex (437.7185363769531, 398.06951904296875);
	polygon.AddVertex (362.0542297363281, 397.45257568359375);
	polygon.AddVertex (315.2279052734375, 338.1394348144531);
	polygon.AddVertex (332.49664306640625, 264.4938659667969);

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));
});

simplePolygonSuite.AddTest ('OldTriangulationTest04', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (14.406249999999998, 0.004463199991732836);
	polygon.AddVertex (12.273693084716795, -0.13337911665439606);
	polygon.AddVertex (10.177939414978026, -0.5507046580314636);
	polygon.AddVertex (8.158322334289549, -1.2485805749893188);
	polygon.AddVertex (6.256920814514159, -2.2232589721679688);
	polygon.AddVertex (4.518617153167724, -3.4653913974761963);
	polygon.AddVertex (2.992141485214233, -4.959873676300049);
	polygon.AddVertex (1.7292572259902952, -6.682513236999512);
	polygon.AddVertex (0.7823054790496825, -8.596776962280273);
	polygon.AddVertex (0.19680410623550412, -10.650409698486328);
	polygon.AddVertex (2.7840769689646545e-9, -12.77676773071289);
	polygon.AddVertex (2.7840769689646545e-9, -58.87051773071289);
	polygon.AddVertex (0.19683623313903806, -60.99687194824219);
	polygon.AddVertex (0.782375395298004, -63.05048370361328);
	polygon.AddVertex (1.7292767763137815, -64.96475982666016);
	polygon.AddVertex (2.992123126983642, -66.68743133544922);
	polygon.AddVertex (4.5186753273010245, -68.18182373046875);
	polygon.AddVertex (6.256915569305419, -69.42404174804688);
	polygon.AddVertex (8.158330917358397, -70.398681640625);
	polygon.AddVertex (10.17793846130371, -71.0965805053711);
	polygon.AddVertex (12.273698806762694, -71.51383209228516);
	polygon.AddVertex (14.406246185302733, -71.65176391601562);
	polygon.AddVertex (385.18749999999994, -71.65176391601562);
	polygon.AddVertex (387.32006835937494, -71.513916015625);
	polygon.AddVertex (389.41580200195307, -71.0965805053711);
	polygon.AddVertex (391.43542480468744, -70.398681640625);
	polygon.AddVertex (393.33679199218744, -69.42398071289062);
	polygon.AddVertex (395.0751342773437, -68.18187713623047);
	polygon.AddVertex (396.6016235351562, -66.6874008178711);
	polygon.AddVertex (397.86450195312494, -64.96475982666016);
	polygon.AddVertex (398.8114624023437, -63.050498962402344);
	polygon.AddVertex (399.39697265624994, -60.99687576293945);
	polygon.AddVertex (399.59374999999994, -58.870513916015625);
	polygon.AddVertex (399.59374999999994, -12.776763916015625);
	polygon.AddVertex (399.39688110351557, -10.650407791137695);
	polygon.AddVertex (398.8113708496093, -8.596782684326172);
	polygon.AddVertex (397.8644714355468, -6.682509422302246);
	polygon.AddVertex (396.6016235351562, -4.95983362197876);
	polygon.AddVertex (395.07510375976557, -3.465416193008423);
	polygon.AddVertex (393.3368530273437, -2.223223924636841);
	polygon.AddVertex (391.43542480468744, -1.2485815286636353);
	polygon.AddVertex (389.41580200195307, -0.5506518483161926);
	polygon.AddVertex (387.3200378417968, -0.13342222571372986);
	polygon.AddVertex (385.18749999999994, 0.004486083984375);
	polygon.AddContour ();
	polygon.AddVertex (357.99999999999994, -10.651786804199219);
	polygon.AddVertex (360.0240173339843, -10.729362487792969);
	polygon.AddVertex (362.0359497070312, -10.963029861450195);
	polygon.AddVertex (364.0234985351562, -11.353105545043945);
	polygon.AddVertex (365.97412109374994, -11.898651123046875);
	polygon.AddVertex (367.87536621093744, -12.597009658813477);
	polygon.AddVertex (369.7149047851562, -13.44465446472168);
	polygon.AddVertex (371.4808044433593, -14.436634063720703);
	polygon.AddVertex (373.1611938476562, -15.567431449890137);
	polygon.AddVertex (374.7445983886718, -16.83041000366211);
	polygon.AddVertex (376.2197875976562, -18.21826934814453);
	polygon.AddVertex (377.57568359374994, -19.722864151000977);
	polygon.AddVertex (378.80154418945307, -21.335163116455078);
	polygon.AddVertex (379.88711547851557, -23.0450382232666);
	polygon.AddVertex (380.82266235351557, -24.84136199951172);
	polygon.AddVertex (381.5994262695312, -26.711843490600586);
	polygon.AddVertex (382.2098999023437, -28.642974853515625);
	polygon.AddVertex (382.64871215820307, -30.620220184326172);
	polygon.AddVertex (382.91235351562494, -32.628326416015625);
	polygon.AddVertex (382.99999999999994, -34.65178680419922);
	polygon.AddVertex (382.91235351562494, -36.67523956298828);
	polygon.AddVertex (382.6486206054687, -38.68333053588867);
	polygon.AddVertex (382.2098083496093, -40.660552978515625);
	polygon.AddVertex (381.59924316406244, -42.591670989990234);
	polygon.AddVertex (380.8226013183593, -44.46219253540039);
	polygon.AddVertex (379.8871459960937, -46.258583068847656);
	polygon.AddVertex (378.8015747070312, -47.96845626831055);
	polygon.AddVertex (377.5756530761718, -49.58070755004883);
	polygon.AddVertex (376.2197875976562, -51.08530807495117);
	polygon.AddVertex (374.7445983886718, -52.47315979003906);
	polygon.AddVertex (373.16116333007807, -53.73616027832031);
	polygon.AddVertex (371.4807739257812, -54.86695861816406);
	polygon.AddVertex (369.7149353027343, -55.85900115966797);
	polygon.AddVertex (367.87536621093744, -56.70659255981445);
	polygon.AddVertex (365.97412109374994, -57.405006408691406);
	polygon.AddVertex (364.0234985351562, -57.95049285888672);
	polygon.AddVertex (362.0359497070312, -58.340576171875);
	polygon.AddVertex (360.0239868164062, -58.574188232421875);
	polygon.AddVertex (357.99999999999994, -58.65178680419922);
	polygon.AddVertex (355.97598266601557, -58.57420349121094);
	polygon.AddVertex (353.9640502929687, -58.340545654296875);
	polygon.AddVertex (351.9765014648437, -57.95048141479492);
	polygon.AddVertex (350.02587890624994, -57.40494155883789);
	polygon.AddVertex (348.12463378906244, -56.706573486328125);
	polygon.AddVertex (346.2850952148437, -55.85893249511719);
	polygon.AddVertex (344.51919555664057, -54.866943359375);
	polygon.AddVertex (342.8388061523437, -53.73613357543945);
	polygon.AddVertex (341.25537109374994, -52.47316360473633);
	polygon.AddVertex (339.78018188476557, -51.085304260253906);
	polygon.AddVertex (338.4242858886718, -49.58070755004883);
	polygon.AddVertex (337.1984252929687, -47.968421936035156);
	polygon.AddVertex (336.1128845214843, -46.25852584838867);
	polygon.AddVertex (335.1773071289062, -44.462196350097656);
	polygon.AddVertex (334.40054321289057, -42.591712951660156);
	polygon.AddVertex (333.79003906249994, -40.66058349609375);
	polygon.AddVertex (333.3512878417968, -38.68334197998047);
	polygon.AddVertex (333.08764648437494, -36.675235748291016);
	polygon.AddVertex (332.99999999999994, -34.65178680419922);
	polygon.AddVertex (333.08764648437494, -32.62833023071289);
	polygon.AddVertex (333.3513793945312, -30.620243072509766);
	polygon.AddVertex (333.79019165039057, -28.643016815185547);
	polygon.AddVertex (334.4007263183593, -26.711898803710938);
	polygon.AddVertex (335.17736816406244, -24.84137725830078);
	polygon.AddVertex (336.11282348632807, -23.044984817504883);
	polygon.AddVertex (337.1984252929687, -21.33512306213379);
	polygon.AddVertex (338.42434692382807, -19.722867965698242);
	polygon.AddVertex (339.7802429199218, -18.2182674407959);
	polygon.AddVertex (341.25540161132807, -16.830411911010742);
	polygon.AddVertex (342.8388061523437, -15.567415237426758);
	polygon.AddVertex (344.51919555664057, -14.436615943908691);
	polygon.AddVertex (346.28506469726557, -13.444568634033203);
	polygon.AddVertex (348.12466430664057, -12.596980094909668);
	polygon.AddVertex (350.02587890624994, -11.8985595703125);
	polygon.AddVertex (351.9765014648437, -11.353080749511719);
	polygon.AddVertex (353.9640502929687, -10.962987899780273);
	polygon.AddVertex (355.9760131835937, -10.729391098022461);
	polygon.AddContour ();
	polygon.AddVertex (45.84374999999999, -10.683036804199219);
	polygon.AddVertex (47.88229370117187, -10.759542465209961);
	polygon.AddVertex (49.909187316894524, -10.990069389343262);
	polygon.AddVertex (51.91246795654296, -11.375129699707031);
	polygon.AddVertex (53.879959106445305, -11.913954734802246);
	polygon.AddVertex (55.799419403076165, -12.604604721069336);
	polygon.AddVertex (57.658760070800774, -13.443743705749512);
	polygon.AddVertex (59.44597625732422, -14.427173614501953);
	polygon.AddVertex (61.14910888671875, -15.54993724822998);
	polygon.AddVertex (62.75645065307617, -16.805988311767578);
	polygon.AddVertex (64.25637817382811, -18.188514709472656);
	polygon.AddVertex (65.63724517822264, -19.689943313598633);
	polygon.AddVertex (66.88774108886717, -21.301536560058594);
	polygon.AddVertex (67.99694824218749, -23.013425827026367);
	polygon.AddVertex (68.9541778564453, -24.814687728881836);
	polygon.AddVertex (69.74999237060545, -26.69283676147461);
	polygon.AddVertex (70.37625885009764, -28.63409423828125);
	polygon.AddVertex (70.82669067382811, -30.623504638671875);
	polygon.AddVertex (71.09741210937499, -32.64522933959961);
	polygon.AddVertex (71.18749999999999, -34.68303298950195);
	polygon.AddVertex (71.09748077392577, -36.72084426879883);
	polygon.AddVertex (70.82672882080077, -38.74257278442383);
	polygon.AddVertex (70.37628936767577, -40.731990814208984);
	polygon.AddVertex (69.7500534057617, -42.67326354980469);
	polygon.AddVertex (68.95420837402342, -44.55139923095703);
	polygon.AddVertex (67.99696350097655, -46.3526496887207);
	polygon.AddVertex (66.88782501220702, -48.06458282470703);
	polygon.AddVertex (65.63726806640624, -49.67613983154297);
	polygon.AddVertex (64.25634765624999, -51.17751693725586);
	polygon.AddVertex (62.75646209716797, -52.56009292602539);
	polygon.AddVertex (61.14913558959961, -53.816165924072266);
	polygon.AddVertex (59.44598388671875, -54.93890380859375);
	polygon.AddVertex (57.65877532958984, -55.9223518371582);
	polygon.AddVertex (55.799427032470696, -56.761478424072266);
	polygon.AddVertex (53.87994766235351, -57.45206832885742);
	polygon.AddVertex (51.912464141845696, -57.99094009399414);
	polygon.AddVertex (49.90919876098632, -58.37601852416992);
	polygon.AddVertex (47.882305145263665, -58.60653305053711);
	polygon.AddVertex (45.843757629394524, -58.68303298950195);
	polygon.AddVertex (43.80521011352538, -58.60653305053711);
	polygon.AddVertex (41.77831649780273, -58.37600326538086);
	polygon.AddVertex (39.77503585815429, -57.99094009399414);
	polygon.AddVertex (37.807544708251946, -57.45210647583008);
	polygon.AddVertex (35.88808059692382, -56.761451721191406);
	polygon.AddVertex (34.02873992919921, -55.92230987548828);
	polygon.AddVertex (32.241523742675774, -54.93888473510742);
	polygon.AddVertex (30.53838539123535, -53.81612777709961);
	polygon.AddVertex (28.931024551391598, -52.56009292602539);
	polygon.AddVertex (27.431098937988278, -51.17756652832031);
	polygon.AddVertex (26.05021476745605, -49.676151275634766);
	polygon.AddVertex (24.799709320068356, -48.06455612182617);
	polygon.AddVertex (23.690509796142575, -46.3526611328125);
	polygon.AddVertex (22.73331260681152, -44.55138397216797);
	polygon.AddVertex (21.937499999999996, -42.67323303222656);
	polygon.AddVertex (21.31124114990234, -40.731971740722656);
	polygon.AddVertex (20.860818862915036, -38.7425537109375);
	polygon.AddVertex (20.590082168579098, -36.720829010009766);
	polygon.AddVertex (20.500007629394528, -34.68303298950195);
	polygon.AddVertex (20.590051651000973, -32.645225524902344);
	polygon.AddVertex (20.860799789428707, -30.623497009277344);
	polygon.AddVertex (21.311223983764645, -28.634075164794922);
	polygon.AddVertex (21.93748092651367, -26.692811965942383);
	polygon.AddVertex (22.733314514160153, -24.814674377441406);
	polygon.AddVertex (23.69057464599609, -23.013431549072266);
	polygon.AddVertex (24.799715042114254, -21.301498413085938);
	polygon.AddVertex (26.050258636474606, -19.6899356842041);
	polygon.AddVertex (27.431152343749996, -18.188535690307617);
	polygon.AddVertex (28.931035995483395, -16.80597496032715);
	polygon.AddVertex (30.538366317749023, -15.549915313720703);
	polygon.AddVertex (32.24151229858398, -14.427176475524902);
	polygon.AddVertex (34.02872085571288, -13.443732261657715);
	polygon.AddVertex (35.888069152832024, -12.604608535766602);
	polygon.AddVertex (37.80755233764648, -11.914011001586914);
	polygon.AddVertex (39.77502822875976, -11.375136375427246);
	polygon.AddVertex (41.7782859802246, -10.990045547485352);
	polygon.AddVertex (43.80519485473632, -10.75953197479248);
	polygon.AddContour ();
	polygon.AddVertex (107.71874999999999, -10.683036804199219);
	polygon.AddVertex (295.56249999999994, -10.683036804199219);
	polygon.AddVertex (297.7281188964843, -10.829914093017578);
	polygon.AddVertex (299.85278320312494, -11.273558616638184);
	polygon.AddVertex (301.8931274414062, -12.013519287109375);
	polygon.AddVertex (303.8041687011718, -13.04211139678955);
	polygon.AddVertex (305.53958129882807, -14.345172882080078);
	polygon.AddVertex (307.05151367187494, -15.901714324951172);
	polygon.AddVertex (308.2914733886718, -17.682279586791992);
	polygon.AddVertex (309.2132263183593, -19.646312713623047);
	polygon.AddVertex (309.77932739257807, -21.740589141845703);
	polygon.AddVertex (309.96874999999994, -23.90178680419922);
	polygon.AddVertex (309.96874999999994, -45.46428680419922);
	polygon.AddVertex (309.77932739257807, -47.625484466552734);
	polygon.AddVertex (309.21340942382807, -49.71982192993164);
	polygon.AddVertex (308.2914733886718, -51.683753967285156);
	polygon.AddVertex (307.0514831542968, -53.464298248291016);
	polygon.AddVertex (305.53958129882807, -55.02088928222656);
	polygon.AddVertex (303.80419921874994, -56.32395935058594);
	polygon.AddVertex (301.8931274414062, -57.3525505065918);
	polygon.AddVertex (299.85278320312494, -58.092491149902344);
	polygon.AddVertex (297.7281188964843, -58.53616714477539);
	polygon.AddVertex (295.56249999999994, -58.68303680419922);
	polygon.AddVertex (107.71874999999999, -58.68303680419922);
	polygon.AddVertex (105.55313873291014, -58.536163330078125);
	polygon.AddVertex (103.42848205566405, -58.09251022338867);
	polygon.AddVertex (101.3881378173828, -57.352508544921875);
	polygon.AddVertex (99.47705078124999, -56.32398223876953);
	polygon.AddVertex (97.74167633056639, -55.020896911621094);
	polygon.AddVertex (96.22973632812499, -53.46435546875);
	polygon.AddVertex (94.98975372314452, -51.68381118774414);
	polygon.AddVertex (94.06801605224608, -49.71977615356445);
	polygon.AddVertex (93.50196075439452, -47.625484466552734);
	polygon.AddVertex (93.31249999999999, -45.46428680419922);
	polygon.AddVertex (93.31249999999999, -23.90178680419922);
	polygon.AddVertex (93.50192260742186, -21.740585327148438);
	polygon.AddVertex (94.0679473876953, -19.646278381347656);
	polygon.AddVertex (94.98979187011717, -17.682294845581055);
	polygon.AddVertex (96.22973632812499, -15.901721954345703);
	polygon.AddVertex (97.7416534423828, -14.345148086547852);
	polygon.AddVertex (99.47707366943358, -13.04212474822998);
	polygon.AddVertex (101.38810729980467, -12.01349925994873);
	polygon.AddVertex (103.42847442626952, -11.27356243133545);
	polygon.AddVertex (105.55313873291014, -10.829910278320312);

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), 0.0001);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), 0.0001);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (300.0, 0.0);
	polygon.AddVertex (300.0, 300.0);
	polygon.AddVertex (0.0, 300.0);
	polygon.AddContour ();
	polygon.AddVertex (100.0, 100.0);
	polygon.AddVertex (100.0, 200.0);
	polygon.AddVertex (200.0, 200.0);
	polygon.AddVertex (200.0, 100.0);
	polygon.AddContour ();
	polygon.AddVertex (10.0, 10.0);
	polygon.AddVertex (10.0, 50.0);
	polygon.AddVertex (50.0, 50.0);
	polygon.AddVertex (50.0, 10.0);
	
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (7, 0);
	polygon.AddVertex (7, 3);
	polygon.AddVertex (0, 3);
	polygon.AddContour ();
	polygon.AddVertex (1, 1);
	polygon.AddVertex (1, 2);
	polygon.AddVertex (2, 2);
	polygon.AddVertex (2, 1);
	polygon.AddContour ();
	polygon.AddVertex (3, 1);
	polygon.AddVertex (3, 2);
	polygon.AddVertex (4, 2);
	polygon.AddVertex (4, 1);
	polygon.AddContour ();
	polygon.AddVertex (5, 1);
	polygon.AddVertex (5, 2);
	polygon.AddVertex (6, 2);
	polygon.AddVertex (6, 1);

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (10.0, 0.0);
	polygon.AddVertex (10.0, 10.0);
	polygon.AddVertex (0.0, 10.0);
	polygon.AddContour ();
	polygon.AddVertex (5.0, 5.0);
	polygon.AddVertex (5.0, 6.0);
	polygon.AddVertex (6.0, 6.0);
	polygon.AddVertex (6.0, 5.0);
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 9.0);
	polygon.AddVertex (2.0, 9.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (8.0, 2.0);
	polygon.AddVertex (8.0, 9.0);
	polygon.AddVertex (9.0, 9.0);
	polygon.AddVertex (9.0, 1.0);
	
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (10.0, 0.0);
	polygon.AddVertex (10.0, 10.0);
	polygon.AddVertex (0.0, 10.0);
	polygon.AddContour ();
	polygon.AddVertex (5.0, 5.0);
	polygon.AddVertex (5.0, 6.0);
	polygon.AddVertex (6.0, 6.0);
	polygon.AddVertex (6.0, 5.0);
	polygon.AddContour ();
	polygon.AddVertex (3.0, 3.0);
	polygon.AddVertex (3.0, 4.0);
	polygon.AddVertex (4.0, 4.0);
	polygon.AddVertex (4.0, 3.0);
	polygon.AddContour ();
	polygon.AddVertex (5.0, 3.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (6.0, 4.0);
	polygon.AddVertex (6.0, 3.0);
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 9.0);
	polygon.AddVertex (2.0, 9.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (8.0, 2.0);
	polygon.AddVertex (8.0, 9.0);
	polygon.AddVertex (9.0, 9.0);
	polygon.AddVertex (9.0, 1.0);
	
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));

	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (10.0, 0.0);
	polygon.AddVertex (10.0, 10.0);
	polygon.AddVertex (0.0, 10.0);
	polygon.AddContour ();
	polygon.AddVertex (5.0, 5.0);
	polygon.AddVertex (5.0, 6.0);
	polygon.AddVertex (6.0, 6.0);
	polygon.AddVertex (6.0, 5.0);
	polygon.AddContour ();
	polygon.AddVertex (5.0, 3.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (6.0, 4.0);
	polygon.AddVertex (6.0, 3.0);
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 9.0);
	polygon.AddVertex (2.0, 9.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (8.0, 2.0);
	polygon.AddVertex (8.0, 9.0);
	polygon.AddVertex (9.0, 9.0);
	polygon.AddVertex (9.0, 1.0);
	polygon.AddContour ();
	polygon.AddVertex (3.0, 3.0);
	polygon.AddVertex (3.0, 4.0);
	polygon.AddVertex (4.0, 4.0);
	polygon.AddVertex (4.0, 3.0);
	
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckSimpleTriangulation (simple));
	test.Assert (CheckHoleVertexMapping (polygon));
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
	
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.VertexCount (), simple.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), simple.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), simple.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Convex);	
	test.Assert (CheckHoleVertexMapping (polygon));
	
	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.AddContour ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (0.0, 4.0);
	polygon2.AddVertex (5.0, 4.0);
	polygon2.AddVertex (5.0, 0.0);
	
	var simple2 = JSM.ConvertContourPolygonToPolygon2D (polygon2);
	test.AssertEqual (polygon2.VertexCount (), simple2.VertexCount ());
	test.AssertEqual (polygon2.GetSignedArea (), simple2.GetSignedArea ());
	test.AssertEqual (polygon2.GetArea (), simple2.GetArea ());
	test.AssertEqual (polygon2.GetOrientation (), simple2.GetOrientation ());
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);	
	test.AssertEqual (simple2.GetComplexity (), JSM.Complexity.Convex);
	test.Assert (CheckHoleVertexMapping (polygon));
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
    
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.VertexCount () + 2, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckHoleVertexMapping (polygon));
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
    
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.VertexCount () + 2, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);
	test.Assert (CheckHoleVertexMapping (polygon));
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
    
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.VertexCount () + 2, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);
	test.Assert (CheckHoleVertexMapping (polygon));
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

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.AssertEqual (polygon.VertexCount () + 4, simple.VertexCount ());
	test.AssertEqualNum (polygon.GetSignedArea (), simple.GetSignedArea (), JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), simple.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), simple.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);	
	test.AssertEqual (simple.GetComplexity (), JSM.Complexity.Concave);	
	test.Assert (CheckHoleVertexMapping (polygon));
});

convertToSimplePolygonSuite.AddTest ('MappingTest', function (test)
{
	function EqualArrayOfArrays (a, b)
	{
		if (a.length != b.length) {
			return false;
		}
		var i, j;
		for (i = 0; i < a.length; i++) {
			if (a[i].length != b[i].length) {
				return false;
			}
			for (j = 0; j < a[i].length; j++) {
				if (a[i][j] != b[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
	
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);
	
	var mapping = [];
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon, mapping);
	test.Assert (EqualArrayOfArrays (mapping, [[0, 0], [0, 1], [0, 2], [0, 3]]));
	test.Assert (CheckHoleVertexMapping (polygon));
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
    
	var mapping = [];
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon, mapping);
	test.Assert (EqualArrayOfArrays (mapping, [[0, 1], [0, 2], [0, 3], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 0], [0, 0]]));
	test.Assert (CheckHoleVertexMapping (polygon));

	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (4.0, 1.0);

	var mapping = [];
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon, mapping);
	test.Assert (EqualArrayOfArrays (mapping, [[0, 2], [0, 3], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 0], [0, 0], [0, 1], [2, 0], [2, 1], [2, 2], [2, 3], [2, 0], [0, 1]]));
	test.Assert (CheckHoleVertexMapping (polygon));
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
    
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
    
	var simple2 = JSM.ConvertContourPolygonToPolygon2D (polygon2);
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
	
	var simple3 = JSM.ConvertContourPolygonToPolygon2D (polygon3);
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

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
    
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
    
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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

	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	var triangles = JSM.TriangulatePolygon2D (simple);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
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
	var simple = JSM.ConvertContourPolygonToPolygon2D (polygon);
	test.Assert (CheckSimpleTriangulation (simple));
});

}
