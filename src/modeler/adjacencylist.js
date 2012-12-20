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
