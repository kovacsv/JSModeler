/**
* Function: ConvertGeoJsonToModel
* Description: Converts a geoJson to 3D model.
* Parameters:
*	geoJson {object} the geojson content
*	sphereRadius {number} the radius of the earth
*	segmentSize {number} the size of line and polygon segments
*	polygonThickness {number} the thickness of polygon models
* Returns:
*	{Model} the result
*/
JSM.ConvertGeoJsonToModel = function (geoJson, sphereRadius, segmentSize, polygonThickness)
{
	function ConvertCoordinate (sphereRadius, coordinate)
	{
		var sphereOffset = sphereRadius * 0.005;
		var lon = coordinate.x * JSM.DegRad;
		var lat = (90.0 - coordinate.y) * JSM.DegRad;
		return JSM.SphericalToCartesian (sphereRadius + sphereOffset, lat, lon);
	}

	function GetSegmentCount (distance, segmentSize)
	{
		var segmentCount = parseInt (distance / segmentSize, 10);
		if (segmentCount === 0) {
			segmentCount = 1;
		}
		return segmentCount;
	}
	
	function GetSegmentCountBetweenCoords (begCoordinate, endCoordinate, segmentSize)
	{
		var distance = begCoordinate.DistanceTo (endCoordinate);
		return GetSegmentCount (distance, segmentSize);
	}
	
	function AddPointToBody (body, sphereRadius, sphereCoord, materialIndex)
	{
		var cartesianCoord = ConvertCoordinate (sphereRadius, sphereCoord);
		var vertexIndex = JSM.AddVertexToBody (body, cartesianCoord.x, cartesianCoord.y, cartesianCoord.z);
		var pointIndex = JSM.AddPointToBody (body, vertexIndex);
		var bodyPoint = body.GetPoint (pointIndex);
		bodyPoint.SetMaterialIndex (materialIndex);
	}

	function AddLineToBody (body, sphereRadius, begSphereCoord, endSphereCoord, segmentSize, materialIndex)
	{
		var sector = new JSM.Sector2D (begSphereCoord, endSphereCoord);
		var segmentCount = GetSegmentCountBetweenCoords (begSphereCoord, endSphereCoord, segmentSize);
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

	function AddPolygonToBody (body, sphereRadius, polygonThickness, segmentSize, polygon, materialIndex)
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
		var xSegments = GetSegmentCount (box.max.x - box.min.x, segmentSize);
		var ySegments = GetSegmentCount (box.max.y - box.min.y, segmentSize);
		var segmentedPolygons = JSM.SegmentPolygon2D (polygon, xSegments, ySegments);
		var i;
		for (i = 0; i < segmentedPolygons.length; i++) {
			AddSegmentedPolygonToBody (body, segmentedPolygons[i], sphereRadius, polygonThickness);
		}
		body.SetPolygonsMaterialIndex (materialIndex);
	}

	function AddPoint (body, sphereRadius, coordinate, materialIndex)
	{
		var sphereCoord = JSM.CoordFromArray2D (coordinate);
		AddPointToBody (body, sphereRadius, sphereCoord, materialIndex);
	}
	
	function AddLineString (body, sphereRadius, coordinates, segmentSize, materialIndex)
	{
		var i, begSphereCoord, endSphereCoord;
		for (i = 0; i < coordinates.length - 1; i++) {
			begSphereCoord = JSM.CoordFromArray2D (coordinates[i]);
			endSphereCoord = JSM.CoordFromArray2D (coordinates[i + 1]);
			AddLineToBody (body, sphereRadius, begSphereCoord, endSphereCoord, segmentSize, materialIndex);
		}
	}
	
	function AddPolygon (body, sphereRadius, polygonThickness, segmentSize, coordinates, materialIndex)
	{
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
		AddPolygonToBody (body, sphereRadius, polygonThickness, segmentSize, polygon, materialIndex);	
	}

	function AddFeature (model, staticBodies, sphereRadius, segmentSize, polygonThickness, feature)
	{
		function CreateNewBody (model)
		{
			var body = new JSM.Body ();
			model.AddBody (body);
			return body;
		}
		
		if (!feature.type || feature.type != 'Feature') {
			return false;
		}
		
		if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
			return false;
		}
		
		var i;
		var materialColor = JSM.RandomInt (0, 16777215);
		var material = new JSM.Material ({ambient : materialColor, diffuse : materialColor, singleSided : true});
		var materialIndex = model.AddMaterial (material);
		if (feature.geometry.type == 'Point' || feature.geometry.type == 'MultiPoint') {
			if (staticBodies.pointsBody === null) {
				staticBodies.pointsBody = CreateNewBody (model);
			}
			material.pointSize = 10;
			if (feature.geometry.type == 'Point') {
				AddPoint (staticBodies.pointsBody, sphereRadius, feature.geometry.coordinates, materialIndex);
			} else if (feature.geometry.type == 'MultiPoint') {
				for (i = 0; i < feature.geometry.coordinates.length; i++) {
					AddPoint (staticBodies.pointsBody, sphereRadius, feature.geometry.coordinates[i], materialIndex);
				}
			}
		} else if (feature.geometry.type == 'LineString' || feature.geometry.type == 'MultiLineString') {
			if (staticBodies.linesBody === null) {
				staticBodies.linesBody = CreateNewBody (model);
			}
			if (feature.geometry.type == 'LineString') {
				AddLineString (staticBodies.linesBody, sphereRadius, feature.geometry.coordinates, segmentSize, materialIndex);
			} else if (feature.geometry.type == 'MultiLineString') {
				for (i = 0; i < feature.geometry.coordinates.length; i++) {
					AddLineString (staticBodies.linesBody, sphereRadius, feature.geometry.coordinates[i], segmentSize, materialIndex);
				}
			}
		} else if (feature.geometry.type == 'Polygon' || feature.geometry.type == 'MultiPolygon') {
			var body = CreateNewBody (model);
			if (feature.geometry.type == 'Polygon') {
				AddPolygon (body, sphereRadius, polygonThickness, segmentSize, feature.geometry.coordinates, materialIndex);
			} else if (feature.geometry.type == 'MultiPolygon') {
				for (i = 0; i < feature.geometry.coordinates.length; i++) {
					AddPolygon (body, sphereRadius, polygonThickness, segmentSize, feature.geometry.coordinates[i], materialIndex);
				}
			}
		}
	}

	if (!geoJson.type || geoJson.type != 'FeatureCollection') {
		return null;
	}
	
	if (!geoJson.features) {
		return null;
	}
	
	var result = new JSM.Model ();
	var staticBodies = {
		pointsBody : null,
		linesBody : null
	};
	
	var i, feature;
	for (i = 0; i < geoJson.features.length; i++) {
		feature = geoJson.features[i];
		AddFeature (result, staticBodies, sphereRadius, segmentSize, polygonThickness, feature);
	}
	return result;
};
