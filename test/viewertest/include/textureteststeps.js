function TestStep (viewer, mode, step, info)
{
	var current = 0;
	ClearViewer (viewer, mode, info);

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png'}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png'}));
	
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
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png'}));
	
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
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.2, textureHeight : 0.2}));
	
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
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 1.0, textureHeight : 1.0}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);

		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 1.0, textureHeight : 1.0}));
	
		var body = JSM.GenerateCuboid (1, 1, 1);
		body.SetPolygonsMaterialIndex (0);

		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));		

		body.Transform (new JSM.RotationXTransformation (-30 * JSM.DegRad));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);
		
		body.SetCubicTextureProjection (new JSM.Coord (-0.3, -0.3, -0.3), new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 1.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
	
	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 1.0, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}

	if (step == current++) {
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff, specular : 0x000000, shininess : 0.0, opacity : 1.0, texture : 'texture.png', textureWidth : 0.5, textureHeight : 0.5}));
	
		var body = JSM.GenerateCylinder (0.5, 1.0, 50, true, true);
		body.SetPolygonsMaterialIndex (0);

		body.SetCylindricalTextureProjection (new JSM.Coord (0.0, 0.0, -0.3), 0.5, new JSM.Coord (1.0, 0.0, 0.0), new JSM.Coord (0.0, 0.0, 1.0));
		body.Transform (new JSM.RotationXTransformation (-30 * JSM.DegRad));
		AddBodyToViewer (viewer, mode, body, materials, info);
	}
}
