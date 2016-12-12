JSM.LoadTextFile = function (fileName, onReady)
{
	var request = new XMLHttpRequest ();
	request.overrideMimeType ('text/csv');
	request.open ('GET', fileName, true);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			onReady (request.responseText);
		}
	};
	request.send (null);
};

