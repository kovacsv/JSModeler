JSM.Touch = function ()
{
	this.down = false;
	this.prevX = 0;
	this.prevY = 0;
	this.currX = 0;
	this.currY = 0;
	this.diffX = 0;
	this.diffY = 0;
};

JSM.Touch.prototype.Start = function (event, div)
{
	if (event.touches.length === 0) {
		return;
	}
	var touch = event.touches[0];

	this.down = true;
	this.SetCurrent (touch, div);
	this.prevX = this.currX;
	this.prevY = this.currY;
};

JSM.Touch.prototype.Move = function (event, div)
{
	if (event.touches.length === 0) {
		return;
	}
	var touch = event.touches[0];

	this.SetCurrent (touch, div);
	this.diffX = this.currX - this.prevX;
	this.diffY = this.currY - this.prevY;
	this.prevX = this.currX;
	this.prevY = this.currY;
};

JSM.Touch.prototype.End = function (event, div)
{
	if (event.touches.length === 0) {
		return;
	}
	var touch = event.touches[0];

	this.down = false;
	this.SetCurrent (touch, div);
};

JSM.Touch.prototype.SetCurrent = function (touch, div)
{
	this.currX = touch.pageX;
	this.currY = touch.pageY;
	if (div !== undefined) {
		this.currX = touch.pageX - div.offsetLeft;
		this.currY = touch.pageY - div.offsetTop;
	}
};
