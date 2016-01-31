JSM.RenderLight = function (ambient, diffuse, specular, direction)
{
	this.ambient = JSM.HexColorToNormalizedRGBComponents (ambient);
	this.diffuse = JSM.HexColorToNormalizedRGBComponents (diffuse);
	this.specular = JSM.HexColorToNormalizedRGBComponents (specular);
	this.direction = direction.Clone ();
};
