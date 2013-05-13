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
	this.ambient = JSM.ValueOrDefault (ambient, 0x00cc00);
	this.diffuse = JSM.ValueOrDefault (diffuse, 0x00cc00);
	this.opacity = JSM.ValueOrDefault (opacity, 1.0);
	this.texture = JSM.ValueOrDefault (texture, null);
	this.textureWidth = JSM.ValueOrDefault (textureWidth, 1.0);
	this.textureHeight = JSM.ValueOrDefault (textureHeight, 1.0);
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
