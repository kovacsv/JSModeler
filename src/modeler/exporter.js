JSM.ExportBodyContentToStl = function (body, name, hasConvexPolygons)
{
	function AddLineToContent (line)
	{
		stlContent += line + '\n';
	}

	function AddTriangleToContent (normal, vertex1, vertex2, vertex3)
	{
		AddLineToContent ('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z);
		AddLineToContent ('\t\touter loop');
		AddLineToContent ('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z);
		AddLineToContent ('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z);
		AddLineToContent ('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z);
		AddLineToContent ('\t\tendloop');
		AddLineToContent ('\tendfacet');
	}
	
	function AddPolygon (index)
	{
		var polygon = body.GetPolygon (index);
		var count = polygon.VertexIndexCount ();
		if (count < 3) {
			return;
		}
		
		var vertex1, vertex2, vertex3;
		var normal1, normal2, normal3;
		var uv1, uv2, uv3;

		var normal = null;
		if (count === 3) {
			normal = JSM.CalculateBodyPolygonNormal (body, index);
			vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
			vertex2 = body.GetVertex (polygon.GetVertexIndex (1)).position;
			vertex3 = body.GetVertex (polygon.GetVertexIndex (2)).position;
			AddTriangleToContent (normal, vertex1, vertex2, vertex3);
		} else {
			var useTriangulation = true;
			if (hasConvexPolygons !== undefined && hasConvexPolygons) {
				useTriangulation = false;
			}
		
			var i;
			normal = JSM.CalculateBodyPolygonNormal (body, index);
			if (useTriangulation) {
				var polygon3D = new JSM.Polygon ();
				
				var vertex;
				for (i = 0; i < count; i++) {
					vertex = body.GetVertex (polygon.vertices[i]);
					polygon3D.AddVertex (vertex.position.x, vertex.position.y, vertex.position.z);
				}
				
				var triangles = JSM.PolygonTriangulate (polygon3D, normal);
				
				var triangle;
				for (i = 0; i < triangles.length; i++) {
					triangle = triangles[i];
					vertex1 = body.GetVertex (polygon.GetVertexIndex (triangle[0])).position;
					vertex2 = body.GetVertex (polygon.GetVertexIndex (triangle[1])).position;
					vertex3 = body.GetVertex (polygon.GetVertexIndex (triangle[2])).position;
					AddTriangleToContent (normal, vertex1, vertex2, vertex3);
				}
			} else {
				for (i = 0; i < count - 2; i++) {
					vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
					vertex2 = body.GetVertex (polygon.GetVertexIndex ((i + 1) % count)).position;
					vertex3 = body.GetVertex (polygon.GetVertexIndex ((i + 2) % count)).position;
					AddTriangleToContent (normal, vertex1, vertex2, vertex3);
				}
			}
		}
	}
	
	var stlContent = '';

	var i;
	for (i = 0; i < body.PolygonCount (); i++) {
		AddPolygon (i);
	}

	return stlContent;
};

JSM.ExportBodyToStl = function (body, name, hasConvexPolygons)
{
	function AddLineToContent (line)
	{
		stlContent += line + '\n';
	}

	var stlContent = '';
	
	AddLineToContent ('solid ' + name);
	stlContent += JSM.ExportBodyContentToStl (body, name, hasConvexPolygons);
	AddLineToContent ('endsolid ' + name);
	
	return stlContent;
};

JSM.ExportModelToStl = function (model, name, hasConvexPolygons)
{
	function AddLineToContent (line)
	{
		stlContent += line + '\n';
	}

	var stlContent = '';

	AddLineToContent ('solid ' + name);
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		stlContent += JSM.ExportBodyContentToStl (body, name + (i + 1).toString (), hasConvexPolygons);
	}
	AddLineToContent ('endsolid ' + name);

	return stlContent;
};

JSM.ExportBodyContentToObj = function (body, vertexOffset, normalOffset)
{
	function AddToContent (line)
	{
		objContent += line;
	}

	function AddLineToContent (line)
	{
		objContent += line + '\n';
	}

	function AddVertex (index)
	{
		var vertCoord = body.GetVertex (index).position;
		AddLineToContent ('v ' + vertCoord.x + ' ' + vertCoord.y + ' ' + vertCoord.z);
	}

	function AddNormal (index)
	{
		var normalVector = JSM.CalculateBodyPolygonNormal (body, index);
		AddLineToContent ('vn ' + normalVector.x + ' ' + normalVector.y + ' ' + normalVector.z);
	}

	function AddPolygon (index)
	{
		var polygon = body.GetPolygon (index);
	
		AddToContent ('f ');
	
		var i;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			AddToContent ((vertexOffset + polygon.GetVertexIndex (i) + 1) + '//' + (normalOffset + index + 1) + ' ');
		}
		
		AddLineToContent ('');
	}

	var objContent = '';
	
	var i;
	for (i = 0; i < body.VertexCount (); i++) {
		AddVertex (i);
	}
	
	for (i = 0; i < body.PolygonCount (); i++) {
		AddNormal (i);
	}

	for (i = 0; i < body.PolygonCount (); i++) {
		AddPolygon (i);
	}
	
	return objContent;
};

JSM.ExportBodyToObj = function (body)
{
	return JSM.ExportBodyContentToObj (body, 0, 0);
};

JSM.ExportModelToObj = function (model, name, hasConvexPolygons)
{
	var objContent = '';
	
	var vertexOffset = 0;
	var normalOffset = 0;
	
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		objContent += JSM.ExportBodyContentToObj (body, vertexOffset, normalOffset);
		vertexOffset += body.VertexCount ();
		normalOffset += body.PolygonCount ();
	}

	return objContent;
};

JSM.ExportMaterialsToGDL = function (materials)
{
	function HexColorToRGBColorString (hexColor)
	{
		var rgb = JSM.HexColorToRGBComponents (hexColor);
		var result = rgb[0] / 255.0 + ',' + rgb[1] / 255.0 + ',' + rgb[2] / 255.0;
		return result;
	}

	function AddLineToContent (line)
	{
		gdlContent += line + '\n';
	}

	function AddMaterial (material, index)
	{
		var rgbString = HexColorToRGBColorString (material.diffuse);
		AddLineToContent ('define material "material' + index + '" 2, ' + rgbString + ' ! ' + index);
	}
	
	var gdlContent = '';
	var writeMaterials = false;
	if (materials !== undefined && materials !== null) {
		writeMaterials = true;
	}

	var i;
	if (writeMaterials) {
		AddMaterial (materials.GetDefaultMaterial (), 1);
		for (i = 0; i < materials.Count (); i++) {
			AddMaterial (materials.GetMaterial (i), i + 2);
		}
	}
	
	return gdlContent;
};

JSM.ExportBodyGeometryToGDL = function (body, writeMaterials)
{
	function AddToContent (line)
	{
		var lineLengthLimit = 200;
		if (line.length > lineLengthLimit) {
			var current = 0;
			var i, character;
			for (i = 0; i < line.length; i++) {
				character = line[i];
				gdlContent += character;
				current++;
				if (current > lineLengthLimit && character == ',') {
					gdlContent += '\n';
					current = 0;
				}
			}
		} else {
			gdlContent += line;
		}
	}

	function AddLineToContent (line)
	{
		AddToContent (line + '\n');
	}

	function AddVertex (index)
	{
		var vertCoord = body.GetVertex (index).position;
		AddLineToContent ('vert ' + vertCoord.x + ', ' + vertCoord.y + ', ' + vertCoord.z + ' ! ' + (index + 1));
	}

	function AddEdge (index)
	{
		var edge = al.edges[index];
		AddLineToContent ('edge ' + (edge.vert1 + 1) + ', ' + (edge.vert2 + 1) + ', -1, -1, 0' + ' ! ' + (index + 1));
	}

	function AddPolygon (index)
	{
		if (writeMaterials) {
			var materialIndex = body.GetPolygon (index).GetMaterialIndex () + 2;
			AddLineToContent ('set material "material' + materialIndex + '"');
		}
	
		var pgon = al.pgons[index];
		AddToContent ('pgon ' + pgon.pedges.length + ', 0, 0, ');
		var pedgeList = '';
		var i, pedge;
		for (i = 0; i < pgon.pedges.length; i++) {
			pedge = pgon.pedges[i];
			if (!pedge.reverse) {
				pedgeList += (pedge.index + 1);
			} else {
				pedgeList += (-(pedge.index + 1));
			}
			if (i < pgon.pedges.length - 1) {
				pedgeList += ', ';
			}
		}
		AddToContent (pedgeList);
		AddToContent (' ! ' + (index + 1));
		AddLineToContent ('');
	}

	var gdlContent = '';

	AddLineToContent ('base');
	var al = JSM.CalculateAdjacencyInfo (body);
	
	var i;
	for (i = 0; i < al.verts.length; i++) {
		AddVertex (i);
	}

	for (i = 0; i < al.edges.length; i++) {
		AddEdge (i);
	}
	
	for (i = 0; i < al.pgons.length; i++) {
		AddPolygon (i);
	}

	AddLineToContent ('body -1');
	return gdlContent;
};

JSM.ExportBodyToGDL = function (body, materials)
{
	var gdlContent = '';

	var writeMaterials = false;
	if (materials !== undefined && materials !== null) {
		gdlContent += JSM.ExportMaterialsToGDL (materials);
		writeMaterials = true;
	}

	gdlContent += JSM.ExportBodyGeometryToGDL (body, writeMaterials);
	return gdlContent;
};

JSM.ExportModelToGDL = function (model, materials)
{
	var gdlContent = '';
	var writeMaterials = false;
	if (materials !== undefined && materials !== null) {
		gdlContent += JSM.ExportMaterialsToGDL (materials);
		writeMaterials = true;
	}
	
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		gdlContent += JSM.ExportBodyGeometryToGDL (body, writeMaterials);
	}

	return gdlContent;
};
