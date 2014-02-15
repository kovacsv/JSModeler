/**
* Function: SvgToModel
* Description: Converts an svg objects rect, path and polygon elements to a body.
* Parameters:
*	svgObject {html svg element} the svg element
*	height {number} the height of the result body
*	segmentLength {number} the maximum length of curved segments
* Returns:
*	{Body} the result
*/
JSM.SvgToModel = function (svgObject, height, segmentLength)
{
	function SegmentElem (elem, segmentLength)
	{
		function AddTransformedVertex (dummySVG, result, contour, elem, x, y)
		{
			var point = dummySVG.createSVGPoint ();
			point.x = x;
			point.y = y;
			
			var transformed = point.matrixTransform (elem.getCTM ());
			var transformedCoord = new JSM.Coord2D (transformed.x, transformed.y);
			var resultCoord = new JSM.Coord2D (x, y);
			
			var contourVertexCount = result.VertexCount (contour);
			if (contourVertexCount > 0) {
				if (JSM.CoordIsEqual2DWithEps (result.GetVertex (contour, contourVertexCount - 1), transformedCoord, 0.1)) {
					return resultCoord;
				}
			}
			
			result.AddVertex (contour, transformed.x, transformed.y);
			return resultCoord;
		}

		function SegmentCurve (dummySVG, originalPath, segmentLength, lastCoord, items, result, currentContour)
		{
			function CreatePath (items)
			{
				function GenerateMoveCommand (x, y)
				{
					return 'M ' + x + ' ' + y;
				}
			
				var svgNameSpace = 'http://www.w3.org/2000/svg';
				var path = document.createElementNS (svgNameSpace, 'path');

				var commandString = GenerateMoveCommand (lastCoord.x, lastCoord.y);
				var i, item, command, largeArcFlag, sweepFlag;
				for (i = 0; i < items.length; i++) {
					item = items[i];
					if (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
						item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL) {
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ? 'C' : 'c');
						commandString += command + ' ' + item.x1 + ' ' + item.y1 + ' ' + item.x2 + ' ' + item.y2 + ' ' + item.x + ' ' + item.y + ' ';
					} else if (	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
								item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ? 'Q' : 'q');
						commandString += command + ' ' + item.x1 + ' ' + item.y1 + ' ' + item.x + ' ' + item.y + ' ';
					} else if (	item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
								item.pathSegType == SVGPathSeg.PATHSEG_ARC_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ? 'A' : 'a');
						largeArcFlag = (item.largeArcFlag ? 1 : 0);
						sweepFlag = (item.sweepFlag ? 1 : 0);
						commandString +=  command + ' ' + item.r1 + ' ' + item.r2 + ' ' + item.angle + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + item.x + ' ' + item.y + ' ';
					} else if (	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
								item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL){
						command = (item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ? 'S' : 's');
						commandString +=  command + ' ' + item.x2 + ' ' + item.y2 + ' ' + item.x + ' ' + item.y + ' ';
					} else {
						// unknown segment type
					}
				}
				
				path.setAttributeNS (null, 'd', commandString);
				return path;
			}
		
			var path = CreatePath (items);
			var pathLength = path.getTotalLength ();

			var segmentation = 0;
			if (segmentLength > 0) {
				segmentation = parseInt (pathLength / segmentLength, 10);
			}
			if (segmentation < 3) {
				segmentation = 3;
			}
			
			var step = pathLength / segmentation;
			var i, point;
			for (i = 1; i <= segmentation; i++) {
				point = path.getPointAtLength (i * step);
				lastCoord = AddTransformedVertex (dummySVG, result, currentContour, originalPath, point.x, point.y);
			}
			
			return lastCoord;
		}
		
		function IsCurvedItem (item)
		{
			return	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL ||
					item.pathSegType == SVGPathSeg.PATHSEG_ARC_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_ARC_REL ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
		}
		
		function IsSmoothItem (item)
		{
			return	item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS ||
					item.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
		}

		function RemoveEqualEndVertices (polygon, contour)
		{
			var vertexCount = polygon.VertexCount (contour);
			if (vertexCount === 0) {
				return;
			}
			
			var firstCoord = polygon.GetVertex (contour, 0);
			var lastCoord = polygon.GetVertex (contour, vertexCount - 1);
			if (JSM.CoordIsEqual2DWithEps (firstCoord, lastCoord, 0.1)) {
				polygon.GetContour (contour).vertices.pop ();
			}
		}
	
		function StartNewContour (result, contour)
		{
			if (result.VertexCount (contour) > 0) {
				RemoveEqualEndVertices (result, contour);
				result.AddContour ();
				return contour + 1;
			}
			return contour;
		}
	
		function SVGColorToHex (path)
		{
			var svgColor = '';
			var target = path;
			while (target !== null && target !== undefined && svgColor.length === 0) {
				svgColor = target.getAttribute ('fill');
				if (svgColor === null) {
					svgColor = target.style.fill;
				}
				target = target.parentElement;
			}

			var result = 0x000000;
			if (svgColor.length === 0) {
				return result;
			}
			
			if (svgColor[0] == '#') {
				result = JSM.HexColorToRGBColor (svgColor.substring (1));
			} else {
				var firstBracket = svgColor.indexOf ('(');
				var secondBracket = svgColor.indexOf (')');
				if (firstBracket == -1 || secondBracket == -1) {
					return result;
				}
				
				var numbers = svgColor.substring (firstBracket + 1, secondBracket);
				var rgb = numbers.split (', ');
				if (rgb.length != 3) {
					return result;
				}
				
				result = JSM.RGBComponentsToRGBColor (rgb[0], rgb[1], rgb[2]);
			}
			
			return result;
		}
	
		var result = new JSM.ContourPolygon2D ();

		var dummySVG = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');

		var i, j;
		if (elem instanceof SVGPathElement) {
			var lastCoord = new JSM.Coord2D (0.0, 0.0);
			var lastMoveCoord = new JSM.Coord2D (0.0, 0.0);

			var currentSegmentLength = segmentLength;
			if (elem.hasAttribute ('segmentlength')) {
				currentSegmentLength = parseFloat (elem.getAttribute ('segmentlength'));
			}
			
			var item, items, currentItem;
			var currentContour = 0;
			for (i = 0; i < elem.pathSegList.numberOfItems; i++) {
				item = elem.pathSegList.getItem (i);
				if (item.pathSegType == SVGPathSeg.PATHSEG_CLOSEPATH) {
					// do nothing
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_MOVETO_ABS) {
					currentContour = StartNewContour (result, currentContour);
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, item.x, item.y);
					lastMoveCoord = lastCoord.Clone ();
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_MOVETO_REL) {
					currentContour = StartNewContour (result, currentContour);
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, lastMoveCoord.x + item.x, lastMoveCoord.y + item.y);
					lastMoveCoord = lastCoord.Clone ();
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_ABS) {
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, item.x, item.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_REL) {
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, lastCoord.x + item.x, lastCoord.y + item.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS) {
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, item.x, lastCoord.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS) {
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, lastCoord.x, item.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL) {
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, lastCoord.x + item.x, lastCoord.y);
				} else if (item.pathSegType == SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL) {
					lastCoord = AddTransformedVertex (dummySVG, result, currentContour, elem, lastCoord.x, lastCoord.y + item.y);
				} else if (IsCurvedItem (item)) {
					items = [];
					if (IsSmoothItem (item)) {
						for (j = i; j < elem.pathSegList.numberOfItems; j++) {
							currentItem = elem.pathSegList.getItem (j);
							if (!IsSmoothItem (currentItem)) {
								break;
							}
							items.push (currentItem);
						}
						i = j - 1;
					} else {
						items.push (item);
					}
					lastCoord = SegmentCurve (dummySVG, elem, currentSegmentLength, lastCoord, items, result, currentContour);
				} else {
					// unknown segment type
				}
			}
			
			RemoveEqualEndVertices (result, currentContour);
		} else if (elem instanceof SVGRectElement) {
			AddTransformedVertex (dummySVG, result, 0, elem, elem.x.baseVal.value, elem.y.baseVal.value);
			AddTransformedVertex (dummySVG, result, 0, elem, elem.x.baseVal.value + elem.width.baseVal.value, elem.y.baseVal.value);
			AddTransformedVertex (dummySVG, result, 0, elem, elem.x.baseVal.value + elem.width.baseVal.value, elem.y.baseVal.value + elem.height.baseVal.value);
			AddTransformedVertex (dummySVG, result, 0, elem, elem.x.baseVal.value, elem.y.baseVal.value + elem.height.baseVal.value);
		} else if (elem instanceof SVGPolygonElement) {
			var point;
			for (i = 0; i < elem.points.numberOfItems; i++) {
				point = elem.points.getItem (i);
				AddTransformedVertex (dummySVG, result, 0, elem, point.x, point.y);
			}
		}
		result.color = SVGColorToHex (elem);
		return result;
	}
	
	function SegmentPaths (svgObject, segmentLength)
	{
		function AddElemType (svgObject, elemType, result)
		{
			var elems = svgObject.getElementsByTagName (elemType);
			var i;
			for (i = 0; i < elems.length; i++) {
				result.push (elems[i]);
			}
		}
	
		var result = [];
		var elems = [];
		AddElemType (svgObject, 'path', elems);
		AddElemType (svgObject, 'rect', elems);
		AddElemType (svgObject, 'polygon', elems);
		
		var currentSegmentLength = segmentLength;
		if (svgObject.hasAttribute ('segmentlength')) {
			currentSegmentLength = parseFloat (svgObject.getAttribute ('segmentlength'));
		}

		var i, current;
		for (i = 0; i < elems.length; i++) {
			current = SegmentElem (elems[i], currentSegmentLength);
			result.push (current);
		}
		
		return result;
	}
	
	function ContourPolygonToPrisms (polygon, height)
	{
		function CreateBasePolygon (polygon, orientation)
		{
			var basePolygon = [];
			
			var i, coord;
			if (orientation == 'Clockwise') {
				for (i = 0; i < polygon.VertexCount (); i++) {
					coord = polygon.GetVertex (i);
					basePolygon.push (new JSM.Coord (coord.x, 0.0, -coord.y));
				}
			} else {
				for (i = polygon.VertexCount () - 1; i >= 0; i--) {
					coord = polygon.GetVertex (i);
					basePolygon.push (new JSM.Coord (coord.x, 0.0, -coord.y));
				}
			}

			return basePolygon;
		}
	
		function AddHoleToBasePolygon (basePolygon, polygon, orientation)
		{
			basePolygon.push (null);
		
			var i, coord;
			if (orientation == 'CounterClockwise') {
				for (i = 0; i < polygon.VertexCount (); i++) {
					coord = polygon.GetVertex (i);
					basePolygon.push (new JSM.Coord (coord.x, 0.0, -coord.y));
				}
			} else {
				for (i = polygon.VertexCount () - 1; i >= 0; i--) {
					coord = polygon.GetVertex (i);
					basePolygon.push (new JSM.Coord (coord.x, 0.0, -coord.y));
				}
			}
		}

		var prisms = [];
		var direction = new JSM.Vector (0.0, -1.0, 0.0);
		
		var basePolygon, baseOrientation, prism;
		var contourCount = polygon.ContourCount ();
		if (contourCount == 1) {
			baseOrientation = JSM.PolygonOrientation2D (polygon.GetContour (0));
			basePolygon = CreateBasePolygon (polygon.GetContour (0), baseOrientation);
			prism = JSM.GeneratePrism (basePolygon, direction, height, true);
			prisms.push (prism);
		} else if (contourCount > 1) {
			baseOrientation = JSM.PolygonOrientation2D (polygon.GetContour (0));
			var holeBasePolygon = CreateBasePolygon (polygon.GetContour (0), baseOrientation);
			var hasHoles = false;
			
			var i, orientation;
			for (i = 1; i < polygon.ContourCount (); i++) {
				orientation = JSM.PolygonOrientation2D (polygon.GetContour (i));
				if (orientation == baseOrientation) {
					basePolygon = CreateBasePolygon (polygon.GetContour (i), baseOrientation);
					prism = JSM.GeneratePrism (basePolygon, direction, height, true);
					prisms.push (prism);
				} else {
					AddHoleToBasePolygon (holeBasePolygon, polygon.GetContour (i), orientation);
					hasHoles = true;
				}
			}
			
			if (!hasHoles) {
				prism = JSM.GeneratePrism (holeBasePolygon, direction, height, true);
				prisms.push (prism);
			} else {
				prism = JSM.GeneratePrismWithHole (holeBasePolygon, direction, height, true);
				prisms.push (prism);
			}
		}
		
		var material = new JSM.Material (polygon.color, polygon.color);
		return [prisms, material];
	}
	
	var model = new JSM.Model ();
	var materials = new JSM.Materials ();
	var polygons = SegmentPaths (svgObject, segmentLength);

	var currentHeight = height;
	if (svgObject.hasAttribute ('modelheight')) {
		currentHeight = parseFloat (svgObject.getAttribute ('modelheight'));
	}
	
	var i, j, prismsAndMaterial, currentPrisms, currentPrism, currentMaterial;
	for (i = 0; i < polygons.length; i++) {
		prismsAndMaterial = ContourPolygonToPrisms (polygons[i], currentHeight);
		currentPrisms = prismsAndMaterial[0];
		currentMaterial = prismsAndMaterial[1];
		materials.AddMaterial (currentMaterial);
		for (j = 0; j < currentPrisms.length; j++) {
			currentPrism = currentPrisms[j];
			currentPrism.SetPolygonsMaterialIndex (materials.Count () - 1);
			model.AddBody (currentPrism);
		}
	}

	return [model, materials];
};
