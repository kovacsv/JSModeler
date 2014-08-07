/**
* Class: LegoDimensions
* Description: Class that contains lego brick dimensions.
*/
JSM.LegoDimensions = function ()
{
	this.legoWidth = 0.78;
	this.legoSmallHeight = 0.32;
	this.legoLargeHeight = 0.96;
	this.legoWallWidth = 0.16;
	this.legoCylinderWidth = 0.5;
	this.legoCylinderHeight = 0.17;
	this.legoBottomSmallCylinderWidth = 0.3;
	this.legoBottomLargeCylinderWidth = 0.6;
	this.legoBottomLargeCylinderWallWidth = 0.1;
};

/**
* Function: GenerateLegoBrick
* Description: Generates a lego brick.
* Parameters:
*	rows {integer} the row count
*	columns {integer} the columns count
*	isLarge {boolean} the brick is large
*	hasTopCylinders {boolean} the brick has top cylinders
*	hasBottomCylinders {boolean} the brick has bottom cylinders
*	segmentation {integer} the segmentation of cylinders
*	isCurved {boolean} create smooth surfaces
* Returns:
*	{Body} the result
*/
JSM.GenerateLegoBrick = function (rows, columns, isLarge, hasTopCylinders, hasBottomCylinders, segmentation, isCurved)
{
	function OffsetBody (body, offset)
	{
		var i, vertex;
		for (i = 0; i < body.VertexCount (); i++) {
			vertex = body.GetVertex (i);
			vertex.position = JSM.CoordAdd (vertex.position, offset);
		}
	}
	
	var legoDimensions = new JSM.LegoDimensions ();

	var normal = new THREE.Vector3 (0.0, 0.0, 1.0);
	var unitWidth = legoDimensions.legoWidth;
	var unitHeight = legoDimensions.legoLargeHeight;
	if (!isLarge) {
		unitHeight = legoDimensions.legoSmallHeight;
	}
	var wallWidth = legoDimensions.legoWallWidth;
	var topCylinderWidth = legoDimensions.legoCylinderWidth;
	var topCylinderHeight = legoDimensions.legoCylinderHeight;
	var bottomSmallCylinderWidth = legoDimensions.legoBottomSmallCylinderWidth;
	var bottomLargeCylinderWidth = legoDimensions.legoBottomLargeCylinderWidth;
	var bottomLargeCylinderWallWidth = legoDimensions.legoBottomLargeCylinderWallWidth;

	var basePolygon = [];
	basePolygon.push (new JSM.Coord (0.0, 0.0, 0.0));
	basePolygon.push (new JSM.Coord (unitWidth * rows, 0.0, 0.0));
	basePolygon.push (new JSM.Coord (unitWidth * rows, unitWidth * columns, 0.0));
	basePolygon.push (new JSM.Coord (0.0, unitWidth * columns, 0.0));

	var result = new JSM.Body ();
	
	var walls = JSM.GeneratePrismShell (basePolygon, normal, unitHeight - wallWidth, wallWidth, true);
	result.Merge (walls);
		
	var i, j;
	for (i = 0; i < 4; i++) {
		basePolygon[i].z = unitHeight - wallWidth;
	}
	
	var top = JSM.GeneratePrism (basePolygon, normal, wallWidth, true);
	result.Merge (top);
	
	var cylinderCenter, cylinder;
	if (hasTopCylinders) {
		for (i = 0; i < rows; i++) {
			for (j = 0; j < columns; j++) {
				cylinderCenter = new JSM.Coord (unitWidth * i + unitWidth / 2.0, unitWidth * j + unitWidth / 2.0, unitHeight + topCylinderHeight / 2.0);
				cylinder = JSM.GenerateCylinder (topCylinderWidth / 2.0, topCylinderHeight, segmentation, true, isCurved);
				OffsetBody (cylinder, cylinderCenter);
				result.Merge (cylinder);
			}
		}
	}
	
	if (hasBottomCylinders) {
		var circle, bigger, columnWise;
		if ((rows === 1 && columns > 1) || (columns === 1 && rows > 1)) {
			bigger = columns;
			columnWise = true;
			if (rows > columns) {
				bigger = rows;
				columnWise = false;
			}
			for (i = 0; i < bigger - 1; i++) {
				if (columnWise) {
					cylinderCenter = new JSM.Coord (unitWidth / 2.0, unitWidth * (i + 1), (unitHeight - wallWidth) / 2.0);
				} else {
					cylinderCenter = new JSM.Coord (unitWidth * (i + 1), unitWidth / 2.0, (unitHeight - wallWidth) / 2.0);
				}
				cylinder = JSM.GenerateCylinder (bottomSmallCylinderWidth / 2.0, unitHeight - wallWidth, segmentation, true, isCurved);
				OffsetBody (cylinder, cylinderCenter);
				result.Merge (cylinder);
			}
		} else if (rows > 1 && columns > 1) {
			for (i = 0; i < rows - 1; i++) {
				for (j = 0; j < columns - 1; j++) {
					circle = [];
					cylinderCenter = new JSM.Coord (unitWidth * (i + 1), unitWidth * (j + 1), (unitHeight - wallWidth) / 2.0);
					cylinder = JSM.GenerateCylinderShell (bottomLargeCylinderWidth / 2.0, unitHeight - wallWidth, bottomLargeCylinderWallWidth, segmentation, true, isCurved);
					OffsetBody (cylinder, cylinderCenter);
					result.Merge (cylinder);
				}
			}
		}
	}

	result.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
	return result;
};

/**
* Function: GenerateConvexHullBody
* Description: Generates a convex hull body from the given coordinates.
* Parameters:
*	coord {Coord[*]} the coordinates
* Returns:
*	{Body} the result
*/
JSM.GenerateConvexHullBody = function (coords)
{
	var result = new JSM.Body ();
	var convexHull = JSM.ConvexHull3D (coords);
	
	var oldToNewIndexTable = {};
	var i, j, current, index;
	for (i = 0; i < convexHull.length; i++) {
		current = convexHull[i];
		for (j = 0; j < current.length; j++) {
			index = current[j];
			if (!(index in oldToNewIndexTable)) {
				oldToNewIndexTable[index] = result.VertexCount ();
				result.AddVertex (new JSM.BodyVertex (coords[index]));
			}
		}
	}
	
	var newPolygon;
	for (i = 0; i < convexHull.length; i++) {
		current = convexHull[i];
		newPolygon = [];
		for (j = 0; j < current.length; j++) {
			index = current[j];
			newPolygon.push (oldToNewIndexTable[index]);
		}
		result.AddPolygon (new JSM.BodyPolygon (newPolygon));
	}

	return result;
};

/**
* Function: GenerateSuperShape
* Description: Generates a supershape.
* Parameters:
*	parameters {12 numbers} the supershape parameters
*	segmentation {integer} the segmentation
*	isCurved {boolean} create smooth surfaces
* Returns:
*	{Body} the result
*/
JSM.GenerateSuperShape = function (	aLon, bLon, mLon, n1Lon, n2Lon, n3Lon,
									aLat, bLat, mLat, n1Lat, n2Lat, n3Lat,
									segmentation, isCurved)
{
	function CartesianToSpherical (coord)
	{
		var radius = Math.sqrt (coord.x * coord.x + coord.y * coord.y + coord.z * coord.z);
		var phi = Math.asin (coord.z / radius);
		var theta = Math.atan2 (coord.y, coord.x);
		return [radius, phi, theta];
	}

	function CalculateSuperFormula (p, a, b, m, n1, n2, n3)
	{
		var abs1 = Math.abs (Math.cos (m * p / 4.0) / a);
		var abs2 = Math.abs (Math.sin (m * p / 4.0) / b);
		return Math.pow (Math.pow (abs1, n2) + Math.pow (abs2, n3), -1.0 / n1);
	}

	function CalculateSuperFormulaCoordinate (phi, theta)
	{
		var coord = new JSM.Coord ();
		var rPhi = CalculateSuperFormula (phi, aLat, bLat, mLat, n1Lat, n2Lat, n3Lat);
		var rTheta = CalculateSuperFormula (theta, aLon, bLon, mLon, n1Lon, n2Lon, n3Lon);
		coord.x = rTheta * Math.cos (theta) * rPhi * Math.cos (phi);
		coord.y = rTheta * Math.sin (theta) * rPhi * Math.cos (phi);
		coord.z = rPhi * Math.sin (phi);
		return coord;
	}

	var result = JSM.GenerateSphere (1.0, segmentation, isCurved);

	var i, vertex, coord, spherical, newCoord;
	for (i = 0; i < result.VertexCount (); i++) {
		vertex = result.GetVertex (i);
		coord = vertex.position;
		spherical = CartesianToSpherical (coord);
		newCoord = CalculateSuperFormulaCoordinate (spherical[1], spherical[2]);
		vertex.SetPosition (newCoord);
	}
	
	return result;
};
