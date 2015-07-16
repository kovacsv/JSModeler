/**
* Function: IdentityTransformation
* Description: Generates an identity transformation.
* Returns:
*	{Transformation} the result
*/
JSM.IdentityTransformation = function ()
{
	var transformation = new JSM.Transformation ();
	transformation.matrix = JSM.MatrixIdentity ();
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
	transformation.matrix = JSM.MatrixTranslation (translation.x, translation.y, translation.z);
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
	var normal = direction.Clone ().Normalize ();
	var translation = normal.Clone ().MultiplyScalar (distance);
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
	transformation.matrix = JSM.MatrixRotation (axis, angle, origo);
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
	if (origo === undefined || origo === null) {
		transformation.matrix = JSM.MatrixRotationX (angle);
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
	if (origo === undefined || origo === null) {
		transformation.matrix = JSM.MatrixRotationY (angle);
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
	if (origo === undefined || origo === null) {
		transformation.matrix = JSM.MatrixRotationZ (angle);
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
