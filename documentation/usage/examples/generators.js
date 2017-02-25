var generatorsGroup = {
name : 'Generators',
items : [

{
name : 'Cuboid',
info : 'Generating a cuboid.',
handler : function (viewer) {
	var body = JSM.GenerateCuboid (2, 3, 4);
	var meshes = JSM.ConvertBodyToThreeMeshes (body);
	viewer.AddMeshes (meshes);
}
},

]
};
