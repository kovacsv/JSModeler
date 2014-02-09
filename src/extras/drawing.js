/**
* Class: CanvasDrawer
* Description: Represents an object which can draw primitives to a canvas.
* Parameters:
*	canvas {html canvas element} the destination element
*/
JSM.CanvasDrawer = function (canvas)
{
	this.canvas = canvas;
	this.context = this.canvas.getContext ('2d');
};

/**
* Function: CanvasDrawer.GetWidth
* Description: Returns the width of the target.
* Returns:
*	{integer} the result
*/
JSM.CanvasDrawer.prototype.GetWidth = function ()
{
	return this.canvas.width;
};

/**
* Function: CanvasDrawer.GetHeight
* Description: Returns the height of the target.
* Returns:
*	{integer} the result
*/
JSM.CanvasDrawer.prototype.GetHeight = function ()
{
	return this.canvas.height;
};

/**
* Function: CanvasDrawer.BeginPath
* Description: Begins a path.
*/
JSM.CanvasDrawer.prototype.BeginPath = function ()
{
	this.context.beginPath ();
};

/**
* Function: CanvasDrawer.EndPath
* Description: Ends a path.
*/
JSM.CanvasDrawer.prototype.EndPath = function ()
{
	this.context.stroke ();
};

/**
* Function: CanvasDrawer.Clear
* Description: Clears the target.
*/
JSM.CanvasDrawer.prototype.Clear = function ()
{
	this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
	this.context.fillStyle = '#ffffff';
	this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);
};

/**
* Function: CanvasDrawer.DrawLine
* Description: Draws a line to the target.
* Parameters:
*	from {Coord2D} the start of the line
*	to {Coord2D} the end of the line
*/
JSM.CanvasDrawer.prototype.DrawLine = function (from, to)
{
	this.context.moveTo (from.x, this.canvas.height - from.y);
	this.context.lineTo (to.x, this.canvas.height - to.y);
};

/**
* Function: CanvasDrawer.DrawPolygon
* Description: Draws a polygon to the target.
* Parameters:
*	polygon {Polygon2D} the polygon
*	color {string} the hex color string
*/
JSM.CanvasDrawer.prototype.DrawPolygon = function (polygon, color)
{
	function HexColorToHTMLColor (hexColor)
	{
		var rgb = JSM.HexColorToRGBComponents (hexColor);
		var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
		return result;
	}
	
	this.context.fillStyle = HexColorToHTMLColor (color);
	this.context.beginPath();

	var i, vertex, nextVertex;
	for (i = 0; i < polygon.VertexCount (); i++) {
		vertex = polygon.GetVertex (i);
		if (i === 0) {
			this.context.moveTo (vertex.x, this.canvas.height - vertex.y);
		} else {
			this.context.lineTo (vertex.x, this.canvas.height - vertex.y);
		}
	}

	this.context.closePath ();
	this.context.fill ();			

	this.BeginPath ();
	for (i = 0; i < polygon.VertexCount (); i++) {
		vertex = polygon.GetVertex (i);
		nextVertex = polygon.GetVertex (i < polygon.VertexCount () - 1 ? i + 1 : 0);
		this.DrawLine (vertex, nextVertex);
	}
	this.EndPath ();
};

/**
* Class: SVGDrawer
* Description: Represents an object which can draw primitives to an svg.
* Parameters:
*	svgObject {html svg element} the destination element
*/
JSM.SVGDrawer = function (svgObject)
{
	this.svgObject = svgObject;
	this.svgNameSpace = "http://www.w3.org/2000/svg";
};

/**
* Function: SVGDrawer.GetWidth
* Description: Returns the width of the target.
* Returns:
*	{integer} the result
*/
JSM.SVGDrawer.prototype.GetWidth = function ()
{
	return this.svgObject.getAttribute ('width');
};

/**
* Function: SVGDrawer.GetHeight
* Description: Returns the height of the target.
* Returns:
*	{integer} the result
*/
JSM.SVGDrawer.prototype.GetHeight = function ()
{
	return this.svgObject.getAttribute ('height');
};

/**
* Function: SVGDrawer.BeginPath
* Description: Begins a path.
*/
JSM.SVGDrawer.prototype.BeginPath = function ()
{
	// nothing to do
};

/**
* Function: SVGDrawer.EndPath
* Description: Ends a path.
*/
JSM.SVGDrawer.prototype.EndPath = function ()
{
	// nothing to do
};

/**
* Function: SVGDrawer.Clear
* Description: Clears the target.
*/
JSM.SVGDrawer.prototype.Clear = function ()
{
	while (this.svgObject.lastChild) {
		this.svgObject.removeChild (this.svgObject.lastChild);
	}
};

/**
* Function: SVGDrawer.DrawLine
* Description: Draws a line to the target.
* Parameters:
*	from {Coord2D} the start of the line
*	to {Coord2D} the end of the line
*/
JSM.SVGDrawer.prototype.DrawLine = function (from, to)
{
	var svgLine = document.createElementNS (this.svgNameSpace, 'line');
	var height = this.GetHeight ();
	svgLine.setAttributeNS (null, 'stroke', 'black');
	svgLine.setAttributeNS (null, 'x1', from.x);
	svgLine.setAttributeNS (null, 'y1', height - from.y);
	svgLine.setAttributeNS (null, 'x2', to.x);
	svgLine.setAttributeNS (null, 'y2', height - to.y);
	this.svgObject.appendChild (svgLine);		
};

/**
* Function: SVGDrawer.DrawPolygon
* Description: Draws a polygon to the target.
* Parameters:
*	polygon {Polygon2D} the polygon
*	color {string} the hex color string
*/
JSM.SVGDrawer.prototype.DrawPolygon = function (polygon, color)
{
	function HexColorToHTMLColor (hexColor)
	{
		var rgb = JSM.HexColorToRGBComponents (hexColor);
		var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
		return result;
	}

	var pointsString = '';
	var height = this.GetHeight ();
	
	var i, vertex;
	for (i = 0; i < polygon.VertexCount (); i++) {
		vertex = polygon.GetVertex (i);
		pointsString = pointsString + vertex.x + ', ' + (height - vertex.y);
		if (i < polygon.VertexCount () - 1) {
			pointsString = pointsString + ', ';
		}
	}
	
	var svgPolyon = document.createElementNS (this.svgNameSpace, 'polygon');
	svgPolyon.setAttributeNS (null, 'points', pointsString);
	svgPolyon.setAttributeNS (null, 'fill', HexColorToHTMLColor (color));
	svgPolyon.setAttributeNS (null, 'fill-opacity', '1.0');
	svgPolyon.setAttributeNS (null, 'stroke', 'black');
	this.svgObject.appendChild (svgPolyon);		
};

/**
* Class: DrawSettings
* Description: Represents the draw settings.
* Parameters:
*	camera {Camera} the camera
*	fieldOfView {number} camera field of view
*	aspectRatio {number} aspect ratio of the desired image
*	nearPlane {number} near cutting plane distance
*	farPlane {number} far cutting plane distance
*	clear {boolean} clear the canvas before draw
*/
JSM.DrawSettings = function (camera, fieldOfView, nearPlane, farPlane, drawMode, clear)
{
	this.camera = camera;
	this.fieldOfView = fieldOfView;
	this.nearPlane = nearPlane;
	this.farPlane = farPlane;
	this.drawMode = drawMode;
	this.clear = clear;
};

/**
* Function: DrawProjectedBody
* Description: Draws a projected body.
* Parameters:
*	body {Body} the body
*	materials {Materials} the material container
*	settings {DrawSettings} the draw settings
*	drawer {drawer object} the drawer object
*/
JSM.DrawProjectedBody = function (body, materials, settings, drawer)
{
	function GetProjectedPolygon (polygon)
	{
		var projectedPolygon = new JSM.Polygon2D ();
		
		var i, coord, projected, x, y;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
			x = projected.x;
			y = projected.y;
			projectedPolygon.AddVertex (x, y);
		}
		
		return projectedPolygon;
	}

	var clear = settings.clear;
	if (clear) {
		drawer.Clear ();
	}

	var width = drawer.GetWidth ();
	var height = drawer.GetHeight ();
	
	var eye = settings.camera.eye;
	var center = settings.camera.center;
	var up = settings.camera.up;
	var fieldOfView = settings.fieldOfView;
	var aspectRatio = width / height;
	var nearPlane = settings.nearPlane;
	var farPlane = settings.farPlane;
	var viewPort = [0, 0, width, height];
	var drawMode = settings.drawMode;

	var i, j, polygon, coord, projected, materialIndex, color;
	if (drawMode == 'HiddenLinePainter') {
		var orderedPolygons = JSM.OrderPolygons (body, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort);
		if (materials === undefined || materials === null) {
			materials = new JSM.Materials ();
		}
		
		for (i = 0; i < orderedPolygons.length; i++) {
			polygon = body.GetPolygon (orderedPolygons[i]);
			projected = GetProjectedPolygon (polygon);
			materialIndex = polygon.GetMaterialIndex ();
			color = materials.GetMaterial (materialIndex).diffuse;
			drawer.DrawPolygon (projected, color);
		}
	} else if (drawMode == 'HiddenLineFrontFacing') {
		if (materials === undefined || materials === null) {
			materials = new JSM.Materials ();
		}
		
		for (i = 0; i < body.PolygonCount (); i++) {
			polygon = body.GetPolygon (i);
			projected = GetProjectedPolygon (polygon);
			if (JSM.PolygonOrientation2D (projected) == 'CounterClockwise') {
				materialIndex = polygon.GetMaterialIndex ();
				color = materials.GetMaterial (materialIndex).diffuse;
				drawer.DrawPolygon (projected, color);
			}
		}
	} else if (drawMode == 'Wireframe') {
		var vertexCount, currentCoord, currentVertex, vertex;
		drawer.BeginPath ();
		
		var drawedLines = [];
		for (i = 0; i < body.PolygonCount (); i++) {
			currentCoord = null;
			currentVertex = null;
			polygon = body.GetPolygon (i);
			vertexCount = polygon.VertexIndexCount ();
			for (j = 0; j <= vertexCount; j++) {
				vertex = polygon.GetVertexIndex (j % vertexCount);
				coord = body.GetVertexPosition (vertex);
				projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
				if (currentCoord !== null && currentVertex !== null && drawedLines[[currentVertex, vertex]] === undefined) {
					drawer.DrawLine (currentCoord, projected);
					drawedLines[[currentVertex, vertex]] = true;
					drawedLines[[vertex, currentVertex]] = true;
				}
				currentVertex = vertex;
				currentCoord = projected;
			}
		}
		
		drawer.EndPath ();
	}

	return true;
};
