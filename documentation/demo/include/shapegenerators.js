JSM.CreatePolygonFromVertices = function (vertices)
{
	var polygon = new JSM.Polygon2D ();

	var i, current;
	for (i = 0; i < vertices.length; i++) {
		current = vertices[i];
		polygon.AddVertex (current.x, current.y);
	}
	
	return polygon;
};

JSM.ChangePolygonOrientation2D = function (polygon)
{
	var oldPolygon = polygon.Clone ();
	polygon.Clear ();
	
	var i, oldVertex;
	for (i = oldPolygon.VertexCount () - 1; i >= 0; i--) {
		oldVertex = oldPolygon.GetVertex (i);
		polygon.AddVertex (oldVertex.x, oldVertex.y);
	}
};

JSM.CreateCCWPolygonFromVertices = function (vertices)
{
	var polygon = JSM.CreatePolygonFromVertices (vertices);
	if (polygon.GetOrientation () != JSM.Orientation.CounterClockwise) {
		JSM.ChangePolygonOrientation2D (polygon);
	}
	return polygon;
};

JSM.ShapeGenerator = function ()
{
	this.parameters = null;
};

JSM.ShapeGenerator.prototype.GetParameters = function ()
{
	return this.parameters;
};

JSM.ShapeGenerator.prototype.Check = function ()
{
	return false;
};

JSM.ShapeGenerator.prototype.Generate = function ()
{
	return null;
};

JSM.RectangleGenerator = function ()
{
	this.parameters = {
		xSize : new JSM.Parameter ('x size', 'number', 1, 'left'),
		ySize : new JSM.Parameter ('y size', 'number', 1, 'left')
	};
};

JSM.RectangleGenerator.prototype = new JSM.ShapeGenerator ();

JSM.RectangleGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.xSize.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.ySize.value)) {
		return false;
	}
	return true;
};

JSM.RectangleGenerator.prototype.Generate = function ()
{
	return JSM.GenerateRectangle (
		this.parameters.xSize.value,
		this.parameters.ySize.value
	);
};

JSM.CircleGenerator = function ()
{
	this.parameters = {
		radius : new JSM.Parameter ('radius', 'number', 0.5, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 20, 'left')
	};
};

JSM.CircleGenerator.prototype = new JSM.ShapeGenerator ();

JSM.CircleGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.CircleGenerator.prototype.Generate = function ()
{
	return JSM.GenerateCircle (
		this.parameters.radius.value,
		this.parameters.segmentation.value
	);
};

JSM.CuboidGenerator = function ()
{
	this.parameters = {
		xSize : new JSM.Parameter ('x size', 'number', 1, 'left'),
		ySize : new JSM.Parameter ('y size', 'number', 1, 'left'),
		zSize : new JSM.Parameter ('z size', 'number', 1, 'left')
	};
};

JSM.CuboidGenerator.prototype = new JSM.ShapeGenerator ();

JSM.CuboidGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.xSize.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.ySize.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.zSize.value)) {
		return false;
	}
	return true;
};

JSM.CuboidGenerator.prototype.Generate = function ()
{
	return JSM.GenerateCuboid (
		this.parameters.xSize.value,
		this.parameters.ySize.value,
		this.parameters.zSize.value
	);
};

JSM.SphereGenerator = function ()
{
	this.parameters = {
		radius : new JSM.Parameter ('radius', 'number', 0.5, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 20, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.SphereGenerator.prototype = new JSM.ShapeGenerator ();

JSM.SphereGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.SphereGenerator.prototype.Generate = function ()
{
	return JSM.GenerateSphere (
		this.parameters.radius.value,
		this.parameters.segmentation.value,
		this.parameters.isCurved.value
	);
};

JSM.TriSphereGenerator = function ()
{
	this.parameters = {
		radius : new JSM.Parameter ('radius', 'number', 0.5, 'left'),
		iterations : new JSM.Parameter ('iterations', 'integer', 3, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.TriSphereGenerator.prototype = new JSM.ShapeGenerator ();

JSM.TriSphereGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	if (this.parameters.iterations.value < 0) {
		return false;
	}
	return true;
};

JSM.TriSphereGenerator.prototype.Generate = function ()
{
	return JSM.GenerateTriangulatedSphere (
		this.parameters.radius.value,
		this.parameters.iterations.value,
		this.parameters.isCurved.value
	);
};

JSM.CylinderGenerator = function ()
{
	this.parameters = {
		radius : new JSM.Parameter ('radius', 'number', 0.5, 'left'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 25, 'left'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.CylinderGenerator.prototype = new JSM.ShapeGenerator ();

JSM.CylinderGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.CylinderGenerator.prototype.Generate = function ()
{
	return JSM.GenerateCylinder (
		this.parameters.radius.value,
		this.parameters.height.value,
		this.parameters.segmentation.value,
		this.parameters.withTopAndBottom.value,
		this.parameters.isCurved.value
	);
};

JSM.PieGenerator = function ()
{
	this.parameters = {
		radius : new JSM.Parameter ('radius', 'number', 0.5, 'left'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'left'),
		angle : new JSM.Parameter ('angle', 'number', 270, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 25, 'left'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.PieGenerator.prototype = new JSM.ShapeGenerator ();

JSM.PieGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.angle.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.PieGenerator.prototype.Generate = function ()
{
	return JSM.GeneratePie (
		this.parameters.radius.value,
		this.parameters.height.value,
		this.parameters.angle.value * JSM.DegRad,
		this.parameters.segmentation.value,
		this.parameters.withTopAndBottom.value,
		this.parameters.isCurved.value
	);
};

JSM.ConeGenerator = function ()
{
	this.parameters = {
		topRadius : new JSM.Parameter ('top radius', 'number', 0.3, 'left'),
		bottomRadius : new JSM.Parameter ('bottom radius', 'number', 0.5, 'left'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 25, 'left'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.ConeGenerator.prototype = new JSM.ShapeGenerator ();

JSM.ConeGenerator.prototype.Check = function ()
{
	if (JSM.IsZero (this.parameters.topRadius.value) && JSM.IsZero (this.parameters.bottomRadius.value)) {
		return false;
	}
	if (JSM.IsNegative (this.parameters.topRadius.value)) {
		return false;
	}
	if (JSM.IsNegative (this.parameters.bottomRadius.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.ConeGenerator.prototype.Generate = function ()
{
	return JSM.GenerateCone (
		this.parameters.topRadius.value,
		this.parameters.bottomRadius.value,
		this.parameters.height.value,
		this.parameters.segmentation.value,
		this.parameters.withTopAndBottom.value,
		this.parameters.isCurved.value
	);
};

JSM.TorusGenerator = function ()
{
	this.parameters = {
		outerRadius : new JSM.Parameter ('outer radius', 'number', 0.5, 'left'),
		innerRadius : new JSM.Parameter ('inner radius', 'number', 0.2, 'left'),
		outerSegmentation : new JSM.Parameter ('outer segmentation', 'integer', 25, 'left'),
		innerSegmentation : new JSM.Parameter ('inner segmentation', 'integer', 25, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.TorusGenerator.prototype = new JSM.ShapeGenerator ();

JSM.TorusGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.outerRadius.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.innerRadius.value)) {
		return false;
	}
	if (this.parameters.outerSegmentation.value < 3) {
		return false;
	}
	if (this.parameters.innerSegmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.TorusGenerator.prototype.Generate = function ()
{
	return JSM.GenerateTorus (
		this.parameters.outerRadius.value,
		this.parameters.innerRadius.value,
		this.parameters.outerSegmentation.value,
		this.parameters.innerSegmentation.value,
		this.parameters.isCurved.value
	);
};

JSM.PrismGenerator = function ()
{
	this.parameters = {
		basePolygon : new JSM.Parameter (null, 'polygon', [0.01, [
			new JSM.Coord2D (-0.5, -0.5),
			new JSM.Coord2D (0.5, -0.5),
			new JSM.Coord2D (0.5, 0.5),
			new JSM.Coord2D (0, 0.5),
			new JSM.Coord2D (0, 0),
			new JSM.Coord2D (-0.5, 0)
		]], 'left'),
		direction : new JSM.Parameter ('direction', 'coord', new JSM.Coord (0.0, 0.0, 1.0), 'right'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'right'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'right')
	};
};

JSM.PrismGenerator.prototype = new JSM.ShapeGenerator ();

JSM.PrismGenerator.prototype.Check = function ()
{
	if (this.parameters.basePolygon.value[1].length < 3) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (JSM.IsZero (this.parameters.direction.value.Length ())) {
		return false;
	}
	return true;
};

JSM.PrismGenerator.prototype.Generate = function ()
{
	var polygon = JSM.CreateCCWPolygonFromVertices (this.parameters.basePolygon.value[1]);
	var i, current;
	var basePolygon = [];
	for (i = 0; i < polygon.VertexCount (); i++) {
		current = polygon.GetVertex (i);
		basePolygon.push (new JSM.Coord (current.x, current.y, -this.parameters.height.value / 2.0));
	}
	return JSM.GeneratePrism (
		basePolygon,
		this.parameters.direction.value,
		this.parameters.height.value,
		this.parameters.withTopAndBottom.value
	);
};

JSM.PrismShellGenerator = function ()
{
	this.parameters = {
		basePolygon : new JSM.Parameter (null, 'polygon', [0.01, [
			new JSM.Coord2D (-0.5, -0.5),
			new JSM.Coord2D (0.5, -0.5),
			new JSM.Coord2D (0.5, 0.5),
			new JSM.Coord2D (0.0, 0.5),
			new JSM.Coord2D (0.0, 0.0),
			new JSM.Coord2D (-0.5, 0.0)
		]], 'left'),
		direction : new JSM.Parameter ('direction', 'coord', new JSM.Coord (0.0, 0.0, 1.0), 'right'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'right'),
		width : new JSM.Parameter ('width', 'number', 0.1, 'right'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'right')
	};
};

JSM.PrismShellGenerator.prototype = new JSM.ShapeGenerator ();

JSM.PrismShellGenerator.prototype.Check = function ()
{
	if (this.parameters.basePolygon.value[1].length < 3) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.width.value)) {
		return false;
	}
	if (JSM.IsZero (this.parameters.direction.value.Length ())) {
		return false;
	}
	return true;
};

JSM.PrismShellGenerator.prototype.Generate = function ()
{
	var polygon = JSM.CreateCCWPolygonFromVertices (this.parameters.basePolygon.value[1]);
	var i, current;
	var basePolygon = [];
	for (i = 0; i < polygon.VertexCount (); i++) {
		current = polygon.GetVertex (i);
		basePolygon.push (new JSM.Coord (current.x, current.y, -this.parameters.height.value / 2.0));
	}
	return JSM.GeneratePrismShell (
		basePolygon,
		this.parameters.direction.value,
		this.parameters.height.value,
		this.parameters.width.value,
		this.parameters.withTopAndBottom.value
	);
};

JSM.LineShellGenerator = function ()
{
	this.parameters = {
		basePolyLine : new JSM.Parameter (null, 'polyline', [0.01, [
			new JSM.Coord2D (-0.5, -0.5),
			new JSM.Coord2D (0.5, -0.5),
			new JSM.Coord2D (0.5, 0.5),
			new JSM.Coord2D (0.0, 0.5),
			new JSM.Coord2D (0.0, 0.0),
			new JSM.Coord2D (-0.5, 0.0)
		]], 'left'),
		direction : new JSM.Parameter ('direction', 'coord', new JSM.Coord (0.0, 0.0, 1.0), 'right'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'right'),
		width : new JSM.Parameter ('width', 'number', 0.1, 'right'),
		withStartAndEnd : new JSM.Parameter ('start and end', 'check', true, 'right'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'right')
	};
};

JSM.LineShellGenerator.prototype = new JSM.ShapeGenerator ();

JSM.LineShellGenerator.prototype.Check = function ()
{
	if (this.parameters.basePolyLine.value[1].length < 2) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.width.value)) {
		return false;
	}
	if (JSM.IsZero (this.parameters.direction.value.Length ())) {
		return false;
	}
	return true;
};

JSM.LineShellGenerator.prototype.Generate = function ()
{
	var polygon = JSM.CreateCCWPolygonFromVertices (this.parameters.basePolyLine.value[1]);
	var i, current;
	var basePolyLine = [];
	for (i = 0; i < polygon.VertexCount (); i++) {
		current = polygon.GetVertex (i);
		basePolyLine.push (new JSM.Coord (current.x, current.y, -this.parameters.height.value / 2.0));
	}
	return JSM.GenerateLineShell (
		basePolyLine,
		this.parameters.direction.value,
		this.parameters.height.value,
		this.parameters.width.value,
		this.parameters.withStartAndEnd.value,
		this.parameters.withTopAndBottom.value
	);
};

JSM.CylinderShellGenerator = function ()
{
	this.parameters = {
		radius : new JSM.Parameter ('radius', 'number', 0.5, 'left'),
		height : new JSM.Parameter ('height', 'number', 1.0, 'left'),
		width : new JSM.Parameter ('width', 'number', 0.1, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 25, 'left'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.CylinderShellGenerator.prototype = new JSM.ShapeGenerator ();

JSM.CylinderShellGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.height.value)) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.width.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.CylinderShellGenerator.prototype.Generate = function ()
{
	return JSM.GenerateCylinderShell (
		this.parameters.radius.value,
		this.parameters.height.value,
		this.parameters.width.value,
		this.parameters.segmentation.value,
		this.parameters.withTopAndBottom.value,
		this.parameters.isCurved.value
	);
};

JSM.RevolveGenerator = function ()
{
	this.parameters = {
		basePolyLine : new JSM.Parameter (null, 'polyline', [0.01, [
			new JSM.Coord2D (0.2, 0.6),
			new JSM.Coord2D (0.5, 0.2),
			new JSM.Coord2D (0.3, 0.0),
			new JSM.Coord2D (0.3, -0.4)
		]], 'left'),
		axisBeg : new JSM.Parameter ('axis start', 'coord', new JSM.Coord (0, 0, 0), 'right'),
		axisEnd : new JSM.Parameter ('axis end', 'coord', new JSM.Coord (0, 0, 1), 'right'),
		angle : new JSM.Parameter ('angle', 'number', 360, 'right'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 25, 'right'),
		withTopAndBottom : new JSM.Parameter ('top and bottom', 'check', true, 'right'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'right')
	};
};

JSM.RevolveGenerator.prototype = new JSM.ShapeGenerator ();

JSM.RevolveGenerator.prototype.Check = function ()
{
	if (this.parameters.basePolyLine.value[1].length < 2) {
		return false;
	}
	if (JSM.IsZero (this.parameters.axisBeg.value.DistanceTo (this.parameters.axisEnd.value))) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.angle.value)) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.RevolveGenerator.prototype.Generate = function ()
{
	var polygon = JSM.CreateCCWPolygonFromVertices (this.parameters.basePolyLine.value[1]);
	var i, current;
	var basePolyLine = [];
	for (i = 0; i < polygon.VertexCount (); i++) {
		current = polygon.GetVertex (i);
		basePolyLine.push (new JSM.Coord (current.x, 0.0, current.y));
	}
	return JSM.GenerateRevolved (
		basePolyLine,
		new JSM.Sector (this.parameters.axisBeg.value, this.parameters.axisEnd.value),
		this.parameters.angle.value * JSM.DegRad,
		this.parameters.segmentation.value,
		this.parameters.withTopAndBottom.value,
		this.parameters.isCurved.value ? 'CurveSegments' : 'None'
	);
};

JSM.PolyTorusGenerator = function ()
{
	this.parameters = {
		basePolygon : new JSM.Parameter (null, 'polygon', [0.01, [
			new JSM.Coord2D (-0.25, -0.25),
			new JSM.Coord2D (0.25, -0.25),
			new JSM.Coord2D (0.25, 0.0),
			new JSM.Coord2D (0.0, 0.0),
			new JSM.Coord2D (0.0, 0.25),
			new JSM.Coord2D (-0.25, 0.25)
		]], 'left'),
		outerRadius : new JSM.Parameter ('outer radius', 'number', 0.5, 'right'),
		outerSegmentation : new JSM.Parameter ('outer segmentation', 'integer', 25, 'right'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'right')
	};
};

JSM.PolyTorusGenerator.prototype = new JSM.ShapeGenerator ();

JSM.PolyTorusGenerator.prototype.Check = function ()
{
	if (this.parameters.basePolygon.value[1].length < 3) {
		return false;
	}
	if (!JSM.IsPositive (this.parameters.outerRadius.value)) {
		return false;
	}
	if (this.parameters.outerSegmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.PolyTorusGenerator.prototype.Generate = function ()
{
	var polygon = JSM.CreateCCWPolygonFromVertices (this.parameters.basePolygon.value[1]);
	return JSM.GeneratePolyTorus (
		polygon.vertices,
		this.parameters.outerRadius.value,
		this.parameters.outerSegmentation.value,
		this.parameters.isCurved.value
	);
};

JSM.SolidGenerator = function (types)
{
	this.parameters = {
		type : new JSM.Parameter ('type', 'select', [0, types], 'left'),
		radius : new JSM.Parameter ('radius', 'number', 1, 'left')
	};
};

JSM.SolidGenerator.prototype = new JSM.ShapeGenerator ();

JSM.SolidGenerator.prototype.Check = function ()
{
	if (!JSM.IsPositive (this.parameters.radius.value)) {
		return false;
	}
	return true;
};

JSM.SolidGenerator.prototype.Generate = function ()
{
	var selected = this.parameters.type.value[0];
	var name = this.parameters.type.value[1][selected][0];
	return JSM.GenerateSolidWithRadius (name, this.parameters.radius.value);
};

JSM.LegoBrickGenerator = function ()
{
	this.parameters = {
		rows : new JSM.Parameter ('rows', 'integer', 3, 'left'),
		columns : new JSM.Parameter ('columns', 'integer', 2, 'left'),
		isLarge : new JSM.Parameter ('large', 'check', true, 'left'),
		hasTopCylinders : new JSM.Parameter ('top cylinders', 'check', true, 'left'),
		hasBottomCylinders : new JSM.Parameter ('bottom cylinders', 'check', true, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'integer', 25, 'left'),
		isCurved : new JSM.Parameter ('smooth', 'check', true, 'left')
	};
};

JSM.LegoBrickGenerator.prototype = new JSM.ShapeGenerator ();

JSM.LegoBrickGenerator.prototype.Check = function ()
{
	if (this.parameters.rows.value < 1) {
		return false;
	}
	if (this.parameters.columns.value < 1) {
		return false;
	}
	if (this.parameters.segmentation.value < 3) {
		return false;
	}
	return true;
};

JSM.LegoBrickGenerator.prototype.Generate = function ()
{
	var body = JSM.GenerateLegoBrick (
		this.parameters.rows.value,
		this.parameters.columns.value,
		this.parameters.isLarge.value,
		this.parameters.hasTopCylinders.value,
		this.parameters.hasBottomCylinders.value,
		this.parameters.segmentation.value,
		this.parameters.isCurved.value
	);
	body.OffsetToOrigo ();
	return body;
};

JSM.ConvexHullGenerator = function ()
{
	this.parameters = {
		number : new JSM.Parameter ('random coordinates', 'integer', 50, 'left')
	};
};

JSM.ConvexHullGenerator.prototype = new JSM.ShapeGenerator ();

JSM.ConvexHullGenerator.prototype.Check = function ()
{
	if (this.parameters.number.value < 4) {
		return false;
	}
	return true;
};

JSM.ConvexHullGenerator.prototype.Generate = function ()
{
	var coords = [];
	var i, coord;
	for (i = 0; i < this.parameters.number.value; i++) {
		coord = new JSM.Coord (Math.random (), Math.random (), Math.random ());
		coords.push (coord);
	}
	
	var body = JSM.GenerateConvexHullBody (coords);
	body.OffsetToOrigo ();
	return body;
};
