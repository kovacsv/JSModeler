JSM.TriangleModel = function ()
{
	this.materials = [];
	this.bodies = [];
	this.defaultMaterial = -1;
};

JSM.TriangleModel.prototype.AddMaterial = function (material)
{
	if (material === undefined || material === null) {
		material = {};
	}
	
	var newMaterial = {};
	JSM.CopyObjectProperties (material, newMaterial, true);
	
	this.materials.push (newMaterial);
	return this.materials.length - 1;
};

JSM.TriangleModel.prototype.GetMaterial = function (index)
{
	return this.materials[index];
};

JSM.TriangleModel.prototype.AddDefaultMaterial = function ()
{
	if (this.defaultMaterial == -1) {
		this.defaultMaterial = this.AddMaterial ();
	}
	return this.defaultMaterial;
};

JSM.TriangleModel.prototype.GetDefaultMaterialIndex = function ()
{
	return this.AddDefaultMaterial ();
};

JSM.TriangleModel.prototype.MaterialCount = function ()
{
	return this.materials.length;
};

JSM.TriangleModel.prototype.AddBody = function (body)
{
	this.bodies.push (body);
	return this.bodies.length - 1;
};

JSM.TriangleModel.prototype.AddBodyToIndex = function (body, index)
{
	this.bodies.splice (index, 0, body);
	return index;
};

JSM.TriangleModel.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

JSM.TriangleModel.prototype.BodyCount = function ()
{
	return this.bodies.length;
};

JSM.TriangleModel.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

JSM.TriangleModel.prototype.FinalizeMaterials = function ()
{
	var defaultMaterialData = {
		name : 'Default',
		ambient : [0.5, 0.5, 0.5],
		diffuse : [0.5, 0.5, 0.5],
		specular : [0.1, 0.1, 0.1],
		shininess : 0.0,
		opacity : 1.0,
		texture : null,
		offset : null,
		scale : null,
		rotation : null
	};
	
	var i, material;
	for (i = 0; i < this.materials.length; i++) {
		material = this.materials[i];
		JSM.CopyObjectProperties (defaultMaterialData, material, false);
	}
};

JSM.TriangleModel.prototype.FinalizeBodies = function ()
{
	var i, body;
	for (i = 0; i < this.bodies.length; i++) {
		body = this.bodies[i];
		body.Finalize (this);
	}
};

JSM.TriangleModel.prototype.Finalize = function ()
{
	this.FinalizeBodies ();
	this.FinalizeMaterials ();
};
