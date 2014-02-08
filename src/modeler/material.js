/**
* Function: HexColorToRGBComponents
* Description: Converts hex color strings to RGB components.
* Parameters:
*	hexColor {string} the hex color string
* Returns:
*	{integer[3]} the RGB components
*/
JSM.HexColorToRGBComponents = function (hexColor)
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

/**
* Function: HexColorToRGBColor
* Description: Converts hex color strings to RGB color.
* Parameters:
*	hexColor {string} the hex color string
* Returns:
*	{integer} the RGB value
*/
JSM.HexColorToRGBColor = function (hexColor)
{
	var hexString = '0x' + hexColor;
	return parseInt (hexString, 16);
};

/**
* Function: RGBComponentsToRGBColor
* Description: Converts RGB components to RGB color.
* Parameters:
*	red {integer} the red component
*	green {integer} the green component
*	blue {integer} the blue component
* Returns:
*	{integer} the RGB value
*/
JSM.RGBComponentsToRGBColor = function (red, green, blue)
{
	function IntegerToHex (intString)
	{
		var result = parseInt (intString, 10).toString (16);
		while (result.length < 2) {
			result = '0' + result;
		}
		return result;
	}
	var r = IntegerToHex (red);
	var g = IntegerToHex (green);
	var b = IntegerToHex (blue);
	var hexString = '0x' + r + g + b;
	return parseInt (hexString, 16);
};

/**
* Class: Material
* Description: Defines a material.
* Parameters:
*	ambient {number} the ambient component
*	diffuse {number} the diffuse component
*	opacity {number} the opacity component
*	texture {string} the name of the texture file
*	textureWidth {number} the width of the texture
*	textureHeight {number} the height of the texture
*/
JSM.Material = function (ambient, diffuse, opacity, texture, textureWidth, textureHeight)
{
	this.ambient = JSM.ValueOrDefault (ambient, 0x00cc00);
	this.diffuse = JSM.ValueOrDefault (diffuse, 0x00cc00);
	this.opacity = JSM.ValueOrDefault (opacity, 1.0);
	this.texture = JSM.ValueOrDefault (texture, null);
	this.textureWidth = JSM.ValueOrDefault (textureWidth, 1.0);
	this.textureHeight = JSM.ValueOrDefault (textureHeight, 1.0);
};

/**
* Class: Materials
* Description: Defines a material container.
*/
JSM.Materials = function ()
{
	this.materials = [];
	this.defaultMaterial = new JSM.Material ();
};

/**
* Function: Materials.GetMaterial
* Description: Returns a material from the container.
* Parameters:
*	index {integer} the index
* Returns:
*	{Material} the result
*/
JSM.Materials.prototype.GetMaterial = function (index)
{
	if (index < 0 || index >= this.materials.length) {
		return this.defaultMaterial;
	}
	return this.materials[index];
};

/**
* Function: Materials.AddMaterial
* Description: Adds a material to the container.
* Parameters:
*	material {Material} the material
*/
JSM.Materials.prototype.AddMaterial = function (material)
{
	this.materials.push (material);
};

/**
* Function: Materials.GetDefaultMaterial
* Description: Returns the default material from the container. It is always exists.
* Returns:
*	{Material} the result
*/
JSM.Materials.prototype.GetDefaultMaterial = function ()
{
	return this.defaultMaterial;
};

/**
* Function: Materials.Count
* Description: Returns the material count of the container.
* Returns:
*	{integer} the result
*/
JSM.Materials.prototype.Count = function ()
{
	return this.materials.length;
};
