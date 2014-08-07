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
* Function: Timer.Start
* Description: Starts the timer.
*/
JSM.Timer.prototype.Start = function ()
{
	var date = new Date ();
	this.start = date.getTime ();
};

/**
* Function: Timer.Stop
* Description: Stops the timer.
*/
JSM.Timer.prototype.Stop = function ()
{
	var date = new Date ();
	this.end = date.getTime ();
};

/**
* Function: Timer.Result
* Description: Returns the time between start and stop.
* Returns:
*	{number} The result.
*/
JSM.Timer.prototype.Result = function ()
{
	return (this.end - this.start);
};

/**
* Class: FPSCounter
* Description:
*	Utility class for FPS count. It calculates the frames and returns FPS count for the last interval
*	with the given length. The Get function should called in every frame.
*/
JSM.FPSCounter = function ()
{
	this.start = null;
	this.frames = null;
	this.current = null;
};

/**
* Function: FPSCounter.Get
* Description: Returns the FPS count for the last interval with the given length.
* Parameters:
*	interval {integer} the interval length in milliseconds
* Returns:
*	{integer} The result.
*/
JSM.FPSCounter.prototype.Get = function (interval)
{
	var date = new Date ();
	var end = date.getTime ();
	if (this.start === null) {
		this.start = end;
		this.frames = 0;
		this.current = 0;
	}

	if (interval === null || interval === undefined) {
		interval = 1000;
	}
	
	this.frames = this.frames + 1;
	var elapsed = end - this.start;
	if (elapsed >= interval) {
		this.current = 1000 * (this.frames / elapsed);
		this.start = end;
		this.frames = 0;
	}

	return parseInt (this.current, 10);
};
