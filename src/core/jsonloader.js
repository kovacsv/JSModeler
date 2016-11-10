/**
* Function: LoadJsonFile
* Description: Loads a json file, and calls a callback with the parsed json.
* Parameters:
*	fileName {string} the name of the json
*	onReady {function} the callback
*/
JSM.LoadJsonFile = function (fileName, onReady)
{
	var request = new XMLHttpRequest ();
	request.overrideMimeType ('application/json');
	request.open ('GET', fileName, true);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			var jsonData = JSON.parse (request.responseText);
			onReady (jsonData);
		}
	};
	request.send (null);
};
