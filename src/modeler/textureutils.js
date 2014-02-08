/**
* Function: CalculatePlanarTextureCoord
* Description: Calculates the planar texture coordinate for a coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	system {CoordSystem} the coordinate system
* Returns:
*	{Coord2D} the result
*/
JSM.CalculatePlanarTextureCoord = function (coord, system)
{
	var result = new JSM.Coord2D ();

	var e1 = JSM.VectorNormalize (system.e1);
	var e2 = JSM.VectorNormalize (system.e2);
	var e3 = JSM.VectorCross (system.e1, system.e2);

	var xyPlane = JSM.GetPlaneFromCoordAndDirection (system.origo, e3);
	var xzPlane = JSM.GetPlaneFromCoordAndDirection (system.origo, e2);
	var yzPlane = JSM.GetPlaneFromCoordAndDirection (system.origo, e1);
	
	var projected = JSM.ProjectCoordToPlane (coord, xyPlane);
	result.x = JSM.CoordPlaneSignedDistance (projected, yzPlane);
	result.y = JSM.CoordPlaneSignedDistance (projected, xzPlane);

	return result;
};

/**
* Function: CalculatePolygonPlanarTextureCoords
* Description: Calculates the planar texture coordinates for a polygon.
* Parameters:
*	body {Body} the body
*	index {integer} the polygon index
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculatePolygonPlanarTextureCoords = function (body, index)
{
	var result = [];
	var polygon = body.GetPolygon (index);
	var system = body.GetTextureProjectionCoords ();

	var i, coord;
	for (i = 0; i < polygon.VertexIndexCount (); i++) {
		coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
		result.push (JSM.CalculatePlanarTextureCoord (coord, system));
	}
	
	return result;
};

/**
* Function: CalculateCubicTextureCoord
* Description: Calculates the cubic texture coordinate for a coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	normal {Vector} the normal vector for calculation
*	system {CoordSystem} the coordinate system
* Returns:
*	{Coord2D} the result
*/
JSM.CalculateCubicTextureCoord = function (coord, normal, system)
{
	var result = new JSM.Coord2D ();

	var e1 = JSM.VectorNormalize (system.e1);
	var e2 = JSM.VectorNormalize (system.e2);
	var e3 = JSM.VectorNormalize (system.e3);

	var correctPlane = -1;
	var maxProduct = 0.0;
	
	var i, currentDirection, product;
	for (i = 0; i < 3; i++) {
		if (i === 0) {
			currentDirection = e1;
		} else if (i === 1) {
			currentDirection = e2;
		} else if (i === 2) {
			currentDirection = e3;
		}

		product = Math.abs (JSM.VectorDot (normal, currentDirection));
		if (JSM.IsGreater (product, maxProduct)) {
			correctPlane = i;
			maxProduct = product;
		}
	}

	if (correctPlane === -1) {
		return result;
	}

	var planeSystem = null;
	if (correctPlane === 0) {
		planeSystem = new JSM.CoordSystem (
			system.origo,
			e2,
			e3,
			null
		);
	} else if (correctPlane === 1) {
		planeSystem = new JSM.CoordSystem (
			system.origo,
			e1,
			e3,
			null
		);
	} else if (correctPlane === 2) {
		planeSystem = new JSM.CoordSystem (
			system.origo,
			e1,
			e2,
			null
		);
	}
	
	if (planeSystem === null) {
		return result;
	}

	return JSM.CalculatePlanarTextureCoord (coord, planeSystem);
};

/**
* Function: CalculatePolygonCubicTextureCoords
* Description: Calculates the cubic texture coordinates for a polygon.
* Parameters:
*	body {Body} the body
*	index {integer} the polygon index
*	normal {Vector} the normal vector for calculation
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculatePolygonCubicTextureCoords = function (body, index, normal)
{
	var result = [];
	var polygon = body.GetPolygon (index);
	var system = body.GetTextureProjectionCoords ();

	var i, coord;
	for (i = 0; i < polygon.VertexIndexCount (); i++) {
		coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
		result.push (JSM.CalculateCubicTextureCoord (coord, normal, system));
	}
	
	return result;
};

/**
* Function: CalculateCylindricalTextureCoord
* Description: Calculates the cylindrical texture coordinate for a coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	normal {Vector} the normal vector for calculation
*	system {CoordSystem} the coordinate system
* Returns:
*	{Coord2D} the result
*/
JSM.CalculateCylindricalTextureCoord = function (coord, normal, system)
{
	var result = new JSM.Coord2D ();

	var e3Direction = JSM.VectorNormalize (system.e3);
	if (JSM.VectorsAreCollinear (e3Direction, normal)) {
		result = JSM.CalculateCubicTextureCoord (coord, normal, system);
		return [result, 0.0];
	}

	var baseLine = new JSM.Line (system.origo, e3Direction);
	var projectedCoord = JSM.ProjectCoordToLine (coord, baseLine);
	var projectedDistance = JSM.CoordSignedDistance (system.origo, projectedCoord, system.e3);

	var e1Direction = JSM.VectorNormalize (system.e1);
	var coordDirection = JSM.CoordSub (coord, projectedCoord);
	var angle = JSM.GetVectorsFullAngle (e1Direction, coordDirection, e3Direction);
	var radius = JSM.VectorLength (system.e1);

	result.x = angle * radius;
	result.y = projectedDistance;
	return [result, angle];
};

/**
* Function: CalculatePolygonCylindricalTextureCoords
* Description: Calculates the cylindrical texture coordinates for a polygon.
* Parameters:
*	body {Body} the body
*	index {integer} the polygon index
*	normal {Vector} the normal vector for calculation
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculatePolygonCylindricalTextureCoords = function (body, index, normal)
{
	var result = [];
	var angles = [];

	var polygon = body.GetPolygon (index);
	var system = body.GetTextureProjectionCoords ();

	var angle = 0;
	var i, j, coord, textureValues;
	for (i = 0; i < polygon.VertexIndexCount (); i++) {
		coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
		textureValues = JSM.CalculateCylindricalTextureCoord (coord, normal, system);
		result.push (textureValues[0]);
		angles.push (textureValues[1]);
	}

	var e3Direction = JSM.VectorNormalize (system.e3);
	if (JSM.VectorsAreCollinear (e3Direction, normal)) {
		return result;
	}
	
	var needRepair = false;
	for (i = 0; i < angles.length; i++) {
		for (j = i + 1; j < angles.length; j++) {
			if (JSM.IsGreater (Math.abs (angles[i] - angles[j]), Math.PI)) {
				needRepair = true;
				break;
			}
		}
		if (needRepair) {
			break;
		}
	}

	if (needRepair) {
		var radius = JSM.VectorLength (system.e1);
		for (i = 0; i < angles.length; i++) {
			if (JSM.IsLower (angles[i], Math.PI)) {
				result[i].x = radius * (angles[i] + 2.0 * Math.PI);
			}
		}
	}
	
	return result;
};

/**
* Function: CalculateBodyPlanarTextureCoords
* Description: Calculates the planar texture coordinates for a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculateBodyPlanarTextureCoords = function (body)
{
	var result = [];
	var i;
	for (i = 0; i < body.PolygonCount (); i++) {
		result.push (JSM.CalculatePolygonPlanarTextureCoords (body, i));
	}
	return result;
};

/**
* Function: CalculateBodyCubicTextureCoords
* Description: Calculates the cubic texture coordinates for a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculateBodyCubicTextureCoords = function (body)
{
	var result = [];
	var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	var i, normal;
	for (i = 0; i < body.PolygonCount (); i++) {
		normal = polygonNormals[i];
		result.push (JSM.CalculatePolygonCubicTextureCoords (body, i, normal));
	}
	return result;
};

/**
* Function: CalculateBodyCylindricalTextureCoords
* Description: Calculates the cylindrical texture coordinates for a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculateBodyCylindricalTextureCoords = function (body)
{
	var result = [];
	var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	var i, normal;
	for (i = 0; i < body.PolygonCount (); i++) {
		normal = polygonNormals[i];
		result.push (JSM.CalculatePolygonCylindricalTextureCoords (body, i, normal));
	}
	return result;
};

/**
* Function: CalculateBodyTextureCoords
* Description: Calculates the texture coordinates for a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{Coord2D[*]} the result
*/
JSM.CalculateBodyTextureCoords = function (body)
{
	var result = [];
	var projection = body.GetTextureProjectionType ();
	if (projection === 'Planar') {
		result = JSM.CalculateBodyPlanarTextureCoords (body);
	} else if (projection === 'Cubic') {
		result = JSM.CalculateBodyCubicTextureCoords (body);
	} else if (projection === 'Cylindrical') {
		result = JSM.CalculateBodyCylindricalTextureCoords (body);
	}

	return result;
};
