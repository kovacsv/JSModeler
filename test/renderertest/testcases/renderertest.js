function AddRendererTests (canvasTester, viewer)
{
	var rendererSuite = canvasTester.AddTestSuite ('Renderer');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/cube_default_material.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var basePoints = [
			new JSM.Coord (0.0, 0.0, -0.5),
			new JSM.Coord (0.0, 1.0, -0.5),
			new JSM.Coord (-1.0, 1.0, -0.5),
			new JSM.Coord (-1.0, -1.0, -0.5),
			new JSM.Coord (1.0, -1.0, -0.5),
			new JSM.Coord (1.0, 0.0, -0.5)
		];
		
		var direction = new JSM.Vector (0.0, 0.0, 1.0);
		var body = JSM.GeneratePrism (basePoints, direction, 1.0, true, null);
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/prism_default_material.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboidSides (1, 1, 1, [0, 0, 1, 1, 1, 0]);
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/cube_sides.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/cube_same_material.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/cube_materials.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0x000000, diffuse : 0xffffff}));
		
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		RenderBody (viewer, body, materials, renderFinished, function () {
			viewer.AddLight (new JSM.RenderLight (0x000000, 0xcc0000, 0xffffff, new JSM.Vector (-1.0, 0.0, 0.0)));
		});
	}, 'references/renderer/cube_lights.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0x000000, diffuse : 0xffffff}));
		
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		RenderBody (viewer, body, materials, renderFinished, function () {
			viewer.DisableCameraLight ();
			viewer.AddLight (new JSM.RenderLight (0x000000, 0xcc0000, 0xffffff, new JSM.Vector (-1.0, 0.0, 0.0)));
			viewer.AddLight (new JSM.RenderLight (0x000000, 0x00cc00, 0xffffff, new JSM.Vector (-1.0, 0.0, 0.0)));
			viewer.AddLight (new JSM.RenderLight (0x000000, 0x00cc00, 0xffffff, new JSM.Vector (0.0, -1.0, 0.0)));
			viewer.AddLight (new JSM.RenderLight (0x000000, 0x0000cc, 0xffffff, new JSM.Vector (0.0, 0.0, -1.0)));
		});
	}, 'references/renderer/cube_lights2.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();

		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.SetPolygonsMaterialIndex (0);
		OffsetTwoBodies (body1, body2, 0.6, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		RenderModel (viewer, model, materials, renderFinished);
	}, 'references/renderer/two_cubes.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();

		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.SetPolygonsMaterialIndex (0);
		body2.Transform (new JSM.RotationTransformation (new JSM.Coord (1.0, 0.0, 0.0), 45.0 * JSM.DegRad));
		OffsetTwoBodies (body1, body2, 0.6, 0.0, 0.0);
		
		model.AddBody (body1);
		model.AddBody (body2);
		RenderModel (viewer, model, materials, renderFinished);
	}, 'references/renderer/two_cubes_transformed.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();
	
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'testfiles/texture.png'}));

		var body1 = JSM.GenerateCuboid (1, 1, 1);

		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.SetPolygonsMaterialIndex (0);
		
		var body3 = JSM.GenerateCuboid (1, 1, 1);
		body3.SetPolygonsMaterialIndex (1);		

		OffsetTwoBodies (body1, body3, 1.2, 0.0, 0.0);

		model.AddBody (body1);
		model.AddBody (body2);
		model.AddBody (body3);
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/renderer/three_cubes.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCylinder (0.5, 1.0, 25, true, false);
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/cylinder_segmented.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCylinder (0.5, 1.0, 25, true, true);
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/cylinder_curved.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboidSides (1, 1, 1, [0, 0, 1, 1, 1, 0]);
		body.SetPolygonsMaterialIndex (0);
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/texture_double_side.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/texture_one_side.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texturenpot.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/texture_one_side_npot.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 0.5, textureHeight : 0.2}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/texture_resized.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture2.jpg', textureWidth : 1.0, textureHeight : 1.0}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/texture_two_sides.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/texture_all_sides.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateTorus (0.8, 0.3, 50, 50, true);
		body.SetPolygonsMaterialIndex (0);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0x00cc00, diffuse : 0x00cc00, specular : 0x333333, shininess : 5.0}));
		
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/specular_reflection.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc, opacity : 0.5}));
		
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/opacity.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000, opacity : 0.75}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc, opacity : 0.75}));
		
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/opacity_two_sides.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000, opacity : 0.75}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc, opacity : 0.75, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/opacity_normal_and_texture.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0)
		body.GetPolygon (1).SetMaterialIndex (1);
		body.GetPolygon (2).SetMaterialIndex (2);
		body.GetPolygon (5).SetMaterialIndex (3);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000, opacity : 0.75}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc, opacity : 0.75, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/opacity_all_states.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc, opacity : 0.75, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		RenderBodyAndWait (viewer, body, materials, renderFinished);
	}, 'references/renderer/opacity_texture.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.SetPolygonsMaterialIndex (0);
		
		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.SetPolygonsMaterialIndex (1);

		var model = new JSM.Model ();
		model.AddBody (body1);
		model.AddBody (body2);
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		
		RenderModel (viewer, model, materials, renderFinished, function (bodies) {
			bodies[0].SetTransformation (JSM.RotationZTransformation (20.0 * JSM.DegRad));
			bodies[1].SetTransformation (JSM.TranslationTransformation (new JSM.Coord (-1.5, 0, 0)));
		});
	}, 'references/renderer/model_transformation.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));

		model.AddBody (body1);
		model.AddBody (body2);
		
		RenderModel (viewer, model, null, renderFinished);
	}, 'references/renderer/model_default_material.png');			
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.GetPolygon (2).SetMaterialIndex (0);
		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
		body2.GetPolygon (2).SetMaterialIndex (1);

		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		
		model.AddBody (body1);
		model.AddBody (body2);
		
		RenderModel (viewer, model, materials, renderFinished);
	}, 'references/renderer/model_materials.png');	

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();

		var body1 = JSM.GenerateCuboid (1, 1, 1);
		body1.GetPolygon (2).SetMaterialIndex (0);
		var body2 = JSM.GenerateCuboid (1, 1, 1);
		body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
		body2.GetPolygon (2).SetMaterialIndex (1);

		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture2.jpg', textureWidth : 1.0, textureHeight : 1.0}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, texture : 'testfiles/texture.png', textureWidth : 1.0, textureHeight : 1.0}));
		
		model.AddBody (body1);
		model.AddBody (body2);
		
		RenderModelAndWait (viewer, model, materials, renderFinished);
	}, 'references/renderer/model_textures.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var model = new JSM.Model ();
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x00cc00, diffuse : 0x00cc00}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xcccc00, diffuse : 0xcccc00}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc00cc, diffuse : 0xcc00cc}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x00cccc, diffuse : 0x00cccc}));

		var i, body;
		for (i = 0; i < 6; i++) {
			var body = JSM.GenerateCuboid (1, 1, (i + 1) / 4.0);
			body.SetPolygonsMaterialIndex (i);
			model.AddBody (body);
		}
		
		RenderModel (viewer, model, materials, renderFinished, function (bodies) {
			var i, body, transformation;
			for (i = 0; i < 6; i++) {
				body = bodies[i];
				transformation = new JSM.Transformation ();
				transformation.Append (JSM.TranslationTransformation (new JSM.Coord (2, 0, (i + 1) / 8.0)));
				transformation.Append (JSM.RotationZTransformation (i * 60 * JSM.DegRad));
				body.SetTransformation (transformation);
			}
		});
	}, 'references/renderer/model_more_materials.png');			

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.Body ();
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (0, 1));
		body.AddLine (new JSM.BodyLine (1, 2));
		body.AddLine (new JSM.BodyLine (2, 3));
		body.AddLine (new JSM.BodyLine (3, 0));
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/lines_default_material.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.Body ();
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (0, 1));
		body.AddLine (new JSM.BodyLine (1, 2));
		body.AddLine (new JSM.BodyLine (2, 3));
		body.AddLine (new JSM.BodyLine (3, 0));
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x00cc00, diffuse : 0x00cc00}));
		body.SetLinesMaterialIndex (0);
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/lines_same_material.png');
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.Body ();
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (0, 1));
		body.AddLine (new JSM.BodyLine (1, 2));
		body.AddLine (new JSM.BodyLine (2, 3));
		body.AddLine (new JSM.BodyLine (3, 0));
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		body.GetLine (0).SetMaterialIndex (0);
		body.GetLine (2).SetMaterialIndex (1);
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/lines_multiple_materials.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.Body ();
		var i, beg, end, line;
		for (i = 0; i < 6; i++) {
			beg = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, i * 0.5, 0)));
			end = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, i * 0.5, 0)));
			line = new JSM.BodyLine (beg, end);
			line.SetMaterialIndex (i);
			body.AddLine (line);
		}
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x00cc00, diffuse : 0x00cc00}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xcccc00, diffuse : 0xcccc00}));
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc00cc, diffuse : 0xcc00cc}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x00cccc, diffuse : 0x00cccc}));
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/lines_more_multiple_materials.png');

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.GenerateCuboid (0.5, 0.5, 0.5);
		var vert0 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		var vert1 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		var vert2 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		var vert3 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (vert0, vert1));
		body.AddLine (new JSM.BodyLine (vert1, vert2));
		body.AddLine (new JSM.BodyLine (vert2, vert3));
		body.AddLine (new JSM.BodyLine (vert3, vert0));
		RenderBody (viewer, body, null, renderFinished);
	}, 'references/renderer/polygons_and_lines.png');		

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.GenerateCuboid (0.5, 0.5, 0.5);
		var vert0 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		var vert1 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		var vert2 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		var vert3 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (vert0, vert1));
		body.AddLine (new JSM.BodyLine (vert1, vert2));
		body.AddLine (new JSM.BodyLine (vert2, vert3));
		body.AddLine (new JSM.BodyLine (vert3, vert0));
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		body.GetLine (1).SetMaterialIndex (0);
		body.GetLine (2).SetMaterialIndex (1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/polygons_and_lines_materials.png');			
	
	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.GenerateCuboid (0.5, 0.5, 0.5);
		var vert0 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		var vert1 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		var vert2 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		var vert3 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (vert0, vert1));
		body.AddLine (new JSM.BodyLine (vert1, vert2));
		body.AddLine (new JSM.BodyLine (vert2, vert3));
		body.AddLine (new JSM.BodyLine (vert3, vert0));
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc, opacity : 0.5}));
		body.GetLine (1).SetMaterialIndex (0);
		body.GetLine (2).SetMaterialIndex (1);
		body.GetPolygon (1).SetMaterialIndex (0);
		body.GetPolygon (2).SetMaterialIndex (1);
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/polygons_and_lines_opacity.png');			

	canvasTester.AddTest (rendererSuite, function (renderFinished) {
		var body = new JSM.GenerateCuboid (0.5, 0.5, 0.5);
		var vert0 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 0, 0)));
		var vert1 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 0, 0)));
		var vert2 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (1, 1, 0)));
		var vert3 = body.AddVertex (new JSM.BodyVertex (new JSM.Coord (0, 1, 0)));
		body.AddLine (new JSM.BodyLine (vert0, vert1));
		body.AddLine (new JSM.BodyLine (vert1, vert2));
		body.AddLine (new JSM.BodyLine (vert2, vert3));
		body.AddLine (new JSM.BodyLine (vert3, vert0));
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xcc0000, diffuse : 0xcc0000}));
		materials.AddMaterial (new JSM.Material ({ambient : 0x0000cc, diffuse : 0x0000cc}));
		body.SetPolygonsMaterialIndex (0);
		body.SetLinesMaterialIndex (1);
		RenderBody (viewer, body, materials, renderFinished);
	}, 'references/renderer/polygons_and_lines_same_material.png');	
}