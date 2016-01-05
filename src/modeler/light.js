/**
* Class: Light
* Description:
*	Defines a directional light. The parameter structure can contain the following values:
*	ambient, diffuse, specular, direction.
* Parameters:
*	parameters {object} parameters of the light
*/
JSM.Light = function (parameters)
{
	var defaultParameters = {
		ambient : 0x7f7f7f,
		diffuse : 0x7f7f7f,
		specular : 0xffffff,
		direction : new JSM.Vector (1.0, 0.0, 0.0)
	};
	
	JSM.CopyObjectProperties (parameters, this, true);
	JSM.CopyObjectProperties (defaultParameters, this, false);
};
