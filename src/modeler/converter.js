/**
* Function: ConvertBodyToTriangleBody
* Description: Converts a body to triangle body.
* Parameters:
*	body {Body} the body
* Returns:
*	{TriangleBody} the result
*/
JSM.ConvertBodyToTriangleBody = function (body)
{
	function AddTriangle (result, polygon, v0, v1, v2)
	{
		var triangleIndex = result.AddTriangle (v0, v1, v2);
		var triangle = result.GetTriangle (triangleIndex);
		if (polygon.HasMaterialIndex ()) {
			triangle.mat = polygon.GetMaterialIndex ();
		}
		if (polygon.HasCurveGroup ()) {
			triangle.curve = polygon.GetCurveGroup ();
		}
	}
	
	var result = new JSM.TriangleBody ();
	
	var i, j, vertex;
	for (i = 0; i < body.VertexCount (); i++) {
		vertex = body.GetVertexPosition (i);
		result.AddVertex (vertex.x, vertex.y, vertex.z);
	}
	
	var polygon, vertexCount;
	var polygon3D, normal, triangle, triangles;
	var v0, v1, v2;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		vertexCount = polygon.VertexIndexCount ();
		if (vertexCount < 3) {
			continue;
		}
		if (vertexCount == 3) {
			v0 = polygon.GetVertexIndex (0);
			v1 = polygon.GetVertexIndex (1);
			v2 = polygon.GetVertexIndex (2);
			AddTriangle (result, polygon, v0, v1, v2);
		} else {
			polygon3D = new JSM.Polygon ();
			for (j = 0; j < vertexCount; j++) {
				vertex = body.GetVertexPosition (polygon.GetVertexIndex (j));
				polygon3D.AddVertex (vertex.x, vertex.y, vertex.z);
			}
			
			normal = JSM.CalculateBodyPolygonNormal (body, i);
			triangles = JSM.TriangulatePolygon (polygon3D, normal);
			if (triangles !== null) {
				for (j = 0; j < triangles.length; j++) {
					triangle = triangles[j];
					v0 = polygon.GetVertexIndex (triangle[0]);
					v1 = polygon.GetVertexIndex (triangle[1]);
					v2 = polygon.GetVertexIndex (triangle[2]);
					AddTriangle (result, polygon, v0, v1, v2);
				}
			}
		}
	}

	return result;
};

/**
* Function: ConvertModelToTriangleModel
* Description: Converts a model to triangle model.
* Parameters:
*	model {Model} the model
* Returns:
*	{TriangleModel} the result
*/
JSM.ConvertModelToTriangleModel = function (model)
{
	var result = new JSM.TriangleModel ();
	var materials = model.GetMaterialSet ();
	var i, material;
	for (i = 0; i < materials.Count (); i++) {
		material = materials.GetMaterial (i);
		result.AddMaterial ({
			name : 'Material' + i,
			ambient : JSM.HexColorToNormalizedRGBComponents (material.ambient),
			diffuse : JSM.HexColorToNormalizedRGBComponents (material.diffuse),
			specular : JSM.HexColorToNormalizedRGBComponents (material.specular),
			shininess : material.shininess,
			opacity : material.opacity,
			reflection : material.reflection
		});
	}
	
	var body, triangleBody;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		triangleBody = JSM.ConvertBodyToTriangleBody (body);
		result.AddBody (triangleBody);
	}
	result.Finalize ();
	return result;
};

/**
* Function: ConvertTriangleModelToJsonData
* Description: Converts a triangle model to json data.
* Parameters:
*	model {TriangleModel} the model
* Returns:
*	{object} the result data
*/
JSM.ConvertTriangleModelToJsonData = function (model)
{
	function ConvertMaterials (model, materials)
	{
		var i, material, jsonMaterial;
		for (i = 0; i < model.MaterialCount (); i++) {
			material = model.GetMaterial (i);
			jsonMaterial = {
				name : JSM.ValueOrDefault (material.name, ''),
				ambient : material.ambient,
				diffuse : material.diffuse,
				specular : material.specular,
				shininess : material.shininess,
				opacity : material.opacity
			};
			if (material.texture !== undefined && material.texture !== null) {
				jsonMaterial.texture = JSM.ValueOrDefault (material.texture, null);
				jsonMaterial.offset = material.offset;
				jsonMaterial.scale = material.scale;
				jsonMaterial.rotation = material.rotation;
			}
			materials.push (jsonMaterial);
		}
	}

	function ConvertBody (model, body, mesh)
	{
		var trianglesByMaterial = [];
		var materialCount = model.MaterialCount ();
		
		var i, j, coord;
		for (i = 0; i < body.VertexCount (); i++) {
			coord = body.GetVertex (i);
			mesh.vertices.push (coord.x, coord.y, coord.z);
		}
		
		for (i = 0; i < body.NormalCount (); i++) {
			coord = body.GetNormal (i);
			mesh.normals.push (coord.x, coord.y, coord.z);
		}

		for (i = 0; i < body.UVCount (); i++) {
			coord = body.GetUV (i);
			mesh.uvs.push (coord.x, coord.y);
		}
		
		for (i = 0; i < materialCount; i++) {
			trianglesByMaterial.push ([]);
		}

		var triangle;
		for (i = 0; i < body.TriangleCount (); i++) {
			triangle = body.GetTriangle (i);
			if (triangle.mat === undefined || triangle.mat < 0 || triangle.mat >= materialCount) {
				continue;
			}
			trianglesByMaterial[triangle.mat].push (i);
		}

		var triangleCount = 0;
		var triangles, jsonTriangles;
		for (i = 0; i < trianglesByMaterial.length; i++) {
			triangles = trianglesByMaterial[i];
			if (triangles.length === 0) {
				continue;
			}
			
			jsonTriangles =  {
				material : i,
				parameters : []
			};
			for (j = 0; j < triangles.length; j++) {
				triangle = body.GetTriangle (triangles[j]);
				jsonTriangles.parameters.push (
					triangle.v0, triangle.v1, triangle.v2,
					triangle.n0, triangle.n1, triangle.n2,
					triangle.u0, triangle.u1, triangle.u2
				);
			}
			triangleCount = triangleCount + triangles.length;
			mesh.triangles.push (jsonTriangles);
		}
	}
	
	var result = {
		version : 1,
		materials : [],
		meshes : []
	};
	
	ConvertMaterials (model, result.materials);
	
	var i, body, mesh;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		if (body.TriangleCount () === 0) {
			continue;
		}
		mesh = {
			name : body.GetName (),
			vertices : [],
			normals : [],
			uvs : [],
			triangles : []
		};
		ConvertBody (model, body, mesh);
		result.meshes.push (mesh);
	}
	
	return result;
};

/**
* Function: MergeJsonDataMeshes
* Description: Merges meshes in json data.
* Parameters:
*	jsonData {object} the original data
* Returns:
*	{object} the result data
*/
JSM.MergeJsonDataMeshes = function (jsonData)
{
	function MergeMesh (mesh, currentMesh, materialToTriangles)
	{
		function MergeAttributes (mesh, currentMesh)
		{
			var i;
			for (i = 0; i < currentMesh.vertices.length; i++) {
				mesh.vertices.push (currentMesh.vertices[i]);
			}
			for (i = 0; i < currentMesh.normals.length; i++) {
				mesh.normals.push (currentMesh.normals[i]);
			}
			for (i = 0; i < currentMesh.uvs.length; i++) {
				mesh.uvs.push (currentMesh.uvs[i]);
			}
		}
	
		function MergeTriangles (mesh, currentTriangles, materialToTriangles, vertexOffset, normalOffset, uvOffset)
		{
			var material = currentTriangles.material;
			var trianglesIndex = materialToTriangles[material];
			if (trianglesIndex === undefined) {
				mesh.triangles.push ({
					material : material,
					parameters : []
				});
				trianglesIndex = mesh.triangles.length - 1;
				materialToTriangles[material] = trianglesIndex;
			}
			
			var triangles = mesh.triangles[trianglesIndex];
			var triangleParameters = triangles.parameters;
			var i;
			for (i = 0; i < currentTriangles.parameters.length; i = i + 9) {
				triangleParameters.push (
					currentTriangles.parameters[i] + vertexOffset,
					currentTriangles.parameters[i + 1] + vertexOffset,
					currentTriangles.parameters[i + 2] + vertexOffset,
					currentTriangles.parameters[i + 3] + normalOffset,
					currentTriangles.parameters[i + 4] + normalOffset,
					currentTriangles.parameters[i + 5] + normalOffset,
					currentTriangles.parameters[i + 6] + uvOffset,
					currentTriangles.parameters[i + 7] + uvOffset,
					currentTriangles.parameters[i + 8] + uvOffset
				);
			}
		}
	
		var vertexOffset = mesh.vertices.length / 3;
		var normalOffset = mesh.normals.length / 3;
		var uvOffset = mesh.uvs.length / 2;
		MergeAttributes (mesh, currentMesh);

		var i, currentTriangles;
		for (i = 0; i < currentMesh.triangles.length; i++) {
			currentTriangles = currentMesh.triangles[i];
			MergeTriangles (mesh, currentTriangles, materialToTriangles, vertexOffset, normalOffset, uvOffset);
		}
	}

	var result = {
		version : jsonData.version,
		materials : jsonData.materials,
		meshes : []
	};
	
	var mesh = {
		name : 'Merged',
		vertices : [],
		normals : [],
		uvs : [],
		triangles : []
	};
	
	var materialToTriangles = {};
	var i, currentMesh;
	for (i = 0; i < jsonData.meshes.length; i++) {
		currentMesh = jsonData.meshes[i];
		MergeMesh (mesh, currentMesh, materialToTriangles);
	}
	
	result.meshes.push (mesh);
	return result;
};
