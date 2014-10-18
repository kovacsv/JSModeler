JSM.GetArrayBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function () {
		var arrayBuffer = request.response;
		if (arrayBuffer) {
			onReady (arrayBuffer);
		}
	};

	request.send (null);
};

JSM.GetArrayBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	};

	reader.readAsArrayBuffer (file);
};

JSM.GetStringBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'text';

	request.onload = function () {
		var stringBuffer = request.response;
		if (stringBuffer) {
			onReady (stringBuffer);
		}
	};

	request.send (null);
};

JSM.GetStringBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	};

	reader.readAsText (file);
};

JSM.LoadMultipleBuffersInternal = function (inputList, index, result, onReady)
{
	if (index >= inputList.length) {
		onReady (result);
		return;
	}
	
	var currentInput = inputList[index];
	var loaderFunction = null;
	if (currentInput.isFile) {
		if (currentInput.isArrayBuffer) {
			loaderFunction = JSM.GetArrayBufferFromFile;
		} else {
			loaderFunction = JSM.GetStringBufferFromFile;
		}
	} else {
		if (currentInput.isArrayBuffer) {
			loaderFunction = JSM.GetArrayBufferFromURL;
		} else {
			loaderFunction = JSM.GetStringBufferFromURL;
		}
	}
	
	loaderFunction (currentInput.originalObject, function (resultBuffer) {
		result.push (resultBuffer);
		JSM.LoadMultipleBuffersInternal (inputList, index + 1, result, onReady);
	});
};

JSM.LoadMultipleBuffers = function (inputList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffersInternal (inputList, 0, result, function (result) {
		onReady (result);
	});
};

JSM.ConvertTriangleModelToJsonData = function (model)
{
	function ConvertMaterials (model, materials)
	{
		function ColorToArray (color)
		{
			if (color === undefined || color === null) {
				return [0.0, 0.0, 0.0];
			}
			return [color.r, color.g, color.b];
		}
	
		function CoordToArray (coord, defaultValue)
		{
			if (coord === undefined || coord === null) {
				return defaultValue;
			}
			return [coord.x, coord.y];
		}

		var i, material;
		for (i = 0; i < model.MaterialCount (); i++) {
			material = model.GetMaterial (i);
			materials.push ({
				name : material.name,
				ambient : ColorToArray (material.ambient),
				diffuse : ColorToArray (material.diffuse),
				specular : ColorToArray (material.specular),
				shininess : material.shininess,
				opacity : material.opacity,
				texture : material.texture,
				offset : CoordToArray (material.offset, [0.0, 0.0]),
				scale : CoordToArray (material.scale, [1.0, 1.0]),
				rotation : material.rotation
			});
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
	
		function MergeTriangles (mesh, currentTriangles, materialToTriangles)
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
			MergeTriangles (mesh, currentTriangles, materialToTriangles);
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
