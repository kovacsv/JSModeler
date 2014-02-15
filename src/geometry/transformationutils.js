/**
* Function: IdentityTransformation
* Description: Generates an identity transformation.
* Returns:
*	{Transformation} the result
*/
JSM.IdentityTransformation = function ()
{
	var transformation = new JSM.Transformation ();
	transformation.matrix = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0
	];
	return transformation;
};

/**
* Function: TranslationTransformation
* Description: Generates a translation transformation.
* Parameters:
*	translation {Vector} the translation vector
* Returns:
*	{Transformation} the result
*/
JSM.TranslationTransformation = function (translation)
{
	var transformation = new JSM.Transformation ();
	transformation.matrix = [
		1.0, 0.0, 0.0, translation.x,
		0.0, 1.0, 0.0, translation.y,
		0.0, 0.0, 1.0, translation.z
	];
	return transformation;
};

/**
* Function: OffsetTransformation
* Description: Generates an offset transformation.
* Parameters:
*	direction {Vector} the direction of the offset
*	distance {number} the distance of the offset
* Returns:
*	{Transformation} the result
*/
JSM.OffsetTransformation = function (direction, distance)
{
	var normal = JSM.VectorNormalize (direction);
	var translation = JSM.VectorMultiply (normal, distance);
	return JSM.TranslationTransformation (translation);
};

/**
* Function: RotationTransformation
* Description: Generates a rotation transformation.
* Parameters:
*	axis {Vector} the axis of the rotation
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Transformation} the result
*/
JSM.RotationTransformation = function (axis, angle, origo)
{
	var transformation = new JSM.Transformation ();

	var normal = JSM.VectorNormalize (axis);

	var u = normal.x;
	var v = normal.y;
	var w = normal.z;

	var u2 = u * u;
	var v2 = v * v;
	var w2 = w * w;

	var si = Math.sin (angle);
	var co = Math.cos (angle);
	
	if (origo === undefined) {
		transformation.matrix = [
			u2 + (v2 + w2) * co, u * v * (1.0 - co) - w * si, u * w * (1.0 - co) + v * si, 0.0,
			u * v * (1.0 - co) + w * si, v2 + (u2 + w2) * co, v * w * (1.0 - co) - u * si, 0.0,
			u * w * (1.0 - co) - v * si, v * w * (1.0 - co) + u * si, w2 + (u2 + v2) * co, 0.0
		];
	} else {
		var a = origo.x;
		var b = origo.y;
		var c = origo.z;
	
		transformation.matrix = [
			u2 + (v2 + w2) * co, u * v * (1.0 - co) - w * si, u * w * (1.0 - co) + v * si, (a * (v2 + w2) - u * (b * v + c * w)) * (1.0 - co) + (b * w - c * v) * si,
			u * v * (1.0 - co) + w * si, v2 + (u2 + w2) * co, v * w * (1.0 - co) - u * si, (b * (u2 + w2) - v * (a * u + c * w)) * (1.0 - co) + (c * u - a * w) * si,
			u * w * (1.0 - co) - v * si, v * w * (1.0 - co) + u * si, w2 + (u2 + v2) * co, (c * (u2 + v2) - w * (a * u + b * v)) * (1.0 - co) + (a * v - b * u) * si
		];
	}
	
	return transformation;
};

/**
* Function: RotationXTransformation
* Description: Generates a rotation transformation around the x axis.
* Parameters:
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Transformation} the result
*/
JSM.RotationXTransformation = function (angle, origo)
{
	var transformation = new JSM.Transformation ();
	if (origo === undefined) {
		var si = Math.sin (angle);
		var co = Math.cos (angle);

		transformation.matrix = [
			1.0, 0.0, 0.0, 0.0,
			0.0, co, -si, 0.0,
			0.0, si, co, 0.0
		];
	} else {
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (-origo.x, -origo.y, -origo.z)));
		transformation.Append (JSM.RotationXTransformation (angle));
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (origo.x, origo.y, origo.z)));
	}
	return transformation;
};

/**
* Function: RotationYTransformation
* Description: Generates a rotation transformation around the y axis.
* Parameters:
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Transformation} the result
*/
JSM.RotationYTransformation = function (angle, origo)
{
	var transformation = new JSM.Transformation ();
	if (origo === undefined) {
		var si = Math.sin (angle);
		var co = Math.cos (angle);

		transformation.matrix = [
			co, 0.0, si, 0.0,
			0.0, 1.0, 0.0, 0.0,
			-si, 0.0, co, 0.0
		];
	} else {
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (-origo.x, -origo.y, -origo.z)));
		transformation.Append (JSM.RotationYTransformation (angle));
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (origo.x, origo.y, origo.z)));
	}
	return transformation;
};

/**
* Function: RotationZTransformation
* Description: Generates a rotation transformation around the z axis.
* Parameters:
*	angle {number} the angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Transformation} the result
*/
JSM.RotationZTransformation = function (angle, origo)
{
	var transformation = new JSM.Transformation ();
	if (origo === undefined) {
		var si = Math.sin (angle);
		var co = Math.cos (angle);

		transformation.matrix = [
			co, -si, 0.0, 0.0,
			si, co, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0
		];
	} else {
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (-origo.x, -origo.y, -origo.z)));
		transformation.Append (JSM.RotationZTransformation (angle));
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (origo.x, origo.y, origo.z)));
	}
	return transformation;
};

/**
* Function: RotationXYZTransformation
* Description: Generates a rotation transformation around all axis in x, y, z order.
* Parameters:
*	xAngle {number} the x angle of the rotation
*	yAngle {number} the y angle of the rotation
*	zAngle {number} the z angle of the rotation
*	origo {Coord} the origo of the rotation
* Returns:
*	{Transformation} the result
*/
JSM.RotationXYZTransformation = function (xAngle, yAngle, zAngle, origo)
{
	var transformation = new JSM.Transformation ();
	transformation.Append (JSM.RotationXTransformation (xAngle, origo));
	transformation.Append (JSM.RotationYTransformation (yAngle, origo));
	transformation.Append (JSM.RotationZTransformation (zAngle, origo));
	return transformation;
};
