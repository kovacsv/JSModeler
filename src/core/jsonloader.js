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
