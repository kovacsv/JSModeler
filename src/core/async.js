/**
* Function: AsyncRunTask
* Description:
*	Calls a function multiple times asynchronously. If the environment
*	is not specified, it will run synchronously.
* Parameters:
*	taskFunction {function} the function to run
*	callbacks {object} callbacks for start, process, and finish
*	runCount {integer} the count of runs
*	timeout {integer} the timeout between runs
*	userData {anything} task specific data
*/
JSM.AsyncRunTask = function (taskFunction, callbacks, runCount, timeout, userData)
{
	function OnStart (runCount, userData, callbacks)
	{
		if (callbacks.onStart !== undefined && callbacks.onStart !== null) {
			callbacks.onStart (runCount, userData);
		}
	}

	function OnProgress (currentCount, userData, callbacks)
	{
		if (callbacks.onProgress !== undefined && callbacks.onProgress !== null) {
			callbacks.onProgress (currentCount, userData);
		}
	}
	
	function OnFinished (userData, callbacks)
	{
		if (callbacks.onFinish !== undefined && callbacks.onFinish !== null) {
			callbacks.onFinish (userData);
		}
	}

	function RunTask (currentCount, userData, callbacks)
	{
		var needContinue = taskFunction ();
		OnProgress (currentCount, userData, callbacks);
		if (needContinue && currentCount < runCount - 1) {
			setTimeout (function () {
				RunTask (currentCount + 1, userData, callbacks);
			}, timeout);
		} else {
			setTimeout (function () {
				OnFinished (userData, callbacks);
			}, timeout);
		}
	}
	
	if (callbacks === undefined || callbacks === null) {
		var i, needContinue;
		for (i = 0; i < runCount; i++) {
			needContinue = taskFunction ();
			if (!needContinue) {
				break;
			}
		}
		return;
	}
	
	OnStart (runCount, userData, callbacks);
	RunTask (0, userData, callbacks);
};
