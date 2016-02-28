HashChanger = function ()
{
	this.hashChangedCallback = null;
};

HashChanger.prototype.Init = function (hashChangedCallback)
{
	window.onhashchange = this.OnHashChange.bind (this);
	window.onkeydown = this.OnKeyDown.bind (this);
	this.hashChangedCallback = hashChangedCallback;
	this.hashChangedCallback ();
};

HashChanger.prototype.GetHashIndex = function ()
{
	var hashIndex = 0;
	var hashString = window.location.hash;
	if (hashString.length > 0) {
		hashIndex = parseInt (hashString.substr (1), 10);
	}
	if (isNaN (hashIndex)) {
		hashIndex = 0;
	}
	return hashIndex;
};

HashChanger.prototype.OnHashChange = function (event)
{
	this.hashChangedCallback ();
};

HashChanger.prototype.OnKeyDown = function (event)
{
	var keyCode = event.which;
	var hash = this.GetHashIndex ();
	if (keyCode == 37) {
		hash--;
	} else if (keyCode == 39) {
		hash++;
	}
	hashString = hash.toString ();
	window.location.hash = hashString;	
};
