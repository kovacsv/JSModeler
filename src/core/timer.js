/**
* Class: Timer
* Description: Utility class for time measure.
*/
JSM.Timer = function ()
{
	this.start = 0;
	this.stop = 0;
};

/**
* Function: Timer->Start
* Description: Starts the timer.
*/
JSM.Timer.prototype.Start = function ()
{
	var date = new Date ();
	this.start = date.getTime ();
};

/**
* Function: Timer->Stop
* Description: Stops the timer.
*/
JSM.Timer.prototype.Stop = function ()
{
	var date = new Date ();
	this.end = date.getTime ();
};

/**
* Function: Timer->Result
* Description: Returns the time between start and stop;.
*/
JSM.Timer.prototype.Result = function ()
{
	return (this.end - this.start);
};
