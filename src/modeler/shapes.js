JSM.Shape = function ()
{
	this.transformation = null;
};

JSM.Shape.prototype =
{
	Initialize : function ()
	{
		this.transformation = JSM.IdentityTransformation ();
	},

	Translate : function (translationVector)
	{
		var trafo = JSM.TranslationTransformation (translationVector);
		this.transformation.Append (trafo);
	},

	TranslateX : function (translation)
	{
		var trafo = JSM.TranslationTransformation (new JSM.Vector (translation, 0.0, 0.0));
		this.transformation.Append (trafo);
	},
	
	TranslateY : function (translation)
	{
		var trafo = JSM.TranslationTransformation (new JSM.Vector (0.0, translation, 0.0));
		this.transformation.Append (trafo);
	},
	
	TranslateZ : function (translation)
	{
		var trafo = JSM.TranslationTransformation (new JSM.Vector (0.0, 0.0, translation));
		this.transformation.Append (trafo);
	},
	
	Rotate : function (axis, angle, origo)
	{
		var trafo = JSM.RotationTransformation (axis, angle, origo);
		this.transformation.Append (trafo);
	},
	
	RotateX : function (angle, origo)
	{
		var trafo = JSM.RotationXTransformation (angle, origo);
		this.transformation.Append (trafo);
	}, 
	
	RotateY : function (angle, origo)
	{
		var trafo = JSM.RotationYTransformation (angle, origo);
		this.transformation.Append (trafo);
	}, 
	
	RotateZ : function (angle, origo)
	{
		var trafo = JSM.RotationZTransformation (angle, origo);
		this.transformation.Append (trafo);
	},
	
	GetOrigo : function ()
	{
		var matrix = this.transformation.matrix;
		return new JSM.Coord (matrix[3], matrix[7], matrix[11]);
	}
};

JSM.Cube = function (xSize, ySize, zSize)
{
	this.Initialize ();
	
	this.xSize = JSM.ValueOrDefault (xSize, 1.0);
	this.ySize = JSM.ValueOrDefault (ySize, 1.0);
	this.zSize = JSM.ValueOrDefault (zSize, 1.0);	
};

JSM.Cube.prototype = new JSM.Shape ();

JSM.Cube.prototype.GetBody = function ()
{
	var body = JSM.GenerateCuboid (this.xSize, this.ySize, this.zSize);
	body.Transform (this.transformation);
	return body;
};

JSM.Sphere = function (radius, segmentation, isCurved)
{
	this.Initialize ();
	
	this.radius = JSM.ValueOrDefault (radius, 0.5);
	this.segmentation = JSM.ValueOrDefault (segmentation, 25);
	this.isCurved = JSM.ValueOrDefault (isCurved, true);	
};

JSM.Sphere.prototype = new JSM.Shape ();

JSM.Sphere.prototype.GetBody = function ()
{
	var body = JSM.GenerateSphere (this.radius, this.segmentation, this.isCurved);
	body.Transform (this.transformation);
	return body;
};

JSM.Cylinder = function (radius, height, segmentation, withTopAndBottom, isCurved)
{
	this.Initialize ();
	
	this.radius = JSM.ValueOrDefault (radius, 0.5);
	this.height = JSM.ValueOrDefault (height, 1.0);
	this.segmentation = JSM.ValueOrDefault (segmentation, 25);
	this.withTopAndBottom = JSM.ValueOrDefault (withTopAndBottom, true);
	this.isCurved = JSM.ValueOrDefault (isCurved, true);
};

JSM.Cylinder.prototype = new JSM.Shape ();

JSM.Cylinder.prototype.GetBody = function ()
{
	var body = JSM.GenerateCylinder (this.radius, this.height, this.segmentation, this.withTopAndBottom, this.isCurved);
	body.Transform (this.transformation);
	return body;
};

JSM.Cone = function (topRadius, bottomRadius, height, segmentation, withTopAndBottom, isCurved)
{
	this.Initialize ();
	
	this.topRadius = JSM.ValueOrDefault (topRadius, 0.0);
	this.bottomRadius = JSM.ValueOrDefault (bottomRadius, 0.5);
	this.height = JSM.ValueOrDefault (height, 1.0);
	this.segmentation = JSM.ValueOrDefault (segmentation, 25);
	this.withTopAndBottom = JSM.ValueOrDefault (withTopAndBottom, true);
	this.isCurved = JSM.ValueOrDefault (isCurved, true);	
};

JSM.Cone.prototype = new JSM.Shape ();

JSM.Cone.prototype.GetBody = function ()
{
	var body = JSM.GenerateCone (this.topRadius, this.bottomRadius, this.height, this.segmentation, this.withTopAndBottom, this.isCurved);
	body.Transform (this.transformation);
	return body;
};

JSM.Torus = function (outerRadius, innerRadius, outerSegmentation, innerSegmentation, isCurved)
{
	this.Initialize ();
	
	this.outerRadius = JSM.ValueOrDefault (outerRadius, 0.5);
	this.innerRadius = JSM.ValueOrDefault (innerRadius, 0.25);
	this.outerSegmentation = JSM.ValueOrDefault (outerSegmentation, 25);
	this.innerSegmentation = JSM.ValueOrDefault (innerSegmentation, 25);
	this.isCurved = JSM.ValueOrDefault (isCurved, true);	
};

JSM.Torus.prototype = new JSM.Shape ();

JSM.Torus.prototype.GetBody = function ()
{
	var body = JSM.GenerateTorus (this.outerRadius, this.innerRadius, this.outerSegmentation, this.innerSegmentation, this.isCurved);
	body.Transform (this.transformation);
	return body;
};
