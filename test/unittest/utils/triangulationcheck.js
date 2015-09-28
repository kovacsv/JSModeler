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

function GenerateRandomSimplePolygon ()
{
	function RandomInt (from, to)
	{
		return Math.floor ((Math.random () * (to - from + 1)) + from);
	}
	
	var xMin = 0;
	var xMax = 800;
	var yMin = 0;
	var yMax = 600;
	
	var polygon = new JSM.Polygon2D ();
	var lastVertex = null;
	var i, nextVertex, sectorPosition;
	for (i = 0; i < 1000; i++) {
		nextVertex = new JSM.Coord2D (RandomInt (xMin, xMax), RandomInt (yMin, yMax));
		if (lastVertex !== null) {
			sectorPosition = polygon.SectorPosition (new JSM.Sector2D (lastVertex, nextVertex), polygon.VertexCount () - 1, -1);
			if (sectorPosition != JSM.SectorPolygonPosition2D.NoIntersection) {
				continue;
			}
		}
		polygon.AddVertexCoord (nextVertex);
		lastVertex = nextVertex;
	}

	var success = false;
	var firstVertex = polygon.GetVertex (0);
	for (i = 0; i < 1000; i++) {
		nextVertex = new JSM.Coord2D (RandomInt (xMin, xMax), RandomInt (yMin, yMax));
		sectorPosition = polygon.SectorPosition (new JSM.Sector2D (lastVertex, nextVertex), polygon.VertexCount () - 1, -1);
		if (sectorPosition != JSM.SectorPolygonPosition2D.NoIntersection) {
			continue;
		}
		sectorPosition = polygon.SectorPosition (new JSM.Sector2D (nextVertex, firstVertex), -1, 0);
		if (sectorPosition != JSM.SectorPolygonPosition2D.NoIntersection) {
			continue;
		}
		polygon.AddVertexCoord (nextVertex);
		success = true;
	}

	if (!success) {
		return null;
	}
	return polygon;
}
