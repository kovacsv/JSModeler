/**
* Function: BoxUnion
* Description: Calculates the union of two 3D boxes.
* Parameters:
*	aBox {Box} the first box
*	bBox {Box} the second box
* Returns:
*	{Box} the result
*/
JSM.BoxUnion = function (aBox, bBox)
{
	var min = new JSM.Coord (JSM.Minimum (aBox.min.x, bBox.min.x), JSM.Minimum (aBox.min.y, bBox.min.y), JSM.Minimum (aBox.min.z, bBox.min.z));
	var max = new JSM.Coord (JSM.Maximum (aBox.max.x, bBox.max.x), JSM.Maximum (aBox.max.y, bBox.max.y), JSM.Maximum (aBox.max.z, bBox.max.z));
	return new JSM.Box (min, max);
};
