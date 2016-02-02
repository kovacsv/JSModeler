JSM.RenderBody = function ()
{
	this.transformation = new JSM.Transformation ();
	this.meshes = {};
};

JSM.RenderBody.prototype.AddMesh = function (mesh)
{
	if (this.meshes[mesh.material.type] === undefined) {
		this.meshes[mesh.material.type] = [];
	}
	this.meshes[mesh.material.type].push (mesh);
};

JSM.RenderBody.prototype.EnumerateMeshes = function (onMeshFound)
{
	var meshType;
	for (meshType in this.meshes) {
		if (this.meshes.hasOwnProperty (meshType)) {
			this.EnumerateTypedMeshes (meshType, onMeshFound);
		}
	}
};

JSM.RenderBody.prototype.HasTypedMeshes = function (meshType)
{
	return this.meshes[meshType] !== undefined;
};

JSM.RenderBody.prototype.EnumerateTypedMeshes = function (meshType, onMeshFound)
{
	if (!this.HasTypedMeshes (meshType)) {
		return;
	}
	
	var typedMeshes = this.meshes[meshType];
	var	i, typedMesh;
	for	(i = 0; i < typedMeshes.length; i++) {
		typedMesh = typedMeshes[i];
		onMeshFound (typedMesh);
	}
};

JSM.RenderBody.prototype.EnumerateMeshesWithFlag = function (flag, onMeshFound)
{
	var meshType;
	for (meshType in this.meshes) {
		if (this.meshes.hasOwnProperty (meshType) && (meshType & flag)) {
			this.EnumerateTypedMeshes (meshType, onMeshFound);
		}
	}
};

JSM.RenderBody.prototype.GetTransformation = function ()
{
	return this.transformation;
};

JSM.RenderBody.prototype.GetTransformationMatrix = function ()
{
	return this.transformation.matrix;
};

JSM.RenderBody.prototype.SetTransformation = function (transformation)
{
	this.transformation = transformation;
};
