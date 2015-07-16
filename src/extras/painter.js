/**
* Function: OrderPolygons
* Description: Order body polygons from front to back depending on the eye position.
* Parameters:
*	body {Body} the body
*	eye {Coord} the camera eye position
*	center {Coord} the camera center position
* Returns:
*	{integer[]} the ordered polygon indices
*/
JSM.OrderPolygons = function (body, eye, center)
{
	function SwapArrayValues (array, from, to)
	{
		var temp = array[from];
		array[from] = array[to];
		array[to] = temp;
	}

	function GetPolygonCenter (p)
	{
		var polygon = body.GetPolygon (p);
		var result = new JSM.Coord (0.0, 0.0, 0.0);

		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result = JSM.CoordAdd (result, coord);
		}
		
		result.MultiplyScalar (1.0 / polygon.VertexIndexCount ());
		return result;
	}
	
	function CalculatePolygonValues ()
	{
		var viewDirection = JSM.CoordSub (center, eye).Normalize ();
		var cameraPlane = JSM.GetPlaneFromCoordAndDirection (eye, viewDirection);
		
		var i, j, polygon, coord, distance, minDistance, maxDistance;
		var polygonCenter, polygonCenterDistance;
		var polygonNormal, polygonViewVector, polygonDirection, polygonPlane;
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

			minViewDistances.push (minDistance);
			maxViewDistances.push (maxDistance);
			
			polygonCenter = GetPolygonCenter (i);
			polygonCenterDistance = JSM.CoordPlaneDistance (polygonCenter, cameraPlane);
			polygonCenters.push (polygonCenter);
			polygonCenterDistances.push (polygonCenterDistance);

			polygonNormal = JSM.CalculateBodyPolygonNormal (body, i);
			polygonViewVector = JSM.CoordSub (polygonCenter, eye).Normalize ();
			polygonDirection = JSM.VectorDot (polygonNormal, polygonViewVector);
			if (JSM.IsGreaterOrEqual (polygonDirection, 0.0)) {
				polygonNormal.MultiplyScalar (-1);
			}

			polygonPlane = JSM.GetPlaneFromCoordAndDirection (polygonCenter, polygonNormal);
			polygonPlanes.push (polygonPlane);
		}
	}
	
	function PolygonViewOverlap (s, p)
	{
		return JSM.IsLowerOrEqual (minViewDistances[s], maxViewDistances[p]);
	}

	function PolygonIsFrontOfPlane (s, p)
	{
		var sPlane = polygonPlanes[s];
		var pPlane = polygonPlanes[p];

		var i, coord;

		var isSBehindP = true;
		var sPolygon = body.GetPolygon (s);
		for (i = 0; i < sPolygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (sPolygon.GetVertexIndex (i));
			if (JSM.CoordPlanePosition (coord, pPlane) === 'CoordInFrontOfPlane') {
				isSBehindP = false;
				break;
			}
		}
		
		if (isSBehindP) {
			return false;
		}

		var isPFrontOfS = true;
		var pPolygon = body.GetPolygon (p);
		for (i = 0; i < pPolygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (pPolygon.GetVertexIndex (i));
			if (JSM.CoordPlanePosition (coord, sPlane) === 'CoordAtBackOfPlane') {
				isPFrontOfS = false;
				break;
			}
		}
		
		if (isPFrontOfS) {
			return false;
		}
		
		return true;
	}

	function HasLowerDistance (s, p)
	{
		if (JSM.IsLower (maxViewDistances[s], maxViewDistances[p])) {
			return true;
		} else if (JSM.IsEqual (maxViewDistances[s], maxViewDistances[p])) {
			if (JSM.IsLower (polygonCenterDistances[s], polygonCenterDistances[p])) {
				return true;
			}
		}
		
		return false;
	}
	
	function OrderPolygonsByMaxViewDistance ()
	{
		var count = ordered.length;
		
		var i, j;
		for (i = 0; i < count - 1; i++) {
			for (j = 0; j < count - i - 1; j++) {
				if (HasLowerDistance (ordered[j], ordered[j + 1])) {
					SwapArrayValues (ordered, j, j + 1);
				}
			}
		}
	}

	function NeedToChangeOrder (s, p)
	{
		if (needToChangeOrderCache[s][p] !== null) {
			return needToChangeOrderCache[s][p];
		}

		if (PolygonViewOverlap (s, p)) {
			if (PolygonIsFrontOfPlane (s, p)) {
				needToChangeOrderCache[s][p] = true;
				return true;
			}
		}

		needToChangeOrderCache[s][p] = false;
		return false;
	}
	
	function ReorderPolygons ()
	{
		var count = ordered.length;

		var i, j;
		for (i = 0; i < count - 1; i++) {
			for (j = 0; j < count - i - 1; j++) {
				if (NeedToChangeOrder (ordered[j], ordered[j + 1])) {
					SwapArrayValues (ordered, j, j + 1);
				}
			}
		}
	}
	
	var result = [];
	
	var minViewDistances = [];
	var maxViewDistances = [];
	var polygonCenters = [];
	var polygonCenterDistances = [];
	var polygonPlanes = [];
	
	var ordered = [];
	var needToChangeOrderCache = [];
	var count = body.PolygonCount ();
	
	var i, j;
	for (i = 0; i < count; i++) {
		ordered.push (i);
		needToChangeOrderCache.push ([]);
		for (j = 0; j < count; j++) {
			needToChangeOrderCache[i].push (null);
		}
	}

	CalculatePolygonValues ();
	OrderPolygonsByMaxViewDistance ();
	ReorderPolygons ();
	
	result = ordered;
	return result;
};
