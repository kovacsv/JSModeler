module.exports = function (unitTest)
{

var generalSuite = unitTest.AddTestSuite ('Import');

generalSuite.AddTest ('TriangleModelTest', function (test)
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

}
