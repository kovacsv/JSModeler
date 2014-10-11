function AddBodyVertex (body, coord)
{
	var index = body.VertexCount ();
	
	var i;
	for (i = 0; i < body.VertexCount (); i++) {
		if (JSM.CoordIsEqual (body.GetVertex (i).position, coord)) {
			return i;
		}
	}
	
	body.AddVertex (new JSM.BodyVertex (coord));
	return index;
};		

function CalculateEdgeAngle (body, al)
{
	var edge = al.edges[0];
	var pgon1Normal = JSM.CalculateBodyPolygonNormal (body, edge.pgon1);
	var pgon2Normal = JSM.CalculateBodyPolygonNormal (body, edge.pgon2);
	var edgeAngle = Math.PI - JSM.GetVectorsAngle (pgon1Normal, pgon2Normal);
	return edgeAngle;
}

function CalculateEdgeLine (body, al, index, edgeAngle, width)
{
	var offset = width / Math.cos (edgeAngle / 2.0);
	
	var edge = al.edges[index];
	var edgeVert1 = body.GetVertexPosition (edge.vert1);
	var edgeVert2 = body.GetVertexPosition (edge.vert2);
	var edgeMidCoord = JSM.MidCoord (edgeVert1, edgeVert2);
	var edgeOffset = JSM.VectorMultiply (edgeMidCoord, -1);
	var edgeOffsetedVert1 = JSM.CoordOffset (edgeVert1, edgeOffset, offset);
	var edgeOffsetedVert2 = JSM.CoordOffset (edgeVert2, edgeOffset, offset);
	
	return new JSM.Line (edgeOffsetedVert1, JSM.VectorNormalize (JSM.CoordSub (edgeOffsetedVert2, edgeOffsetedVert1)));
}

function CalculateVertexOffsets (body, width)
{
	var al = JSM.CalculateAdjacencyInfo (body);
	var edgeAngle = CalculateEdgeAngle (body, al);
	
	var vert = al.verts[0];
	var vertPosition = body.GetVertexPosition (0);
	var edge1Line = CalculateEdgeLine (body, al, vert.edges[0], edgeAngle, width);
	var edge2Line = CalculateEdgeLine (body, al, vert.edges[1], edgeAngle, width);
	
	var vertexOffset = 0.0;
	var intersection = new JSM.Coord (0.0, 0.0, 0.0);
	if (JSM.LineLinePosition (edge1Line, edge2Line, intersection) == 'LinesIntersectsOnePoint') {
		vertexOffset = JSM.CoordDistance (vertPosition, intersection);
	}
	
	return vertexOffset;
}

function ZOffsetPolygon (polygon, direction, distance)
{
	var result = [];
	
	var i;
	for (i = 0; i < polygon.length; i++) {
		result.push (JSM.CoordOffset (polygon[i], direction, distance));
	}
	
	return result;
};

function CalculateOffsetedPolygon (body, polygonIndex, polygonOffset)
{
	var polygon = body.GetPolygon (polygonIndex);
	var count = polygon.VertexIndexCount ();
	var normal = JSM.CalculateBodyPolygonNormal (body, polygonIndex);
	normal = JSM.VectorMultiply (normal, -1);
	
	var basePolygon = [];
	var i;
	for (i = 0; i < count; i++) {
		basePolygon.push (body.GetVertexPosition (polygon.GetVertexIndex (i)));
	}
	
	var polygon = new JSM.Polygon ();
	polygon.vertices = basePolygon;
	var offsetedPolygon = JSM.OffsetPolygonContour (polygon, polygonOffset);
	return offsetedPolygon.vertices;
};

function CalculatePolygonOffsets (body, polygonIndex, width, edgeAngle, desiredAngle)
{
	var offsets = [0.0, 0.0];
	var diffAngle = (edgeAngle - desiredAngle) / 2.0;
	offsets[0] = width * Math.cos (diffAngle);
	offsets[1] = width * Math.sin (diffAngle);
	return offsets;
};

function GenerateContourSolid (name, width)
{
	var body = JSM.GenerateSolidWithRadius (name, 1.0);
	var originalVertexCount = body.VertexCount ();
	
	var result = new JSM.Body ();
	var i, j;
	for (i = 0; i < body.VertexCount (); i++) {
		result.AddVertex (body.GetVertex (i).Clone ());
	}

	var vertexCoord, offsetDir, newVertexCoord;
	var vertexOffset = CalculateVertexOffsets (body, width);
	for (i = 0; i < body.VertexCount (); i++) {
		vertexCoord = body.GetVertexPosition (i).Clone ();
		offsetDir = JSM.VectorMultiply (vertexCoord, -1);
		newVertexCoord = JSM.CoordOffset (vertexCoord, offsetDir, vertexOffset);
		result.AddVertex (new JSM.BodyVertex (newVertexCoord));
	}
	
	var polygon, count, innerPolygon;
	var innerVertices, offsetedInnerVertices, index, curr, next, top, ntop;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		count = polygon.VertexIndexCount ();
		
		innerPolygon = CalculateOffsetedPolygon (body, i, width);
		innerVertices = [];
		for (j = 0; j < count; j++) {
			innerVertices.push (result.VertexCount ());
			result.AddVertex (new JSM.BodyVertex (innerPolygon[j]));
		}

		for (j = 0; j < count; j++) {
			curr = polygon.GetVertexIndex (j);
			next = polygon.GetVertexIndex (j < count - 1 ? j + 1 : 0);
			top = innerVertices[j];
			ntop = innerVertices[j < count - 1 ? j + 1 : 0];
			result.AddPolygon (new JSM.BodyPolygon ([curr, next, ntop, top]));
		}
		
		for (j = 0; j < count; j++) {
			curr = originalVertexCount + polygon.GetVertexIndex (j);
			next = originalVertexCount + polygon.GetVertexIndex (j < count - 1 ? j + 1 : 0);
			top = innerVertices[j];
			ntop = innerVertices[j < count - 1 ? j + 1 : 0];
			result.AddPolygon (new JSM.BodyPolygon ([curr, top, ntop, next]));
		}
	}
	if (!JSM.IsSolidBody (result)) {
		alert ('not solid');
	}
	return result;
};
