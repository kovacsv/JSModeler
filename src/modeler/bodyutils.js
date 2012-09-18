JSM.AddVertexToBody = function (body, x, y, z)
{
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (x, y, z)));
};

JSM.AddPolygonToBody = function (body, vertices)
{
	body.AddPolygon (new JSM.BodyPolygon (vertices));
};

JSM.CalculateBodyVertexToPolygon = function (body)
{
	var result = [];
	
	var i, j;
	for (i = 0; i < body.VertexCount (); i++) {
		result[i] = [];
	}
	
	var polygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			result[polygon.GetVertexIndex (j)].push (i);
		}
	}
	
	return result;
};

JSM.CalculateBodyPolygonNormal = function (body, index)
{
	var polygon = body.GetPolygon (index);
	var count = polygon.VertexIndexCount ();

	var normal = new JSM.Vector (0.0, 0.0, 0.0);
	if (count >= 3) {
		var i, currentIndex, nextIndex, current, next;
		for (i = 0; i < count; i++) {
			currentIndex = i;
			nextIndex = (i + 1) % count;
	
			current = body.GetVertexPosition (polygon.GetVertexIndex (currentIndex));
			next = body.GetVertexPosition (polygon.GetVertexIndex (nextIndex));
	
			normal.x += (current.y - next.y) * (current.z + next.z);
			normal.y += (current.z - next.z) * (current.x + next.x);
			normal.z += (current.x - next.x) * (current.y + next.y);
		}
	}

	var normalized = JSM.VectorNormalize (normal);
	return normalized;
};

JSM.CalculateBodyPolygonNormals = function (body)
{
	var result = [];
	
	var i;
	for (i = 0; i < body.PolygonCount (); i++) {
		result.push (JSM.CalculateBodyPolygonNormal (body, i));
	}
	
	return result;
};

JSM.CalculateBodyVertexNormals = function (body)
{
	var result = [];
	var polygonNormals = JSM.CalculateBodyPolygonNormals (body);
	var vertexToPolygon = JSM.CalculateBodyVertexToPolygon (body);
	
	var i, j, k, polygon, normal;
	var average, count, neighbourPolygons, neighbourPolygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		result[i] = [];

		if (polygon.HasCurveGroup ()) {
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				average = new JSM.Vector (0.0, 0.0, 0.0);
				count = 0;
				
				neighbourPolygons = vertexToPolygon[polygon.GetVertexIndex (j)];
				for (k = 0; k < neighbourPolygons.length; k++) {
					neighbourPolygon = body.GetPolygon (neighbourPolygons[k]);
					if (neighbourPolygon.GetCurveGroup () === polygon.GetCurveGroup ()) {
						average = JSM.CoordAdd (average, polygonNormals[neighbourPolygons[k]]);
						count++;
					}
				}
				
				average = JSM.VectorMultiply (average, 1.0 / count);
				average = JSM.VectorNormalize (average);
				result[i].push (average);
			}
		} else {
			normal = polygonNormals[i];
			for (j = 0; j < polygon.VertexIndexCount (); j++) {
				result[i].push (new JSM.Vector (normal.x, normal.y, normal.z));
			}
		}
	}
	
	return result;
};
