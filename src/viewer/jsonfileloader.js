JSM.JSONFileLoader = function (onReady)
{
	this.onReady = onReady;
};

JSM.JSONFileLoader.prototype.Load = function (fileName)
{
	var myThis = this;
	var request = new XMLHttpRequest ();
	request.overrideMimeType ('application/json');
	request.open ('GET', fileName, true);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			myThis.OnReady (request.responseText);
		}
	};
	request.send (null);
};

JSM.JSONFileLoader.prototype.OnReady = function (responseText)
{
	if (this.onReady === null) {
		return;
	}
	
	var jsonData = JSON.parse (responseText);
	this.onReady (jsonData);
};
