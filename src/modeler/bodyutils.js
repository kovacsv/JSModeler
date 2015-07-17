/**
* Function: AddVertexToBody
* Description: Adds a vertex to an existing body.
* Parameters:
*	body {Body} the body
*	x {number} the x coordinate of the vertex
*	y {number} the y coordinate of the vertex
*	z {number} the z coordinate of the vertex
*/
JSM.AddVertexToBody = function (body, x, y, z)
{
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
};

/**
* Function: AddPolygonToBody
* Description: Adds a polygon to an existing body.
* Parameters:
*	body {Body} the body
*	vertices {integer[*]} array of vertex indices stored in the body
*/
JSM.AddPolygonToBody = function (body, vertices)
{
	body.AddPolygon (new JSM.BodyPolygon (vertices));
};

/**
* Function: CalculateBodyPolygonNormal
* Description: Calculates a normal vector for a polygon stored in the body.
* Parameters:
*	body {Body} the body
*	index {integer} the polygon index
* Returns:
*	{Vector} the result
*/
JSM.CalculateBodyPolygonNormal = function (body, index)
{
	var polygon = body.GetPolygon (index);
	var count = polygon.VertexIndexCount ();

	var normal = new JSM.Vector (0.0, 0.0, 0.0);
	if (count >= 3) {
		var i, currentIndex, nextIndex, current, next;
		for (i = 0; i < count; i++) {
			currentIndex = i;
			nextIndex = (i + 1) % count;
	
			current = body.GetVertexPosition (polygon.GetVertexIndex (currentIndex));
			next = body.GetVertexPosition (polygon.GetVertexIndex (nextIndex));
	
			normal.x += (current.y - next.y) * (current.z + next.z);
			normal.y += (current.z - next.z) * (current.x + next.x);
			normal.z += (current.x - next.x) * (current.y + next.y);
		}
	}

	normal.Normalize ();
	return normal;
};

/**
* Function: CalculateBodyPolygonNormals
* Description: Calculates polygon normal vectors for all polygons stored in the body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Vector[*]} the result
*/
JSM.CalculateBodyPolygonNormals = function (body)
{
	var result = [];
	
	var i;
	for (i = 0; i < body.PolygonCount (); i++) {
		result.push (JSM.CalculateBodyPolygonNormal (body, i));
	}
	
	return result;
};

/**
* Function: CalculateBodyVertexNormals
* Description:
*	Calculates vertex normal vectors for all vertices stored in the body.
*	The result is an array of array with vertex normal vectors.
* Parameters:
*	body {Body} the body
* Returns:
*	{Vector[*][*]} the result
*/
JSM.CalculateBodyVertexNormals = function (body)
{
	var result = [];
	var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	var vertexToPolygon = null;
	
	var i, j, k, polygon, normal;
	var average, count, neighbourPolygons, neighbourPolygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		result[i] = [];

		if (polygon.HasCurveGroup ()) {
			if (vertexToPolygon === null) {
				vertexToPolygon = JSM.CalculateBodyVertexToPolygon (body);
			}
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				average = new JSM.Vector (0.0, 0.0, 0.0);
				count = 0;
				
				neighbourPolygons = vertexToPolygon[polygon.GetVertexIndex (j)];
				for (k = 0; k < neighbourPolygons.length; k++) {
					neighbourPolygon = body.GetPolygon (neighbourPolygons[k]);
					if (neighbourPolygon.GetCurveGroup () === polygon.GetCurveGroup ()) {
						average = JSM.CoordAdd (average, polygonNormals[neighbourPolygons[k]]);
						count++;
					}
				}
				
				average.MultiplyScalar (1.0 / count);
				average.Normalize ();
				result[i].push (average);
			}
		} else {
			normal = polygonNormals[i];
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				result[i].push (new JSM.Vector (normal.x, normal.y, normal.z));
			}
		}
	}
	
	return result;
};

/**
* Function: MakeBodyInsideOut
* Description: Reverses all polygons orientation in the body.
* Parameters:
*	body {Body} the body
*/
JSM.MakeBodyInsideOut = function (body)
{
	var i, j, polygon, count, vertices;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		vertices = polygon.vertices.slice (0);
		count = vertices.length;
		polygon.vertices = [];
		for (j = 0; j < count; j++) {
			polygon.vertices.push (vertices[count - j - 1]);
		}
	}
};

/**
* Function: SoftMoveBodyVertex
* Description: Moves a vertex and its nearby vertices depending on gaussian function.
* Parameters:
*	body {Body} the body
*	index {integer} the vertex index to move
*	radius {number} the radius of the movement
*	direction {Vector} the direction of the movement
*	distance {number} the distance of the movement
*/
JSM.SoftMoveBodyVertex = function (body, index, radius, direction, distance)
{
	var referenceCoord = body.GetVertexPosition (index).Clone ();

	var eps = 0.00001;
	var a = distance;
	var b = 0.0;
	var c = JSM.GetGaussianCParameter (radius, a, b, eps);

	var i, currentDistance, newDistance;
	for (i = 0; i < body.VertexCount (); i++) {
		currentDistance = referenceCoord.DistanceTo (body.GetVertex (i).position);
		if (JSM.IsGreater (currentDistance, radius)) {
			continue;
		}

		newDistance = JSM.GetGaussianValue (currentDistance, distance, b, c);
		body.GetVertexPosition (i).Offset (direction, newDistance);
	}
};

/**
* Function: CalculatePolygonCentroid
* Description: Calculates the centroid of a polygon stored in the body.
* Parameters:
*	body {Body} the body
*	index {integer} the polygon index
* Returns:
*	{Coord} the result
*/
JSM.CalculatePolygonCentroid = function (body, index)
{
	var polygon = body.GetPolygon (index);
	var count = polygon.VertexIndexCount ();
	
	var result = new JSM.Coord (0.0, 0.0, 0.0);
	var i;
	for (i = 0; i < count; i++) {
		result = JSM.CoordAdd (result, body.GetVertexPosition (polygon.GetVertexIndex (i)));
	}
	
	result.MultiplyScalar (1.0 / count);
	return result;
};

/**
* Function: TriangulateWithCentroids
* Description:
*	Triangulates all polygons of the body by connecting all polygon
*	vertices with the centroid vertex of the polygon.
* Parameters:
*	body {Body} the body
* Returns:
*	{Body} the result
*/
JSM.TriangulateWithCentroids = function (body)
{
	var result = new JSM.Body ();
	
	var i, j, vertCoord;
	for (i = 0; i < body.VertexCount (); i++) {
		vertCoord = body.GetVertex (i).position;
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertCoord.x, vertCoord.y, vertCoord.z)));
	}

	var polygon, oldPolygon, vertexCount, curr, next, centroid;
	for (i = 0; i < body.PolygonCount (); i++) {
		vertCoord = JSM.CalculatePolygonCentroid (body, i);
		centroid = result.VertexCount ();
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (vertCoord.x, vertCoord.y, vertCoord.z)));
		
		oldPolygon = body.GetPolygon (i);
		vertexCount = oldPolygon.VertexIndexCount ();
		for (j = 0; j < vertexCount; j++) {
			curr = oldPolygon.GetVertexIndex (j);
			next = oldPolygon.GetVertexIndex (j < vertexCount - 1 ? j + 1 : 0);
			polygon = new JSM.BodyPolygon ([curr, next, centroid]);
			polygon.material = oldPolygon.material;
			polygon.curved = oldPolygon.curved;
			result.AddPolygon (polygon);
		}
	}
	
	return result;
};

/**
* Function: TriangulateWithCentroids
* Description: Triangulates all polygons of the body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Body} the result
*/
JSM.TriangulatePolygons = function (body)
{
	var result = new JSM.Body ();
	
	var i, j, coord;
	for (i = 0; i < body.VertexCount (); i++) {
		coord = body.GetVertexPosition (i);
		result.AddVertex (new JSM.BodyVertex (new JSM.Coord (coord.x, coord.y, coord.z)));
	}

	var polygon, bodyPolygon, triangleIndices, triangle, bodyTriangle;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = new JSM.Polygon ();
		bodyPolygon = body.GetPolygon (i);
		for (j = 0; j < bodyPolygon.VertexIndexCount (); j++) {
			coord = body.GetVertexPosition (bodyPolygon.GetVertexIndex (j));
			polygon.AddVertex (coord.x, coord.y, coord.z);
		}
		triangleIndices = JSM.PolygonTriangulate (polygon);
		for (j = 0; j < triangleIndices.length; j++) {
			triangle = triangleIndices[j];
			bodyTriangle = new JSM.BodyPolygon ([
				bodyPolygon.GetVertexIndex (triangle[0]),
				bodyPolygon.GetVertexIndex (triangle[1]),
				bodyPolygon.GetVertexIndex (triangle[2])
			]);
			bodyTriangle.InheritAttributes (bodyPolygon);
			result.AddPolygon (bodyTriangle);
		}
	}
	
	return result;
};

/**
* Function: GenerateRandomMaterials
* Description: Generates random materials for a body. A seed number can be specified.
* Parameters:
*	body {Body} the body
*	materials {Materials} the materials
*	seeded {boolean} seeded random generation
*/
JSM.GenerateRandomMaterials = function (body, materials, seeded)
{
	var minColor = 0;
	var maxColor = 16777215;
	var i, color, material;
	for (i = 0; i < body.PolygonCount (); i++) {
		if (seeded !== undefined && seeded) {
			color = JSM.SeededRandomInt (minColor, maxColor, i + 1);
		} else {
			color = JSM.RandomInt (minColor, maxColor);
		}
		material = materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
		body.GetPolygon (i).SetMaterialIndex (material);
	}
};

/**
* Function: AddBodyToBSPTree
* Description: Adds a body to a BSP tree.
* Parameters:
*	body {Body} the body
*	bspTree {BSPTree} the BSP tree
*	id {anything} the id for added polygons
*/
JSM.AddBodyToBSPTree = function (body, bspTree, id)
{
	function ConvertBodyPolygonToPolygon (body, index, userData)
	{
		var polygon = body.GetPolygon (index);
		userData.material = polygon.GetMaterialIndex ();
		var result = new JSM.Polygon ();
		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result.AddVertex (coord.x, coord.y, coord.z);
		}
		return result;
	}

	var i, polygon, userData;
	for (i = 0; i < body.PolygonCount (); i++) {
		userData = {
			id : id,
			originalPolygon : i,
			material : -1
		};
		polygon = ConvertBodyPolygonToPolygon (body, i, userData);
		bspTree.AddPolygon (polygon, userData);
	}
};

/**
* Function: MergeCoplanarPolygons
* Description: Merges the coplanar polygons of a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Body} the result
*/
JSM.MergeCoplanarPolygons = function (body)
{
	function FindCoplanarPgonGroups (body, adjacency)
	{
		function GetCoplanarPgons (pgonIndex, adjacency, pgonNormals, processedPgons)
		{
			if (processedPgons[pgonIndex]) {
				return null;
			}
			var coplanarPgons = [];
			var angle;
			JSM.TraversePgonsAlongEdges (pgonIndex, adjacency, function (currentIndex) {
				angle = pgonNormals[pgonIndex].AngleTo (pgonNormals[currentIndex]);
				if (JSM.IsEqual (angle, 0.0)) {
					coplanarPgons.push (currentIndex);
					processedPgons[currentIndex] = true;
					return true;
				}
				return false;
			});
			return coplanarPgons;
		}
	
		var pgonNormals = JSM.CalculateBodyPolygonNormals (body);
		var coplanarPgonGroups = [];
		var processedPgons = {};
		
		var i;
		for (i = 0; i < adjacency.pgons.length; i++) {
			coplanarPgons = GetCoplanarPgons (i, adjacency, pgonNormals, processedPgons);
			if (coplanarPgons === null) {
				continue;
			}
			coplanarPgonGroups.push (coplanarPgons);
		}
		
		return coplanarPgonGroups;
	}
	
	function CreatePolygonsFromGroup (body, adjacency, coplanarPgons, oldToNewVertices, result)
	{
		function GetContourEdges (coplanarPgons, adjacency, contourEdges)
		{
			var i, j;
			var groupPgons = {};
			for (i = 0; i < coplanarPgons.length; i++) {
				groupPgons[coplanarPgons[i]] = true;
			}

			var startVertex = -1;
			var pgon, pedge, edge, from, to;
			for (i = 0; i < coplanarPgons.length; i++) {
				pgon = adjacency.pgons[coplanarPgons[i]];
				for (j = 0; j < pgon.pedges.length; j++) {
					pedge = pgon.pedges[j];
					edge = adjacency.edges[pedge.index];
					if (!groupPgons[edge.pgon1] || !groupPgons[edge.pgon2]) {
						if (!pedge.reverse) {
							from = edge.vert1;
							to = edge.vert2;
						} else {
							from = edge.vert2;
							to = edge.vert1;
						}
						contourEdges[from] = to;
						if (startVertex == -1) {
							startVertex = from;
						}
					}
				}
			}
			return startVertex;
		}
	
		function AddPolygon (body, result, oldVertices, oldToNewVertices)
		{
			var newVertices = [];
			var i, oldIndex, newIndex, oldCoord;
			for (i = 0; i < oldVertices.length; i++) {
				oldIndex = oldVertices[i];
				newIndex = oldToNewVertices[oldIndex];
				if (newIndex === undefined) {
					oldCoord = body.GetVertexPosition (oldIndex);
					newIndex = result.AddVertex (new JSM.BodyVertex (oldCoord.Clone ()));
					oldToNewVertices[oldIndex] = newIndex;
				}
				newVertices.push (newIndex);
			}
			result.AddPolygon (new JSM.BodyPolygon (newVertices));
		}
	
		if (coplanarPgons.length === 0) {
			return;
		}
		
		var oldVertices = [];
		if (coplanarPgons.length == 1) {
			oldVertices = body.GetPolygon (coplanarPgons[0]).GetVertexIndices ();
		} else {
			var contourEdges = [];
			var startVertex = GetContourEdges (coplanarPgons, adjacency, contourEdges);
			if (startVertex == -1) {
				return;
			}

			var currentVertex = startVertex;
			do {
				if (currentVertex === undefined) {
					break;
				}
				oldVertices.push (currentVertex);
				currentVertex = contourEdges[currentVertex];
			} while (currentVertex != startVertex);
		}
		
		AddPolygon (body, result, oldVertices, oldToNewVertices);
	}

	var result = new JSM.Body ();
	var adjacency = JSM.CalculateAdjacencyInfo (body);
	var coplanarPgonGroups = FindCoplanarPgonGroups (body, adjacency);
	var oldToNewVertices = {};
	var i, coplanarPgons;
	for (i = 0; i < coplanarPgonGroups.length; i++) {
		coplanarPgons = coplanarPgonGroups[i];
		CreatePolygonsFromGroup (body, adjacency, coplanarPgons, oldToNewVertices, result);
	}

	return result;
};
