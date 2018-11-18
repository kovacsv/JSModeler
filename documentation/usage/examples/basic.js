var basicGroup = {
name : 'Basic',
items : [

{
name : 'Create polygon',
info : 'Creating a polygon based on vertex positions.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 1)));
	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 2, 3]));
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Create more polygons',
info : 'Create two connecting polygons.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-0.5, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.5, -0.5, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.5, -0.5, 0)));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-0.5, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.5, -0.5, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.5, -0.5, 1)));

	body.AddPolygon (new JSM.BodyPolygon ([0, 1, 4, 3]));
	body.AddPolygon (new JSM.BodyPolygon ([1, 2, 5, 4]));

	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Polygon curve groups',
info : 'Create two connecting polygons, and put them in the same curve group.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-0.5, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.5, -0.5, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.5, -0.5, 0)));

	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (-0.5, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0.5, -0.5, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1.5, -0.5, 1)));

	var polygon1 = new JSM.BodyPolygon ([0, 1, 4, 3]);
	var polygon2 = new JSM.BodyPolygon ([1, 2, 5, 4]);
	polygon1.SetCurveGroup (0);
	polygon2.SetCurveGroup (0);
	
	body.AddPolygon (polygon1);
	body.AddPolygon (polygon2);

	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Polygon materials',
info : 'Create two connecting polygons, and set different material to each.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 1)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 1)));
			
	var materials = new JSM.MaterialSet ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xcc3333, diffuse : 0xcc3333}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));

	var polygon1 = new JSM.BodyPolygon ([0, 1, 2, 3]);
	var polygon2 = new JSM.BodyPolygon ([0, 3, 5, 4]);
	polygon1.SetMaterialIndex (0);
	polygon2.SetMaterialIndex (1);
	
	body.AddPolygon (polygon1);
	body.AddPolygon (polygon2);

	var meshes = JSM.ConvertBodyToThreeMeshes (body, materials);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Create line',
info : 'Create some lines.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
	
	body.AddLine (new JSM.BodyLine (0, 1));
	body.AddLine (new JSM.BodyLine (1, 2));
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Line materials',
info : 'Create some lines with different materials.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
	
	var line1 = new JSM.BodyLine (0, 1);
	var line2 = new JSM.BodyLine (1, 2);
	
	var materials = new JSM.MaterialSet ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xcc3333, diffuse : 0xcc3333}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));	
	
	line1.SetMaterialIndex (0);
	line2.SetMaterialIndex (1);
	
	body.AddLine (line1);
	body.AddLine (line2);
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body, materials);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Create point',
info : 'Create some points.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	
	body.AddPoint (new JSM.BodyPoint (0));
	body.AddPoint (new JSM.BodyPoint (1));
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Point materials',
info : 'Create some points with different materials.',
handler : function (viewer) {
	var body = new JSM.Body ();
	
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
	body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
	
	var point1 = new JSM.BodyPoint (0);
	var point2 = new JSM.BodyPoint (1);
	
	var materials = new JSM.MaterialSet ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xcc3333, diffuse : 0xcc3333}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));	
	
	point1.SetMaterialIndex (0);
	point2.SetMaterialIndex (1);
	
	body.AddPoint (point1);
	body.AddPoint (point2);
	
	var meshes = JSM.ConvertBodyToThreeMeshes (body, materials);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Generator function',
info : 'Generate a cube with cube generator function.',
handler : function (viewer) {
	var body = JSM.GenerateCuboid (1, 1, 1);
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Transformation',
info : 'Generate two cubes, one with a transformation.',
handler : function (viewer) {
	var body1 = JSM.GenerateCuboid (1, 1, 1);
	var body2 = JSM.GenerateCuboid (1, 1, 1);
	var transformation = new JSM.Transformation ();
	transformation.Append (JSM.TranslationTransformation (new JSM.Vector (2, 0, 0)));
	transformation.Append (JSM.RotationXTransformation (45 * JSM.DegRad));
	body2.Transform (transformation);
	
	var meshes1 = JSM.ConvertBodyToThreeMeshes (body1);
	var meshes2 = JSM.ConvertBodyToThreeMeshes (body2);
	viewer.AddMeshes (meshes1);
	viewer.AddMeshes (meshes2);
}
},

{
name : 'Create model',
info : 'Generate two cubes, and put them in a model.',
handler : function (viewer) {
	var body1 = JSM.GenerateCuboid (1, 1, 1);
	var body2 = JSM.GenerateCuboid (1, 1, 1);
	body2.Transform (JSM.TranslationTransformation (new JSM.Vector (2, 0, 0)));
	
	var model = new JSM.Model ();
	model.AddBody (body1);
	model.AddBody (body2);

	var meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Model materials',
info : 'Generate two cubes, put them in a model, and set materials for them.',
handler : function (viewer) {
	var body1 = JSM.GenerateCuboid (1, 1, 1);
	var body2 = JSM.GenerateCuboid (1, 1, 1);
	body2.Transform (JSM.TranslationTransformation (new JSM.Vector (2, 0, 0)));
	
	var model = new JSM.Model ();
	model.AddMaterial (new JSM.Material ({ambient : 0xcc3333, diffuse : 0xcc3333}));
	model.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));

	body1.SetPolygonsMaterialIndex (0);
	body2.SetPolygonsMaterialIndex (1);

	model.AddBody (body1);
	model.AddBody (body2);

	var meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes (meshes);
}
}

]
};