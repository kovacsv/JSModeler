function AddTextureTests (canvasTester, viewer)
{
	var textureSuite = canvasTester.AddTestSuite ('Texture');

	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var model = new JSM.Model ();
	
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.SetPolygonsMaterialIndex (0);

		var body2 = JSM.GenerateCylinder (0.5, 1.0, 30, true, true);
		body2.SetPolygonsMaterialIndex (0);

		OffsetTwoBodies (body1, body2, 0.6, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/texture/texture.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var model = new JSM.Model ();
	
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.Transform (new JSM.RotationXTransformation (-30.0 * JSM.DegRad));
		body1.SetPolygonsMaterialIndex (0);

		var body2 = JSM.GenerateCylinder (0.5, 1.0, 30, true, true);
		body2.Transform (new JSM.RotationXTransformation (-30.0 * JSM.DegRad));
		body2.SetPolygonsMaterialIndex (0);

		OffsetTwoBodies (body1, body2, 0.6, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/texture/texture_rotated.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var model = new JSM.Model ();
	
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.SetTextureProjectionType ('Planar');
		body1.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (0.0, 0.0, 0.0),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0),
			new JSM.Coord (0.0, 0.0, 0.0)
		));
		body1.SetPolygonsMaterialIndex (0);

		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.SetTextureProjectionType ('Planar');
		body2.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (0.2, 0.3, 0.4),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0),
			new JSM.Coord (0.0, 0.0, 0.0)
		));
		body2.SetPolygonsMaterialIndex (0);
		
		var body3 = JSM.GenerateCuboid (1, 1, 1);
		body3.SetTextureProjectionType ('Planar');
		body3.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.5, -0.5, -0.5),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0),
			new JSM.Coord (0.0, 0.0, 0.0)
		));
		body3.SetPolygonsMaterialIndex (0);		

		OffsetTwoBodies (body1, body3, 1.2, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		model.AddBody (body3);
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/texture/texture_types.png');
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var model = new JSM.Model ();
	
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.SetCubicTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body1.SetPolygonsMaterialIndex (0);

		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.SetCubicTextureProjection (new JSM.Coord (0.2, 0.3, 0.4), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body2.SetPolygonsMaterialIndex (0);
		
		var body3 = JSM.GenerateCuboid (1, 1, 1);
		body3.SetCubicTextureProjection (new JSM.Coord (-0.5, -0.5, -0.5), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));		
		body3.SetPolygonsMaterialIndex (0);		

		OffsetTwoBodies (body1, body3, 1.2, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		model.AddBody (body3);
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/texture/texture_types2.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var model = new JSM.Model ();
	
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));

		var body1 = JSM.GenerateCylinder (0.5, 1.0, 30, true, true);
		body1.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body1.SetPolygonsMaterialIndex (0);

		var body2 = JSM.GenerateCylinder (0.5, 1.0, 30, true, true);
		body2.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.5), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body2.SetPolygonsMaterialIndex (0);
		
		var body3 = JSM.GenerateCylinder (0.5, 1.0, 30, true, true);
		body3.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, 0.0), 1.0, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body3.SetPolygonsMaterialIndex (0);		

		OffsetTwoBodies (body1, body3, 1.2, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		model.AddBody (body3);
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/texture/texture_types3.png');	

}
