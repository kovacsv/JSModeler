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
	
	var scaledDirection = rayDirection.Clone ().MultiplyScalar (distance);
	var intersection = {
		position : JSM.CoordAdd (rayOrigin, scaledDirection),
		distance : distance
	};
	return intersection;
};

/**
* Function: RayBoxIntersection
* Description: Calculates intersection between a ray and a box.
* Parameters:
*	ray {Ray} the ray
*	min, max {Coord} the minimum and maximum points of the box
* Returns:
*	{object} the result data (position, distance) if intersection found, null otherwise
*/
JSM.RayBoxIntersection = function (ray, min, max)
{
	var rayOriginVec = ray.GetOrigin ();
	var rayDirectionVec = ray.GetDirection ();

	var rayOrigin = JSM.CoordToArray (rayOriginVec);
	var rayDirection = JSM.CoordToArray (rayDirectionVec);
	var minB = JSM.CoordToArray (min);
	var maxB = JSM.CoordToArray (max);
	var quadrant = [0, 0, 0];
	var candidatePlane = [0.0, 0.0, 0.0];

	var originInBox = true;
	var i;
	for (i = 0; i < 3; i++) {
		if (JSM.IsLower (rayOrigin[i], minB[i])) {
			quadrant[i] = -1; // left
			candidatePlane[i] = minB[i];
			originInBox = false;
		} else if (JSM.IsGreater (rayOrigin[i], maxB[i])) {
			quadrant[i] = 1; // right
			candidatePlane[i] = maxB[i];
			originInBox = false;
		} else {
			quadrant[i] = 0; // middle
		}
	}

	var intersection = null;
	if (originInBox) {
		intersection = {
			position : rayOriginVec,
			distance : 0.0
		};
		return intersection;
	}

	var maxT = [0.0, 0.0, 0.0];
	for (i = 0; i < 3; i++) {
		if (quadrant[i] !== 0 && !JSM.IsZero (rayDirection[i])) {
			maxT[i] = (candidatePlane[i] - rayOrigin[i]) / rayDirection[i];
		} else {
			maxT[i] = -1.0;
		}
	}

	var whichPlane = 0;
	for (i = 1; i < 3; i++) {
		if (JSM.IsLower (maxT[whichPlane], maxT[i])) {
			whichPlane = i;
		}
	}

	if (JSM.IsNegative (maxT[whichPlane])) {
		return null;
	}

	var xCoord = [0.0, 0.0, 0.0];
	for (i = 0; i < 3; i++) {
		if (whichPlane != i) {
			xCoord[i] = rayOrigin[i] + maxT[whichPlane] * rayDirection[i];
			if (JSM.IsLower (xCoord[i], minB[i]) || JSM.IsGreater (xCoord[i], maxB[i])) {
				return null;
			}
		} else {
			xCoord[i] = candidatePlane[i];
		}
	}

	var intersectionCoord = JSM.CoordFromArray (xCoord);
	var distance = rayOriginVec.DistanceTo (intersectionCoord);
	if (ray.IsLengthReached (distance)) {
		return null;
	}

	intersection = {
		position : intersectionCoord,
		distance : distance
	};
	return intersection;
};

/**
* Function: RayOctreeIntersection
* Description: Calculates the nearest intersection between a ray and an octree.
* Parameters:
*	ray {Ray} the ray
*	octree {Octree} the octree
*	intersection {object} the result data (position, distance, userData)
* Returns:
*	{boolean} true if found intersection, false otherwise
*/
JSM.RayOctreeIntersection = function (ray, octree, intersection)
{
	var minIntersection = null;
	var foundIntersection = false;
	var calcMinIntersection = (intersection !== null && intersection !== undefined);

	JSM.TraverseOctreeNodes (octree, function (node) {
		if (!calcMinIntersection && foundIntersection) {
			return false;
		}
		if (!JSM.RayBoxIntersection (ray, node.box.min, node.box.max)) {
			return false;
		}
		var i;
		for (i = 0; i < node.triangles.length; i++) {
			var triangle = node.triangles[i];
			var v0 = triangle.v0;
			var v1 = triangle.v1;
			var v2 = triangle.v2;
			var currentIntersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
			if (currentIntersection !== null) {
				foundIntersection = true;
				if (!calcMinIntersection) {
					return false;
				}
				if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
					minIntersection = currentIntersection;
					minIntersection.userData = triangle.userData;
				}
			}
		}
		return true;
	});	

	if (calcMinIntersection && minIntersection !== null) {
		intersection.position = minIntersection.position;
		intersection.distance = minIntersection.distance;
		intersection.userData = minIntersection.userData;
	}
	return foundIntersection;
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

/**
* Function: RayTriangleModelIntersectionWithOctree
* Description:
*	Calculates the nearest intersection between a ray and a triangle model.
*	Caches the octrees for all bodies in the model.
* Parameters:
*	ray {Ray} the ray
*	model {TriangleModel} the triangle model
*	intersection {object} the result data (position, distance, triangleIndex, bodyIndex)
* Returns:
*	{boolean} true if found intersection, false otherwise
*/
JSM.RayTriangleModelIntersectionWithOctree = function (ray, model, intersection)
{
	var minIntersection = null;
	var foundIntersection = false;
	var calcMinIntersection = (intersection !== null && intersection !== undefined);
	var i, body, hasIntersection, currentIntersection;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		hasIntersection = false;
		currentIntersection = calcMinIntersection ? {} : null;
		if (body.TriangleCount () > 20) {
			if (body.octree === undefined) {
				body.octree = JSM.ConvertTriangleBodyToOctree (body);
			}
			hasIntersection = JSM.RayOctreeIntersection (ray, body.octree, currentIntersection);
		} else {
			hasIntersection = JSM.RayTriangleBodyIntersection (ray, body, currentIntersection);
		}
		
		if (hasIntersection) {
			foundIntersection = true;
			if (!calcMinIntersection) {
				break;
			}
			if (minIntersection === null || currentIntersection.distance < minIntersection.distance) {
				minIntersection = currentIntersection;
				if (currentIntersection.userData !== undefined) {
					minIntersection.triangleIndex = currentIntersection.userData.triangleIndex;
				}
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
