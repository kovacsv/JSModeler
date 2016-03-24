module.exports = function (unitTest)
{

function CutAndCheck (polygon, line, leftCount, rightCount, cutCount, additionalCheck)
{
	var leftPolygons = [];
	var rightPolygons = [];
	var cutPolygons = [];	
	
	var result = JSM.CutPolygon2DWithLine (polygon, line, leftPolygons, rightPolygons, cutPolygons);
	if (!result) {
		return false;
	}

	if (leftPolygons.length != leftCount) {
		return false;
	}
	
	if (rightPolygons.length != rightCount) {
		return false;
	}
	
	if (cutPolygons.length != cutCount) {
		return false;
	}
	
	var area = polygon.GetArea ();
	var cutArea = 0.0;
	
	var i, current;
	for (i = 0; i < leftPolygons.length; i++) {
		current = leftPolygons[i].GetArea ();
		cutArea += current;
	}
	for (i = 0; i < rightPolygons.length; i++) {
		current = rightPolygons[i].GetArea ();
		cutArea += current;
	}
	for (i = 0; i < cutPolygons.length; i++) {
		current = cutPolygons[i].GetArea ();
		cutArea += current;
	}
	
	if (!JSM.IsEqual (area, cutArea)) {
		return false;
	}
	
	if (additionalCheck) {
		if (!additionalCheck (leftPolygons, rightPolygons, cutPolygons)) {
			return false;
		}
	}
	
	return true;		
}

var cutPolygonSuite = unitTest.AddTestSuite ('CutPolygon');

cutPolygonSuite.AddTest ('CutPolygon2DTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	
	var line1 = new JSM.Line2D (new JSM.Coord2D (-1.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line1Rev = new JSM.Line2D (new JSM.Coord2D (-1.0, 0.0), new JSM.Vector2D (0.0, -1.0));
	var line2 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (1.0, 0.0));
	var line3 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line4 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (1.0, 1.0));
	var line5 = new JSM.Line2D (new JSM.Coord2D (-0.1, 0.0), new JSM.Vector2D (1.0, 1.0));
	var line6 = new JSM.Line2D (new JSM.Coord2D (-0.5, 0.0), new JSM.Vector2D (1.0, 1.0));
	var line7 = new JSM.Line2D (new JSM.Coord2D (-1.0, 0.0), new JSM.Vector2D (1.0, 1.0));
	var line8 = new JSM.Line2D (new JSM.Coord2D (2.0, 0.0), new JSM.Vector2D (-1.0, 1.0));
	var line9 = new JSM.Line2D (new JSM.Coord2D (2.0, 0.0), new JSM.Vector2D (-1.0, -1.0));

	test.Assert (CutAndCheck (polygon, line1, 0, 1, 0));
	test.Assert (CutAndCheck (polygon, line1Rev, 1, 0, 0));
	test.Assert (CutAndCheck (polygon, line2, 1, 0, 0));
	test.Assert (CutAndCheck (polygon, line3, 0, 1, 0));
	test.Assert (CutAndCheck (polygon, line4, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line5, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line6, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line7, 0, 1, 0));
	test.Assert (CutAndCheck (polygon, line8, 1, 0, 0));
	test.Assert (CutAndCheck (polygon, line9, 0, 1, 0));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 3.0);
	polygon.AddVertex (0.0, 3.0);
	polygon.AddVertex (0.0, 2.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	
	test.Assert (CutAndCheck (polygon, line1, 0, 1, 0));
	test.Assert (CutAndCheck (polygon, line1Rev, 1, 0, 0));
	test.Assert (CutAndCheck (polygon, line2, 1, 0, 0));
	test.Assert (CutAndCheck (polygon, line3, 0, 1, 0));
	test.Assert (CutAndCheck (polygon, line4, 2, 1, 0));
	test.Assert (CutAndCheck (polygon, line5, 2, 1, 0));
	test.Assert (CutAndCheck (polygon, line6, 2, 1, 0));
	test.Assert (CutAndCheck (polygon, line7, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line8, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line9, 0, 1, 0));
	
	var line10 = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (1.0, 0.0));
	var line10Rev = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (-1.0, 0.0));
	var line11 = new JSM.Line2D (new JSM.Coord2D (0.0, 2.0), new JSM.Vector2D (1.0, 0.0));
	var line12 = new JSM.Line2D (new JSM.Coord2D (0.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line13 = new JSM.Line2D (new JSM.Coord2D (1.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line13Rev = new JSM.Line2D (new JSM.Coord2D (1.0, 0.0), new JSM.Vector2D (0.0, -1.0));
	var line14 = new JSM.Line2D (new JSM.Coord2D (0.5, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line15 = new JSM.Line2D (new JSM.Coord2D (1.5, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line16 = new JSM.Line2D (new JSM.Coord2D (1.0, -0.1), new JSM.Vector2D (1.0, 1.0));
	var line17 = new JSM.Line2D (new JSM.Coord2D (1.0, -0.1), new JSM.Vector2D (-1.0, -1.0));

	test.Assert (CutAndCheck (polygon, line10, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line11, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line12, 0, 1, 0));
	test.Assert (CutAndCheck (polygon, line13, 2, 1, 0));
	test.Assert (CutAndCheck (polygon, line13Rev, 1, 2, 0));
	test.Assert (CutAndCheck (polygon, line14, 2, 1, 0));
	test.Assert (CutAndCheck (polygon, line15, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line16, 1, 1, 0));
	test.Assert (CutAndCheck (polygon, line17, 1, 1, 0));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (CutAndCheck (polygon, line13, 1, 1, 0));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	test.Assert (CutAndCheck (polygon, line2, 0, 0, 1));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	test.Assert (CutAndCheck (polygon, line13, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 4) {
			return false;
		}
		return true;
	}));
	test.Assert (CutAndCheck (polygon, line13Rev, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 4) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	test.Assert (CutAndCheck (polygon, line13, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 4) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));
	test.Assert (CutAndCheck (polygon, line13Rev, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 4) {
			return false;
		}
		return true;
	}));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	test.Assert (CutAndCheck (polygon, line13, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 4) {
			return false;
		}
		return true;
	}));
	test.Assert (CutAndCheck (polygon, line13Rev, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 4) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	test.Assert (CutAndCheck (polygon, line13, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 4) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));
	test.Assert (CutAndCheck (polygon, line13Rev, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 4) {
			return false;
		}
		return true;
	}));
	
	var line18 = new JSM.Line2D (new JSM.Coord2D (2.0, 0.0), new JSM.Vector2D (0.0, 1.0));
	var line18Rev = new JSM.Line2D (new JSM.Coord2D (2.0, 0.0), new JSM.Vector2D (0.0, -1.0));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	test.Assert (CutAndCheck (polygon, line18, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 4) {
			return false;
		}
		return true;
	}));
	test.Assert (CutAndCheck (polygon, line18Rev, 1, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 4) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (1.1, 1.0);
	polygon.AddVertex (0.9, 1.0);
	polygon.AddVertex (0.0, 2.0);
	test.Assert (CutAndCheck (polygon, line10, 2, 1, 0));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (10, 0);
	polygon.AddVertex (10, 3);
	polygon.AddVertex (9, 1);
	polygon.AddVertex (8, 3);
	polygon.AddVertex (7, 1);
	polygon.AddVertex (6, 3);
	polygon.AddVertex (5, 1);
	polygon.AddVertex (4, 3);
	polygon.AddVertex (3, 1);
	polygon.AddVertex (2, 3);
	polygon.AddVertex (1, 1);
	polygon.AddVertex (0, 3);
	test.Assert (CutAndCheck (polygon, line10, 6, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[1].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[2].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[3].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[4].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[5].VertexCount () != 3) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 9) {
			return false;
		}
		return true;
	}));
	test.Assert (CutAndCheck (polygon, line10Rev, 1, 6, 0));		
});

cutPolygonSuite.AddTest ('DuplicatedVertexCasesTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 2.0);			
	var line = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (1.0, 0.0));
	test.Assert (CutAndCheck (polygon, line, 2, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[1].VertexCount () != 3) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));
	var line = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (-1.0, 0.0));
	test.Assert (CutAndCheck (polygon, line, 1, 2, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 3) {
			return false;
		}
		if (rightPolygons[1].VertexCount () != 3) {
			return false;
		}
		return true;
	}));
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (0.0, 2.0);			
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 0.0);
	var line = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (1.0, 0.0));
	test.Assert (CutAndCheck (polygon, line, 2, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 3) {
			return false;
		}
		if (leftPolygons[1].VertexCount () != 3) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 5) {
			return false;
		}
		return true;
	}));
	var line = new JSM.Line2D (new JSM.Coord2D (0.0, 1.0), new JSM.Vector2D (-1.0, 0.0));
	test.Assert (CutAndCheck (polygon, line, 1, 2, 0, function (leftPolygons, rightPolygons, cutPolygons) {
		if (leftPolygons[0].VertexCount () != 5) {
			return false;
		}
		if (rightPolygons[0].VertexCount () != 3) {
			return false;
		}
		if (rightPolygons[1].VertexCount () != 3) {
			return false;
		}
		return true;
	}));
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (5, 5);
	polygon.AddVertex (0, 0);
	polygon.AddVertex (10, 0);
	polygon.AddVertex (10, 10);
	polygon.AddVertex (0, 10);
	for (i = 0; i < 10; i++) {
		polygon.ShiftVertices (1);
		var line = new JSM.Line2D (new JSM.Coord2D (5.0, 0.0), new JSM.Vector2D (0.0, 1.0));
		test.Assert (CutAndCheck (polygon, line, 2, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
			if (leftPolygons[0].VertexCount () != 3) {
				return false;
			}
			if (leftPolygons[0].VertexCount () != 3) {
				return false;
			}
			if (rightPolygons[0].VertexCount () != 5) {
				return false;
			}
			return true;
		}));
		var line = new JSM.Line2D (new JSM.Coord2D (5.0, 0.0), new JSM.Vector2D (0.0, -1.0));
		test.Assert (CutAndCheck (polygon, line, 1, 2, 0, function (leftPolygons, rightPolygons, cutPolygons) {
			if (leftPolygons[0].VertexCount () != 5) {
				return false;
			}
			if (rightPolygons[0].VertexCount () != 3) {
				return false;
			}
			if (rightPolygons[0].VertexCount () != 3) {
				return false;
			}
			return true;
		}));
	}
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (5, 5);
	polygon.AddVertex (0, 10);
	polygon.AddVertex (10, 10);
	polygon.AddVertex (10, 0);
	polygon.AddVertex (0, 0);
	for (i = 0; i < 10; i++) {
		polygon.ShiftVertices (1);
		var line = new JSM.Line2D (new JSM.Coord2D (5.0, 0.0), new JSM.Vector2D (0.0, 1.0));
		test.Assert (CutAndCheck (polygon, line, 2, 1, 0, function (leftPolygons, rightPolygons, cutPolygons) {
			if (leftPolygons[0].VertexCount () != 3) {
				return false;
			}
			if (leftPolygons[0].VertexCount () != 3) {
				return false;
			}
			if (rightPolygons[0].VertexCount () != 5) {
				return false;
			}
			return true;
		}));
		var line = new JSM.Line2D (new JSM.Coord2D (5.0, 0.0), new JSM.Vector2D (0.0, -1.0));
		test.Assert (CutAndCheck (polygon, line, 1, 2, 0, function (leftPolygons, rightPolygons, cutPolygons) {
			if (leftPolygons[0].VertexCount () != 5) {
				return false;
			}
			if (rightPolygons[0].VertexCount () != 3) {
				return false;
			}
			if (rightPolygons[0].VertexCount () != 3) {
				return false;
			}
			return true;
		}));
	}	
});

cutPolygonSuite.AddTest ('OldCutPolygonTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 0.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (0.0, 1.0, 0.0);
	
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.0, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (1.0, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (0.0, 1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (-1.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));

	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.5, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.5, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (0.0, 0.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.5, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.5, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (1.0, 1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.8, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.8, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.8, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (0.0, 0.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (-1.0, 1.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.0, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (0.0, 1.0, 0.0))
		);
	test.Assert (
		backPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.0, 0.0, 0.0)) &&
		backPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 0.0, 0.0))
		);
	
	polygon = new JSM.Polygon ();
	polygon.AddVertex (-1.0, -1.0, 0.0);
	polygon.AddVertex (-1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, -1.0, 0.0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.0, -1.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (-1.0, -1.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (-1.0, 1.0, 0.0))
		);
	test.Assert (
		backPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.0, -1.0, 0.0)) &&
		backPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (1.0, -1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.0, -1.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (1.0, -1.0, 0.0))
		);
	test.Assert (
		backPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.0, -1.0, 0.0)) &&
		backPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (-1.0, -1.0, 0.0)) &&
		backPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (-1.0, 1.0, 0.0))
		);

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 0.0, 0.0);
	polygon.AddVertex (2.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 1.0, 0.0);
	polygon.AddVertex (1.0, 2.0, 0.0);
	polygon.AddVertex (2.0, 2.0, 0.0);
	polygon.AddVertex (2.0, 3.0, 0.0);
	polygon.AddVertex (0.0, 3.0, 0.0);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (3.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	planePolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	planePolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 1);
	test.Assert (planePolygons.length == 0);
	
	test.Assert (frontPolygons[0].VertexCount () == 8);
	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (1.5, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (1.5, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (1.0, 2.0, 0.0)) &&
		frontPolygons[0].GetVertex (4).IsEqual (new JSM.Vector (1.5, 2.0, 0.0)) &&
		frontPolygons[0].GetVertex (5).IsEqual (new JSM.Vector (1.5, 3.0, 0.0)) &&
		frontPolygons[0].GetVertex (6).IsEqual (new JSM.Vector (0.0, 3.0, 0.0)) &&
		frontPolygons[0].GetVertex (7).IsEqual (new JSM.Vector (0.0, 0.0, 0.0))
		);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (
		backPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (1.5, 3.0, 0.0)) &&
		backPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (1.5, 2.0, 0.0)) &&
		backPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (2.0, 2.0, 0.0)) &&
		backPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (2.0, 3.0, 0.0))
		);

	test.Assert (backPolygons[1].VertexCount () == 4);
	test.Assert (
		backPolygons[1].GetVertex (0).IsEqual (new JSM.Vector (1.5, 1.0, 0.0)) &&
		backPolygons[1].GetVertex (1).IsEqual (new JSM.Vector (1.5, 0.0, 0.0)) &&
		backPolygons[1].GetVertex (2).IsEqual (new JSM.Vector (2.0, 0.0, 0.0)) &&
		backPolygons[1].GetVertex (3).IsEqual (new JSM.Vector (2.0, 1.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.5, 0.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.5, 3.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (0.0, 3.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (0.0, 0.0, 0.0))
		);

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (
		backPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (0.5, 3.0, 0.0)) &&
		backPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (0.5, 0.0, 0.0)) &&
		backPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (2.0, 0.0, 0.0)) &&
		backPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (2.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (4).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (5).IsEqual (new JSM.Vector (1.0, 2.0, 0.0)) &&
		backPolygons[0].GetVertex (6).IsEqual (new JSM.Vector (2.0, 2.0, 0.0)) &&
		backPolygons[0].GetVertex (7).IsEqual (new JSM.Vector (2.0, 3.0, 0.0))
		);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 1);

	plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	backPolygons = [];
	frontPolygons = [];
	result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 2);

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (
		frontPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (1.5, 3.0, 0.0)) &&
		frontPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (1.5, 2.0, 0.0)) &&
		frontPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (2.0, 2.0, 0.0)) &&
		frontPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (2.0, 3.0, 0.0))
		);

	test.Assert (frontPolygons[1].VertexCount () == 4);
	test.Assert (
		frontPolygons[1].GetVertex (0).IsEqual (new JSM.Vector (1.5, 1.0, 0.0)) &&
		frontPolygons[1].GetVertex (1).IsEqual (new JSM.Vector (1.5, 0.0, 0.0)) &&
		frontPolygons[1].GetVertex (2).IsEqual (new JSM.Vector (2.0, 0.0, 0.0)) &&
		frontPolygons[1].GetVertex (3).IsEqual (new JSM.Vector (2.0, 1.0, 0.0))
		);

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (
		backPolygons[0].GetVertex (0).IsEqual (new JSM.Vector (1.5, 0.0, 0.0)) &&
		backPolygons[0].GetVertex (1).IsEqual (new JSM.Vector (1.5, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (2).IsEqual (new JSM.Vector (1.0, 1.0, 0.0)) &&
		backPolygons[0].GetVertex (3).IsEqual (new JSM.Vector (1.0, 2.0, 0.0)) &&
		backPolygons[0].GetVertex (4).IsEqual (new JSM.Vector (1.5, 2.0, 0.0)) &&
		backPolygons[0].GetVertex (5).IsEqual (new JSM.Vector (1.5, 3.0, 0.0)) &&
		backPolygons[0].GetVertex (6).IsEqual (new JSM.Vector (0.0, 3.0, 0.0)) &&
		backPolygons[0].GetVertex (7).IsEqual (new JSM.Vector (0.0, 0.0, 0.0))
		);
});

cutPolygonSuite.AddTest ('CutPolygonTest', function (test)
{
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var revPlane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));

	// two cut polygons in both sides
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (1, 2, 0);
	polygon.AddVertex (4, 2, 0);
	polygon.AddVertex (4, 5, 0);
	polygon.AddVertex (0, 5, 0);
	polygon.AddVertex (0, 4, 0);
	polygon.AddVertex (3, 4, 0);
	polygon.AddVertex (3, 3, 0);
	polygon.AddVertex (0, 3, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 2);

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (1, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (1, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (5).IsEqual (new JSM.Coord (2, 3, 0)));
	test.Assert (backPolygons[0].GetVertex (6).IsEqual (new JSM.Coord (0, 3, 0)));
	test.Assert (backPolygons[0].GetVertex (7).IsEqual (new JSM.Coord (0, 0, 0)));

	test.Assert (backPolygons[1].VertexCount () == 4);
	test.Assert (backPolygons[1].GetVertex (0).IsEqual (new JSM.Coord (2, 4, 0)));
	test.Assert (backPolygons[1].GetVertex (1).IsEqual (new JSM.Coord (2, 5, 0)));
	test.Assert (backPolygons[1].GetVertex (2).IsEqual (new JSM.Coord (0, 5, 0)));
	test.Assert (backPolygons[1].GetVertex (3).IsEqual (new JSM.Coord (0, 4, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 8);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 5, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 4, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 4, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 3, 0)));
	test.Assert (frontPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 3, 0)));
	test.Assert (frontPolygons[0].GetVertex (5).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (6).IsEqual (new JSM.Coord (4, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (7).IsEqual (new JSM.Coord (4, 5, 0)));

	test.Assert (frontPolygons[1].VertexCount () == 4);
	test.Assert (frontPolygons[1].GetVertex (0).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (frontPolygons[1].GetVertex (1).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (frontPolygons[1].GetVertex (2).IsEqual (new JSM.Coord (3, 0, 0)));
	test.Assert (frontPolygons[1].GetVertex (3).IsEqual (new JSM.Coord (3, 1, 0)));

	// same with reversed plane
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, revPlane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 2);
	test.Assert (frontPolygons.length == 2);

	test.Assert (frontPolygons[0].VertexCount () == 8);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (1, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (1, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (5).IsEqual (new JSM.Coord (2, 3, 0)));
	test.Assert (frontPolygons[0].GetVertex (6).IsEqual (new JSM.Coord (0, 3, 0)));
	test.Assert (frontPolygons[0].GetVertex (7).IsEqual (new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[1].VertexCount () == 4);
	test.Assert (frontPolygons[1].GetVertex (0).IsEqual (new JSM.Coord (2, 4, 0)));
	test.Assert (frontPolygons[1].GetVertex (1).IsEqual (new JSM.Coord (2, 5, 0)));
	test.Assert (frontPolygons[1].GetVertex (2).IsEqual (new JSM.Coord (0, 5, 0)));
	test.Assert (frontPolygons[1].GetVertex (3).IsEqual (new JSM.Coord (0, 4, 0)));

	test.Assert (backPolygons[0].VertexCount () == 8);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 5, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 4, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 4, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 3, 0)));
	test.Assert (backPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 3, 0)));
	test.Assert (backPolygons[0].GetVertex (5).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (6).IsEqual (new JSM.Coord (4, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (7).IsEqual (new JSM.Coord (4, 5, 0)));

	test.Assert (backPolygons[1].VertexCount () == 4);
	test.Assert (backPolygons[1].GetVertex (0).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (backPolygons[1].GetVertex (1).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (backPolygons[1].GetVertex (2).IsEqual (new JSM.Coord (3, 0, 0)));
	test.Assert (backPolygons[1].GetVertex (3).IsEqual (new JSM.Coord (3, 1, 0)));

	// all outside
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (0, 1, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (1, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 1, 0)));

	// all outside, some on the plane
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 2, 0);
	polygon.AddVertex (0, 2, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 2, 0)));

	// all inside
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (4, 0, 0);
	polygon.AddVertex (4, 1, 0);
	polygon.AddVertex (3, 1, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (3, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (4, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (4, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 1, 0)));

	// all inside, some on the plane
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (2, 1, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (3, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (2, 1, 0)));
	
	// both sides, clean cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (3, 3, 0);
	polygon.AddVertex (0, 3, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 3, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 3, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 3, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 3, 0)));

	// both sides, edge on the plane cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 1, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (3, 2, 0);
	polygon.AddVertex (0, 2, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 5);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 0, 0)));
	
	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 2, 0)));

	// both sides, edge on the plane cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 1, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (3, 2, 0);
	polygon.AddVertex (0, 2, 0);
	polygon.AddVertex (0, 0, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 5);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 2, 0)));

	// both sides, edge on the plane cut
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (2, 1, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (3, 2, 0);
	polygon.AddVertex (0, 2, 0);
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 5);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (4).IsEqual (new JSM.Coord (2, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (3, 2, 0)));
	
	// cut triangle
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (3, 0, 0);
	polygon.AddVertex (0, 2, 0);

	var backPolygons = [];
	var frontPolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 0.6666666666666666, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 2, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (2, 0.6666666666666666, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (2, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (3, 0, 0)));

	// cut triangles from polygon
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (10, 0, 0);
	polygon.AddVertex (10, 3, 0);
	polygon.AddVertex (9, 1, 0);
	polygon.AddVertex (8, 3, 0);
	polygon.AddVertex (7, 1, 0);
	polygon.AddVertex (6, 3, 0);
	polygon.AddVertex (5, 1, 0);
	polygon.AddVertex (4, 3, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (2, 3, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (0, 3, 0);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 2.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 6);	

	test.Assert (backPolygons[0].VertexCount () == 19);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[1].VertexCount () == 3);
	test.Assert (frontPolygons[2].VertexCount () == 3);
	test.Assert (frontPolygons[3].VertexCount () == 3);
	test.Assert (frontPolygons[4].VertexCount () == 3);
	test.Assert (frontPolygons[5].VertexCount () == 3);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 2.0, 0.0), new JSM.Vector (0.0, -1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 6);
	test.Assert (frontPolygons.length == 1);	

	test.Assert (frontPolygons[0].VertexCount () == 19);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[1].VertexCount () == 3);
	test.Assert (backPolygons[2].VertexCount () == 3);
	test.Assert (backPolygons[3].VertexCount () == 3);
	test.Assert (backPolygons[4].VertexCount () == 3);
	test.Assert (backPolygons[5].VertexCount () == 3);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 1.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 6);

	test.Assert (backPolygons[0].VertexCount () == 9);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[1].VertexCount () == 3);
	test.Assert (frontPolygons[2].VertexCount () == 3);
	test.Assert (frontPolygons[3].VertexCount () == 3);
	test.Assert (frontPolygons[4].VertexCount () == 3);
	test.Assert (frontPolygons[5].VertexCount () == 3);

	// cut through existing vertices
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (4, 0, 0);
	polygon.AddVertex (3, 1, 0);
	polygon.AddVertex (4, 2, 0);
	polygon.AddVertex (0, 2, 0);
	polygon.AddVertex (1, 1, 0);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 1.0, 0.0), new JSM.Vector (0.0, 1.0, 0.0));

	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (3, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (4, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (1, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (3, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (4, 2, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 2, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 1.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 2);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 1.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 6);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, -1.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 6);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 0);
	test.Assert (planePolygons.length == 1);
	test.Assert (planePolygons[0].VertexCount () == 6);
});

cutPolygonSuite.AddTest ('CutTriangleTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (0, 1, 0);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (2.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (1.0, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, -1.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 0);
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 1);
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (1, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 0);
	test.Assert (planePolygons.length == 1);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, -1.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 0);
	test.Assert (frontPolygons.length == 0);
	test.Assert (planePolygons.length == 1);

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.5, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));
	
	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.5, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (1, 0, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (-1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (frontPolygons[0].VertexCount () == 4);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.5, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (0, 0, 0)));
	
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.5, 0.5, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.5, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (1, 0, 0)));

	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (1, 0, 0);
	polygon.AddVertex (0.5, 1, 0);
	
	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.5, 0.0, 0.0), new JSM.Vector (1.0, 0.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);
	
	test.Assert (backPolygons[0].VertexCount () == 3);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.5, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.5, 1, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.5, 1, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.5, 0, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (1, 0, 0)));

	var plane = JSM.GetPlaneFromCoordAndDirection (new JSM.Coord (0.0, 0.5, 0.0), new JSM.Vector (0.0, 1.0, 0.0));
	var backPolygons = [];
	var frontPolygons = [];
	var planePolygons = [];
	var result = JSM.CutPolygonWithPlane (polygon, plane, frontPolygons, backPolygons, planePolygons);
	test.Assert (result == true);
	test.Assert (backPolygons.length == 1);
	test.Assert (frontPolygons.length == 1);

	test.Assert (backPolygons[0].VertexCount () == 4);
	test.Assert (backPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.75, 0.5, 0)));
	test.Assert (backPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.25, 0.5, 0)));
	test.Assert (backPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0, 0, 0)));
	test.Assert (backPolygons[0].GetVertex (3).IsEqual (new JSM.Coord (1, 0, 0)));

	test.Assert (frontPolygons[0].VertexCount () == 3);
	test.Assert (frontPolygons[0].GetVertex (0).IsEqual (new JSM.Coord (0.25, 0.5, 0)));
	test.Assert (frontPolygons[0].GetVertex (1).IsEqual (new JSM.Coord (0.75, 0.5, 0)));
	test.Assert (frontPolygons[0].GetVertex (2).IsEqual (new JSM.Coord (0.5, 1, 0)));
});

cutPolygonSuite.AddTest ('SegmentPolygonTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0, 0);
	polygon.AddVertex (10, 0);
	polygon.AddVertex (10, 10);
	polygon.AddVertex (0, 10);
	polygon.AddVertex (4, 5);

	var area = polygon.GetArea ();
	var segmented = JSM.SegmentPolygon2D (polygon, 5, 5);
	test.Assert (segmented.length == 25);

	var segmentedArea = 0.0;
	var i;
	for (i = 0; i < segmented.length; i++) {
		segmentedArea += segmented[i].GetArea ();
	}	
	test.Assert (JSM.IsEqual (area, segmentedArea));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 3.0);
	polygon.AddVertex (0.0, 3.0);
	polygon.AddVertex (0.0, 2.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	
	var area = polygon.GetArea ();
	var segmented = JSM.SegmentPolygon2D (polygon, 5, 5);
	test.Assert (segmented.length == 23);

	var segmentedArea = 0.0;
	var i;
	for (i = 0; i < segmented.length; i++) {
		segmentedArea += segmented[i].GetArea ();
	}	
	test.Assert (JSM.IsEqual (area, segmentedArea));	
});

}
