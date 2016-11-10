module.exports = function (unitTest)
{

var simpleSuite = unitTest.AddTestSuite ('PolygonTest');

function IsEqualPolygons (a, b)
{
	if (a.VertexCount () != b.VertexCount ()) {
		return false;
	}
	var i;
	for (i = 0; i < a.VertexCount (); i++) {
		if (!a.GetVertex (i).IsEqual (b.GetVertex (i))) {
			return false;
		}
	}
	
	return true;
}

function IsEqualContourPolygons (a, b)
{
	if (a.ContourCount () != b.ContourCount ()) {
		return false;
	}
	var i;
	for (i = 0; i < a.ContourCount (); i++) {
		if (!IsEqualPolygons (a.GetContour (i), b.GetContour (i))) {
			return false;
		}
	}
	
	return true;
}


simpleSuite.AddTest ('AddVertexTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	test.AssertEqual (polygon.VertexCount (), 3);
	test.AssertEqual (polygon.GetVertex (0).x, 0.0);
	test.AssertEqual (polygon.GetVertex (0).y, 0.0);
	test.AssertEqual (polygon.GetVertex (1).x, 1.0);
	test.AssertEqual (polygon.GetVertex (1).y, 0.0);
	test.AssertEqual (polygon.GetVertex (2).x, 1.0);
	test.AssertEqual (polygon.GetVertex (2).y, 1.0);
	
	polygon.Clear ();
	test.AssertEqual (polygon.VertexCount (), 0);

	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertexCoord (new JSM.Coord2D (0.0, 0.0));
	polygon2.AddVertexCoord (new JSM.Coord2D (1.0, 0.0));
	polygon2.AddVertexCoord (new JSM.Coord2D (1.0, 1.0));
	test.AssertEqual (polygon2.VertexCount (), 3);
	test.AssertEqual (polygon2.GetVertex (0).x, 0.0);
	test.AssertEqual (polygon2.GetVertex (0).y, 0.0);
	test.AssertEqual (polygon2.GetVertex (1).x, 1.0);
	test.AssertEqual (polygon2.GetVertex (1).y, 0.0);
	test.AssertEqual (polygon2.GetVertex (2).x, 1.0);
	test.AssertEqual (polygon2.GetVertex (2).y, 1.0);
});

simpleSuite.AddTest ('CloneTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	
	var cloned = polygon.Clone ();
	test.AssertEqual (polygon.VertexCount (), cloned.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), cloned.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), cloned.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), cloned.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), cloned.GetComplexity ());
	test.Assert (IsEqualPolygons (polygon, cloned));
	
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0.0, 0.0, 1.0);
	polygon.AddVertex (1.0, 0.0, 1.0);
	polygon.AddVertex (1.0, 1.0, 1.0);
	
	var cloned = polygon.Clone ();
	test.Assert (IsEqualPolygons (polygon, cloned));
});

simpleSuite.AddTest ('ReverseTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.5, 0.5);
	polygon.AddVertex (0.0, 1.0);
	
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave);
	test.AssertEqualNum (polygon.GetSignedArea (), 0.75, JSM.Eps);
	
	polygon.ReverseVertices ();
	
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave);
	test.AssertEqualNum (polygon.GetSignedArea (), -0.75, JSM.Eps);
});

simpleSuite.AddTest ('ShiftVerticesTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	
	var vertex0 = new JSM.Coord2D (0.0, 0.0);
	var vertex1 = new JSM.Coord2D (1.0, 0.0);
	var vertex2 = new JSM.Coord2D (1.0, 1.0);
	var vertex3 = new JSM.Coord2D (0.0, 1.0);
	
	polygon.AddVertexCoord (vertex0.Clone ());
	polygon.AddVertexCoord (vertex1.Clone ());
	polygon.AddVertexCoord (vertex2.Clone ());
	polygon.AddVertexCoord (vertex3.Clone ());	
	
	test.Assert (polygon.GetVertex (0).IsEqual (vertex0));
	test.Assert (polygon.GetVertex (1).IsEqual (vertex1));
	test.Assert (polygon.GetVertex (2).IsEqual (vertex2));
	test.Assert (polygon.GetVertex (3).IsEqual (vertex3));
	
	polygon.ShiftVertices (1);
	test.Assert (polygon.GetVertex (0).IsEqual (vertex1));
	test.Assert (polygon.GetVertex (1).IsEqual (vertex2));
	test.Assert (polygon.GetVertex (2).IsEqual (vertex3));
	test.Assert (polygon.GetVertex (3).IsEqual (vertex0));
	
	polygon.ShiftVertices (2);
	test.Assert (polygon.GetVertex (0).IsEqual (vertex3));
	test.Assert (polygon.GetVertex (1).IsEqual (vertex0));
	test.Assert (polygon.GetVertex (2).IsEqual (vertex1));
	test.Assert (polygon.GetVertex (3).IsEqual (vertex2));

	polygon.ShiftVertices (3);
	test.Assert (polygon.GetVertex (0).IsEqual (vertex2));
	test.Assert (polygon.GetVertex (1).IsEqual (vertex3));
	test.Assert (polygon.GetVertex (2).IsEqual (vertex0));
	test.Assert (polygon.GetVertex (3).IsEqual (vertex1));
});

simpleSuite.AddTest ('EnumerateVerticesTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.5, 0.5);
	polygon.AddVertex (0.0, 1.0);
	
	var vertices;
	
	vertices = [];
	polygon.EnumerateVertices (0, 4, function (index) {
		vertices.push (index);
	});
	test.AssertEqual (vertices.toString (), [0, 1, 2, 3, 4].toString ());
	
	vertices = [];
	polygon.EnumerateVertices (0, 0, function (index) {
		vertices.push (index);
	});
	test.AssertEqual (vertices.toString (), [0].toString ());

	vertices = [];
	polygon.EnumerateVertices (0, 1, function (index) {
		vertices.push (index);
	});
	test.AssertEqual (vertices.toString (), [0, 1].toString ());
	
	vertices = [];
	polygon.EnumerateVertices (1, 0, function (index) {
		vertices.push (index);
	});
	test.AssertEqual (vertices.toString (), [1, 2, 3, 4, 0].toString ());
	
	vertices = [];
	polygon.EnumerateVertices (4, 0, function (index) {
		vertices.push (index);
	});
	test.AssertEqual (vertices.toString (), [4, 0].toString ());
	
	vertices = [];
	polygon.EnumerateVertices (3, 2, function (index) {
		vertices.push (index);
	});
	test.AssertEqual (vertices.toString (), [3, 4, 0, 1, 2].toString ());
	
	test.AssertEqual (polygon.GetNextVertex (0), 1);
	test.AssertEqual (polygon.GetNextVertex (1), 2);
	test.AssertEqual (polygon.GetNextVertex (2), 3);
	test.AssertEqual (polygon.GetNextVertex (3), 4);
	test.AssertEqual (polygon.GetNextVertex (4), 0);
	
	test.AssertEqual (polygon.GetPrevVertex (0), 4);
	test.AssertEqual (polygon.GetPrevVertex (1), 0);
	test.AssertEqual (polygon.GetPrevVertex (2), 1);
	test.AssertEqual (polygon.GetPrevVertex (3), 2);
	test.AssertEqual (polygon.GetPrevVertex (4), 3);
});

simpleSuite.AddTest ('InvalidPolygonTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);

	polygon.AddVertex (0.0, 0.0);
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);
	test.AssertEqual (polygon.GetVertexOrientation (0), JSM.Orientation.Invalid);

	polygon.AddVertex (1.0, 0.0);
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);
	test.AssertEqual (polygon.GetVertexOrientation (1), JSM.Orientation.Invalid);

	polygon.AddVertex (2.0, 0.0);
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);
	test.AssertEqual (polygon.GetVertexOrientation (2), JSM.Orientation.Invalid);
});

simpleSuite.AddTest ('ValidTriangleTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	
	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (1.0, 1.0);	
	polygon2.AddVertex (1.0, 0.0);

	test.AssertEqualNum (polygon.GetSignedArea (), 0.5, JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), 0.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);
	test.AssertEqual (polygon.GetVertexOrientation (0), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetVertexOrientation (1), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetVertexOrientation (2), JSM.Orientation.CounterClockwise);
	
	test.AssertEqualNum (polygon2.GetSignedArea (), -0.5, JSM.Eps);
	test.AssertEqualNum (polygon2.GetArea (), 0.5, JSM.Eps);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);
	test.AssertEqual (polygon2.GetVertexOrientation (0), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetVertexOrientation (1), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetVertexOrientation (2), JSM.Orientation.Clockwise);
});

simpleSuite.AddTest ('VertexOrientationTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.8, 0.2);
	
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave);
	test.AssertEqual (polygon.GetVertexOrientation (0), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetVertexOrientation (1), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetVertexOrientation (2), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetVertexOrientation (3), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon.IsConvexVertex (0), true);
	test.AssertEqual (polygon.IsConvexVertex (1), true);
	test.AssertEqual (polygon.IsConvexVertex (2), true);
	test.AssertEqual (polygon.IsConvexVertex (3), false);
	test.AssertEqual (polygon.IsConcaveVertex (0), false);
	test.AssertEqual (polygon.IsConcaveVertex (1), false);
	test.AssertEqual (polygon.IsConcaveVertex (2), false);
	test.AssertEqual (polygon.IsConcaveVertex (3), true);
	
	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (0.8, 0.2);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 0.0);
	
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Concave);
	test.AssertEqual (polygon2.GetVertexOrientation (0), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetVertexOrientation (1), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon2.GetVertexOrientation (2), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetVertexOrientation (3), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.IsConvexVertex (0), true);
	test.AssertEqual (polygon2.IsConvexVertex (1), false);
	test.AssertEqual (polygon2.IsConvexVertex (2), true);
	test.AssertEqual (polygon2.IsConvexVertex (3), true);
	test.AssertEqual (polygon2.IsConcaveVertex (0), false);
	test.AssertEqual (polygon2.IsConcaveVertex (1), true);
	test.AssertEqual (polygon2.IsConcaveVertex (2), false);
	test.AssertEqual (polygon2.IsConcaveVertex (3), false);
	
	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (0.0, 0.0);
	polygon3.AddVertex (1.0, 0.0);
	polygon3.AddVertex (2.0, 0.0);
	polygon3.AddVertex (2.0, 1.0);
	polygon3.AddVertex (1.8, 0.2);
	
	test.AssertEqual (polygon3.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon3.GetComplexity (), JSM.Complexity.Concave);
	test.AssertEqual (polygon3.GetVertexOrientation (0), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon3.GetVertexOrientation (1), JSM.Orientation.Invalid);
	test.AssertEqual (polygon3.GetVertexOrientation (2), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon3.GetVertexOrientation (3), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon3.GetVertexOrientation (4), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon3.IsConvexVertex (0), true);
	test.AssertEqual (polygon3.IsConvexVertex (1), false);
	test.AssertEqual (polygon3.IsConvexVertex (2), true);
	test.AssertEqual (polygon3.IsConvexVertex (3), true);
	test.AssertEqual (polygon3.IsConvexVertex (4), false);
	test.AssertEqual (polygon3.IsConcaveVertex (0), false);
	test.AssertEqual (polygon3.IsConcaveVertex (1), false);
	test.AssertEqual (polygon3.IsConcaveVertex (2), false);
	test.AssertEqual (polygon3.IsConcaveVertex (3), false);
	test.AssertEqual (polygon3.IsConcaveVertex (4), true);
});

simpleSuite.AddTest ('ComplexityTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	
	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (0.0, 1.0);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 0.0);

	test.AssertEqualNum (polygon.GetArea (), 1.0, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);
	
	test.AssertEqualNum (polygon2.GetArea (), 1.0, JSM.Eps);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);

	polygon.AddVertex (-0.5, 0.5);
	polygon2.AddVertex (0.5, -0.5);

	test.AssertEqualNum (polygon.GetArea (), 1.25, JSM.Eps);
	test.AssertEqualNum (polygon2.GetArea (), 1.25, JSM.Eps);
	
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);
	
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);
	
	polygon.AddVertex (0.5, 0.5);
	polygon2.AddVertex (0.5, 0.5);

	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave);
	
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Concave);
	
	var polygon3 = new JSM.Polygon2D ();
	polygon3.AddVertex (0.0, 0.0);
	polygon3.AddVertex (1.0, 0.0);
	polygon3.AddVertex (1.0, 1.0);
	polygon3.AddVertex (0.5, 0.5);
	
	test.AssertEqualNum (polygon3.GetArea (), 0.5, JSM.Eps);
	test.AssertEqual (polygon3.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon3.GetComplexity (), JSM.Complexity.Convex);
	
	var polygon4 = new JSM.Polygon2D ();
	polygon4.AddVertex (0.0, 0.0);
	polygon4.AddVertex (1.0, 0.0);
	polygon4.AddVertex (0.0, 1.0);
	polygon4.AddVertex (-1.0, 0.0);
	
	test.AssertEqualNum (polygon4.GetArea (), 1.0, JSM.Eps);
	test.AssertEqual (polygon4.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon4.GetComplexity (), JSM.Complexity.Convex);
	
	var polygon5 = new JSM.Polygon2D ();
	polygon5.AddVertex (0.0, 0.0);
	polygon5.AddVertex (1.0, 0.0);
	polygon5.AddVertex (1.0, 1.0);
	polygon5.AddVertex (0.6, 0.5);
	
	test.AssertEqualNum (polygon5.GetArea (), 0.45, JSM.Eps);
	test.AssertEqual (polygon5.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon5.GetComplexity (), JSM.Complexity.Concave);

	var polygon6 = new JSM.Polygon2D ();
	polygon6.AddVertex (0.0, 0.0);
	polygon6.AddVertex (1.0, 0.0);
	polygon6.AddVertex (2.0, 0.0);
	polygon6.AddVertex (3.0, 0.0);
	polygon6.AddVertex (3.0, 1.0);

	test.AssertEqualNum (polygon6.GetArea (), 1.5, JSM.Eps);
	test.AssertEqual (polygon6.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon6.GetComplexity (), JSM.Complexity.Convex);
});

simpleSuite.AddTest ('VertexAngleTest', function (test)
{
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 0);
	polygon.AddVertex (2, 0, 0);
	polygon.AddVertex (2, 2, 0);
	polygon.AddVertex (1, 2, 0);
	polygon.AddVertex (1, 1, 0);
	polygon.AddVertex (0, 1, 0);
	var i;
	for (i = 0; i < polygon.VertexCount (); i++) {
		test.AssertEqualNum (polygon.GetVertexAngle (i), Math.PI / 2.0, JSM.Eps);
	}
	
	var circle = JSM.GenerateCirclePoints (1, 20, new JSM.Coord (0, 0, 0));
	polygon.FromArray (circle);
	test.AssertEqual (polygon.VertexCount (), 20);
	var angleSum = (20 - 2) * Math.PI;
	for (i = 0; i < polygon.VertexCount (); i++) {
		test.AssertEqualNum (polygon.GetVertexAngle (i), angleSum / 20.0, JSM.Eps);
	}
});

simpleSuite.AddTest ('FromToArrayTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);

	var polygon2 = new JSM.Polygon2D ();
	polygon2.FromArray (polygon.ToArray ());
	
	test.Assert (IsEqualPolygons (polygon, polygon2));
	test.AssertEqual (polygon.VertexCount (), polygon2.VertexCount ());
	test.AssertEqualNum (polygon.GetArea (), polygon2.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), polygon2.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), polygon2.GetComplexity ());
	
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 3.0);
	polygon.AddVertex (0.0, 3.0);

	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.FromArray (polygon.ToArray ());
	
	test.Assert (IsEqualContourPolygons (polygon, polygon2));
	test.AssertEqual (polygon.VertexCount (), polygon2.VertexCount ());
	test.AssertEqual (polygon.ContourCount (), polygon2.ContourCount ());
	test.AssertEqualNum (polygon.GetArea (), polygon2.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), polygon2.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), polygon2.GetComplexity ());	
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);		

	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.FromArray (polygon.ToArray ());
	
	test.AssertEqual (polygon.VertexCount (), polygon2.VertexCount ());
	test.AssertEqual (polygon.ContourCount (), polygon2.ContourCount ());
	test.AssertEqualNum (polygon.GetArea (), polygon2.GetArea (), JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), polygon2.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), polygon2.GetComplexity ());	
	
	test.AssertEqual (polygon.GetLastContour ().VertexCount (), polygon.GetContour (1).VertexCount ());
	
	var polygon = new JSM.Polygon ();
	polygon.AddVertex (0, 0, 1);
	polygon.AddVertex (1, 0, 1);
	polygon.AddVertex (1, 1, 1);
	polygon.AddVertex (0, 1, 1);
	var polygon2 = new JSM.Polygon ();
	polygon2.FromArray (polygon.ToArray ());
	test.Assert (IsEqualPolygons (polygon, polygon2));
	
	var polygon = new JSM.ContourPolygon ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 3.0, 1.0);
	polygon.AddVertex (0.0, 3.0, 1.0);

	var polygon2 = new JSM.ContourPolygon ();
	polygon2.FromArray (polygon.ToArray ());
	test.Assert (IsEqualContourPolygons (polygon, polygon2));
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0, 1.0);
	polygon.AddVertex (1.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 1.0, 1.0);		

	var polygon2 = new JSM.ContourPolygon ();
	polygon2.FromArray (polygon.ToArray ());
	test.Assert (IsEqualContourPolygons (polygon, polygon2));
	
	test.AssertEqual (polygon.GetLastContour ().VertexCount (), polygon.GetContour (1).VertexCount ());
});

simpleSuite.AddTest ('BoundingBoxTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);

	var box = polygon.GetBoundingBox ();
	test.Assert (box.min.IsEqual (new JSM.Coord2D (0.0, 0.0)));
	test.Assert (box.max.IsEqual (new JSM.Coord2D (1.0, 1.0)));

	polygon.AddVertex (-1.0, 0.5);
	var box = polygon.GetBoundingBox ();
	test.Assert (box.min.IsEqual (new JSM.Coord2D (-1.0, 0.0)));
	test.Assert (box.max.IsEqual (new JSM.Coord2D (1.0, 1.0)));

	polygon.AddVertex (-2.0, 3.0);
	polygon.AddVertex (-2.0, -0.5);
	var box = polygon.GetBoundingBox ();
	test.Assert (box.min.IsEqual (new JSM.Coord2D (-2.0, -0.5)));
	test.Assert (box.max.IsEqual (new JSM.Coord2D (1.0, 3.0)));

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (-2.0, -2.0);
	polygon.AddVertex (2.0, -2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (-2.0, 2.0);

	var box = polygon.GetBoundingBox ();
	test.Assert (box.min.IsEqual (new JSM.Coord2D (-2.0, -2.0)));
	test.Assert (box.max.IsEqual (new JSM.Coord2D (2.0, 2.0)));
});

var pointInPolygonSuite = unitTest.AddTestSuite ('PointInPolygonTest');

pointInPolygonSuite.AddTest ('PointInPolygonConvexTest', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (0.0, 0.0)), JSM.CoordPolygonPosition2D.OnVertex);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (2.0, 0.0)), JSM.CoordPolygonPosition2D.OnVertex);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (2.0, 2.0)), JSM.CoordPolygonPosition2D.OnVertex);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (0.0, 2.0)), JSM.CoordPolygonPosition2D.OnVertex);

	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (1.0, 0.0)), JSM.CoordPolygonPosition2D.OnEdge);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (2.0, 1.0)), JSM.CoordPolygonPosition2D.OnEdge);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (1.0, 2.0)), JSM.CoordPolygonPosition2D.OnEdge);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (0.0, 1.0)), JSM.CoordPolygonPosition2D.OnEdge);

	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (1.0, 1.0)), JSM.CoordPolygonPosition2D.Inside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (-1.0, 1.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (3.0, 1.0)), JSM.CoordPolygonPosition2D.Outside);
    
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (-1.0, 0.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (-1.0, 2.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (3.0, 0.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (3.0, 2.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (-1.0, 3.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon.CoordPosition (new JSM.Coord2D (3.0, 3.0)), JSM.CoordPolygonPosition2D.Outside);
	
	var polygon2 = new JSM.Polygon2D ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (0.0, 2.0);
	polygon2.AddVertex (-1.0, 1.0);
	
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (0.0, 1.0)), JSM.CoordPolygonPosition2D.Inside);
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (-2.0, 1.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (2.0, 1.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (-0.5, 0.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (0.5, 0.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (-0.5, 2.0)), JSM.CoordPolygonPosition2D.Outside);
	test.AssertEqual (polygon2.CoordPosition (new JSM.Coord2D (0.5, 2.0)), JSM.CoordPolygonPosition2D.Outside);
});

var diagonalSuite = unitTest.AddTestSuite ('IsDiagonalSuite');

diagonalSuite.AddTest ('IsDiagonalTest01', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);

	test.AssertEqualNum (polygon.GetArea (), 3.0, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Concave);
	
	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	test.AssertEqual (polygon.IsDiagonal (0, 4), true);
	test.AssertEqual (polygon.IsDiagonal (0, 5), false);
    
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
	test.AssertEqual (polygon.IsDiagonal (1, 4), true);
	test.AssertEqual (polygon.IsDiagonal (1, 5), true);
    
	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
	test.AssertEqual (polygon.IsDiagonal (2, 4), true);
	test.AssertEqual (polygon.IsDiagonal (2, 5), false);
    
	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);
	test.AssertEqual (polygon.IsDiagonal (3, 4), false);
	test.AssertEqual (polygon.IsDiagonal (3, 5), false);
	
	test.AssertEqual (polygon.IsDiagonal (4, 0), true);
	test.AssertEqual (polygon.IsDiagonal (4, 1), true);
	test.AssertEqual (polygon.IsDiagonal (4, 2), true);
	test.AssertEqual (polygon.IsDiagonal (4, 3), false);
	test.AssertEqual (polygon.IsDiagonal (4, 4), false);
	test.AssertEqual (polygon.IsDiagonal (4, 5), false);
    
	test.AssertEqual (polygon.IsDiagonal (5, 0), false);
	test.AssertEqual (polygon.IsDiagonal (5, 1), true);
	test.AssertEqual (polygon.IsDiagonal (5, 2), false);
	test.AssertEqual (polygon.IsDiagonal (5, 3), false);
	test.AssertEqual (polygon.IsDiagonal (5, 4), false);
	test.AssertEqual (polygon.IsDiagonal (5, 5), false);
});
   
diagonalSuite.AddTest ('IsDiagonalTest02', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.2, 0.2);
    
	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
    
	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
    
	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.8, 0.2);
    
	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
    
	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
    
	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);	
});
   
diagonalSuite.AddTest ('IsDiagonalTest03', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 0.1);
	
	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
    
	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
    
	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);
});
	
diagonalSuite.AddTest ('IsDiagonalTest04', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (4.0, 1.0);
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (0.0, 2.0);
	
	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	test.AssertEqual (polygon.IsDiagonal (0, 4), true);
	test.AssertEqual (polygon.IsDiagonal (0, 5), true);
	test.AssertEqual (polygon.IsDiagonal (0, 6), false);
	test.AssertEqual (polygon.IsDiagonal (0, 7), false);
	test.AssertEqual (polygon.IsDiagonal (0, 8), true);
	test.AssertEqual (polygon.IsDiagonal (0, 9), true);
	test.AssertEqual (polygon.IsDiagonal (0, 10), true);
	test.AssertEqual (polygon.IsDiagonal (0, 11), false);

	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
	test.AssertEqual (polygon.IsDiagonal (1, 4), true);
	test.AssertEqual (polygon.IsDiagonal (1, 5), true);
	test.AssertEqual (polygon.IsDiagonal (1, 6), false);
	test.AssertEqual (polygon.IsDiagonal (1, 7), false);
	test.AssertEqual (polygon.IsDiagonal (1, 8), true);
	test.AssertEqual (polygon.IsDiagonal (1, 9), true);
	test.AssertEqual (polygon.IsDiagonal (1, 10), false);
	test.AssertEqual (polygon.IsDiagonal (1, 11), false);

	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
	test.AssertEqual (polygon.IsDiagonal (2, 4), true);
	test.AssertEqual (polygon.IsDiagonal (2, 5), false);
	test.AssertEqual (polygon.IsDiagonal (2, 6), false);
	test.AssertEqual (polygon.IsDiagonal (2, 7), false);
	test.AssertEqual (polygon.IsDiagonal (2, 8), false);
	test.AssertEqual (polygon.IsDiagonal (2, 9), false);
	test.AssertEqual (polygon.IsDiagonal (2, 10), false);
	test.AssertEqual (polygon.IsDiagonal (2, 11), false);

	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);
	test.AssertEqual (polygon.IsDiagonal (3, 4), false);
	test.AssertEqual (polygon.IsDiagonal (3, 5), false);
	test.AssertEqual (polygon.IsDiagonal (3, 6), false);
	test.AssertEqual (polygon.IsDiagonal (3, 7), false);
	test.AssertEqual (polygon.IsDiagonal (3, 8), false);
	test.AssertEqual (polygon.IsDiagonal (3, 9), false);
	test.AssertEqual (polygon.IsDiagonal (3, 10), false);
	test.AssertEqual (polygon.IsDiagonal (3, 11), false);

	test.AssertEqual (polygon.IsDiagonal (4, 0), true);
	test.AssertEqual (polygon.IsDiagonal (4, 1), true);
	test.AssertEqual (polygon.IsDiagonal (4, 2), true);
	test.AssertEqual (polygon.IsDiagonal (4, 3), false);
	test.AssertEqual (polygon.IsDiagonal (4, 4), false);
	test.AssertEqual (polygon.IsDiagonal (4, 5), false);
	test.AssertEqual (polygon.IsDiagonal (4, 6), false);
	test.AssertEqual (polygon.IsDiagonal (4, 7), false);
	test.AssertEqual (polygon.IsDiagonal (4, 8), false);
	test.AssertEqual (polygon.IsDiagonal (4, 9), false);
	test.AssertEqual (polygon.IsDiagonal (4, 10), false);
	test.AssertEqual (polygon.IsDiagonal (4, 11), false);

	test.AssertEqual (polygon.IsDiagonal (5, 0), true);
	test.AssertEqual (polygon.IsDiagonal (5, 1), true);
	test.AssertEqual (polygon.IsDiagonal (5, 2), false);
	test.AssertEqual (polygon.IsDiagonal (5, 3), false);
	test.AssertEqual (polygon.IsDiagonal (5, 4), false);
	test.AssertEqual (polygon.IsDiagonal (5, 5), false);
	test.AssertEqual (polygon.IsDiagonal (5, 6), false);
	test.AssertEqual (polygon.IsDiagonal (5, 7), true);
	test.AssertEqual (polygon.IsDiagonal (5, 8), true);
	test.AssertEqual (polygon.IsDiagonal (5, 9), false);
	test.AssertEqual (polygon.IsDiagonal (5, 10), false);
	test.AssertEqual (polygon.IsDiagonal (5, 11), false);

	test.AssertEqual (polygon.IsDiagonal (6, 0), false);
	test.AssertEqual (polygon.IsDiagonal (6, 1), false);
	test.AssertEqual (polygon.IsDiagonal (6, 2), false);
	test.AssertEqual (polygon.IsDiagonal (6, 3), false);
	test.AssertEqual (polygon.IsDiagonal (6, 4), false);
	test.AssertEqual (polygon.IsDiagonal (6, 5), false);
	test.AssertEqual (polygon.IsDiagonal (6, 6), false);
	test.AssertEqual (polygon.IsDiagonal (6, 7), false);
	test.AssertEqual (polygon.IsDiagonal (6, 8), true);
	test.AssertEqual (polygon.IsDiagonal (6, 9), false);
	test.AssertEqual (polygon.IsDiagonal (6, 10), false);
	test.AssertEqual (polygon.IsDiagonal (6, 11), false);

	test.AssertEqual (polygon.IsDiagonal (7, 0), false);
	test.AssertEqual (polygon.IsDiagonal (7, 1), false);
	test.AssertEqual (polygon.IsDiagonal (7, 2), false);
	test.AssertEqual (polygon.IsDiagonal (7, 3), false);
	test.AssertEqual (polygon.IsDiagonal (7, 4), false);
	test.AssertEqual (polygon.IsDiagonal (7, 5), true);
	test.AssertEqual (polygon.IsDiagonal (7, 6), false);
	test.AssertEqual (polygon.IsDiagonal (7, 7), false);
	test.AssertEqual (polygon.IsDiagonal (7, 8), false);
	test.AssertEqual (polygon.IsDiagonal (7, 9), false);
	test.AssertEqual (polygon.IsDiagonal (7, 10), false);
	test.AssertEqual (polygon.IsDiagonal (7, 11), false);

	test.AssertEqual (polygon.IsDiagonal (8, 0), true);
	test.AssertEqual (polygon.IsDiagonal (8, 1), true);
	test.AssertEqual (polygon.IsDiagonal (8, 2), false);
	test.AssertEqual (polygon.IsDiagonal (8, 3), false);
	test.AssertEqual (polygon.IsDiagonal (8, 4), false);
	test.AssertEqual (polygon.IsDiagonal (8, 5), true);
	test.AssertEqual (polygon.IsDiagonal (8, 6), true);
	test.AssertEqual (polygon.IsDiagonal (8, 7), false);
	test.AssertEqual (polygon.IsDiagonal (8, 8), false);
	test.AssertEqual (polygon.IsDiagonal (8, 9), false);
	test.AssertEqual (polygon.IsDiagonal (8, 10), false);
	test.AssertEqual (polygon.IsDiagonal (8, 11), false);

	test.AssertEqual (polygon.IsDiagonal (9, 0), true);
	test.AssertEqual (polygon.IsDiagonal (9, 1), true);
	test.AssertEqual (polygon.IsDiagonal (9, 2), false);
	test.AssertEqual (polygon.IsDiagonal (9, 3), false);
	test.AssertEqual (polygon.IsDiagonal (9, 4), false);
	test.AssertEqual (polygon.IsDiagonal (9, 5), false);
	test.AssertEqual (polygon.IsDiagonal (9, 6), false);
	test.AssertEqual (polygon.IsDiagonal (9, 7), false);
	test.AssertEqual (polygon.IsDiagonal (9, 8), false);
	test.AssertEqual (polygon.IsDiagonal (9, 9), false);
	test.AssertEqual (polygon.IsDiagonal (9, 10), false);
	test.AssertEqual (polygon.IsDiagonal (9, 11), true);

	test.AssertEqual (polygon.IsDiagonal (10, 0), true);
	test.AssertEqual (polygon.IsDiagonal (10, 1), false);
	test.AssertEqual (polygon.IsDiagonal (10, 2), false);
	test.AssertEqual (polygon.IsDiagonal (10, 3), false);
	test.AssertEqual (polygon.IsDiagonal (10, 4), false);
	test.AssertEqual (polygon.IsDiagonal (10, 5), false);
	test.AssertEqual (polygon.IsDiagonal (10, 6), false);
	test.AssertEqual (polygon.IsDiagonal (10, 7), false);
	test.AssertEqual (polygon.IsDiagonal (10, 8), false);
	test.AssertEqual (polygon.IsDiagonal (10, 9), false);
	test.AssertEqual (polygon.IsDiagonal (10, 10), false);
	test.AssertEqual (polygon.IsDiagonal (10, 11), false);

	test.AssertEqual (polygon.IsDiagonal (11, 0), false);
	test.AssertEqual (polygon.IsDiagonal (11, 1), false);
	test.AssertEqual (polygon.IsDiagonal (11, 2), false);
	test.AssertEqual (polygon.IsDiagonal (11, 3), false);
	test.AssertEqual (polygon.IsDiagonal (11, 4), false);
	test.AssertEqual (polygon.IsDiagonal (11, 5), false);
	test.AssertEqual (polygon.IsDiagonal (11, 6), false);
	test.AssertEqual (polygon.IsDiagonal (11, 7), false);
	test.AssertEqual (polygon.IsDiagonal (11, 8), false);
	test.AssertEqual (polygon.IsDiagonal (11, 9), true);
	test.AssertEqual (polygon.IsDiagonal (11, 10), false);
	test.AssertEqual (polygon.IsDiagonal (11, 11), false);
});

diagonalSuite.AddTest ('IsDiagonalTest05', function (test)
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
	
	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	test.AssertEqual (polygon.IsDiagonal (0, 4), false);
	test.AssertEqual (polygon.IsDiagonal (0, 5), false);
	test.AssertEqual (polygon.IsDiagonal (0, 6), false);
	test.AssertEqual (polygon.IsDiagonal (0, 7), false);
	
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), false);
	test.AssertEqual (polygon.IsDiagonal (1, 4), false);
	test.AssertEqual (polygon.IsDiagonal (1, 5), false);
	test.AssertEqual (polygon.IsDiagonal (1, 6), true);
	test.AssertEqual (polygon.IsDiagonal (1, 7), false);

	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
	test.AssertEqual (polygon.IsDiagonal (2, 4), false);
	test.AssertEqual (polygon.IsDiagonal (2, 5), true);
	test.AssertEqual (polygon.IsDiagonal (2, 6), true);
	test.AssertEqual (polygon.IsDiagonal (2, 7), false);

	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), false);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);
	test.AssertEqual (polygon.IsDiagonal (3, 4), false);
	test.AssertEqual (polygon.IsDiagonal (3, 5), false);
	test.AssertEqual (polygon.IsDiagonal (3, 6), false);
	test.AssertEqual (polygon.IsDiagonal (3, 7), false);

	test.AssertEqual (polygon.IsDiagonal (4, 0), false);
	test.AssertEqual (polygon.IsDiagonal (4, 1), false);
	test.AssertEqual (polygon.IsDiagonal (4, 2), false);
	test.AssertEqual (polygon.IsDiagonal (4, 3), false);
	test.AssertEqual (polygon.IsDiagonal (4, 4), false);
	test.AssertEqual (polygon.IsDiagonal (4, 5), false);
	test.AssertEqual (polygon.IsDiagonal (4, 6), false);
	test.AssertEqual (polygon.IsDiagonal (4, 7), false);

	test.AssertEqual (polygon.IsDiagonal (5, 0), false);
	test.AssertEqual (polygon.IsDiagonal (5, 1), false);
	test.AssertEqual (polygon.IsDiagonal (5, 2), true);
	test.AssertEqual (polygon.IsDiagonal (5, 3), false);
	test.AssertEqual (polygon.IsDiagonal (5, 4), false);
	test.AssertEqual (polygon.IsDiagonal (5, 5), false);
	test.AssertEqual (polygon.IsDiagonal (5, 6), false);
	test.AssertEqual (polygon.IsDiagonal (5, 7), false);

	test.AssertEqual (polygon.IsDiagonal (6, 0), false);
	test.AssertEqual (polygon.IsDiagonal (6, 1), true);
	test.AssertEqual (polygon.IsDiagonal (6, 2), true);
	test.AssertEqual (polygon.IsDiagonal (6, 3), false);
	test.AssertEqual (polygon.IsDiagonal (6, 4), false);
	test.AssertEqual (polygon.IsDiagonal (6, 5), false);
	test.AssertEqual (polygon.IsDiagonal (6, 6), false);
	test.AssertEqual (polygon.IsDiagonal (6, 7), false);
	
	test.AssertEqual (polygon.IsDiagonal (7, 0), false);
	test.AssertEqual (polygon.IsDiagonal (7, 1), false);
	test.AssertEqual (polygon.IsDiagonal (7, 2), false);
	test.AssertEqual (polygon.IsDiagonal (7, 3), false);
	test.AssertEqual (polygon.IsDiagonal (7, 4), false);
	test.AssertEqual (polygon.IsDiagonal (7, 5), false);
	test.AssertEqual (polygon.IsDiagonal (7, 6), false);
	test.AssertEqual (polygon.IsDiagonal (7, 7), false);	
});

diagonalSuite.AddTest ('IsDiagonalTest06', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (2.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 0.1);
	polygon.AddVertex (0.0, 1.0);

	test.AssertEqual (polygon.IsDiagonal (0, 0), false);
	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
	test.AssertEqual (polygon.IsDiagonal (0, 3), false);
	test.AssertEqual (polygon.IsDiagonal (0, 4), true);
	test.AssertEqual (polygon.IsDiagonal (0, 5), false);
	
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
	test.AssertEqual (polygon.IsDiagonal (1, 4), true);
	test.AssertEqual (polygon.IsDiagonal (1, 5), true);

	test.AssertEqual (polygon.IsDiagonal (2, 0), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 2), false);
	test.AssertEqual (polygon.IsDiagonal (2, 3), false);
	test.AssertEqual (polygon.IsDiagonal (2, 4), true);
	test.AssertEqual (polygon.IsDiagonal (2, 5), false);

	test.AssertEqual (polygon.IsDiagonal (3, 0), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (3, 2), false);
	test.AssertEqual (polygon.IsDiagonal (3, 3), false);
	test.AssertEqual (polygon.IsDiagonal (3, 4), false);
	test.AssertEqual (polygon.IsDiagonal (3, 5), false);

	test.AssertEqual (polygon.IsDiagonal (4, 0), true);
	test.AssertEqual (polygon.IsDiagonal (4, 1), true);
	test.AssertEqual (polygon.IsDiagonal (4, 2), true);
	test.AssertEqual (polygon.IsDiagonal (4, 3), false);
	test.AssertEqual (polygon.IsDiagonal (4, 4), false);
	test.AssertEqual (polygon.IsDiagonal (4, 5), false);

	test.AssertEqual (polygon.IsDiagonal (5, 0), false);
	test.AssertEqual (polygon.IsDiagonal (5, 1), true);
	test.AssertEqual (polygon.IsDiagonal (5, 2), false);
	test.AssertEqual (polygon.IsDiagonal (5, 3), false);
	test.AssertEqual (polygon.IsDiagonal (5, 4), false);
	test.AssertEqual (polygon.IsDiagonal (5, 5), false);
});

diagonalSuite.AddTest ('IsDiagonalTest08', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.2, 0.2);
	test.AssertEqual (polygon.IsDiagonal (0, 2), false);
});

diagonalSuite.AddTest ('IsDiagonalTest07', function (test)
{
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (2.0, 1.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (0.0, 1.0);
	
	test.AssertEqual (polygon.IsDiagonal (1, 0), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 2), false);
	test.AssertEqual (polygon.IsDiagonal (1, 3), true);
	test.AssertEqual (polygon.IsDiagonal (1, 4), false);
	test.AssertEqual (polygon.IsDiagonal (1, 5), false);
	test.AssertEqual (polygon.IsDiagonal (1, 6), true);

	test.AssertEqual (polygon.IsDiagonal (0, 1), false);
	test.AssertEqual (polygon.IsDiagonal (1, 1), false);
	test.AssertEqual (polygon.IsDiagonal (2, 1), false);
	test.AssertEqual (polygon.IsDiagonal (3, 1), true);
	test.AssertEqual (polygon.IsDiagonal (4, 1), false);
	test.AssertEqual (polygon.IsDiagonal (5, 1), false);
	test.AssertEqual (polygon.IsDiagonal (6, 1), true);
});

var polygonSectorTest = unitTest.AddTestSuite ('PolygonSectorPositionTest');

polygonSectorTest.AddTest ('PolygonSectorPositionTest01', function (test)
{
	function GetSector (x1, y1, x2, y2)
	{
		var beg = new JSM.Coord2D (x1, y1);
		var end = new JSM.Coord2D (x2, y2);
		var sector = new JSM.Sector2D (beg, end);
		return sector;
	}	
	
	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	
	test.AssertEqual (polygon.SectorPosition (GetSector (2, 0, 3, 0), -1, -1), JSM.SectorPolygonPosition2D.NoIntersection);
	test.AssertEqual (polygon.SectorPosition (GetSector (2, 0, 2, 1), -1, -1), JSM.SectorPolygonPosition2D.NoIntersection);

	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 2, 0), -1, -1), JSM.SectorPolygonPosition2D.IntersectionCoincident);
	test.AssertEqual (polygon.SectorPosition (GetSector (2, 0, 0, 0), -1, -1), JSM.SectorPolygonPosition2D.IntersectionCoincident);
	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 0.5, 0), -1, -1), JSM.SectorPolygonPosition2D.IntersectionCoincident);
	test.AssertEqual (polygon.SectorPosition (GetSector (0.5, 0, 0, 0), -1, -1), JSM.SectorPolygonPosition2D.IntersectionCoincident);

	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1, 2, 2), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (2, 2, 1, 1), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);

	test.AssertEqual (polygon.SectorPosition (GetSector (0.5, 0.5, 2, 0.5), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnePoint);
	test.AssertEqual (polygon.SectorPosition (GetSector (2, 0.5, 0.5, 0.5), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnePoint);
	test.AssertEqual (polygon.SectorPosition (GetSector (0.5, 0.5, 1, 1), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1, 0.5, 0.5), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);

	test.AssertEqual (polygon.SectorPosition (GetSector (-1.0, 0.5, 1, 1), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnePoint);
	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1), new JSM.Coord2D (-1.0, 0.5), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnePoint);
});

polygonSectorTest.AddTest ('PolygonSectorPositionTest02', function (test)
{
	function GetSector (x1, y1, x2, y2)
	{
		var beg = new JSM.Coord2D (x1, y1);
		var end = new JSM.Coord2D (x2, y2);
		var sector = new JSM.Sector2D (beg, end);
		return sector;
	}	

	var polygon = new JSM.Polygon2D ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (0.0, 1.0);
	
	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 0.5, 0.5), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (0.5, 0.5, 0, 0), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 0.5, 0.5), 0, -1), JSM.SectorPolygonPosition2D.NoIntersection);
	test.AssertEqual (polygon.SectorPosition (GetSector (0.5, 0.5, 0, 0), 0, -1), JSM.SectorPolygonPosition2D.NoIntersection);

	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 1, 1), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1, 0, 0), -1, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 1, 1), 0, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1, 0, 0), 0, -1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 1, 1), 0, 1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1, 0, 0), 0, 1), JSM.SectorPolygonPosition2D.IntersectionOnVertex);
	test.AssertEqual (polygon.SectorPosition (GetSector (0, 0, 1, 1), 0, 2), JSM.SectorPolygonPosition2D.NoIntersection);
	test.AssertEqual (polygon.SectorPosition (GetSector (1, 1, 0, 0), 0, 2), JSM.SectorPolygonPosition2D.NoIntersection);
});

var polygonSuite = unitTest.AddTestSuite ('ContourPolygonTest');

polygonSuite.AddTest ('AddVertexTest2D', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 3.0);
	polygon.AddVertex (0.0, 3.0);
	test.AssertEqual (polygon.ContourCount (), 1);
	test.AssertEqual (polygon.VertexCount (), 4);
	test.AssertEqualNum (polygon.GetArea (), 15.0, JSM.Eps);

	test.AssertEqual (polygon.GetContourVertex (0, 0).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 0).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).y, 3.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);	

	test.AssertEqual (polygon.ContourCount (), 2);
	test.AssertEqual (polygon.VertexCount (), 8);
	test.AssertEqualNum (polygon.GetArea (), 14.0, JSM.Eps);

	test.AssertEqual (polygon.GetContourVertex (0, 0).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 0).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (1, 0).x, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 0).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).x, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).x, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).x, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).y, 1.0);
	
	polygon.AddContour ();
	polygon.AddVertexCoord (new JSM.Coord2D (3.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord2D (3.0, 2.0));
	polygon.AddVertexCoord (new JSM.Coord2D (4.0, 2.0));
	polygon.AddVertexCoord (new JSM.Coord2D (4.0, 1.0));	

	test.AssertEqual (polygon.ContourCount (), 3);
	test.AssertEqual (polygon.VertexCount (), 12);
	test.AssertEqualNum (polygon.GetArea (), 13.0, JSM.Eps);
	
	test.AssertEqual (polygon.GetContourVertex (0, 0).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 0).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (1, 0).x, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 0).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).x, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).x, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).x, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 0).x, 3.0);
	test.AssertEqual (polygon.GetContourVertex (2, 0).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 1).x, 3.0);
	test.AssertEqual (polygon.GetContourVertex (2, 1).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (2, 2).x, 4.0);
	test.AssertEqual (polygon.GetContourVertex (2, 2).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (2, 3).x, 4.0);
	test.AssertEqual (polygon.GetContourVertex (2, 3).y, 1.0);
	
	polygon.AddContourVertex (0, -1.0, 3.0);
	polygon.AddContourVertexCoord (0, new JSM.Coord2D (-1.0, 0.0));
	test.AssertEqual (polygon.ContourCount (), 3);
	test.AssertEqual (polygon.VertexCount (), 14);
	test.AssertEqualNum (polygon.GetArea (), 16.0, JSM.Eps);
});

polygonSuite.AddTest ('AddVertexTest', function (test)
{
	var polygon = new JSM.ContourPolygon ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 3.0, 1.0);
	polygon.AddVertex (0.0, 3.0, 1.0);
	test.AssertEqual (polygon.ContourCount (), 1);
	test.AssertEqual (polygon.VertexCount (), 4);

	test.AssertEqual (polygon.GetContourVertex (0, 0).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 0).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 0).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).y, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 1).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).x, 5.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (0, 2).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).x, 0.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).y, 3.0);
	test.AssertEqual (polygon.GetContourVertex (0, 3).z, 1.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0, 1.0);
	polygon.AddVertex (1.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 1.0, 1.0);	

	test.AssertEqual (polygon.ContourCount (), 2);
	test.AssertEqual (polygon.VertexCount (), 8);

	test.AssertEqual (polygon.GetContourVertex (1, 0).x, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 0).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 0).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).x, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 1).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).x, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 2).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).x, 2.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (1, 3).z, 1.0);
	
	polygon.AddContour ();
	polygon.AddVertexCoord (new JSM.Coord (3.0, 1.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord (3.0, 2.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord (4.0, 2.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord (4.0, 1.0, 1.0));	

	test.AssertEqual (polygon.ContourCount (), 3);
	test.AssertEqual (polygon.VertexCount (), 12);
	
	test.AssertEqual (polygon.GetContourVertex (2, 0).x, 3.0);
	test.AssertEqual (polygon.GetContourVertex (2, 0).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 0).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 1).x, 3.0);
	test.AssertEqual (polygon.GetContourVertex (2, 1).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (2, 1).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 2).x, 4.0);
	test.AssertEqual (polygon.GetContourVertex (2, 2).y, 2.0);
	test.AssertEqual (polygon.GetContourVertex (2, 2).z, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 3).x, 4.0);
	test.AssertEqual (polygon.GetContourVertex (2, 3).y, 1.0);
	test.AssertEqual (polygon.GetContourVertex (2, 3).z, 1.0);
	
	polygon.AddContourVertex (0, -1.0, 3.0);
	polygon.AddContourVertexCoord (0, new JSM.Coord2D (-1.0, 0.0));
	test.AssertEqual (polygon.ContourCount (), 3);
	test.AssertEqual (polygon.VertexCount (), 14);
});

polygonSuite.AddTest ('CloneTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 3.0);
	polygon.AddVertex (0.0, 3.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
	
	var cloned = polygon.Clone ();
	test.AssertEqual (polygon.VertexCount (), cloned.VertexCount ());
	test.AssertEqual (polygon.GetSignedArea (), cloned.GetSignedArea ());
	test.AssertEqual (polygon.GetArea (), cloned.GetArea ());
	test.AssertEqual (polygon.GetOrientation (), cloned.GetOrientation ());
	test.AssertEqual (polygon.GetComplexity (), cloned.GetComplexity ());
	test.Assert (IsEqualContourPolygons (polygon, cloned));

	var polygon = new JSM.ContourPolygon ();
	
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 3.0, 1.0);
	polygon.AddVertex (0.0, 3.0, 1.0);
	
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0, 1.0);
	polygon.AddVertex (1.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 1.0, 1.0);
	
	var cloned = polygon.Clone ();
	test.Assert (IsEqualContourPolygons (polygon, cloned));
});

polygonSuite.AddTest ('InvalidPolygonTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);

	polygon.AddContour ();
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);
	
	polygon.AddVertex (0.0, 0.0);
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);

	polygon.AddVertex (5.0, 0.0);
	test.AssertEqual (polygon.GetSignedArea (), 0.0);
	test.AssertEqual (polygon.GetArea (), 0.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);

	polygon.AddVertex (5.0, 3.0);
	test.AssertEqual (polygon.GetSignedArea (), 7.5);
	test.AssertEqual (polygon.GetArea (), 7.5);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);
	
	polygon.AddVertex (0.0, 3.0);
	test.AssertEqual (polygon.GetSignedArea (), 15.0);
	test.AssertEqual (polygon.GetArea (), 15.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);

	polygon.AddContour ();
	test.AssertEqual (polygon.GetSignedArea (), 15.0);
	test.AssertEqual (polygon.GetArea (), 15.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);
	
	polygon.AddVertex (1.0, 1.0);
	test.AssertEqual (polygon.GetSignedArea (), 15.0);
	test.AssertEqual (polygon.GetArea (), 15.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);

	polygon.AddVertex (2.0, 1.0);
	test.AssertEqual (polygon.GetSignedArea (), 15.0);
	test.AssertEqual (polygon.GetArea (), 15.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Invalid);

	polygon.AddVertex (2.0, 2.0);
	test.AssertEqual (polygon.GetSignedArea (), 15.5);
	test.AssertEqual (polygon.GetArea (), 15.5);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);

	polygon.AddVertex (1.0, 2.0);	
	test.AssertEqual (polygon.GetSignedArea (), 16.0);
	test.AssertEqual (polygon.GetArea (), 16.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);
	
	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.AddContour ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (0.0, 3.0);
	polygon2.AddVertex (5.0, 3.0);
	polygon2.AddVertex (5.0, 0.0);
	test.AssertEqual (polygon2.GetSignedArea (), -15.0);
	test.AssertEqual (polygon2.GetArea (), 15.0);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);
	
	polygon2.AddContour ();
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 2.0);
	polygon2.AddVertex (2.0, 2.0);
	polygon2.AddVertex (2.0, 1.0);
	test.AssertEqual (polygon2.GetSignedArea (), -16.0);
	test.AssertEqual (polygon2.GetArea (), 16.0);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Invalid);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Complex);
});

polygonSuite.AddTest ('ValidTriangleTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (1.0, 0.0);
	polygon.AddVertex (1.0, 1.0);
	
	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.AddContour ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (1.0, 1.0);	
	polygon2.AddVertex (1.0, 0.0);

	test.AssertEqualNum (polygon.GetSignedArea (), 0.5, JSM.Eps);
	test.AssertEqualNum (polygon.GetArea (), 0.5, JSM.Eps);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);
	
	test.AssertEqualNum (polygon2.GetSignedArea (), -0.5, JSM.Eps);
	test.AssertEqualNum (polygon2.GetArea (), 0.5, JSM.Eps);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.Clockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);
});

polygonSuite.AddTest ('ComplexityTest', function (test)
{
	var polygon = new JSM.ContourPolygon2D ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0);
	polygon.AddVertex (5.0, 0.0);
	polygon.AddVertex (5.0, 4.0);
	polygon.AddVertex (0.0, 4.0);

	test.AssertEqual (polygon.GetSignedArea (), 20.0);
	test.AssertEqual (polygon.GetArea (), 20.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Convex);

	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0);
	polygon.AddVertex (1.0, 2.0);
	polygon.AddVertex (2.0, 2.0);
	polygon.AddVertex (2.0, 1.0);
	
	test.AssertEqual (polygon.GetSignedArea (), 19.0);
	test.AssertEqual (polygon.GetArea (), 19.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);

	polygon.AddContour ();
	polygon.AddVertex (3.0, 1.0);
	polygon.AddVertex (3.0, 2.0);
	polygon.AddVertex (4.0, 2.0);
	polygon.AddVertex (4.0, 1.0);

	test.AssertEqual (polygon.GetSignedArea (), 18.0);
	test.AssertEqual (polygon.GetArea (), 18.0);
	test.AssertEqual (polygon.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon.GetComplexity (), JSM.Complexity.Complex);
	
	var polygon2 = new JSM.ContourPolygon2D ();
	polygon2.AddContour ();
	polygon2.AddVertex (0.0, 0.0);
	polygon2.AddVertex (5.0, 0.0);
	polygon2.AddVertex (5.0, 4.0);
	polygon2.AddVertex (0.0, 4.0);

	test.AssertEqual (polygon2.GetSignedArea (), 20.0);
	test.AssertEqual (polygon2.GetArea (), 20.0);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Convex);

	polygon2.AddContour ();
	polygon2.AddVertex (1.0, 1.0);
	polygon2.AddVertex (1.0, 2.0);
	polygon2.AddVertex (2.0, 2.0);
	polygon2.AddVertex (2.0, 1.0);
	
	test.AssertEqual (polygon2.GetSignedArea (), 19.0);
	test.AssertEqual (polygon2.GetArea (), 19.0);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Complex);

	polygon2.AddContour ();
	polygon2.AddVertex (3.0, 1.0);
	polygon2.AddVertex (3.0, 2.0);
	polygon2.AddVertex (4.0, 2.0);
	polygon2.AddVertex (4.0, 1.0);

	test.AssertEqual (polygon2.GetSignedArea (), 18.0);
	test.AssertEqual (polygon2.GetArea (), 18.0);
	test.AssertEqual (polygon2.GetOrientation (), JSM.Orientation.CounterClockwise);
	test.AssertEqual (polygon2.GetComplexity (), JSM.Complexity.Complex);	
});

polygonSuite.AddTest ('ToContourPolygon2DTest', function (test)
{
	var polygon = new JSM.ContourPolygon ();
	polygon.AddContour ();
	polygon.AddVertex (0.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 0.0, 1.0);
	polygon.AddVertex (5.0, 3.0, 1.0);
	polygon.AddVertex (0.0, 3.0, 1.0);
	polygon.AddContour ();
	polygon.AddVertex (1.0, 1.0, 1.0);
	polygon.AddVertex (1.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 2.0, 1.0);
	polygon.AddVertex (2.0, 1.0, 1.0);	
	polygon.AddContour ();
	polygon.AddVertexCoord (new JSM.Coord (3.0, 1.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord (3.0, 2.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord (4.0, 2.0, 1.0));
	polygon.AddVertexCoord (new JSM.Coord (4.0, 1.0, 1.0));	
	polygon.AddContourVertex (0, -1.0, 3.0, 1.0);
	polygon.AddContourVertexCoord (0, new JSM.Coord (-1.0, 0.0, 1.0));
	
	var polygon2D = polygon.ToContourPolygon2D ();
	test.AssertEqual (polygon.ContourCount (), polygon2D.ContourCount ());
	test.AssertEqual (polygon.VertexCount (), polygon2D.VertexCount ());
	test.AssertEqualNum (polygon2D.GetArea (), 16.0, JSM.Eps);
});

}
