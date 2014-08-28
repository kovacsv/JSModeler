/**
* Class: Light
* Description:
*	Defines a directional light. The parameter structure can contain the following values:
*	ambient, diffuse, specular, direction.
* Parameters:
*	parameters {array} parameters of the light
*/
JSM.Light = function (parameters)
{
	var theParameters = {
		ambient : 0x7f7f7f,
		diffuse : 0x7f7f7f,
		specular : 0x000000,
		direction : new JSM.Vector (1.0, 0.0, 0.0)
	};

	if (parameters !== undefined && parameters != null) {
		theParameters.ambient = JSM.ValueOrDefault (parameters.ambient, theParameters.ambient);
		theParameters.diffuse = JSM.ValueOrDefault (parameters.diffuse, theParameters.diffuse);
		theParameters.specular = JSM.ValueOrDefault (parameters.specular, theParameters.specular);
		theParameters.direction = JSM.ValueOrDefault (parameters.direction, theParameters.direction);
	}
	
	this.ambient = theParameters.ambient;
	this.diffuse = theParameters.diffuse;
	this.specular = theParameters.specular;
	this.direction = theParameters.direction;
};
