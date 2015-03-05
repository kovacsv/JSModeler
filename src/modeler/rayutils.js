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
		position : JSM.VectorMultiply (JSM.CoordAdd (rayOrigin, rayDirection), distance),
		distance : distance
	};
	return intersection;
};
