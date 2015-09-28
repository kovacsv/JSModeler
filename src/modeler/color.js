/**
* Function: HexColorToRGBComponents
* Description: Converts hex color strings to RGB components.
* Parameters:
*	hexColor {string} the hex color
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
* Function: HexColorToNormalizedRGBComponents
* Description: Converts hex color strings to normalized (between 0.0 and 1.0) RGB components.
* Parameters:
*	hexColor {string} the hex color
* Returns:
*	{number[3]} the RGB components
*/
JSM.HexColorToNormalizedRGBComponents = function (hexColor)
{
	var rgb = JSM.HexColorToRGBComponents (hexColor);
	return [rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0];
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
* Function: RGBComponentsToHexColor
* Description: Converts RGB components to hex color.
* Parameters:
*	red {integer} the red component
*	green {integer} the green component
*	blue {integer} the blue component
* Returns:
*	{integer} the hex value
*/
JSM.RGBComponentsToHexColor = function (red, green, blue)
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
