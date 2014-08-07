function TestStep (viewer, mode, step, info)
{
	var current = 0;
	ClearViewer (viewer, mode, info);

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png'));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png'));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetTextureProjectionType ('Planar');
		body.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.5, -0.5, -0.5),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 1.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0)
		));		
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png'));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetTextureProjectionType ('Planar');
		body.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.3, -0.3, -0.3),
			new JSM.Coord (1.0, 0.0, 0.0),
			new JSM.Coord (0.0, 1.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0)
		));		
		AddBodyToViewer (viewer, mode, body, materials, info);
	}	

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.2, 0.2));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetTextureProjectionType ('Planar');
		body.SetTextureProjectionCoords (new JSM.CoordSystem (
			new JSM.Coord (-0.4, -0.4, 0.4),
			new JSM.Coord (1.0, 0.0, 1.0),
			new JSM.Coord (0.0, 1.0, 0.0),
			new JSM.Coord (0.0, 0.0, 1.0)
		));		
		AddBodyToViewer (viewer, mode, body, materials, info);
	}	
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.5, 0.5));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 1.0, 1.0));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);

		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 1.0, 1.0));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);

		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));		

		body.Transform (new JSM.RotationXTransformation (-30 * JSM.DegRad));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.5, 0.5));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.5, 0.5));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.5, 0.5));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.5, 0.5));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 1.0, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffffff, 0xffffff, 1.0, 'texture.png', 0.5, 0.5));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body.Transform (new JSM.RotationXTransformation (-30 * JSM.DegRad));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
}
