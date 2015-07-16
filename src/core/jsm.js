var JSM = function () {
	this.mainVersion = 0;
	this.subVersion = 37;
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
* Function: Assert
* Description: Shows up an alert with the given message if the condition is false.
* Parameters:
*	condition {boolean} the condition to check
*	message {string} error message
*/
JSM.Assert = function (condition, message)
{
	if (!condition) {
		var alertText = 'Assertion failed.';
		if (message !== undefined && message !== null) {
			alertText += ' ' + message;
		}
		alert (alertText);
	}
};
