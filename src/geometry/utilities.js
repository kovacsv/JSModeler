/**
* Function: GetGaussianCParameter
* Description:
*	Calculates the gaussian functions c parameter which can be used
*	for the gaussian function to reach epsilon at a given value.
* Parameters:
*	x {number} the value
*	a {number} the a parameter of the function
*	b {number} the b parameter of the function
*	epsilon {number} the epsilon value
* Returns:
*	{number} the c parameter of the function
*/
JSM.GetGaussianCParameter = function (x, a, b, epsilon)
{
	return Math.sqrt (-(Math.pow (x - b, 2.0) / (2.0 * Math.log (epsilon / Math.abs (a)))));
};

/**
* Function: GetGaussianValue
* Description: Calculates the gaussian functions value.
* Parameters:
*	x {number} the value
*	a {number} the a parameter of the function
*	b {number} the b parameter of the function
*	c {number} the c parameter of the function
* Returns:
*	{number} the result
*/
JSM.GetGaussianValue = function (x, a, b, c)
{
	return a * Math.exp (-(Math.pow (x - b, 2.0) / (2.0 * Math.pow (c, 2.0))));
};
