/**
* Class: AsyncEnvironment
* Description: Environment for asynchronous calls.
* Parameters:
*	parameters {object} callback functions for calls (onStart, onProcess, onFinish)
*/
JSM.AsyncEnvironment = function (parameters)
{
	this.parameters = parameters;
};

/**
* Function: AsyncEnvironment.OnStart
* Description: Calls the onStart callback of the environment.
* Parameters:
*	taskCount {integer} count of all tasks
*	userData {anything} task specific data
*/
JSM.AsyncEnvironment.prototype.OnStart = function (taskCount, userData)
{
	if (this.parameters !== undefined && this.parameters.onStart !== undefined) {
		this.parameters.onStart (taskCount, userData);
	}
};

/**
* Function: AsyncEnvironment.OnProcess
* Description: Calls the onProcess callback of the environment.
* Parameters:
*	currentTask {integer} number of the current task
*	userData {anything} task specific data
*/
JSM.AsyncEnvironment.prototype.OnProcess = function (currentTask, userData)
{
	if (this.parameters !== undefined && this.parameters.onProcess !== undefined) {
		this.parameters.onProcess (currentTask, userData);
	}
};

/**
* Function: AsyncEnvironment.OnFinish
* Description: Calls the onFinish callback of the environment.
* Parameters:
*	result {anything} the result of the operation
*	userData {anything} task specific data
*/
JSM.AsyncEnvironment.prototype.OnFinish = function (userData)
{
	if (this.parameters !== undefined && this.parameters.onFinish !== undefined) {
		this.parameters.onFinish (userData);
	}
};

/**
* Function: AsyncRunTask
* Description:
*	Calls a function multiple times asynchronously. If the environment
*	is not specified, it will run synchronously.
* Parameters:
*	taskFunction {function} the function to run
*	environment {AsyncEnvironment} environment with callbackss
*	runCount {integer} the count of runs
*	timeout {integer} the timeout between runs
*	userData {anything} task specific data
*/
JSM.AsyncRunTask = function (taskFunction, environment, runCount, timeout, userData)
{
	function Finished ()
	{
		environment.OnFinish (userData);
	}

	function RunTask (counter)
	{
		var needContinue = taskFunction ();
		environment.OnProcess (counter, userData);
		if (needContinue && counter < runCount - 1) {
			setTimeout (function () {
				RunTask (counter + 1);
			}, timeout);
			return;
		}
		setTimeout (function () {
			Finished ();
		}, timeout);
	}
	
	if (environment === undefined || environment === null) {
		var i, needContinue;
		for (i = 0; i < runCount; i++) {
			needContinue = taskFunction ();
			if (!needContinue) {
				break;
			}
		}
		return;
	}
	
	environment.OnStart (runCount, userData);
	RunTask (0);
};
