StepHandler = function ()
{

};

StepHandler.prototype =
{
	GetStep : function ()
	{
		var hash = window.location.hash.substr (1);
		if (hash.length != 0) {
			return parseInt (hash);
		}
		return 0;
	},
	
	Previous : function ()
	{
		var step = this.GetStep ();
		if (step == 0) {
			return;
		}
		window.location.hash = step - 1;
	},

	Next : function ()
	{
		var step = this.GetStep ();
		window.location.hash = step + 1;
	}
};
