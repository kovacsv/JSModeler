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

JSM.OffsetTransformation = function (direction, distance)
{
	var normal = JSM.VectorNormalize (direction);
	var translation = JSM.VectorMultiply (normal, distance);
	return JSM.TranslationTransformation (translation);
};

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

JSM.SystemConversionTransformation = function (fromE1, fromE2, fromE3, toE1, toE2, toE3)
{
	var transformation = new JSM.Transformation ();

	transformation.matrix = [
		JSM.VectorDot (toE1, fromE1), JSM.VectorDot (toE1, fromE2), JSM.VectorDot (toE1, fromE3), 0.0,
		JSM.VectorDot (toE2, fromE1), JSM.VectorDot (toE2, fromE2), JSM.VectorDot (toE2, fromE3), 0.0,
		JSM.VectorDot (toE3, fromE1), JSM.VectorDot (toE3, fromE2), JSM.VectorDot (toE3, fromE3), 0.0
	];
	
	return transformation;
};
