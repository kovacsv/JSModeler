/**
* Function: IsWebGLEnabled
* Description: Returns if WebGL is enabled in the browser.
* Returns:
*	{boolean} the result
*/
JSM.IsWebGLEnabled = function (value)
{
	if (!window.WebGLRenderingContext) {
		return false;
	}
	
	try {
		var canvas = document.createElement ('canvas');
		if (!canvas.getContext ('experimental-webgl') && !canvas.getContext ('webgl')) {
			return false;
		}
	} catch (exception) {
		return false;
	}
	
	return true;
};

/**
* Function: IsFileApiEnabled
* Description: Returns if file api is enabled in the browser.
* Returns:
*	{boolean} the result
*/
JSM.IsFileApiEnabled = function (value)
{
	if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
		return false;
	}
	
	return true;
};
