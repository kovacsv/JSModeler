/**
* Function: ConvexHull2D
* Description: Calculates the 2D convex hull from the given coordinates.
* Parameters:
*	coords {Coord2D[*]} the coordinate array
* Returns:
*	{Coord2D[*]} coordinate array of the convex hull
*/
JSM.ConvexHull2D = function (coords)
{
	function FindLeftMostCoord (coords)
	{
		var count = coords.length;
		var minValue = JSM.Inf;
		var minIndex = -1;
	
		var i, current;
		for (i = 0; i < count; i++) {
			current = coords[i].x;
			if (JSM.IsLower (current, minValue)) {
				minValue = current;
				minIndex = i;
			}
		}
		
		return minIndex;
	}
	
	function FindNextCoord (coords, current)
	{
		var count = coords.length;
		var next = 0;
		
		var i;
		for (i = 1; i < count; i++) {
			if (current == next) {
				next = i;
			} else {
				if (JSM.CoordTurnType2D (coords[current], coords[next], coords[i]) == 'Clockwise') {
					next = i;
				}
			}
		}
		
		return next;
	}

	var result = [];
	var count = coords.length;
	if (count < 3) {
		return result;
	}
	
	var first = FindLeftMostCoord (coords);
	var current = first;
	var next;
	
	do {
		result.push (current);
		next = FindNextCoord (coords, current);
		current = next;
	} while (next != first);
	
	return result;
};

/**
* Function: ConvexHull3D
* Description:
*	Calculates the 3D convex hull from the given coordinates. The result defines
*	convex hull triangles as an array of arrays with three coordinates.
* Parameters:
*	coords {Coord[*]} the coordinate array
* Returns:
*	{Coord[3][*]} the result
*/
JSM.ConvexHull3D = function (coords)
{
	function Vertex ()
	{
		this.position = null;
	}
	
	function Edge ()
	{
		this.vert1 = null;
		this.vert2 = null;
		this.tri1 = null;
		this.tri2 = null;
	}

	function Triangle ()
	{
		this.vertices = null;
		this.edges = null;
		this.valid = null;
	}

	function Body ()
	{
		this.vertices = [];
		this.edges = [];
		this.triangles = [];
	}

	function AddVertex (body, coord)
	{
		var vertex = new Vertex ();
		vertex.position = coord;
		body.vertices.push (vertex);
		return body.vertices.length - 1;
	}

	function AddEdge (body, triangleIndex, a, b)
	{
		var edgeIndex = -1;
	
		var i, current;
		for (i = 0; i < body.edges.length; i++) {
			current = body.edges[i];
			if (current.vert1 == a && current.vert2 == b || current.vert1 == b && current.vert2 == a) {
				edgeIndex = i;
				break;
			}
		}
		
		if (edgeIndex == -1) {
			var newEdge = new Edge ();
			newEdge.vert1 = a;
			newEdge.vert2 = b;
			newEdge.tri1 = -1;
			newEdge.tri2 = -1;
			body.edges.push (newEdge);
			edgeIndex = body.edges.length - 1;
		}
		
		var edge = body.edges[edgeIndex];
		if (edge.tri1 != triangleIndex && edge.tri2 != triangleIndex) {
			if (edge.tri1 == -1) {
				edge.tri1 = triangleIndex;
			} else if (edge.tri2 == -1) {
				edge.tri2 = triangleIndex;
			}
		}
		
		return edgeIndex;
	}

	function AddTriangle (body, a, b, c)
	{
		var triangleIndex = body.triangles.length;
		var edge1 = AddEdge (body, triangleIndex, a, b);
		var edge2 = AddEdge (body, triangleIndex, b, c);
		var edge3 = AddEdge (body, triangleIndex, c, a);
		
		var triangle = new Triangle ();
		triangle.vertices = [a, b, c];
		triangle.edges = [edge1, edge2, edge3];
		triangle.valid = true;
		body.triangles.push (triangle);
		return body.triangles.length - 1;
	}

	function RemoveTriangleFromEdge (body, triangleIndex, edgeIndex)
	{
		var edge = body.edges[edgeIndex];
		if (edge.tri1 == triangleIndex) {
			edge.tri1 = -1;
		} else if (edge.tri2 == triangleIndex) {
			edge.tri2 = -1;
		}
	}

	function RemoveTriangle (body, triangleIndex)
	{
		var triangle = body.triangles[triangleIndex];
		if (!triangle.valid) {
			return;
		}
		
		RemoveTriangleFromEdge (body, triangleIndex, triangle.edges[0]);
		RemoveTriangleFromEdge (body, triangleIndex, triangle.edges[1]);
		RemoveTriangleFromEdge (body, triangleIndex, triangle.edges[2]);
		triangle.valid = false;
	}

	function GetTetrahedronVolume (body, a, b, c, d)
	{
		var aCoord = body.vertices[a].position;
		var bCoord = body.vertices[b].position;
		var cCoord = body.vertices[c].position;
		var dCoord = body.vertices[d].position;
		
		var adSub = JSM.CoordSub (aCoord, dCoord);
		var bdSub = JSM.CoordSub (bCoord, dCoord);
		var cdSub = JSM.CoordSub (cCoord, dCoord);
		
		return (JSM.VectorDot (adSub, JSM.VectorCross (bdSub, cdSub))) / 6.0;
	}
	
	function CheckTetrahedronOrientation (body, a, b, c, d)
	{
		if (JSM.IsLower (GetTetrahedronVolume (body, a, b, c, d), 0.0)) {
			return false;
		}
		return true;
	}
	
	function AddInitialTetrahedron (body)
	{
		var triangleIndex = -1;
		if (CheckTetrahedronOrientation (body, 0, 1, 2, 3)) {
			triangleIndex = AddTriangle (body, 0, 1, 2);
		} else {
			triangleIndex = AddTriangle (body, 0, 2, 1);
		}

		var triangle = body.triangles[triangleIndex];
		AddTriangle (body, triangle.vertices[0], triangle.vertices[2], 3);
		AddTriangle (body, triangle.vertices[2], triangle.vertices[1], 3);
		AddTriangle (body, triangle.vertices[1], triangle.vertices[0], 3);
	}

	function AddCoordToHull (body, index)
	{
		var visibleTriangles = [];
		
		var i, triangle;
		for (i = 0; i < body.triangles.length; i++) {
			triangle = body.triangles[i];
			if (!triangle.valid) {
				visibleTriangles.push (false);
				continue;
			}

			if (CheckTetrahedronOrientation (body, triangle.vertices[0], triangle.vertices[2], triangle.vertices[1], index)) {
				visibleTriangles.push (true);
			} else {
				visibleTriangles.push (false);
			}
		}
		
		var edge1, edge2, edge3, edge1Vis, edge2Vis, edge3Vis;
		var newTriangles = [];
		for (i = 0; i < visibleTriangles.length; i++) {
			if (!visibleTriangles[i]) {
				continue;
			}

			triangle = body.triangles[i];
			if (!triangle.valid) {
				continue;
			}
			
			edge1 = body.edges[triangle.edges[0]];
			edge2 = body.edges[triangle.edges[1]];
			edge3 = body.edges[triangle.edges[2]];

			edge1Vis = (edge1.tri1 == -1 || edge1.tri2 == -1 || visibleTriangles[edge1.tri1] != visibleTriangles[edge1.tri2]);
			edge2Vis = (edge2.tri1 == -1 || edge2.tri2 == -1 || visibleTriangles[edge2.tri1] != visibleTriangles[edge2.tri2]);
			edge3Vis = (edge3.tri1 == -1 || edge3.tri2 == -1 || visibleTriangles[edge3.tri1] != visibleTriangles[edge3.tri2]);
			
			if (edge1Vis) {
				newTriangles.push ([triangle.vertices[0], triangle.vertices[1], index]);
			}
			
			if (edge2Vis) {
				newTriangles.push ([triangle.vertices[1], triangle.vertices[2], index]);
			}
			
			if (edge3Vis) {
				newTriangles.push ([triangle.vertices[2], triangle.vertices[0], index]);
			}
		}

		for (i = 0; i < visibleTriangles.length; i++) {
			if (!visibleTriangles[i]) {
				continue;
			}
			
			triangle = body.triangles[i];
			if (!triangle.valid) {
				continue;
			}
			
			RemoveTriangle (body, i);
		}
		
		var newTriangle;
		for (i = 0; i < newTriangles.length; i++) {
			newTriangle = newTriangles[i];
			AddTriangle (body, newTriangle[0], newTriangle[1], newTriangle[2]);
		}
	}
	
	var result = [];
	var count = coords.length;
	if (count < 4) {
		return result;
	}

	var body = new Body ();
	
	var i;
	for (i = 0; i < count; i++) {
		AddVertex (body, coords[i]);
	}
	
	AddInitialTetrahedron (body);
	for (i = 4; i < count; i++) {
		AddCoordToHull (body, i);
	}
	
	var triangle;
	for (i = 0; i < body.triangles.length; i++) {
		triangle = body.triangles[i];
		if (triangle.valid) {
			result.push (triangle.vertices);
		}
	}
	return result;
};
