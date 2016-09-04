/**
* Function: ConvertGeoJsonToModel
* Description: Converts a geoJson to 3D model.
* Parameters:
*	geoJson {object} the geojson content
*	sphereRadius {number} the radius of the earth
*	polygonThickness {number} the thickness of polygon models
* Returns:
*	{Model} the result
*/
JSM.ConvertGeoJsonToModel = function (geoJson, sphereRadius, polygonThickness)
{
	function ConvertCoordinate (sphereRadius, coordinate)
	{
		var sphereOffset = sphereRadius * 0.005;
		var lon = coordinate.x * JSM.DegRad;
		var lat = (90.0 - coordinate.y) * JSM.DegRad;
		return JSM.SphericalToCartesian (sphereRadius + sphereOffset, lat, lon);
	}

	function GetSegmentCount (distance)
	{
		var segmentCount = parseInt (distance / 5.0, 10);
		if (segmentCount === 0) {
			segmentCount = 1;
		}
		return segmentCount;
	}
	
	function GetSegmentCountBetweenCoords (begCoordinate, endCoordinate)
	{
		var distance = begCoordinate.DistanceTo (endCoordinate);
		return GetSegmentCount (distance);
	}
	
	function AddPointToBody (body, sphereRadius, sphereCoord, materialIndex)
	{
		var cartesianCoord = ConvertCoordinate (sphereRadius, sphereCoord);
		var vertexIndex = JSM.AddVertexToBody (body, cartesianCoord.x, cartesianCoord.y, cartesianCoord.z);
		var pointIndex = JSM.AddPointToBody (body, vertexIndex);
		var bodyPoint = body.GetPoint (pointIndex);
		bodyPoint.SetMaterialIndex (materialIndex);
	}

	function AddLineToBody (body, sphereRadius, begSphereCoord, endSphereCoord, materialIndex)
	{
		var sector = new JSM.Sector2D (begSphereCoord, endSphereCoord);
		var segmentCount = GetSegmentCountBetweenCoords (begSphereCoord, endSphereCoord);
		var segmentedCoords = JSM.GetSectorSegmentation2D (sector, segmentCount);
		var lastLine = body.LineCount ();
		var i, cartesianCoord, vertexIndex;
		for (i = 0; i < segmentedCoords.length; i++) {
			cartesianCoord = ConvertCoordinate (sphereRadius, segmentedCoords[i]);
			vertexIndex = JSM.AddVertexToBody (body, cartesianCoord.x, cartesianCoord.y, cartesianCoord.z);
			if (i > 0) {
				JSM.AddLineToBody (body, vertexIndex - 1, vertexIndex);
			}
		}
		var bodyLine;
		for (i = lastLine; i < body.LineCount (); i++) {
			bodyLine = body.GetLine (i);
			bodyLine.SetMaterialIndex (materialIndex);
		}				
	}

	function AddPolygonToBody (body, sphereRadius, polygonThickness, polygon, materialIndex)
	{
		function AddSegmentedPolygonToBody (body, polygon, sphereRadius, polygonThickness)
		{
			function AddMainPolygon (body, vertexCoords, reversed)
			{
				var vertices = [];
				var i, vertexCoord;
				for (i = 0; i < vertexCoords.length; i++) {
					vertexCoord = vertexCoords[i];
					vertices.push (JSM.AddVertexToBody (body, vertexCoord.x, vertexCoord.y, vertexCoord.z));
				}
				if (reversed) {
					var reversedVertices = vertices.slice (0);
					reversedVertices.reverse ();
					JSM.AddPolygonToBody (body, reversedVertices);
				} else {
					JSM.AddPolygonToBody (body, vertices);
				}
				return vertices;
			}
			
			function AddSidePolygons (body, topVertices, bottomVertices)
			{
				var vertexCount = topVertices.length;
				var i, curr, next, bottom, nbottom;
				for (i = 0; i < vertexCount; i++) {
					curr = topVertices[i];
					next = topVertices[JSM.NextIndex (i, vertexCount)];
					bottom = bottomVertices[i];
					nbottom = bottomVertices[JSM.NextIndex (i, vertexCount)];
					JSM.AddPolygonToBody (body, [curr, next, nbottom, bottom]);
				}
			}
		
			var eps = 0.001;
			var vertexCoordsTop = [];
			var vertexCoordsBottom = [];
			var i, polygonVertex, cartesianCoord;
			for (i = 0; i < polygon.VertexCount (); i++) {
				polygonVertex = polygon.GetVertex (i);
				cartesianCoord = ConvertCoordinate (sphereRadius, polygonVertex);
				if (vertexCoordsTop.length > 0) {
					if (vertexCoordsTop[vertexCoordsTop.length - 1].IsEqualWithEps (cartesianCoord, eps)) {
						continue;
					}
					if (i == polygon.VertexCount () - 1) {
						if (vertexCoordsTop[0].IsEqualWithEps (cartesianCoord, eps)) {
							continue;
						}
					}
				}
				vertexCoordsTop.push (cartesianCoord);
				if (!JSM.IsZero (polygonThickness)) {
					vertexCoordsBottom.push (ConvertCoordinate (sphereRadius - polygonThickness, polygonVertex));
				}
			}
			if (vertexCoordsTop.length >= 3) {
				var topVertices = AddMainPolygon (body, vertexCoordsTop, true);
				if (vertexCoordsBottom.length !== 0) {
					var bottomVertices = AddMainPolygon (body, vertexCoordsBottom, false);
					AddSidePolygons (body, topVertices, bottomVertices);
				}
			}				
		}
	
		var box = polygon.GetBoundingBox ();
		var xSegments = GetSegmentCount (box.max.x - box.min.x);
		var ySegments = GetSegmentCount (box.max.y - box.min.y);
		var segmentedPolygons = JSM.SegmentPolygon2D (polygon, xSegments, ySegments);
		var i;
		for (i = 0; i < segmentedPolygons.length; i++) {
			AddSegmentedPolygonToBody (body, segmentedPolygons[i], sphereRadius, polygonThickness);
		}
		body.SetPolygonsMaterialIndex (materialIndex);
	}

	function AddPoint (sphereRadius, coordinate, materialIndex)
	{
		if (pointsBody === null) {
			pointsBody = new JSM.Body ();
			result.AddBody (pointsBody);
		}
		var sphereCoord = JSM.CoordFromArray2D (coordinate);
		AddPointToBody (pointsBody, sphereRadius, sphereCoord, materialIndex);
	}
	
	function AddLine (sphereRadius, coordinates, materialIndex)
	{
		if (linesBody === null) {
			linesBody = new JSM.Body ();
			result.AddBody (linesBody);
		}

		var begSphereCoord = JSM.CoordFromArray2D (coordinates[0]);
		var endSphereCoord = JSM.CoordFromArray2D (coordinates[1]);
		AddLineToBody (linesBody, sphereRadius, begSphereCoord, endSphereCoord, materialIndex);
	}
	
	function AddPolygon (sphereRadius, polygonThickness, coordinates, materialIndex)
	{
		var body = new JSM.Body ();
		result.AddBody (body);
		
		var contourPolygon = new JSM.ContourPolygon2D ();
		var i, j, currentContour, sphereCoord;
		for (i = 0; i < coordinates.length; i++) {
			contourPolygon.AddContour ();
			currentContour = coordinates[i];
			for (j = 0; j < currentContour.length - 1; j++) {
				sphereCoord = JSM.CoordFromArray2D (currentContour[j]);
				contourPolygon.AddVertexCoord (sphereCoord);
			}
		}

		if (contourPolygon.GetOrientation () != JSM.Orientation.Clockwise) {
			contourPolygon.ReverseVertices ();
		}
		var polygon = JSM.ConvertContourPolygonToPolygon2D (contourPolygon);
		AddPolygonToBody (body, sphereRadius, polygonThickness, polygon, materialIndex);	
	}

	function AddMultiPolygon (sphereRadius, polygonThickness, coordinates, materialIndex)
	{
		var i;
		for (i = 0; i < coordinates.length; i++) {
			AddPolygon (sphereRadius, polygonThickness, coordinates[i], materialIndex);
		}
	}	

	function AddFeature (sphereRadius, polygonThickness, feature)
	{
		if (!feature.type || feature.type != 'Feature') {
			return false;
		}
		
		if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
			return false;
		}
		
		var materialColor = JSM.RandomInt (0, 16777215);
		var material = new JSM.Material ({ambient : materialColor, diffuse : materialColor, singleSided : true});
		var materialIndex = result.AddMaterial (material);
		if (feature.geometry.type == 'Point') {
			material.pointSize = 10;
			AddPoint (sphereRadius, feature.geometry.coordinates, materialIndex);
		} else if (feature.geometry.type == 'LineString') {
			AddLine (sphereRadius, feature.geometry.coordinates, materialIndex);
		} else if (feature.geometry.type == 'Polygon') {
			AddPolygon (sphereRadius, polygonThickness, feature.geometry.coordinates, materialIndex);
		} else if (feature.geometry.type == 'MultiPolygon') {
			AddMultiPolygon (sphereRadius, polygonThickness, feature.geometry.coordinates, materialIndex);
		}
	}

	if (!geoJson.type || geoJson.type != 'FeatureCollection') {
		return null;
	}
	
	if (!geoJson.features) {
		return null;
	}
	
	var result = new JSM.Model ();
	var pointsBody = null;
	var linesBody = null;
	
	var i, feature;
	for (i = 0; i < geoJson.features.length; i++) {
		feature = geoJson.features[i];
		AddFeature (sphereRadius, polygonThickness, feature);
	}
	return result;
};
