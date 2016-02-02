/**
* Function: CatmullClarkSubdivisionOneIteration
* Description: Runs one iteration of Catmull-Clark subdivision on a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Body} the result
*/
JSM.CatmullClarkSubdivisionOneIteration = function (body)
{
	function AddOriginalVertices (body, result, adjacencyInfo)
	{
		var i, vertCoord;
		for (i = 0; i < adjacencyInfo.verts.length; i++) {
			vertCoord = body.GetVertexPosition (i);
			result.AddVertex (new JSM.BodyVertex (vertCoord.Clone ()));
		}
	}

	function AddPolygonVertices (body, result, adjacencyInfo, pgonVertices)
	{
		var i, j, pgon, vertCoord, pgonCoord;
		for (i = 0; i < adjacencyInfo.pgons.length; i++) {
			pgon = adjacencyInfo.pgons[i];
			pgonCoord = new JSM.Coord (0.0, 0.0, 0.0);
			for (j = 0; j < pgon.verts.length; j++) {
				vertCoord = body.GetVertexPosition (pgon.verts[j]);
				pgonCoord = JSM.CoordAdd (pgonCoord, vertCoord);
			}

			pgonCoord.MultiplyScalar (1.0 / pgon.verts.length);
			pgonVertices.push (result.AddVertex (new JSM.BodyVertex (pgonCoord)));
		}
	}
	
	function AddEdgeVertices (body, result, adjacencyInfo, pgonVertices, edgeVertices)
	{
		var i, j, edge, edgeCoord1, edgeCoord2, edgeCoord, pgonIndex, pgonCoord;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			edgeCoord1 = body.GetVertexPosition (edge.vert1);
			edgeCoord2 = body.GetVertexPosition (edge.vert2);
			if (adjacencyInfo.IsContourEdge (edge)) {
				edgeCoord = JSM.MidCoord (edgeCoord1, edgeCoord2);
			} else {
				edgeCoord = JSM.CoordAdd (edgeCoord1, edgeCoord2);
				for (j = 0; j < 2; j++) {
					pgonIndex = (j === 0 ? edge.pgon1 : edge.pgon2);
					pgonCoord = result.GetVertexPosition (pgonVertices[pgonIndex]);
					edgeCoord = JSM.CoordAdd (edgeCoord, pgonCoord);
				}
				edgeCoord.MultiplyScalar (1.0 / 4.0);
			}
			edgeVertices.push (result.AddVertex (new JSM.BodyVertex (edgeCoord)));
		}
	}

	function MoveOriginalVertices (body, result, adjacencyInfo, pgonVertices)
	{
		function MoveContourVertex (newVertCoord, vertCoord)
		{
			vertCoord.x = newVertCoord.x;
			vertCoord.y = newVertCoord.y;
			vertCoord.z = newVertCoord.z;
		}		
		
		function MoveVertex (pgonAverage, edgeAverage, vertEdgeCount, vertCoord)
		{
			vertCoord.x = (pgonAverage.x + 2.0 * edgeAverage.x + (vertEdgeCount - 3) * vertCoord.x) / vertEdgeCount;
			vertCoord.y = (pgonAverage.y + 2.0 * edgeAverage.y + (vertEdgeCount - 3) * vertCoord.y) / vertEdgeCount;
			vertCoord.z = (pgonAverage.z + 2.0 * edgeAverage.z + (vertEdgeCount - 3) * vertCoord.z) / vertEdgeCount;
		}
	
		var edgeMidCoords = [];
		
		var edge, edgeCoord;
		var i, j;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			edgeCoord = JSM.MidCoord (body.GetVertexPosition (edge.vert1), body.GetVertexPosition (edge.vert2));
			edgeMidCoords.push (edgeCoord);
		}
	
		var vert, pgon, vertCoord, currentVertCoord;
		var pgonAverage, edgeAverage, edgeCountForAverage;
		for (i = 0; i < adjacencyInfo.verts.length; i++) {
			vert = adjacencyInfo.verts[i];
			vertCoord = result.GetVertexPosition (i);
			if (adjacencyInfo.IsContourVertex (vert)) {
				edgeCountForAverage = 0;
				edgeAverage = new JSM.Coord (0.0, 0.0, 0.0);
				for (j = 0; j < vert.edges.length; j++) {
					edge = vert.edges[j];
					if (adjacencyInfo.IsContourEdge (adjacencyInfo.edges[edge])) {
						edgeCoord = edgeMidCoords [vert.edges[j]];
						edgeAverage.Add (edgeCoord);
						edgeCountForAverage++;
					}
				}
				edgeAverage.Add (vertCoord);
				edgeCountForAverage++;
				edgeAverage.MultiplyScalar (1.0 / edgeCountForAverage);
				MoveContourVertex (edgeAverage, vertCoord);
			} else {
				pgonAverage = new JSM.Coord (0.0, 0.0, 0.0);
				edgeAverage = new JSM.Coord (0.0, 0.0, 0.0);
				
				for (j = 0; j < vert.pgons.length; j++) {
					pgon = vert.pgons[j];
					currentVertCoord = result.GetVertexPosition (pgonVertices[pgon]);
					pgonAverage.Add (currentVertCoord);
				}
				pgonAverage.MultiplyScalar (1.0 / vert.pgons.length);

				for (j = 0; j < vert.edges.length; j++) {
					edge = vert.edges[j];
					edgeCoord = edgeMidCoords [edge];
					edgeAverage.Add (edgeCoord);
				}
				edgeAverage.MultiplyScalar (1.0 / vert.edges.length);
				MoveVertex (pgonAverage, edgeAverage, vert.edges.length, vertCoord);
			}
		}
	}
	
	function AddNewPolygons (body, result, adjacencyInfo, pgonVertices, edgeVertices)
	{
		var edgeCount, currentEdge, nextEdge;
		var centroid, currentEdgeVertex, originalVertex, nextEdgeVertex;
		var polygon, oldPolygon;
		var i, j, pgon;
		for (i = 0; i < adjacencyInfo.pgons.length; i++) {
			pgon = adjacencyInfo.pgons[i];
			edgeCount = pgon.verts.length;
			for (j = 0; j < edgeCount; j++) {
				currentEdge = pgon.pedges[j];
				nextEdge = pgon.pedges[(j + 1) % edgeCount];

				centroid = pgonVertices[i];
				currentEdgeVertex = edgeVertices[currentEdge.index];
				originalVertex = adjacencyInfo.GetPolyEdgeStartVertex (nextEdge);
				nextEdgeVertex = edgeVertices[nextEdge.index];
				
				polygon = new JSM.BodyPolygon ([centroid, currentEdgeVertex, originalVertex, nextEdgeVertex]);
				oldPolygon = body.GetPolygon (i);
				polygon.material = oldPolygon.material;
				polygon.curved = oldPolygon.curved;
				result.AddPolygon (polygon);
			}
		}
	}

	var result = new JSM.Body ();
	var adjacencyInfo = new JSM.AdjacencyInfo (body);

	var pgonVertices = [];
	var edgeVertices = [];

	AddOriginalVertices (body, result, adjacencyInfo);
	AddPolygonVertices (body, result, adjacencyInfo, pgonVertices);
	AddEdgeVertices (body, result, adjacencyInfo, pgonVertices, edgeVertices);

	MoveOriginalVertices (body, result, adjacencyInfo, pgonVertices);
	AddNewPolygons (body, result, adjacencyInfo, pgonVertices, edgeVertices);
	
	return result;
};

/**
* Function: CatmullClarkSubdivision
* Description: Runs multiple iterations of Catmull-Clark subdivision on a body.
* Parameters:
*	body {Body} the body
*	iterations {integer} the iteration number
* Returns:
*	{Body} the result
*/
JSM.CatmullClarkSubdivision = function (body, iterations)
{
	var result = body;
	
	var i;
	for (i = 0; i < iterations; i++) {
		result = JSM.CatmullClarkSubdivisionOneIteration (result);
	}
	
	return result;
};
