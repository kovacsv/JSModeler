/**
* Function: GenerateSolidWithRadius
* Description: Generates a special solid with the given radius.
* Parameters:
*	solidName {string} the name of the solid
*	radius {number} the radius of the solid
* Returns:
*	{Body} the result
*/
JSM.GenerateSolidWithRadius = function (solidName, radius)
{
	var result = new JSM.Body ();
	var equalRadius = true;
	
	if (solidName === 'Tetrahedron') {
		result = JSM.GenerateTetrahedron ();
	} else if (solidName === 'Hexahedron') {
		result = JSM.GenerateHexahedron ();
	} else if (solidName === 'Octahedron') {
		result = JSM.GenerateOctahedron ();
	} else if (solidName === 'Dodecahedron') {
		result = JSM.GenerateDodecahedron ();
	} else if (solidName === 'Icosahedron') {
		result = JSM.GenerateIcosahedron ();
	} else if (solidName === 'TruncatedTetrahedron') {
		result = JSM.GenerateTruncatedTetrahedron ();
	} else if (solidName === 'Cuboctahedron') {
		result = JSM.GenerateCuboctahedron ();
	} else if (solidName === 'TruncatedCube') {
		result = JSM.GenerateTruncatedCube ();
	} else if (solidName === 'TruncatedOctahedron') {
		result = JSM.GenerateTruncatedOctahedron ();
	} else if (solidName === 'Rhombicuboctahedron') {
		result = JSM.GenerateRhombicuboctahedron ();
	} else if (solidName === 'TruncatedCuboctahedron') {
		result = JSM.GenerateTruncatedCuboctahedron ();
	} else if (solidName === 'SnubCube') {
		result = JSM.GenerateSnubCube ();
	} else if (solidName === 'Icosidodecahedron') {
		result = JSM.GenerateIcosidodecahedron ();
	} else if (solidName === 'TruncatedDodecahedron') {
		result = JSM.GenerateTruncatedDodecahedron ();
	} else if (solidName === 'TruncatedIcosahedron') {
		result = JSM.GenerateTruncatedIcosahedron ();
	} else if (solidName === 'Rhombicosidodecahedron') {
		result = JSM.GenerateRhombicosidodecahedron ();
	} else if (solidName === 'TruncatedIcosidodecahedron') {
		result = JSM.GenerateTruncatedIcosidodecahedron ();
	} else if (solidName === 'SnubDodecahedron') {
		result = JSM.GenerateSnubDodecahedron ();
	} else if (solidName === 'TetrakisHexahedron') {
		result = JSM.GenerateTetrakisHexahedron ();
		equalRadius = false;
	} else if (solidName === 'RhombicDodecahedron') {
		result = JSM.GenerateRhombicDodecahedron ();
		equalRadius = false;
	} else if (solidName === 'PentakisDodecahedron') {
		result = JSM.GeneratePentakisDodecahedron ();
		equalRadius = false;
	} else if (solidName === 'SmallStellatedDodecahedron') {
		result = JSM.GenerateSmallStellatedDodecahedron ();
		equalRadius = false;
	} else if (solidName === 'GreatDodecahedron') {
		result = JSM.GenerateGreatDodecahedron ();
		equalRadius = false;
	} else if (solidName === 'SmallTriambicIcosahedron') {
		result = JSM.GenerateSmallTriambicIcosahedron ();
		equalRadius = false;
	} else if (solidName === 'GreatStellatedDodecahedron') {
		result = JSM.GenerateGreatStellatedDodecahedron ();
		equalRadius = false;
	} else if (solidName === 'SmallTriakisOctahedron') {
		result = JSM.GenerateSmallTriakisOctahedron ();
		equalRadius = false;
	} else if (solidName === 'StellaOctangula') {
		result = JSM.GenerateStellaOctangula ();
		equalRadius = false;
	} else if (solidName === 'TriakisTetrahedron') {
		result = JSM.GenerateTriakisTetrahedron ();
		equalRadius = false;
	}

	if (result.VertexCount () > 0) {
		var i;
	
		var maxRadius = 0.0;
		if (equalRadius) {
			maxRadius = JSM.VectorLength (result.GetVertexPosition (0));
		} else {
			var currentRadius;
			for (i = 0; i < result.VertexCount (); i++) {
				currentRadius = JSM.VectorLength (result.GetVertexPosition (i));
				if (JSM.IsGreater (currentRadius, maxRadius)) {
					maxRadius = currentRadius;
				}
			}
		}
		
		var scale = radius / maxRadius;
		
		var vertex;
		for (i = 0; i < result.VertexCount (); i++) {
			vertex = result.GetVertex (i);
			vertex.SetPosition (JSM.VectorMultiply (vertex.GetPosition (), scale));
		}
	}
	
	return result;
};

/**
* Function: GenerateTetrahedron
* Description: Generates a tetrahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTetrahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;

	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, +a, +a)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, -a, +a)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, +a, -a)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, -a, -a)));

	result.AddPolygon (new JSM.BodyPolygon ([0, 1, 3]));
	result.AddPolygon (new JSM.BodyPolygon ([0, 2, 1]));
	result.AddPolygon (new JSM.BodyPolygon ([0, 3, 2]));
	result.AddPolygon (new JSM.BodyPolygon ([1, 2, 3]));
	
	return result;
};


/**
* Function: GenerateHexahedron
* Description: Generates a hexahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateHexahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;

	JSM.AddVertexToBody (result, +a, +a, +a);
	JSM.AddVertexToBody (result, +a, +a, -a);
	JSM.AddVertexToBody (result, +a, -a, +a);
	JSM.AddVertexToBody (result, -a, +a, +a);
	JSM.AddVertexToBody (result, +a, -a, -a);
	JSM.AddVertexToBody (result, -a, +a, -a);
	JSM.AddVertexToBody (result, -a, -a, +a);
	JSM.AddVertexToBody (result, -a, -a, -a);

	JSM.AddPolygonToBody (result, [0, 1, 5, 3]);
	JSM.AddPolygonToBody (result, [0, 2, 4, 1]);
	JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
	JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
	JSM.AddPolygonToBody (result, [2, 6, 7, 4]);
	JSM.AddPolygonToBody (result, [3, 5, 7, 6]);

	return result;
};

/**
* Function: GenerateOctahedron
* Description: Generates an octahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateOctahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;

	JSM.AddVertexToBody (result, +a, +b, +b);
	JSM.AddVertexToBody (result, -a, +b, +b);
	JSM.AddVertexToBody (result, +b, +a, +b);
	JSM.AddVertexToBody (result, +b, -a, +b);
	JSM.AddVertexToBody (result, +b, +b, +a);
	JSM.AddVertexToBody (result, +b, +b, -a);

	JSM.AddPolygonToBody (result, [0, 2, 4]);
	JSM.AddPolygonToBody (result, [0, 3, 5]);
	JSM.AddPolygonToBody (result, [0, 4, 3]);
	JSM.AddPolygonToBody (result, [0, 5, 2]);
	JSM.AddPolygonToBody (result, [1, 2, 5]);
	JSM.AddPolygonToBody (result, [1, 3, 4]);
	JSM.AddPolygonToBody (result, [1, 4, 2]);
	JSM.AddPolygonToBody (result, [1, 5, 3]);

	return result;
};

/**
* Function: GenerateDodecahedron
* Description: Generates a dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateDodecahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;
	var d = 1.0 / c;

	JSM.AddVertexToBody (result, +a, +a, +a);
	JSM.AddVertexToBody (result, +a, +a, -a);
	JSM.AddVertexToBody (result, +a, -a, +a);
	JSM.AddVertexToBody (result, -a, +a, +a);
	
	JSM.AddVertexToBody (result, +a, -a, -a);
	JSM.AddVertexToBody (result, -a, +a, -a);
	JSM.AddVertexToBody (result, -a, -a, +a);
	JSM.AddVertexToBody (result, -a, -a, -a);

	JSM.AddVertexToBody (result, +b, +d, +c);
	JSM.AddVertexToBody (result, +b, +d, -c);
	JSM.AddVertexToBody (result, +b, -d, +c);
	JSM.AddVertexToBody (result, +b, -d, -c);

	JSM.AddVertexToBody (result, +d, +c, +b);
	JSM.AddVertexToBody (result, +d, -c, +b);
	JSM.AddVertexToBody (result, -d, +c, +b);
	JSM.AddVertexToBody (result, -d, -c, +b);

	JSM.AddVertexToBody (result, +c, +b, +d);
	JSM.AddVertexToBody (result, -c, +b, +d);
	JSM.AddVertexToBody (result, +c, +b, -d);
	JSM.AddVertexToBody (result, -c, +b, -d);

	JSM.AddPolygonToBody (result, [0, 8, 10, 2, 16]);
	JSM.AddPolygonToBody (result, [0, 16, 18, 1, 12]);
	JSM.AddPolygonToBody (result, [0, 12, 14, 3, 8]);
	JSM.AddPolygonToBody (result, [1, 9, 5, 14, 12]);
	JSM.AddPolygonToBody (result, [1, 18, 4, 11, 9]);
	JSM.AddPolygonToBody (result, [2, 10, 6, 15, 13]);
	JSM.AddPolygonToBody (result, [2, 13, 4, 18, 16]);
	JSM.AddPolygonToBody (result, [3, 14, 5, 19, 17]);
	JSM.AddPolygonToBody (result, [3, 17, 6, 10, 8]);
	JSM.AddPolygonToBody (result, [4, 13, 15, 7, 11]);
	JSM.AddPolygonToBody (result, [5, 9, 11, 7, 19]);
	JSM.AddPolygonToBody (result, [6, 17, 19, 7, 15]);

	return result;
};

/**
* Function: GenerateIcosahedron
* Description: Generates an icosahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateIcosahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;

	JSM.AddVertexToBody (result, +b, +a, +c);
	JSM.AddVertexToBody (result, +b, +a, -c);
	JSM.AddVertexToBody (result, +b, -a, +c);
	JSM.AddVertexToBody (result, +b, -a, -c);

	JSM.AddVertexToBody (result, +a, +c, +b);
	JSM.AddVertexToBody (result, +a, -c, +b);
	JSM.AddVertexToBody (result, -a, +c, +b);
	JSM.AddVertexToBody (result, -a, -c, +b);

	JSM.AddVertexToBody (result, +c, +b, +a);
	JSM.AddVertexToBody (result, -c, +b, +a);
	JSM.AddVertexToBody (result, +c, +b, -a);
	JSM.AddVertexToBody (result, -c, +b, -a);

	JSM.AddPolygonToBody (result, [0, 2, 8]);
	JSM.AddPolygonToBody (result, [0, 4, 6]);
	JSM.AddPolygonToBody (result, [0, 6, 9]);
	JSM.AddPolygonToBody (result, [0, 8, 4]);
	JSM.AddPolygonToBody (result, [0, 9, 2]);
	JSM.AddPolygonToBody (result, [1, 3, 11]);
	JSM.AddPolygonToBody (result, [1, 4, 10]);
	JSM.AddPolygonToBody (result, [1, 6, 4]);
	JSM.AddPolygonToBody (result, [1, 10, 3]);
	JSM.AddPolygonToBody (result, [1, 11, 6]);
	JSM.AddPolygonToBody (result, [2, 5, 8]);
	JSM.AddPolygonToBody (result, [2, 7, 5]);
	JSM.AddPolygonToBody (result, [2, 9, 7]);
	JSM.AddPolygonToBody (result, [3, 5, 7]);
	JSM.AddPolygonToBody (result, [3, 7, 11]);
	JSM.AddPolygonToBody (result, [3, 10, 5]);
	JSM.AddPolygonToBody (result, [4, 8, 10]);
	JSM.AddPolygonToBody (result, [6, 11, 9]);
	JSM.AddPolygonToBody (result, [5, 10, 8]);
	JSM.AddPolygonToBody (result, [7, 9, 11]);

	return result;
};

/**
* Function: GenerateTruncatedTetrahedron
* Description: Generates a truncated tetrahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedTetrahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 3.0;

	JSM.AddVertexToBody (result, +a, +a, +b);
	JSM.AddVertexToBody (result, +a, -a, -b);
	JSM.AddVertexToBody (result, -a, -a, +b);
	JSM.AddVertexToBody (result, -a, +a, -b);

	JSM.AddVertexToBody (result, +a, +b, +a);
	JSM.AddVertexToBody (result, +a, -b, -a);
	JSM.AddVertexToBody (result, -a, -b, +a);
	JSM.AddVertexToBody (result, -a, +b, -a);

	JSM.AddVertexToBody (result, +b, +a, +a);
	JSM.AddVertexToBody (result, +b, -a, -a);
	JSM.AddVertexToBody (result, -b, -a, +a);
	JSM.AddVertexToBody (result, -b, +a, -a);

	JSM.AddPolygonToBody (result, [0, 8, 4]);
	JSM.AddPolygonToBody (result, [1, 9, 5]);
	JSM.AddPolygonToBody (result, [2, 10, 6]);
	JSM.AddPolygonToBody (result, [3, 11, 7]);

	JSM.AddPolygonToBody (result, [0, 2, 6, 5, 9, 8]);
	JSM.AddPolygonToBody (result, [0, 4, 7, 11, 10, 2]);
	JSM.AddPolygonToBody (result, [1, 3, 7, 4, 8, 9]);
	JSM.AddPolygonToBody (result, [1, 5, 6, 10, 11, 3]);

	return result;
};

/**
* Function: GenerateCuboctahedron
* Description: Generates a cuboctahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateCuboctahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;

	JSM.AddVertexToBody (result, +a, +a, +b);
	JSM.AddVertexToBody (result, +a, -a, +b);
	JSM.AddVertexToBody (result, -a, -a, +b);
	JSM.AddVertexToBody (result, -a, +a, +b);

	JSM.AddVertexToBody (result, +a, +b, +a);
	JSM.AddVertexToBody (result, +a, +b, -a);
	JSM.AddVertexToBody (result, -a, +b, +a);
	JSM.AddVertexToBody (result, -a, +b, -a);

	JSM.AddVertexToBody (result, +b, +a, +a);
	JSM.AddVertexToBody (result, +b, -a, -a);
	JSM.AddVertexToBody (result, +b, -a, +a);
	JSM.AddVertexToBody (result, +b, +a, -a);

	JSM.AddPolygonToBody (result, [0, 5, 11]);
	JSM.AddPolygonToBody (result, [0, 8, 4]);
	JSM.AddPolygonToBody (result, [1, 4, 10]);
	JSM.AddPolygonToBody (result, [1, 9, 5]);
	JSM.AddPolygonToBody (result, [2, 7, 9]);
	JSM.AddPolygonToBody (result, [2, 10, 6]);
	JSM.AddPolygonToBody (result, [3, 6, 8]);
	JSM.AddPolygonToBody (result, [3, 11, 7]);

	JSM.AddPolygonToBody (result, [0, 4, 1, 5]);
	JSM.AddPolygonToBody (result, [0, 11, 3, 8]);
	JSM.AddPolygonToBody (result, [1, 10, 2, 9]);
	JSM.AddPolygonToBody (result, [2, 6, 3, 7]);
	JSM.AddPolygonToBody (result, [4, 8, 6, 10]);
	JSM.AddPolygonToBody (result, [5, 9, 7, 11]);

	return result;
};

/**
* Function: GenerateTruncatedCube
* Description: Generates a truncated cube.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedCube = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = Math.sqrt (2.0) - 1.0;

	JSM.AddVertexToBody (result, +a, +a, +b);
	JSM.AddVertexToBody (result, +a, +a, -b);
	JSM.AddVertexToBody (result, +a, -a, +b);
	JSM.AddVertexToBody (result, -a, +a, +b);
	JSM.AddVertexToBody (result, +a, -a, -b);
	JSM.AddVertexToBody (result, -a, +a, -b);
	JSM.AddVertexToBody (result, -a, -a, +b);
	JSM.AddVertexToBody (result, -a, -a, -b);

	JSM.AddVertexToBody (result, +a, +b, +a);
	JSM.AddVertexToBody (result, +a, +b, -a);
	JSM.AddVertexToBody (result, +a, -b, +a);
	JSM.AddVertexToBody (result, -a, +b, +a);
	JSM.AddVertexToBody (result, +a, -b, -a);
	JSM.AddVertexToBody (result, -a, +b, -a);
	JSM.AddVertexToBody (result, -a, -b, +a);
	JSM.AddVertexToBody (result, -a, -b, -a);

	JSM.AddVertexToBody (result, +b, +a, +a);
	JSM.AddVertexToBody (result, +b, +a, -a);
	JSM.AddVertexToBody (result, +b, -a, +a);
	JSM.AddVertexToBody (result, -b, +a, +a);
	JSM.AddVertexToBody (result, +b, -a, -a);
	JSM.AddVertexToBody (result, -b, +a, -a);
	JSM.AddVertexToBody (result, -b, -a, +a);
	JSM.AddVertexToBody (result, -b, -a, -a);

	JSM.AddPolygonToBody (result, [0, 16, 8]);
	JSM.AddPolygonToBody (result, [1, 9, 17]);
	JSM.AddPolygonToBody (result, [2, 10, 18]);
	JSM.AddPolygonToBody (result, [3, 11, 19]);
	JSM.AddPolygonToBody (result, [4, 20, 12]);
	JSM.AddPolygonToBody (result, [5, 21, 13]);
	JSM.AddPolygonToBody (result, [6, 22, 14]);
	JSM.AddPolygonToBody (result, [7, 15, 23]);

	JSM.AddPolygonToBody (result, [0, 1, 17, 21, 5, 3, 19, 16]);
	JSM.AddPolygonToBody (result, [0, 8, 10, 2, 4, 12, 9, 1]);
	JSM.AddPolygonToBody (result, [2, 18, 22, 6, 7, 23, 20, 4]);
	JSM.AddPolygonToBody (result, [3, 5, 13, 15, 7, 6, 14, 11]);
	JSM.AddPolygonToBody (result, [8, 16, 19, 11, 14, 22, 18, 10]);
	JSM.AddPolygonToBody (result, [9, 12, 20, 23, 15, 13, 21, 17]);

	return result;
};

/**
* Function: GenerateTruncatedOctahedron
* Description: Generates a truncated octahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedOctahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;
	var c = 2.0;

	JSM.AddVertexToBody (result, +b, +a, +c);
	JSM.AddVertexToBody (result, +b, +a, -c);
	JSM.AddVertexToBody (result, +b, -a, +c);
	JSM.AddVertexToBody (result, +b, -a, -c);

	JSM.AddVertexToBody (result, +b, +c, +a);
	JSM.AddVertexToBody (result, +b, -c, +a);
	JSM.AddVertexToBody (result, +b, +c, -a);
	JSM.AddVertexToBody (result, +b, -c, -a);

	JSM.AddVertexToBody (result, +a, +b, +c);
	JSM.AddVertexToBody (result, +a, +b, -c);
	JSM.AddVertexToBody (result, -a, +b, +c);
	JSM.AddVertexToBody (result, -a, +b, -c);

	JSM.AddVertexToBody (result, +a, +c, +b);
	JSM.AddVertexToBody (result, +a, -c, +b);
	JSM.AddVertexToBody (result, -a, +c, +b);
	JSM.AddVertexToBody (result, -a, -c, +b);

	JSM.AddVertexToBody (result, +c, +b, +a);
	JSM.AddVertexToBody (result, -c, +b, +a);
	JSM.AddVertexToBody (result, +c, +b, -a);
	JSM.AddVertexToBody (result, -c, +b, -a);

	JSM.AddVertexToBody (result, +c, +a, +b);
	JSM.AddVertexToBody (result, -c, +a, +b);
	JSM.AddVertexToBody (result, +c, -a, +b);
	JSM.AddVertexToBody (result, -c, -a, +b);

	JSM.AddPolygonToBody (result, [0, 10, 2, 8]);
	JSM.AddPolygonToBody (result, [1, 9, 3, 11]);
	JSM.AddPolygonToBody (result, [4, 12, 6, 14]);
	JSM.AddPolygonToBody (result, [5, 15, 7, 13]);
	JSM.AddPolygonToBody (result, [16, 22, 18, 20]);
	JSM.AddPolygonToBody (result, [17, 21, 19, 23]);

	JSM.AddPolygonToBody (result, [0, 4, 14, 21, 17, 10]);
	JSM.AddPolygonToBody (result, [0, 8, 16, 20, 12, 4]);
	JSM.AddPolygonToBody (result, [1, 6, 12, 20, 18, 9]);
	JSM.AddPolygonToBody (result, [1, 11, 19, 21, 14, 6]);
	JSM.AddPolygonToBody (result, [2, 5, 13, 22, 16, 8]);
	JSM.AddPolygonToBody (result, [2, 10, 17, 23, 15, 5]);
	JSM.AddPolygonToBody (result, [3, 7, 15, 23, 19, 11]);
	JSM.AddPolygonToBody (result, [3, 9, 18, 22, 13, 7]);

	return result;
};

/**
* Function: GenerateRhombicuboctahedron
* Description: Generates a rhombicuboctahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateRhombicuboctahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 1.0 + Math.sqrt (2.0);

	JSM.AddVertexToBody (result, +a, +a, +b);
	JSM.AddVertexToBody (result, +a, +a, -b);
	JSM.AddVertexToBody (result, +a, -a, +b);
	JSM.AddVertexToBody (result, -a, +a, +b);
	JSM.AddVertexToBody (result, +a, -a, -b);
	JSM.AddVertexToBody (result, -a, +a, -b);
	JSM.AddVertexToBody (result, -a, -a, +b);
	JSM.AddVertexToBody (result, -a, -a, -b);

	JSM.AddVertexToBody (result, +a, +b, +a);
	JSM.AddVertexToBody (result, +a, +b, -a);
	JSM.AddVertexToBody (result, +a, -b, +a);
	JSM.AddVertexToBody (result, -a, +b, +a);
	JSM.AddVertexToBody (result, +a, -b, -a);
	JSM.AddVertexToBody (result, -a, +b, -a);
	JSM.AddVertexToBody (result, -a, -b, +a);
	JSM.AddVertexToBody (result, -a, -b, -a);

	JSM.AddVertexToBody (result, +b, +a, +a);
	JSM.AddVertexToBody (result, +b, +a, -a);
	JSM.AddVertexToBody (result, +b, -a, +a);
	JSM.AddVertexToBody (result, -b, +a, +a);
	JSM.AddVertexToBody (result, +b, -a, -a);
	JSM.AddVertexToBody (result, -b, +a, -a);
	JSM.AddVertexToBody (result, -b, -a, +a);
	JSM.AddVertexToBody (result, -b, -a, -a);

	JSM.AddPolygonToBody (result, [0, 16, 8]);
	JSM.AddPolygonToBody (result, [1, 9, 17]);
	JSM.AddPolygonToBody (result, [2, 10, 18]);
	JSM.AddPolygonToBody (result, [3, 11, 19]);
	JSM.AddPolygonToBody (result, [4, 20, 12]);
	JSM.AddPolygonToBody (result, [5, 21, 13]);
	JSM.AddPolygonToBody (result, [6, 22, 14]);
	JSM.AddPolygonToBody (result, [7, 15, 23]);

	JSM.AddPolygonToBody (result, [0, 2, 18, 16]);
	JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
	JSM.AddPolygonToBody (result, [0, 8, 11, 3]);
	JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
	JSM.AddPolygonToBody (result, [1, 5, 13, 9]);
	JSM.AddPolygonToBody (result, [1, 17, 20, 4]);
	JSM.AddPolygonToBody (result, [2, 6, 14, 10]);
	JSM.AddPolygonToBody (result, [3, 19, 22, 6]);
	JSM.AddPolygonToBody (result, [4, 12, 15, 7]);
	JSM.AddPolygonToBody (result, [5, 7, 23, 21]);
	JSM.AddPolygonToBody (result, [8, 9, 13, 11]);
	JSM.AddPolygonToBody (result, [8, 16, 17, 9]);
	JSM.AddPolygonToBody (result, [10, 12, 20, 18]);
	JSM.AddPolygonToBody (result, [10, 14, 15, 12]);
	JSM.AddPolygonToBody (result, [11, 13, 21, 19]);
	JSM.AddPolygonToBody (result, [14, 22, 23, 15]);
	JSM.AddPolygonToBody (result, [16, 18, 20, 17]);
	JSM.AddPolygonToBody (result, [19, 21, 23, 22]);

	return result;
};

/**
* Function: GenerateTruncatedCuboctahedron
* Description: Generates a truncated cuboctahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedCuboctahedron = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 1.0 + Math.sqrt (2.0);
	var c = 1.0 + 2.0 * Math.sqrt (2.0);

	JSM.AddVertexToBody (result, +a, +b, +c);
	JSM.AddVertexToBody (result, +a, +b, -c);
	JSM.AddVertexToBody (result, +a, -b, +c);
	JSM.AddVertexToBody (result, -a, +b, +c);
	JSM.AddVertexToBody (result, +a, -b, -c);
	JSM.AddVertexToBody (result, -a, +b, -c);
	JSM.AddVertexToBody (result, -a, -b, +c);
	JSM.AddVertexToBody (result, -a, -b, -c);

	JSM.AddVertexToBody (result, +a, +c, +b);
	JSM.AddVertexToBody (result, +a, -c, +b);
	JSM.AddVertexToBody (result, +a, +c, -b);
	JSM.AddVertexToBody (result, -a, +c, +b);
	JSM.AddVertexToBody (result, +a, -c, -b);
	JSM.AddVertexToBody (result, -a, -c, +b);
	JSM.AddVertexToBody (result, -a, +c, -b);
	JSM.AddVertexToBody (result, -a, -c, -b);

	JSM.AddVertexToBody (result, +b, +a, +c);
	JSM.AddVertexToBody (result, +b, +a, -c);
	JSM.AddVertexToBody (result, -b, +a, +c);
	JSM.AddVertexToBody (result, +b, -a, +c);
	JSM.AddVertexToBody (result, -b, +a, -c);
	JSM.AddVertexToBody (result, +b, -a, -c);
	JSM.AddVertexToBody (result, -b, -a, +c);
	JSM.AddVertexToBody (result, -b, -a, -c);

	JSM.AddVertexToBody (result, +b, +c, +a);
	JSM.AddVertexToBody (result, +b, -c, +a);
	JSM.AddVertexToBody (result, -b, +c, +a);
	JSM.AddVertexToBody (result, +b, +c, -a);
	JSM.AddVertexToBody (result, -b, -c, +a);
	JSM.AddVertexToBody (result, +b, -c, -a);
	JSM.AddVertexToBody (result, -b, +c, -a);
	JSM.AddVertexToBody (result, -b, -c, -a);

	JSM.AddVertexToBody (result, +c, +a, +b);
	JSM.AddVertexToBody (result, -c, +a, +b);
	JSM.AddVertexToBody (result, +c, +a, -b);
	JSM.AddVertexToBody (result, +c, -a, +b);
	JSM.AddVertexToBody (result, -c, +a, -b);
	JSM.AddVertexToBody (result, -c, -a, +b);
	JSM.AddVertexToBody (result, +c, -a, -b);
	JSM.AddVertexToBody (result, -c, -a, -b);

	JSM.AddVertexToBody (result, +c, +b, +a);
	JSM.AddVertexToBody (result, -c, +b, +a);
	JSM.AddVertexToBody (result, +c, -b, +a);
	JSM.AddVertexToBody (result, +c, +b, -a);
	JSM.AddVertexToBody (result, -c, -b, +a);
	JSM.AddVertexToBody (result, -c, +b, -a);
	JSM.AddVertexToBody (result, +c, -b, -a);
	JSM.AddVertexToBody (result, -c, -b, -a);

	JSM.AddPolygonToBody (result, [0, 8, 11, 3]);
	JSM.AddPolygonToBody (result, [1, 5, 14, 10]);
	JSM.AddPolygonToBody (result, [2, 6, 13, 9]);
	JSM.AddPolygonToBody (result, [4, 12, 15, 7]);
	JSM.AddPolygonToBody (result, [16, 19, 35, 32]);
	JSM.AddPolygonToBody (result, [17, 34, 38, 21]);
	JSM.AddPolygonToBody (result, [18, 33, 37, 22]);
	JSM.AddPolygonToBody (result, [23, 39, 36, 20]);
	JSM.AddPolygonToBody (result, [24, 40, 43, 27]);
	JSM.AddPolygonToBody (result, [25, 29, 46, 42]);
	JSM.AddPolygonToBody (result, [26, 30, 45, 41]);
	JSM.AddPolygonToBody (result, [28, 44, 47, 31]);

	JSM.AddPolygonToBody (result, [0, 16, 32, 40, 24, 8]);
	JSM.AddPolygonToBody (result, [1, 10, 27, 43, 34, 17]);
	JSM.AddPolygonToBody (result, [2, 9, 25, 42, 35, 19]);
	JSM.AddPolygonToBody (result, [3, 11, 26, 41, 33, 18]);
	JSM.AddPolygonToBody (result, [4, 21, 38, 46, 29, 12]);
	JSM.AddPolygonToBody (result, [5, 20, 36, 45, 30, 14]);
	JSM.AddPolygonToBody (result, [6, 22, 37, 44, 28, 13]);
	JSM.AddPolygonToBody (result, [7, 15, 31, 47, 39, 23]);

	JSM.AddPolygonToBody (result, [0, 3, 18, 22, 6, 2, 19, 16]);
	JSM.AddPolygonToBody (result, [1, 17, 21, 4, 7, 23, 20, 5]);
	JSM.AddPolygonToBody (result, [8, 24, 27, 10, 14, 30, 26, 11]);
	JSM.AddPolygonToBody (result, [9, 13, 28, 31, 15, 12, 29, 25]);
	JSM.AddPolygonToBody (result, [32, 35, 42, 46, 38, 34, 43, 40]);
	JSM.AddPolygonToBody (result, [33, 41, 45, 36, 39, 47, 44, 37]);

	return result;
};

/**
* Function: GenerateSnubCube
* Description: Generates a snub cube.
* Returns:
*	{Body} the result
*/
JSM.GenerateSnubCube = function ()
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = (1.0 / 3.0) * (Math.pow (17 + 3.0 * Math.sqrt (33.0), 1.0 / 3.0) - Math.pow (-17 + 3.0 * Math.sqrt (33.0), 1.0 / 3.0) - 1.0);
	var c = 1.0 / b;

	JSM.AddVertexToBody (result, +a, +b, -c);
	JSM.AddVertexToBody (result, +a, -b, +c);
	JSM.AddVertexToBody (result, -a, +b, +c);
	JSM.AddVertexToBody (result, -a, -b, -c);

	JSM.AddVertexToBody (result, +b, -c, +a);
	JSM.AddVertexToBody (result, -b, +c, +a);
	JSM.AddVertexToBody (result, +b, +c, -a);
	JSM.AddVertexToBody (result, -b, -c, -a);

	JSM.AddVertexToBody (result, -c, +a, +b);
	JSM.AddVertexToBody (result, +c, +a, -b);
	JSM.AddVertexToBody (result, +c, -a, +b);
	JSM.AddVertexToBody (result, -c, -a, -b);

	JSM.AddVertexToBody (result, +a, +c, +b);
	JSM.AddVertexToBody (result, +a, -c, -b);
	JSM.AddVertexToBody (result, -a, +c, -b);
	JSM.AddVertexToBody (result, -a, -c, +b);

	JSM.AddVertexToBody (result, +b, +a, +c);
	JSM.AddVertexToBody (result, -b, +a, -c);
	JSM.AddVertexToBody (result, -b, -a, +c);
	JSM.AddVertexToBody (result, +b, -a, -c);

	JSM.AddVertexToBody (result, +c, +b, +a);
	JSM.AddVertexToBody (result, -c, -b, +a);
	JSM.AddVertexToBody (result, +c, -b, -a);
	JSM.AddVertexToBody (result, -c, +b, -a);

	JSM.AddPolygonToBody (result, [0, 6, 9]);
	JSM.AddPolygonToBody (result, [0, 9, 22]);
	JSM.AddPolygonToBody (result, [0, 17, 6]);
	JSM.AddPolygonToBody (result, [0, 22, 19]);
	JSM.AddPolygonToBody (result, [1, 4, 10]);
	JSM.AddPolygonToBody (result, [1, 10, 20]);
	JSM.AddPolygonToBody (result, [1, 18, 4]);
	JSM.AddPolygonToBody (result, [1, 20, 16]);
	JSM.AddPolygonToBody (result, [2, 5, 8]);
	JSM.AddPolygonToBody (result, [2, 8, 21]);
	JSM.AddPolygonToBody (result, [2, 16, 5]);
	JSM.AddPolygonToBody (result, [2, 21, 18]);
	JSM.AddPolygonToBody (result, [3, 7, 11]);
	JSM.AddPolygonToBody (result, [3, 11, 23]);
	JSM.AddPolygonToBody (result, [3, 19, 7]);
	JSM.AddPolygonToBody (result, [3, 23, 17]);
	JSM.AddPolygonToBody (result, [4, 13, 10]);
	JSM.AddPolygonToBody (result, [4, 18, 15]);
	JSM.AddPolygonToBody (result, [5, 14, 8]);
	JSM.AddPolygonToBody (result, [5, 16, 12]);
	JSM.AddPolygonToBody (result, [6, 12, 9]);
	JSM.AddPolygonToBody (result, [6, 17, 14]);
	JSM.AddPolygonToBody (result, [7, 15, 11]);
	JSM.AddPolygonToBody (result, [7, 19, 13]);
	JSM.AddPolygonToBody (result, [8, 14, 23]);
	JSM.AddPolygonToBody (result, [9, 12, 20]);
	JSM.AddPolygonToBody (result, [10, 13, 22]);
	JSM.AddPolygonToBody (result, [11, 15, 21]);
	JSM.AddPolygonToBody (result, [12, 16, 20]);
	JSM.AddPolygonToBody (result, [13, 19, 22]);
	JSM.AddPolygonToBody (result, [14, 17, 23]);
	JSM.AddPolygonToBody (result, [15, 18, 21]);

	JSM.AddPolygonToBody (result, [0, 19, 3, 17]);
	JSM.AddPolygonToBody (result, [1, 16, 2, 18]);
	JSM.AddPolygonToBody (result, [4, 15, 7, 13]);
	JSM.AddPolygonToBody (result, [5, 12, 6, 14]);
	JSM.AddPolygonToBody (result, [8, 23, 11, 21]);
	JSM.AddPolygonToBody (result, [9, 20, 10, 22]);

	return result;
};

/**
* Function: GenerateIcosidodecahedron
* Description: Generates an icosidodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateIcosidodecahedron = function ()
{
	var result = new JSM.Body ();

	var a = 0.0;
	var b = (1.0 + Math.sqrt (5.0)) / 2.0;
	var c = 1.0 / 2.0;
	var d = b / 2.0;
	var e = (1.0 + b) / 2.0;

	JSM.AddVertexToBody (result, +a, +a, +b);
	JSM.AddVertexToBody (result, +a, +a, -b);
	JSM.AddVertexToBody (result, +a, +b, +a);
	JSM.AddVertexToBody (result, +a, -b, +a);
	JSM.AddVertexToBody (result, +b, +a, +a);
	JSM.AddVertexToBody (result, -b, +a, +a);

	JSM.AddVertexToBody (result, +c, +d, +e);
	JSM.AddVertexToBody (result, +c, +d, -e);
	JSM.AddVertexToBody (result, +c, -d, +e);
	JSM.AddVertexToBody (result, -c, +d, +e);
	JSM.AddVertexToBody (result, +c, -d, -e);
	JSM.AddVertexToBody (result, -c, +d, -e);
	JSM.AddVertexToBody (result, -c, -d, +e);
	JSM.AddVertexToBody (result, -c, -d, -e);

	JSM.AddVertexToBody (result, +d, +e, +c);
	JSM.AddVertexToBody (result, +d, -e, +c);
	JSM.AddVertexToBody (result, -d, +e, +c);
	JSM.AddVertexToBody (result, +d, +e, -c);
	JSM.AddVertexToBody (result, -d, -e, +c);
	JSM.AddVertexToBody (result, +d, -e, -c);
	JSM.AddVertexToBody (result, -d, +e, -c);
	JSM.AddVertexToBody (result, -d, -e, -c);

	JSM.AddVertexToBody (result, +e, +c, +d);
	JSM.AddVertexToBody (result, -e, +c, +d);
	JSM.AddVertexToBody (result, +e, +c, -d);
	JSM.AddVertexToBody (result, +e, -c, +d);
	JSM.AddVertexToBody (result, -e, +c, -d);
	JSM.AddVertexToBody (result, -e, -c, +d);
	JSM.AddVertexToBody (result, +e, -c, -d);
	JSM.AddVertexToBody (result, -e, -c, -d);

	JSM.AddPolygonToBody (result, [0, 6, 9]);
	JSM.AddPolygonToBody (result, [0, 12, 8]);
	JSM.AddPolygonToBody (result, [1, 10, 13]);
	JSM.AddPolygonToBody (result, [1, 11, 7]);
	JSM.AddPolygonToBody (result, [2, 14, 17]);
	JSM.AddPolygonToBody (result, [2, 20, 16]);
	JSM.AddPolygonToBody (result, [3, 18, 21]);
	JSM.AddPolygonToBody (result, [3, 19, 15]);
	JSM.AddPolygonToBody (result, [4, 22, 25]);
	JSM.AddPolygonToBody (result, [4, 28, 24]);
	JSM.AddPolygonToBody (result, [5, 26, 29]);
	JSM.AddPolygonToBody (result, [5, 27, 23]);
	JSM.AddPolygonToBody (result, [6, 22, 14]);
	JSM.AddPolygonToBody (result, [7, 17, 24]);
	JSM.AddPolygonToBody (result, [8, 15, 25]);
	JSM.AddPolygonToBody (result, [9, 16, 23]);
	JSM.AddPolygonToBody (result, [10, 28, 19]);
	JSM.AddPolygonToBody (result, [11, 26, 20]);
	JSM.AddPolygonToBody (result, [12, 27, 18]);
	JSM.AddPolygonToBody (result, [13, 21, 29]);

	JSM.AddPolygonToBody (result, [0, 8, 25, 22, 6]);
	JSM.AddPolygonToBody (result, [0, 9, 23, 27, 12]);
	JSM.AddPolygonToBody (result, [1, 7, 24, 28, 10]);
	JSM.AddPolygonToBody (result, [1, 13, 29, 26, 11]);
	JSM.AddPolygonToBody (result, [2, 16, 9, 6, 14]);
	JSM.AddPolygonToBody (result, [2, 17, 7, 11, 20]);
	JSM.AddPolygonToBody (result, [3, 15, 8, 12, 18]);
	JSM.AddPolygonToBody (result, [3, 21, 13, 10, 19]);
	JSM.AddPolygonToBody (result, [4, 24, 17, 14, 22]);
	JSM.AddPolygonToBody (result, [4, 25, 15, 19, 28]);
	JSM.AddPolygonToBody (result, [5, 23, 16, 20, 26]);
	JSM.AddPolygonToBody (result, [5, 29, 21, 18, 27]);

	return result;
};

/**
* Function: GenerateTruncatedDodecahedron
* Description: Generates a truncated dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedDodecahedron = function ()
{
	var result = new JSM.Body ();

	var a = 0.0;
	var b = 2.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;
	var d = 1.0 / c;
	var e = 2.0 + c;
	var f = 2.0 * c;
	var g = Math.pow (c, 2.0);

	JSM.AddVertexToBody (result, +a, +d, +e);
	JSM.AddVertexToBody (result, +a, +d, -e);
	JSM.AddVertexToBody (result, +a, -d, +e);
	JSM.AddVertexToBody (result, +a, -d, -e);

	JSM.AddVertexToBody (result, +e, +a, +d);
	JSM.AddVertexToBody (result, -e, +a, +d);
	JSM.AddVertexToBody (result, +e, +a, -d);
	JSM.AddVertexToBody (result, -e, +a, -d);

	JSM.AddVertexToBody (result, +d, +e, +a);
	JSM.AddVertexToBody (result, +d, -e, +a);
	JSM.AddVertexToBody (result, -d, +e, +a);
	JSM.AddVertexToBody (result, -d, -e, +a);

	JSM.AddVertexToBody (result, +d, +c, +f);
	JSM.AddVertexToBody (result, +d, +c, -f);
	JSM.AddVertexToBody (result, +d, -c, +f);
	JSM.AddVertexToBody (result, -d, +c, +f);
	JSM.AddVertexToBody (result, +d, -c, -f);
	JSM.AddVertexToBody (result, -d, +c, -f);
	JSM.AddVertexToBody (result, -d, -c, +f);
	JSM.AddVertexToBody (result, -d, -c, -f);

	JSM.AddVertexToBody (result, +f, +d, +c);
	JSM.AddVertexToBody (result, +f, +d, -c);
	JSM.AddVertexToBody (result, +f, -d, +c);
	JSM.AddVertexToBody (result, -f, +d, +c);
	JSM.AddVertexToBody (result, +f, -d, -c);
	JSM.AddVertexToBody (result, -f, +d, -c);
	JSM.AddVertexToBody (result, -f, -d, +c);
	JSM.AddVertexToBody (result, -f, -d, -c);

	JSM.AddVertexToBody (result, +c, +f, +d);
	JSM.AddVertexToBody (result, +c, +f, -d);
	JSM.AddVertexToBody (result, +c, -f, +d);
	JSM.AddVertexToBody (result, -c, +f, +d);
	JSM.AddVertexToBody (result, +c, -f, -d);
	JSM.AddVertexToBody (result, -c, +f, -d);
	JSM.AddVertexToBody (result, -c, -f, +d);
	JSM.AddVertexToBody (result, -c, -f, -d);

	JSM.AddVertexToBody (result, +c, +b, +g);
	JSM.AddVertexToBody (result, +c, +b, -g);
	JSM.AddVertexToBody (result, +c, -b, +g);
	JSM.AddVertexToBody (result, -c, +b, +g);
	JSM.AddVertexToBody (result, +c, -b, -g);
	JSM.AddVertexToBody (result, -c, +b, -g);
	JSM.AddVertexToBody (result, -c, -b, +g);
	JSM.AddVertexToBody (result, -c, -b, -g);

	JSM.AddVertexToBody (result, +g, +c, +b);
	JSM.AddVertexToBody (result, +g, +c, -b);
	JSM.AddVertexToBody (result, +g, -c, +b);
	JSM.AddVertexToBody (result, -g, +c, +b);
	JSM.AddVertexToBody (result, +g, -c, -b);
	JSM.AddVertexToBody (result, -g, +c, -b);
	JSM.AddVertexToBody (result, -g, -c, +b);
	JSM.AddVertexToBody (result, -g, -c, -b);

	JSM.AddVertexToBody (result, +b, +g, +c);
	JSM.AddVertexToBody (result, +b, +g, -c);
	JSM.AddVertexToBody (result, +b, -g, +c);
	JSM.AddVertexToBody (result, -b, +g, +c);
	JSM.AddVertexToBody (result, +b, -g, -c);
	JSM.AddVertexToBody (result, -b, +g, -c);
	JSM.AddVertexToBody (result, -b, -g, +c);
	JSM.AddVertexToBody (result, -b, -g, -c);

	JSM.AddPolygonToBody (result, [0, 12, 15]);
	JSM.AddPolygonToBody (result, [1, 17, 13]);
	JSM.AddPolygonToBody (result, [2, 18, 14]);
	JSM.AddPolygonToBody (result, [3, 16, 19]);
	JSM.AddPolygonToBody (result, [4, 20, 22]);
	JSM.AddPolygonToBody (result, [5, 26, 23]);
	JSM.AddPolygonToBody (result, [6, 24, 21]);
	JSM.AddPolygonToBody (result, [7, 25, 27]);
	JSM.AddPolygonToBody (result, [8, 28, 29]);
	JSM.AddPolygonToBody (result, [9, 32, 30]);
	JSM.AddPolygonToBody (result, [10, 33, 31]);
	JSM.AddPolygonToBody (result, [11, 34, 35]);
	JSM.AddPolygonToBody (result, [36, 44, 52]);
	JSM.AddPolygonToBody (result, [37, 53, 45]);
	JSM.AddPolygonToBody (result, [38, 54, 46]);
	JSM.AddPolygonToBody (result, [39, 55, 47]);
	JSM.AddPolygonToBody (result, [40, 48, 56]);
	JSM.AddPolygonToBody (result, [41, 49, 57]);
	JSM.AddPolygonToBody (result, [42, 50, 58]);
	JSM.AddPolygonToBody (result, [43, 59, 51]);

	JSM.AddPolygonToBody (result, [0, 2, 14, 38, 46, 22, 20, 44, 36, 12]);
	JSM.AddPolygonToBody (result, [0, 15, 39, 47, 23, 26, 50, 42, 18, 2]);
	JSM.AddPolygonToBody (result, [1, 3, 19, 43, 51, 27, 25, 49, 41, 17]);
	JSM.AddPolygonToBody (result, [1, 13, 37, 45, 21, 24, 48, 40, 16, 3]);
	JSM.AddPolygonToBody (result, [4, 6, 21, 45, 53, 29, 28, 52, 44, 20]);
	JSM.AddPolygonToBody (result, [4, 22, 46, 54, 30, 32, 56, 48, 24, 6]);
	JSM.AddPolygonToBody (result, [5, 7, 27, 51, 59, 35, 34, 58, 50, 26]);
	JSM.AddPolygonToBody (result, [5, 23, 47, 55, 31, 33, 57, 49, 25, 7]);
	JSM.AddPolygonToBody (result, [8, 10, 31, 55, 39, 15, 12, 36, 52, 28]);
	JSM.AddPolygonToBody (result, [8, 29, 53, 37, 13, 17, 41, 57, 33, 10]);
	JSM.AddPolygonToBody (result, [9, 11, 35, 59, 43, 19, 16, 40, 56, 32]);
	JSM.AddPolygonToBody (result, [9, 30, 54, 38, 14, 18, 42, 58, 34, 11]);

	return result;
};

/**
* Function: GenerateTruncatedIcosahedron
* Description: Generates a truncated icosahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedIcosahedron = function ()
{
	var result = new JSM.Body ();

	var a = 0.0;
	var b = 1.0;
	var c = 2.0;
	var d = (1.0 + Math.sqrt (5.0)) / 2.0;
	var e = 3.0 * d;
	var f = 1.0 + 2.0 * d;
	var g = 2.0 + d;
	var h = 2.0 * d;

	JSM.AddVertexToBody (result, +a, +b, +e);
	JSM.AddVertexToBody (result, +a, +b, -e);
	JSM.AddVertexToBody (result, +a, -b, +e);
	JSM.AddVertexToBody (result, +a, -b, -e);

	JSM.AddVertexToBody (result, +b, +e, +a);
	JSM.AddVertexToBody (result, +b, -e, +a);
	JSM.AddVertexToBody (result, -b, +e, +a);
	JSM.AddVertexToBody (result, -b, -e, +a);

	JSM.AddVertexToBody (result, +e, +a, +b);
	JSM.AddVertexToBody (result, -e, +a, +b);
	JSM.AddVertexToBody (result, +e, +a, -b);
	JSM.AddVertexToBody (result, -e, +a, -b);

	JSM.AddVertexToBody (result, +c, +f, +d);
	JSM.AddVertexToBody (result, +c, +f, -d);
	JSM.AddVertexToBody (result, +c, -f, +d);
	JSM.AddVertexToBody (result, -c, +f, +d);
	JSM.AddVertexToBody (result, +c, -f, -d);
	JSM.AddVertexToBody (result, -c, +f, -d);
	JSM.AddVertexToBody (result, -c, -f, +d);
	JSM.AddVertexToBody (result, -c, -f, -d);

	JSM.AddVertexToBody (result, +f, +d, +c);
	JSM.AddVertexToBody (result, +f, -d, +c);
	JSM.AddVertexToBody (result, -f, +d, +c);
	JSM.AddVertexToBody (result, +f, +d, -c);
	JSM.AddVertexToBody (result, -f, -d, +c);
	JSM.AddVertexToBody (result, +f, -d, -c);
	JSM.AddVertexToBody (result, -f, +d, -c);
	JSM.AddVertexToBody (result, -f, -d, -c);

	JSM.AddVertexToBody (result, +d, +c, +f);
	JSM.AddVertexToBody (result, -d, +c, +f);
	JSM.AddVertexToBody (result, +d, +c, -f);
	JSM.AddVertexToBody (result, +d, -c, +f);
	JSM.AddVertexToBody (result, -d, +c, -f);
	JSM.AddVertexToBody (result, -d, -c, +f);
	JSM.AddVertexToBody (result, +d, -c, -f);
	JSM.AddVertexToBody (result, -d, -c, -f);

	JSM.AddVertexToBody (result, +b, +g, +h);
	JSM.AddVertexToBody (result, +b, +g, -h);
	JSM.AddVertexToBody (result, +b, -g, +h);
	JSM.AddVertexToBody (result, -b, +g, +h);
	JSM.AddVertexToBody (result, +b, -g, -h);
	JSM.AddVertexToBody (result, -b, +g, -h);
	JSM.AddVertexToBody (result, -b, -g, +h);
	JSM.AddVertexToBody (result, -b, -g, -h);

	JSM.AddVertexToBody (result, +g, +h, +b);
	JSM.AddVertexToBody (result, +g, -h, +b);
	JSM.AddVertexToBody (result, -g, +h, +b);
	JSM.AddVertexToBody (result, +g, +h, -b);
	JSM.AddVertexToBody (result, -g, -h, +b);
	JSM.AddVertexToBody (result, +g, -h, -b);
	JSM.AddVertexToBody (result, -g, +h, -b);
	JSM.AddVertexToBody (result, -g, -h, -b);

	JSM.AddVertexToBody (result, +h, +b, +g);
	JSM.AddVertexToBody (result, -h, +b, +g);
	JSM.AddVertexToBody (result, +h, +b, -g);
	JSM.AddVertexToBody (result, +h, -b, +g);
	JSM.AddVertexToBody (result, -h, +b, -g);
	JSM.AddVertexToBody (result, -h, -b, +g);
	JSM.AddVertexToBody (result, +h, -b, -g);
	JSM.AddVertexToBody (result, -h, -b, -g);

	JSM.AddPolygonToBody (result, [0, 28, 36, 39, 29]);
	JSM.AddPolygonToBody (result, [1, 32, 41, 37, 30]);
	JSM.AddPolygonToBody (result, [2, 33, 42, 38, 31]);
	JSM.AddPolygonToBody (result, [3, 34, 40, 43, 35]);
	JSM.AddPolygonToBody (result, [4, 12, 44, 47, 13]);
	JSM.AddPolygonToBody (result, [5, 16, 49, 45, 14]);
	JSM.AddPolygonToBody (result, [6, 17, 50, 46, 15]);
	JSM.AddPolygonToBody (result, [7, 18, 48, 51, 19]);
	JSM.AddPolygonToBody (result, [8, 20, 52, 55, 21]);
	JSM.AddPolygonToBody (result, [9, 24, 57, 53, 22]);
	JSM.AddPolygonToBody (result, [10, 25, 58, 54, 23]);
	JSM.AddPolygonToBody (result, [11, 26, 56, 59, 27]);

	JSM.AddPolygonToBody (result, [0, 2, 31, 55, 52, 28]);
	JSM.AddPolygonToBody (result, [0, 29, 53, 57, 33, 2]);
	JSM.AddPolygonToBody (result, [1, 3, 35, 59, 56, 32]);
	JSM.AddPolygonToBody (result, [1, 30, 54, 58, 34, 3]);
	JSM.AddPolygonToBody (result, [4, 6, 15, 39, 36, 12]);
	JSM.AddPolygonToBody (result, [4, 13, 37, 41, 17, 6]);
	JSM.AddPolygonToBody (result, [5, 7, 19, 43, 40, 16]);
	JSM.AddPolygonToBody (result, [5, 14, 38, 42, 18, 7]);
	JSM.AddPolygonToBody (result, [8, 10, 23, 47, 44, 20]);
	JSM.AddPolygonToBody (result, [8, 21, 45, 49, 25, 10]);
	JSM.AddPolygonToBody (result, [9, 11, 27, 51, 48, 24]);
	JSM.AddPolygonToBody (result, [9, 22, 46, 50, 26, 11]);
	JSM.AddPolygonToBody (result, [12, 36, 28, 52, 20, 44]);
	JSM.AddPolygonToBody (result, [13, 47, 23, 54, 30, 37]);
	JSM.AddPolygonToBody (result, [14, 45, 21, 55, 31, 38]);
	JSM.AddPolygonToBody (result, [15, 46, 22, 53, 29, 39]);
	JSM.AddPolygonToBody (result, [16, 40, 34, 58, 25, 49]);
	JSM.AddPolygonToBody (result, [17, 41, 32, 56, 26, 50]);
	JSM.AddPolygonToBody (result, [18, 42, 33, 57, 24, 48]);
	JSM.AddPolygonToBody (result, [19, 51, 27, 59, 35, 43]);

	return result;
};

/**
* Function: GenerateRhombicosidodecahedron
* Description: Generates a rhombicosidodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateRhombicosidodecahedron = function ()
{
	var result = new JSM.Body ();

	var a = 0.0;
	var b = 1.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;
	var d = Math.pow (c, 2.0);
	var e = Math.pow (c, 3.0);
	var f = 2.0 * c;
	var g = 2.0 + c;

	JSM.AddVertexToBody (result, +b, +b, +e);
	JSM.AddVertexToBody (result, +b, +b, -e);
	JSM.AddVertexToBody (result, +b, -b, +e);
	JSM.AddVertexToBody (result, -b, +b, +e);
	JSM.AddVertexToBody (result, +b, -b, -e);
	JSM.AddVertexToBody (result, -b, +b, -e);
	JSM.AddVertexToBody (result, -b, -b, +e);
	JSM.AddVertexToBody (result, -b, -b, -e);

	JSM.AddVertexToBody (result, +e, +b, +b);
	JSM.AddVertexToBody (result, +e, +b, -b);
	JSM.AddVertexToBody (result, +e, -b, +b);
	JSM.AddVertexToBody (result, -e, +b, +b);
	JSM.AddVertexToBody (result, +e, -b, -b);
	JSM.AddVertexToBody (result, -e, +b, -b);
	JSM.AddVertexToBody (result, -e, -b, +b);
	JSM.AddVertexToBody (result, -e, -b, -b);

	JSM.AddVertexToBody (result, +b, +e, +b);
	JSM.AddVertexToBody (result, +b, +e, -b);
	JSM.AddVertexToBody (result, +b, -e, +b);
	JSM.AddVertexToBody (result, -b, +e, +b);
	JSM.AddVertexToBody (result, +b, -e, -b);
	JSM.AddVertexToBody (result, -b, +e, -b);
	JSM.AddVertexToBody (result, -b, -e, +b);
	JSM.AddVertexToBody (result, -b, -e, -b);

	JSM.AddVertexToBody (result, +d, +c, +f);
	JSM.AddVertexToBody (result, +d, +c, -f);
	JSM.AddVertexToBody (result, +d, -c, +f);
	JSM.AddVertexToBody (result, -d, +c, +f);
	JSM.AddVertexToBody (result, +d, -c, -f);
	JSM.AddVertexToBody (result, -d, +c, -f);
	JSM.AddVertexToBody (result, -d, -c, +f);
	JSM.AddVertexToBody (result, -d, -c, -f);

	JSM.AddVertexToBody (result, +f, +d, +c);
	JSM.AddVertexToBody (result, +f, +d, -c);
	JSM.AddVertexToBody (result, +f, -d, +c);
	JSM.AddVertexToBody (result, -f, +d, +c);
	JSM.AddVertexToBody (result, +f, -d, -c);
	JSM.AddVertexToBody (result, -f, +d, -c);
	JSM.AddVertexToBody (result, -f, -d, +c);
	JSM.AddVertexToBody (result, -f, -d, -c);

	JSM.AddVertexToBody (result, +c, +f, +d);
	JSM.AddVertexToBody (result, +c, +f, -d);
	JSM.AddVertexToBody (result, +c, -f, +d);
	JSM.AddVertexToBody (result, -c, +f, +d);
	JSM.AddVertexToBody (result, +c, -f, -d);
	JSM.AddVertexToBody (result, -c, +f, -d);
	JSM.AddVertexToBody (result, -c, -f, +d);
	JSM.AddVertexToBody (result, -c, -f, -d);

	JSM.AddVertexToBody (result, +g, +a, +d);
	JSM.AddVertexToBody (result, +g, +a, -d);
	JSM.AddVertexToBody (result, -g, +a, +d);
	JSM.AddVertexToBody (result, -g, +a, -d);

	JSM.AddVertexToBody (result, +d, +g, +a);
	JSM.AddVertexToBody (result, -d, +g, +a);
	JSM.AddVertexToBody (result, +d, -g, +a);
	JSM.AddVertexToBody (result, -d, -g, +a);

	JSM.AddVertexToBody (result, +a, +d, +g);
	JSM.AddVertexToBody (result, +a, -d, +g);
	JSM.AddVertexToBody (result, +a, +d, -g);
	JSM.AddVertexToBody (result, +a, -d, -g);

	JSM.AddPolygonToBody (result, [0, 56, 3]);
	JSM.AddPolygonToBody (result, [1, 5, 58]);
	JSM.AddPolygonToBody (result, [2, 6, 57]);
	JSM.AddPolygonToBody (result, [4, 59, 7]);
	JSM.AddPolygonToBody (result, [8, 48, 10]);
	JSM.AddPolygonToBody (result, [9, 12, 49]);
	JSM.AddPolygonToBody (result, [11, 14, 50]);
	JSM.AddPolygonToBody (result, [13, 51, 15]);
	JSM.AddPolygonToBody (result, [16, 52, 17]);
	JSM.AddPolygonToBody (result, [18, 20, 54]);
	JSM.AddPolygonToBody (result, [19, 21, 53]);
	JSM.AddPolygonToBody (result, [22, 55, 23]);
	JSM.AddPolygonToBody (result, [24, 32, 40]);
	JSM.AddPolygonToBody (result, [25, 41, 33]);
	JSM.AddPolygonToBody (result, [26, 42, 34]);
	JSM.AddPolygonToBody (result, [27, 43, 35]);
	JSM.AddPolygonToBody (result, [28, 36, 44]);
	JSM.AddPolygonToBody (result, [29, 37, 45]);
	JSM.AddPolygonToBody (result, [30, 38, 46]);
	JSM.AddPolygonToBody (result, [31, 47, 39]);

	JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
	JSM.AddPolygonToBody (result, [0, 24, 40, 56]);
	JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
	JSM.AddPolygonToBody (result, [1, 58, 41, 25]);
	JSM.AddPolygonToBody (result, [2, 57, 42, 26]);
	JSM.AddPolygonToBody (result, [3, 56, 43, 27]);
	JSM.AddPolygonToBody (result, [4, 28, 44, 59]);
	JSM.AddPolygonToBody (result, [5, 29, 45, 58]);
	JSM.AddPolygonToBody (result, [6, 30, 46, 57]);
	JSM.AddPolygonToBody (result, [7, 59, 47, 31]);
	JSM.AddPolygonToBody (result, [8, 10, 12, 9]);
	JSM.AddPolygonToBody (result, [8, 32, 24, 48]);
	JSM.AddPolygonToBody (result, [9, 49, 25, 33]);
	JSM.AddPolygonToBody (result, [10, 48, 26, 34]);
	JSM.AddPolygonToBody (result, [11, 13, 15, 14]);
	JSM.AddPolygonToBody (result, [11, 50, 27, 35]);
	JSM.AddPolygonToBody (result, [12, 36, 28, 49]);
	JSM.AddPolygonToBody (result, [13, 37, 29, 51]);
	JSM.AddPolygonToBody (result, [14, 38, 30, 50]);
	JSM.AddPolygonToBody (result, [15, 51, 31, 39]);
	JSM.AddPolygonToBody (result, [16, 17, 21, 19]);
	JSM.AddPolygonToBody (result, [16, 40, 32, 52]);
	JSM.AddPolygonToBody (result, [17, 52, 33, 41]);
	JSM.AddPolygonToBody (result, [18, 22, 23, 20]);
	JSM.AddPolygonToBody (result, [18, 54, 34, 42]);
	JSM.AddPolygonToBody (result, [19, 53, 35, 43]);
	JSM.AddPolygonToBody (result, [20, 44, 36, 54]);
	JSM.AddPolygonToBody (result, [21, 45, 37, 53]);
	JSM.AddPolygonToBody (result, [22, 46, 38, 55]);
	JSM.AddPolygonToBody (result, [23, 55, 39, 47]);

	JSM.AddPolygonToBody (result, [0, 2, 26, 48, 24]);
	JSM.AddPolygonToBody (result, [1, 25, 49, 28, 4]);
	JSM.AddPolygonToBody (result, [3, 27, 50, 30, 6]);
	JSM.AddPolygonToBody (result, [5, 7, 31, 51, 29]);
	JSM.AddPolygonToBody (result, [8, 9, 33, 52, 32]);
	JSM.AddPolygonToBody (result, [10, 34, 54, 36, 12]);
	JSM.AddPolygonToBody (result, [11, 35, 53, 37, 13]);
	JSM.AddPolygonToBody (result, [14, 15, 39, 55, 38]);
	JSM.AddPolygonToBody (result, [16, 19, 43, 56, 40]);
	JSM.AddPolygonToBody (result, [17, 41, 58, 45, 21]);
	JSM.AddPolygonToBody (result, [18, 42, 57, 46, 22]);
	JSM.AddPolygonToBody (result, [20, 23, 47, 59, 44]);

	return result;
};

/**
* Function: GenerateTruncatedIcosidodecahedron
* Description: Generates a truncated icosidodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTruncatedIcosidodecahedron = function ()
{
	var result = new JSM.Body ();

	var a = 2.0;
	var b = (1.0 + Math.sqrt (5.0)) / 2.0;
	var c = 1.0 / b;
	var d = 3.0 + b;
	var e = 2.0 / b;
	var f = 1 + 2.0 * b;
	var g = Math.pow (b, 2.0);
	var h = -1.0 + 3.0 * b;
	var i = -1.0 + 2.0 * b;
	var j = 2.0 + b;
	var k = 3.0;
	var l = 2.0 * b;

	JSM.AddVertexToBody (result, +c, +c, +d);
	JSM.AddVertexToBody (result, +c, +c, -d);
	JSM.AddVertexToBody (result, +c, -c, +d);
	JSM.AddVertexToBody (result, -c, +c, +d);
	JSM.AddVertexToBody (result, +c, -c, -d);
	JSM.AddVertexToBody (result, -c, +c, -d);
	JSM.AddVertexToBody (result, -c, -c, +d);
	JSM.AddVertexToBody (result, -c, -c, -d);

	JSM.AddVertexToBody (result, +c, +d, +c);
	JSM.AddVertexToBody (result, +c, -d, +c);
	JSM.AddVertexToBody (result, -c, +d, +c);
	JSM.AddVertexToBody (result, +c, +d, -c);
	JSM.AddVertexToBody (result, -c, -d, +c);
	JSM.AddVertexToBody (result, +c, -d, -c);
	JSM.AddVertexToBody (result, -c, +d, -c);
	JSM.AddVertexToBody (result, -c, -d, -c);

	JSM.AddVertexToBody (result, +d, +c, +c);
	JSM.AddVertexToBody (result, -d, +c, +c);
	JSM.AddVertexToBody (result, +d, +c, -c);
	JSM.AddVertexToBody (result, +d, -c, +c);
	JSM.AddVertexToBody (result, -d, +c, -c);
	JSM.AddVertexToBody (result, -d, -c, +c);
	JSM.AddVertexToBody (result, +d, -c, -c);
	JSM.AddVertexToBody (result, -d, -c, -c);

	JSM.AddVertexToBody (result, +e, +b, +f);
	JSM.AddVertexToBody (result, +e, +b, -f);
	JSM.AddVertexToBody (result, +e, -b, +f);
	JSM.AddVertexToBody (result, -e, +b, +f);
	JSM.AddVertexToBody (result, +e, -b, -f);
	JSM.AddVertexToBody (result, -e, +b, -f);
	JSM.AddVertexToBody (result, -e, -b, +f);
	JSM.AddVertexToBody (result, -e, -b, -f);

	JSM.AddVertexToBody (result, +b, +f, +e);
	JSM.AddVertexToBody (result, +b, -f, +e);
	JSM.AddVertexToBody (result, -b, +f, +e);
	JSM.AddVertexToBody (result, +b, +f, -e);
	JSM.AddVertexToBody (result, -b, -f, +e);
	JSM.AddVertexToBody (result, +b, -f, -e);
	JSM.AddVertexToBody (result, -b, +f, -e);
	JSM.AddVertexToBody (result, -b, -f, -e);

	JSM.AddVertexToBody (result, +f, +e, +b);
	JSM.AddVertexToBody (result, -f, +e, +b);
	JSM.AddVertexToBody (result, +f, +e, -b);
	JSM.AddVertexToBody (result, +f, -e, +b);
	JSM.AddVertexToBody (result, -f, +e, -b);
	JSM.AddVertexToBody (result, -f, -e, +b);
	JSM.AddVertexToBody (result, +f, -e, -b);
	JSM.AddVertexToBody (result, -f, -e, -b);

	JSM.AddVertexToBody (result, +c, +g, +h);
	JSM.AddVertexToBody (result, +c, +g, -h);
	JSM.AddVertexToBody (result, +c, -g, +h);
	JSM.AddVertexToBody (result, -c, +g, +h);
	JSM.AddVertexToBody (result, +c, -g, -h);
	JSM.AddVertexToBody (result, -c, +g, -h);
	JSM.AddVertexToBody (result, -c, -g, +h);
	JSM.AddVertexToBody (result, -c, -g, -h);

	JSM.AddVertexToBody (result, +g, +h, +c);
	JSM.AddVertexToBody (result, +g, -h, +c);
	JSM.AddVertexToBody (result, -g, +h, +c);
	JSM.AddVertexToBody (result, +g, +h, -c);
	JSM.AddVertexToBody (result, -g, -h, +c);
	JSM.AddVertexToBody (result, +g, -h, -c);
	JSM.AddVertexToBody (result, -g, +h, -c);
	JSM.AddVertexToBody (result, -g, -h, -c);

	JSM.AddVertexToBody (result, +h, +c, +g);
	JSM.AddVertexToBody (result, -h, +c, +g);
	JSM.AddVertexToBody (result, +h, +c, -g);
	JSM.AddVertexToBody (result, +h, -c, +g);
	JSM.AddVertexToBody (result, -h, +c, -g);
	JSM.AddVertexToBody (result, -h, -c, +g);
	JSM.AddVertexToBody (result, +h, -c, -g);
	JSM.AddVertexToBody (result, -h, -c, -g);

	JSM.AddVertexToBody (result, +i, +a, +j);
	JSM.AddVertexToBody (result, +i, +a, -j);
	JSM.AddVertexToBody (result, +i, -a, +j);
	JSM.AddVertexToBody (result, -i, +a, +j);
	JSM.AddVertexToBody (result, +i, -a, -j);
	JSM.AddVertexToBody (result, -i, +a, -j);
	JSM.AddVertexToBody (result, -i, -a, +j);
	JSM.AddVertexToBody (result, -i, -a, -j);

	JSM.AddVertexToBody (result, +a, +j, +i);
	JSM.AddVertexToBody (result, +a, -j, +i);
	JSM.AddVertexToBody (result, -a, +j, +i);
	JSM.AddVertexToBody (result, +a, +j, -i);
	JSM.AddVertexToBody (result, -a, -j, +i);
	JSM.AddVertexToBody (result, +a, -j, -i);
	JSM.AddVertexToBody (result, -a, +j, -i);
	JSM.AddVertexToBody (result, -a, -j, -i);

	JSM.AddVertexToBody (result, +j, +i, +a);
	JSM.AddVertexToBody (result, -j, +i, +a);
	JSM.AddVertexToBody (result, +j, +i, -a);
	JSM.AddVertexToBody (result, +j, -i, +a);
	JSM.AddVertexToBody (result, -j, +i, -a);
	JSM.AddVertexToBody (result, -j, -i, +a);
	JSM.AddVertexToBody (result, +j, -i, -a);
	JSM.AddVertexToBody (result, -j, -i, -a);

	JSM.AddVertexToBody (result, +b, +k, +l);
	JSM.AddVertexToBody (result, +b, +k, -l);
	JSM.AddVertexToBody (result, +b, -k, +l);
	JSM.AddVertexToBody (result, -b, +k, +l);
	JSM.AddVertexToBody (result, +b, -k, -l);
	JSM.AddVertexToBody (result, -b, +k, -l);
	JSM.AddVertexToBody (result, -b, -k, +l);
	JSM.AddVertexToBody (result, -b, -k, -l);

	JSM.AddVertexToBody (result, +k, +l, +b);
	JSM.AddVertexToBody (result, +k, -l, +b);
	JSM.AddVertexToBody (result, -k, +l, +b);
	JSM.AddVertexToBody (result, +k, +l, -b);
	JSM.AddVertexToBody (result, -k, -l, +b);
	JSM.AddVertexToBody (result, +k, -l, -b);
	JSM.AddVertexToBody (result, -k, +l, -b);
	JSM.AddVertexToBody (result, -k, -l, -b);

	JSM.AddVertexToBody (result, +l, +b, +k);
	JSM.AddVertexToBody (result, -l, +b, +k);
	JSM.AddVertexToBody (result, +l, +b, -k);
	JSM.AddVertexToBody (result, +l, -b, +k);
	JSM.AddVertexToBody (result, -l, +b, -k);
	JSM.AddVertexToBody (result, -l, -b, +k);
	JSM.AddVertexToBody (result, +l, -b, -k);
	JSM.AddVertexToBody (result, -l, -b, -k);

	JSM.AddPolygonToBody (result, [0, 3, 6, 2]);
	JSM.AddPolygonToBody (result, [1, 4, 7, 5]);
	JSM.AddPolygonToBody (result, [8, 11, 14, 10]);
	JSM.AddPolygonToBody (result, [9, 12, 15, 13]);
	JSM.AddPolygonToBody (result, [16, 19, 22, 18]);
	JSM.AddPolygonToBody (result, [17, 20, 23, 21]);
	JSM.AddPolygonToBody (result, [24, 72, 96, 48]);
	JSM.AddPolygonToBody (result, [25, 49, 97, 73]);
	JSM.AddPolygonToBody (result, [26, 50, 98, 74]);
	JSM.AddPolygonToBody (result, [27, 51, 99, 75]);
	JSM.AddPolygonToBody (result, [28, 76, 100, 52]);
	JSM.AddPolygonToBody (result, [29, 77, 101, 53]);
	JSM.AddPolygonToBody (result, [30, 78, 102, 54]);
	JSM.AddPolygonToBody (result, [31, 55, 103, 79]);
	JSM.AddPolygonToBody (result, [32, 80, 104, 56]);
	JSM.AddPolygonToBody (result, [33, 57, 105, 81]);
	JSM.AddPolygonToBody (result, [34, 58, 106, 82]);
	JSM.AddPolygonToBody (result, [35, 59, 107, 83]);
	JSM.AddPolygonToBody (result, [36, 84, 108, 60]);
	JSM.AddPolygonToBody (result, [37, 85, 109, 61]);
	JSM.AddPolygonToBody (result, [38, 86, 110, 62]);
	JSM.AddPolygonToBody (result, [39, 63, 111, 87]);
	JSM.AddPolygonToBody (result, [40, 88, 112, 64]);
	JSM.AddPolygonToBody (result, [41, 65, 113, 89]);
	JSM.AddPolygonToBody (result, [42, 66, 114, 90]);
	JSM.AddPolygonToBody (result, [43, 67, 115, 91]);
	JSM.AddPolygonToBody (result, [44, 92, 116, 68]);
	JSM.AddPolygonToBody (result, [45, 93, 117, 69]);
	JSM.AddPolygonToBody (result, [46, 94, 118, 70]);
	JSM.AddPolygonToBody (result, [47, 71, 119, 95]);

	JSM.AddPolygonToBody (result, [0, 24, 48, 51, 27, 3]);
	JSM.AddPolygonToBody (result, [1, 5, 29, 53, 49, 25]);
	JSM.AddPolygonToBody (result, [2, 6, 30, 54, 50, 26]);
	JSM.AddPolygonToBody (result, [4, 28, 52, 55, 31, 7]);
	JSM.AddPolygonToBody (result, [8, 32, 56, 59, 35, 11]);
	JSM.AddPolygonToBody (result, [9, 13, 37, 61, 57, 33]);
	JSM.AddPolygonToBody (result, [10, 14, 38, 62, 58, 34]);
	JSM.AddPolygonToBody (result, [12, 36, 60, 63, 39, 15]);
	JSM.AddPolygonToBody (result, [16, 40, 64, 67, 43, 19]);
	JSM.AddPolygonToBody (result, [17, 21, 45, 69, 65, 41]);
	JSM.AddPolygonToBody (result, [18, 22, 46, 70, 66, 42]);
	JSM.AddPolygonToBody (result, [20, 44, 68, 71, 47, 23]);
	JSM.AddPolygonToBody (result, [72, 112, 88, 104, 80, 96]);
	JSM.AddPolygonToBody (result, [73, 97, 83, 107, 90, 114]);
	JSM.AddPolygonToBody (result, [74, 98, 81, 105, 91, 115]);
	JSM.AddPolygonToBody (result, [75, 99, 82, 106, 89, 113]);
	JSM.AddPolygonToBody (result, [76, 118, 94, 109, 85, 100]);
	JSM.AddPolygonToBody (result, [78, 117, 93, 108, 84, 102]);
	JSM.AddPolygonToBody (result, [79, 103, 87, 111, 95, 119]);
	JSM.AddPolygonToBody (result, [86, 101, 77, 116, 92, 110]);

	JSM.AddPolygonToBody (result, [0, 2, 26, 74, 115, 67, 64, 112, 72, 24]);
	JSM.AddPolygonToBody (result, [1, 25, 73, 114, 66, 70, 118, 76, 28, 4]);
	JSM.AddPolygonToBody (result, [3, 27, 75, 113, 65, 69, 117, 78, 30, 6]);
	JSM.AddPolygonToBody (result, [5, 7, 31, 79, 119, 71, 68, 116, 77, 29]);
	JSM.AddPolygonToBody (result, [8, 10, 34, 82, 99, 51, 48, 96, 80, 32]);
	JSM.AddPolygonToBody (result, [9, 33, 81, 98, 50, 54, 102, 84, 36, 12]);
	JSM.AddPolygonToBody (result, [11, 35, 83, 97, 49, 53, 101, 86, 38, 14]);
	JSM.AddPolygonToBody (result, [13, 15, 39, 87, 103, 55, 52, 100, 85, 37]);
	JSM.AddPolygonToBody (result, [16, 18, 42, 90, 107, 59, 56, 104, 88, 40]);
	JSM.AddPolygonToBody (result, [17, 41, 89, 106, 58, 62, 110, 92, 44, 20]);
	JSM.AddPolygonToBody (result, [19, 43, 91, 105, 57, 61, 109, 94, 46, 22]);
	JSM.AddPolygonToBody (result, [21, 23, 47, 95, 111, 63, 60, 108, 93, 45]);

	return result;
};

/**
* Function: GenerateSnubDodecahedron
* Description: Generates a snub dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateSnubDodecahedron = function ()
{
	var result = new JSM.Body ();

	var a = 2.0;
	var b = (1.0 + Math.sqrt (5.0)) / 2.0;
	var c = Math.pow (b / 2.0 + (1.0 / 2.0) * Math.sqrt (b - (5.0 / 27.0)), 1.0 / 3.0) + Math.pow (b / 2.0 - (1.0 / 2.0) * Math.sqrt (b - (5.0 / 27.0)), 1.0 / 3.0);
	var d = c - (1.0 / c);
	var e = c * b + Math.pow (b, 2.0) + b / c;
	var f = 2.0 * d;
	var g = 2.0 * e;
	var h = d + (e / b) + b;
	var i = -(d * b) + e + (1.0 / b);
	var j = (d / b) + (e * b) - 1.0;
	var k = -(d / b) + (e * b) + 1.0;
	var l = -d + (e / b) - b;
	var m = (d * b) + e - (1.0 / b);
	var n = -(d / b) + (e * b) - 1.0;
	var o = d - (e / b) - b;
	var p = (d * b) + e + (1.0 / b);
	var q = d + (e / b) - b;
	var r = (d * b) - e + (1.0 / b);
	var s = (d / b) + (e * b) + 1.0;

	JSM.AddVertexToBody (result, +f, +a, -g);
	JSM.AddVertexToBody (result, +f, -a, +g);
	JSM.AddVertexToBody (result, -f, +a, +g);
	JSM.AddVertexToBody (result, -f, -a, -g);

	JSM.AddVertexToBody (result, +a, -g, +f);
	JSM.AddVertexToBody (result, -a, +g, +f);
	JSM.AddVertexToBody (result, +a, +g, -f);
	JSM.AddVertexToBody (result, -a, -g, -f);

	JSM.AddVertexToBody (result, -g, +f, +a);
	JSM.AddVertexToBody (result, +g, +f, -a);
	JSM.AddVertexToBody (result, +g, -f, +a);
	JSM.AddVertexToBody (result, -g, -f, -a);

	JSM.AddVertexToBody (result, +h, +i, -j);
	JSM.AddVertexToBody (result, +h, -i, +j);
	JSM.AddVertexToBody (result, -h, +i, +j);
	JSM.AddVertexToBody (result, -h, -i, -j);

	JSM.AddVertexToBody (result, +i, -j, +h);
	JSM.AddVertexToBody (result, -i, +j, +h);
	JSM.AddVertexToBody (result, +i, +j, -h);
	JSM.AddVertexToBody (result, -i, -j, -h);

	JSM.AddVertexToBody (result, -j, +h, +i);
	JSM.AddVertexToBody (result, +j, +h, -i);
	JSM.AddVertexToBody (result, +j, -h, +i);
	JSM.AddVertexToBody (result, -j, -h, -i);

	JSM.AddVertexToBody (result, +k, +l, -m);
	JSM.AddVertexToBody (result, +k, -l, +m);
	JSM.AddVertexToBody (result, -k, +l, +m);
	JSM.AddVertexToBody (result, -k, -l, -m);

	JSM.AddVertexToBody (result, +l, -m, +k);
	JSM.AddVertexToBody (result, -l, +m, +k);
	JSM.AddVertexToBody (result, +l, +m, -k);
	JSM.AddVertexToBody (result, -l, -m, -k);

	JSM.AddVertexToBody (result, -m, +k, +l);
	JSM.AddVertexToBody (result, +m, +k, -l);
	JSM.AddVertexToBody (result, +m, -k, +l);
	JSM.AddVertexToBody (result, -m, -k, -l);

	JSM.AddVertexToBody (result, +n, +o, -p);
	JSM.AddVertexToBody (result, +n, -o, +p);
	JSM.AddVertexToBody (result, -n, +o, +p);
	JSM.AddVertexToBody (result, -n, -o, -p);

	JSM.AddVertexToBody (result, +o, -p, +n);
	JSM.AddVertexToBody (result, -o, +p, +n);
	JSM.AddVertexToBody (result, +o, +p, -n);
	JSM.AddVertexToBody (result, -o, -p, -n);

	JSM.AddVertexToBody (result, -p, +n, +o);
	JSM.AddVertexToBody (result, +p, +n, -o);
	JSM.AddVertexToBody (result, +p, -n, +o);
	JSM.AddVertexToBody (result, -p, -n, -o);

	JSM.AddVertexToBody (result, +q, +r, -s);
	JSM.AddVertexToBody (result, +q, -r, +s);
	JSM.AddVertexToBody (result, -q, +r, +s);
	JSM.AddVertexToBody (result, -q, -r, -s);

	JSM.AddVertexToBody (result, +r, -s, +q);
	JSM.AddVertexToBody (result, -r, +s, +q);
	JSM.AddVertexToBody (result, +r, +s, -q);
	JSM.AddVertexToBody (result, -r, -s, -q);

	JSM.AddVertexToBody (result, -s, +q, +r);
	JSM.AddVertexToBody (result, +s, +q, -r);
	JSM.AddVertexToBody (result, +s, -q, +r);
	JSM.AddVertexToBody (result, -s, -q, -r);

	JSM.AddPolygonToBody (result, [0, 3, 51]);
	JSM.AddPolygonToBody (result, [0, 30, 12]);
	JSM.AddPolygonToBody (result, [0, 48, 3]);
	JSM.AddPolygonToBody (result, [0, 51, 30]);
	JSM.AddPolygonToBody (result, [1, 2, 50]);
	JSM.AddPolygonToBody (result, [1, 28, 13]);
	JSM.AddPolygonToBody (result, [1, 49, 2]);
	JSM.AddPolygonToBody (result, [1, 50, 28]);
	JSM.AddPolygonToBody (result, [2, 29, 14]);
	JSM.AddPolygonToBody (result, [2, 49, 29]);
	JSM.AddPolygonToBody (result, [3, 31, 15]);
	JSM.AddPolygonToBody (result, [3, 48, 31]);
	JSM.AddPolygonToBody (result, [4, 7, 55]);
	JSM.AddPolygonToBody (result, [4, 34, 16]);
	JSM.AddPolygonToBody (result, [4, 52, 7]);
	JSM.AddPolygonToBody (result, [4, 55, 34]);
	JSM.AddPolygonToBody (result, [5, 6, 54]);
	JSM.AddPolygonToBody (result, [5, 32, 17]);
	JSM.AddPolygonToBody (result, [5, 53, 6]);
	JSM.AddPolygonToBody (result, [5, 54, 32]);
	JSM.AddPolygonToBody (result, [6, 33, 18]);
	JSM.AddPolygonToBody (result, [6, 53, 33]);
	JSM.AddPolygonToBody (result, [7, 35, 19]);
	JSM.AddPolygonToBody (result, [7, 52, 35]);
	JSM.AddPolygonToBody (result, [8, 11, 59]);
	JSM.AddPolygonToBody (result, [8, 26, 20]);
	JSM.AddPolygonToBody (result, [8, 56, 11]);
	JSM.AddPolygonToBody (result, [8, 59, 26]);
	JSM.AddPolygonToBody (result, [9, 10, 58]);
	JSM.AddPolygonToBody (result, [9, 24, 21]);
	JSM.AddPolygonToBody (result, [9, 57, 10]);
	JSM.AddPolygonToBody (result, [9, 58, 24]);
	JSM.AddPolygonToBody (result, [10, 25, 22]);
	JSM.AddPolygonToBody (result, [10, 57, 25]);
	JSM.AddPolygonToBody (result, [11, 27, 23]);
	JSM.AddPolygonToBody (result, [11, 56, 27]);
	JSM.AddPolygonToBody (result, [12, 18, 21]);
	JSM.AddPolygonToBody (result, [12, 21, 24]);
	JSM.AddPolygonToBody (result, [12, 30, 18]);
	JSM.AddPolygonToBody (result, [13, 16, 22]);
	JSM.AddPolygonToBody (result, [13, 22, 25]);
	JSM.AddPolygonToBody (result, [13, 28, 16]);
	JSM.AddPolygonToBody (result, [14, 17, 20]);
	JSM.AddPolygonToBody (result, [14, 20, 26]);
	JSM.AddPolygonToBody (result, [14, 29, 17]);
	JSM.AddPolygonToBody (result, [15, 19, 23]);
	JSM.AddPolygonToBody (result, [15, 23, 27]);
	JSM.AddPolygonToBody (result, [15, 31, 19]);
	JSM.AddPolygonToBody (result, [16, 34, 22]);
	JSM.AddPolygonToBody (result, [17, 32, 20]);
	JSM.AddPolygonToBody (result, [18, 33, 21]);
	JSM.AddPolygonToBody (result, [19, 35, 23]);
	JSM.AddPolygonToBody (result, [24, 58, 36]);
	JSM.AddPolygonToBody (result, [25, 57, 37]);
	JSM.AddPolygonToBody (result, [26, 59, 38]);
	JSM.AddPolygonToBody (result, [27, 56, 39]);
	JSM.AddPolygonToBody (result, [28, 50, 40]);
	JSM.AddPolygonToBody (result, [29, 49, 41]);
	JSM.AddPolygonToBody (result, [30, 51, 42]);
	JSM.AddPolygonToBody (result, [31, 48, 43]);
	JSM.AddPolygonToBody (result, [32, 54, 44]);
	JSM.AddPolygonToBody (result, [33, 53, 45]);
	JSM.AddPolygonToBody (result, [34, 55, 46]);
	JSM.AddPolygonToBody (result, [35, 52, 47]);
	JSM.AddPolygonToBody (result, [36, 43, 48]);
	JSM.AddPolygonToBody (result, [36, 46, 43]);
	JSM.AddPolygonToBody (result, [36, 58, 46]);
	JSM.AddPolygonToBody (result, [37, 41, 49]);
	JSM.AddPolygonToBody (result, [37, 45, 41]);
	JSM.AddPolygonToBody (result, [37, 57, 45]);
	JSM.AddPolygonToBody (result, [38, 40, 50]);
	JSM.AddPolygonToBody (result, [38, 47, 40]);
	JSM.AddPolygonToBody (result, [38, 59, 47]);
	JSM.AddPolygonToBody (result, [39, 42, 51]);
	JSM.AddPolygonToBody (result, [39, 44, 42]);
	JSM.AddPolygonToBody (result, [39, 56, 44]);
	JSM.AddPolygonToBody (result, [40, 47, 52]);
	JSM.AddPolygonToBody (result, [41, 45, 53]);
	JSM.AddPolygonToBody (result, [42, 44, 54]);
	JSM.AddPolygonToBody (result, [43, 46, 55]);

	JSM.AddPolygonToBody (result, [0, 12, 24, 36, 48]);
	JSM.AddPolygonToBody (result, [1, 13, 25, 37, 49]);
	JSM.AddPolygonToBody (result, [2, 14, 26, 38, 50]);
	JSM.AddPolygonToBody (result, [3, 15, 27, 39, 51]);
	JSM.AddPolygonToBody (result, [4, 16, 28, 40, 52]);
	JSM.AddPolygonToBody (result, [5, 17, 29, 41, 53]);
	JSM.AddPolygonToBody (result, [6, 18, 30, 42, 54]);
	JSM.AddPolygonToBody (result, [7, 19, 31, 43, 55]);
	JSM.AddPolygonToBody (result, [8, 20, 32, 44, 56]);
	JSM.AddPolygonToBody (result, [9, 21, 33, 45, 57]);
	JSM.AddPolygonToBody (result, [10, 22, 34, 46, 58]);
	JSM.AddPolygonToBody (result, [11, 23, 35, 47, 59]);

	return result;
};

/**
* Function: AddCumulatedPolygonToBody
* Description: Adds polygons to a body by cumulating the original polygons vertex index array.
* Parameters:
*	body {Body} the body
*	vertices {integer[*]} the vertices of the original polygon
*	height {number} the height of the cumulation
*/
JSM.AddCumulatedPolygonToBody = function (body, vertices, height)
{
	function CalculatePolygonCentroidAndNormal (vertices, centroidCoord, normalVector)
	{
		var vertexCoords = [];
		
		var i;
		for (i = 0; i < vertices.length; i++) {
			vertexCoords.push (body.GetVertexPosition (vertices[i]));
		}
		
		var centroid = JSM.CalculateCentroid (vertexCoords);
		var normal = JSM.CalculateNormal (vertexCoords);

		centroidCoord.Set (centroid.x, centroid.y, centroid.z);
		normalVector.Set (normal.x, normal.y, normal.z);
	}

	var centroidCoord = new JSM.Coord (0.0, 0.0, 0.0);
	var normalVector = new JSM.Vector (0.0, 0.0, 0.0);
	CalculatePolygonCentroidAndNormal (vertices, centroidCoord, normalVector);
	centroidCoord = JSM.CoordOffset (centroidCoord, normalVector, height);
	
	var centroid = body.VertexCount ();
	JSM.AddVertexToBody (body, centroidCoord.x, centroidCoord.y, centroidCoord.z);

	var count = vertices.length;

	var i, curr, next;
	for (i = 0; i < count; i++) {
		curr = vertices[i];
		next = vertices [i < count - 1 ? i + 1 : 0];
		JSM.AddPolygonToBody (body, [curr, next, centroid]);
	}
};

/**
* Function: GenerateCumulatedTetrahedron
* Description: Generates a cumulated tetrahedron.
* Parameters:
*	pyramidUnitHeight {number} the unit height of pyramids
* Returns:
*	{Body} the result
*/
JSM.GenerateCumulatedTetrahedron = function (pyramidUnitHeight)
{
	var result = new JSM.Body ();

	var a = 1.0;

	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, +a, +a)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, -a, +a)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (-a, +a, -a)));
	result.AddVertex (new JSM.BodyVertex (new JSM.Coord (+a, -a, -a)));

	var edgeLength = 2.0 * Math.sqrt (2.0);
	var height = edgeLength * pyramidUnitHeight;
	
	JSM.AddCumulatedPolygonToBody (result, [0, 1, 3], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 2, 1], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 3, 2], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 2, 3], height);

	return result;
};

/**
* Function: GenerateCumulatedHexahedron
* Description: Generates a cumulated hexahedron.
* Parameters:
*	pyramidUnitHeight {number} the unit height of pyramids
* Returns:
*	{Body} the result
*/
JSM.GenerateCumulatedHexahedron = function (pyramidUnitHeight)
{
	var result = new JSM.Body ();

	var a = 1.0;

	JSM.AddVertexToBody (result, +a, +a, +a);
	JSM.AddVertexToBody (result, +a, +a, -a);
	JSM.AddVertexToBody (result, +a, -a, +a);
	JSM.AddVertexToBody (result, -a, +a, +a);
	JSM.AddVertexToBody (result, +a, -a, -a);
	JSM.AddVertexToBody (result, -a, +a, -a);
	JSM.AddVertexToBody (result, -a, -a, +a);
	JSM.AddVertexToBody (result, -a, -a, -a);

	var edgeLength = 2.0;
	var height = edgeLength * pyramidUnitHeight;
	
	JSM.AddCumulatedPolygonToBody (result, [0, 1, 5, 3], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 2, 4, 1], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 3, 6, 2], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 4, 7, 5], height);
	JSM.AddCumulatedPolygonToBody (result, [2, 6, 7, 4], height);
	JSM.AddCumulatedPolygonToBody (result, [3, 5, 7, 6], height);

	return result;
};

/**
* Function: GenerateCumulatedOctahedron
* Description: Generates a cumulated octahedron.
* Parameters:
*	pyramidUnitHeight {number} the unit height of pyramids
* Returns:
*	{Body} the result
*/
JSM.GenerateCumulatedOctahedron = function (pyramidUnitHeight)
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;

	JSM.AddVertexToBody (result, +a, +b, +b);
	JSM.AddVertexToBody (result, -a, +b, +b);
	JSM.AddVertexToBody (result, +b, +a, +b);
	JSM.AddVertexToBody (result, +b, -a, +b);
	JSM.AddVertexToBody (result, +b, +b, +a);
	JSM.AddVertexToBody (result, +b, +b, -a);

	var edgeLength = Math.sqrt (2.0);
	var height = edgeLength * pyramidUnitHeight;
	
	JSM.AddCumulatedPolygonToBody (result, [0, 2, 4], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 3, 5], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 4, 3], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 5, 2], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 2, 5], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 3, 4], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 4, 2], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 5, 3], height);

	return result;
};

/**
* Function: GenerateCumulatedDodecahedron
* Description: Generates a cumulated dodecahedron.
* Parameters:
*	pyramidUnitHeight {number} the unit height of pyramids
* Returns:
*	{Body} the result
*/
JSM.GenerateCumulatedDodecahedron = function (pyramidUnitHeight)
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;
	var d = 1.0 / c;

	JSM.AddVertexToBody (result, +a, +a, +a);
	JSM.AddVertexToBody (result, +a, +a, -a);
	JSM.AddVertexToBody (result, +a, -a, +a);
	JSM.AddVertexToBody (result, -a, +a, +a);
	JSM.AddVertexToBody (result, +a, -a, -a);
	JSM.AddVertexToBody (result, -a, +a, -a);
	JSM.AddVertexToBody (result, -a, -a, +a);
	JSM.AddVertexToBody (result, -a, -a, -a);

	JSM.AddVertexToBody (result, +b, +d, +c);
	JSM.AddVertexToBody (result, +b, +d, -c);
	JSM.AddVertexToBody (result, +b, -d, +c);
	JSM.AddVertexToBody (result, +b, -d, -c);

	JSM.AddVertexToBody (result, +d, +c, +b);
	JSM.AddVertexToBody (result, +d, -c, +b);
	JSM.AddVertexToBody (result, -d, +c, +b);
	JSM.AddVertexToBody (result, -d, -c, +b);

	JSM.AddVertexToBody (result, +c, +b, +d);
	JSM.AddVertexToBody (result, -c, +b, +d);
	JSM.AddVertexToBody (result, +c, +b, -d);
	JSM.AddVertexToBody (result, -c, +b, -d);

	var edgeLength = Math.sqrt (5.0) - 1.0;
	var height = edgeLength * pyramidUnitHeight;
	
	JSM.AddCumulatedPolygonToBody (result, [0, 8, 10, 2, 16], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 16, 18, 1, 12], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 12, 14, 3, 8], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 9, 5, 14, 12], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 18, 4, 11, 9], height);
	JSM.AddCumulatedPolygonToBody (result, [2, 10, 6, 15, 13], height);
	JSM.AddCumulatedPolygonToBody (result, [2, 13, 4, 18, 16], height);
	JSM.AddCumulatedPolygonToBody (result, [3, 14, 5, 19, 17], height);
	JSM.AddCumulatedPolygonToBody (result, [3, 17, 6, 10, 8], height);
	JSM.AddCumulatedPolygonToBody (result, [4, 13, 15, 7, 11], height);
	JSM.AddCumulatedPolygonToBody (result, [5, 9, 11, 7, 19], height);
	JSM.AddCumulatedPolygonToBody (result, [6, 17, 19, 7, 15], height);

	return result;
};

/**
* Function: GenerateCumulatedIcosahedron
* Description: Generates a cumulated icosahedron.
* Parameters:
*	pyramidUnitHeight {number} the unit height of pyramids
* Returns:
*	{Body} the result
*/
JSM.GenerateCumulatedIcosahedron = function (pyramidUnitHeight)
{
	var result = new JSM.Body ();

	var a = 1.0;
	var b = 0.0;
	var c = (1.0 + Math.sqrt (5.0)) / 2.0;

	JSM.AddVertexToBody (result, +b, +a, +c);
	JSM.AddVertexToBody (result, +b, +a, -c);
	JSM.AddVertexToBody (result, +b, -a, +c);
	JSM.AddVertexToBody (result, +b, -a, -c);

	JSM.AddVertexToBody (result, +a, +c, +b);
	JSM.AddVertexToBody (result, +a, -c, +b);
	JSM.AddVertexToBody (result, -a, +c, +b);
	JSM.AddVertexToBody (result, -a, -c, +b);

	JSM.AddVertexToBody (result, +c, +b, +a);
	JSM.AddVertexToBody (result, -c, +b, +a);
	JSM.AddVertexToBody (result, +c, +b, -a);
	JSM.AddVertexToBody (result, -c, +b, -a);

	var edgeLength = 2;
	var height = edgeLength * pyramidUnitHeight;

	JSM.AddCumulatedPolygonToBody (result, [0, 2, 8], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 4, 6], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 6, 9], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 8, 4], height);
	JSM.AddCumulatedPolygonToBody (result, [0, 9, 2], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 3, 11], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 4, 10], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 6, 4], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 10, 3], height);
	JSM.AddCumulatedPolygonToBody (result, [1, 11, 6], height);
	JSM.AddCumulatedPolygonToBody (result, [2, 5, 8], height);
	JSM.AddCumulatedPolygonToBody (result, [2, 7, 5], height);
	JSM.AddCumulatedPolygonToBody (result, [2, 9, 7], height);
	JSM.AddCumulatedPolygonToBody (result, [3, 5, 7], height);
	JSM.AddCumulatedPolygonToBody (result, [3, 7, 11], height);
	JSM.AddCumulatedPolygonToBody (result, [3, 10, 5], height);
	JSM.AddCumulatedPolygonToBody (result, [4, 8, 10], height);
	JSM.AddCumulatedPolygonToBody (result, [6, 11, 9], height);
	JSM.AddCumulatedPolygonToBody (result, [5, 10, 8], height);
	JSM.AddCumulatedPolygonToBody (result, [7, 9, 11], height);

	return result;
};

/**
* Function: GenerateTetrakisHexahedron
* Description: Generates a tetrakis hexahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTetrakisHexahedron = function ()
{
	var pyramidUnitHeight = 1.0 / 4.0;
	return JSM.GenerateCumulatedHexahedron (pyramidUnitHeight);
};

/**
* Function: GenerateRhombicDodecahedron
* Description: Generates a rhombic dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateRhombicDodecahedron = function ()
{
	var pyramidUnitHeight = 1.0 / 2.0;
	return JSM.GenerateCumulatedHexahedron (pyramidUnitHeight);
};

/**
* Function: GeneratePentakisDodecahedron
* Description: Generates a pentakis dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GeneratePentakisDodecahedron = function ()
{
	var pyramidUnitHeight = Math.sqrt ((65.0 + 22.0 * Math.sqrt (5.0)) / 5.0) / 19.0;
	return JSM.GenerateCumulatedDodecahedron (pyramidUnitHeight);
};

/**
* Function: GenerateSmallStellatedDodecahedron
* Description: Generates a small stellated dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateSmallStellatedDodecahedron = function ()
{
	var pyramidUnitHeight = Math.sqrt ((5.0 + 2.0 * Math.sqrt (5.0)) / 5.0);
	return JSM.GenerateCumulatedDodecahedron (pyramidUnitHeight);
};

/**
* Function: GenerateGreatDodecahedron
* Description: Generates a great dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateGreatDodecahedron = function ()
{
	var pyramidUnitHeight = (Math.sqrt (3.0) * (Math.sqrt (5.0) - 3.0)) / 6.0;
	return JSM.GenerateCumulatedIcosahedron (pyramidUnitHeight);
};

/**
* Function: GenerateSmallTriambicIcosahedron
* Description: Generates a small triambic icosahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateSmallTriambicIcosahedron = function ()
{
	var pyramidUnitHeight = Math.sqrt (15.0) / 15.0;
	return JSM.GenerateCumulatedIcosahedron (pyramidUnitHeight);
};

/**
* Function: GenerateGreatStellatedDodecahedron
* Description: Generates a great stellated dodecahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateGreatStellatedDodecahedron = function ()
{
	var pyramidUnitHeight = (Math.sqrt (3.0) * (3.0 + Math.sqrt (5.0))) / 6.0;
	return JSM.GenerateCumulatedIcosahedron (pyramidUnitHeight);
};

/**
* Function: GenerateSmallTriakisOctahedron
* Description: Generates a small triakis octahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateSmallTriakisOctahedron = function ()
{
	var pyramidUnitHeight = Math.sqrt (3.0) - 2.0 * Math.sqrt (6.0) / 3.0;
	return JSM.GenerateCumulatedOctahedron (pyramidUnitHeight);
};

/**
* Function: GenerateStellaOctangula
* Description: Generates a stella octangula.
* Returns:
*	{Body} the result
*/
JSM.GenerateStellaOctangula = function ()
{
	var pyramidUnitHeight = Math.sqrt (6.0) / 3.0;
	return JSM.GenerateCumulatedOctahedron (pyramidUnitHeight);
};

/**
* Function: GenerateTriakisTetrahedron
* Description: Generates a triakis tetrahedron.
* Returns:
*	{Body} the result
*/
JSM.GenerateTriakisTetrahedron = function ()
{
	var pyramidUnitHeight = Math.sqrt (6.0) / 15.0;
	return JSM.GenerateCumulatedTetrahedron (pyramidUnitHeight);
};
