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
	return body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
};

/**
* Function: AddPointToBody
* Description: Adds a point to an existing body.
* Parameters:
*	body {Body} the body
*	vertex {integer} the vertex index stored in the body
*/
JSM.AddPointToBody = function (body, vertex)
{
	return body.AddPoint (new JSM.BodyPoint (vertex));
};

/**
* Function: AddLineToBody
* Description: Adds a line to an existing body.
* Parameters:
*	body {Body} the body
*	beg {integer} begin vertex index stored in the body
*	end {integer} end vertex index stored in the body
*/
JSM.AddLineToBody = function (body, beg, end)
{
	return body.AddLine (new JSM.BodyLine (beg, end));
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
	return body.AddPolygon (new JSM.BodyPolygon (vertices));
};

/**
* Function: CheckBody
* Description:
*	Checks if the body is correct. It means that every polygon has at least three
*	vertices, and every point, line and polygon vertex index is valid.
* Parameters:
*	body {Body} the body
* Returns:
*	{boolean} the result
*/
JSM.CheckBody = function (body)
{
	var vertexCount = body.VertexCount ();
	var i, j, point, line, polygon;
	for (i = 0; i < body.PointCount (); i++) {
		point = body.GetPoint (i);
		if (point.GetVertexIndex () < 0 || point.GetVertexIndex () >= vertexCount) {
			return false;
		}
	}
	for (i = 0; i < body.LineCount (); i++) {
		line = body.GetLine (i);
		if (line.GetBegVertexIndex () < 0 || line.GetBegVertexIndex () >= vertexCount) {
			return false;
		}
		if (line.GetEndVertexIndex () < 0 || line.GetEndVertexIndex () >= vertexCount) {
			return false;
		}
	}
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		if (polygon.VertexIndexCount () < 3) {
			return false;
		}
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			if (polygon.GetVertexIndex (j) < 0 || polygon.GetVertexIndex (j) >= vertexCount) {
				return false;
			}
		}
	}
	return true;
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
* Function: CalculatePolygonCurveGroups
* Description: Calculates the curve groups for a given polygon.
* Parameters:
*	polygon {Polygon} the polygon
*	curveAngle {number} the curve angle
* Returns:
*	{integer[*]} the curve groups
*/
JSM.CalculatePolygonCurveGroups = function (polygon, curveAngle)
{
	var curveGroups = [];
	var count = polygon.VertexCount ();

	var i, prev;
	for (i = 0; i < count; i++) {
		curveGroups.push (0);
	}

	for (i = 0; i < count; i++) {
		prev = curveGroups[polygon.GetPrevVertex (i)];
		if (polygon.GetVertexAngle (i) > curveAngle) {
			curveGroups[i] = prev;
		} else {
			curveGroups[i] = prev + 1;
		}
	}
	
	var firstGroup = curveGroups[0];
	var lastGroup = curveGroups[count - 1];
	if (firstGroup === 0 && firstGroup != lastGroup) {
		for (i = 0; curveGroups[i] == firstGroup; i++) {
			curveGroups[i] = lastGroup;
		}
	}
	
	return curveGroups;
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
* Function: MakeBodyInsideOut
* Description: Reverses all polygons orientation in the body.
* Parameters:
*	body {Body} the body
*/
JSM.MakeBodyInsideOut = function (body)
{
	var i, polygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		polygon.ReverseVertexIndices ();
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
* Function: GenerateWireBody
* Description: Generates a body which contains only the lines from the given body.
* Parameters:
*	body {Body} the original body
* Returns:
*	{Body} the result
*/
JSM.GenerateWireBody = function (body)
{
	var result = new JSM.Body ();
	
	var i;
	for (i = 0; i < body.VertexCount (); i++) {
		result.AddVertex (body.GetVertex (i).Clone ());
	}

	var adjacencyInfo = new JSM.AdjacencyInfo (body);
	var edge;
	for (i = 0; i < adjacencyInfo.edges.length; i++) {
		edge = adjacencyInfo.edges[i];
		JSM.AddLineToBody (result, edge.vert1, edge.vert2);
	}
	
	return result;
};

/**
* Function: TriangulateWithCentroids
* Description:
*	Triangulates all polygons of the body by connecting all polygon
*	vertices with the centroid vertex of the polygon.
* Parameters:
*	body {Body} the body
*/
JSM.TriangulateWithCentroids = function (body)
{
	var oldPolygonCount = body.PolygonCount ();
	var i, j, centroidCoord, centroidIndex, oldPolygon, oldVertexCount, polygon, curr, next;
	for (i = 0; i < oldPolygonCount; i++) {
		centroidCoord = JSM.CalculatePolygonCentroid (body, i);
		centroidIndex = body.AddVertex (new JSM.BodyVertex (centroidCoord));
		oldPolygon = body.GetPolygon (i);
		oldVertexCount = oldPolygon.VertexIndexCount ();
		for (j = 0; j < oldVertexCount; j++) {
			curr = oldPolygon.GetVertexIndex (j);
			next = oldPolygon.GetVertexIndex (j < oldVertexCount - 1 ? j + 1 : 0);
			polygon = new JSM.BodyPolygon ([curr, next, centroidIndex]);
			polygon.InheritAttributes (oldPolygon);
			body.AddPolygon (polygon);
		}
	}
	for (i = 0; i < oldPolygonCount; i++) {
		body.RemovePolygon (0);
	}
};

/**
* Function: TriangulatePolygons
* Description: Triangulates all polygons of the body.
* Parameters:
*	body {Body} the body
*/
JSM.TriangulatePolygons = function (body)
{
	var oldPolygonCount = body.PolygonCount ();
	var i, j, oldPolygon, polygon, coord, triangleIndices, triangle, bodyTriangle;
	for (i = 0; i < oldPolygonCount; i++) {
		oldPolygon = body.GetPolygon (i);
		polygon = new JSM.Polygon ();
		for (j = 0; j < oldPolygon.VertexIndexCount (); j++) {
			coord = body.GetVertexPosition (oldPolygon.GetVertexIndex (j));
			polygon.AddVertex (coord.x, coord.y, coord.z);
		}
		triangleIndices = JSM.TriangulatePolygon (polygon);
		if (triangleIndices !== null) {
			for (j = 0; j < triangleIndices.length; j++) {
				triangle = triangleIndices[j];
				bodyTriangle = new JSM.BodyPolygon ([
					oldPolygon.GetVertexIndex (triangle[0]),
					oldPolygon.GetVertexIndex (triangle[1]),
					oldPolygon.GetVertexIndex (triangle[2])
				]);
				bodyTriangle.InheritAttributes (oldPolygon);
				body.AddPolygon (bodyTriangle);
			}
		}
	}
	for (i = 0; i < oldPolygonCount; i++) {
		body.RemovePolygon (0);
	}
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
	function GetRandomInt (seeded, seed)
	{
		var minColor = 0;
		var maxColor = 16777215;
		var color = 0;
		if (seeded !== undefined && seeded) {
			color = JSM.SeededRandomInt (minColor, maxColor, seed + 1);
		} else {
			color = JSM.RandomInt (minColor, maxColor);
		}
		return color;
	}
	
	var i, color, material;
	var seed = 0;
	for (i = 0; i < body.LineCount (); i++) {
		color = GetRandomInt (seeded, seed++);
		material = materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
		body.GetLine (i).SetMaterialIndex (material);
	}
	for (i = 0; i < body.PointCount (); i++) {
		color = GetRandomInt (seeded, seed++);
		material = materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
		body.GetPoint (i).SetMaterialIndex (material);
	}
	for (i = 0; i < body.PolygonCount (); i++) {
		color = GetRandomInt (seeded, seed++);
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
