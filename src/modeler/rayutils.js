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
* Description: Calculates the nearest intersection between a ray and a triangle body.
* Parameters:
*	ray {Ray} the ray
*	body {TriangleBody} the triangle body
*	intersection {object} the result data (position, distance, triangleIndex)
* Returns:
*	{boolean} true if found intersection, false otherwise
*/
JSM.RayTriangleBodyIntersection = function (ray, body, intersection)
{
	var minIntersection = null;
	var foundIntersection = false;
	var calcMinIntersection = (intersection !== null && intersection !== undefined);
	
	var i, triangle, v0, v1, v2, currentIntersection;
	for (i = 0; i < body.TriangleCount (); i++) {
		triangle = body.GetTriangle (i);
		v0 = body.GetVertex (triangle.v0);
		v1 = body.GetVertex (triangle.v1);
		v2 = body.GetVertex (triangle.v2);
		currentIntersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
		if (currentIntersection !== null) {
			foundIntersection = true;
			if (!calcMinIntersection) {
				break;
			}
			if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
				minIntersection = currentIntersection;
				minIntersection.triangleIndex = i;
			}
		}
	}
	
	if (calcMinIntersection && minIntersection !== null) {
		intersection.position = minIntersection.position;
		intersection.distance = minIntersection.distance;
		intersection.triangleIndex = minIntersection.triangleIndex;
	}
	return foundIntersection;
};

/**
* Function: RayTriangleModelIntersection
* Description: Calculates the nearest intersection between a ray and a triangle model.
* Parameters:
*	ray {Ray} the ray
*	model {TriangleModel} the triangle model
*	intersection {object} the result data (position, distance, triangleIndex, bodyIndex)
* Returns:
*	{boolean} true if found intersection, false otherwise
*/
JSM.RayTriangleModelIntersection = function (ray, model, intersection)
{
	var minIntersection = null;
	var foundIntersection = false;
	var calcMinIntersection = (intersection !== null && intersection !== undefined);
	
	var i, body, currentIntersection;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		currentIntersection = calcMinIntersection ? {} : null;
		if (JSM.RayTriangleBodyIntersection (ray, body, currentIntersection)) {
			foundIntersection = true;
			if (!calcMinIntersection) {
				break;
			}
			if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
				minIntersection = currentIntersection;
				minIntersection.bodyIndex = i;
			}
		}
	}
	
	if (calcMinIntersection && minIntersection !== null) {
		intersection.position = minIntersection.position;
		intersection.distance = minIntersection.distance;
		intersection.triangleIndex = minIntersection.triangleIndex;
		intersection.bodyIndex = minIntersection.bodyIndex;
	}	
	return foundIntersection;
};
