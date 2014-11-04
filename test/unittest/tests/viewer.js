AddTestSuite ('Viewer');

AddTest ('ConverterTest', function (test)
{
	var body = new JSM.Body ();
	test.Assert (body.VertexCount () == 0 && body.PolygonCount () == 0);
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	test.Assert (body.VertexCount () == 4 && body.PolygonCount () == 1);
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	test.Assert (meshes.length == 1);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 1)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	test.Assert (body.VertexCount () == 8 && body.PolygonCount () == 2);
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	test.Assert (meshes.length == 1);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 12);
	test.Assert (mesh.geometry.faces.length == 4);
	
	var materials = new JSM.Materials ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x00cc00, diffuse : 0x00cc00}));
	body.GetPolygon (0).SetMaterialIndex (0);

	var meshes = JSM.ConvertBodyToThreeMeshes (body, materials);
	test.Assert (meshes.length == 2);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	body.GetPolygon (1).SetMaterialIndex (1);
	test.Assert (meshes.length == 2);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	var body2 = new JSM.Body ();
	test.Assert (body2.VertexCount () == 0 && body2.PolygonCount () == 0);
	
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 2)));
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 2)));
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 2)));
	body2.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 2)));
	body2.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	
	var model = new JSM.Model ();
	model.AddBody (body);
	model.AddBody (body2);
	test.Assert (model.BodyCount () == 2);

	var meshes = JSM.ConvertModelToThreeMeshes (model, materials);
	test.Assert (meshes.length == 3);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[2];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	body2.GetPolygon (0).SetMaterialIndex (0);
	var meshes = JSM.ConvertModelToThreeMeshes (model, materials);
	test.Assert (meshes.length == 3);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[2];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	body.GetPolygon (1).SetMaterialIndex (0);
	var meshes = JSM.ConvertModelToThreeMeshes (model, materials);
	test.Assert (meshes.length == 2);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 12);
	test.Assert (mesh.geometry.faces.length == 4);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
});

AddTest ('ViewerTest', function (test)
{
	var body = JSM.GenerateCuboid (1.0, 1.0, 1.0);
	test.Assert (body.VertexCount () == 8 && body.PolygonCount () == 6);

	var viewerSettings = {
		cameraEyePosition : [3.0, -3.0, 3.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0.0, 0.0, 1.0]
	};

	var canvas = document.createElement ('canvas');
	canvas.width = 800;
	canvas.height = 600;
	canvas.id = 'example';
	canvas.style.display = 'none';
	document.body.appendChild (canvas);
	
	var viewer = new JSM.ThreeViewer ();
	var result = viewer.Start (document.getElementById ('example'), viewerSettings);
	test.Assert (result);
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	test.Assert (meshes.length == 1);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 36);
	test.Assert (mesh.geometry.faces.length == 12);
	
	viewer.AddMesh (mesh);

	var boundingBox = viewer.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (viewer.GetCenter (), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (boundingBox.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (boundingBox.max, new JSM.Coord (0.5, 0.5, 0.5)));
	test.Assert (JSM.IsEqual (viewer.GetBoundingSphereRadius (), 0.8660254037844386));

	var body2 = JSM.GenerateCuboid (1.0, 1.0, 1.0);
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (2.0, 0.0, 0.0)));
	test.Assert (body2.VertexCount () == 8 && body2.PolygonCount () == 6);

	var meshes = JSM.ConvertBodyToThreeMeshes (body2);
	test.Assert (meshes.length == 1);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 36);
	test.Assert (mesh.geometry.faces.length == 12);
	
	viewer.AddMesh (mesh);

	var boundingBox = viewer.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (viewer.GetCenter (), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (boundingBox.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (boundingBox.max, new JSM.Coord (2.5, 0.5, 0.5)));
	test.Assert (JSM.IsEqual (viewer.GetBoundingSphereRadius (), 1.6583123951777));

	viewer.RemoveLastMesh ();

	var boundingBox = viewer.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (viewer.GetCenter (), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (boundingBox.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (boundingBox.max, new JSM.Coord (0.5, 0.5, 0.5)));
	test.Assert (JSM.IsEqual (viewer.GetBoundingSphereRadius (), 0.8660254037844386));

	viewer.RemoveLastMesh ();

	var boundingBox = viewer.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (viewer.GetCenter (), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (boundingBox.min, new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf)));
	test.Assert (JSM.CoordIsEqual (boundingBox.max, new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf)));
	test.Assert (JSM.IsEqual (viewer.GetBoundingSphereRadius (), 0.0));

	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	var mesh = meshes[0];
	viewer.AddMesh (mesh);

	var meshes = JSM.ConvertBodyToThreeMeshes (body2);
	var mesh = meshes[0];
	viewer.AddMesh (mesh);

	var boundingBox = viewer.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (viewer.GetCenter (), new JSM.Coord (1.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (boundingBox.min, new JSM.Coord (-0.5, -0.5, -0.5)));
	test.Assert (JSM.CoordIsEqual (boundingBox.max, new JSM.Coord (2.5, 0.5, 0.5)));
	test.Assert (JSM.IsEqual (viewer.GetBoundingSphereRadius (), 1.6583123951777));
	
	viewer.RemoveMeshes ();
	
	var boundingBox = viewer.GetBoundingBox ();
	test.Assert (JSM.CoordIsEqual (viewer.GetCenter (), new JSM.Coord (0.0, 0.0, 0.0)));
	test.Assert (JSM.CoordIsEqual (boundingBox.min, new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf)));
	test.Assert (JSM.CoordIsEqual (boundingBox.max, new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf)));
	test.Assert (JSM.IsEqual (viewer.GetBoundingSphereRadius (), 0.0));
});

AddTest ('JSONTest', function (test)
{
	var geometryData1 = {
		"version" : 1,
		"materials" : [
			{
				"ambient" : [1, 0, 0],
				"diffuse" : [1, 0, 0],
				"specular" : [0, 0, 0],
				"opacity" : 1
			},
			{
				"ambient" : [0, 1, 0],
				"diffuse" : [0, 1, 0],
				"specular" : [0, 1, 0],
				"opacity" : 1
			}
		],
		"meshes" : [
			{
				"vertices" : [
					0, 0, 0,
					1, 0, 0,
					1, 1, 0,
					0, 1, 0
				],
				"normals" : [
					0, 0, 1
				],
				"uvs" : [
					0, 0,
					1, 0,
					1, 1,
					0, 1
				],
				"triangles" : [
					{
						"material" : 0,
						"parameters" : [
							0, 1, 2, 0, 0, 0, 0, 1, 2,
							0, 2, 3, 0, 0, 0, 0, 2, 3
						]
					}
				]
			}
		]
	};

	var geometryData2 = {
		"version" : 1,
		"materials" : [
			{
				"ambient" : [1, 0, 0],
				"diffuse" : [1, 0, 0],
				"specular" : [0, 0, 0],
				"opacity" : 1
			},
			{
				"ambient" : [0, 1, 0],
				"diffuse" : [0, 1, 0],
				"specular" : [0, 1, 0],
				"opacity" : 1
			}
		],
		"meshes" : [
			{
				"vertices" : [
					0, 0, 0,
					1, 0, 0,
					1, 1, 0,
					0, 1, 0,
					0, 0, 1,
					1, 0, 1,
					1, 1, 1,
					0, 1, 1
				],
				"normals" : [
					0, 0, 1
				],
				"uvs" : [
					0, 0,
					1, 0,
					1, 1,
					0, 1
				],
				"triangles" : [
					{
						"material" : 0,
						"parameters" : [
							0, 1, 2, 0, 0, 0, 0, 1, 2,
							0, 2, 3, 0, 0, 0, 0, 2, 3,
							4, 5, 6, 0, 0, 0, 0, 1, 2,
							4, 6, 7, 0, 0, 0, 0, 2, 3
						]
					}
				]
			}
		]
	};	
	
	var geometryData3 = {
		"version" : 1,
		"materials" : [
			{
				"ambient" : [1, 0, 0],
				"diffuse" : [1, 0, 0],
				"specular" : [0, 0, 0],
				"opacity" : 1
			},
			{
				"ambient" : [0, 1, 0],
				"diffuse" : [0, 1, 0],
				"specular" : [0, 1, 0],
				"opacity" : 1
			}
		],
		"meshes" : [
			{
				"vertices" : [
					0, 0, 0,
					1, 0, 0,
					1, 1, 0,
					0, 1, 0,
					0, 0, 1,
					1, 0, 1,
					1, 1, 1,
					0, 1, 1
				],
				"normals" : [
					0, 0, 1
				],
				"uvs" : [
					0, 0,
					1, 0,
					1, 1,
					0, 1
				],
				"triangles" : [
					{
						"material" : 0,
						"parameters" : [
							0, 1, 2, 0, 0, 0, 0, 1, 2,
							0, 2, 3, 0, 0, 0, 0, 2, 3
						]
					},
					{
						"material" : 0,
						"parameters" : [
							4, 5, 6, 0, 0, 0, 0, 1, 2,
							4, 6, 7, 0, 0, 0, 0, 2, 3
						]
					}
				]
			}
		]
	};

	var geometryData4 = {
		"version" : 1,
		"materials" : [
			{
				"ambient" : [1, 0, 0],
				"diffuse" : [1, 0, 0],
				"specular" : [0, 0, 0],
				"opacity" : 1
			},
			{
				"ambient" : [0, 1, 0],
				"diffuse" : [0, 1, 0],
				"specular" : [0, 1, 0],
				"opacity" : 1
			}
		],
		"meshes" : [
			{
				"vertices" : [
					0, 0, 0,
					1, 0, 0,
					1, 1, 0,
					0, 1, 0,
					0, 0, 1,
					1, 0, 1,
					1, 1, 1,
					0, 1, 1
				],
				"normals" : [
					0, 0, 1
				],
				"uvs" : [
					0, 0,
					1, 0,
					1, 1,
					0, 1
				],
				"triangles" : [
					{
						"material" : 0,
						"parameters" : [
							0, 1, 2, 0, 0, 0, 0, 1, 2,
							0, 2, 3, 0, 0, 0, 0, 2, 3
						]
					},
					{
						"material" : 0,
						"parameters" : [
							4, 5, 6, 0, 0, 0, 0, 1, 2,
							4, 6, 7, 0, 0, 0, 0, 2, 3
						]
					}
				]
			},
			{
				"vertices" : [
					0, 0, 2,
					1, 0, 2,
					1, 1, 2,
					0, 1, 2,
				],
				"normals" : [
					0, 0, 1
				],
				"uvs" : [
					0, 0,
					1, 0,
					1, 1,
					0, 1
				],
				"triangles" : [
					{
						"material" : 0,
						"parameters" : [
							0, 1, 2, 0, 0, 0, 0, 1, 2,
							0, 2, 3, 0, 0, 0, 0, 2, 3
						]
					}
				]
			}
		]		
	};

	var meshes = JSM.ConvertJSONDataToThreeMeshes (geometryData1);
	test.Assert (meshes.length == 1);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	var meshes = JSM.ConvertJSONDataToThreeMeshes (geometryData2);
	test.Assert (meshes.length == 1);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 12);
	test.Assert (mesh.geometry.faces.length == 4);

	var meshes = JSM.ConvertJSONDataToThreeMeshes (geometryData3);
	test.Assert (meshes.length == 2);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);

	var meshes = JSM.ConvertJSONDataToThreeMeshes (geometryData4);
	test.Assert (meshes.length == 3);
	var mesh = meshes[0];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[1];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
	var mesh = meshes[2];
	test.Assert (mesh.geometry.vertices.length == 6);
	test.Assert (mesh.geometry.faces.length == 2);
});
