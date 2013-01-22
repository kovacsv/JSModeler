JSM.Material = function (ambient, diffuse, opacity, texture, textureWidth, textureHeight)
{
	this.ambient = 0x00cc00;
	this.diffuse = 0x00cc00;
	this.opacity = 1.0;
	this.texture = null;
	this.textureWidth = 1.0;
	this.textureHeight = 1.0;

	if (ambient !== undefined)			this.ambient = ambient;
	if (diffuse !== undefined)			this.diffuse = diffuse;
	if (opacity !== undefined)			this.opacity = opacity;
	if (texture !== undefined)			this.texture = texture;
	if (textureWidth !== undefined)		this.textureWidth = textureWidth;
	if (textureHeight !== undefined)	this.textureHeight = textureHeight;
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
	},
	
	Clone : function ()
	{
		return new JSM.Material (this.ambient, this.diffuse, this.opacity, this.texture, this.textureWidth, this.textureHeight);
	}
};
