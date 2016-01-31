JSM.RenderAmbientLight = function (color)
{
	this.color = JSM.HexColorToNormalizedRGBComponents (color);
};

JSM.RenderDirectionalLight = function (diffuse, specular, direction)
{
	this.diffuse = JSM.HexColorToNormalizedRGBComponents (diffuse);
	this.specular = JSM.HexColorToNormalizedRGBComponents (specular);
	this.direction = direction.Clone ();
};
