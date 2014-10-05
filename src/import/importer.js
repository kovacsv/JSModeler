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

JSM.LoadMultipleBuffers = function (inputList, result, index, loaderFunction, onReady)
{
	if (index >= inputList.length) {
		onReady (result);
		return;
	}
	
	var originalObject = inputList[index];
	loaderFunction (originalObject, function (resultBuffer) {
		result.push ({
			originalObject : originalObject,
			resultBuffer : resultBuffer
		});
		JSM.LoadMultipleBuffers (inputList, result, index + 1, loaderFunction, onReady);
	});
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

JSM.GetStringBuffersFromURLList = function (urlList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffers (urlList, result, 0, JSM.GetStringBufferFromURL, function (result) {
		onReady (result);
	});
};

JSM.GetStringBuffersFromFileList = function (fileList, onReady)
{
	var result = [];
	JSM.LoadMultipleBuffers (fileList, result, 0, JSM.GetStringBufferFromFile, function (result) {
		onReady (result);
	});
};

JSM.ConvertTriangleModelToJsonData = function (model)
{
	function ConvertMaterials (model, materials)
	{
		function ColorToArray (color)
		{
			return [color.r, color.g, color.b];
		}
	
		var i, material;
		for (i = 0; i < model.MaterialCount (); i++) {
			material = model.GetMaterial (i);
			materials.push ({
				name : material.name,
				ambient : ColorToArray (material.ambient),
				diffuse : ColorToArray (material.diffuse),
				specular : ColorToArray (material.specular),
				opacity : material.opacity
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
		
		mesh.additionalInfo.push ({name : 'vertexCount', value : mesh.vertices.length / 3});
		mesh.additionalInfo.push ({name : 'triangleCount', value : triangleCount});
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
			triangles : [],
			additionalInfo : []
		};
		ConvertBody (model, body, mesh);
		result.meshes.push (mesh);
	}
	
	return result;
};
