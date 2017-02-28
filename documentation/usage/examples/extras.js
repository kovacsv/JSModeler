var extrasGroup = {
name : 'Extras',
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

]
};
