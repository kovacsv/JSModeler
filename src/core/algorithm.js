/**
* Function: BubbleSort
* Description: Sorts an array with bubble sort.
* Parameters:
*	array {anything[]} the array to sort
*	compare {function} the compare functions
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
