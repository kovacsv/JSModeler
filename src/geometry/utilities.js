/**
* Function: GetGaussianCParameter
* Description:
*	Calculates the gaussian functions c parameter which can be used
*	for the gaussian function to reach epsilon at a given value.
* Parameters:
*	x {number} the value
*	a {number} the a parameter of the function
*	b {number} the b parameter of the function
*	epsilon {number} the epsilon value
* Returns:
*	{number} the c parameter of the function
*/
JSM.GetGaussianCParameter = function (x, a, b, epsilon)
{
	return Math.sqrt (-(Math.pow (x - b, 2.0) / (2.0 * Math.log (epsilon / Math.abs (a)))));
};

/**
* Function: GetGaussianValue
* Description: Calculates the gaussian functions value.
* Parameters:
*	x {number} the value
*	a {number} the a parameter of the function
*	b {number} the b parameter of the function
*	c {number} the c parameter of the function
* Returns:
*	{number} the result
*/
JSM.GetGaussianValue = function (x, a, b, c)
{
	return a * Math.exp (-(Math.pow (x - b, 2.0) / (2.0 * Math.pow (c, 2.0))));
};

/**
* Function: GenerateCirclePoints
* Description: Generates coordinates on circle.
* Parameters:
*	radius {number} the radius of the circle
*	segmentation {number} the segmentation of the circle
*	origo {Coord} the origo of the circle
* Returns:
*	{Coord[*]} the result
*/
JSM.GenerateCirclePoints = function (radius, segmentation, origo)
{
	var result = [];
	var segments = segmentation;

	var theta = 2.0 * Math.PI;
	var step = 2.0 * Math.PI / segments;
	
	var i, coord;
	for (i = 0; i < segments; i++) {
		coord = JSM.CylindricalToCartesian (radius, 0.0, theta);
		if (origo !== undefined && origo !== null) {
			coord = JSM.CoordAdd (coord, origo);
		}
		result.push (coord);
		theta += step;
	}
	
	return result;
};

/**
* Function: GetRuledMesh
* Description:
*	Generates ruled mesh coordinates and polygons between two coordinate array.
*	The two arrays should have the same length. The result is a coordinate array
*	and a polygon array which contains indices for vertices.
* Parameters:
*	aCoords {Coord[*]} the first coordinate array
*	bCoords {Coord[*]} the second coordinate array
*	segmentation {number} the segmentation of the mesh
*	vertices {Coord[*]} (out) the vertices of the mesh
*	polygons {integer[*][4]} (out) the polygons of the mesh
*/
JSM.GetRuledMesh = function (aCoords, bCoords, segmentation, vertices, polygons)
{
	if (aCoords.length !== bCoords.length) {
		return;
	}

	var lineSegmentation = aCoords.length - 1;
	var meshSegmentation = segmentation;
	var directions = [];
	var lengths = [];

	var i, j;
	for (i = 0; i <= lineSegmentation; i++) {
		directions.push (JSM.CoordSub (bCoords[i], aCoords[i]));
		lengths.push (JSM.CoordDistance (aCoords[i], bCoords[i]));
	}

	var step, coord;
	for (i = 0; i <= lineSegmentation; i++) {
		step = lengths[i] / meshSegmentation;
		for (j = 0; j <= meshSegmentation; j++) {
			coord = JSM.CoordOffset (aCoords[i], directions[i], step * j);
			vertices.push (coord);
		}
	}

	var current, top, next, ntop, polygon;
	for (i = 0; i < lineSegmentation; i++) {
		for (j = 0; j < meshSegmentation; j++) {
			current = i * (meshSegmentation + 1) + j;
			top = current + meshSegmentation + 1;
			next = current + 1;
			ntop = top + 1;

			current = i * (meshSegmentation + 1) + j;
			top = current + 1;
			next = current + meshSegmentation + 1;
			ntop = next + 1;

			polygon = [current, next, ntop, top];
			polygons.push (polygon);
		}
	}
};
