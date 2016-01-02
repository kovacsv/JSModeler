function AddTextureTests (canvasTester, viewer)
{
	var textureSuite = canvasTester.AddTestSuite ('Texture');
	
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

	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);

		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cube_default.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetTextureProjectionType ('Planar');
		body.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.5, -0.5, -0.5),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 1.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0)
		));		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cube_planar.png');	

	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetTextureProjectionType ('Planar');
		body.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.3, -0.3, -0.3),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 1.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0)
		));	
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cube_planar2.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.2, textureHeight : 0.2}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetTextureProjectionType ('Planar');
		body.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.4, -0.4, 0.4),
			new JSM.Coord (1.0, 0.0, 1.0),
			new JSM.Coord (0.0, 1.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0)
		));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cube_planar3.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cube_resized.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);

		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cube_offseted.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cylinder_default.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cylinder_cubic.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cylinder_resized_offseted.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 1.0, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cylinder_resized_offseted2.png');	
	
	canvasTester.AddTest (textureSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body.Transform (new JSM.RotationXTransformation (-30 * JSM.DegRad));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/texture/cylinder_resized_offseted_transformed.png');	
	
}

