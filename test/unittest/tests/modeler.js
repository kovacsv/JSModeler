module.exports = function (unitTest)
{

var generalSuite = unitTest.AddTestSuite ('ModelerGeneral');

generalSuite.AddTest ('BodyTest', function (test)
{
	var body = new JSM.Body ();
	test.Assert (body.VertexCount () == 0 && body.PolygonCount () == 0);
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2]));
	test.Assert (body.VertexCount () == 3 && body.PolygonCount () == 1);
	test.Assert (JSM.CoordIsEqual (body.GetVertex (0).position, new JSM.Coord (0, 0, 0)));
	test.Assert (JSM.CoordIsEqual (body.GetVertex (1).position, new JSM.Coord (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (body.GetVertex (2).position, new JSM.Coord (0, 1, 0)));
	test.Assert (body.GetPolygon (0).vertices.toString () == [0, 1, 2].toString ());
	
	polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	test.Assert (polygonNormals.length == 1);
	test.Assert (JSM.CoordIsEqual (polygonNormals[0], new JSM.Vector (0, 0, 1)));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 1)));
	body.AddPolygon (new JSM.BodyPolygon ([3, 4, 5, 6]));
	
	polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	test.Assert (body.VertexCount () == 7 && body.PolygonCount () == 2);
	test.Assert (body.GetPolygon (0).VertexIndexCount () == 3);
	test.Assert (body.GetPolygon (1).VertexIndexCount () == 4);
	test.Assert (polygonNormals.length == 2);
	test.Assert (JSM.CoordIsEqual (polygonNormals[0], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[1], new JSM.Vector (0, 0, -1)));

	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 6]));
	polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	test.Assert (polygonNormals.length == 3);
	test.Assert (JSM.CoordIsEqual (polygonNormals[2], new JSM.Vector (0, -1, 0)));
	
	test.Assert (JSM.CoordIsEqual (body.GetCenter (), new JSM.Coord (0.5, 0.5, 0.5)));
	
	body.Clear ();
	test.Assert (body.VertexCount () == 0 && body.PolygonCount () == 0);
});

generalSuite.AddTest ('ModelTest', function (test)
{
	var model = new JSM.Model ();
	model.AddBody (JSM.GenerateCuboid (1.0, 1.0, 1.0));
	model.AddBody (JSM.GenerateCuboid (1.0, 1.0, 1.0));
	test.Assert (model.BodyCount () == 2);
	test.Assert (model.GetBody (0).VertexCount () == 8);
	test.Assert (model.GetBody (1).VertexCount () == 8);
});

generalSuite.AddTest ('BodyVertexToPolygonTest', function (test)
{
	var body = new JSM.Body ();
	test.Assert (body.VertexCount () == 0 && body.PolygonCount () == 0);

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (2, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (2, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (2, 2, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 2, 0)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	body.AddPolygon (new JSM.BodyPolygon ([1, 4, 5, 2]));
	body.AddPolygon (new JSM.BodyPolygon ([2, 5, 6, 7, 3]));
	test.Assert (body.VertexCount () == 8 && body.PolygonCount () == 3);
	
	var vertexToPolygon = JSM.CalculateBodyVertexToPolygon (body);
	test.Assert (vertexToPolygon[0].toString () == [0].toString ());
	test.Assert (vertexToPolygon[1].toString () == [0, 1].toString ());
	test.Assert (vertexToPolygon[2].toString () == [0, 1, 2].toString ());
	test.Assert (vertexToPolygon[3].toString () == [0, 2].toString ());
	test.Assert (vertexToPolygon[4].toString () == [1].toString ());
	test.Assert (vertexToPolygon[5].toString () == [1, 2].toString ());
	test.Assert (vertexToPolygon[6].toString () == [2].toString ());
	test.Assert (vertexToPolygon[7].toString () == [2].toString ());

	body.Clear ();
	test.Assert (body.VertexCount () == 0 && body.PolygonCount () == 0);
});

generalSuite.AddTest ('BodyVertexNormalTest', function (test)
{
	var body = new JSM.Body ();
	test.Assert (body.VertexCount () == 0 && body.PolygonCount () == 0);

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 1)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	body.AddPolygon (new JSM.BodyPolygon ([1, 2, 5, 4]));
	test.Assert (body.VertexCount () == 6 && body.PolygonCount () == 2);
	
	polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	test.Assert (polygonNormals.length == 2);
	test.Assert (JSM.CoordIsEqual (polygonNormals[0], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[1], new JSM.Vector (1, 0, 0)));
	
	body.GetPolygon (0).SetCurveGroup (0);
	body.GetPolygon (1).SetCurveGroup (0);
	
	var vertexNormals = JSM.CalculateBodyVertexNormals (body);
	test.Assert (vertexNormals.length == 2);

	test.Assert (JSM.CoordIsEqual (vertexNormals[0][0], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][1], JSM.VectorNormalize (new JSM.Vector (1, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][2], JSM.VectorNormalize (new JSM.Vector (1, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][3], new JSM.Vector (0, 0, 1)));

	test.Assert (JSM.CoordIsEqual (vertexNormals[1][0], JSM.VectorNormalize (new JSM.Vector (1, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[1][1], JSM.VectorNormalize (new JSM.Vector (1, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[1][2], new JSM.Vector (1, 0, 0)));
	test.Assert (JSM.CoordIsEqual (vertexNormals[1][3], new JSM.Vector (1, 0, 0)));
});

generalSuite.AddTest ('AdjacencyListTest', function (test)
{
	var EqualEdge = function (e1, e2)
	{
		return e1.index == e2[0] && e1.reverse == e2[1];
	};

	var cube = JSM.GenerateCuboid (1, 1, 1);
	test.Assert (JSM.CheckSolidBody (cube));
	var al = JSM.CalculateAdjacencyInfo (cube);
/*
		 7__9__6
		/|    /|
	  11 8   6 |
	  /  |  /  5
	3/_2_|_/2  |
	 |  4|_|_7_|5
	 3  /  |  /
	 | 10  1 4
	 |/_0__|/
	 0     1

	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, -z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, -z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, -z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, -z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, z)));

	result.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	result.AddPolygon (new JSM.BodyPolygon ([1, 5, 6, 2]));
	result.AddPolygon (new JSM.BodyPolygon ([5, 4, 7, 6]));
	result.AddPolygon (new JSM.BodyPolygon ([4, 0, 3, 7]));
	result.AddPolygon (new JSM.BodyPolygon ([0, 4, 5, 1]));
	result.AddPolygon (new JSM.BodyPolygon ([3, 2, 6, 7]));
*/			
	test.Assert (al.verts.length == 8);
	
	test.Assert (al.verts[0].pgons.length == 3);
	test.Assert (al.verts[1].pgons.length == 3);
	test.Assert (al.verts[2].pgons.length == 3);
	test.Assert (al.verts[3].pgons.length == 3);
	test.Assert (al.verts[4].pgons.length == 3);
	test.Assert (al.verts[5].pgons.length == 3);
	test.Assert (al.verts[6].pgons.length == 3);
	test.Assert (al.verts[7].pgons.length == 3);
	
	test.Assert (al.verts[0].pgons[0] == 0 && al.verts[0].pgons[1] == 3 && al.verts[0].pgons[2] == 4);
	test.Assert (al.verts[1].pgons[0] == 0 && al.verts[1].pgons[1] == 1 && al.verts[1].pgons[2] == 4);
	test.Assert (al.verts[2].pgons[0] == 0 && al.verts[2].pgons[1] == 1 && al.verts[2].pgons[2] == 5);
	test.Assert (al.verts[3].pgons[0] == 0 && al.verts[3].pgons[1] == 3 && al.verts[3].pgons[2] == 5);
	test.Assert (al.verts[4].pgons[0] == 2 && al.verts[4].pgons[1] == 3 && al.verts[4].pgons[2] == 4);
	test.Assert (al.verts[5].pgons[0] == 1 && al.verts[5].pgons[1] == 2 && al.verts[5].pgons[2] == 4);
	test.Assert (al.verts[6].pgons[0] == 1 && al.verts[6].pgons[1] == 2 && al.verts[6].pgons[2] == 5);
	test.Assert (al.verts[7].pgons[0] == 2 && al.verts[7].pgons[1] == 3 && al.verts[7].pgons[2] == 5);

	test.Assert (al.verts[0].edges.length == 3);
	test.Assert (al.verts[1].edges.length == 3);
	test.Assert (al.verts[2].edges.length == 3);
	test.Assert (al.verts[3].edges.length == 3);
	test.Assert (al.verts[4].edges.length == 3);
	test.Assert (al.verts[5].edges.length == 3);
	test.Assert (al.verts[6].edges.length == 3);
	test.Assert (al.verts[7].edges.length == 3);
	
	test.Assert (al.verts[0].edges[0] == 0 && al.verts[0].edges[1] == 3 && al.verts[0].edges[2] == 10);
	test.Assert (al.verts[1].edges[0] == 1 && al.verts[1].edges[1] == 4 && al.verts[1].edges[2] == 0);
	test.Assert (al.verts[2].edges[0] == 2 && al.verts[2].edges[1] == 1 && al.verts[2].edges[2] == 6);
	test.Assert (al.verts[3].edges[0] == 3 && al.verts[3].edges[1] == 11 && al.verts[3].edges[2] == 2);
	test.Assert (al.verts[4].edges[0] == 8 && al.verts[4].edges[1] == 10 && al.verts[4].edges[2] == 7);
	test.Assert (al.verts[5].edges[0] == 5 && al.verts[5].edges[1] == 7 && al.verts[5].edges[2] == 4);
	test.Assert (al.verts[6].edges[0] == 6 && al.verts[6].edges[1] == 5 && al.verts[6].edges[2] == 9);
	test.Assert (al.verts[7].edges[0] == 9 && al.verts[7].edges[1] == 8 && al.verts[7].edges[2] == 11);

	test.Assert (al.edges.length == 12);
	
	test.Assert (al.edges[0].vert1 == 0 && al.edges[0].vert2 == 1);
	test.Assert (al.edges[1].vert1 == 1 && al.edges[1].vert2 == 2);
	test.Assert (al.edges[2].vert1 == 2 && al.edges[2].vert2 == 3);
	test.Assert (al.edges[3].vert1 == 3 && al.edges[3].vert2 == 0);
	test.Assert (al.edges[4].vert1 == 1 && al.edges[4].vert2 == 5);
	test.Assert (al.edges[5].vert1 == 5 && al.edges[5].vert2 == 6);
	test.Assert (al.edges[6].vert1 == 6 && al.edges[6].vert2 == 2);
	test.Assert (al.edges[7].vert1 == 5 && al.edges[7].vert2 == 4);
	test.Assert (al.edges[8].vert1 == 4 && al.edges[8].vert2 == 7);
	test.Assert (al.edges[9].vert1 == 7 && al.edges[9].vert2 == 6);
	test.Assert (al.edges[10].vert1 == 4 && al.edges[10].vert2 == 0);
	test.Assert (al.edges[11].vert1 == 3 && al.edges[11].vert2 == 7);
	
	test.Assert (al.edges[0].pgon1 == 0 && al.edges[0].pgon2 == 4);
	test.Assert (al.edges[1].pgon1 == 0 && al.edges[1].pgon2 == 1);
	test.Assert (al.edges[2].pgon1 == 0 && al.edges[2].pgon2 == 5);
	test.Assert (al.edges[3].pgon1 == 0 && al.edges[3].pgon2 == 3);
	test.Assert (al.edges[4].pgon1 == 1 && al.edges[4].pgon2 == 4);
	test.Assert (al.edges[5].pgon1 == 1 && al.edges[5].pgon2 == 2);
	test.Assert (al.edges[6].pgon1 == 1 && al.edges[6].pgon2 == 5);
	test.Assert (al.edges[7].pgon1 == 2 && al.edges[7].pgon2 == 4);
	test.Assert (al.edges[8].pgon1 == 2 && al.edges[8].pgon2 == 3);
	test.Assert (al.edges[9].pgon1 == 2 && al.edges[9].pgon2 == 5);
	test.Assert (al.edges[10].pgon1 == 3 && al.edges[10].pgon2 == 4);
	test.Assert (al.edges[11].pgon1 == 3 && al.edges[11].pgon2 == 5);

	test.Assert (al.pgons.length == 6);
	test.Assert (al.pgons[0].verts.length == 4);
	test.Assert (al.pgons[1].verts.length == 4);
	test.Assert (al.pgons[2].verts.length == 4);
	test.Assert (al.pgons[3].verts.length == 4);
	test.Assert (al.pgons[4].verts.length == 4);
	test.Assert (al.pgons[5].verts.length == 4);

	test.Assert (al.pgons[0].verts[0] == 0 && al.pgons[0].verts[1] == 1 && al.pgons[0].verts[2] == 2 && al.pgons[0].verts[3] == 3);
	test.Assert (al.pgons[1].verts[0] == 1 && al.pgons[1].verts[1] == 5 && al.pgons[1].verts[2] == 6 && al.pgons[1].verts[3] == 2);
	test.Assert (al.pgons[2].verts[0] == 5 && al.pgons[2].verts[1] == 4 && al.pgons[2].verts[2] == 7 && al.pgons[2].verts[3] == 6);
	test.Assert (al.pgons[3].verts[0] == 4 && al.pgons[3].verts[1] == 0 && al.pgons[3].verts[2] == 3 && al.pgons[3].verts[3] == 7);
	test.Assert (al.pgons[4].verts[0] == 0 && al.pgons[4].verts[1] == 4 && al.pgons[4].verts[2] == 5 && al.pgons[4].verts[3] == 1);
	test.Assert (al.pgons[5].verts[0] == 3 && al.pgons[5].verts[1] == 2 && al.pgons[5].verts[2] == 6 && al.pgons[5].verts[3] == 7);

	test.Assert (al.pgons[0].pedges.length == 4);
	test.Assert (al.pgons[1].pedges.length == 4);
	test.Assert (al.pgons[2].pedges.length == 4);
	test.Assert (al.pgons[3].pedges.length == 4);
	test.Assert (al.pgons[4].pedges.length == 4);
	test.Assert (al.pgons[5].pedges.length == 4);

	test.Assert (EqualEdge (al.pgons[0].pedges[0], [0, false]) && EqualEdge (al.pgons[0].pedges[1], [1, false]) && EqualEdge (al.pgons[0].pedges[2], [2, false]) && EqualEdge (al.pgons[0].pedges[3], [3, false]));
	test.Assert (EqualEdge (al.pgons[1].pedges[0], [4, false]) && EqualEdge (al.pgons[1].pedges[1], [5, false]) && EqualEdge (al.pgons[1].pedges[2], [6, false]) && EqualEdge (al.pgons[1].pedges[3], [1, true]));
	test.Assert (EqualEdge (al.pgons[2].pedges[0], [7, false]) && EqualEdge (al.pgons[2].pedges[1], [8, false]) && EqualEdge (al.pgons[2].pedges[2], [9, false]) && EqualEdge (al.pgons[2].pedges[3], [5, true]));
	test.Assert (EqualEdge (al.pgons[3].pedges[0], [10, false]) && EqualEdge (al.pgons[3].pedges[1], [3, true]) && EqualEdge (al.pgons[3].pedges[2], [11, false]) && EqualEdge (al.pgons[3].pedges[3], [8, true]));
	test.Assert (EqualEdge (al.pgons[4].pedges[0], [10, true]) && EqualEdge (al.pgons[4].pedges[1], [7, true]) && EqualEdge (al.pgons[4].pedges[2], [4, true]) && EqualEdge (al.pgons[4].pedges[3], [0, true]));
	test.Assert (EqualEdge (al.pgons[5].pedges[0], [2, true]) && EqualEdge (al.pgons[5].pedges[1], [6, true]) && EqualEdge (al.pgons[5].pedges[2], [9, true]) && EqualEdge (al.pgons[5].pedges[3], [11, true]));
});

generalSuite.AddTest ('SubdivisionTest', function (test)
{
	var body = JSM.GenerateCuboid (1, 1, 1);
	test.Assert (JSM.CheckSolidBody (body));
	test.Assert (body.VertexCount () == 8);
	test.Assert (body.PolygonCount () == 6);

	body = JSM.CatmullClarkSubdivision (body, 1);
	test.Assert (JSM.CheckSolidBody (body));
	test.Assert (body.VertexCount () == 26);
	test.Assert (body.PolygonCount () == 24);

	body = JSM.CatmullClarkSubdivision (body, 1);
	test.Assert (JSM.CheckSolidBody (body));
	test.Assert (body.VertexCount () == 98);
	test.Assert (body.PolygonCount () == 96);
});

generalSuite.AddTest ('ExplodeTest', function (test)
{
	function OnGeometryStart (material)
	{
		onGeometryStartCount = onGeometryStartCount + 1;
	}

	function OnGeometryEnd (material)
	{
		onGeometryEndCount = onGeometryEndCount + 1;
	}

	function OnTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3)
	{
		onTriangleCount = onTriangleCount + 1;
	}
	
	var body = JSM.GenerateCuboid (1, 1, 1);
	var materials = new JSM.Materials ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
	body.GetPolygon (0).SetMaterialIndex (0);
	body.GetPolygon (1).SetMaterialIndex (1);
	
	var explodeData = {
		hasConvexPolygons : false,
		onGeometryStart : OnGeometryStart,
		onGeometryEnd : OnGeometryEnd,
		onTriangle : OnTriangle
	};

	var onGeometryStartCount = 0;
	var onGeometryEndCount = 0;
	var onTriangleCount = 0;
	JSM.ExplodeBodyToTriangles (body, materials, explodeData);
	
	test.Assert (onGeometryStartCount == 3);
	test.Assert (onGeometryEndCount == 3);
	test.Assert (onTriangleCount == 12);
});

generalSuite.AddTest ('ExportTest', function (test)
{
	var gdl1Ref = "base\nvert 0, 0, 0 ! 1\nvert 1, 0, 0 ! 2\nvert 0, 1, 0 ! 3\nedge 1, 2, -1, -1, 0 ! 1\nedge 2, 3, -1, -1, 0 ! 2\nedge 3, 1, -1, -1, 0 ! 3\npgon 3, 0, 0, 1, 2, 3 ! 1\nbody -1\n";
	var gdl2Ref = "base\nvert 0, 0, 1 ! 1\nvert 1, 0, 1 ! 2\nvert 0, 1, 1 ! 3\nedge 1, 2, -1, -1, 0 ! 1\nedge 2, 3, -1, -1, 0 ! 2\nedge 3, 1, -1, -1, 0 ! 3\npgon 3, 0, 0, 1, 2, 3 ! 1\nbody -1\n";
	var gdlMatHeader = "define material \"material1\" 2, 0,0.8,0 ! 1\ndefine material \"material2\" 2, 0.8,0,0 ! 2\ndefine material \"material3\" 2, 0,0,0.8 ! 3\n";
	var gdlGeom1Ref = "base\nvert 0, 0, 0 ! 1\nvert 1, 0, 0 ! 2\nvert 0, 1, 0 ! 3\nedge 1, 2, -1, -1, 0 ! 1\nedge 2, 3, -1, -1, 0 ! 2\nedge 3, 1, -1, -1, 0 ! 3\nset material \"material1\"\npgon 3, 0, 0, 1, 2, 3 ! 1\nbody -1\n";
	var gdlGeom2Ref = "base\nvert 0, 0, 1 ! 1\nvert 1, 0, 1 ! 2\nvert 0, 1, 1 ! 3\nedge 1, 2, -1, -1, 0 ! 1\nedge 2, 3, -1, -1, 0 ! 2\nedge 3, 1, -1, -1, 0 ! 3\nset material \"material2\"\npgon 3, 0, 0, 1, 2, 3 ! 1\nbody -1\n";
	var gdlGeom3Ref = "base\nvert 0, 0, 2 ! 1\nvert 1, 0, 2 ! 2\nvert 0, 1, 2 ! 3\nvert 0, 0, 3 ! 4\nvert 1, 0, 3 ! 5\nvert 0, 1, 3 ! 6\nvert 0, 0, 4 ! 7\nvert 1, 0, 4 ! 8\nvert 0, 1, 4 ! 9\nedge 1, 2, -1, -1, 0 ! 1\nedge 2, 3, -1, -1, 0 ! 2\nedge 3, 1, -1, -1, 0 ! 3\nedge 4, 5, -1, -1, 0 ! 4\nedge 5, 6, -1, -1, 0 ! 5\nedge 6, 4, -1, -1, 0 ! 6\nedge 7, 8, -1, -1, 0 ! 7\nedge 8, 9, -1, -1, 0 ! 8\nedge 9, 7, -1, -1, 0 ! 9\nset material \"material2\"\npgon 3, 0, 0, 1, 2, 3 ! 1\npgon 3, 0, 0, 4, 5, 6 ! 2\nset material \"material3\"\npgon 3, 0, 0, 7, 8, 9 ! 3\nbody -1\n";
	var stl1Ref = "solid Body1\n\tfacet normal 0 0 1\n\t\touter loop\n\t\t\tvertex 0 0 0\n\t\t\tvertex 1 0 0\n\t\t\tvertex 0 1 0\n\t\tendloop\n\tendfacet\nendsolid Body1\n";
	var stl2Ref = "solid Body2\n\tfacet normal 0 0 1\n\t\touter loop\n\t\t\tvertex 0 0 1\n\t\t\tvertex 1 0 1\n\t\t\tvertex 0 1 1\n\t\tendloop\n\tendfacet\nendsolid Body2\n";
	var modelStlRef = "solid Model\n\tfacet normal 0 0 1\n\t\touter loop\n\t\t\tvertex 0 0 0\n\t\t\tvertex 1 0 0\n\t\t\tvertex 0 1 0\n\t\tendloop\n\tendfacet\n\tfacet normal 0 0 1\n\t\touter loop\n\t\t\tvertex 0 0 1\n\t\t\tvertex 1 0 1\n\t\t\tvertex 0 1 1\n\t\tendloop\n\tendfacet\nendsolid Model\n";
	var obj1Ref = "v 0 0 0\nv 1 0 0\nv 0 1 0\nvn 0 0 1\nf 1//1 2//1 3//1 \n";
	var obj2Ref = "v 0 0 1\nv 1 0 1\nv 0 1 1\nvn 0 0 1\nf 1//1 2//1 3//1 \n";
	var modelObjRef = "v 0 0 0\nv 1 0 0\nv 0 1 0\nvn 0 0 1\nf 1//1 2//1 3//1 \nv 0 0 1\nv 1 0 1\nv 0 1 1\nvn 0 0 1\nf 4//2 5//2 6//2 \n";

	var body1 = new JSM.Body ();
	body1.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body1.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body1.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
	body1.AddPolygon (new JSM.BodyPolygon ([0, 1, 2]));

	var body2 = new JSM.Body ();
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 1)));
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 1)));
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 1)));
	body2.AddPolygon (new JSM.BodyPolygon ([0, 1, 2]));
	body2.GetPolygon (0).SetMaterialIndex (0);
	
	var body3 = new JSM.Body ();
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 2)));
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 2)));
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 2)));
	body3.AddPolygon (new JSM.BodyPolygon ([0, 1, 2]));
	body3.GetPolygon (0).SetMaterialIndex (0);
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 3)));
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 3)));
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 3)));
	body3.AddPolygon (new JSM.BodyPolygon ([3, 4, 5]));
	body3.GetPolygon (1).SetMaterialIndex (0);
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 4)));
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 4)));
	body3.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 4)));
	body3.AddPolygon (new JSM.BodyPolygon ([6, 7, 8]));
	body3.GetPolygon (2).SetMaterialIndex (1);

	var model = new JSM.Model ();
	model.AddBody (body1);
	model.AddBody (body2);
	
	var materials = new JSM.Materials ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
	
	var gdl1 = JSM.ExportBodyToGdl (body1);
	test.Assert (gdl1 == gdl1Ref);
	var gdl2 = JSM.ExportBodyToGdl (body2);
	test.Assert (gdl2 == gdl2Ref);
	var modelGdl = JSM.ExportModelToGdl (model);
	test.Assert (modelGdl == gdl1 + gdl2);

	var gdl1 = JSM.ExportBodyToGdl (body1, materials);
	test.Assert (gdl1 == gdlMatHeader + gdlGeom1Ref);
	var gdl2 = JSM.ExportBodyToGdl (body2, materials);
	test.Assert (gdl2 == gdlMatHeader + gdlGeom2Ref);
	var gdl3 = JSM.ExportBodyToGdl (body3, materials);
	test.Assert (gdl3 == gdlMatHeader + gdlGeom3Ref);
	var modelGdl = JSM.ExportModelToGdl (model, materials);
	test.Assert (modelGdl == gdlMatHeader + gdlGeom1Ref + gdlGeom2Ref);

	var stl1 = JSM.ExportBodyToStl (body1, 'Body1');
	test.Assert (stl1 == stl1Ref);
	var stl2 = JSM.ExportBodyToStl (body2, 'Body2');
	test.Assert (stl2 == stl2Ref);
	var modelStl = JSM.ExportModelToStl (model, 'Model');
	test.Assert (modelStl == modelStlRef);

	var obj1 = JSM.ExportBodyToObj (body1);
	test.Assert (obj1 == obj1Ref);
	var obj2 = JSM.ExportBodyToObj (body2);
	test.Assert (obj2 == obj2Ref);
	var modelObj = JSM.ExportModelToObj (model);
	test.Assert (modelObj == modelObjRef);
});

generalSuite.AddTest ('TriangulateWithCentroidsTest', function (test)
{
	var AllPolygonIsTriangle = function (body)
	{
		var i;
		for (i = 0; i < body.PolygonCount (); i++) {
			if (body.GetPolygon (i).VertexIndexCount () != 3) {
				return false;
			}
		}
		return true;
	};

	var body = JSM.GenerateCuboid (1, 1, 1);
	test.Assert (body.VertexCount () == 8);
	test.Assert (body.PolygonCount () == 6);
	test.Assert (!AllPolygonIsTriangle (body));
	test.Assert (JSM.CheckSolidBody (body));
	
	body = JSM.TriangulateWithCentroids (body);
	test.Assert (body.VertexCount () == 8 + 6);
	test.Assert (body.PolygonCount () == 6 * 4);
	test.Assert (AllPolygonIsTriangle (body));
	test.Assert (JSM.CheckSolidBody (body));

	body = JSM.GenerateSolidWithRadius ('Dodecahedron', 1.0);
	test.Assert (body.VertexCount () == 20);
	test.Assert (body.PolygonCount () == 12);
	test.Assert (!AllPolygonIsTriangle (body));
	test.Assert (JSM.CheckSolidBody (body));
	
	body = JSM.TriangulateWithCentroids (body);
	test.Assert (body.VertexCount () == 20 + 12);
	test.Assert (body.PolygonCount () == 12 * 5);
	test.Assert (AllPolygonIsTriangle (body));
	test.Assert (JSM.CheckSolidBody (body));
});

generalSuite.AddTest ('CheckSolidBodyTest', function (test)
{
	var body = new JSM.Body ();

	var x = 1 / 2.0;
	var y = 1 / 2.0;
	var z = 1 / 2.0;
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, -z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, -z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, -y, z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, -y, z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, -z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, -z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-x, y, z)));

	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	body.AddPolygon (new JSM.BodyPolygon ([1, 5, 6, 2]));
	body.AddPolygon (new JSM.BodyPolygon ([5, 4, 7, 6]));
	body.AddPolygon (new JSM.BodyPolygon ([4, 0, 3, 7]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 4, 5, 1]));
	test.Assert (!JSM.IsSolidBody (body));
	test.Assert (!JSM.CheckSolidBody (body));
	
	body.AddPolygon (new JSM.BodyPolygon ([3, 7, 6, 2]));
	test.Assert (JSM.IsSolidBody (body));
	test.Assert (!JSM.CheckSolidBody (body));
	
	body.polygons[5] = new JSM.BodyPolygon ([3, 2, 6, 7]);
	test.Assert (JSM.IsSolidBody (body));
	test.Assert (JSM.CheckSolidBody (body));
});

generalSuite.AddTest ('PainterTest', function (test)
{
	var width = 300;
	var height = 200;
	
	var center =  new JSM.Coord (0, 0, 0);
	var up =  new JSM.Coord (0, 0, 1);
	var fieldOfView = 45.0;
	var aspectRatio = width / height;
	var nearPlane = 0.1;
	var farPlane = 1000.0;
	var viewPort = [0, 0, width, height];
	
	var ordered = [];
	
	var body = new JSM.Body ();
	
	var body = new JSM.Body ();

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.0, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 1.0)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.5, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.5, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.5, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.5, 1.0)));
	body.AddPolygon (new JSM.BodyPolygon ([4, 5, 6, 7]));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 2.0, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 2.0, 1.0)));
	body.AddPolygon (new JSM.BodyPolygon ([8, 9, 10, 11]));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.5, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.5, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 2.5, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 2.5, 1.0)));
	body.AddPolygon (new JSM.BodyPolygon ([12, 13, 14, 15]));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 2.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 2.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 3.0, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 3.0, 1.0)));
	body.AddPolygon (new JSM.BodyPolygon ([16, 17, 18, 19]));
	
	ordered = JSM.OrderPolygons (body, new JSM.Coord (0, 10, 0), center);
	test.Assert (ordered.length == body.PolygonCount ());
	test.Assert (ordered[0] == 0 && ordered[1] == 1 && ordered[2] == 2 && ordered[3] == 3 && ordered[4] == 4);

	ordered = JSM.OrderPolygons (body, new JSM.Coord (4, 8, 3), center);
	test.Assert (ordered.length == body.PolygonCount ());
	test.Assert (ordered[0] == 0 && ordered[1] == 1 && ordered[2] == 2 && ordered[3] == 3 && ordered[4] == 4);

	ordered = JSM.OrderPolygons (body, new JSM.Coord (0, -10, 0), center);
	test.Assert (ordered.length == body.PolygonCount ());
	test.Assert (ordered[0] == 4 && ordered[1] == 3 && ordered[2] == 2 && ordered[3] == 1 && ordered[4] == 0);

	ordered = JSM.OrderPolygons (body, new JSM.Coord (7, -5, 4), center);
	test.Assert (ordered.length == body.PolygonCount ());
	test.Assert (ordered[0] == 4 && ordered[1] == 3 && ordered[2] == 2 && ordered[3] == 1 && ordered[4] == 0);

	ordered = JSM.OrderPolygons (body, new JSM.Coord (-4, -7, 5), center);
	test.Assert (ordered.length == body.PolygonCount ());
	test.Assert (ordered[0] == 4 && ordered[1] == 3 && ordered[2] == 2 && ordered[3] == 1 && ordered[4] == 0);

	ordered = JSM.OrderPolygons (body, new JSM.Coord (-7, -7, 0.5), center);
	test.Assert (ordered.length == body.PolygonCount ());
	test.Assert (ordered[0] == 4 && ordered[1] == 3 && ordered[2] == 2 && ordered[3] == 1 && ordered[4] == 0);
});

generalSuite.AddTest ('TriangulatePolygonsTest', function (test)
{
	var body = JSM.GenerateCuboid (1, 1, 1);
	test.Assert (body.VertexCount () == 8);
	test.Assert (body.PolygonCount () == 6);
	test.Assert (JSM.CheckSolidBody (body));
	
	body = JSM.TriangulatePolygons (body);
	test.Assert (body.VertexCount () == 8);
	test.Assert (body.PolygonCount () == 12);
	test.Assert (JSM.CheckSolidBody (body));

	var body = JSM.GenerateCylinder (0.5, 1.0, 20, true, true);
	test.Assert (body.VertexCount () == 40);
	test.Assert (body.PolygonCount () == 22);
	test.Assert (JSM.CheckSolidBody (body));
	
	body = JSM.TriangulatePolygons (body);
	test.Assert (body.VertexCount () == 40);
	test.Assert (body.PolygonCount () == 40 + 2 * 18);
	test.Assert (JSM.CheckSolidBody (body));
});

generalSuite.AddTest ('OctreeBodyTest', function (test)
{
	function TestOctreeOnBody (body, test, maxCoordNumInNodes)
	{
		var octree = new JSM.Octree (body.GetBoundingBox (), maxCoordNumInNodes);
		var success = true;
		for (var i = 0; i < body.VertexCount (); i++) {
			var index = octree.AddCoord (body.GetVertexPosition (i));
			if (i != index) {
				return false;
			}
			var index = octree.FindCoord (body.GetVertexPosition (i));
			if (i != index) {
				return false;
			}
		}
		for (var i = 0; i < body.VertexCount (); i++) {
			var index = octree.FindCoord (body.GetVertexPosition (i));
			if (i != index) {
				return false;
			}
		}
		for (var i = 0; i < body.VertexCount (); i++) {
			var index = octree.AddCoord (body.GetVertexPosition (i));
			if (i != index) {
				return false;
			}
		}
		return true;
	}
	
	function TestOctree (body, test)
	{
		var coordNums = [0, 1, 10, 50, 100, 1000];
		var i, coordNum;
		for (i = 0; i < coordNums.length; i++) {
			coordNum = coordNums[i];
			if (!TestOctreeOnBody (body, test, coordNum)) {
				return false;
			}
		}
		return true;
	}
	
	var body = JSM.GenerateRectangle (1, 2);
	test.Assert (TestOctree (body, test));

	var body = JSM.GenerateSegmentedRectangle (1, 2, 10, 10);
	test.Assert (TestOctree (body, test));

	var body = JSM.GenerateCircle (1, 25);	
	test.Assert (TestOctree (body, test));
	
	var body = JSM.GenerateCuboid (1, 2, 3);
	test.Assert (TestOctree (body, test));

	var body = JSM.GenerateSphere (1, 50, true);
	test.Assert (TestOctree (body, test));

	var body = JSM.GenerateCylinder (1, 1, 50, true);
	test.Assert (TestOctree (body, test));
});

var generatorSuite = unitTest.AddTestSuite ('ModelerGenerator');

generatorSuite.AddTest ('GenerateRectangleTest', function (test)
{
	var rectangle = JSM.GenerateRectangle (1, 2);
	test.Assert (rectangle.VertexCount () == 4 && rectangle.PolygonCount () == 1);
	
	var vertexNormals = JSM.CalculateBodyVertexNormals (rectangle);
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][0], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][1], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][2], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][3], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
});

generatorSuite.AddTest ('GenerateCuboidTest', function (test)
{
	var cuboid = JSM.GenerateCuboid (1, 2, 3);
	test.Assert (cuboid.VertexCount () == 8 && cuboid.PolygonCount () == 6);
	test.Assert (JSM.CheckSolidBody (cuboid));
	
	var vertexNormals = JSM.CalculateBodyVertexNormals (cuboid);
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][0], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][1], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][2], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][3], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));

	test.Assert (JSM.CoordIsEqual (vertexNormals[5][0], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][1], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][2], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][3], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
});

generatorSuite.AddTest ('GenerateSegmentedCuboidTest', function (test)
{
	var cuboid = JSM.GenerateSegmentedCuboid (1, 2, 3, 1);
	test.Assert (cuboid.VertexCount () == 8 && cuboid.PolygonCount () == 6);
	test.Assert (JSM.CheckSolidBody (cuboid));
	
	var cuboid = JSM.GenerateSegmentedCuboid (1, 2, 3, 2);
	test.Assert (cuboid.VertexCount () == 2 * 9 + 8 && cuboid.PolygonCount () == 24);
	test.Assert (JSM.CheckSolidBody (cuboid));

	var cuboid = JSM.GenerateSegmentedCuboid (1, 2, 3, 3);
	test.Assert (cuboid.VertexCount () == 2 * 16 + 2 * 12 && cuboid.PolygonCount () == 54);
	test.Assert (JSM.CheckSolidBody (cuboid));
});

generatorSuite.AddTest ('GenerateSegmentedRectangleTest', function (test)
{
	var plane = JSM.GenerateSegmentedRectangle (1, 2, 1, 1);
	test.Assert (plane.VertexCount () == 4 && plane.PolygonCount () == 1);
	
	var plane = JSM.GenerateSegmentedRectangle (1, 2, 2, 2);
	test.Assert (plane.VertexCount () == 9 && plane.PolygonCount () == 4);
	var polygonNormals = JSM.CalculateBodyPolygonNormals (plane);
	test.Assert (polygonNormals.length == 4);
	test.Assert (JSM.CoordIsEqual (polygonNormals[0], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[1], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[2], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[3], new JSM.Vector (0, 0, 1)));

	var plane = JSM.GenerateSegmentedRectangle (1, 2, 3, 3);
	test.Assert (plane.VertexCount () == 16 && plane.PolygonCount () == 9);

	var plane = JSM.GenerateSegmentedRectangle (1, 2, 6, 8);
	test.Assert (plane.VertexCount () == 63 && plane.PolygonCount () == 48);
});

generatorSuite.AddTest ('GenerateSphereTest', function (test)
{
	var sphere = JSM.GenerateSphere (1.0, 3, true);
	test.Assert (sphere.VertexCount () == 14 && sphere.PolygonCount () == 18);
	test.Assert (JSM.CheckSolidBody (sphere));
	
	var sphere2 = JSM.GenerateSphere (1.0, 10, true);
	test.Assert (sphere2.VertexCount () == 182 && sphere2.PolygonCount () == 200);
	test.Assert (JSM.CheckSolidBody (sphere2));
	
	var sphere3 = JSM.GenerateTriangulatedSphere (1.0, 0, true);
	test.Assert (sphere3.VertexCount () == 12 && sphere3.PolygonCount () == 20);
	test.Assert (JSM.CheckSolidBody (sphere3));

	var sphere3 = JSM.GenerateTriangulatedSphere (1.0, 1, true);
	test.Assert (sphere3.VertexCount () == 42 && sphere3.PolygonCount () == 80);
	test.Assert (JSM.CheckSolidBody (sphere3));

	var sphere3 = JSM.GenerateTriangulatedSphere (1.0, 2, true);
	test.Assert (sphere3.VertexCount () == 162 && sphere3.PolygonCount () == 320);
	test.Assert (JSM.CheckSolidBody (sphere3));
});

generatorSuite.AddTest ('GenerateCircleTest', function (test)
{
	var circle = JSM.GenerateCircle (1.0, 25);
	test.Assert (circle.VertexCount () == 25 && circle.PolygonCount () == 1);

	var polygonNormals = JSM.CalculateBodyPolygonNormals (circle);
	test.Assert (polygonNormals.length == 1);
	test.Assert (JSM.CoordIsEqual (polygonNormals[0], new JSM.Vector (0, 0, 1)));
});

generatorSuite.AddTest ('GenerateCylinderTest', function (test)
{
	var cylinder = JSM.GenerateCylinder (1.0, 2.0, 25, true, true);
	test.Assert (cylinder.VertexCount () == 50 && cylinder.PolygonCount () == 27);
	test.Assert (JSM.CheckSolidBody (cylinder));
	test.Assert (cylinder.GetPolygon (0).VertexIndexCount () == 4);
	test.Assert (cylinder.GetPolygon (25).VertexIndexCount () == 25);
	test.Assert (cylinder.GetPolygon (26).VertexIndexCount () == 25);

	var cylinder2 = JSM.GenerateCylinder (1.0, 2.0, 4, true, true);
	test.Assert (cylinder2.VertexCount () == 8 && cylinder2.PolygonCount () == 6);
	test.Assert (JSM.CheckSolidBody (cylinder2));
	test.Assert (cylinder2.GetPolygon (0).VertexIndexCount () == 4);
	test.Assert (cylinder2.GetPolygon (4).VertexIndexCount () == 4);
	test.Assert (cylinder2.GetPolygon (5).VertexIndexCount () == 4);
	
	var vertexNormals = JSM.CalculateBodyVertexNormals (cylinder2);
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][0], JSM.VectorNormalize (new JSM.Vector (1, 0, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][1], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][2], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][3], JSM.VectorNormalize (new JSM.Vector (1, 0, 0))));

	test.Assert (JSM.CoordIsEqual (vertexNormals[1][0], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[1][1], JSM.VectorNormalize (new JSM.Vector (-1, 0, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[1][2], JSM.VectorNormalize (new JSM.Vector (-1, 0, 0))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[1][3], JSM.VectorNormalize (new JSM.Vector (0, -1, 0))));
	
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][0], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][1], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][2], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][3], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][0], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][1], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][2], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][3], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	
	var cylinder3 = JSM.GenerateCylinder (1.0, 2.0, 25, false, true);
	test.Assert (cylinder3.VertexCount () == 50 && cylinder3.PolygonCount () == 25);
	test.Assert (!JSM.IsSolidBody (cylinder3));
	test.Assert (!JSM.CheckSolidBody (cylinder3));
});

generatorSuite.AddTest ('GeneratePieTest', function (test)
{
	var pie = JSM.GeneratePie (1.0, 2.0, 90.0 * JSM.DegRad, 25, true, true);
	test.Assert (pie.VertexCount () == 52 && pie.PolygonCount () == 28);
	test.Assert (JSM.CheckSolidBody (pie));
	test.Assert (pie.GetPolygon (0).VertexIndexCount () == 4);
	test.Assert (!pie.GetPolygon (0).HasCurveGroup ());
	test.Assert (pie.GetPolygon (1).HasCurveGroup ());
	test.Assert (pie.GetPolygon (25).VertexIndexCount () == 4);
	test.Assert (!pie.GetPolygon (25).HasCurveGroup ());
	test.Assert (pie.GetPolygon (26).VertexIndexCount () == 26);
	test.Assert (pie.GetPolygon (27).VertexIndexCount () == 26);
});

generatorSuite.AddTest ('GenerateConeTest', function (test)
{
	var cone = JSM.GenerateCone (0.5, 1.0, 1.0, 25, true, true);
	test.Assert (JSM.CheckSolidBody (cone));
	test.Assert (cone.VertexCount () == 50 && cone.PolygonCount () == 27);
	test.Assert (cone.GetPolygon (0).VertexIndexCount () == 4);
	test.Assert (cone.GetPolygon (25).VertexIndexCount () == 25);
	test.Assert (cone.GetPolygon (26).VertexIndexCount () == 25);

	var cone2 = JSM.GenerateCone (0.5, 1.0, 1.0, 4, true, true);
	test.Assert (JSM.CheckSolidBody (cone2));
	test.Assert (cone2.VertexCount () == 8 && cone2.PolygonCount () == 6);
	test.Assert (cone2.GetPolygon (0).VertexIndexCount () == 4);
	test.Assert (cone2.GetPolygon (4).VertexIndexCount () == 4);
	test.Assert (cone2.GetPolygon (5).VertexIndexCount () == 4);
	
	var vertexNormals = JSM.CalculateBodyVertexNormals (cone2);
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][0], JSM.VectorNormalize (new JSM.Vector (0.8944271909999159, 0, 0.4472135954999579))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][1], JSM.VectorNormalize (new JSM.Vector (0, -0.8944271909999159, 0.4472135954999579))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][2], JSM.VectorNormalize (new JSM.Vector (0, -0.8944271909999159, 0.4472135954999579))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[0][3], JSM.VectorNormalize (new JSM.Vector (0.8944271909999159, 0, 0.4472135954999579))));
	
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][0], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][1], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][2], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[4][3], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][0], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][1], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][2], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][3], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));

	var cone3 = JSM.GenerateCone (0.0, 1.0, 1.0, 4, true, true);
	test.Assert (cone3.VertexCount () == 5 && cone3.PolygonCount () == 5);
	test.Assert (JSM.CheckSolidBody (cone3));
	
	var cone4 = JSM.GenerateCone (1.0, 0.0, 1.0, 4, true, true);
	test.Assert (cone4.VertexCount () == 5 && cone4.PolygonCount () == 5);
	test.Assert (JSM.CheckSolidBody (cone4));
});

generatorSuite.AddTest ('GeneratePrismTest', function (test)
{
	var basePoints = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.5, 2.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var prism = JSM.GeneratePrism (basePoints, direction, 1.0, true);
	test.Assert (prism.VertexCount () == 10 && prism.PolygonCount () == 7);
	test.Assert (JSM.CheckSolidBody (prism));
	test.Assert (JSM.CoordIsEqual (prism.GetVertex (0).position, new JSM.Vector (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (prism.GetVertex (1).position, new JSM.Vector (0.0, 0.0, 1.0)));

	var vertexNormals = JSM.CalculateBodyVertexNormals (prism);
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][0], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][1], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][2], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][3], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][4], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][0], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][1], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][2], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][3], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][4], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));

	var basePoints2 = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.5, 0.5, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	
	var direction2 = new JSM.Vector (0.0, 0.0, 1.0);
	var prism2 = JSM.GeneratePrism (basePoints2, direction2, 1.0, true);
	test.Assert (JSM.CheckSolidBody (prism2));

	var vertexNormals = JSM.CalculateBodyVertexNormals (prism2);
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][0], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][1], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][2], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][3], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[5][4], JSM.VectorNormalize (new JSM.Vector (0, 0, 1))));
	
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][0], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][1], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][2], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][3], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
	test.Assert (JSM.CoordIsEqual (vertexNormals[6][4], JSM.VectorNormalize (new JSM.Vector (0, 0, -1))));
});

generatorSuite.AddTest ('GeneratePrismWithHoleTest', function (test)
{
	var basePoints = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (7, 0, 0),
		new JSM.Coord (7, 3, 0),
		new JSM.Coord (0, 3, 0),
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var prism = JSM.GeneratePrismWithHole (basePoints, direction, 0.3, true);

	test.Assert (prism.VertexCount () == 8 && prism.PolygonCount () == 8);
	test.Assert (JSM.CheckSolidBody (prism));
	
	var quads = 0;
	var tris = 0;
	
	var i, vertexCount;
	for (i = 0; i < prism.PolygonCount (); i++) {
		vertexCount = prism.GetPolygon (i).VertexIndexCount ();
		if (vertexCount == 3) {
			tris++;
		} else if (vertexCount == 4) {
			quads++;
		}
	}

	test.Assert (quads == 4);
	test.Assert (tris == 4);

	var basePoints = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (7, 0, 0),
		new JSM.Coord (7, 3, 0),
		new JSM.Coord (0, 3, 0),
		null,
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (1, 2, 0),
		new JSM.Coord (2, 2, 0)		
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var prism = JSM.GeneratePrismWithHole (basePoints, direction, 0.3, true);

	test.Assert (prism.VertexCount () == 14 && prism.PolygonCount () == 21);
	test.Assert (JSM.CheckSolidBody (prism));
	
	var quads = 0;
	var tris = 0;
	
	var i, vertexCount;
	for (i = 0; i < prism.PolygonCount (); i++) {
		vertexCount = prism.GetPolygon (i).VertexIndexCount ();
		if (vertexCount == 3) {
			tris++;
		} else if (vertexCount == 4) {
			quads++;
		}
	}

	test.Assert (quads == 7);
	test.Assert (tris == 14);

	var basePoints = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (7, 0, 0),
		new JSM.Coord (7, 3, 0),
		new JSM.Coord (0, 3, 0),
		null,
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (1, 2, 0),
		new JSM.Coord (2, 2, 0),
		null,
		new JSM.Coord (3, 1, 0),
		new JSM.Coord (3, 2, 0),
		new JSM.Coord (4, 2, 0),
		new JSM.Coord (4, 1, 0),
		null,
		new JSM.Coord (5, 1, 0),
		new JSM.Coord (5, 2, 0),
		new JSM.Coord (6, 2, 0),
		new JSM.Coord (6, 1, 0),
		new JSM.Coord (5.5, 1.5, 0)
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var prism = JSM.GeneratePrismWithHole (basePoints, direction, 0.3, true);
	
	test.Assert (prism.VertexCount () == 32 && prism.PolygonCount () == 56);
	test.Assert (JSM.CheckSolidBody (prism));
	
	var quads = 0;
	var tris = 0;
	
	var i, vertexCount;
	for (i = 0; i < prism.PolygonCount (); i++) {
		vertexCount = prism.GetPolygon (i).VertexIndexCount ();
		if (vertexCount == 3) {
			tris++;
		} else if (vertexCount == 4) {
			quads++;
		}
	}

	test.Assert (quads == 16);
	test.Assert (tris == 40);
});

generatorSuite.AddTest ('GeneratePrismShellTest', function (test)
{
	var basePoints = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.5, 2.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var prism = JSM.GeneratePrismShell (basePoints, direction, 1.0, 0.1, true);
	test.Assert (prism.VertexCount () == 20 && prism.PolygonCount () == 20);
	test.Assert (JSM.CheckSolidBody (prism));
	test.Assert (JSM.CoordIsEqual (prism.GetVertex (0).position, new JSM.Vector (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (prism.GetVertex (10).position, new JSM.Vector (0.0, 0.0, 1.0)));
});

generatorSuite.AddTest ('GenerateCylinderShellTest', function (test)
{
	var cylinder = JSM.GenerateCylinderShell (1, 1, 0.1, 10, true, true);
	test.Assert (cylinder.VertexCount () == 4 * 10 && cylinder.PolygonCount () == 4 * 10);
	test.Assert (JSM.CheckSolidBody (cylinder));
});

generatorSuite.AddTest ('GenerateLineShellTest', function (test)
{
	var basePoints = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (0.5, 2.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0)
	];
	
	var direction = new JSM.Vector (0.0, 0.0, 1.0);
	var shell = JSM.GenerateLineShell (basePoints, direction, 1.0, 0.1, true, true);
	test.Assert (JSM.CheckSolidBody (shell));
	test.Assert (shell.VertexCount () == 20 && shell.PolygonCount () == 18);
	test.Assert (JSM.CoordIsEqual (shell.GetVertex (0).position, new JSM.Vector (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (shell.GetVertex (10).position, new JSM.Vector (0.0, 0.0, 1.0)));
	
	var basePoints = [
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (2.0, 0.0, 0.0),
		new JSM.Coord (2.0, 1.0, 0.0),
		new JSM.Coord (1.0, 1.0, 0.0),
		new JSM.Coord (1.0, 2.0, 0.0)
	];
	
	var shell = JSM.GenerateLineShell (basePoints, direction, 1.0, 0.1, true, true);
	test.Assert (JSM.CheckSolidBody (shell));
	test.Assert (shell.VertexCount () == 20 && shell.PolygonCount () == 18);
	test.Assert (JSM.CoordIsEqual (shell.GetVertex (0).position, new JSM.Vector (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (shell.GetVertex (10).position, new JSM.Vector (0.0, 0.0, 1.0)));
});

generatorSuite.AddTest ('GenerateTorusTest', function (test)
{
	var torus = JSM.GenerateTorus (1.0, 5.0, 10, 10, true);
	test.Assert (torus.VertexCount () == 100 && torus.PolygonCount () == 100);
	test.Assert (JSM.CheckSolidBody (torus));
});

generatorSuite.AddTest ('GenerateRuledTest', function (test)
{
	var aCoords = [new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (2.0, 0.0, 0.0)];
	var bCoords = [new JSM.Coord (0.0, 2.0, 0.0), new JSM.Coord (1.0, 2.0, 0.0), new JSM.Coord (2.0, 2.0, 0.0)];
	var vertices = [];
	var polygons = [];
	
	JSM.GetRuledMesh (aCoords, bCoords, 2, vertices, polygons);
	test.Assert (vertices.length == 9);
	test.Assert (polygons.length == 4);
	test.Assert (JSM.CoordIsEqual (vertices[4], new JSM.Vector (1.0, 1.0, 0.0)));

	var ruledFromCoords = JSM.GenerateRuledFromCoords (aCoords, bCoords, 2);
	test.Assert (ruledFromCoords.VertexCount () == 9);
	test.Assert (ruledFromCoords.PolygonCount () == 4);
	test.Assert (JSM.CoordIsEqual (ruledFromCoords.GetVertex (4).position, new JSM.Vector (1.0, 1.0, 0.0)));
	
	var sector1 = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (2.0, 0.0, 0.0));
	var sector2 = new JSM.Sector (new JSM.Coord (0.0, 2.0, 0.0), new JSM.Coord (2.0, 2.0, 0.0));
	var sector1Coords = [];
	JSM.GetSectorSegmentation (sector1, 2, sector1Coords);
	test.Assert (sector1Coords.length == 3);
	test.Assert (JSM.CoordIsEqual (sector1Coords[0], new JSM.Vector (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (sector1Coords[1], new JSM.Vector (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (sector1Coords[2], new JSM.Vector (2.0, 0.0, 0.0)));
	
	var ruledFromSectors = JSM.GenerateRuledFromSectors (sector1, sector2, 2, 2, false);
	test.Assert (ruledFromSectors.VertexCount () == 9);
	test.Assert (ruledFromSectors.PolygonCount () == 4);
	test.Assert (JSM.CoordIsEqual (ruledFromSectors.GetVertex (4).position, new JSM.Vector (1.0, 1.0, 0.0)));

	var polygonNormals = JSM.CalculateBodyPolygonNormals (ruledFromSectors);
	test.Assert (polygonNormals.length == 4);
	test.Assert (JSM.CoordIsEqual (polygonNormals[0], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[1], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[2], new JSM.Vector (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (polygonNormals[3], new JSM.Vector (0, 0, 1)));
	
	var ruledFromSectors2 = JSM.GenerateRuledFromSectors (sector1, sector2, 10, 10, false);
	test.Assert (ruledFromSectors2.VertexCount () == 121);
	test.Assert (ruledFromSectors2.PolygonCount () == 100);
	test.Assert (JSM.CoordIsEqual (ruledFromSectors2.GetVertex (60).position, new JSM.Vector (1.0, 1.0, 0.0)));
});

generatorSuite.AddTest ('GenerateRevolvedTest', function (test)
{
	var polyLine = [
		new JSM.Coord (0.5, 0.0, 0.0),
		new JSM.Coord (0.5, 0.0, 0.5)
	];
	var axis = new JSM.Sector (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	var revolved = JSM.GenerateRevolved (polyLine, axis, 360.0 * JSM.DegRad, 10, true, 'None');
	test.Assert (revolved.VertexCount () == 20);
	test.Assert (revolved.PolygonCount () == 12);
	test.Assert (JSM.CheckSolidBody (revolved));

	var vertexNormals = JSM.CalculateBodyVertexNormals (revolved);
	test.Assert (JSM.CoordIsEqual (vertexNormals[10][0], new JSM.Vector (0.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (vertexNormals[11][0], new JSM.Vector (0.0, 0.0, -1.0)));
	
	var openRevolved = JSM.GenerateRevolved (polyLine, axis, 180.0 * JSM.DegRad, 10, true, 'None');
	test.Assert (openRevolved.VertexCount () == 22);
	test.Assert (openRevolved.PolygonCount () == 10);
	test.Assert (!JSM.IsSolidBody (openRevolved));
	test.Assert (!JSM.CheckSolidBody (openRevolved));
});

generatorSuite.AddTest ('GenerateTubeTest', function (test)
{
	var polygons = [
		[
			new JSM.Coord (0, 0, 0),
			new JSM.Coord (1, 0, 0),
			new JSM.Coord (1, 1, 0),
			new JSM.Coord (0, 1, 0)
		],
		[
			new JSM.Coord (0, 0, 1),
			new JSM.Coord (1, 0, 1),
			new JSM.Coord (1, 1, 1),
			new JSM.Coord (0, 1, 1)
		]
	];
	var tube = JSM.GenerateTube (polygons, true);
	test.Assert (tube.VertexCount () == 8);
	test.Assert (tube.PolygonCount () == 6);
	test.Assert (JSM.CheckSolidBody (tube));
	
	var polygons = [
		[
			new JSM.Coord (0, 0, 0),
			new JSM.Coord (1, 0, 0),
			new JSM.Coord (1, 1, 0),
			new JSM.Coord (0, 1, 0)
		],
		[
			new JSM.Coord (0, 0, 0.5),
			new JSM.Coord (1, 0, 0.5),
			new JSM.Coord (1, 1, 0.5),
			new JSM.Coord (0, 1, 0.5)
		],
		[
			new JSM.Coord (0, 0, 1.5),
			new JSM.Coord (1, 0, 1.5),
			new JSM.Coord (1, 1, 1.5),
			new JSM.Coord (0, 1, 1.5)
		],
		[
			new JSM.Coord (0, 0, 2.0),
			new JSM.Coord (1, 0, 2.0),
			new JSM.Coord (1, 1, 2.0),
			new JSM.Coord (0, 1, 2.0)
		],
		[
			new JSM.Coord (0, 0, 2.3),
			new JSM.Coord (1, 0, 2.3),
			new JSM.Coord (1, 1, 2.3),
			new JSM.Coord (0, 1, 2.3)
		]
	];
	
	var tube = JSM.GenerateTube (polygons, true);
	test.Assert (tube.VertexCount () == 20);
	test.Assert (tube.PolygonCount () == 18);
	test.Assert (JSM.CheckSolidBody (tube));

	var polygons = [];
	var i, j, circle;
	for (i = 0; i < 10; i++) {
		circle = JSM.GenerateCirclePoints (i % 2 == 0 ? 1.0 : 0.8, 20);
		for (j = 0; j < circle.length; j++) {
			circle[j].z = i;
		}
		polygons.push (circle);
	}
	var tube = JSM.GenerateTube (polygons, true);
	test.Assert (tube.VertexCount () == 200);
	test.Assert (tube.PolygonCount () == 182);
	test.Assert (JSM.CheckSolidBody (tube));
});

generatorSuite.AddTest ('GenerateFunctionSurfaceTest', function (test)
{
	function TheFunction (x, y)
	{
		return x * x + y * y;
	}

	var intervalMin = new JSM.Coord2D (-1.0, -1.0);
	var intervalMax = new JSM.Coord2D (1.0, 1.0);
	var surface = JSM.GenerateFunctionSurface (TheFunction, intervalMin, intervalMax, 2, true);
	test.Assert (surface.VertexCount () == 9 && surface.PolygonCount () == 4);
	for (var i = 0; i < surface.VertexCount (); i++) {
		var coord = surface.GetVertex (i).position;
		test.Assert (JSM.IsEqual (coord.z, TheFunction (coord.x, coord.y)));
	}
});

generatorSuite.AddTest ('SolidGeneratorTest', function (test)
{
	var ArePolygonsRegular = function (body)
	{
		var i, j, polygon, first, last, length, a, b, currentLength;
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			first = body.GetVertex (polygon.GetVertexIndex (0));
			last = body.GetVertex (polygon.GetVertexIndex (polygon.VertexIndexCount () - 1));
			length = JSM.CoordDistance (first.position, last.position);
			for (j = 1; j < polygon.VertexIndexCount (); j++) {
				a = body.GetVertex (polygon.GetVertexIndex (j - 1));
				b = body.GetVertex (polygon.GetVertexIndex (j));
				currentLength = JSM.CoordDistance (a.position, b.position);
				if (!JSM.IsEqual (length, currentLength)) {
					return false;
				}
			}
		}
		return true;
	};

	var solid = null;

	solid = JSM.GenerateSolidWithRadius ('Tetrahedron', 1.0);
	test.Assert (solid.VertexCount () == 4 && solid.PolygonCount () == 4);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Hexahedron', 1.0);
	test.Assert (solid.VertexCount () == 8 && solid.PolygonCount () == 6);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Octahedron', 1.0);
	test.Assert (solid.VertexCount () == 6 && solid.PolygonCount () == 8);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Dodecahedron', 1.0);
	test.Assert (solid.VertexCount () == 20 && solid.PolygonCount () == 12);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Icosahedron', 1.0);
	test.Assert (solid.VertexCount () == 12 && solid.PolygonCount () == 20);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedTetrahedron', 1.0);
	test.Assert (solid.VertexCount () == 12 && solid.PolygonCount () == 8);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Cuboctahedron', 1.0);
	test.Assert (solid.VertexCount () == 12 && solid.PolygonCount () == 14);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedCube', 1.0);
	test.Assert (solid.VertexCount () == 24 && solid.PolygonCount () == 14);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedOctahedron', 1.0);
	test.Assert (solid.VertexCount () == 24 && solid.PolygonCount () == 14);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Rhombicuboctahedron', 1.0);
	test.Assert (solid.VertexCount () == 24 && solid.PolygonCount () == 26);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedCuboctahedron', 1.0);
	test.Assert (solid.VertexCount () == 48 && solid.PolygonCount () == 26);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('SnubCube', 1.0);
	test.Assert (solid.VertexCount () == 24 && solid.PolygonCount () == 38);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Icosidodecahedron', 1.0);
	test.Assert (solid.VertexCount () == 30 && solid.PolygonCount () == 32);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedDodecahedron', 1.0);
	test.Assert (solid.VertexCount () == 60 && solid.PolygonCount () == 32);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedIcosahedron', 1.0);
	test.Assert (solid.VertexCount () == 60 && solid.PolygonCount () == 32);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('Rhombicosidodecahedron', 1.0);
	test.Assert (solid.VertexCount () == 60 && solid.PolygonCount () == 62);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TruncatedIcosidodecahedron', 1.0);
	test.Assert (solid.VertexCount () == 120 && solid.PolygonCount () == 62);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('SnubDodecahedron', 1.0);
	test.Assert (solid.VertexCount () == 60 && solid.PolygonCount () == 92);
	test.Assert (ArePolygonsRegular (solid));
	test.Assert (JSM.CheckSolidBody (solid));
	
	solid = JSM.GenerateSolidWithRadius ('TetrakisHexahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('RhombicDodecahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('PentakisDodecahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('SmallStellatedDodecahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('GreatDodecahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('SmallTriambicIcosahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('GreatStellatedDodecahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('SmallTriakisOctahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('StellaOctangula', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));

	solid = JSM.GenerateSolidWithRadius ('TriakisTetrahedron', 1.0);
	test.Assert (JSM.CheckSolidBody (solid));
});

generatorSuite.AddTest ('ConvexHullBodyTest', function (test)
{
	var AllPolygonIsTriangle = function (body)
	{
		var i;
		for (i = 0; i < body.PolygonCount (); i++) {
			if (body.GetPolygon (i).VertexIndexCount () != 3) {
				return false;
			}
		}
		return true;
	};

	var a = 1.0;
	var b = 0.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;
	var d = 1.0 / c;
	
	coords = [
		new JSM.Coord (+a, +a, +a),
		new JSM.Coord (+a, +a, -a),
		new JSM.Coord (+a, -a, +a),
		new JSM.Coord (-a, +a, +a),
		
		new JSM.Coord (+a, -a, -a),
		new JSM.Coord (-a, +a, -a),
		new JSM.Coord (-a, -a, +a),
		new JSM.Coord (-a, -a, -a),

		new JSM.Coord (+b, +d, +c),
		new JSM.Coord (+b, +d, -c),
		new JSM.Coord (+b, -d, +c),
		new JSM.Coord (+b, -d, -c),

		new JSM.Coord (+d, +c, +b),
		new JSM.Coord (+d, -c, +b),
		new JSM.Coord (-d, +c, +b),
		new JSM.Coord (-d, -c, +b),

		new JSM.Coord (+c, +b, +d),
		new JSM.Coord (-c, +b, +d),
		new JSM.Coord (+c, +b, -d),
		new JSM.Coord (-c, +b, -d)
	];
	
	var body = JSM.GenerateConvexHullBody (coords);
	test.Assert (body.VertexCount () == 20);
	test.Assert (body.PolygonCount () == 12 * 3);
	test.Assert (AllPolygonIsTriangle (body));
	test.Assert (JSM.CheckSolidBody (body));

	coords.push (new JSM.Coord (0, 0, 0));
	coords.push (new JSM.Coord (0.1, 0, 0));
	coords.push (new JSM.Coord (0.1, 0.1, 0));
	coords.push (new JSM.Coord (0, 0.1, 0));
	coords.push (new JSM.Coord (0, 0, 0.1));
	coords.push (new JSM.Coord (0.1, 0, 0.1));
	coords.push (new JSM.Coord (0.1, 0.1, 0.1));
	coords.push (new JSM.Coord (0, 0.1, 0.1));

	var body = JSM.GenerateConvexHullBody (coords);
	test.Assert (body.VertexCount () == 20);
	test.Assert (body.PolygonCount () == 12 * 3);
	test.Assert (AllPolygonIsTriangle (body));
	test.Assert (JSM.CheckSolidBody (body));
});

var textureSuite = unitTest.AddTestSuite ('ModelerTexture');

textureSuite.AddTest ('BodyPlanarTextureCoordTest', function (test)
{
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 1.0)));
	
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));

	body.SetPlanarTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0));
	
	var textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 1);
	test.Assert (textureCoords[0].length == 4);
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0, 1)));

	body.SetPlanarTextureProjection (new JSM.Coord (0.2, 0.0, 0.2), new JSM.Coord (0.0, 0.0, 1.0), new JSM.Coord (0.0, -1.0, 0.0));

	textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 1);
	test.Assert (textureCoords[0].length == 4);
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (-0.2, -0.2)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (-0.2, 0.8)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (0.8, 0.8)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0.8, -0.2)));

	body.SetPlanarTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 1.0)));
	
	body.AddPolygon (new JSM.BodyPolygon ([0, 3, 5, 4]));

	textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 2);
	test.Assert (textureCoords[0].length == 4);
	test.Assert (textureCoords[1].length == 4);

	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0, 1)));
	
	test.Assert (textureCoords[1][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[1][1].IsEqual (new JSM.Coord2D (0, 1)));
	test.Assert (textureCoords[1][2].IsEqual (new JSM.Coord2D (0, 1)));
	test.Assert (textureCoords[1][3].IsEqual (new JSM.Coord2D (0, 0)));

	var body = new JSM.Body ();
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 0.0)));
	
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	
	body.SetPlanarTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, -1.0));

	textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 1);
	test.Assert (textureCoords[0].length == 4);
	
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0, 1)));

	body.SetPlanarTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (10.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, -20.0));

	textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 1);
	test.Assert (textureCoords[0].length == 4);
	
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0, 1)));

	body.SetPlanarTextureProjection (new JSM.Coord (0.2, 0.2, 1.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, -1.0));

	textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 1);
	test.Assert (textureCoords[0].length == 4);
	
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (-0.2, -0.2)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (0.8, -0.2)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (0.8, 0.8)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (-0.2, 0.8)));

	body.SetPlanarTextureProjection (new JSM.Coord (0.2, 0.3, 1.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, -1.0));	

	textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 1);
	test.Assert (textureCoords[0].length == 4);
	
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (-0.2, -0.3)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (0.8, -0.3)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (0.8, 0.7)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (-0.2, 0.7)));
});

textureSuite.AddTest ('BodyCubicTextureCoordTest', function (test)
{
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 1.0)));
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 0.0)));
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.0, 1.0)));
	
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 3, 4, 5]));
	body.AddPolygon (new JSM.BodyPolygon ([3, 2, 6, 4]));
	
	body.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	var textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 3);
	test.Assert (textureCoords[0].length == 4);
	test.Assert (textureCoords[1].length == 4);
	test.Assert (textureCoords[2].length == 4);
	
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0, 1)));
	
	test.Assert (textureCoords[1][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[1][1].IsEqual (new JSM.Coord2D (0, 1)));
	test.Assert (textureCoords[1][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[1][3].IsEqual (new JSM.Coord2D (1, 0)));

	test.Assert (textureCoords[2][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[2][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[2][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[2][3].IsEqual (new JSM.Coord2D (0, 1)));

	body.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (10.0, 0.0, 0.0), new JSM.Coord (0.0, 12.0, 0.0), new JSM.Coord (0.0, 0.0, 30.0));	
	
	var textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 3);
	test.Assert (textureCoords[0].length == 4);
	test.Assert (textureCoords[1].length == 4);
	test.Assert (textureCoords[2].length == 4);
	
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (0, 1)));
	
	test.Assert (textureCoords[1][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[1][1].IsEqual (new JSM.Coord2D (0, 1)));
	test.Assert (textureCoords[1][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[1][3].IsEqual (new JSM.Coord2D (1, 0)));

	test.Assert (textureCoords[2][0].IsEqual (new JSM.Coord2D (0, 0)));
	test.Assert (textureCoords[2][1].IsEqual (new JSM.Coord2D (1, 0)));
	test.Assert (textureCoords[2][2].IsEqual (new JSM.Coord2D (1, 1)));
	test.Assert (textureCoords[2][3].IsEqual (new JSM.Coord2D (0, 1)));
});

textureSuite.AddTest ('BodyCylindricalTextureCoordTest', function (test)
{
	var body = new JSM.GenerateCylinder (1.0, 1.0, 6, true, false);
	test.Assert (body.VertexCount () == 12);
	test.Assert (body.PolygonCount () == 8);
	
	var textureCoords = JSM.CalculateBodyTextureCoords (body);
	test.Assert (textureCoords.length == 8);
	test.Assert (textureCoords[0].length == 4);
	test.Assert (textureCoords[1].length == 4);
	test.Assert (textureCoords[2].length == 4);
	test.Assert (textureCoords[3].length == 4);
	test.Assert (textureCoords[4].length == 4);
	test.Assert (textureCoords[5].length == 4);
	
	var radius = 2.0 * Math.PI;
	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (radius, 1.0)));
	test.Assert (textureCoords[0][1].IsEqual (new JSM.Coord2D (radius * 5.0 / 6.0, 1.0)));
	test.Assert (textureCoords[0][2].IsEqual (new JSM.Coord2D (radius * 5.0 / 6.0, 0.0)));
	test.Assert (textureCoords[0][3].IsEqual (new JSM.Coord2D (radius, 0.0)));

	test.Assert (textureCoords[0][0].IsEqual (new JSM.Coord2D (radius * 6.0 / 6.0, 1.0)));
	test.Assert (textureCoords[1][0].IsEqual (new JSM.Coord2D (radius * 5.0 / 6.0, 1.0)));
	test.Assert (textureCoords[2][0].IsEqual (new JSM.Coord2D (radius * 4.0 / 6.0, 1.0)));
	test.Assert (textureCoords[3][0].IsEqual (new JSM.Coord2D (radius * 3.0 / 6.0, 1.0)));
	test.Assert (textureCoords[4][0].IsEqual (new JSM.Coord2D (radius * 2.0 / 6.0, 1.0)));
	test.Assert (textureCoords[5][0].IsEqual (new JSM.Coord2D (radius * 1.0 / 6.0, 1.0)));
});

var utilsSuite = unitTest.AddTestSuite ('ModelerUtils');

utilsSuite.AddTest ('MergeCoplanarPolygonsTest', function (test)
{
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 0.5, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.0, 1.5, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, 0.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 1.0, -1.0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.0, 0.0, -1.0)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 2, 3]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 3, 4]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 4, 5]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 5, 6]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 6, 7]));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 7]));
	test.Assert (body.VertexCount () == 8);
	test.Assert (body.PolygonCount () == 7);

	mergedBody = JSM.MergeCoplanarPolygons (body);
	test.Assert (mergedBody.VertexCount () == 8);
	test.Assert (mergedBody.PolygonCount () == 3);
	
	cylinder = JSM.GenerateCylinder (1.0, 1.0, 50, true);
	triangulatedCylinder1 = JSM.TriangulatePolygons (cylinder);
	triangulatedCylinder2 = JSM.TriangulateWithCentroids (cylinder);
	mergedCylinder1 = JSM.MergeCoplanarPolygons (triangulatedCylinder1);
	mergedCylinder2 = JSM.MergeCoplanarPolygons (triangulatedCylinder2);
	test.Assert (cylinder.VertexCount () == 100);
	test.Assert (cylinder.PolygonCount () == 52);
	test.Assert (triangulatedCylinder1.VertexCount () == 100);
	test.Assert (triangulatedCylinder1.PolygonCount () == 196);
	test.Assert (triangulatedCylinder2.VertexCount () == 152);
	test.Assert (triangulatedCylinder2.PolygonCount () == 300);
	test.Assert (mergedCylinder1.VertexCount () == 100);
	test.Assert (mergedCylinder1.PolygonCount () == 52);
	test.Assert (mergedCylinder2.VertexCount () == 100);
	test.Assert (mergedCylinder2.PolygonCount () == 52);
});

utilsSuite.AddTest ('AddBodyToBSPTreeTest', function (test)
{
	var body = new JSM.GenerateCuboid (1, 1, 1);
	var bspTree = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (body, bspTree, 42);
	
	test.Assert (bspTree.NodeCount () == 6);
	bspTree.Traverse (function (node) {
		test.Assert (node.outside == null);
		test.Assert (node.userData.id == 42);
	});

	var body2 = new JSM.GenerateCuboid (1, 1, 1);
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (0.5, 0.5, 0.5)));
	JSM.AddBodyToBSPTree (body2, bspTree, 43);
	test.Assert (bspTree.NodeCount () == 21);
});

var raySuite = unitTest.AddTestSuite ('RayTest');

raySuite.AddTest ('RayTest', function (test)
{
	var ray = new JSM.Ray (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0), 10.0);
	var ray2 = ray.Clone ();
	ray.Set (new JSM.Coord (0.0, 1.0, 0.0), new JSM.Vector (12.0, 0.0, 0.0), 10.1);
	
	test.Assert (JSM.CoordIsEqual (ray.origin, new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (ray.direction, new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (ray.GetOrigin (), new JSM.Coord (0.0, 1.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (ray.GetDirection (), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (ray.length == 10.1);
	
	test.Assert (JSM.CoordIsEqual (ray2.origin, new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (ray2.direction, new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (ray2.GetOrigin (), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (ray2.GetDirection (), new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (JSM.CoordIsEqual (ray2.GetDirection (), new JSM.Coord (0.0, 0.0, 1.0)));
	test.Assert (ray2.length == 10.0);

	test.Assert (ray2.IsLengthReached (11));
	test.Assert (!ray2.IsLengthReached (9));

	var ray3 = new JSM.Ray (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Vector (0.0, 0.0, 1.0), null);
	test.Assert (!ray3.IsLengthReached (100));
});

raySuite.AddTest ('RayTriangleIntersectionTest', function (test)
{
	function CheckIntersection (from, to)
	{
		var ray = new JSM.Ray (from, JSM.CoordSub (to, from), null);
		var intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
		return (intersection !== null);
	}
	
	var v0 = new JSM.Coord (0.0, 0.0, 0.0);
	var v1 = new JSM.Coord (1.0, 0.0, 0.0);
	var v2 = new JSM.Coord (1.0, 1.0, 0.0);
	
	var ray = new JSM.Ray (new JSM.Coord (0.2, 0.2, 1.0), new JSM.Vector (0.0, 0.0, 1.0), 10.0);
	var intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
	test.Assert (intersection === null);

	var ray = new JSM.Ray (new JSM.Coord (0.2, 0.2, 1.0), new JSM.Vector (0.0, 0.0, -1.0), 0.2);
	var intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
	test.Assert (intersection === null);

	var ray = new JSM.Ray (new JSM.Coord (0.2, 0.2, 1.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
	test.Assert (intersection !== null);
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.2, 0.2, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));

	var ray = new JSM.Ray (new JSM.Coord (0.2, 0.2, 1.0), new JSM.Vector (0.0, 0.0, -1.0), null);
	var intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
	test.Assert (intersection !== null);
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.2, 0.2, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));
	
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0, 0, 0)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (1, 0, 0)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (1, 1, 0)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0, 0, -1)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0.2, 0.2, 0)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0.5, 0.5, 0)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0.6, 0.4, 0)) == true);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0.0, 1.0, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0.6, 0.7, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (-1, 0, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (0, 0, 2)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, 1), new JSM.Coord (1, 1, 1)) == false);

	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (0, 0, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (1, 0, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (1, 1, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (0, 0, -1)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (0.2, 0.2, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (0.5, 0.5, 0)) == false);
	test.Assert (CheckIntersection (new JSM.Coord (0, 0, -1), new JSM.Coord (0.6, 0.4, 0)) == false);
});

raySuite.AddTest ('RayBoxIntersectionTest', function (test)
{
	function GetIntersection (box, from, to, length)
	{
		var ray = new JSM.Ray (from, JSM.CoordSub (to, from), length);
		var intersection = JSM.RayBoxIntersection (ray, box.min, box.max);
		return intersection;
	}	
	
	var box = new JSM.Box (new JSM.Coord (1, 0, 0), new JSM.Coord (2, 1, 1));
	
	var intersection = GetIntersection (box, new JSM.Coord (0, 0, 0), new JSM.Coord (0, 1, 0), null);
	test.Assert (intersection === null);
	var intersection = GetIntersection (box, new JSM.Coord (0, 0, 0), new JSM.Coord (0, -1, 0), null);
	test.Assert (intersection === null);
	var intersection = GetIntersection (box, new JSM.Coord (0, 0, 0), new JSM.Coord (0, 0, 1), null);
	test.Assert (intersection === null);
	var intersection = GetIntersection (box, new JSM.Coord (0, 0, 0), new JSM.Coord (0, 0, -1), null);
	test.Assert (intersection === null);
	var intersection = GetIntersection (box, new JSM.Coord (0, 0, 0), new JSM.Coord (-1, 0, 0), null);
	test.Assert (intersection === null);

	var intersection = GetIntersection (box, new JSM.Coord (1, 0, 0), new JSM.Coord (2, 1, 1), null);
	test.Assert (intersection !== null);
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 0.0));
	
	var intersection = GetIntersection (box, new JSM.Coord (1.5, 0.5, 0.5), new JSM.Coord (1.6, 0.5, 0.5), null);
	test.Assert (intersection !== null);
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (1.5, 0.5, 0.5)));
	test.Assert (JSM.IsEqual (intersection.distance, 0.0));

	var intersection = GetIntersection (box, new JSM.Coord (0, 0, 0), new JSM.Coord (1, 0, 0), null);
	test.Assert (intersection !== null);
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));

	var intersection = GetIntersection (box, new JSM.Coord (1.5, -1, 0.5), new JSM.Coord (1.5, 1, 0.5), null);
	test.Assert (intersection !== null);
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (1.5, 0.0, 0.5)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));

	for (var i = -3; i <= 3; i += 0.1) {
		var intersection = GetIntersection (box, new JSM.Coord (1.5, -10, 0.5), new JSM.Coord (i, 0, 0.5), null);
		if (JSM.IsLower (i, 1) || JSM.IsGreater (i, 2)) {
			test.Assert (intersection === null);
		} else {
			test.Assert (intersection !== null);
		}
		
		var intersection = GetIntersection (box, new JSM.Coord (1.5, 10, 0.5), new JSM.Coord (i, 0, 0.5), null);
		if (JSM.IsLower (i, 1) || JSM.IsGreater (i, 2)) {
			test.Assert (intersection === null);
		} else {
			test.Assert (intersection !== null);
		}
		
		var intersection = GetIntersection (box, new JSM.Coord (1.5, -10, 0.5), new JSM.Coord (i, 0, 0.5), 10.0);
		if (JSM.IsEqual (i, 1.5)) {
			test.Assert (intersection !== null);
		} else {
			test.Assert (intersection === null);
		}
	}
});

raySuite.AddTest ('RayTriangleModelIntersectionTest', function (test)
{
	var body = new JSM.TriangleBody ();
	body.AddVertex (0, 0, 0);
	body.AddVertex (1, 0, 0);
	body.AddVertex (1, 1, 0);
	body.AddVertex (0, 1, 0);
	body.AddTriangle (0, 1, 2);
	body.AddTriangle (0, 2, 3);
	
	var model = new JSM.TriangleModel ();
	model.AddBody (body);
	model.Finalize ();
	
	var ray = new JSM.Ray (new JSM.Coord (2.0, 2.0, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	test.Assert (!JSM.RayTriangleBodyIntersection (ray, body));
	test.Assert (!JSM.RayTriangleModelIntersection (ray, model));

	var ray = new JSM.Ray (new JSM.Coord (0.6, 0.4, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 0.5);
	test.Assert (!JSM.RayTriangleBodyIntersection (ray, body));
	test.Assert (!JSM.RayTriangleModelIntersection (ray, model));

	var ray = new JSM.Ray (new JSM.Coord (0.6, 0.4, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleBodyIntersection (ray, body, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.6, 0.4, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 2.0));	
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, model, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.6, 0.4, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 2.0));	

	var ray = new JSM.Ray (new JSM.Coord (0.4, 0.6, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleBodyIntersection (ray, body, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.4, 0.6, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 2.0));	
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, model, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.4, 0.6, 0.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 2.0));

	var body = new JSM.TriangleBody ();
	body.AddVertex (0, 0, 0);
	body.AddVertex (1, 0, 0);
	body.AddVertex (1, 1, 0);
	body.AddVertex (0, 1, 0);
	body.AddTriangle (0, 1, 2);
	body.AddTriangle (0, 2, 3);
	
	body.AddVertex (0, 0, 1);
	body.AddVertex (1, 0, 1);
	body.AddVertex (1, 1, 1);
	body.AddVertex (0, 1, 1);
	body.AddTriangle (4, 5, 6);
	body.AddTriangle (4, 6, 7);	
	
	var model = new JSM.TriangleModel ();
	model.AddBody (body);
	model.Finalize ();

	var ray = new JSM.Ray (new JSM.Coord (2.0, 2.0, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	test.Assert (!JSM.RayTriangleBodyIntersection (ray, body));
	test.Assert (!JSM.RayTriangleModelIntersection (ray, model));

	var ray = new JSM.Ray (new JSM.Coord (0.6, 0.4, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 0.5);
	test.Assert (!JSM.RayTriangleBodyIntersection (ray, body));
	test.Assert (!JSM.RayTriangleModelIntersection (ray, model));

	var ray = new JSM.Ray (new JSM.Coord (0.6, 0.4, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleBodyIntersection (ray, body, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.6, 0.4, 1.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));	
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, model, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.6, 0.4, 1.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));	

	var ray = new JSM.Ray (new JSM.Coord (0.4, 0.6, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleBodyIntersection (ray, body, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.4, 0.6, 1.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));	
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, model, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.4, 0.6, 1.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));

	var body = new JSM.TriangleBody ();
	body.AddVertex (0, 0, 0);
	body.AddVertex (1, 0, 0);
	body.AddVertex (1, 1, 0);
	body.AddVertex (0, 1, 0);
	body.AddTriangle (0, 1, 2);
	body.AddTriangle (0, 2, 3);
	
	var body2 = new JSM.TriangleBody ();
	body2.AddVertex (0, 0, 1);
	body2.AddVertex (1, 0, 1);
	body2.AddVertex (1, 1, 1);
	body2.AddVertex (0, 1, 1);
	body2.AddTriangle (0, 1, 2);
	body2.AddTriangle (0, 2, 3);
	
	var box = body2.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (box.min, new JSM.Coord (0, 0, 1)));
	test.Assert (JSM.CoordIsEqual (box.max, new JSM.Coord (1, 1, 1)));
	
	var model = new JSM.TriangleModel ();
	model.AddBody (body);
	model.AddBody (body2);
	model.Finalize ();

	test.Assert (model.VertexCount () == 8);
	test.Assert (model.TriangleCount () == 4);
	
	var ray = new JSM.Ray (new JSM.Coord (2.0, 2.0, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	test.Assert (!JSM.RayTriangleModelIntersection (ray, model));

	var ray = new JSM.Ray (new JSM.Coord (0.6, 0.4, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 0.5);
	test.Assert (!JSM.RayTriangleModelIntersection (ray, model));

	var ray = new JSM.Ray (new JSM.Coord (0.6, 0.4, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, model, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.6, 0.4, 1.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));	

	var ray = new JSM.Ray (new JSM.Coord (0.4, 0.6, 2.0), new JSM.Vector (0.0, 0.0, -1.0), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, model, intersection));
	test.Assert (JSM.CoordIsEqual (intersection.position, new JSM.Coord (0.4, 0.6, 1.0)));
	test.Assert (JSM.IsEqual (intersection.distance, 1.0));
});

raySuite.AddTest ('RayTriangleModelIntersectionTest2', function (test)
{
	var body = JSM.GenerateCuboid (1, 1, 1);
	var model = new JSM.Model ();
	model.AddBody (body);

	var box = body.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (box.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (box.max, new JSM.Coord (0.5, 0.5, 0.5)));
	var center = body.GetCenter ();
	test.Assert (JSM.CoordIsEqual (center, new JSM.Coord (0.0, 0.0, 0.0)));
	var sphere = body.GetBoundingSphere ();
	test.Assert (JSM.CoordIsEqual (sphere.center, new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.IsEqual (sphere.radius, JSM.CoordDistance (sphere.center, box.max)));

	var triangleModel = JSM.ConvertModelToTriangleModel (model);
	var triangleBody = triangleModel.GetBody (0);
	var box = triangleBody.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (box.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (box.max, new JSM.Coord (0.5, 0.5, 0.5)));
	var center = triangleBody.GetCenter ();
	test.Assert (JSM.CoordIsEqual (center, new JSM.Coord (0.0, 0.0, 0.0)));
	var sphere = triangleBody.GetBoundingSphere ();
	test.Assert (JSM.CoordIsEqual (sphere.center, new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.IsEqual (sphere.radius, JSM.CoordDistance (sphere.center, box.max)));	
	
	var ray = new JSM.Ray (new JSM.Coord (2, 0, 0), JSM.CoordSub (new JSM.Coord (0, 0, 0), new JSM.Coord (2, 0, 0.1)), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, triangleModel, intersection));
	test.Assert (intersection.bodyIndex == 0);
	test.Assert (intersection.triangleIndex == 2);
	
	var ray = new JSM.Ray (new JSM.Coord (2, 0, 0), JSM.CoordSub (new JSM.Coord (0, 0, 0), new JSM.Coord (2, 0, -0.1)), 10.0);
	var intersection = {};
	test.Assert (JSM.RayTriangleModelIntersection (ray, triangleModel, intersection));
	test.Assert (intersection.bodyIndex == 0);
	test.Assert (intersection.triangleIndex == 3);
});

raySuite.AddTest ('TriangleBodyOctreeTest', function (test)
{
	function OctreeTriangleCount (octree)
	{
		var triangleCount = 0;
		JSM.TraverseOctreeNodes (octree, function (node) {
			triangleCount += node.triangles.length;
			return true;
		});
		return triangleCount;
	}
	
	function EqualTriangleCountInOctree (body)
	{
		var triangleBody = JSM.ConvertBodyToTriangleBody (body);
		var octree = JSM.ConvertTriangleBodyToOctree (triangleBody);
		return (OctreeTriangleCount (octree) == triangleBody.TriangleCount ());
	}
	
	function EqualIntersection (from, to, body, octree, checkIndex)
	{
		var ray = new JSM.Ray (from, JSM.CoordSub (to, from), null);
		var bodyIntersection = {}
		var hasBodyIntersection = JSM.RayTriangleBodyIntersection (ray, body, bodyIntersection);
		var octreeIntersection = {}
		var timer = new JSM.Timer ();
		var hasOctreeIntersection = JSM.RayOctreeIntersection (ray, octree, octreeIntersection);
		if (hasBodyIntersection != hasOctreeIntersection) {
			return false;
		}
		if (hasBodyIntersection && hasOctreeIntersection) {
			test.Assert (JSM.CoordIsEqual (bodyIntersection.position, octreeIntersection.position));
			test.Assert (JSM.IsEqual (bodyIntersection.distance, octreeIntersection.distance));
			if (checkIndex) {
				test.Assert (bodyIntersection.triangleIndex == octreeIntersection.userData.triangleIndex);
			}
		}
		return true;
	}
	
	function CheckAllIntersections (body, checkIndex)
	{
		var triangleBody = JSM.ConvertBodyToTriangleBody (body);
		var octree = JSM.ConvertTriangleBodyToOctree (triangleBody);

		var	i;
		for (i = -2; i <= 2; i += 0.1) {
			for (j = -2; j <= 2; j += 0.1) {
				test.Assert (EqualIntersection (new JSM.Coord (2, 0, 0), new JSM.Coord (0, i, j), triangleBody, octree, checkIndex));
			}
		}		
	}
	
	test.Assert (EqualTriangleCountInOctree (JSM.GenerateCuboid (1, 1, 1)));
	test.Assert (EqualTriangleCountInOctree (JSM.GenerateSphere (1, 20, true)));
	test.Assert (EqualTriangleCountInOctree (JSM.GenerateSolidWithRadius ('Icosahedron', 1.0)));
	CheckAllIntersections (JSM.GenerateSolidWithRadius ('Icosahedron', 1.0), true);
	CheckAllIntersections (JSM.GenerateSphere (1, 25, true), false);
});

var conversionSuite = unitTest.AddTestSuite ('Conversion');

conversionSuite.AddTest ('TriangleModelConversion', function (test)
{
	var body = JSM.GenerateSolidWithRadius ('Icosahedron', 1.0);
	var triangleBody = JSM.ConvertBodyToTriangleBody (body);
	test.Assert (triangleBody.VertexCount () == 12);
	test.Assert (triangleBody.TriangleCount () == 20);	
	
	var body2 = JSM.GenerateCuboid (1.0, 2.0, 3.0);
	var triangleBody = JSM.ConvertBodyToTriangleBody (body2);
	test.Assert (triangleBody.VertexCount () == 8);
	test.Assert (triangleBody.TriangleCount () == 6 * 2);
    
	var body3 = JSM.GenerateSolidWithRadius ('Dodecahedron', 1.0);
	var triangleBody = JSM.ConvertBodyToTriangleBody (body3);
	test.Assert (triangleBody.VertexCount () == 20);
	test.Assert (triangleBody.TriangleCount () == 12 * 3);
	
	var model = new JSM.Model ();
	var materials = new JSM.Materials ();
	model.AddBody (body);
	var triangleModel = JSM.ConvertModelToTriangleModel (model, materials);
	test.Assert (triangleModel.MaterialCount () == 1);
	test.Assert (triangleModel.BodyCount () == 1);

	var model = new JSM.Model ();
	var materials = new JSM.Materials ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xff0000, diffuse : 0xff0000}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x00ff00, diffuse : 0x00ff00}));

	var body = JSM.GenerateCuboid (1.0, 2.0, 3.0);
	body.GetPolygon (0).SetMaterialIndex (0);
	body.GetPolygon (1).SetMaterialIndex (1);
	model.AddBody (body);
	
	var triangleModel = JSM.ConvertModelToTriangleModel (model, materials);
	test.Assert (triangleModel.MaterialCount () == 3);
	test.Assert (triangleModel.GetMaterial (0).ambient.toString () == [1.0, 0.0, 0.0].toString ());
	test.Assert (triangleModel.GetMaterial (0).diffuse.toString () == [1.0, 0.0, 0.0].toString ());
	test.Assert (triangleModel.GetMaterial (1).ambient.toString () == [0.0, 1.0, 0.0].toString ());
	test.Assert (triangleModel.GetMaterial (1).diffuse.toString () == [0.0, 1.0, 0.0].toString ());
	test.Assert (triangleModel.GetMaterial (2).ambient.toString () == [0.5, 0.5, 0.5].toString ());
	test.Assert (triangleModel.GetMaterial (2).diffuse.toString () == [0.5, 0.5, 0.5].toString ());
	
	test.Assert (triangleModel.BodyCount () == 1);
	for (var i = 0; i < 12; i++) {
		if (i == 0 || i == 1) {
			test.Assert (triangleModel.GetBody (0).GetTriangle (i).mat == 0);
		} else if (i == 2 || i == 3) {
			test.Assert (triangleModel.GetBody (0).GetTriangle (i).mat == 1);
		} else {
			test.Assert (triangleModel.GetBody (0).GetTriangle (i).mat == 2);
		}
	}
});

}
