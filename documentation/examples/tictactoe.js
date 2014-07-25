TicTacToe = function ()
{
	this.xSize = null;
	this.ySize = null;
	this.zSize = null;
	this.winCount = null;
	this.shapeSize = null;
	this.table = null;
	this.difficulty = null;
};

TicTacToe.prototype.Initialize = function (size, difficulty)
{
	this.xSize = size;
	this.ySize = size;
	this.zSize = size;
	this.winCount = size;
	this.shapeSize = 2;
	
	var i, j, k;
	this.table = [];
	
	for (k = 0; k < this.zSize; k++) {
		this.table.push ([]);
		for (j = 0; j < this.ySize; j++) {
			this.table[k].push ([]);
			for (i = 0; i < this.xSize; i++) {	
				this.table[k][j].push (0)
			}
		}
	}
	
	this.difficulty = difficulty;
};

TicTacToe.prototype.GetDifficulty = function ()
{
	return this.difficulty;
};

TicTacToe.prototype.IndexToDimensions = function (index)
{
	var itemPerRow = this.xSize * this.ySize;
	var i = index % this.xSize;
	var k = Math.floor (index / itemPerRow);
	var j = Math.floor ((index - (itemPerRow * k) - i) / this.xSize);
	return [i, j, k];
};

TicTacToe.prototype.DimensionsToIndex = function (dimensions)
{
	var itemPerRow = this.xSize * this.ySize;
	return itemPerRow * dimensions[2] + this.xSize * dimensions[1] + dimensions[0];
};

TicTacToe.prototype.GetPlayerWithIndex = function (index)
{
	var ijk = this.IndexToDimensions (index)
	return this.GetPlayerWithDimensions (ijk[0], ijk[1], ijk[2]);
};

TicTacToe.prototype.GetPlayerWithDimensions = function (i, j, k)
{
	return this.table[i][j][k];
};

TicTacToe.prototype.StepWithIndex = function (player, index)
{
	var ijk = this.IndexToDimensions (index)
	this.StepWithDimensions (player, ijk[0], ijk[1], ijk[2]);
};

TicTacToe.prototype.StepWithDimensions = function (player, i, j, k)
{
	this.table[i][j][k] = player;
};

TicTacToe.prototype.GetWinner = function ()
{
	var i, j, k;
	var current, count;
	var drawn = true;
	for (k = 0; k < this.zSize; k++) {
		for (j = 0; j < this.ySize; j++) {
			for (i = 0; i < this.xSize; i++) {
				current = this.table[i][j][k];
				if (current == 0) {
					drawn = false;
					continue;
				}
				count = this.CountItems (current, i, j, k);
				if (count[1] + 1 == this.winCount) {
					return current;
				}
			}
		}
	}
	
	if (drawn) {
		return 0;
	}
	return -1;
};

TicTacToe.prototype.CalculateComputerStep = function ()
{
	var i, j, k;
	var points = [];
	
	for (k = 0; k < this.zSize; k++) {
		points.push ([]);
		for (j = 0; j < this.ySize; j++) {
			points[k].push ([]);
			for (i = 0; i < this.xSize; i++) {	
				points[k][j].push (0)
			}
		}
	}		
	
	var max = -1;
	for (k = 0; k < this.zSize; k++) {
		for (j = 0; j < this.ySize; j++) {
			for (i = 0; i < this.xSize; i++) {
				count = this.GetItemPoints (i, j, k);
				points[i][j][k] = count;
				if (count > max) {
					max = count;
				}
			}
		}
	}
	
	var maxItems = [];
	for (k = 0; k < this.zSize; k++) {
		for (j = 0; j < this.ySize; j++) {
			for (i = 0; i < this.xSize; i++) {
				if (points[i][j][k] == max) {
					maxItems.push ([i, j, k]);
				}
			}
		}
	}

	var hash = window.location.hash.substr (1);
	var selected = 0;
	if (hash != 'norandom') {
		selected = JSM.RandomInt (0, maxItems.length - 1);
	}
	return this.DimensionsToIndex (maxItems[selected]);
};

TicTacToe.prototype.GetItemPoints = function (i, j, k)
{
	var result = 0;
	
	var current = this.table[i][j][k];
	if (current != 0) {
		return result;
	}
	
	var counts1, count1, maxCount1;
	var counts2, count2, maxCount2;
	
	counts1 = this.CountItems (1, i, j, k);
	count1 = counts1[0];
	maxCount1 = counts1[1];
	
	if (this.difficulty == 0) {
		// do nothing
	} else if (this.difficulty == 1) {
		if (maxCount1 == this.winCount - 1) {
			count1 += 1000;
		}
	} else if (this.difficulty == 2) {
		if (maxCount1 == this.winCount - 2) {
			count1 += 500;
		} if (maxCount1 == this.winCount - 1) {
			count1 += 1000;
		}
	}

	counts2 = this.CountItems (2, i, j, k);
	count2 = counts2[0];
	maxCount2 = counts2[1];
	if (maxCount2 == this.winCount - 1) {
		count2 += 2000;
	}
	
	result = count1;
	if (count2 > count1) {
		result = count2;
	}

	return result;
};

TicTacToe.prototype.CountItems = function (item, i, j, k)
{
	var count = 0;
	var maxCount = 0;
	
	var currentCount;
	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, 0, 0);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 0, 1, 0);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 0, 0, 1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, 1, 0);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, -1, 0);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, 0, 1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, 0, -1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 0, 1, 1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 0, 1, -1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, 1, 1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, -1, 1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, 1, -1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	currentCount = this.CountSameItemsInDirection (item, i, j, k, 1, -1, -1);
	if (currentCount > maxCount) {
		maxCount = currentCount;
	}
	count += currentCount;

	return [count, maxCount];
};

TicTacToe.prototype.CountSameItemsInDirection = function (item, i, j, k, iStep, jStep, kStep)
{
	var count = 0;
	var iCurr, jCurr, kCurr;
	
	iCurr = i + iStep;
	jCurr = j + jStep;
	kCurr = k + kStep;
	while (iCurr < this.xSize && jCurr < this.ySize && kCurr < this.zSize && iCurr >= 0 && jCurr >= 0 && kCurr >= 0) {
		if (this.table[iCurr][jCurr][kCurr] != item) {
			break;
		}
		count = count + 1;
		iCurr = iCurr + iStep;
		jCurr = jCurr + jStep;
		kCurr = kCurr + kStep;
	}
	
	iCurr = i - iStep;
	jCurr = j - jStep;
	kCurr = k - kStep;
	while (iCurr < this.xSize && jCurr < this.ySize && kCurr < this.zSize && iCurr >= 0 && jCurr >= 0 && kCurr >= 0) {
		if (this.table[iCurr][jCurr][kCurr] != item) {
			break;
		}
		count = count + 1;
		iCurr = iCurr - iStep;
		jCurr = jCurr - jStep;
		kCurr = kCurr - kStep;
	}

	return count;
}
