// http://www.siggraph.org/education/materials/HyperGraph/scanline/visibility/painter.htm
JSM.OrderPolygons = function (body, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
{
	var SwapArrayValues = function (array, from, to)
	{
		var temp = array[from];
		array[from] = array[to];
		array[to] = temp;
	};

	var GetProjectedPolygon = function (p)
	{
		var polygon = body.GetPolygon (p);
		var coords = [];

		var i, coord, projected;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			projected = JSM.Project (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort);
			coords.push (projected);
		}

		return coords;	
	};

	var GetPolygonCenter = function (p)
	{
		var polygon = body.GetPolygon (p);
		var result = new JSM.Coord ();

		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result = JSM.CoordAdd (result, coord);
		}
		
		result = JSM.VectorMultiply (result, 1.0 / polygon.VertexIndexCount ());
		return result;	
	};
	
	var GetBoundingBox = function (coords)
	{
		var min = new JSM.Coord2D (JSM.Inf, JSM.Inf);
		var max = new JSM.Coord2D (-JSM.Inf, -JSM.Inf);
		for (i = 0; i < coords.length; i++) {
			coord = coords[i];
			min.x = JSM.Minimum (min.x, coord.x);
			min.y = JSM.Minimum (min.y, coord.y);
			max.x = JSM.Maximum (max.x, coord.x);
			max.y = JSM.Maximum (max.y, coord.y);
		}

		return [min, max];
	};
	
	var CalculatePolygonValues = function ()
	{
		var cameraPlane = new JSM.Plane ();
		var viewDirection = JSM.VectorNormalize (JSM.CoordSub (center, eye));
		cameraPlane.SetFromCoordAndDirection (eye, viewDirection);
		
		var i, j, polygon, coord, distance, minDistance, maxDistance, projectedPolygon;
		for (i = 0; i < body.PolygonCount (); i++) {
			minDistance = JSM.Inf;
			maxDistance = -JSM.Inf;
			polygon = body.GetPolygon (i);
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				coord = body.GetVertexPosition (polygon.GetVertexIndex (j));
				distance = JSM.CoordPlaneDistance (coord, cameraPlane);
				if (JSM.IsLower (distance, minDistance)) {
					minDistance = distance;
				}
				if (JSM.IsGreater (distance, maxDistance)) {
					maxDistance = distance;
				}
			}
			minZDistances.push (minDistance);
			maxZDistances.push (maxDistance);
			
			polygonNormals.push (JSM.CalculateBodyPolygonNormal (body, i));
			var polygonCenter = GetPolygonCenter (i);
			polygonCenters.push (polygonCenter);
			polygonCenterDistances.push (JSM.CoordPlaneDistance (polygonCenter, cameraPlane));
			projectedPolygon = GetProjectedPolygon (i);
			projectedPolygons.push (projectedPolygon);
			xyBoundingBoxes.push (GetBoundingBox (projectedPolygon));
		}
	};
	
	var OrderPolygonsByMaxZDistance = function ()
	{
		var count = body.PolygonCount ();
		
		var i, j;
		for (i = 0; i < count; i++) {
			orderedByMaxZDistance.push (i);
		}

		var s, p, swap;
		for (i = 0; i < count - 1; i++) {
			for (j = 0; j < count - i - 1; j++) {
				s = orderedByMaxZDistance[j];
				p = orderedByMaxZDistance[j + 1];
				swap = false;
				if (JSM.IsLower (maxZDistances[s], maxZDistances[p])) {
					swap = true;
				} else if (JSM.IsEqual (maxZDistances[s], maxZDistances[p])) {
					if (JSM.IsLower (polygonCenterDistances[s], polygonCenterDistances[p])) {
						swap = true;
					}
				}
				if (swap) {
					SwapArrayValues (orderedByMaxZDistance, j, j + 1);
				}
			}
		}
	};
	
	var BoxesOverlap = function (sBox, pBox)
	{
		if (JSM.IsLower (sBox[1].x, pBox[0].x) || JSM.IsGreater (sBox[0].x, pBox[1].x)) {
			return false;
		}

		if (JSM.IsLower (sBox[1].y, pBox[0].y) || JSM.IsGreater (sBox[0].y, pBox[1].y)) {
			return false;
		}

		return true;
	};

	var IsBehindPlane = function (s, p)
	{
		var sPolygon = body.GetPolygon (s);
		var pPolygon = body.GetPolygon (p);
		
		var sFirstCoord = body.GetVertexPosition (sPolygon.GetVertexIndex (0));
		var pFirstCoord = body.GetVertexPosition (pPolygon.GetVertexIndex (0));
		
		var sViewVector = JSM.VectorNormalize (JSM.CoordSub (polygonCenters[s], eye));
		var pViewVector = JSM.VectorNormalize (JSM.CoordSub (polygonCenters[p], eye));
		
		var sPlane = new JSM.Plane ();
		var pPlane = new JSM.Plane ();

		var sNormal = polygonNormals[s];
		var pNormal = polygonNormals[p];

		var sDot = JSM.VectorDot (sNormal, sViewVector);
		var pDot = JSM.VectorDot (pNormal, pViewVector);
		
		if (JSM.IsGreaterOrEqual (sDot, 0.0)) {
			sNormal = JSM.VectorMultiply (sNormal, -1);
		}
		
		if (JSM.IsGreaterOrEqual (pDot, 0.0)) {
			pNormal = JSM.VectorMultiply (pNormal, -1);
		}	

		sPlane.SetFromCoordAndDirection (sFirstCoord, sNormal);
		pPlane.SetFromCoordAndDirection (pFirstCoord, pNormal);

		var isSBehindP = true;

		var i, coord;
		for (i = 0; i < sPolygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (sPolygon.GetVertexIndex (i));
			if (JSM.CoordPlanePosition (coord, pPlane) === 'CoordInFrontOfPlane') {
				isSBehindP = false;
				break;
			}
		}
		
		if (isSBehindP) {
			return true;
		}

		var isPFrontOfS = true;
		for (i = 0; i < pPolygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (pPolygon.GetVertexIndex (i));
			if (JSM.CoordPlanePosition (coord, sPlane) === 'CoordAtBackOfPlane') {
				isPFrontOfS = false;
				break;
			}
		}
		
		if (isPFrontOfS) {
			return true;
		}
		
		return false;
	};
	
	var Test0 = function (s, p)
	{
		if (JSM.IsLowerOrEqual (minZDistances[s], maxZDistances[p])) {
			return false;
		}
		
		return true;
	};

	var Test1 = function (s, p)
	{
		if (BoxesOverlap (xyBoundingBoxes[s], xyBoundingBoxes[p])) {
			return false;
		}
		
		return true;
	};
	
	var Test2 = function (s, p)
	{
		if (!IsBehindPlane (s, p)) {
			return false;
		}
		
		return true;
	};

	var PolygonIsBehind = function (s, p)
	{
		if (Test0 (s, p)) {
			return true;
		}

		if (Test1 (s, p)) {
			return true;
		}

		if (Test2 (s, p)) {
			return true;
		}

		return false;
	};
	
	var ReorderPolygons = function ()
	{
		var count = ordered.length;
		
		var i, j, k, s, p;
		
		var compared = [];
		for (i = 0; i < count; i++) {
			compared[i] = [];
			for (j = 0; j < count; j++) {
				compared[i].push (false);
			}
		}
		
		for (i = 0; i < count; i++) {
			s = ordered[i];
			for (j = i + 1; j < count; j++) {
				p = ordered[j];
				if (!compared[s][p]) {
					compared[s][p] = true;
					compared[p][s] = true;
					if (!PolygonIsBehind (s, p)) {
						for (k = j; k > i; k--) {
							ordered[k] = ordered[k - 1];
						}
						ordered[i] = p;
						i--;
						break;
					}
				}
			}
		}
		
		for (i = 0; i < count; i++) {
			if (ordered[i] == undefined) {
				alert (i);
			}
		}
	}
	
	var result = [];
	
	var projectedPolygons = [];
	var xyBoundingBoxes = [];
	var minZDistances = [];
	var maxZDistances = [];
	var polygonNormals = [];
	var polygonCenters = [];
	var polygonCenterDistances = [];
	CalculatePolygonValues ();
	
	var orderedByMaxZDistance = [];
	OrderPolygonsByMaxZDistance ();

	var ordered = orderedByMaxZDistance;
	ReorderPolygons ();
	
	result = ordered;
	return result;
};
