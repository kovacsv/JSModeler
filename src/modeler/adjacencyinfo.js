/**
* Class: VertInfo
* Description:
*	Contains adjacency information for a body vertex. Contains arrays
*	with indices of connected edge and polygon info.
*/
JSM.VertInfo = function ()
{
	this.edges = [];
	this.pgons = [];
};

/**
* Class: EdgeInfo
* Description:
*	Contains adjacency information for a body edge. Contains indices
*	of connected vertex and polygon info.
*/
JSM.EdgeInfo = function ()
{
	this.vert1 = -1;
	this.vert2 = -1;
	this.pgon1 = -1;
	this.pgon2 = -1;
};

/**
* Class: PolyEdgeInfo
* Description:
*	Contains adjacency information for a body polygon edge. Contains an index
*	of an existing edge, and a flag which defines its direction.
*/
JSM.PolyEdgeInfo = function ()
{
	this.index = -1;
	this.reverse = false;
};

/**
* Class: PgonInfo
* Description:
*	Contains adjacency information for a body polygon. Contains arrays
*	with indices of connected vertex and poly edge info.
*/
JSM.PgonInfo = function ()
{
	this.verts = [];
	this.pedges = [];
};

/**
* Class: AdjacencyInfo
* Description:
*	Contains adjacency information for a body. Contains arrays
*	with vertex, edge and polygon info.
* Parameters:
*	body {Body} the body
*/
JSM.AdjacencyInfo = function (body)
{
	this.verts = null;
	this.edges = null;
	this.pgons = null;
	this.Calculate (body);
};

/**
* Function: AdjacencyInfo.Reset
* Description: Calculates the adjacency information for a body.
* Returns:
*	body {Body} the body
*/
JSM.AdjacencyInfo.prototype.Calculate = function (body)
{
	function AddVertex (adjacencyInfo)
	{
		var vert = new JSM.VertInfo ();
		adjacencyInfo.verts.push (vert);
	}
	
	function AddPolygon (adjacencyInfo, body, polygonIndex)
	{
		function AddEdge (adjacencyInfo, pgonInfo, fromVertexIndex, toVertexIndex, polygonIndex)
		{
			function ConnectEdge (adjacencyInfo, polygonIndex, fromVertexIndex, toVertexIndex, pedge, pgon)
			{
				function ConnectPgonAndEdgeToVert (vert, pgonIndex, edgeIndex)
				{
					if (vert.edges.indexOf (edgeIndex) == -1) {
						vert.edges.push (edgeIndex);
					}
					if (vert.pgons.indexOf (pgonIndex) == -1) {
						vert.pgons.push (pgonIndex);
					}
				}
				
				pgon.verts.push (fromVertexIndex);
				pgon.pedges.push (pedge);
				ConnectPgonAndEdgeToVert (adjacencyInfo.verts[fromVertexIndex], polygonIndex, pedge.index);
				ConnectPgonAndEdgeToVert (adjacencyInfo.verts[toVertexIndex], polygonIndex, pedge.index);
			}
			
			var pedge = new JSM.PolyEdgeInfo ();
		
			var i, edge;
			for (i = 0; i < adjacencyInfo.edges.length; i++) {
				edge = adjacencyInfo.edges[i];
				if (edge.vert1 === fromVertexIndex && edge.vert2 === toVertexIndex) {
					pedge.index = i;
					pedge.reverse = false;
				} else if (edge.vert1 === toVertexIndex && edge.vert2 === fromVertexIndex) {
					pedge.index = i;
					pedge.reverse = true;
				}
			}

			if (pedge.index === -1) {
				var newEdge = new JSM.EdgeInfo ();
				newEdge.vert1 = fromVertexIndex;
				newEdge.vert2 = toVertexIndex;
				newEdge.pgon1 = polygonIndex;
				newEdge.pgon2 = -1;
				adjacencyInfo.edges.push (newEdge);
				
				pedge.index = adjacencyInfo.edges.length - 1;
				pedge.reverse = false;
			} else {
				var currEdge = adjacencyInfo.edges[pedge.index];
				if (currEdge.pgon1 === -1) {
					currEdge.pgon1 = polygonIndex;
				} else if (currEdge.pgon1 !== polygonIndex && currEdge.pgon2 === -1) {
					currEdge.pgon2 = polygonIndex;
				}
			}
			
			ConnectEdge (adjacencyInfo, polygonIndex, fromVertexIndex, toVertexIndex, pedge, pgon);
		}

		var polygon = body.GetPolygon (polygonIndex);
		var pgon = new JSM.PgonInfo ();
		
		var i, curr, next;
		var count = polygon.VertexIndexCount ();
		for (i = 0; i < count; i++) {
			curr = polygon.GetVertexIndex (i);
			next = polygon.GetVertexIndex (i < count - 1 ? i + 1 : 0);
			AddEdge (adjacencyInfo, pgon, curr, next, polygonIndex);
		}
		adjacencyInfo.pgons.push (pgon);
	}

	this.verts = [];
	this.edges = [];
	this.pgons = [];	
	
	var i;
	for (i = 0; i < body.VertexCount (); i++) {
		AddVertex (this);
	}
	
	for (i = 0; i < body.PolygonCount (); i++) {
		AddPolygon (this, body, i);
	}
};

/**
* Function: AdjacencyInfo.IsContourVertex
* Description: Returns if the vertex has contour edge.
* Parameters:
*	vert {VertInfo} the vertex info
* Returns:
*	{boolean} the result
*/
JSM.AdjacencyInfo.prototype.IsContourVertex = function (vert)
{
	var i, edge;
	for (i = 0; i < vert.edges.length; i++) {
		edge = vert.edges[i];
		if (this.IsContourEdge (this.edges[edge])) {
			return true;
		}
	}
	return false;
};

/**
* Function: AdjacencyInfo.IsContourEdge
* Description: Returns if the edge has only one polygon neighbour.
* Parameters:
*	edge {EdgeInfo} the edge info
* Returns:
*	{boolean} the result
*/
JSM.AdjacencyInfo.prototype.IsContourEdge = function (edge)
{
	var pgonCount = this.GetEdgePolygonCount (edge);
	return pgonCount == 1;
};

/**
* Function: AdjacencyInfo.GetEdgePolygonCount
* Description: Returns the neighbour polygon count of the edge.
* Parameters:
*	edge {EdgeInfo} the edge info
* Returns:
*	{integer} the result
*/
JSM.AdjacencyInfo.prototype.GetEdgePolygonCount = function (edge)
{
	var pgonCount = 0;
	if (edge.pgon1 != -1) {
		pgonCount += 1;
	}
	if (edge.pgon2 != -1) {
		pgonCount += 2;
	}
	return pgonCount;
};

/**
* Function: AdjacencyInfo.GetAnotherPgonOfEdge
* Description: Returns the polygon index which is next to the given polygon along an edge.
* Parameters:
*	edge {EdgeInfo} the edge info
*	currentPgon {integer} the polygon index
* Returns:
*	{integer} the result
*/
JSM.AdjacencyInfo.prototype.GetAnotherPgonOfEdge = function (edge, pgon)
{
	if (edge.pgon1 != -1 && edge.pgon1 != pgon) {
		return edge.pgon1;
	} else if (edge.pgon2 != -1 && edge.pgon2 != pgon) {
		return edge.pgon2;
	}
	return -1;
};

/**
* Function: AdjacencyInfo.GetPolyEdgeStartVertex
* Description: Returns the start vertex index of a polygon edge.
* Parameters:
*	polyEdge {PolyEdgeInfo} the polygon edge info
* Returns:
*	{integer} the result
*/
JSM.AdjacencyInfo.prototype.GetPolyEdgeStartVertex = function (polyEdge)
{
	if (!polyEdge.reverse) {
		return this.edges[polyEdge.index].vert1;
	} else {
		return this.edges[polyEdge.index].vert2;
	}
};

/**
* Function: AdjacencyInfo.GetPolyEdgeEndVertex
* Description: Returns the end vertex index of a polygon edge.
* Parameters:
*	polyEdge {PolyEdgeInfo} the polygon edge info
* Returns:
*	{integer} the result
*/
JSM.AdjacencyInfo.prototype.GetPolyEdgeEndVertex = function (polyEdge)
{
	if (!polyEdge.reverse) {
		return this.edges[polyEdge.index].vert2;
	} else {
		return this.edges[polyEdge.index].vert1;
	}
};

/**
* Function: CalculateBodyVertexToPolygon
* Description:
*	Calculates an array which contains array of the connected polygon
*	indices for all vertex indices in the body. The result is an
*	array of array of polygon indices.
* Parameters:
*	body {Body} the body
* Returns:
*	{integer[*][*]} the result
*/
JSM.CalculateBodyVertexToPolygon = function (body)
{
	var result = [];
	
	var i, j;
	for (i = 0; i < body.VertexCount (); i++) {
		result.push ([]);
	}
	
	var polygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			result[polygon.GetVertexIndex (j)].push (i);
		}
	}
	
	return result;
};

/**
* Function: IsSolidBody
* Description:
*	Returns if a given body is solid. It means that every
*	edges of the body has two polygon neighbours.
* Parameters:
*	body {Body} the body
* Returns:
*	{boolean} the result
*/
JSM.IsSolidBody = function (body)
{
	var adjacencyInfo = new JSM.AdjacencyInfo (body);
	var i, edge;
	for (i = 0; i < adjacencyInfo.edges.length; i++) {
		edge = adjacencyInfo.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
	}
	return true;
};

/**
* Function: CheckSolidBody
* Description:
*	Returns if a given body solid body is correct. It means that every
*	edges of the body has two polygon neighbours, and there are no edge
*	in the body which appears twice with the same direction.
* Parameters:
*	body {Body} the body
* Returns:
*	{boolean} the result
*/
JSM.CheckSolidBody = function (body)
{
	var adjacencyInfo = new JSM.AdjacencyInfo (body);
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

/**
* Function: TraversePgonsAlongEdges
* Description:
*	Traverses polygons along edges. The given callback function called on every
*	found polygon. The return value of the callback means if the traverse should
*	continue along the edges of the current polygon.
* Parameters:
*	pgonIndex {integer} the polygon index to start from
*	adjacencyInfo {AdjacencyInfo} the adjacency info
*	onPgonFound {function} the callback
* Returns:
*	{boolean} the result
*/
JSM.TraversePgonsAlongEdges = function (pgonIndex, adjacencyInfo, onPgonFound)
{
	function AddNeighboursToStack (pgonIndex, adjacencyInfo, pgonStack)
	{
		var pgon = adjacencyInfo.pgons[pgonIndex];
		var i, edge, anotherPgon;
		for (i = 0; i < pgon.pedges.length; i++) {
			edge = adjacencyInfo.edges[pgon.pedges[i].index];
			anotherPgon = adjacencyInfo.GetAnotherPgonOfEdge (edge, pgonIndex);
			if (anotherPgon != -1) {
				pgonStack.push (anotherPgon);
			}
		}
	}

	var pgonIsProcessed = {};
	var pgonStack = [pgonIndex];
	var currentPgonIndex;
	while (pgonStack.length > 0) {
		currentPgonIndex = pgonStack.pop ();
		if (pgonIsProcessed[currentPgonIndex]) {
			continue;
		}
		
		pgonIsProcessed[currentPgonIndex] = true;
		if (onPgonFound (currentPgonIndex)) {
			AddNeighboursToStack (currentPgonIndex, adjacencyInfo, pgonStack);
		}
	}
};
