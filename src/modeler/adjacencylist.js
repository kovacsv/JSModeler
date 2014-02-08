JSM.VertInfo = function ()
{
	this.edges = [];
	this.pgons = [];
};

JSM.EdgeInfo = function ()
{
	this.vert1 = -1;
	this.vert2 = -1;
	this.pgon1 = -1;
	this.pgon2 = -1;
};

JSM.PolyEdgeInfo = function ()
{
	this.index = -1;
	this.reverse = false;
};

JSM.PgonInfo = function ()
{
	this.verts = [];
	this.pedges = [];
};

JSM.AdjacencyInfo = function ()
{
	this.verts = [];
	this.edges = [];
	this.pgons = [];
};

JSM.GetPolyEdgeStartVertex = function (polyEdge, adjacencyInfo)
{
	if (!polyEdge.reverse) {
		return adjacencyInfo.edges[polyEdge.index].vert1;
	} else {
		return adjacencyInfo.edges[polyEdge.index].vert2;
	}
};

JSM.GetPolyEdgeEndVertex = function (polyEdge, adjacencyInfo)
{
	if (!polyEdge.reverse) {
		return adjacencyInfo.edges[polyEdge.index].vert2;
	} else {
		return adjacencyInfo.edges[polyEdge.index].vert1;
	}
};

JSM.IsSolidBody = function (body)
{
	var adjacencyInfo = JSM.CalculateAdjacencyInfo (body);
	var i, edge;
	for (i = 0; i < adjacencyInfo.edges.length; i++) {
		edge = adjacencyInfo.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
	}
	return true;
};

JSM.CheckSolidBody = function (body)
{
	var adjacencyInfo = JSM.CalculateAdjacencyInfo (body);
	var i, j, edge, pedge, found, pgon1, pgon2, pgon1Reverse, pgon2Reverse;
	for (i = 0; i < adjacencyInfo.edges.length; i++) {
		edge = adjacencyInfo.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
		
		pgon1 = adjacencyInfo.pgons[edge.pgon1];
		found = false;
		for (j = 0; j < pgon1.pedges.length; j++) {
			pedge = pgon1.pedges[j];
			if (pedge.index == i) {
				pgon1Reverse = pedge.reverse;
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}
		
		pgon2 = adjacencyInfo.pgons[edge.pgon2];
		found = false;
		for (j = 0; j < pgon2.pedges.length; j++) {
			pedge = pgon2.pedges[j];
			if (pedge.index == i) {
				pgon2Reverse = pedge.reverse;
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}
		
		if (pgon1Reverse == pgon2Reverse) {
			return false;
		}
	}
	return true;
};

JSM.CalculateAdjacencyInfo = function (body)
{
	function AddEdge (from, to, polygon)
	{
		var pedge = new JSM.PolyEdgeInfo ();
	
		var i, edge;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			if (edge.vert1 === from && edge.vert2 === to) {
				pedge.index = i;
				pedge.reverse = false;
			} else if (edge.vert1 === to && edge.vert2 === from) {
				pedge.index = i;
				pedge.reverse = true;
			}
		}

		if (pedge.index === -1) {
			var newEdge = new JSM.EdgeInfo ();
			newEdge.vert1 = from;
			newEdge.vert2 = to;
			newEdge.pgon1 = polygon;
			newEdge.pgon2 = -1;
			adjacencyInfo.edges.push (newEdge);
			
			pedge.index = adjacencyInfo.edges.length - 1;
			pedge.reverse = false;
		} else {
			var currEdge = adjacencyInfo.edges[pedge.index];
			if (currEdge.pgon1 === -1) {
				currEdge.pgon1 = polygon;
			} else if (currEdge.pgon1 !== polygon && currEdge.pgon2 === -1) {
				currEdge.pgon2 = polygon;
			}
		}
		
		return pedge;
	}

	var adjacencyInfo = new JSM.AdjacencyInfo ();
	
	var i, j;

	var vert, pgon;
	for (i = 0; i < body.VertexCount (); i++) {
		vert = new JSM.VertInfo ();
		adjacencyInfo.verts.push (vert);
	}	
	
	var polygon, count, curr, next, pedge;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		pgon = new JSM.PgonInfo ();
		
		count = polygon.VertexIndexCount ();
		for (j = 0; j < count; j++) {
			curr = polygon.GetVertexIndex (j);
			next = polygon.GetVertexIndex (j < count - 1 ? j + 1 : 0);

			pedge = AddEdge (curr, next, i);
			
			pgon.verts.push (curr);
			pgon.pedges.push (pedge);
			
			adjacencyInfo.verts[curr].edges.push (pedge.index);
			adjacencyInfo.verts[curr].pgons.push (i);
		}
		adjacencyInfo.pgons.push (pgon);
	}	
	
	return adjacencyInfo;
};
