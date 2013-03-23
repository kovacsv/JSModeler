JSM.Vert = function ()
{
	this.edges = [];
	this.pgons = [];
};

JSM.Edge = function ()
{
	this.vert1 = -1;
	this.vert2 = -1;
	this.pgon1 = -1;
	this.pgon2 = -1;
};

JSM.PolyEdge = function ()
{
	this.index = -1;
	this.reverse = false;
};

JSM.Pgon = function ()
{
	this.verts = [];
	this.pedges = [];
};

JSM.AdjacencyList = function ()
{
	this.verts = [];
	this.edges = [];
	this.pgons = [];
};

JSM.GetPolyEdgeStartVertex = function (polyEdge, adjacencyList)
{
	if (!polyEdge.reverse) {
		return adjacencyList.edges[polyEdge.index].vert1;
	} else {
		return adjacencyList.edges[polyEdge.index].vert2;
	}
};

JSM.GetPolyEdgeEndVertex = function (polyEdge, adjacencyList)
{
	if (!polyEdge.reverse) {
		return adjacencyList.edges[polyEdge.index].vert2;
	} else {
		return adjacencyList.edges[polyEdge.index].vert1;
	}
};

JSM.IsSolidBody = function (body)
{
	var adjacencyList = JSM.CalculateAdjacencyList (body);
	var i, edge;
	for (i = 0; i < adjacencyList.edges.length; i++) {
		edge = adjacencyList.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
	}
	return true;
};

JSM.CheckSolidBody = function (body)
{
	var adjacencyList = JSM.CalculateAdjacencyList (body);
	var i, j, edge, pedge, found, pgon1, pgon2, pgon1Reverse, pgon2Reverse;
	for (i = 0; i < adjacencyList.edges.length; i++) {
		edge = adjacencyList.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
		
		pgon1 = adjacencyList.pgons[edge.pgon1];
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
		
		pgon2 = adjacencyList.pgons[edge.pgon2];
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

JSM.CalculateAdjacencyList = function (body)
{
	var AddEdge = function (from, to, polygon)
	{
		var pedge = new JSM.PolyEdge ();
	
		var i, edge;
		for (i = 0; i < adjacencyList.edges.length; i++) {
			edge = adjacencyList.edges[i];
			if (edge.vert1 === from && edge.vert2 === to) {
				pedge.index = i;
				pedge.reverse = false;
			} else if (edge.vert1 === to && edge.vert2 === from) {
				pedge.index = i;
				pedge.reverse = true;
			}
		}

		if (pedge.index === -1) {
			var newEdge = new JSM.Edge ();
			newEdge.vert1 = from;
			newEdge.vert2 = to;
			newEdge.pgon1 = polygon;
			newEdge.pgon2 = -1;
			adjacencyList.edges.push (newEdge);
			
			pedge.index = adjacencyList.edges.length - 1;
			pedge.reverse = false;
		} else {
			var currEdge = adjacencyList.edges[pedge.index];
			if (currEdge.pgon1 === -1) {
				currEdge.pgon1 = polygon;
			} else if (currEdge.pgon1 !== polygon && currEdge.pgon2 === -1) {
				currEdge.pgon2 = polygon;
			}
		}
		
		return pedge;
	};

	var adjacencyList = new JSM.AdjacencyList ();
	
	var i, j;

	var vert, pgon;
	for (i = 0; i < body.VertexCount (); i++) {
		vert = new JSM.Vert ();
		adjacencyList.verts.push (vert);
	}	
	
	var polygon, count, curr, next, pedge;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		pgon = new JSM.Pgon ();
		
		count = polygon.VertexIndexCount ();
		for (j = 0; j < count; j++) {
			curr = polygon.GetVertexIndex (j);
			next = polygon.GetVertexIndex (j < count - 1 ? j + 1 : 0);

			pedge = AddEdge (curr, next, i);
			
			pgon.verts.push (curr);
			pgon.pedges.push (pedge);
			
			adjacencyList.verts[curr].edges.push (pedge.index);
			adjacencyList.verts[curr].pgons.push (i);
		}
		adjacencyList.pgons.push (pgon);
	}	
	
	return adjacencyList;
};
