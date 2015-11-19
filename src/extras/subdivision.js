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
		var edgeVertexWeight = 1.0 / 4.0;
		var i, j, edge, edgeCoord1, edgeCoord2, edgeCoord, pgonIndex, pgonCoord;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			edgeCoord1 = body.GetVertexPosition (edge.vert1).Clone ().MultiplyScalar (edgeVertexWeight);
			edgeCoord2 = body.GetVertexPosition (edge.vert2).Clone ().MultiplyScalar (edgeVertexWeight);
			edgeCoord = JSM.CoordAdd (edgeCoord1, edgeCoord2);

			for (j = 0; j < 2; j++) {
				pgonIndex = (j === 0 ? edge.pgon1 : edge.pgon2);
				if (pgonIndex === -1) {
					pgonIndex = (j === 0 ? edge.pgon2 : edge.pgon1);
				}
				pgonCoord = result.GetVertexPosition (pgonVertices[pgonIndex]).Clone ();
				edgeCoord = JSM.CoordAdd (edgeCoord, pgonCoord.MultiplyScalar (edgeVertexWeight));
			}

			edgeVertices.push (result.AddVertex (new JSM.BodyVertex (edgeCoord)));
		}
	}

	function MoveOriginalVertices (body, result, adjacencyInfo, pgonVertices)
	{
		function MoveVertex (f, r, n, vertCoord)
		{
			vertCoord.x = (f.x + 2.0 * r.x + (n - 3) * vertCoord.x) / n;
			vertCoord.y = (f.y + 2.0 * r.y + (n - 3) * vertCoord.y) / n;
			vertCoord.z = (f.z + 2.0 * r.z + (n - 3) * vertCoord.z) / n;
		}
	
		var edgeMidCoords = [];
		
		var edge, edgeCoord;
		var i, j;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			edgeCoord = JSM.MidCoord (body.GetVertexPosition (edge.vert1), body.GetVertexPosition (edge.vert2));
			edgeMidCoords.push (edgeCoord);
		}
	
		var vert, vertCoord, currentVertCoord;
		var f, r, n;
		for (i = 0; i < adjacencyInfo.verts.length; i++) {
			vert = adjacencyInfo.verts[i];
			f = new JSM.Coord (0.0, 0.0, 0.0);
			r = new JSM.Coord (0.0, 0.0, 0.0);
			
			for (j = 0; j < vert.pgons.length; j++) {
				currentVertCoord = result.GetVertexPosition (pgonVertices[vert.pgons[j]]).Clone ();
				f.Add (currentVertCoord);
			}
			f.MultiplyScalar (1.0 / vert.pgons.length);

			for (j = 0; j < vert.edges.length; j++) {
				edgeCoord = edgeMidCoords [vert.edges[j]].Clone ();
				r.Add (edgeCoord);
			}
			r.MultiplyScalar (1.0 / vert.edges.length);

			n = vert.edges.length;
			vertCoord = result.GetVertexPosition (i);
			MoveVertex (f, r, n, vertCoord);
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
