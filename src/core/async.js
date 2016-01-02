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

	function OnProcess (counter, userData, callbacks)
	{
		if (callbacks.onProcess !== undefined && callbacks.onProcess !== null) {
			callbacks.onProcess (counter, userData);
		}
	}
	
	function OnFinished (userData, callbacks)
	{
		if (callbacks.onFinish !== undefined && callbacks.onFinish !== null) {
			callbacks.onFinish (userData);
		}
	}

	function RunTask (counter, userData, callbacks)
	{
		var needContinue = taskFunction ();
		OnProcess (counter, userData, callbacks);
		if (needContinue && counter < runCount - 1) {
			setTimeout (function () {
				RunTask (counter + 1, userData, callbacks);
			}, timeout);
			return;
		}
		setTimeout (function () {
			OnFinished (userData, callbacks);
		}, timeout);
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
