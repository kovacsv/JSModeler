JSM.CatmullClarkSubdivisionOneIteration = function (body)
{
	var AddOriginalVertices = function ()
	{
		var i, vertCoord;
		for (i = 0; i < al.verts.length; i++) {
			vertCoord = body.GetVertex (i).position;
			result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertCoord.x, vertCoord.y, vertCoord.z)));
		}
	};

	var AddPolygonVertices = function ()
	{
		var i, j, pgon, vertCoord, pgonCoord;
		for (i = 0; i < al.pgons.length; i++) {
			pgon = al.pgons[i];
			pgonCoord = new JSM.Coord (0.0, 0.0, 0.0);
			for (j = 0; j < pgon.verts.length; j++) {
				vertCoord = body.GetVertex (pgon.verts[j]).position;
				pgonCoord = JSM.CoordAdd (pgonCoord, vertCoord);
			}

			pgonCoord = JSM.VectorMultiply (pgonCoord, 1.0 / pgon.verts.length);
			pgonVertices.push (result.AddVertex (new JSM.BodyVertex (pgonCoord)));
		}
	};
	
	var AddEdgeVertices = function ()
	{
		var edgeVertexWeight = 1.0 / 4.0;
		var i, j, edge, edgeCoord, pgonIndex, pgonCoord;
		for (i = 0; i < al.edges.length; i++) {
			edge = al.edges[i];
			edgeCoord = new JSM.Coord (0.0, 0.0, 0.0);
			edgeCoord = JSM.CoordAdd (edgeCoord, JSM.VectorMultiply (body.GetVertex (edge.vert1).position, edgeVertexWeight));
			edgeCoord = JSM.CoordAdd (edgeCoord, JSM.VectorMultiply (body.GetVertex (edge.vert2).position, edgeVertexWeight));

			for (j = 0; j < 2; j++) {
				pgonIndex = (j === 0 ? edge.pgon1 : edge.pgon2);
				if (pgonIndex === -1) {
					pgonIndex = (j === 0 ? edge.pgon2 : edge.pgon1);
				}
				pgonCoord = result.GetVertex (pgonVertices[pgonIndex]).position;
				edgeCoord = JSM.CoordAdd (edgeCoord, JSM.VectorMultiply (pgonCoord, edgeVertexWeight));
			}

			edgeVertices.push (result.AddVertex (new JSM.BodyVertex (edgeCoord)));
		}
	};

	var MoveOriginalVertices = function ()
	{
		var MoveVertex = function (f, r, n, vertCoord)
		{
			vertCoord.x = (f.x + 2.0 * r.x + (n - 3) * vertCoord.x) / n;
			vertCoord.y = (f.y + 2.0 * r.y + (n - 3) * vertCoord.y) / n;
			vertCoord.z = (f.z + 2.0 * r.z + (n - 3) * vertCoord.z) / n;
		}
	
		var edgeMidCoords = [];
		
		var edge, edgeCoord;
		var i, j;
		for (i = 0; i < al.edges.length; i++) {
			edge = al.edges[i];
			edgeCoord = JSM.MidCoord (body.GetVertex (edge.vert1).position, body.GetVertex (edge.vert2).position);
			edgeMidCoords.push (edgeCoord);
		}
	
		var vert, vertCoord, currentVertCoord;
		var pgonVertexWeight, edgeMidCoordWeight;
		var f, r, n;
		for (i = 0; i < al.verts.length; i++) {
			vert = al.verts[i];
			f = new JSM.Coord (0.0, 0.0, 0.0);
			r = new JSM.Coord (0.0, 0.0, 0.0);
			
			pgonVertexWeight = 1.0 / vert.pgons.length;
			for (j = 0; j < vert.pgons.length; j++) {
				currentVertCoord = result.GetVertex (pgonVertices[vert.pgons[j]]).position;
				f = JSM.CoordAdd (f, JSM.VectorMultiply (currentVertCoord, pgonVertexWeight));
			}

			edgeMidCoordWeight = 1.0 / vert.edges.length;
			for (j = 0; j < vert.edges.length; j++) {
				edgeCoord = edgeMidCoords [vert.edges[j]];
				r = JSM.CoordAdd (r, JSM.VectorMultiply (edgeCoord, edgeMidCoordWeight));
			}

			n = vert.edges.length;
			vertCoord = result.GetVertex (i).position;
			MoveVertex (f, r, n, vertCoord);
		}
	};
	
	var AddNewPolygons = function ()
	{
		var edgeCount, currentEdge, nextEdge;
		var centroid, currentEdgeVertex, originalVertex, nextEdgeVertex;
		var polygon, oldPolygon;
		var i, j, pgon;
		for (i = 0; i < al.pgons.length; i++) {
			pgon = al.pgons[i];
			edgeCount = pgon.verts.length;
			for (j = 0; j < edgeCount; j++) {
				currentEdge = pgon.pedges[j];
				nextEdge = pgon.pedges[(j + 1) % edgeCount];

				centroid = pgonVertices[i];
				currentEdgeVertex = edgeVertices[currentEdge.index];
				originalVertex = JSM.GetPolyEdgeStartVertex (nextEdge, al);
				nextEdgeVertex = edgeVertices[nextEdge.index];
				
				polygon = new JSM.BodyPolygon ([centroid, currentEdgeVertex, originalVertex, nextEdgeVertex]);
				oldPolygon = body.GetPolygon (i);
				polygon.material = oldPolygon.material;
				polygon.curved = oldPolygon.curved;
				result.AddPolygon (polygon);
			}
		}
	};

	var result = new JSM.Body ();
	var al = JSM.CalculateAdjacencyList (body);

	AddOriginalVertices ();

	var pgonVertices = [];
	AddPolygonVertices ();
	
	var edgeVertices = [];
	AddEdgeVertices ();

	MoveOriginalVertices ();
	AddNewPolygons ();
	
	return result;
};

JSM.CatmullClarkSubdivision = function (body, iterations)
{
	var result = body;
	
	var i;
	for (i = 0; i < iterations; i++) {
		result = JSM.CatmullClarkSubdivisionOneIteration (result);
	}
	
	return result;
};
