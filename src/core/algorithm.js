/**
* Function: SwapArrayValues
* Description: Swaps to array values.
* Parameters:
*	array {anything[]} the array
*	from {integer} from index
*	to {integer} to index
*/
JSM.SwapArrayValues = function (array, from, to)
{
	var temp = array[from];
	array[from] = array[to];
	array[to] = temp;
};

/**
* Function: BubbleSort
* Description: Sorts an array with bubble sort.
* Parameters:
*	array {anything[]} the array to sort
*	onCompare {function} the compare function
*	onSwap {function} the swap function
*/
JSM.BubbleSort = function (array, onCompare, onSwap)
{
	if (array.length < 2) {
		return false;
	}

	var compareFunction = onCompare;
	if (compareFunction === undefined || compareFunction === null) {
		return false;
	}
	
	var swapFunction = onSwap;
	if (swapFunction === undefined || swapFunction === null) {
		swapFunction = function (i, j) {
			JSM.SwapArrayValues (array, i, j);
		};
	}
	
	var i, j;
	for (i = 0; i < array.length - 1; i++) {
		for (j = 0; j < array.length - i - 1; j++) {
			if (!compareFunction (array[j], array[j + 1])) {
				swapFunction (j, j + 1);
			}
		}
	}
	
	return true;
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
