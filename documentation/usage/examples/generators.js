var generatorsGroup = {
name : 'Generators',
items : [

{
name : 'Cuboid',
info : 'Generate cuboids.',
handler : function (viewer) {
	var body1 = JSM.GenerateCuboid (1, 1, 1);
	var body2 = JSM.GenerateCuboid (1, 3, 2);

	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
}
},

{
name : 'Cylinder',
info : 'Generate cylinders.',
handler : function (viewer) {
	var body1 = JSM.GenerateCylinder (0.5, 1, 20, false, false);
	var body2 = JSM.GenerateCylinder (0.5, 1, 20, true, false);
	var body3 = JSM.GenerateCylinder (0.5, 1, 20, true, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 0, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
}
},

{
name : 'Sphere',
info : 'Generate spheres.',
handler : function (viewer) {
	var body1 = JSM.GenerateSphere (0.5, 20, false);
	var body2 = JSM.GenerateSphere (0.5, 20, true);
	var body3 = JSM.GenerateTriangulatedSphere (0.5, 2, false);
	var body4 = JSM.GenerateTriangulatedSphere (0.5, 2, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (0, 1.5, 0)));
	body4.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 1.5, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body4));
}
},

{
name : 'Cone',
info : 'Generate cones.',
handler : function (viewer) {
	var body1 = JSM.GenerateCone (0.2, 0.5, 1, 20, false, false);
	var body2 = JSM.GenerateCone (0.2, 0.5, 1, 20, true, false);
	var body3 = JSM.GenerateCone (0.2, 0.5, 1, 20, true, true);
	var body4 = JSM.GenerateCone (0, 0.5, 1, 20, false, false);
	var body5 = JSM.GenerateCone (0, 0.5, 1, 20, true, false);
	var body6 = JSM.GenerateCone (0, 0.5, 1, 20, true, true);

	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 0, 0)));
	body4.Transform (JSM.TranslationTransformation (new JSM.Coord (0, 1.5, 0)));
	body5.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 1.5, 0)));
	body6.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 1.5, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body4));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body5));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body6));
}
},

{
name : 'Torus',
info : 'Generate toruses.',
handler : function (viewer) {
	var body1 = JSM.GenerateTorus (0.5, 0.2, 20, 20, false);
	var body2 = JSM.GenerateTorus (0.5, 0.4, 20, 20, false);
	var body3 = JSM.GenerateTorus (0.5, 0.3, 20, 20, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (2, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (4, 0, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
}
},

{
name : 'Prism',
info : 'Generate prisms.',
handler : function (viewer) {
	var basePolygon = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (2, 0, 0),
		new JSM.Coord (2, 2, 0),
		new JSM.Coord (1, 2, 0),
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (0, 1, 0)
	];
	
	var direction1 = new JSM.Vector (0, 0, 1);
	var direction2 = new JSM.Vector (0, 1, 1);
	var body1 = JSM.GeneratePrism (basePolygon, direction1, 1, false);
	var body2 = JSM.GeneratePrism (basePolygon, direction1, 1, true);
	var body3 = JSM.GeneratePrism (basePolygon, direction2, 1, false);
	var body4 = JSM.GeneratePrism (basePolygon, direction2, 1, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (0, 3, 0)));
	body4.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 3, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body4));
}
},

{
name : 'Prism with hole',
info : 'Generate prism with holes.',
handler : function (viewer) {
	var basePoints = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (7, 0, 0),
		new JSM.Coord (7, 3, 0),
		new JSM.Coord (0, 3, 0),
		null,
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (1, 2, 0),
		new JSM.Coord (2, 2, 0),
		null,
		new JSM.Coord (3, 1, 0),
		new JSM.Coord (3, 2, 0),
		new JSM.Coord (4, 2, 0),
		new JSM.Coord (4, 1, 0),
		null,
		new JSM.Coord (5, 1, 0),
		new JSM.Coord (5, 2, 0),
		new JSM.Coord (6, 2, 0),
		new JSM.Coord (6, 1, 0),
		new JSM.Coord (5.5, 1.5, 0)
	];
	
	var direction = new JSM.Vector (0, 0, 1);
	var body = JSM.GeneratePrismWithHole (basePoints, direction, 1, true);
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body));
}
},

{
name : 'Prism shell',
info : 'Generate prism shells.',
handler : function (viewer) {
	var basePolygon = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (2, 0, 0),
		new JSM.Coord (2, 2, 0),
		new JSM.Coord (1, 2, 0),
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (0, 1, 0)
	];
	
	var direction1 = new JSM.Vector (0, 0, 1);
	var direction2 = new JSM.Vector (0, 1, 1);
	var body1 = JSM.GeneratePrismShell (basePolygon, direction1, 1, 0.2, false);
	var body2 = JSM.GeneratePrismShell (basePolygon, direction1, 1, 0.2, true);
	var body3 = JSM.GeneratePrismShell (basePolygon, direction2, 1, 0.2, false);
	var body4 = JSM.GeneratePrismShell (basePolygon, direction2, 1, 0.2, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (0, 3, 0)));
	body4.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 3, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body4));
}
},

{
name : 'Line shell',
info : 'Generate line shells.',
handler : function (viewer) {
	var basePolygon = [
		new JSM.Coord (0, 0, 0),
		new JSM.Coord (2, 0, 0),
		new JSM.Coord (2, 2, 0),
		new JSM.Coord (1, 2, 0),
		new JSM.Coord (1, 1, 0),
		new JSM.Coord (0, 1, 0)
	];
	
	var direction = new JSM.Vector (0, 0, 1);
	var body1 = JSM.GenerateLineShell (basePolygon, direction, 1, 0.2, false, false);
	var body2 = JSM.GenerateLineShell (basePolygon, direction, 1, 0.2, false, true);
	var body3 = JSM.GenerateLineShell (basePolygon, direction, 1, 0.2, true, false);
	var body4 = JSM.GenerateLineShell (basePolygon, direction, 1, 0.2, true, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (0, 3, 0)));
	body4.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 3, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body4));
}
},

{
name : 'Cylinder shell',
info : 'Generate cylinder shells.',
handler : function (viewer) {
	var body1 = JSM.GenerateCylinderShell (0.5, 1, 0.1, 20, false, false);
	var body2 = JSM.GenerateCylinderShell (0.5, 1, 0.1, 20, true, false);
	var body3 = JSM.GenerateCylinderShell (0.5, 1, 0.1, 20, true, true);
	
	body2.Transform (JSM.TranslationTransformation (new JSM.Coord (1.5, 0, 0)));
	body3.Transform (JSM.TranslationTransformation (new JSM.Coord (3, 0, 0)));
	
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body1));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body2));
	viewer.AddMeshes (JSM.ConvertBodyToThreeMeshes (body3));
}
},

{
name : 'Solids',
info : 'Generate platonic and archimedean solids.',
handler : function (viewer) {
	var names = [
		'Tetrahedron',
		'Hexahedron',
		'Octahedron',
		'Dodecahedron',
		'Icosahedron',
		'TruncatedTetrahedron',
		'Cuboctahedron',
		'TruncatedCube',
		'TruncatedOctahedron',
		'Rhombicuboctahedron',
		'TruncatedCuboctahedron',
		'SnubCube',
		'Icosidodecahedron',
		'TruncatedDodecahedron',
		'TruncatedIcosahedron',
		'Rhombicosidodecahedron',
		'TruncatedIcosidodecahedron',
		'SnubDodecahedron'
	];
	
	var model = new JSM.Model ();

	var i, j, body, polygon;
	var offsetX = 0.0;
	var offsetY = 0.0;
	for (i = 1; i <= names.length; i++) {
		body = JSM.GenerateSolidWithRadius (names[i - 1], 1.0);
		body.Transform (JSM.TranslationTransformation (new JSM.Coord (offsetX, offsetY, 0.0)));
		model.AddBody (body);
		offsetX = offsetX + 2.5;
		if (i % 6 == 0) {
			offsetY = offsetY + 2.5;
			offsetX = 0.0;
		}
	}

	var meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes (meshes);
}
},

{
name : 'Colored solids',
info : 'Generate platonic and archimedean solids.',
handler : function (viewer) {
	var names = [
		'Tetrahedron',
		'Hexahedron',
		'Octahedron',
		'Dodecahedron',
		'Icosahedron',
		'TruncatedTetrahedron',
		'Cuboctahedron',
		'TruncatedCube',
		'TruncatedOctahedron',
		'Rhombicuboctahedron',
		'TruncatedCuboctahedron',
		'SnubCube',
		'Icosidodecahedron',
		'TruncatedDodecahedron',
		'TruncatedIcosahedron',
		'Rhombicosidodecahedron',
		'TruncatedIcosidodecahedron',
		'SnubDodecahedron'
	];
	
	var model = new JSM.Model ();
	model.AddMaterial (new JSM.Material ({ambient : 0x279b61, diffuse : 0x279b61}));
	model.AddMaterial (new JSM.Material ({ambient : 0x008ab8, diffuse : 0x008ab8}));
	model.AddMaterial (new JSM.Material ({ambient : 0xcc3333, diffuse : 0xcc3333}));

	var i, j, body, polygon;
	var vertexNumToMaterial, usedMaterialNum;
	var offsetX = 0.0;
	var offsetY = 0.0;
	for (i = 1; i <= names.length; i++) {
		body = JSM.GenerateSolidWithRadius (names[i - 1], 1.0);
		body.Transform (JSM.TranslationTransformation (new JSM.Coord (offsetX, offsetY, 0.0)));
		
		vertexNumToMaterial = {};
		usedMaterialNum = 0;
		for (j = 0; j < body.PolygonCount (); j++) {
			polygon = body.GetPolygon (j);
			if (vertexNumToMaterial[polygon.VertexIndexCount ()] === undefined) {
				vertexNumToMaterial[polygon.VertexIndexCount ()] = usedMaterialNum;
				usedMaterialNum += 1;
			}
			polygon.SetMaterialIndex (vertexNumToMaterial[polygon.VertexIndexCount ()]);
		}
		
		model.AddBody (body);
		offsetX = offsetX + 2.5;
		if (i % 6 == 0) {
			offsetY = offsetY + 2.5;
			offsetX = 0.0;
		}
	}

	var meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes (meshes);
}
},

]
};
