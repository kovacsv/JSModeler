JSM.Mouse = function ()
{
	this.down = false;
	this.button = 0;
	this.shift = false;
	this.ctrl = false;
	this.alt = false;
	this.prev = new JSM.Coord2D (0, 0);
	this.curr = new JSM.Coord2D (0, 0);
	this.diff = new JSM.Coord2D (0, 0);
};

JSM.Mouse.prototype.Down = function (event, div)
{
	var eventParameters = event || window.event;

	this.down = true;
	this.button = event.which;
	this.shift = event.shiftKey;
	this.ctrl = event.ctrlKey;
	this.alt = event.altKey;
	
	this.SetCurrent (eventParameters, div);
	this.prev = this.curr.Clone ();
};

JSM.Mouse.prototype.Move = function (event, div)
{
	var eventParameters = event || window.event;
	
	this.shift = event.shiftKey;
	this.ctrl = event.ctrlKey;
	this.alt = event.altKey;
	
	this.SetCurrent (eventParameters, div);
	this.diff = JSM.CoordSub2D (this.curr, this.prev);
	this.prev = this.curr.Clone ();
};

JSM.Mouse.prototype.Up = function (event, div)
{
	var eventParameters = event || window.event;
	
	this.down = false;
	this.SetCurrent (eventParameters, div);
};

JSM.Mouse.prototype.Out = function (event, div)
{
	var eventParameters = event || window.event;
	
	this.down = false;
	this.SetCurrent (eventParameters, div);
};

JSM.Mouse.prototype.SetCurrent = function (eventParameters, div)
{
	var currX = eventParameters.clientX;
	var currY = eventParameters.clientY;
	if (div.getBoundingClientRect !== undefined) {
		var clientRect = div.getBoundingClientRect ();
		currX -= clientRect.left;
		currY -= clientRect.top;
	}
	if (window.pageXOffset !== undefined && window.pageYOffset !== undefined) {
		currX += window.pageXOffset;
		currY += window.pageYOffset;
	}
	this.curr = new JSM.Coord2D (currX, currY);
};
