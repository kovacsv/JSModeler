/**
* Function: BubbleSort
* Description: Sorts an array with bubble sort.
* Parameters:
*	array {anything[]} the array to sort
*	compare {function} the compare function
*/
JSM.BubbleSort = function (array, compare)
{
	function SwapArrayValues (array, from, to)
	{
		var temp = array[from];
		array[from] = array[to];
		array[to] = temp;
	}

	if (array.length < 2 || compare === undefined || compare === null) {
		return;
	}

	var i, j;
	for (i = 0; i < array.length - 1; i++) {
		for (j = 0; j < array.length - i - 1; j++) {
			if (!compare (array[j], array[j + 1])) {
				SwapArrayValues (array, j, j + 1);
			}
		}
	}
};

/**
* Function: ShiftArray
* Description: Shifts an array.
* Parameters:
*	array {anything[]} the array to shift
*	count {integer} shift count
*/
JSM.ShiftArray = function (array, count)
{
	var i;
	for (i = 0; i < count; i++) {
		array.push (array.shift ());
	}
};
