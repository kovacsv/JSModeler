JSM.HexColorToRGBColor = function (hexColor)
{
	var hexString = hexColor.toString (16);
	while (hexString.length < 6) {
		hexString = '0' + hexString;
	}
	var r = parseInt (hexString.substr (0, 2), 16);
	var g = parseInt (hexString.substr (2, 2), 16);
	var b = parseInt (hexString.substr (4, 2), 16);
	return [r, g, b];
};

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
	this.defaultMaterial = new JSM.Material ();
};

JSM.Materials.prototype =
{
	AddMaterial : function (material)
	{
		this.materials.push (material);
	},
	
	GetMaterial : function (index)
	{
		if (index < 0 || index >= this.materials.length) {
			return this.defaultMaterial;
		}
		return this.materials[index];
	},
	
	GetDefaultMaterial : function (index)
	{
		return this.defaultMaterial;
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
