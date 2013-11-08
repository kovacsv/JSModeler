JSM.SVGDrawer = function (svgObject)
{
	this.svgObject = svgObject;
	this.svgNameSpace = "http://www.w3.org/2000/svg";
	this.height = this.GetHeight ();
	this.width = this.GetWidth ();
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
		svgLine.setAttributeNS (null, 'stroke', 'black');
		svgLine.setAttributeNS (null, 'x1', from.x);
		svgLine.setAttributeNS (null, 'y1', this.height - from.y);
		svgLine.setAttributeNS (null, 'x2', to.x);
		svgLine.setAttributeNS (null, 'y2', this.height - to.y);
		this.svgObject.appendChild (svgLine);		
	},
	
	DrawPolygon : function (points, color)
	{
		function HexColorToHTMLColor (hexColor)
		{
			var rgb = JSM.HexColorToRGBComponents (hexColor);
			var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
			return result;
		}

		var pointsString = '';
		
		var i, point;
		for (i = 0; i < points.length; i++) {
			point = points[i];
			pointsString = pointsString + point[0] + ', ' + (this.height - point[1]);
			if (i < points.length - 1) {
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

JSM.DrawSettings = function (camera, fieldOfView, nearPlane, farPlane, hiddenLine)
{
	this.camera = camera;
	this.fieldOfView = fieldOfView;
	this.nearPlane = nearPlane;
	this.farPlane = farPlane;
	this.hiddenLine = hiddenLine;
	this.clear = true;
};

JSM.DrawProjectedBody = function (body, materials, settings, drawer)
{
	if (settings.clear) {
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
	var hiddenLine = settings.hiddenLine;

	var i, j, polygon, coord, projected;
	if (hiddenLine) {
		var orderedPolygons = JSM.OrderPolygons (body, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort);
		if (materials === undefined || materials === null) {
			materials = new JSM.Materials ();
		}
		
		var points, x, y;
		var svgPolyon, materialIndex, color;
		for (i = 0; i < orderedPolygons.length; i++) {
			polygon = body.GetPolygon (orderedPolygons[i]);

			points = [];
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				coord = body.GetVertexPosition (polygon.GetVertexIndex (j));
				projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
				x = projected.x;
				y = projected.y;
				points.push ([x, y]);
			}

			materialIndex = polygon.GetMaterialIndex ();
			color = materials.GetMaterial (materialIndex).diffuse;
			
			drawer.DrawPolygon (points, color);
		}
	} else {
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
