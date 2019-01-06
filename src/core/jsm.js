var JSM = function ()
{
	this.mainVersion = 0;
	this.subVersion = 45;
};

/**
* Function: RandomNumber
* Description: Generates a random number between two numbers.
* Parameters:
*	from {number} lowest random result
*	to {number} highest random result
* Returns:
*	{number} the result
*/
JSM.RandomNumber = function (from, to)
{
	return Math.random () * (to - from) + from;
};

/**
* Function: RandomInt
* Description: Generates a random integer between two integers.
* Parameters:
*	from {integer} lowest random result
*	to {integer} highest random result
* Returns:
*	{integer} the result
*/
JSM.RandomInt = function (from, to)
{
	return Math.floor ((Math.random () * (to - from + 1)) + from);
};

/**
* Function: RandomBoolean
* Description: Generates a random boolean value.
* Returns:
*	{boolean} the result
*/
JSM.RandomBoolean = function ()
{
	return JSM.RandomInt (0, 1) === 1;
};

/**
* Function: SeededRandomInt
* Description: Generates a random integer between two integers. A seed number can be specified.
* Parameters:
*	from {integer} lowest random result
*	to {integer} highest random result
*	seed {integer} seed value
* Returns:
*	{integer} the result
*/
JSM.SeededRandomInt = function (from, to, seed)
{
    var random = ((seed * 9301 + 49297) % 233280) / 233280;
	return Math.floor ((random * (to - from + 1)) + from);
};

/**
* Function: ValueOrDefault
* Description: Returns the given value, or a default if it is undefined.
* Parameters:
*	val {anything} new value
*	def {anything} default value
* Returns:
*	{anything} the result
*/
JSM.ValueOrDefault = function (val, def)
{
	if (val === undefined || val === null) {
		return def;
	}
	return val;
};

/**
* Function: PrevIndex
* Description: Returns the circular previous index for an array with the given length.
* Parameters:
*	index {integer} the index
*	length {integer} the number of indices
*/
JSM.PrevIndex = function (index, length)
{
	return index > 0 ? index - 1 : length - 1;
};

/**
* Function: NextIndex
* Description: Returns the circular next index for an array with the given length.
* Parameters:
*	index {integer} the index
*	length {integer} the number of indices
*/
JSM.NextIndex = function (index, length)
{
	return index < length - 1 ? index + 1 : 0;
};

/**
* Function: CopyObjectProperties
* Description: Copies one object properties to another object.
* Parameters:
*	source {anything} source object
*	target {anything} target object
*	overwrite {boolean} overwrite existing properties
*/
JSM.CopyObjectProperties = function (source, target, overwrite)
{
	if (source === undefined || source === null ||
		target === undefined || target === null)
	{
		return;
	}

	var property;
	for (property in source) {
		if (source.hasOwnProperty (property)) {
			if (overwrite || target[property] === undefined || target[property] === null) {
				target[property] = source[property];
			}
		}
	}
};

/**
* Function: GetObjectProperty
* Description: Returns the given property of the object. If it doesn't exist, returns the given default value.
* Parameters:
*	object {anything} the object
*	propertyName {string} the name of the property
*	defaultValue {anything} the default value
*/
JSM.GetObjectProperty = function (object, propertyName, defaultValue)
{
	if (object === undefined || object === null) {
		return defaultValue;
	}

	var propertyValue = object[propertyName];
	if (propertyValue === undefined || propertyValue === null) {
		return defaultValue;
	}
	
	return propertyValue;
};

/**
* Function: Message
* Description: Writes a message to the console.
* Parameters:
*	message {string} the message
*/
JSM.Message = function (message)
{
	console.log ('JSModeler: ' + message);
};
