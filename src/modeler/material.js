JSM.Material = function (ambient, diffuse, opacity, texture, textureWidth, textureHeight)
{
	this.ambient = ambient || 0xcc0000;
	this.diffuse = diffuse || 0xcc0000;
	this.opacity = opacity || 1.0;
	this.texture = texture || null;
	this.textureWidth = textureWidth || 1.0;
	this.textureHeight = textureHeight || 1.0;
};

JSM.Material.prototype =
{

};

JSM.Materials = function ()
{
	this.materials = [];
};

JSM.Materials.prototype =
{
	AddMaterial : function (material)
	{
		this.materials.push (material);
	},
	
	GetMaterial : function (index)
	{
		return this.materials[index];
	},
	
	Count : function ()
	{
		return this.materials.length;
	}
};
