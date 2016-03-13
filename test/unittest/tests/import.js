module.exports = function (unitTest)
{

var importSuite = unitTest.AddTestSuite ('Import');

importSuite.AddTest ('TriangleModelTest', function (test)
{
	function TestModel (model, json)
	{
		var current = JSM.ConvertTriangleModelToJsonData (model);
		test.Assert (JSON.stringify (current) == JSON.stringify (json));
	}

	var model = new JSM.TriangleModel ();
	TestModel (model, {'version':1,'materials':[],'meshes':[]});

	var body = new JSM.TriangleBody ('example');
	model.AddBody (body);
	TestModel (model, {'version':1,'materials':[],'meshes':[]});
	
	body.AddVertex (0, 0, 0);
	body.AddVertex (1, 0, 0);
	body.AddVertex (1, 1, 0);
	body.AddNormal (0, 0, 1);
	body.AddTriangle (0, 1, 2, 0, 0, 0);
	TestModel (model, {"version":1,"materials":[],"meshes":[{"name":"example","vertices":[0,0,0,1,0,0,1,1,0],"normals":[0,0,1],"uvs":[],"triangles":[]}]});

	body.AddVertex (0, 0, 1);
	body.AddVertex (1, 0, 1);
	body.AddVertex (1, 1, 1);
	body.AddTriangle (3, 4, 5);
	TestModel (model, {"version":1,"materials":[],"meshes":[{"name":"example","vertices":[0,0,0,1,0,0,1,1,0,0,0,1,1,0,1,1,1,1],"normals":[0,0,1],"uvs":[],"triangles":[]}]});
	
	model.AddMaterial ({
		name : 'ExampleMaterial',
		ambient : [1, 0, 0],
		diffuse : [1, 0, 0],
		specular : [0, 0, 0]
	});
	TestModel (model, {"version":1,"materials":[{"name":"ExampleMaterial","ambient":[1,0,0],"diffuse":[1,0,0],"specular":[0,0,0]}],"meshes":[{"name":"example","vertices":[0,0,0,1,0,0,1,1,0,0,0,1,1,0,1,1,1,1],"normals":[0,0,1],"uvs":[],"triangles":[]}]});
	
	body.AddVertex (0, 0, 2);
	body.AddVertex (1, 0, 2);
	body.AddVertex (1, 1, 2);
	body.AddTriangle (6, 7, 8, -1, -1, -1, -1, -1, -1, 0, -1);
	TestModel (model, {"version":1,"materials":[{"name":"ExampleMaterial","ambient":[1,0,0],"diffuse":[1,0,0],"specular":[0,0,0]}],"meshes":[{"name":"example","vertices":[0,0,0,1,0,0,1,1,0,0,0,1,1,0,1,1,1,1,0,0,2,1,0,2,1,1,2],"normals":[0,0,1],"uvs":[],"triangles":[{"material":0,"parameters":[6,7,8,-1,-1,-1,-1,-1,-1]}]}]});

	model.Finalize ();
	TestModel (model, {"version":1,"materials":[{"name":"ExampleMaterial","ambient":[1,0,0],"diffuse":[1,0,0],"specular":[0,0,0],"shininess":0,"opacity":1},{"name":"Default","ambient":[0.5,0.5,0.5],"diffuse":[0.5,0.5,0.5],"specular":[0.1,0.1,0.1],"shininess":0,"opacity":1}],"meshes":[{"name":"example","vertices":[0,0,0,1,0,0,1,1,0,0,0,1,1,0,1,1,1,1,0,0,2,1,0,2,1,1,2],"normals":[0,0,1,0,0,1],"uvs":[0,0],"triangles":[{"material":0,"parameters":[6,7,8,-1,-1,-1,-1,-1,-1]},{"material":1,"parameters":[0,1,2,0,0,0,0,0,0,3,4,5,1,1,1,0,0,0]}]}]});
});

function GetArrayBufferFromFile (filePath)
{
	var fs = require ('fs');
	var path = require ('path');
	var content = fs.readFileSync (path.resolve (__dirname, filePath));
	var buffer = new Buffer (content);
	buffer.byteLength = content.length;
	return buffer;
}

function GetStringBufferFromFile (filePath)
{
	var fs = require ('fs');
	var path = require ('path');
	var content = fs.readFileSync (path.resolve (__dirname, filePath));
	var buffer = new Buffer (content);
	buffer.byteLength = content.length;
	return buffer.toString ();
}

importSuite.AddTest ('BinaryReaderTest', function (test)
{
	var br = new JSM.BinaryReader (GetArrayBufferFromFile ('../testfiles/result.bin'), true);
	
	test.Assert (br.GetByteLength () == 166);
	test.Assert (br.ReadBoolean () == true);
	test.Assert (br.ReadBoolean () == false);
	
	test.Assert (String.fromCharCode (br.ReadCharacter ()) == 'a');
	test.Assert (String.fromCharCode (br.ReadCharacter ()) == 'A');
	test.Assert (String.fromCharCode (br.ReadUnsignedCharacter ()) == 'a');
	test.Assert (String.fromCharCode (br.ReadUnsignedCharacter ()) == 'A');

	test.Assert (br.ReadInteger16 () == 42);
	test.Assert (br.ReadInteger16 () == -42);
	test.Assert (br.ReadInteger16 () == 32000);
	test.Assert (br.ReadInteger16 () == -32000);

	test.Assert (br.ReadUnsignedInteger16 () == 42);
	test.Assert (br.ReadUnsignedInteger16 () == 65494);
	test.Assert (br.ReadUnsignedInteger16 () == 32000);
	test.Assert (br.ReadUnsignedInteger16 () == 33536);

	test.Assert (br.ReadInteger32 () == 42);
	test.Assert (br.ReadInteger32 () == -42);
	test.Assert (br.ReadInteger32 () == 32000);
	test.Assert (br.ReadInteger32 () == -32000);
	test.Assert (br.ReadInteger32 () == 2000000000);
	test.Assert (br.ReadInteger32 () == -2000000000);

	test.Assert (br.ReadUnsignedInteger32 () == 42);
	test.Assert (br.ReadUnsignedInteger32 () == 4294967254);
	test.Assert (br.ReadUnsignedInteger32 () == 32000);
	test.Assert (br.ReadUnsignedInteger32 () == 4294935296);
	test.Assert (br.ReadUnsignedInteger32 () == 2000000000);
	test.Assert (br.ReadUnsignedInteger32 () == 2294967296);

	test.Assert (br.ReadInteger32 () == 42);
	test.Assert (br.ReadInteger32 () == -42);
	test.Assert (br.ReadInteger32 () == 32000);
	test.Assert (br.ReadInteger32 () == -32000);
	test.Assert (br.ReadInteger32 () == 2000000000);
	test.Assert (br.ReadInteger32 () == -2000000000);

	test.Assert (br.ReadUnsignedInteger32 () == 42);
	test.Assert (br.ReadUnsignedInteger32 () == 4294967254);
	test.Assert (br.ReadUnsignedInteger32 () == 32000);
	test.Assert (br.ReadUnsignedInteger32 () == 4294935296);
	test.Assert (br.ReadUnsignedInteger32 () == 2000000000);
	test.Assert (br.ReadUnsignedInteger32 () == 2294967296);

	test.Assert (JSM.IsEqual (br.ReadFloat32 (), 42.0));
	test.Assert (JSM.IsEqual (br.ReadFloat32 (), -42.0));
	test.Assert (JSM.IsEqual (br.ReadFloat32 (), 12345.6787109375));
	test.Assert (JSM.IsEqual (br.ReadFloat32 (), -12345.6787109375));

	test.Assert (JSM.IsEqual (br.ReadDouble64 (), 42.0));
	test.Assert (JSM.IsEqual (br.ReadDouble64 (), -42.0));
	test.Assert (JSM.IsEqual (br.ReadDouble64 (), 12345.6789));
	test.Assert (JSM.IsEqual (br.ReadDouble64 (), -12345.6789));
});

importSuite.AddTest ('Convert3dsToJsonDataTest', function (test)
{
	var jsonData = JSM.Convert3dsToJsonData (GetArrayBufferFromFile ('../testfiles/cube.3ds'));
	var refJsonData = {
		"version":1,
		"materials":[
			{"name":"Color_A0","ambient":[0,0,0],"diffuse":[1,0,0],"specular":[0.32941176470588235,0.32941176470588235,0.32941176470588235],"shininess":0,"opacity":1},
			{"name":"Color_G0","ambient":[0,0,0],"diffuse":[0,1,0],"specular":[0.32941176470588235,0.32941176470588235,0.32941176470588235],"shininess":0,"opacity":1},
			{"name":"Color_I0","ambient":[0,0,0],"diffuse":[0,0,1],"specular":[0.32941176470588235,0.32941176470588235,0.32941176470588235],"shininess":0,"opacity":1},
			{"name":"FrontCol","ambient":[0,0,0],"diffuse":[1,1,1],"specular":[0.32941176470588235,0.32941176470588235,0.32941176470588235],"shininess":0,"opacity":1}
		],
		"meshes":[
			{
				"name":"Model",
				"vertices":[1,2,0,0,0,0,0,2,0,1,0,0,1,2,0,1,0,3,1,0,0,1,2,3,1,2,0,0,2,3,1,2,3,0,2,0,0,2,3,0,2,0,0,0,3,1,0,3,1,0,0,1,0,3,0,2,3,0,0,3,1,2,3],
				"normals":[0,0,-1,0,0,-1,1,0,0,1,0,0,0,1,0,0,1,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,0,1,0,0,1],
				"uvs":[-39.370079040527344,78.74015808105469,0,0,0,78.74015808105469,-39.370079040527344,0,78.74015808105469,0,0,118.11023712158203,0,0,78.74015808105469,118.11023712158203,-39.370079040527344,0,0,118.11023712158203,-39.370079040527344,118.11023712158203,0,0,-78.74015808105469,118.11023712158203,-78.74015808105469,0,0,118.11023712158203,39.370079040527344,118.11023712158203,39.370079040527344,0,39.370079040527344,0,0,78.74015808105469,0,0,39.370079040527344,78.74015808105469],
				"triangles":[
					{"material":0,"parameters":[1,15,14,8,8,8,1,15,14,15,1,16,9,9,9,15,1,16]},
					{"material":1,"parameters":[17,18,19,10,10,10,17,18,19,18,17,20,11,11,11,18,17,20]},
					{"material":2,"parameters":[4,5,6,2,2,2,4,5,6,5,4,7,3,3,3,5,4,7]},
					{"material":3,"parameters":[0,1,2,0,0,0,0,1,2,1,0,3,1,1,1,1,0,3,8,9,10,4,4,4,8,9,10,9,8,11,5,5,5,9,8,11,1,12,13,6,6,6,1,12,13,12,1,14,7,7,7,12,1,14]}
				]
			}
		]
	};
	test.Assert (JSON.stringify (jsonData) == JSON.stringify (refJsonData));
	
	var jsonData = JSM.Convert3dsToJsonData (GetArrayBufferFromFile ('../testfiles/objects.3ds'));
	test.Assert (jsonData.materials.length == 3);
	test.Assert (jsonData.materials[0].name == '0020_Red');
	test.Assert (jsonData.materials[1].name == '0076_Gre');
	test.Assert (jsonData.materials[2].name == '0103_Blu');
	
	test.Assert (jsonData.meshes.length == 3);
	
	test.Assert (jsonData.meshes[0].name == 'Mesh01');
	test.Assert (jsonData.meshes[0].vertices.length == 432);
	test.Assert (jsonData.meshes[0].normals.length == 564);
	test.Assert (jsonData.meshes[0].uvs.length == 288);
	test.Assert (jsonData.meshes[0].triangles.length == 2);
	test.Assert (jsonData.meshes[0].triangles[0].material == 1);
	test.Assert (jsonData.meshes[0].triangles[0].parameters.length == 432);
	test.Assert (jsonData.meshes[0].triangles[1].material == 2);
	test.Assert (jsonData.meshes[0].triangles[1].parameters.length == 396);
	
	test.Assert (jsonData.meshes[1].name == 'Mesh02');
	test.Assert (jsonData.meshes[1].vertices.length == 234);
	test.Assert (jsonData.meshes[1].normals.length == 288);
	test.Assert (jsonData.meshes[1].uvs.length == 156);
	test.Assert (jsonData.meshes[1].triangles.length == 3);
	test.Assert (jsonData.meshes[1].triangles[0].material == 0);
	test.Assert (jsonData.meshes[1].triangles[0].parameters.length == 18);
	test.Assert (jsonData.meshes[1].triangles[1].material == 1);
	test.Assert (jsonData.meshes[1].triangles[1].parameters.length == 216);
	test.Assert (jsonData.meshes[1].triangles[2].material == 2);
	test.Assert (jsonData.meshes[1].triangles[2].parameters.length == 198);

	test.Assert (jsonData.meshes[2].name == 'Mesh03');
	test.Assert (jsonData.meshes[2].vertices.length == 72);
	test.Assert (jsonData.meshes[2].normals.length == 36);
	test.Assert (jsonData.meshes[2].uvs.length == 48);
	test.Assert (jsonData.meshes[2].triangles.length == 2);
	test.Assert (jsonData.meshes[2].triangles[0].material == 0);
	test.Assert (jsonData.meshes[2].triangles[0].parameters.length == 72);
	test.Assert (jsonData.meshes[2].triangles[1].material == 2);
	test.Assert (jsonData.meshes[2].triangles[1].parameters.length == 36);
});

importSuite.AddTest ('ConvertObjToJsonDataTest', function (test)
{
	var jsonData = JSM.ConvertObjToJsonData (GetStringBufferFromFile ('../testfiles/cubeobj.obj'));
	var refJsonData = {
		"version":1,
		"materials":[
			{"name":"Default","ambient":[0.5,0.5,0.5],"diffuse":[0.5,0.5,0.5],"specular":[0.1,0.1,0.1],"shininess":0,"opacity":1}
		],
		"meshes":[
			{
				"name":"Mesh1 Model",
				"vertices":[-1.94623,0,0.600186,-1.94623,0,-0.979814,1.51377,0,-0.979814,1.51377,0,0.600186,-1.94623,0.69,0.600186,-1.94623,0.69,-0.979814,1.51377,0.69,0.600186,1.51377,0.69,-0.979814],
				"normals":[0,-1,0,-1,0,0,0,0,1,1,0,0,0,0,-1,0,1,0],
				"uvs":[76.6233,-23.6294,76.6233,38.5753,-59.5972,38.5753,-59.5972,-23.6294,-38.5753,0,23.6294,0,23.6294,27.1654,-38.5753,27.1654,-76.6233,0,59.5972,0,59.5972,27.1654,-76.6233,27.1654,-23.6294,0,38.5753,0,38.5753,27.1654,-23.6294,27.1654,-59.5972,0,76.6233,0,76.6233,27.1654,-59.5972,27.1654,-76.6233,38.5753,-76.6233,-23.6294,59.5972,-23.6294,59.5972,38.5753],
				"triangles":[
					{"material":0,"parameters":[0,1,2,0,0,0,0,1,2,0,2,3,0,0,0,0,2,3,1,0,4,1,1,1,4,5,6,1,4,5,1,1,1,4,6,7,0,3,6,2,2,2,8,9,10,0,6,4,2,2,2,8,10,11,3,2,7,3,3,3,12,13,14,3,7,6,3,3,3,12,14,15,2,1,5,4,4,4,16,17,18,2,5,7,4,4,4,16,18,19,5,4,6,5,5,5,20,21,22,5,6,7,5,5,5,20,22,23]}
				]
			}
		]
	};
	test.Assert (JSON.stringify (jsonData) == JSON.stringify (refJsonData));
	
	var jsonData = JSM.ConvertObjToJsonData (GetStringBufferFromFile ('../testfiles/invalidindices.obj'));
	var refJsonData = {
		"version":1,
		"materials":[
			{"name":"Default","ambient":[0.5,0.5,0.5],"diffuse":[0.5,0.5,0.5],"specular":[0.1,0.1,0.1],"shininess":0,"opacity":1}
		],
		"meshes":[
			{
				"name":"Mesh1 Model",
				"vertices":[-1.94623,0,0.600186,-1.94623,0,-0.979814,1.51377,0,-0.979814,1.51377,0,0.600186,-1.94623,0.69,0.600186,-1.94623,0.69,-0.979814,1.51377,0.69,0.600186,1.51377,0.69,-0.979814],
				"normals":[0,-1,0,0,-1,0,-1,0,0,-1,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,-1,0,0,-1,0,1,0,0,1,0],
				"uvs":[0,0],
				"triangles":[
					{"material":0,"parameters":[0,1,2,0,0,0,0,0,0,0,2,3,1,1,1,0,0,0,1,0,4,2,2,2,0,0,0,1,4,5,3,3,3,0,0,0,0,3,6,4,4,4,0,0,0,0,6,4,5,5,5,0,0,0,3,2,7,6,6,6,0,0,0,3,7,6,7,7,7,0,0,0,2,1,5,8,8,8,0,0,0,2,5,7,9,9,9,0,0,0,5,4,6,10,10,10,0,0,0,5,6,7,11,11,11,0,0,0]}
				]
			}
		]
	};
	test.Assert (JSON.stringify (jsonData) == JSON.stringify (refJsonData));

	var jsonData = JSM.ConvertObjToJsonData (GetStringBufferFromFile ('../testfiles/cubeobj.obj'), {
		onFileRequested : function (fileName) {
			test.Assert (fileName == 'cubeobj.mtl');
			return GetStringBufferFromFile ('../testfiles/cubeobj.mtl');
		}
	});
	var refJsonData = {
		"version":1,
		"materials":[
			{"name":"FrontColor","ambient":[0,0,0],"diffuse":[1,1,1],"specular":[0.33,0.33,0.33],"shininess":0,"opacity":1},
			{"name":"M_0020_Red","ambient":[0,0,0],"diffuse":[1,0,0],"specular":[0.33,0.33,0.33],"shininess":0,"opacity":1},
			{"name":"M_0103_Blue","ambient":[0,0,0],"diffuse":[0,0,1],"specular":[0.33,0.33,0.33],"shininess":0,"opacity":1},
			{"name":"M_0076_Green","ambient":[0,0,0],"diffuse":[0,0.501961,0],"specular":[0.33,0.33,0.33],"shininess":0,"opacity":1}
		],
		"meshes":[
			{
				"name":"Mesh1 Model",
				"vertices":[-1.94623,0,0.600186,-1.94623,0,-0.979814,1.51377,0,-0.979814,1.51377,0,0.600186,-1.94623,0.69,0.600186,-1.94623,0.69,-0.979814,1.51377,0.69,0.600186,1.51377,0.69,-0.979814],
				"normals":[0,-1,0,-1,0,0,0,0,1,1,0,0,0,0,-1,0,1,0],
				"uvs":[76.6233,-23.6294,76.6233,38.5753,-59.5972,38.5753,-59.5972,-23.6294,-38.5753,0,23.6294,0,23.6294,27.1654,-38.5753,27.1654,-76.6233,0,59.5972,0,59.5972,27.1654,-76.6233,27.1654,-23.6294,0,38.5753,0,38.5753,27.1654,-23.6294,27.1654,-59.5972,0,76.6233,0,76.6233,27.1654,-59.5972,27.1654,-76.6233,38.5753,-76.6233,-23.6294,59.5972,-23.6294,59.5972,38.5753],
				"triangles":[
					{"material":0,"parameters":[0,1,2,0,0,0,0,1,2,0,2,3,0,0,0,0,2,3,1,0,4,1,1,1,4,5,6,1,4,5,1,1,1,4,6,7,2,1,5,4,4,4,16,17,18,2,5,7,4,4,4,16,18,19]},
					{"material":1,"parameters":[5,4,6,5,5,5,20,21,22,5,6,7,5,5,5,20,22,23]},
					{"material":2,"parameters":[3,2,7,3,3,3,12,13,14,3,7,6,3,3,3,12,14,15]},
					{"material":3,"parameters":[0,3,6,2,2,2,8,9,10,0,6,4,2,2,2,8,10,11]}
				]
			}
		]
	};
	test.Assert (JSON.stringify (jsonData) == JSON.stringify (refJsonData));
	
	var jsonData = JSM.ConvertObjToJsonData (GetStringBufferFromFile ('../testfiles/negativeindices.obj'), {
		onFileRequested : function (fileName) {
			return null;
		}
	});
	var refJsonData = {
		"version":1,
		"materials":[
			{"name":"Default","ambient":[0.5,0.5,0.5],"diffuse":[0.5,0.5,0.5],"specular":[0.1,0.1,0.1],"shininess":0,"opacity":1}
		],
		"meshes":[
			{
				"name":"Default",
				"vertices":[0,0,0,1,0,0,1,1,0,0,1,0],
				"normals":[0,0,1,0,0,1],
				"uvs":[0,0],
				"triangles":[
					{"material":0,"parameters":[0,1,2,0,0,0,0,0,0,0,2,3,1,1,1,0,0,0]}
				]
			}
		]
	};
	test.Assert (JSON.stringify (jsonData) == JSON.stringify (refJsonData));	
	
	var jsonData = JSM.ConvertObjToJsonData (GetStringBufferFromFile ('../testfiles/meshesobj.obj'), {
		onFileRequested : function (fileName) {
			test.Assert (fileName == 'meshesobj.mtl');
			return GetStringBufferFromFile ('../testfiles/meshesobj.mtl');
		}
	});

	test.Assert (jsonData.materials.length == 3);
	test.Assert (jsonData.materials[0].name == 'M_0020_Red');
	test.Assert (jsonData.materials[1].name == 'M_0076_Green');
	test.Assert (jsonData.materials[2].name == 'M_0103_Blue');
	
	test.Assert (jsonData.meshes.length == 3);
	
	test.Assert (jsonData.meshes[0].name == 'Mesh1 Model');
	test.Assert (jsonData.meshes[0].vertices.length == 144);
	test.Assert (jsonData.meshes[0].normals.length == 78);
	test.Assert (jsonData.meshes[0].uvs.length == 104);
	test.Assert (jsonData.meshes[0].triangles.length == 2);
	test.Assert (jsonData.meshes[0].triangles[0].material == 0);
	test.Assert (jsonData.meshes[0].triangles[0].parameters.length == 396);
	test.Assert (jsonData.meshes[0].triangles[1].material == 1);
	test.Assert (jsonData.meshes[0].triangles[1].parameters.length == 432);
	
	test.Assert (jsonData.meshes[1].name == 'Mesh2 Model');
	test.Assert (jsonData.meshes[1].vertices.length == 78);
	test.Assert (jsonData.meshes[1].normals.length == 48);
	test.Assert (jsonData.meshes[1].uvs.length == 156);
	test.Assert (jsonData.meshes[1].triangles.length == 3);
	test.Assert (jsonData.meshes[1].triangles[0].material == 0);
	test.Assert (jsonData.meshes[1].triangles[0].parameters.length == 198);
	test.Assert (jsonData.meshes[1].triangles[1].material == 1);
	test.Assert (jsonData.meshes[1].triangles[1].parameters.length == 216);
	test.Assert (jsonData.meshes[1].triangles[2].material == 2);
	test.Assert (jsonData.meshes[1].triangles[2].parameters.length == 18);

	test.Assert (jsonData.meshes[2].name == 'Mesh3 Model');
	test.Assert (jsonData.meshes[2].vertices.length == 36);
	test.Assert (jsonData.meshes[2].normals.length == 24);
	test.Assert (jsonData.meshes[2].uvs.length == 72);
	test.Assert (jsonData.meshes[2].triangles.length == 2);
	test.Assert (jsonData.meshes[2].triangles[0].material == 0);
	test.Assert (jsonData.meshes[2].triangles[0].parameters.length == 72);
	test.Assert (jsonData.meshes[2].triangles[1].material == 2);
	test.Assert (jsonData.meshes[2].triangles[1].parameters.length == 108);
});

importSuite.AddTest ('ConvertStlToJsonDataTest', function (test)
{
	test.Assert (JSM.IsBinaryStlFile (GetArrayBufferFromFile ('../testfiles/objects_binary.stl')));
	test.Assert (!JSM.IsBinaryStlFile (GetArrayBufferFromFile ('../testfiles/objects_ascii.stl')));

	var jsonData = JSM.ConvertStlToJsonData (GetArrayBufferFromFile ('../testfiles/objects_binary.stl'), null);
	test.Assert (jsonData.materials.length == 1);
	test.Assert (jsonData.materials[0].name == 'Default');
	test.Assert (jsonData.meshes.length == 1);
	test.Assert (jsonData.meshes[0].name == 'Default');
	test.Assert (jsonData.meshes[0].vertices.length == 6552);
	test.Assert (jsonData.meshes[0].normals.length == 2184);
	test.Assert (jsonData.meshes[0].uvs.length == 2);
	test.Assert (jsonData.meshes[0].triangles.length == 1);
	test.Assert (jsonData.meshes[0].triangles[0].material == 0);
	test.Assert (jsonData.meshes[0].triangles[0].parameters.length == 6552);

	var jsonData = JSM.ConvertStlToJsonData (null, GetStringBufferFromFile ('../testfiles/objects_ascii.stl'));
	test.Assert (jsonData.materials.length == 1);
	test.Assert (jsonData.materials[0].name == 'Default');
	test.Assert (jsonData.meshes.length == 1);
	test.Assert (jsonData.meshes[0].name == 'Default');
	test.Assert (jsonData.meshes[0].vertices.length == 5148);
	test.Assert (jsonData.meshes[0].normals.length == 1716);
	test.Assert (jsonData.meshes[0].uvs.length == 2);
	test.Assert (jsonData.meshes[0].triangles.length == 1);
	test.Assert (jsonData.meshes[0].triangles[0].material == 0);
	test.Assert (jsonData.meshes[0].triangles[0].parameters.length == 5148);
});

}
