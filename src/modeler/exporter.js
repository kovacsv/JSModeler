JSM.ExportBodyContentToStl = function (body, name, hasConvexPolygons)
{
	var AddLineToContent = function (line)
	{
		stlContent += line + '\n';
	};

	var AddTriangleToContent = function (normal, vertex1, vertex2, vertex3)
	{
		AddLineToContent ('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z);
		AddLineToContent ('\t\touter loop');
		AddLineToContent ('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z);
		AddLineToContent ('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z);
		AddLineToContent ('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z);
		AddLineToContent ('\t\tendloop');
		AddLineToContent ('\tendfacet');
	};
	
	var AddPolygon = function (index)
	{
		var polygon = body.GetPolygon (index);
		var count = polygon.VertexIndexCount ();
		if (count < 3) {
			return;
		}
		
		var vertex1, vertex2, vertex3;
		var normal1, normal2, normal3;
		var uv1, uv2, uv3;

		if (count === 3) {
			var normal = JSM.CalculateBodyPolygonNormal (body, index);
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
			var normal = JSM.CalculateBodyPolygonNormal (body, index);
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
	};

	var stlContent = '';

	var i;
	for (i = 0; i < body.PolygonCount (); i++) {
		AddPolygon (i);
	}

	return stlContent;
};

JSM.ExportBodyToStl = function (body, name, hasConvexPolygons)
{
	var AddLineToContent = function (line)
	{
		stlContent += line + '\n';
	};

	var stlContent = '';
	
	AddLineToContent ('solid ' + name);
	stlContent += JSM.ExportBodyContentToStl (body, name, hasConvexPolygons);
	AddLineToContent ('endsolid ' + name);
	
	return stlContent;
};

JSM.ExportModelToStl = function (model, name, hasConvexPolygons)
{
	var AddLineToContent = function (line)
	{
		stlContent += line + '\n';
	};

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

JSM.ExportBodyToObjInternal = function (body, vertexOffset, normalOffset)
{
	var AddToContent = function (line)
	{
		objContent += line;
	};

	var AddLineToContent = function (line)
	{
		objContent += line + '\n';
	};

	var AddVertex = function (index)
	{
		var vertCoord = body.GetVertex (index).position;
		AddLineToContent ('v ' + vertCoord.x + ' ' + vertCoord.y + ' ' + vertCoord.z);
	};

	var AddNormal = function (index)
	{
		var normalVector = JSM.CalculateBodyPolygonNormal (body, index);
		AddLineToContent ('vn ' + normalVector.x + ' ' + normalVector.y + ' ' + normalVector.z);
	};

	var AddPolygon = function (index)
	{
		var polygon = body.GetPolygon (index);
	
		AddToContent ('f ');
	
		var i;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			AddToContent ((vertexOffset + polygon.GetVertexIndex (i) + 1) + '//' + (normalOffset + index + 1) + ' ');
		}
		
		AddLineToContent ('');
	};

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
	return JSM.ExportBodyToObjInternal (body, 0, 0);
};

JSM.ExportModelToObj = function (model, name, hasConvexPolygons)
{
	var objContent = '';
	
	var vertexOffset = 0;
	var normalOffset = 0;
	
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		objContent += JSM.ExportBodyToObjInternal (body, vertexOffset, normalOffset);
		vertexOffset += body.VertexCount ();
		normalOffset += body.PolygonCount ();
	}

	return objContent;
};

JSM.ExportMaterialsToGDL = function (materials)
{
	var HexColorToRGBColorString = function (hexColor)
	{
		var rgb = JSM.HexColorToRGBColor (hexColor);
		var result = rgb[0] / 255.0 + ',' + rgb[1] / 255.0 + ',' + rgb[2] / 255.0;
		return result;
	};

	var AddLineToContent = function (line)
	{
		gdlContent += line + '\n';
	};

	var AddMaterial = function (material, index)
	{
		var rgbString = HexColorToRGBColorString (material.diffuse);
		AddLineToContent ('define material "material' + index + '" 2, ' + rgbString + ' ! ' + index);
	};
	
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
	var AddToContent = function (line)
	{
		gdlContent += line;
	};

	var AddLineToContent = function (line)
	{
		gdlContent += line + '\n';
	};

	var AddVertex = function (index)
	{
		var vertCoord = body.GetVertex (index).position;
		AddLineToContent ('vert ' + vertCoord.x + ', ' + vertCoord.y + ', ' + vertCoord.z + ' ! ' + (index + 1));
	};

	var AddEdge = function (index)
	{
		var edge = al.edges[index];
		AddLineToContent ('edge ' + (edge.vert1 + 1) + ', ' + (edge.vert2 + 1) + ', -1, -1, 0' + ' ! ' + (index + 1));
	};

	var AddPolygon = function (index)
	{
		if (writeMaterials) {
			var materialIndex = body.GetPolygon (index).GetMaterialIndex () + 2;
			AddLineToContent ('set material "material' + materialIndex + '"');
		}
	
		var pgon = al.pgons[index];
		AddToContent ('pgon ' + pgon.pedges.length + ', 0, 0, ');
		var i, pedge;
		for (i = 0; i < pgon.pedges.length; i++) {
			pedge = pgon.pedges[i];
			if (!pedge.reverse) {
				AddToContent ((pedge.index + 1));
			} else {
				AddToContent (-(pedge.index + 1));
			}
			if (i < pgon.pedges.length - 1) {
				AddToContent (', ');
			}
		}
		AddToContent (' ! ' + (index + 1));
		AddLineToContent ('');
	};

	var gdlContent = '';

	AddLineToContent ('base');
	var al = JSM.CalculateAdjacencyList (body);
	
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
}

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

JSM.SVGSettings = function (camera, fieldOfView, nearPlane, farPlane, hiddenLine)
{
	this.camera = camera;
	this.fieldOfView = fieldOfView;
	this.nearPlane = nearPlane;
	this.farPlane = farPlane;
	this.hiddenLine = hiddenLine;
	this.clear = true;
};

JSM.ExportBodyToSVG = function (body, materials, settings, svgObject, orderedPolygons, solidPolygons)
{
	var HexColorToHTMLColor = function (hexColor)
	{
		var rgb = JSM.HexColorToRGBColor (hexColor);
		var result = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
		return result;
	};

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

	var i, j;
	var polygon, points, coord, projected, x, y, svgPolyon;

	var orderedPolygons = [];
	if (hiddenLine) {
		orderedPolygons = JSM.OrderPolygons (body, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort);
	} else {
		for (i = 0; i < body.PolygonCount (); i++) {
			orderedPolygons.push (i);
		}
	}

	if (materials === undefined || materials === null) {
		materials = new JSM.Materials ();
	}
	
	var materialIndex, color;
	for (i = 0; i < orderedPolygons.length; i++) {
		points = '';
		polygon = body.GetPolygon (orderedPolygons[i]);
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (j));
			projected = new JSM.Coord ();
			JSM.Project (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort, projected);
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

	return true;
};
