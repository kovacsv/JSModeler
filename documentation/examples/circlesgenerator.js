JSM.GenerateSVGCircles = function (svgObject, greatRadius, smallRadius, controlRadius, rotationSpeed, showCircles)
{
	var HexColorToHTMLColor = function (hexColor)
	{
		var rgb = JSM.HexColorToRGBComponents (hexColor);
		var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
		return result;
	};

	var PolarToCartesianWithCenter = function (center, radius, angle)
	{
		var result = JSM.PolarToCartesian (radius, angle);
		result = JSM.CoordAdd (result, center);
		return result;
	}

	var AddCircle = function (center, radius, fill)
	{
		var svgCircle = document.createElementNS (svgNameSpace, 'circle');
		svgCircle.setAttributeNS (null, 'cx', center.x);
		svgCircle.setAttributeNS (null, 'cy', center.y);
		svgCircle.setAttributeNS (null, 'r', radius);
		svgCircle.setAttributeNS (null, 'stroke', 'black');
		svgCircle.setAttributeNS (null, 'fill', fill);
		svgObject.appendChild (svgCircle);		
	};

	var AddGreatCircle = function (greatCenter, greatRadius)
	{
		AddCircle (greatCenter, greatRadius, HexColorToHTMLColor ('e4e4c5'));
	};

	var AddSmallCircle = function (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle)
	{
		var radiusDiff = greatRadius - smallRadius;
		var smallCenter = PolarToCartesianWithCenter (greatCenter, radiusDiff, rotationAngle);
		AddCircle (smallCenter, smallRadius, HexColorToHTMLColor ('b9d48b'));
	};

	var AddControlPoint = function (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle)
	{
		var controlPosition = GetControlPosition (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle);
		AddCircle (controlPosition, 3, HexColorToHTMLColor ('8d2036'));
	};

	var AddCircles = function (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle)
	{
		AddGreatCircle (greatCenter, greatRadius);
		AddSmallCircle (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle);
		AddControlPoint (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle);
	};

	var GetControlPosition = function (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle)
	{
		var radiusDiff = greatRadius - smallRadius;
		var smallCenter = PolarToCartesianWithCenter (greatCenter, radiusDiff, rotationAngle);

		var greatArcLength = JSM.GetPolarArcLengthFromAngle (greatRadius, rotationAngle);
		var smallAngle = JSM.GetPolarAngleFromArcLength (smallRadius, greatArcLength);
		var controlPosition = PolarToCartesianWithCenter (smallCenter, controlRadius, controlAngle);
		
		return controlPosition;
	};
	
	var clear = true;
	if (clear) {
		while (svgObject.lastChild) {
			svgObject.removeChild (svgObject.lastChild);
		}
	}

	var svgNameSpace = "http://www.w3.org/2000/svg";
	var width = svgObject.getAttribute ('width');
	var height = svgObject.getAttribute ('height');
	var greatCenter = new JSM.Coord2D (width / 2, height / 2);

	var controlAngle = 0.0;
	
	var svgPolyLine = document.createElementNS (svgNameSpace, 'polyline');
	var rotationAngle = 0.0 * JSM.DegRad;
	var points = '';
	
	if (showCircles) {
		AddCircles (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle);
	}

	var angleStep = 1.0;
	var controlStep = angleStep * (1.0 / rotationSpeed);
	var firstPosition = GetControlPosition (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle);
	var i, controlPosition;
	for (i = 0; i <= 360 * (1.0 / controlStep); i++) {
		controlPosition = GetControlPosition (greatCenter, greatRadius, smallRadius, controlRadius, rotationAngle, controlAngle);
		points += controlPosition.x + ',' + controlPosition.y + ',';
		rotationAngle -= angleStep * JSM.DegRad;
		controlAngle -= controlStep * JSM.DegRad;
	}

	svgPolyLine.setAttributeNS (null, 'points', points);
	svgPolyLine.setAttributeNS (null, 'stroke', 'black');
	svgPolyLine.setAttributeNS (null, 'fill', 'none');
	svgObject.appendChild (svgPolyLine);
	
	return true;
};
