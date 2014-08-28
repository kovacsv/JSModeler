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

	var normalized = JSM.VectorNormalize (normal);
	return normalized;
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
				
				average = JSM.VectorMultiply (average, 1.0 / count);
				average = JSM.VectorNormalize (average);
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
	var referenceCoord = body.GetVertex (index).position;

	var eps = 0.00001;
	var a = distance;
	var b = 0.0;
	var c = JSM.GetGaussianCParameter (radius, a, b, eps);

	var i, x, currentDistance, newDistance, currentCoord;
	for (i = 0; i < body.VertexCount (); i++) {
		currentDistance = JSM.CoordDistance (referenceCoord, body.GetVertex (i).position);
		if (JSM.IsGreater (currentDistance, radius)) {
			continue;
		}

		x = currentDistance;
		newDistance = JSM.GetGaussianValue (x, distance, b, c);

		currentCoord = body.GetVertex (i).position;
		body.GetVertex (i).position = JSM.CoordOffset (currentCoord, direction, newDistance);
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
	
	var result = new JSM.Coord ();
	var i;
	for (i = 0; i < count; i++) {
		result = JSM.CoordAdd (result, body.GetVertexPosition (polygon.GetVertexIndex (i)));
	}
	
	result = JSM.VectorMultiply (result, 1.0 / count);
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
*	seed {integer} seed value
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
		materials.AddMaterial (new JSM.Material ({ambient : color, diffuse : color}));
		material = materials.Count () - 1;
		body.GetPolygon (i).SetMaterialIndex (material);
	}
};
