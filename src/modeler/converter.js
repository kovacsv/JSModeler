JSM.ConversionData = function (textureLoadedCallback, hasConvexPolygons)
{
	this.textureLoadedCallback = textureLoadedCallback;
	this.hasConvexPolygons = hasConvexPolygons;
};

JSM.ConvertBodyToThreeMeshesSpecial = function (body, materials, vertexNormals, textureCoords, conversionData)
{
	var AddTriangle = function (geometry, vertex1, vertex2, vertex3, normal1, normal2, normal3, uv1, uv2, uv3, data)
	{
		var lastVertexIndex = geometry.vertices.length;
		geometry.vertices.push (new THREE.Vector3 (vertex1.x, vertex1.y, vertex1.z));
		geometry.vertices.push (new THREE.Vector3 (vertex2.x, vertex2.y, vertex2.z));
		geometry.vertices.push (new THREE.Vector3 (vertex3.x, vertex3.y, vertex3.z));
		var face = new THREE.Face3 (lastVertexIndex + 0, lastVertexIndex + 1, lastVertexIndex + 2);
		if (data != null) {
			face.data = data;
		}
		geometry.faces.push (face);
		
		if (normal1 !== undefined && normal2 !== undefined && normal3 !== undefined) {
			var normalArray = [];
			normalArray.push (new THREE.Vector3 (normal1.x, normal1.y, normal1.z));
			normalArray.push (new THREE.Vector3 (normal2.x, normal2.y, normal2.z));
			normalArray.push (new THREE.Vector3 (normal3.x, normal3.y, normal3.z));
			geometry.faces[geometry.faces.length - 1].vertexNormals = normalArray;
		}

		if (uv1 !== undefined && uv2 !== undefined && uv3 !== undefined) {
			var uvArray = [];
			uvArray.push (new THREE.UV (uv1.x, uv1.y));
			uvArray.push (new THREE.UV (uv2.x, uv2.y));
			uvArray.push (new THREE.UV (uv3.x, uv3.y));
			geometry.faceVertexUvs[0].push (uvArray);
		}
	};

	var AddPolygon = function (geometry, index, hasTexture)
	{
		var polygon = body.GetPolygon (index);
		var count = polygon.VertexIndexCount ();
		if (count < 3) {
			return;
		}
		
		var vertex1, vertex2, vertex3;
		var normal1, normal2, normal3;
		var uv1, uv2, uv3;
		var data = polygon.data;

		if (count === 3) {
			vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
			vertex2 = body.GetVertex (polygon.GetVertexIndex (1)).position;
			vertex3 = body.GetVertex (polygon.GetVertexIndex (2)).position;
			normal1 = undefined;
			normal2 = undefined;
			normal3 = undefined;
			if (hasVertexNormals) {
				normal1 = vertexNormals[index][0];
				normal2 = vertexNormals[index][1];
				normal3 = vertexNormals[index][2];
			}
			uv1 = undefined;
			uv2 = undefined;
			uv3 = undefined;
			if (hasTexture && hasTextureCoords) {
				uv1 = textureCoords[index][0];
				uv2 = textureCoords[index][1];
				uv3 = textureCoords[index][2];
			}

			AddTriangle (
				geometry,
				vertex1,
				vertex2,
				vertex3,
				normal1,
				normal2,
				normal3,
				uv1,
				uv2,
				uv3,
				data
			);
		} else {
			var i;
		
			var useTriangulation = false;
			if (conversionData === undefined || conversionData.hasConvexPolygons === undefined || !conversionData.hasConvexPolygons) {
				useTriangulation = true;
			}
			if (useTriangulation) {
				var polygon3D = new JSM.Polygon ();
				
				var vertex;
				for (i = 0; i < count; i++) {
					vertex = body.GetVertex (polygon.vertices[i]);
					polygon3D.AddVertex (vertex.position.x, vertex.position.y, vertex.position.z);
				}
				
				var normal = JSM.CalculateBodyPolygonNormal (body, index);
				var triangles = JSM.PolygonTriangulate (polygon3D, normal);
				
				var triangle;
				for (i = 0; i < triangles.length; i++) {
					triangle = triangles[i];
					vertex1 = body.GetVertex (polygon.GetVertexIndex (triangle[0])).position;
					vertex2 = body.GetVertex (polygon.GetVertexIndex (triangle[1])).position;
					vertex3 = body.GetVertex (polygon.GetVertexIndex (triangle[2])).position;
					normal1 = undefined;
					normal2 = undefined;
					normal3 = undefined;
					if (hasVertexNormals) {
						normal1 = vertexNormals[index][triangle[0]];
						normal2 = vertexNormals[index][triangle[1]];
						normal3 = vertexNormals[index][triangle[2]];
					}
					uv1 = undefined;
					uv2 = undefined;
					uv3 = undefined;
					if (hasTexture && hasTextureCoords) {
						uv1 = textureCoords[index][triangle[0]];
						uv2 = textureCoords[index][triangle[1]];
						uv3 = textureCoords[index][triangle[2]];
					}
					
					AddTriangle (
						geometry,
						vertex1,
						vertex2,
						vertex3,
						normal1,
						normal2,
						normal3,
						uv1,
						uv2,
						uv3,
						data
					);
				}
			} else {
				for (i = 0; i < count - 2; i++) {
					vertex1 = body.GetVertex (polygon.GetVertexIndex (0)).position;
					vertex2 = body.GetVertex (polygon.GetVertexIndex ((i + 1) % count)).position;
					vertex3 = body.GetVertex (polygon.GetVertexIndex ((i + 2) % count)).position;
					normal1 = undefined;
					normal2 = undefined;
					normal3 = undefined;
					if (hasVertexNormals) {
						normal1 = vertexNormals[index][0];
						normal2 = vertexNormals[index][(i + 1) % count];
						normal3 = vertexNormals[index][(i + 2) % count];
					}
					uv1 = undefined;
					uv2 = undefined;
					uv3 = undefined;
					if (hasTexture && hasTextureCoords) {
						uv1 = textureCoords[index][0];
						uv2 = textureCoords[index][(i + 1) % count];
						uv3 = textureCoords[index][(i + 2) % count];
					}
					
					AddTriangle (
						geometry,
						vertex1,
						vertex2,
						vertex3,
						normal1,
						normal2,
						normal3,
						uv1,
						uv2,
						uv3,
						data
					);
				}
			}
		}
	};
	
	var CreateGeometry = function (polygonIndices, materialIndex)
	{
		var geometry = new THREE.Geometry ();
		var hasTexture = (materialIndex !== -1 && materials.GetMaterial (materialIndex).texture !== null);
		var hasOpacity = (materialIndex !== -1 && materials.GetMaterial (materialIndex).opacity !== 1.0);

		var i;
		for (i = 0; i < polygonIndices.length; i++) {
			AddPolygon (geometry, polygonIndices[i], hasTexture);
		}

		var material = null;		
		if (materialIndex !== -1) {
			material = new THREE.MeshLambertMaterial ({
				ambient : materials.GetMaterial (materialIndex).ambient,
				color : materials.GetMaterial (materialIndex).diffuse,
				side : THREE.DoubleSide
			});
			if (hasOpacity) {
				material.opacity = materials.GetMaterial (materialIndex).opacity;
				material.transparent = true;
			} 
			if (hasTexture) {
				var textureName = materials.GetMaterial (materialIndex).texture;
				var texture = THREE.ImageUtils.loadTexture (textureName, new THREE.UVMapping (), function (image) {
					if (conversionData !== undefined && conversionData.textureLoadedCallback !== undefined) {
						conversionData.textureLoadedCallback ();
					}
				});
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				material.map = texture;
			}
		} else {
			material = new THREE.MeshLambertMaterial ({
				ambient : 0x00cc00,
				color : 0x00cc00,
				side : THREE.DoubleSide
				}
			);
		}

		geometry.computeCentroids();
		geometry.computeFaceNormals();

		var mesh = new THREE.Mesh (geometry, material);
		meshes.push (mesh);
	};

	var i, j;
	var polygonsByMaterial = [];
	var polygonsWithNoMaterial = [];
	var hasVertexNormals = (vertexNormals !== undefined && vertexNormals !== null);
	var hasTextureCoords = (textureCoords !== undefined && textureCoords !== null);
	
	if (materials !== undefined && materials !== null) {
		for (i = 0; i < materials.Count (); i++) {
			polygonsByMaterial[i] = [];
		}
	}

	var polygon, material;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		if (!polygon.HasMaterialIndex ()) {
			polygonsWithNoMaterial.push (i);
			continue;
		}
		
		material = polygon.GetMaterialIndex ();
		polygonsByMaterial[material].push (i);
	}

	var meshes = [];
	var polygons;
	for (i = 0; i < polygonsByMaterial.length; i++) {
		polygons = polygonsByMaterial[i];
		if (polygons.length === 0) {
			continue;
		}
		
		CreateGeometry (polygons, i);
	}

	if (polygonsWithNoMaterial.length !== 0) {
		CreateGeometry (polygonsWithNoMaterial, -1);
	}
	return meshes;
};

JSM.ConvertBodyToThreeMeshes = function (body, materials, conversionData)
{
	var vertexNormals = JSM.CalculateBodyVertexNormals (body);

	var hasTextures = false;
	if (materials !== undefined && materials !== null && projection !== null && coords !== null) {
		var projection = body.GetTextureProjectionType ();
		var coords = body.GetTextureProjectionCoords ();
		for (i = 0; i < materials.Count (); i++) {
			if (materials.GetMaterial (i).texture !== null) {
				hasTextures = true;
				break;
			}
		}
	}

	var textureCoords;
	if (hasTextures) {
		textureCoords = JSM.CalculateBodyTextureCoords (body);
		for (i = 0; i < textureCoords.length; i++) {
			polygon = body.GetPolygon (i);
			if (polygon.HasMaterialIndex ()) {
				material = materials.GetMaterial (polygon.GetMaterialIndex ());
				for (j = 0; j < textureCoords[i].length; j++) {
					textureCoords[i][j].x /= material.textureWidth;
					textureCoords[i][j].y /= -material.textureHeight;
				}
			}
		}
	}
	
	return JSM.ConvertBodyToThreeMeshesSpecial (body, materials, vertexNormals, textureCoords, conversionData);
};

JSM.ConvertModelToThreeMeshes = function (model, materials, conversionData)
{
	var meshes = [];
	var currentMeshes = [];
	var i, j, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		currentMeshes = JSM.ConvertBodyToThreeMeshes (body, materials, conversionData);
		for (j = 0; j < currentMeshes.length; j++) {
			meshes.push (currentMeshes[j]);
		}
	}

	return meshes;
};

JSM.ConvertBodyContentToSTL = function (body, name, hasConvexPolygons)
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

JSM.ConvertBodyToSTL = function (body, name, hasConvexPolygons)
{
	var AddLineToContent = function (line)
	{
		stlContent += line + '\n';
	};

	var stlContent = '';
	
	AddLineToContent ('solid ' + name);
	stlContent += JSM.ConvertBodyContentToSTL (body, name, hasConvexPolygons);
	AddLineToContent ('endsolid ' + name);
	
	return stlContent;
};

JSM.ConvertModelToSTL = function (model, name, hasConvexPolygons)
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
		stlContent += JSM.ConvertBodyContentToSTL (body, name + (i + 1).toString (), hasConvexPolygons);
	}
	AddLineToContent ('endsolid ' + name);

	return stlContent;
};

JSM.ConvertBodyToGDL = function (body)
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
		AddLineToContent ('vert ' + vertCoord.x + ', ' + vertCoord.y + ', ' + vertCoord.z);
	};

	var AddEdge = function (index)
	{
		var edge = al.edges[index];
		AddLineToContent ('edge ' + (edge.vert1 + 1) + ', ' + (edge.vert2 + 1) + ', -1, -1, 0');
	};

	var AddPolygon = function (index)
	{
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
		AddLineToContent ('');
	};

	var gdlContent = '';
	AddLineToContent ('base');
	var al = JSM.CalculateAdjacencyList (body);
	
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

JSM.ConvertModelToGDL = function (model, name, hasConvexPolygons)
{
	var gdlContent = '';
	
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		gdlContent += JSM.ConvertBodyToGDL (body);
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

JSM.ConvertBodyToSVG = function (body, settings, svgObject)
{
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

	var i, j, ordered, orderedPolygons;
	
	if (hiddenLine) {
		orderedPolygons = JSM.OrderPolygons (body, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort)
	} else {
		orderedPolygons = [];
		for (i = 0; i < body.PolygonCount (); i++) {
			orderedPolygons.push (i);
		}
	}

	var body, polygon, points, coord, projected, x, y, svgPolyon;
	for (i = 0; i < orderedPolygons.length; i++) {
		points = '';
		polygon = body.GetPolygon (orderedPolygons[i]);
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (j));
			projected = JSM.Project (coord, eye, center, up, fieldOfView, aspectRatio, nearPlane, farPlane, viewPort);
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
			svgPolyon.setAttributeNS (null, 'fill', 'white');
		} else {
			svgPolyon.setAttributeNS (null, 'fill', 'none');
		}
		svgPolyon.setAttributeNS (null, 'stroke', 'black');
		svgObject.appendChild (svgPolyon);
	}

	return true;
};

JSM.ConvertModelToSVG = function (model, settings, svgObject)
{
	settings.clear = false;
	while (svgObject.lastChild) {
		svgObject.removeChild (svgObject.lastChild);
	}

	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		JSM.ConvertBodyToSVG (body, settings, svgObject);
	}
}
