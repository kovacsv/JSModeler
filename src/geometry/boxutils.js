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

/**
* Function: IsCoordInBox
* Description: Determines if a coordinate is inside a box.
* Parameters:
*	coord {Coord} the coordinate
*	box {Box} the box
* Returns:
*	{boolean} the result
*/
JSM.IsCoordInBox = function (coord, box)
{
	if (JSM.IsLower (coord.x, box.min.x) || JSM.IsLower (coord.y, box.min.y) || JSM.IsLower (coord.z, box.min.z)) {
		return false;
	}
	if (JSM.IsGreater (coord.x, box.max.x) || JSM.IsGreater (coord.y, box.max.y) || JSM.IsGreater (coord.z, box.max.z)) {
		return false;
	}
	return true;
};
