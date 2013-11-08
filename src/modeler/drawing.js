JSM.DrawSettings = function (camera, fieldOfView, nearPlane, farPlane, hiddenLine)
{
	this.camera = camera;
	this.fieldOfView = fieldOfView;
	this.nearPlane = nearPlane;
	this.farPlane = farPlane;
	this.hiddenLine = hiddenLine;
	this.clear = true;
};

JSM.DrawBodyToSVG = function (body, materials, settings, svgObject)
{
	function HexColorToHTMLColor (hexColor)
	{
		var rgb = JSM.HexColorToRGBComponents (hexColor);
		var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
		return result;
	}

	if (settings.clear) {
		while (svgObject.lastChild) {
			svgObject.removeChild (svgObject.lastChild);
		}
	}

	var svgNameSpace = "http://www.w3.org/2000/svg";
	var width = svgObject.getAttribute ('width');
	var height = svgObject.getAttribute ('height');
	
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
			points = '';
			polygon = body.GetPolygon (orderedPolygons[i]);
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				coord = body.GetVertexPosition (polygon.GetVertexIndex (j));
				projected = JSM.Project (coord, eye, center, up, fieldOfView * JSM.DegRad, aspectRatio, nearPlane, farPlane, viewPort);
				x = projected.x;
				y = height - projected.y;
				points = points + x + ', ' + y;
				if (j < polygon.VertexIndexCount () - 1) {
					points = points + ', ';
				}
			}

			svgPolyon = document.createElementNS (svgNameSpace, 'polygon');
			svgPolyon.setAttributeNS (null, 'points', points);
			if (hiddenLine) {
				materialIndex = polygon.GetMaterialIndex ();
				color = materials.GetMaterial (materialIndex).diffuse;
				svgPolyon.setAttributeNS (null, 'fill', HexColorToHTMLColor (color));
				svgPolyon.setAttributeNS (null, 'fill-opacity', '1.0');
			} else {
				svgPolyon.setAttributeNS (null, 'fill', 'none');
			}
			svgPolyon.setAttributeNS (null, 'stroke', 'black');
			svgObject.appendChild (svgPolyon);
		}
	} else {
		var vertexCount, currentCoord, currentVertex, vertex;
		var svgLine;
		
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
					svgLine = document.createElementNS (svgNameSpace, 'line');
					svgLine.setAttributeNS (null, 'stroke', 'black');
					svgLine.setAttributeNS (null, 'x1', currentCoord.x);
					svgLine.setAttributeNS (null, 'y1', height - currentCoord.y);
					svgLine.setAttributeNS (null, 'x2', projected.x);
					svgLine.setAttributeNS (null, 'y2', height - projected.y);
					drawedLines[[currentVertex, vertex]] = true;
					drawedLines[[vertex, currentVertex]] = true;
					svgObject.appendChild (svgLine);
				}
				currentVertex = vertex;
				currentCoord = projected;
			}
		}
	}

	return true;
};
