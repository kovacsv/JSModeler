/**
* Function: RayTriangleIntersection
* Description: Calculates intersection between a ray and a triangle.
* Parameters:
*	ray {Ray} the ray
*	v0, v1, v2 {Coord} the vertices of the triangle
* Returns:
*	{object} the result data (position, distance) if intersection found, null otherwise
*/
JSM.RayTriangleIntersection = function (ray, v0, v1, v2)
{
	var rayOrigin = ray.GetOrigin ();
	var rayDirection = ray.GetDirection ();

	var edgeDir1 = JSM.CoordSub (v1, v0);
	var edgeDir2 = JSM.CoordSub (v2, v0);
	var pVector = JSM.VectorCross (rayDirection, edgeDir2);

	var determinant = JSM.VectorDot (edgeDir1, pVector);
	if (JSM.IsZero (determinant)) {
		return null;
	}
	
	var isFrontFacing = JSM.IsPositive (determinant);
	if (!isFrontFacing) {
		return null;
	}

	var invDeterminant = 1.0 / determinant;

	var tVector = JSM.CoordSub (rayOrigin, v0);
	var u = JSM.VectorDot (tVector, pVector) * invDeterminant;
	if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
		return null;
	}

	var qVector = JSM.VectorCross (tVector, edgeDir1);
	var v = JSM.VectorDot (rayDirection, qVector) * invDeterminant;
	if (JSM.IsLower (v, 0.0) || JSM.IsGreater (u + v, 1.0)) {
		return null;
	}
 
	var distance = JSM.VectorDot (edgeDir2, qVector) * invDeterminant;
	if (!JSM.IsPositive (distance)) {
		return null;
	}

	if (ray.IsLengthReached (distance)) {
		return null;
	}
	
	var intersection = {
		position : JSM.CoordAdd (rayOrigin, JSM.VectorMultiply (rayDirection, distance)),
		distance : distance
	};
	return intersection;
};

/**
* Function: RayTriangleBodyIntersection
* Description: Calculates intersection between a ray and a triangle body.
* Parameters:
*	ray {Ray} the ray
*	body {TriangleBody} the triangle body
* Returns:
*	{object} the result data (position, distance, triangleIndex) if intersection found, null otherwise
*/
JSM.RayTriangleBodyIntersection = function (ray, body)
{
	var minIntersection = null;
	var i, triangle, v0, v1, v2, intersection;
	for (i = 0; i < body.TriangleCount (); i++) {
		triangle = body.GetTriangle (i);
		v0 = body.GetVertex (triangle.v0);
		v1 = body.GetVertex (triangle.v1);
		v2 = body.GetVertex (triangle.v2);
		intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
		if (intersection !== null) {
			if (minIntersection === null || intersection.distance < minIntersection.distance) {
				minIntersection = intersection;
				minIntersection.triangleIndex = i;
			}
		}
	}
	return minIntersection;
};

/**
* Function: RayTriangleModelIntersection
* Description: Calculates intersection between a ray and a triangle model.
* Parameters:
*	ray {Ray} the ray
*	model {TriangleModel} the triangle model
* Returns:
*	{object} the result data (position, distance, triangleIndex, bodyIndex) if intersection found, null otherwise
*/
JSM.RayTriangleModelIntersection = function (ray, model)
{
	var minIntersection = null;
	var i, body, intersection;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		intersection = JSM.RayTriangleBodyIntersection (ray, body);
		if (intersection !== null) {
			if (minIntersection === null || intersection.distance < minIntersection.distance) {
				minIntersection = intersection;
				minIntersection.bodyIndex = i;
			}
		}
	}
	return minIntersection;
};
