JSM.SVGDrawer = function (svgObject)
{
	this.svgObject = svgObject;
	this.svgNameSpace = "http://www.w3.org/2000/svg";
};

JSM.SVGDrawer.prototype =
{
	GetWidth : function ()
	{
		return this.svgObject.getAttribute ('width');
	},

	GetHeight : function ()
	{
		return this.svgObject.getAttribute ('height');
	},

	Clear : function ()
	{
		while (this.svgObject.lastChild) {
			this.svgObject.removeChild (this.svgObject.lastChild);
		}
	},
	
	DrawLine : function (from, to)
	{
		var svgLine = document.createElementNS (this.svgNameSpace, 'line');
		var height = this.GetHeight ();
		svgLine.setAttributeNS (null, 'stroke', 'black');
		svgLine.setAttributeNS (null, 'x1', from.x);
		svgLine.setAttributeNS (null, 'y1', height - from.y);
		svgLine.setAttributeNS (null, 'x2', to.x);
		svgLine.setAttributeNS (null, 'y2', height - to.y);
		this.svgObject.appendChild (svgLine);		
	},
	
	DrawPolygon : function (polygon, color)
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
	}
};

JSM.DrawSettings = function (camera, fieldOfView, nearPlane, farPlane, drawMode, clear)
{
	this.camera = camera;
	this.fieldOfView = fieldOfView;
	this.nearPlane = nearPlane;
	this.farPlane = farPlane;
	this.drawMode = drawMode;
	this.clear = clear;
};

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
	}

	return true;
};
