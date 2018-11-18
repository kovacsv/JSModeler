var extrasGroup = {
name : 'Extras',
items : [

{
name : 'Subdivision',
info : 'Generate cubes, and apply subdivision with different levels.',
handler : function (viewer) {
	var model = new JSM.Model ();
	model.AddMaterial (new JSM.Material ({ambient : 0xcc3333, diffuse : 0xcc3333}));
	model.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));

	var i, body;
	for (i = 0; i < 5; i++) {
		body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (3).SetMaterialIndex (0);	
		body.GetPolygon (5).SetMaterialIndex (1);	
		body.Transform (JSM.TranslationTransformation (new JSM.Vector (i * 1.5, 0, 0)));
		body = JSM.CatmullClarkSubdivision (body, i);
		model.AddBody (body);
	}

	var meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Lego Brick',
info : 'Generate lego bricks.',
handler : function (viewer) {
	var body1 = JSM.GenerateLegoBrick (2, 2, false, true, true, 20, true);
	var body2 = JSM.GenerateLegoBrick (2, 2, true, true, true, 20, true);;
	var body3 = JSM.GenerateLegoBrick (3, 2, true, true, true, 20, true);;
	body2.Transform (JSM.TranslationTransformation (new JSM.Vector (2, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Vector (4, 0, 0)));
	
	var model = new JSM.Model ();
	model.AddBody (body1);
	model.AddBody (body2);
	model.AddBody (body3);

	var meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes (meshes);
}
},

]
};
